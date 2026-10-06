(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  root.CoachData = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const routines = {
    breakfast: [
      {
        title: "Oatmeal, fruit, and protein",
        detail: "Plain instant oatmeal with fresh berries or banana. Add Greek yogurt, milk, or a protein shake for staying power.",
      },
      {
        title: "Hummus, raw vegetables, and fruit",
        detail: "A premade hummus cup or container is enough. No arranging required.",
      },
      {
        title: "Cheese, fruit, and raw vegetables",
        detail: "Individually wrapped cheese and a fresh fruit cup make this nearly automatic.",
      },
      {
        title: "Simple fruit-and-protein smoothie",
        detail: "Use a premade option or a familiar blend. Check flavored additions and dried fruit for sulfites.",
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
        title: "Publix chicken or turkey over a premade raw salad",
        detail: "Read the label for nuts and added sulfites. Eggs are fine occasionally.",
      },
      {
        title: "Publix hummus snack plate",
        detail: "Hummus, raw vegetables, fruit, and cheese or labeled sliced poultry.",
      },
      {
        title: "Grain-and-bean pouch over a raw salad",
        detail: "Microwave the pouch and pour it over greens. Use a dressing you will actually eat.",
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
        title: "Tropical Smoothie Detox Island Green with protein",
        detail: "Add whey or pea protein. Supplier ingredients can vary.",
      },
      {
        title: "Mexican chicken salad or bowl",
        detail: "Choose beans, salsa, raw toppings, and a small amount of rice if wanted.",
      },
      {
        title: "Popeyes blackened tenders with red beans and rice",
        detail: "Water or unsweetened tea. Mashed potatoes are an okay comfort variation, not a mistake.",
      },
    ],
    evening: [
      {
        title: "Hummus with raw vegetables and fruit",
        detail: "Use a snack cup or the package you already opened.",
      },
      {
        title: "Cheese, fruit, and raw vegetables",
        detail: "A small plate is enough; it does not need to look like dinner.",
      },
      {
        title: "Labeled turkey or chicken with fruit",
        detail: "Check the current label for added sulfites.",
      },
      {
        title: "Premade soup with bread or crackers",
        detail: "Choose a nut-free label you tolerate. Cooked blended vegetables are okay.",
      },
      {
        title: "Nut-free premade snack box",
        detail: "Egg or ranch is fine occasionally.",
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
        "Boar’s Head or Sabra hummus-and-pretzel snack cup",
        "Mini Babybel or GreenWise cheddar with a fresh fruit cup",
        "Snack Sensations Apple & Cheese Tray with pretzels — check label",
        "Publix chorizo, white cheddar, cranberry, and papaya pack — check for added sulfites",
        "Labeled premade soup with bread or crackers",
      ],
    },
    {
      name: "Fresh grab-and-go",
      items: [
        "Fresh fruit or fruit cups",
        "Raw vegetables or snack trays",
        "Bagged salad greens",
        "Premade raw salad without nuts; egg is fine occasionally",
      ],
    },
    {
      name: "Fill the gaps",
      items: [
        "Plain instant oatmeal or oatmeal cups",
        "Hummus",
        "Cheese",
        "Greek yogurt or preferred smoothie protein",
        "Labeled sliced turkey or chicken",
        "Labeled oven-roasted chicken",
        "Nut-free snack boxes",
        "Microwave grain-and-bean pouches",
        "Bread or crackers",
      ],
    },
    {
      name: "Final backups",
      items: [
        "Olive oil or preferred dressing",
        "Lemon for simple dressing",
        "One approved restaurant backup",
      ],
    },
  ];

  const restaurants = [
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
    {
      id: "publix",
      name: "Publix",
      order: "Labeled chicken or turkey over a premade raw salad",
      note: "Publix is the first preference because packaged labels make egg, nut, and added-sulfite checks easier.",
    },
  ];

  const rescue = {
    food: {
      title: "Food feels stuck",
      grounding: "Put both feet down and take one slower breath out than in.",
      actions: [
        "Open the fridge and touch one approved item. You may stop there.",
        "Choose the first Publix premade item on your list that is available.",
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

  return { routines, groceries, restaurants, rescue, chapters };
});
