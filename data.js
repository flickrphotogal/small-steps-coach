(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  root.CoachData = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const quotes = [
    { text: "A small step still moves the day.", attribution: "Small Steps" },
    { text: "You only need the next easy action.", attribution: "Small Steps" },
    { text: "Restarting counts as progress.", attribution: "Small Steps" },
    { text: "The minimum is enough for today.", attribution: "Small Steps" },
    { text: "Curiosity is kinder than pressure.", attribution: "Small Steps" },
    { text: "One suggestion. One start. One clue.", attribution: "Small Steps" },
    { text: "Your pace can be quiet and still count.", attribution: "Small Steps" },
    { text: "Leave the harsh story unfinished.", attribution: "Small Steps" },
    { text: "Future-you only asked for one favor.", attribution: "Small Steps" },
    { text: "Ignoring a prompt is not a failure record.", attribution: "Small Steps" },
    { text: "Food already in the fridge is a gift.", attribution: "Small Steps" },
    { text: "You can begin in the middle.", attribution: "Small Steps" },
    { text: "Gentleness is a practical strategy.", attribution: "Small Steps" },
    { text: "A path appears after the first footstep.", attribution: "Callaway Gardens" },
    { text: "Nothing needs to be perfect before it begins.", attribution: "Small Steps" },
    { text: "Choose the option that asks the least of you.", attribution: "Small Steps" },
    { text: "Water, food, movement: any one of them helps.", attribution: "Small Steps" },
    { text: "You are allowed to keep it simple.", attribution: "Small Steps" },
    { text: "A completed tiny thing still unlocks the next clue.", attribution: "Small Steps" },
    { text: "Today can be ordinary and still be enough.", attribution: "Small Steps" },
    { text: "Rest is part of the plan, not a detour from it.", attribution: "Small Steps" },
  ];

  const routines = {
    breakfast: [
      {
        title: "Oatmeal with mixed berries",
        detail: "Quaker Original oatmeal with Wyman’s mixed berries. Add milk or yogurt if you want more protein. Eggs are not required for breakfast.",
      },
      {
        title: "Hummus, Veggie & Cheese Bites, pineapple",
        detail: "Publix Classic Hummus with the Snack Sensations tray and fresh pineapple. Ranch is fine occasionally.",
      },
      {
        title: "Cheese, raw vegetables, and fruit",
        detail: "Use the cheese from the Veggie & Cheese Bites with carrots or celery and pineapple or berries.",
      },
      {
        title: "Trader Joe’s oatmeal and frozen berries",
        detail: "Plain oats with TJ’s frozen mixed berries. Pair with yogurt or a protein shake if available.",
      },
    ],
    movement: [
      {
        title: "Move for one song",
        detail: "Stand, sway, step, or dance. Stop when the song ends; that is the complete mission.",
      },
      {
        title: "Five treadmill minutes",
        detail: "Use a comfortable pace. Finishing five minutes counts even if you could do more.",
      },
      {
        title: "One three-move circuit",
        detail: "Try five wall push-ups, five sit-to-stands, and a 15-second suitcase hold on each side. Stop for sharp pain.",
      },
      {
        title: "Five-minute guided core or strength session",
        detail: "Choose an impact-free video. The five-minute version is not a warmup for something longer.",
      },
    ],
    lunch: [
      {
        title: "Publix cobb-style salad",
        detail: "Eat the salad as packaged. Egg and ranch are fine occasionally. Skip any add-ons with nuts.",
      },
      {
        title: "Black bean soup with fruit",
        detail: "Panera black bean soup with a few crackers if wanted, plus guacamole and pineapple.",
      },
      {
        title: "Hummus plate from the fridge",
        detail: "Hummus, Veggie & Cheese Bites, pineapple or berries. Guacamole can stand in for extra fat and flavor.",
      },
      {
        title: "Trader Joe’s Butter Chicken with basmati rice",
        detail: "Frozen meal, about five minutes. A strong hot option with chicken, tomato-based sauce, and rice.",
      },
      {
        title: "Trader Joe’s Chicken Burrito Bowl",
        detail: "Chicken, brown rice, black beans, quinoa, cheese, tomato sauce. Skip if cooked peppers or corn feel like too much.",
      },
      {
        title: "Chick-fil-A grilled nuggets and fruit cup",
        detail: "A lower-risk restaurant order; ingredient certainty is never guaranteed.",
      },
      {
        title: "Newk’s Greek salad with grilled chicken",
        detail: "Customize away any problem toppings and put dressing on the side.",
      },
      {
        title: "Popeyes blackened tenders with red beans and rice",
        detail: "Water or unsweetened tea. Mashed potatoes are an okay comfort variation, not a mistake.",
      },
    ],
    evening: [
      {
        title: "Hummus with leftover Veggie & Cheese Bites",
        detail: "Add pineapple or berries. A small plate is enough.",
      },
      {
        title: "Leftover black bean soup",
        detail: "Reheat the Panera soup. Guacamole or pineapple on the side is optional.",
      },
      {
        title: "Guacamole with pineapple",
        detail: "Use when energy is low. Add cheese or hummus if you want more staying power.",
      },
      {
        title: "Trader Joe’s hummus snack pack",
        detail: "Mediterranean hummus with pita chips. Pair with fruit if you have it.",
      },
      {
        title: "Cheese, fruit, and raw vegetables",
        detail: "Finish what is already open from the snack tray and fruit cups.",
      },
    ],
    outlook: [
      { title: "Do one tiny favor for tomorrow-you", detail: "Choose something that takes under two minutes." },
      { title: "Rewrite one harsh thought accurately", detail: "Aim for true and fair, not artificially positive." },
      { title: "Name one strength you used", detail: "Persistence, humor, honesty, restraint, curiosity, or another real strength." },
      { title: "Notice one specific thing you appreciated", detail: "Small and ordinary counts." },
      { title: "Take one pleasant or interesting photo", detail: "It stays private unless you decide otherwise." },
      { title: "Play one atmosphere-shifting song", detail: "You do not have to improve your mood; just change the input." },
    ],
  };

  const groceries = [
    {
      name: "Publix premade first",
      items: [
        "Snack Sensations Veggie & Cheese Bites with ranch",
        "Publix Classic Hummus",
        "Panera or Publix black bean soup",
        "Premade cobb-style or raw salad without nuts; egg is fine occasionally",
        "Fresh pineapple or fruit cups",
        "Mild guacamole",
        "Quaker Original oatmeal",
        "Frozen mixed berries",
      ],
    },
    {
      name: "Trader Joe’s first",
      items: [
        "Butter Chicken with Basmati Rice (frozen)",
        "Chicken Burrito Bowl (frozen) — optional if cooked peppers/corn are okay",
        "Frozen brown rice or quinoa packets",
        "Frozen mixed berries",
        "Mediterranean hummus snack pack with pita chips",
        "Just Chicken or other labeled cooked chicken",
        "Tomato & Roasted Red Pepper Soup",
        "Plain oats",
      ],
    },
    {
      name: "Skip or customize",
      items: [
        "Chicken salad snack boxes that include almonds — skip the nuts",
        "Sargento Balanced Breaks with nuts",
        "Asparagus risotto",
        "Meals with golden raisins or dried fruit — check for sulfur dioxide",
      ],
    },
    {
      name: "Final backups",
      items: [
        "Crackers or pita chips",
        "Cheese you already like",
        "One approved restaurant backup",
      ],
    },
  ];

  const restaurants = [
    {
      id: "publix",
      name: "Publix",
      order: "Cobb-style salad, or black bean soup with guacamole and pineapple",
      note: "Fridge first. Skip nuts in any snack box. Egg and ranch are fine occasionally. Hummus plus Veggie & Cheese Bites is the lowest-effort backup.",
    },
    {
      id: "traderjoes",
      name: "Trader Joe’s",
      order: "Butter Chicken with Basmati Rice, or a Mediterranean hummus snack pack with fruit",
      note: "Frozen brown rice packets and Just Chicken are useful add-ons. Skip asparagus risotto and any dried-fruit meals listing sulfur dioxide. The Chicken Burrito Bowl is optional if cooked peppers and corn are okay.",
    },
    {
      id: "chickfila",
      name: "Chick-fil-A",
      order: "12-count grilled nuggets with a fruit cup",
      note: "Water or unsweetened tea. The standard Market Salad includes nuts and granola that has contained sulfur dioxide.",
    },
    {
      id: "newks",
      name: "Newk’s",
      order: "Greek salad with grilled chicken, customized without problem toppings",
      note: "Dressing on the side. Preserved toppings and supplier ingredients can vary.",
    },
    {
      id: "tropical",
      name: "Tropical Smoothie",
      order: "Detox Island Green with added whey or pea protein",
      note: "A useful drinkable meal. It contains fruit sugar, and supplier ingredients can vary.",
    },
    {
      id: "mexican",
      name: "Mexican",
      order: "Chicken salad or bowl with beans, salsa, raw toppings, and optional rice",
      note: "Skip only ingredients you already know cause trouble; this is a flexible lower-risk template.",
    },
    {
      id: "popeyes",
      name: "Popeyes",
      order: "5-piece blackened tenders with red beans and rice",
      note: "Mashed potatoes are an acceptable comfort alternative. Red beans and rice provide more fiber and some protein. Full sulfite certainty is unavailable.",
    },
  ];

  const rescue = {
    food: {
      title: "Food feels stuck",
      grounding: "Put both feet down and take one slower breath out than in.",
      actions: [
        "Open the fridge and touch one approved item. You may stop there.",
        "Choose the first Publix or Trader Joe’s premade item that is available.",
        "Order the saved restaurant default without reopening the menu.",
      ],
    },
    movement: {
      title: "Movement feels stuck",
      grounding: "Stand up and let your arms hang loose for one breath.",
      actions: [
        "Start one song and move only until the first chorus.",
        "Step onto the treadmill and press Start at the easiest pace.",
        "Do one wall push-up. Decide about the other four afterward.",
      ],
    },
    work: {
      title: "Work feels stuck",
      grounding: "Name the next visible object you can touch.",
      actions: [
        "Open the file or page. Do not solve anything yet.",
        "Write a deliberately rough first sentence.",
        "Set a two-minute timer and make the task smaller until it fits.",
      ],
    },
    home: {
      title: "Home feels stuck",
      grounding: "Drop your shoulders and look at one square foot of space.",
      actions: [
        "Put away one object that already has a home.",
        "Throw away one piece of trash.",
        "Carry one item toward the room where it belongs.",
      ],
    },
    transition: {
      title: "The transition feels stuck",
      grounding: "Say out loud: “I am between things. I only need the bridge.”",
      actions: [
        "Put on shoes or pick up the item needed for the next place.",
        "Walk to the doorway and pause there.",
        "Play one transition song and move when it starts.",
      ],
    },
    emotional: {
      title: "A painful thought has taken over",
      grounding: "Press your feet into the floor and name three neutral things you can see.",
      actions: [
        "Take one sip of water and change rooms or positions.",
        "Write the harsh thought, then add: “This is a thought arriving during a painful moment, not a final verdict.”",
        "Do one two-minute action that makes the next ten minutes gentler.",
      ],
    },
  };

  const chapters = [
    {
      title: "The Unlit Window",
      clues: [
        "Mira Bell arrived in Alder Row to reopen her aunt’s stationery shop and found a brass key taped beneath the till.",
        "The key’s tag read “Lantern Room,” though no room by that name appeared on the building plan.",
        "A flour-dusted baker named Tomas recognized the handwriting but not the key.",
        "At noon, the empty apartment above the shop chimed as if someone had opened its old clock.",
        "Mira found a receipt for twelve blue candles, all purchased on the same rainy Tuesday.",
        "The neighborhood librarian, Inez, remembered a reading club that once met after closing time.",
        "A faded photograph showed the club beside a painted door that no longer existed.",
        "Behind a display cabinet, the wallpaper changed from cream to a narrow stripe of midnight blue.",
        "Mira’s cat-sitting neighbor reported a warm patch on the wall just after sunset.",
        "A loose floorboard yielded a paper star folded around the words “Begin where the light refuses.”",
        "The brass key fit a tiny lock hidden inside the old wall clock.",
        "The clock opened—not to gears, but to a rolled map of Alder Row marked with four lanterns.",
      ],
      choice: {
        prompt: "Where should Mira begin?",
        options: ["The old library records", "The bakery basement", "The midnight-blue wall"],
      },
    },
    {
      title: "Four Paper Lanterns",
      clues: [
        "Mira chose a lead, and Inez packed tea while Tomas brought a flashlight that flickered whenever he exaggerated.",
        "The first map lantern marked a courtyard now filled with rosemary and mismatched chairs.",
        "Under one chair was a tile painted with the same paper star.",
        "The tile lifted to reveal a biscuit tin containing invitations to “the ordinary wonders society.”",
        "Each invitation asked guests to bring one overlooked object and its story.",
        "One guest list entry had been carefully erased, leaving only the initial R.",
        "Shopkeeper Dev Shah recalled Rhea Vale, a set designer who made whole rooms look like other centuries.",
        "Rhea had left Alder Row suddenly, but mailed a postcard every autumn with no return address.",
        "This year’s postcard showed a train station clock stopped at 8:12.",
        "The second lantern on the map sat beside the same station, three blocks beyond the modern platform.",
        "In a disused waiting room, Mira found blue candle wax beneath layers of dust.",
        "Scratched into the windowsill was a message: “The room travels when the neighborhood forgets to notice.”",
      ],
      choice: {
        prompt: "Who should examine the station clue?",
        options: ["Inez, who notices records", "Tomas, who notices people", "Mira, who notices spaces"],
      },
    },
    {
      title: "A Room That Travels",
      clues: [
        "The chosen investigator noticed tiny stage marks around the waiting-room molding.",
        "The molding detached in sections, revealing it had once framed a portable painted doorway.",
        "Rhea had not hidden a room; she had designed one that could be assembled anywhere.",
        "A ledger listed each host site, but its final page had been torn away.",
        "The third lantern pointed to a laundromat where the dryers made every conversation sound secret.",
        "Owner Bea produced a box of abandoned buttons, one shaped like a blue flame.",
        "The flame button matched the fastening on the society invitations.",
        "Inside its hollow back was a strip of paper bearing four musical notes.",
        "Tomas hummed the notes, and the laundromat’s elderly change machine answered with the same tune.",
        "Behind the machine was the missing ledger page, protected in a plastic sleeve.",
        "The last host site was not an address but a phrase: “where errands become visits.”",
        "Everyone on Alder Row used that phrase for the little grocery before it became a vacant storefront.",
      ],
      choice: {
        prompt: "How should the group enter the vacant shop?",
        options: ["Ask the current owner for the key", "Search the public records first", "Invite the owner to join them"],
      },
    },
    {
      title: "The Ordinary Wonders Society",
      clues: [
        "The group’s approach worked, and the owner, Mr. Vale, listened without interrupting.",
        "Rhea was his sister. She had left to design theater sets and was due back for the autumn festival.",
        "He unlocked the shop and admitted he had stored several of her old flats in the back.",
        "The midnight-blue wall unfolded first, followed by a painted window and shelves sized for tiny treasures.",
        "Mira’s brass key opened a cabinet built into the scenery.",
        "Inside were stories of ordinary objects: a bus ticket, a chipped cup, a shoelace, a grocery list.",
        "The society had created the Lantern Room to help neighbors notice the lives happening beside them.",
        "It stopped meeting when the portable doorway was misplaced during renovations.",
        "The four map lanterns were simply the last hosts, each safeguarding one piece.",
        "Rhea’s autumn postcards were reminders, not riddles; no one had laid all four together until Mira arrived.",
        "At the festival, the restored Lantern Room opened inside the stationery shop, and every visitor added one overlooked story.",
        "Mira placed the brass key in the cabinet, then kept the shop light on late enough for the window to glow.",
      ],
      choice: {
        prompt: "What should the next case begin with?",
        options: ["A misdelivered parcel", "A garden that blooms overnight", "A song heard from an empty house"],
      },
    },
  ];

  return { quotes, routines, groceries, restaurants, rescue, chapters };
});
