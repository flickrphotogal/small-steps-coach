(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CoachState = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STORAGE_KEY = "small-steps-coach-v1";
  const VERSION = 1;
  const DEFAULT_CHAPTER_LENGTH = 12;
  const CASE_CHAPTERS = 4;

  function initialState() {
    return {
      version: VERSION,
      createdAt: new Date().toISOString(),
      completions: [],
      grocery: { checked: {}, low: {} },
      reviews: [],
      story: {
        chapterLength: DEFAULT_CHAPTER_LENGTH,
        choices: {},
        rewardClaimed: false,
      },
      ui: { swaps: {}, activeTab: "home" },
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function dateKey(value) {
    const date = value instanceof Date ? value : new Date(value || Date.now());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function normalize(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) return initialState();
    const base = initialState();
    return {
      ...base,
      ...input,
      version: VERSION,
      completions: Array.isArray(input.completions) ? input.completions : [],
      grocery: {
        checked: input.grocery && input.grocery.checked && typeof input.grocery.checked === "object"
          ? input.grocery.checked
          : {},
        low: input.grocery && input.grocery.low && typeof input.grocery.low === "object"
          ? input.grocery.low
          : {},
      },
      reviews: Array.isArray(input.reviews) ? input.reviews : [],
      story: {
        ...base.story,
        ...(input.story && typeof input.story === "object" ? input.story : {}),
        choices: input.story && input.story.choices && typeof input.story.choices === "object"
          ? input.story.choices
          : {},
      },
      ui: {
        ...base.ui,
        ...(input.ui && typeof input.ui === "object" ? input.ui : {}),
        swaps: input.ui && input.ui.swaps && typeof input.ui.swaps === "object"
          ? input.ui.swaps
          : {},
      },
    };
  }

  function load(storage) {
    const target = storage || (typeof localStorage !== "undefined" ? localStorage : null);
    if (!target) return initialState();
    try {
      const raw = target.getItem(STORAGE_KEY);
      return raw ? normalize(JSON.parse(raw)) : initialState();
    } catch (_) {
      return initialState();
    }
  }

  function save(state, storage) {
    const target = storage || (typeof localStorage !== "undefined" ? localStorage : null);
    const clean = normalize(state);
    if (target) target.setItem(STORAGE_KEY, JSON.stringify(clean));
    return clean;
  }

  function storyInfo(state) {
    const total = normalize(state).completions.length;
    const chapterLength = Math.max(1, Number(state.story && state.story.chapterLength) || DEFAULT_CHAPTER_LENGTH);
    const caseTarget = chapterLength * CASE_CHAPTERS;
    const capped = Math.min(total, caseTarget);
    const chapter = capped >= caseTarget ? CASE_CHAPTERS : Math.floor(capped / chapterLength) + 1;
    const inChapter = capped >= caseTarget ? chapterLength : capped % chapterLength;
    return {
      total,
      chapter,
      inChapter,
      chapterLength,
      caseTarget,
      caseComplete: total >= caseTarget,
      nextClueIndex: Math.min(total, caseTarget - 1),
    };
  }

  function hasCompletion(state, type, when) {
    const day = dateKey(when);
    return normalize(state).completions.some((item) => item.date === day && item.type === type);
  }

  function complete(state, type, label, when) {
    const next = normalize(clone(state));
    const timestamp = when ? new Date(when) : new Date();
    const day = dateKey(timestamp);
    if (next.completions.some((item) => item.date === day && item.type === type)) {
      return { state: next, added: false, reason: "already-complete", clueIndex: null };
    }
    const before = storyInfo(next);
    const clueIndex = before.caseComplete ? null : before.nextClueIndex;
    next.completions.push({
      id: `${day}:${type}`,
      type,
      label,
      date: day,
      at: timestamp.toISOString(),
      clueIndex,
    });
    return { state: next, added: true, reason: null, clueIndex };
  }

  function setSwap(state, routine, offset) {
    const next = normalize(clone(state));
    next.ui.swaps[routine] = Math.max(0, Number(offset) || 0);
    return next;
  }

  function setActiveTab(state, tab) {
    const next = normalize(clone(state));
    next.ui.activeTab = String(tab || "home");
    return next;
  }

  function setGroceryChecked(state, id, checked) {
    const next = normalize(clone(state));
    next.grocery.checked[id] = Boolean(checked);
    if (checked) next.grocery.low[id] = false;
    return next;
  }

  function setGroceryLow(state, id, low) {
    const next = normalize(clone(state));
    next.grocery.low[id] = Boolean(low);
    if (low) next.grocery.checked[id] = false;
    return next;
  }

  function chooseStoryPath(state, chapter, choice) {
    const next = normalize(clone(state));
    next.story.choices[String(chapter)] = String(choice);
    return next;
  }

  function setChapterLength(state, length) {
    const next = normalize(clone(state));
    next.story.chapterLength = Math.min(24, Math.max(6, Number(length) || DEFAULT_CHAPTER_LENGTH));
    return next;
  }

  function claimReward(state) {
    const next = normalize(clone(state));
    if (storyInfo(next).caseComplete) next.story.rewardClaimed = true;
    return next;
  }

  function weekKey(when) {
    const date = new Date(when || Date.now());
    const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = copy.getDay() || 7;
    copy.setDate(copy.getDate() - day + 1);
    return dateKey(copy);
  }

  function saveReview(state, review, when) {
    const next = normalize(clone(state));
    const key = weekKey(when);
    const cleanReview = {
      week: key,
      savedAt: new Date(when || Date.now()).toISOString(),
      decisionFatigue: clampRating(review.decisionFatigue),
      mood: clampRating(review.mood),
      energy: clampRating(review.energy),
      rescueHelped: review.rescueHelped === "" ? "" : clampRating(review.rescueHelped),
      weight: review.weight === "" || review.weight == null ? null : Number(review.weight),
      note: String(review.note || "").slice(0, 500),
    };
    const index = next.reviews.findIndex((item) => item.week === key);
    if (index >= 0) next.reviews[index] = cleanReview;
    else next.reviews.push(cleanReview);
    return next;
  }

  function clampRating(value) {
    return Math.min(5, Math.max(1, Number(value) || 1));
  }

  function latestRestartGap(state) {
    const dates = [...new Set(normalize(state).completions.map((item) => item.date))].sort();
    if (dates.length < 2) return null;
    const previous = new Date(`${dates[dates.length - 2]}T12:00:00`);
    const latest = new Date(`${dates[dates.length - 1]}T12:00:00`);
    return Math.max(0, Math.round((latest - previous) / 86400000) - 1);
  }

  function exportJson(state) {
    return JSON.stringify(normalize(state), null, 2);
  }

  function importJson(text) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("That file is not a Small Steps backup.");
    }
    if (!Array.isArray(parsed.completions) || !parsed.story || !parsed.grocery) {
      throw new Error("That backup is missing required coach data.");
    }
    return normalize(parsed);
  }

  return {
    STORAGE_KEY,
    VERSION,
    initialState,
    normalize,
    load,
    save,
    dateKey,
    storyInfo,
    hasCompletion,
    complete,
    setSwap,
    setActiveTab,
    setGroceryChecked,
    setGroceryLow,
    chooseStoryPath,
    setChapterLength,
    claimReward,
    weekKey,
    saveReview,
    latestRestartGap,
    exportJson,
    importJson,
  };
});
