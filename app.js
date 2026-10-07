(function () {
  "use strict";

  const Data = window.CoachData;
  const Store = window.CoachState;
  const app = document.getElementById("app");
  const toast = document.getElementById("toast");
  const clueDialog = document.getElementById("clue-dialog");
  const params = new URLSearchParams(location.search);
  const now = params.get("date") ? new Date(`${params.get("date")}T12:00:00`) : new Date();
  const today = Store.dateKey(now);
  const started = new Set();
  let state = Store.load();
  let activeTab = state.ui.activeTab || "home";
  let selectedRestaurant = "publix";
  let rescueCategory = "food";
  let rescueActionIndex = 0;
  let reviewDraft = currentReview();

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function itemId(group, item) {
    return `${group}:${item}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function dayIndex() {
    return Math.floor(new Date(`${today}T12:00:00`).getTime() / 86400000);
  }

  function isWeekday() {
    const day = now.getDay();
    return day !== 0 && day !== 6;
  }

  function save(next) {
    state = Store.save(next);
    updateHeader();
  }

  function updateHeader() {
    const info = Store.storyInfo(state);
    document.getElementById("date-line").textContent = now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    document.getElementById("chapter-label").textContent = info.caseComplete
      ? "Case complete"
      : `Chapter ${info.chapter}`;
    document.getElementById("chapter-progress").textContent = info.caseComplete
      ? `${info.caseTarget} clues`
      : `${info.inChapter} / ${info.chapterLength}`;
    document.querySelectorAll(".tabs button").forEach((button) => {
      const current = button.dataset.tab === activeTab;
      if (current) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2800);
  }

  function flattenClues() {
    return Data.chapters.flatMap((chapter, chapterIndex) =>
      chapter.clues.map((text, clueIndex) => ({
        text,
        chapterIndex,
        clueIndex,
        title: chapter.title,
      })),
    );
  }

  function revealClue(index) {
    const clue = flattenClues()[index];
    if (!clue) return;
    document.getElementById("clue-title").textContent = clue.title;
    document.getElementById("clue-text").textContent = clue.text;
    if (typeof clueDialog.showModal === "function") clueDialog.showModal();
    else showToast(clue.text);
  }

  function chosenRoutine(type) {
    const list = Data.routines[type];
    const offset = Number(state.ui.swaps[type]) || 0;
    return list[(Math.abs(dayIndex()) + offset) % list.length];
  }

  function routineCard(type, title, time, optional) {
    const routine = chosenRoutine(type);
    const done = Store.hasCompletion(state, type, now);
    const open = started.has(type);
    return `
      <article class="card ${done ? "moss" : ""}">
        <div class="card-head">
          <h3>${escapeHtml(title)}</h3>
          <span class="time">${escapeHtml(time)}</span>
        </div>
        ${optional ? '<p class="eyebrow">OPTIONAL WHEN OPENED</p>' : ""}
        <p class="suggestion">${escapeHtml(routine.title)}</p>
        ${open ? `<p class="detail">${escapeHtml(routine.detail)}</p>` : ""}
        ${done
          ? '<p class="status-line"><span class="status-dot"></span>Completed today</p>'
          : `<div class="actions">
              ${open
                ? `<button class="complete" data-complete="${type}" data-label="${escapeHtml(routine.title)}">Complete</button>`
                : `<button class="primary" data-start="${type}">Start</button>`}
              <button data-swap="${type}">Swap</button>
              <button data-unstick="${type}">Unstick</button>
            </div>`}
      </article>
    `;
  }

  function waterCard(type, meal) {
    const done = Store.hasCompletion(state, type, now);
    return `
      <article class="card subtle">
        <div class="card-head">
          <h3>Water with ${meal}</h3>
          <span class="time">No ounces</span>
        </div>
        <p class="suggestion">Fill your usual bottle or drink some water.</p>
        ${done
          ? '<p class="status-line"><span class="status-dot"></span>Done today</p>'
          : `<div class="actions"><button class="primary" data-complete="${type}" data-label="Water with ${meal}">Done</button></div>`}
      </article>
    `;
  }

  function todaysQuote() {
    const list = Data.quotes || [];
    if (!list.length) return { text: "The minimum is enough for today.", attribution: "Small Steps" };
    return list[Math.abs(dayIndex()) % list.length];
  }

  function homeView() {
    const info = Store.storyInfo(state);
    const weekend = !isWeekday();
    const quote = todaysQuote();
    return `
      <section class="view">
        <article class="quote-card" aria-label="Today’s quote">
          <p class="eyebrow">TODAY’S QUOTE</p>
          <p class="quote-text">“${escapeHtml(quote.text)}”</p>
          <p class="quote-attribution">${escapeHtml(quote.attribution || "Small Steps")}</p>
        </article>
        <div class="section-heading">
          <p class="eyebrow">${weekend ? "WEEKEND · FOOD PROMPTS ONLY" : "TODAY’S SMALL STEPS"}</p>
          <h2>One suggestion at a time</h2>
          <p class="muted">The minimum counts. Ignoring anything records nothing.</p>
        </div>
        <div class="notice">
          <strong>${info.caseComplete ? "The case is complete." : "A new clue is waiting."}</strong>
          ${info.caseComplete
            ? "Your progress remains yours. The next case can wait."
            : "Complete any approved action to reveal it."}
        </div>
        <div class="grid two">
          ${routineCard("breakfast", "Breakfast", "7:00 am", false)}
          ${waterCard("water-breakfast", "breakfast")}
          ${routineCard("movement", "Movement", "8:00 am", weekend)}
          ${routineCard("lunch", "Main meal", "1:00–1:30 pm", false)}
          ${waterCard("water-lunch", "lunch")}
          ${routineCard("evening", "Small meal", "7:00 pm · no alert", false)}
        </div>
        ${isWeekday()
          ? `<div class="section-heading"><h2>Outlook</h2><p class="muted">A weekday extra, never a test of positivity.</p></div>
             ${routineCard("outlook", "Tiny outlook mission", "Morning or midday", false)}`
          : `<div class="section-heading"><h2>Optional outlook</h2><p class="muted">It appears because you opened the coach; no alert was sent.</p></div>
             ${routineCard("outlook", "Tiny outlook mission", "Open-only", true)}`}
      </section>
    `;
  }

  function groceryGroups() {
    return Data.groceries.map((group) => `
      <section class="card">
        <div class="card-head"><h3>${escapeHtml(group.name)}</h3></div>
        <div class="check-list">
          ${group.items.map((item) => {
            const id = itemId(group.name, item);
            const checked = Boolean(state.grocery.checked[id]);
            const low = Boolean(state.grocery.low[id]);
            return `
              <div class="check-row">
                <label class="grocery-check">
                  <input type="checkbox" data-grocery-check="${id}" ${checked ? "checked" : ""}>
                  <span>${escapeHtml(item)}</span>
                </label>
                <button type="button" class="low-button" data-grocery-low="${id}" aria-pressed="${low}">
                  ${low ? "On list" : "Running low"}
                </button>
              </div>
            `;
          }).join("")}
        </div>
      </section>
    `).join("");
  }

  function planView() {
    const restaurant = Data.restaurants.find((item) => item.id === selectedRestaurant) || Data.restaurants[0];
    return `
      <section class="view">
        <div class="section-heading">
          <p class="eyebrow">PUBLIX OR TRADER JOE’S FIRST</p>
          <h2>Plan ahead</h2>
          <p class="muted">Use what is already stocked. Premade choices come before restaurant menus.</p>
        </div>
        <div class="notice">
          <strong>Simple label rule</strong>
          Nuts, asparagus, wine, and added sulfites stay out. Egg and ranch are fine occasionally.
          Skip almonds in snack boxes. Check dried fruit for sulfur dioxide.
        </div>
        <div class="grid two">${groceryGroups()}</div>
        <div class="actions">
          <button class="primary" data-complete="restock" data-label="Restocked an approved backup">
            I restocked a backup
          </button>
        </div>
        <div class="section-heading">
          <h2>Eating out</h2>
          <p class="muted">These are lower-risk defaults, not safety guarantees.</p>
        </div>
        <label>
          Restaurant or store
          <select id="restaurant-select">
            ${Data.restaurants.map((item) =>
              `<option value="${item.id}" ${item.id === restaurant.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`,
            ).join("")}
          </select>
        </label>
        <article class="card restaurant-order">
          <p class="eyebrow">SAY THIS ORDER</p>
          <h3>${escapeHtml(restaurant.order)}</h3>
          <p class="caution">${escapeHtml(restaurant.note)}</p>
        </article>
      </section>
    `;
  }

  function rescuePlan() {
    const plan = Data.rescue[rescueCategory];
    const action = plan.actions[rescueActionIndex % plan.actions.length];
    const thought = document.getElementById("harsh-thought")?.value.trim() || "";
    const reframe = thought
      ? `Accurate version: “I’m having the thought that ${thought}. This hurts, but it is not a final verdict about me or what happens next.”`
      : "Accurate version: “This is a painful moment. It does not have to become a verdict about me or the rest of the day.”";
    return `
      <article class="card warm" id="rescue-plan">
        <div class="card-head"><h3>${escapeHtml(plan.title)}</h3></div>
        <div class="steps">
          <p class="step">${escapeHtml(plan.grounding)}</p>
          ${rescueCategory === "emotional" ? `<p class="step">${escapeHtml(reframe)}</p>` : ""}
          <p class="step">${escapeHtml(action)}</p>
        </div>
        <div class="actions" style="margin-top:14px">
          <button data-new-rescue>Pick another tiny action</button>
          <button class="complete" data-complete="rescue" data-label="Used Unstick me">This helped enough</button>
        </div>
      </article>
    `;
  }

  function unstickView() {
    return `
      <section class="view">
        <div class="section-heading">
          <p class="eyebrow">NO LECTURE · ONE NEXT STEP</p>
          <h2>Unstick me</h2>
          <p class="muted">Choose the kind of friction, or let the first option stand.</p>
        </div>
        <div class="category-buttons">
          ${Object.entries(Data.rescue).map(([id, item]) =>
            `<button data-rescue-category="${id}" aria-pressed="${id === rescueCategory}">${escapeHtml(item.title)}</button>`,
          ).join("")}
        </div>
        ${rescueCategory === "emotional"
          ? `<label>
               Optional: the harsh thought in a few words
               <textarea id="harsh-thought" placeholder="For example: I ruined everything"></textarea>
             </label>
             <button data-refresh-reframe>Use these words</button>`
          : ""}
        ${rescuePlan()}
        <p class="muted small">This scripted tool is not medical or crisis care. If you may be in immediate danger, contact local emergency services or a trusted person now.</p>
      </section>
    `;
  }

  function storyView() {
    const info = Store.storyInfo(state);
    const clues = flattenClues().slice(0, Math.min(info.total, info.caseTarget));
    const recent = clues.slice(Math.max(0, clues.length - 12)).reverse();
    return `
      <section class="view">
        <div class="section-heading">
          <p class="eyebrow">THE LANTERN ROOM</p>
          <h2>${info.caseComplete ? "Case complete" : Data.chapters[info.chapter - 1].title}</h2>
          <p class="muted">${info.total} of ${info.caseTarget} clues revealed. Nothing can remove them.</p>
        </div>
        <div class="progress" aria-label="${info.total} of ${info.caseTarget} clues">
          <span style="width:${Math.min(100, (info.total / info.caseTarget) * 100)}%"></span>
        </div>
        ${choiceBlocks(info)}
        ${info.total >= 12 && !state.story.paceFeedback
          ? `<article class="card subtle">
               <h3>How did the first chapter’s pace feel?</h3>
               <div class="actions" style="margin-top:12px">
                 <button data-pace="fast">A little fast</button>
                 <button data-pace="right">About right</button>
                 <button data-pace="slow">A little slow</button>
               </div>
             </article>`
          : ""}
        ${info.caseComplete
          ? `<article class="card moss">
               <p class="eyebrow">CASE MILESTONE</p>
               <h3>One small-purchase reward is available.</h3>
               <p class="detail">Choose it yourself. The coach will not suggest a product.</p>
               <div class="actions" style="margin-top:12px">
                 <button class="complete" data-claim-reward ${state.story.rewardClaimed ? "disabled" : ""}>
                   ${state.story.rewardClaimed ? "Reward marked used" : "Mark reward used"}
                 </button>
               </div>
             </article>`
          : ""}
        <div class="section-heading"><h2>Recent clues</h2></div>
        <div class="clue-list">
          ${recent.length
            ? recent.map((clue, index) => `
                <article class="clue ${index === 0 ? "latest" : ""}">
                  <p class="eyebrow">${escapeHtml(clue.title)}</p>
                  <p>${escapeHtml(clue.text)}</p>
                </article>
              `).join("")
            : '<p class="muted">Complete any approved action to reveal the first clue.</p>'}
        </div>
      </section>
    `;
  }

  function choiceBlocks(info) {
    return Data.chapters.map((chapter, index) => {
      const reached = info.total >= (index + 1) * 12;
      if (!reached) return "";
      const selected = state.story.choices[String(index + 1)] || "";
      return `
        <article class="card">
          <p class="eyebrow">CHAPTER ${index + 1} CHOICE</p>
          <h3>${escapeHtml(chapter.choice.prompt)}</h3>
          <div class="choice-set" style="margin-top:12px">
            ${chapter.choice.options.map((option) => `
              <button data-story-choice="${index + 1}" data-choice="${escapeHtml(option)}" aria-pressed="${selected === option}">
                ${escapeHtml(option)}
              </button>
            `).join("")}
          </div>
        </article>
      `;
    }).join("");
  }

  function currentReview() {
    const existing = state?.reviews?.find((item) => item.week === Store.weekKey(now));
    return existing || {
      decisionFatigue: 3,
      mood: 3,
      energy: 3,
      rescueHelped: "",
      weight: "",
      note: "",
    };
  }

  function ratingField(id, label, value) {
    return `
      <label>
        ${label}
        <span class="range-row">
          <input id="${id}" type="range" min="1" max="5" value="${escapeHtml(value)}">
          <output for="${id}">${escapeHtml(value)}</output>
        </span>
      </label>
    `;
  }

  function reviewView() {
    const gap = Store.latestRestartGap(state);
    const completedThisWeek = state.completions.filter((item) => item.date >= Store.weekKey(now)).length;
    return `
      <section class="view">
        <div class="section-heading">
          <p class="eyebrow">PRIVATE WEEKLY CHECK-IN</p>
          <h2>What is the system doing for you?</h2>
          <p class="muted">These ratings improve the design. They do not affect story progress.</p>
        </div>
        <div class="grid two">
          <article class="card"><p class="eyebrow">THIS WEEK</p><h2>${completedThisWeek}</h2><p class="muted">recorded actions</p></article>
          <article class="card"><p class="eyebrow">LATEST GAP</p><h2>${gap == null ? "—" : gap}</h2><p class="muted">${gap == null ? "more data needed" : "days between active days"}</p></article>
        </div>
        <form id="review-form" class="card grid">
          <div class="field-grid">
            ${ratingField("decision-fatigue", "Decision fatigue · 1 low, 5 high", reviewDraft.decisionFatigue)}
            ${ratingField("mood", "Outlook or mood · 1 low, 5 high", reviewDraft.mood)}
            ${ratingField("energy", "Energy · 1 low, 5 high", reviewDraft.energy)}
            ${ratingField("rescue-helped", "Unstick usefulness · 1 low, 5 high", reviewDraft.rescueHelped || 3)}
          </div>
          <label>
            Optional weekly weight · hidden here, never rewarded
            <input id="weight" type="number" inputmode="decimal" min="0" step="0.1" value="${escapeHtml(reviewDraft.weight ?? "")}">
          </label>
          <label>
            Optional note
            <textarea id="review-note" maxlength="500">${escapeHtml(reviewDraft.note || "")}</textarea>
          </label>
          <div class="actions"><button class="primary" type="submit">Save weekly review</button></div>
        </form>
      </section>
    `;
  }

  function settingsView() {
    return `
      <section class="view">
        <div class="section-heading">
          <p class="eyebrow">LOCAL AND PRIVATE</p>
          <h2>Settings and backup</h2>
          <p class="muted">Your routines, reviews, grocery list, and story progress stay in this browser.</p>
        </div>
        <article class="card grid">
          <h3>Backup your data</h3>
          <p class="muted">Export a JSON file before changing phones or clearing browser data.</p>
          <div class="actions">
            <button class="primary" data-export>Export backup</button>
            <label class="button">
              Import backup
              <input id="import-file" type="file" accept="application/json,.json" hidden>
            </label>
          </div>
        </article>
        <article class="card">
          <h3>Reminder schedule</h3>
          <p class="detail">Food: 7:00 am and 1:00 pm daily. Movement: 8:00 am weekdays. The 7:00 pm small meal has no alert.</p>
          <p class="detail">The calendar file is included locally. Reliable iPhone installation will be completed after we choose HTTPS hosting.</p>
          <div class="actions" style="margin-top:12px">
            <a class="button" href="./reminders.ics" download>Download calendar reminders</a>
          </div>
        </article>
        <article class="card danger-zone">
          <h3>Reset this device</h3>
          <p class="detail">This removes the new Small Steps data only. It does not alter any older coach data.</p>
          <div class="actions" style="margin-top:12px"><button class="danger" data-reset>Reset Small Steps</button></div>
        </article>
      </section>
    `;
  }

  function render() {
    const views = {
      home: homeView,
      plan: planView,
      unstick: unstickView,
      story: storyView,
      review: reviewView,
      settings: settingsView,
    };
    app.innerHTML = (views[activeTab] || homeView)();
    updateHeader();
  }

  function navigate(tab) {
    activeTab = tab;
    save(Store.setActiveTab(state, tab));
    render();
    app.focus({ preventScroll: true });
  }

  function handleComplete(button) {
    const type = button.dataset.complete;
    const label = button.dataset.label || type;
    const before = Store.storyInfo(state);
    const result = Store.complete(state, type, label, now);
    save(result.state);
    started.delete(type);
    render();
    if (!result.added) {
      showToast("Already recorded today. Your first result stays.");
      return;
    }
    showToast("Recorded. The minimum counts.");
    if (!before.caseComplete && result.clueIndex != null) revealClue(result.clueIndex);
  }

  document.querySelector(".tabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab]");
    if (button) navigate(button.dataset.tab);
  });

  document.getElementById("close-clue").addEventListener("click", () => clueDialog.close());

  app.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.start) {
      started.add(button.dataset.start);
      render();
    } else if (button.dataset.swap) {
      const type = button.dataset.swap;
      const offset = (Number(state.ui.swaps[type]) || 0) + 1;
      save(Store.setSwap(state, type, offset));
      started.delete(type);
      render();
    } else if (button.dataset.unstick) {
      rescueCategory = button.dataset.unstick === "lunch" || button.dataset.unstick === "breakfast" || button.dataset.unstick === "evening"
        ? "food"
        : button.dataset.unstick === "movement" ? "movement" : "emotional";
      navigate("unstick");
    } else if (button.dataset.complete) {
      handleComplete(button);
    } else if (button.dataset.groceryLow) {
      const id = button.dataset.groceryLow;
      save(Store.setGroceryLow(state, id, !state.grocery.low[id]));
      render();
    } else if (button.dataset.rescueCategory) {
      rescueCategory = button.dataset.rescueCategory;
      rescueActionIndex = 0;
      render();
    } else if (button.hasAttribute("data-new-rescue")) {
      rescueActionIndex += 1;
      render();
    } else if (button.hasAttribute("data-refresh-reframe")) {
      const text = document.getElementById("harsh-thought")?.value || "";
      const plan = document.getElementById("rescue-plan");
      if (plan) {
        const holder = document.createElement("div");
        holder.innerHTML = rescuePlan();
        plan.replaceWith(holder.firstElementChild);
        const input = document.getElementById("harsh-thought");
        if (input) input.value = text;
      }
    } else if (button.dataset.storyChoice) {
      save(Store.chooseStoryPath(state, button.dataset.storyChoice, button.dataset.choice));
      render();
    } else if (button.dataset.pace) {
      const next = Store.normalize(state);
      next.story.paceFeedback = button.dataset.pace;
      save(next);
      render();
      showToast("Saved for the next case.");
    } else if (button.hasAttribute("data-claim-reward")) {
      save(Store.claimReward(state));
      render();
    } else if (button.hasAttribute("data-export")) {
      exportBackup();
    } else if (button.hasAttribute("data-reset")) {
      if (confirm("Reset all Small Steps progress on this device? This cannot be undone without a backup.")) {
        localStorage.removeItem(Store.STORAGE_KEY);
        state = Store.initialState();
        activeTab = "home";
        render();
        showToast("Small Steps was reset. Older coach data was not changed.");
      }
    }
  });

  app.addEventListener("change", (event) => {
    if (event.target.matches("[data-grocery-check]")) {
      const id = event.target.dataset.groceryCheck;
      save(Store.setGroceryChecked(state, id, event.target.checked));
      render();
    } else if (event.target.id === "restaurant-select") {
      selectedRestaurant = event.target.value;
      render();
    } else if (event.target.matches('input[type="range"]')) {
      const output = event.target.parentElement.querySelector("output");
      if (output) output.value = event.target.value;
    } else if (event.target.id === "import-file") {
      importBackup(event.target.files && event.target.files[0]);
    }
  });

  app.addEventListener("submit", (event) => {
    if (event.target.id !== "review-form") return;
    event.preventDefault();
    const form = event.target;
    reviewDraft = {
      decisionFatigue: form.querySelector("#decision-fatigue").value,
      mood: form.querySelector("#mood").value,
      energy: form.querySelector("#energy").value,
      rescueHelped: form.querySelector("#rescue-helped").value,
      weight: form.querySelector("#weight").value,
      note: form.querySelector("#review-note").value,
    };
    save(Store.saveReview(state, reviewDraft, now));
    showToast("Weekly review saved. It did not change story progress.");
    render();
  });

  function exportBackup() {
    const blob = new Blob([Store.exportJson(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `small-steps-backup-${today}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        save(Store.importJson(reader.result));
        reviewDraft = currentReview();
        render();
        showToast("Backup imported.");
      } catch (error) {
        alert(error.message);
      }
    };
    reader.readAsText(file);
  }

  render();
})();
