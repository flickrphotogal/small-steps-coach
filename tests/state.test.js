const test = require("node:test");
const assert = require("node:assert/strict");
const Store = require("../state.js");
const Data = require("../data.js");

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    value(key) { return values.get(key); },
  };
}

test("starts fresh without importing the penalty-based coach key", () => {
  const storage = memoryStorage({
    "weekday-coach-v1": JSON.stringify({ days: { "2026-10-06": { breakfast: "skipped" } } }),
  });
  const state = Store.load(storage);
  assert.equal(state.completions.length, 0);
  assert.equal(storage.value("weekday-coach-v1").includes("skipped"), true);
});

test("records a category once per day and never subtracts", () => {
  let state = Store.initialState();
  const first = Store.complete(state, "breakfast", "Oatmeal", "2026-10-06T07:00:00-04:00");
  assert.equal(first.added, true);
  state = first.state;

  const duplicate = Store.complete(state, "breakfast", "Smoothie", "2026-10-06T08:00:00-04:00");
  assert.equal(duplicate.added, false);
  assert.equal(duplicate.state.completions.length, 1);

  const later = Store.complete(state, "breakfast", "Smoothie", "2026-10-07T07:00:00-04:00");
  assert.equal(later.state.completions.length, 2);
});

test("story reaches four chapters and unlocks reward at 48 completions", () => {
  let state = Store.initialState();
  const types = ["breakfast", "movement", "lunch", "evening", "outlook", "water-breakfast", "water-lunch", "rescue"];
  for (let day = 1; day <= 6; day += 1) {
    for (const type of types) {
      const date = `2026-10-${String(day).padStart(2, "0")}T12:00:00`;
      state = Store.complete(state, type, type, date).state;
    }
  }
  const info = Store.storyInfo(state);
  assert.equal(info.total, 48);
  assert.equal(info.caseComplete, true);
  assert.equal(info.chapter, 4);
  assert.equal(Store.claimReward(state).story.rewardClaimed, true);
});

test("weight and weekly review do not add story progress", () => {
  const state = Store.saveReview(Store.initialState(), {
    decisionFatigue: 4,
    mood: 2,
    energy: 3,
    rescueHelped: 4,
    weight: 180.2,
    note: "Travel week",
  }, "2026-10-06T18:00:00");
  assert.equal(state.reviews.length, 1);
  assert.equal(state.reviews[0].weight, 180.2);
  assert.equal(Store.storyInfo(state).total, 0);
});

test("grocery checks and running-low state remain mutually clear", () => {
  let state = Store.initialState();
  state = Store.setGroceryLow(state, "hummus", true);
  assert.equal(state.grocery.low.hummus, true);
  assert.equal(state.grocery.checked.hummus, false);
  state = Store.setGroceryChecked(state, "hummus", true);
  assert.equal(state.grocery.checked.hummus, true);
  assert.equal(state.grocery.low.hummus, false);
});

test("export and import preserve private progress", () => {
  let state = Store.initialState();
  state = Store.complete(state, "movement", "One song", "2026-10-06T08:00:00").state;
  state = Store.chooseStoryPath(state, 1, "The old library records");
  const imported = Store.importJson(Store.exportJson(state));
  assert.equal(imported.completions.length, 1);
  assert.equal(imported.story.choices["1"], "The old library records");
});

test("restart gap is inferred only from completion dates", () => {
  let state = Store.initialState();
  state = Store.complete(state, "breakfast", "Oatmeal", "2026-10-01T07:00:00").state;
  state = Store.complete(state, "breakfast", "Oatmeal", "2026-10-04T07:00:00").state;
  assert.equal(Store.latestRestartGap(state), 2);
});

test("the scripted case contains four complete twelve-clue chapters", () => {
  assert.equal(Data.chapters.length, 4);
  for (const chapter of Data.chapters) {
    assert.equal(chapter.clues.length, 12);
    assert.ok(chapter.choice.options.length >= 2);
  }
});
