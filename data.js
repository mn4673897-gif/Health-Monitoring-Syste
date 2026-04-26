// No exports — loaded as plain script
const foodDB = {
  "banana":         { emoji:"🍌", calories:89,  protein:1.1, carbs:23, fat:0.3, fiber:2.6, vitaminC:8.7,  calcium:5,   iron:0.3, potassium:358, vitaminA:3,   vitaminD:0,    vitaminB12:0,   zinc:0.15, score:82 },
  "apple":          { emoji:"🍎", calories:52,  protein:0.3, carbs:14, fat:0.2, fiber:2.4, vitaminC:4.6,  calcium:6,   iron:0.1, potassium:107, vitaminA:3,   vitaminD:0,    vitaminB12:0,   zinc:0.04, score:78 },
  "chicken breast": { emoji:"🍗", calories:165, protein:31,  carbs:0,  fat:3.6, fiber:0,   vitaminC:0,    calcium:15,  iron:1.0, potassium:256, vitaminA:9,   vitaminD:0.1,  vitaminB12:0.3, zinc:1.0,  score:91 },
  "chicken":        { emoji:"🍗", calories:165, protein:31,  carbs:0,  fat:3.6, fiber:0,   vitaminC:0,    calcium:15,  iron:1.0, potassium:256, vitaminA:9,   vitaminD:0.1,  vitaminB12:0.3, zinc:1.0,  score:91 },
  "rice":           { emoji:"🍚", calories:130, protein:2.7, carbs:28, fat:0.3, fiber:0.4, vitaminC:0,    calcium:10,  iron:0.2, potassium:35,  vitaminA:0,   vitaminD:0,    vitaminB12:0,   zinc:0.5,  score:65 },
  "egg":            { emoji:"🥚", calories:155, protein:13,  carbs:1.1,fat:11,  fiber:0,   vitaminC:0,    calcium:56,  iron:1.8, potassium:126, vitaminA:160, vitaminD:2.0,  vitaminB12:1.1, zinc:1.3,  score:88 },
  "eggs":           { emoji:"🥚", calories:155, protein:13,  carbs:1.1,fat:11,  fiber:0,   vitaminC:0,    calcium:56,  iron:1.8, potassium:126, vitaminA:160, vitaminD:2.0,  vitaminB12:1.1, zinc:1.3,  score:88 },
  "avocado":        { emoji:"🥑", calories:160, protein:2.0, carbs:9,  fat:15,  fiber:6.7, vitaminC:10,   calcium:12,  iron:0.6, potassium:485, vitaminA:7,   vitaminD:0,    vitaminB12:0,   zinc:0.64, score:90 },
  "salmon":         { emoji:"🐟", calories:208, protein:20,  carbs:0,  fat:13,  fiber:0,   vitaminC:0,    calcium:12,  iron:0.3, potassium:363, vitaminA:58,  vitaminD:14.4, vitaminB12:3.2, zinc:0.4,  score:95 },
  "milk":           { emoji:"🥛", calories:61,  protein:3.2, carbs:4.8,fat:3.3, fiber:0,   vitaminC:0,    calcium:113, iron:0.03,potassium:150, vitaminA:46,  vitaminD:1.0,  vitaminB12:0.45,zinc:0.38, score:80 },
  "broccoli":       { emoji:"🥦", calories:34,  protein:2.8, carbs:7,  fat:0.4, fiber:2.6, vitaminC:89.2, calcium:47,  iron:0.7, potassium:316, vitaminA:31,  vitaminD:0,    vitaminB12:0,   zinc:0.41, score:93 },
  "spinach":        { emoji:"🥬", calories:23,  protein:2.9, carbs:3.6,fat:0.4, fiber:2.2, vitaminC:28.1, calcium:99,  iron:2.7, potassium:558, vitaminA:469, vitaminD:0,    vitaminB12:0,   zinc:0.53, score:94 },
  "oats":           { emoji:"🌾", calories:389, protein:17,  carbs:66, fat:7,   fiber:10.6,vitaminC:0,    calcium:54,  iron:4.7, potassium:429, vitaminA:0,   vitaminD:0,    vitaminB12:0,   zinc:3.97, score:87 },
  "sweet potato":   { emoji:"🍠", calories:86,  protein:1.6, carbs:20, fat:0.1, fiber:3,   vitaminC:2.4,  calcium:30,  iron:0.6, potassium:337, vitaminA:961, vitaminD:0,    vitaminB12:0,   zinc:0.3,  score:85 },
  "carrot":         { emoji:"🥕", calories:41,  protein:0.9, carbs:10, fat:0.2, fiber:2.8, vitaminC:5.9,  calcium:33,  iron:0.3, potassium:320, vitaminA:835, vitaminD:0,    vitaminB12:0,   zinc:0.24, score:86 },
  "tuna":           { emoji:"🐠", calories:116, protein:26,  carbs:0,  fat:1,   fiber:0,   vitaminC:0,    calcium:10,  iron:1.3, potassium:444, vitaminA:20,  vitaminD:5.4,  vitaminB12:9.4, zinc:0.77, score:90 },
  "tofu":           { emoji:"🧊", calories:76,  protein:8,   carbs:1.9,fat:4.8, fiber:0.3, vitaminC:0.1,  calcium:350, iron:5.4, potassium:121, vitaminA:0,   vitaminD:0,    vitaminB12:0,   zinc:0.8,  score:84 },
  "beef":           { emoji:"🥩", calories:250, protein:26,  carbs:0,  fat:17,  fiber:0,   vitaminC:0,    calcium:18,  iron:2.6, potassium:318, vitaminA:0,   vitaminD:0.1,  vitaminB12:2.6, zinc:6.31, score:80 },
  "almonds":        { emoji:"🥜", calories:579, protein:21,  carbs:22, fat:50,  fiber:12.5,vitaminC:0,    calcium:264, iron:3.7, potassium:733, vitaminA:0,   vitaminD:0,    vitaminB12:0,   zinc:3.12, score:86 },
  "yogurt":         { emoji:"🍶", calories:59,  protein:10,  carbs:3.6,fat:0.4, fiber:0,   vitaminC:0,    calcium:110, iron:0.08,potassium:141, vitaminA:5,   vitaminD:0.1,  vitaminB12:0.75,zinc:0.52, score:82 },
  "orange":         { emoji:"🍊", calories:47,  protein:0.9, carbs:12, fat:0.1, fiber:2.4, vitaminC:53.2, calcium:40,  iron:0.1, potassium:181, vitaminA:11,  vitaminD:0,    vitaminB12:0,   zinc:0.07, score:80 },

    "tilapia":       { emoji:"🐟", calories:129, protein:26, carbs:0, fat:2.7, fiber:0, vitaminC:0, calcium:10, iron:0.6, potassium:380, vitaminA:0, vitaminD:3.6, vitaminB12:1.9, zinc:0.4, score:88 },
  "bangus":        { emoji:"🐟", calories:148, protein:20, carbs:0, fat:6, fiber:0, vitaminC:0, calcium:20, iron:0.5, potassium:300, vitaminA:50, vitaminD:4, vitaminB12:2.5, zinc:0.6, score:90 },
  "sardines":      { emoji:"🐟", calories:208, protein:25, carbs:0, fat:11, fiber:0, vitaminC:0, calcium:382, iron:2.9, potassium:397, vitaminA:32, vitaminD:4.8, vitaminB12:8.9, zinc:1.3, score:95 },
  "mackerel":      { emoji:"🐟", calories:205, protein:19, carbs:0, fat:14, fiber:0, vitaminC:0, calcium:12, iron:1.6, potassium:314, vitaminA:50, vitaminD:13, vitaminB12:7.2, zinc:0.7, score:94 },

  "chickpeas":     { emoji:"🫘", calories:164, protein:9, carbs:27, fat:2.6, fiber:7.6, vitaminC:1.3, calcium:49, iron:2.9, potassium:291, vitaminA:1, vitaminD:0, vitaminB12:0, zinc:1.5, score:87 },
  "lentils":       { emoji:"🫘", calories:116, protein:9, carbs:20, fat:0.4, fiber:7.9, vitaminC:1.5, calcium:19, iron:3.3, potassium:369, vitaminA:3, vitaminD:0, vitaminB12:0, zinc:1.3, score:88 },
  "black beans":   { emoji:"🫘", calories:132, protein:9, carbs:24, fat:0.5, fiber:8.7, vitaminC:0, calcium:35, iron:2.1, potassium:355, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:1.1, score:86 },

  "cabbage":       { emoji:"🥬", calories:25, protein:1.3, carbs:6, fat:0.1, fiber:2.5, vitaminC:36.6, calcium:40, iron:0.5, potassium:170, vitaminA:98, vitaminD:0, vitaminB12:0, zinc:0.2, score:84 },
  "cucumber":      { emoji:"🥒", calories:15, protein:0.7, carbs:3.6, fat:0.1, fiber:0.5, vitaminC:2.8, calcium:16, iron:0.3, potassium:147, vitaminA:5, vitaminD:0, vitaminB12:0, zinc:0.2, score:80 },
  "tomato":        { emoji:"🍅", calories:18, protein:0.9, carbs:3.9, fat:0.2, fiber:1.2, vitaminC:13.7, calcium:10, iron:0.3, potassium:237, vitaminA:42, vitaminD:0, vitaminB12:0, zinc:0.2, score:83 },

  "pineapple":     { emoji:"🍍", calories:50, protein:0.5, carbs:13, fat:0.1, fiber:1.4, vitaminC:47.8, calcium:13, iron:0.3, potassium:109, vitaminA:3, vitaminD:0, vitaminB12:0, zinc:0.1, score:82 },
  "mango":         { emoji:"🥭", calories:60, protein:0.8, carbs:15, fat:0.4, fiber:1.6, vitaminC:36.4, calcium:11, iron:0.2, potassium:168, vitaminA:54, vitaminD:0, vitaminB12:0, zinc:0.1, score:85 },
  "watermelon":    { emoji:"🍉", calories:30, protein:0.6, carbs:8, fat:0.2, fiber:0.4, vitaminC:8.1, calcium:7, iron:0.2, potassium:112, vitaminA:28, vitaminD:0, vitaminB12:0, zinc:0.1, score:81 },

  "peanut butter": { emoji:"🥜", calories:588, protein:25, carbs:20, fat:50, fiber:6, vitaminC:0, calcium:43, iron:1.9, potassium:649, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:3.3, score:86 },
  "peanuts":       { emoji:"🥜", calories:567, protein:26, carbs:16, fat:49, fiber:8.5, vitaminC:0, calcium:92, iron:4.6, potassium:705, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:3.2, score:85 },

  "coconut water": { emoji:"🥥", calories:19, protein:0.7, carbs:3.7, fat:0.2, fiber:1.1, vitaminC:2.4, calcium:24, iron:0.3, potassium:250, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0.1, score:83 },
  "coconut meat":  { emoji:"🥥", calories:354, protein:3.3, carbs:15, fat:33, fiber:9, vitaminC:3.3, calcium:14, iron:2.4, potassium:356, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:1.1, score:84 },

  "eggplant":      { emoji:"🍆", calories:25, protein:1, carbs:6, fat:0.2, fiber:3, vitaminC:2.2, calcium:9, iron:0.2, potassium:229, vitaminA:23, vitaminD:0, vitaminB12:0, zinc:0.2, score:82 },
  "onion":         { emoji:"🧅", calories:40, protein:1.1, carbs:9, fat:0.1, fiber:1.7, vitaminC:7.4, calcium:23, iron:0.2, potassium:146, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0.2, score:81 },

  "garlic":        { emoji:"🧄", calories:149, protein:6.4, carbs:33, fat:0.5, fiber:2.1, vitaminC:31.2, calcium:181, iron:1.7, potassium:401, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:1.2, score:88 },
  "ginger":        { emoji:"🫚", calories:80, protein:1.8, carbs:18, fat:0.8, fiber:2, vitaminC:5, calcium:16, iron:0.6, potassium:415, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0.3, score:87 },
  
    "grapes":        { emoji:"🍇", calories:69, protein:0.7, carbs:18, fat:0.2, fiber:0.9, vitaminC:10.8, calcium:10, iron:0.4, potassium:191, vitaminA:3, vitaminD:0, vitaminB12:0, zinc:0.1, score:82 },
  "blueberries":   { emoji:"🫐", calories:57, protein:0.7, carbs:14, fat:0.3, fiber:2.4, vitaminC:9.7, calcium:6, iron:0.3, potassium:77, vitaminA:3, vitaminD:0, vitaminB12:0, zinc:0.2, score:88 },
  "strawberries":  { emoji:"🍓", calories:32, protein:0.7, carbs:7.7, fat:0.3, fiber:2, vitaminC:58.8, calcium:16, iron:0.4, potassium:153, vitaminA:1, vitaminD:0, vitaminB12:0, zinc:0.1, score:90 },
  "papaya":        { emoji:"🧡", calories:43, protein:0.5, carbs:11, fat:0.3, fiber:1.7, vitaminC:60.9, calcium:20, iron:0.3, potassium:182, vitaminA:47, vitaminD:0, vitaminB12:0, zinc:0.1, score:86 },
  "guava":         { emoji:"🍈", calories:68, protein:2.6, carbs:14, fat:1, fiber:5.4, vitaminC:228, calcium:18, iron:0.3, potassium:417, vitaminA:31, vitaminD:0, vitaminB12:0, zinc:0.2, score:94 },

  "banana cue":    { emoji:"🍌", calories:280, protein:1.5, carbs:58, fat:7, fiber:2.5, vitaminC:6, calcium:10, iron:0.6, potassium:400, vitaminA:5, vitaminD:0, vitaminB12:0, zinc:0.2, score:70 },
  "turon":         { emoji:"🍌", calories:260, protein:3, carbs:45, fat:8, fiber:2, vitaminC:5, calcium:12, iron:0.5, potassium:220, vitaminA:3, vitaminD:0, vitaminB12:0, zinc:0.2, score:68 },

  "fried chicken": { emoji:"🍗", calories:260, protein:25, carbs:8, fat:15, fiber:0, vitaminC:0, calcium:20, iron:1.2, potassium:300, vitaminA:30, vitaminD:0.2, vitaminB12:0.4, zinc:1.1, score:78 },
  "pork belly":    { emoji:"🥓", calories:518, protein:9, carbs:0, fat:53, fiber:0, vitaminC:0, calcium:8, iron:0.5, potassium:320, vitaminA:10, vitaminD:0, vitaminB12:0.6, zinc:1.2, score:60 },
  "pork chop":     { emoji:"🥩", calories:231, protein:24, carbs:0, fat:14, fiber:0, vitaminC:0, calcium:15, iron:1.1, potassium:340, vitaminA:10, vitaminD:0.1, vitaminB12:0.7, zinc:2.3, score:80 },

  "shrimp":        { emoji:"🦐", calories:99, protein:24, carbs:0.2, fat:0.3, fiber:0, vitaminC:0, calcium:70, iron:0.5, potassium:264, vitaminA:54, vitaminD:0, vitaminB12:1.1, zinc:1.3, score:92 },
  "crab":          { emoji:"🦀", calories:97, protein:19, carbs:0, fat:1.5, fiber:0, vitaminC:3, calcium:91, iron:0.7, potassium:259, vitaminA:50, vitaminD:0, vitaminB12:9, zinc:3.5, score:91 },
  "squid":         { emoji:"🦑", calories:92, protein:16, carbs:3, fat:1.4, fiber:0, vitaminC:4, calcium:32, iron:0.7, potassium:246, vitaminA:30, vitaminD:0, vitaminB12:1.2, zinc:1.1, score:89 },

  "corn":          { emoji:"🌽", calories:86, protein:3.2, carbs:19, fat:1.2, fiber:2.7, vitaminC:6.8, calcium:2, iron:0.5, potassium:270, vitaminA:9, vitaminD:0, vitaminB12:0, zinc:0.5, score:84 },
  "peas":          { emoji:"🟢", calories:81, protein:5.4, carbs:14, fat:0.4, fiber:5.1, vitaminC:40, calcium:25, iron:1.5, potassium:244, vitaminA:38, vitaminD:0, vitaminB12:0, zinc:1.2, score:88 },
  "cabbage":       { emoji:"🥬", calories:25, protein:1.3, carbs:6, fat:0.1, fiber:2.5, vitaminC:36.6, calcium:40, iron:0.5, potassium:170, vitaminA:98, vitaminD:0, vitaminB12:0, zinc:0.2, score:84 },

  "garlic":        { emoji:"🧄", calories:149, protein:6.4, carbs:33, fat:0.5, fiber:2.1, vitaminC:31, calcium:181, iron:1.7, potassium:401, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:1.2, score:88 },
  "onion":         { emoji:"🧅", calories:40, protein:1.1, carbs:9, fat:0.1, fiber:1.7, vitaminC:7.4, calcium:23, iron:0.2, potassium:146, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0.2, score:81 },
  "ginger":        { emoji:"🫚", calories:80, protein:1.8, carbs:18, fat:0.8, fiber:2, vitaminC:5, calcium:16, iron:0.6, potassium:415, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0.3, score:87 },

  "cassava":       { emoji:"🌿", calories:160, protein:1.4, carbs:38, fat:0.3, fiber:1.8, vitaminC:20.6, calcium:16, iron:0.3, potassium:271, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0.3, score:82 },
  "taro":          { emoji:"🌱", calories:142, protein:0.5, carbs:34, fat:0.1, fiber:5.1, vitaminC:4.5, calcium:43, iron:0.6, potassium:591, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0.2, score:83 },
  "ube":           { emoji:"💜", calories:118, protein:1.5, carbs:28, fat:0.2, fiber:4, vitaminC:4, calcium:17, iron:0.4, potassium:816, vitaminA:7, vitaminD:0, vitaminB12:0, zinc:0.2, score:86 },

  "cheese":        { emoji:"🧀", calories:402, protein:25, carbs:1.3, fat:33, fiber:0, vitaminC:0, calcium:721, iron:0.7, potassium:98, vitaminA:330, vitaminD:0.6, vitaminB12:1.1, zinc:3.1, score:85 },
  "butter":        { emoji:"🧈", calories:717, protein:0.9, carbs:0.1, fat:81, fiber:0, vitaminC:0, calcium:24, iron:0.0, potassium:24, vitaminA:684, vitaminD:1.5, vitaminB12:0.2, zinc:0.1, score:65 },

  "dark chocolate":{ emoji:"🍫", calories:546, protein:5, carbs:61, fat:31, fiber:7, vitaminC:0, calcium:73, iron:11.9, potassium:715, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:3.3, score:87 },

  "oyster":        { emoji:"🦪", calories:68, protein:7, carbs:4.2, fat:2.5, fiber:0, vitaminC:8, calcium:82, iron:6.7, potassium:168, vitaminA:85, vitaminD:8, vitaminB12:16, zinc:78, score:97 },  
  "potato":         { emoji:"🥔", calories:77,  protein:2,   carbs:17, fat:0.1, fiber:2.2, vitaminC:19.7, calcium:12,  iron:0.8, potassium:421, vitaminA:0,   vitaminD:0,    vitaminB12:0,   zinc:0.3,  score:70 }
};

const dailyNeeds = {
  child:  { label:"Child (1–12)",  icon:"👶", calories:1600, protein:25, carbs:225, fat:53, fiber:19, vitaminC:45, calcium:1000, iron:10, potassium:2300, vitaminA:400, vitaminD:15, vitaminB12:1.2, zinc:5  },
  teen:   { label:"Teen (13–17)",  icon:"🧒", calories:2200, protein:52, carbs:300, fat:73, fiber:26, vitaminC:75, calcium:1300, iron:15, potassium:2500, vitaminA:700, vitaminD:15, vitaminB12:2.4, zinc:9  },
  adult:  { label:"Adult (18–59)", icon:"🧑", calories:2000, protein:50, carbs:275, fat:78, fiber:28, vitaminC:90, calcium:1000, iron:18, potassium:2600, vitaminA:900, vitaminD:15, vitaminB12:2.4, zinc:11 },
  senior: { label:"Senior (60+)",  icon:"👴", calories:1800, protein:60, carbs:250, fat:65, fiber:21, vitaminC:90, calcium:1200, iron:8,  potassium:2600, vitaminA:900, vitaminD:20, vitaminB12:2.4, zinc:11 }
};
const suggestions = {
  child: [
    { emoji: "🥛", name: "Milk", category: "Dairy", reason: "Builds strong bones — high in calcium & vitamin D.", nutrients: ["Calcium", "Vitamin D", "Protein"] },
    { emoji: "🥚", name: "Egg", category: "Protein", reason: "Complete protein for brain & muscle development.", nutrients: ["Protein", "B12", "Iron"] },
    { emoji: "🥦", name: "Broccoli", category: "Vegetable", reason: "Vitamin C & K boost immunity and bone health.", nutrients: ["Vitamin C", "Fiber", "Folate"] },
    { emoji: "🍌", name: "Banana", category: "Fruit", reason: "Great energy source with heart-healthy potassium.", nutrients: ["Potassium", "Carbs", "B6"] },
    { emoji: "🍗", name: "Chicken", category: "Protein", reason: "Lean protein with iron & B vitamins for energy.", nutrients: ["Protein", "Iron", "Niacin"] },
    { emoji: "🍠", name: "Sweet Potato", category: "Vegetable", reason: "Vitamin A for vision; complex carbs for sustained energy.", nutrients: ["Vitamin A", "Fiber", "Potassium"] },
    { emoji: "🥭", name: "Mango", category: "Fruit", reason: "High in Vitamin C for a strong immune system.", nutrients: ["Vitamin C", "Vitamin A", "Fiber"] },
    { emoji: "🍚", name: "Rice", category: "Grain", reason: "Easily digestible energy source for active play.", nutrients: ["Carbs", "Iron", "B Vitamins"] }
  ],
  teen: [
    { emoji: "🥩", name: "Beef", category: "Protein", reason: "High iron & zinc crucial during puberty growth.", nutrients: ["Iron", "Zinc", "Protein"] },
    { emoji: "🐟", name: "Salmon", category: "Fish", reason: "Omega-3 supports brain focus for studying teens.", nutrients: ["Omega-3", "Vitamin D", "Protein"] },
    { emoji: "🥬", name: "Spinach", category: "Vegetable", reason: "Iron-rich — vital for teen girls; calcium for growth.", nutrients: ["Iron", "Calcium", "Folate"] },
    { emoji: "🌾", name: "Oats", category: "Grain", reason: "Sustained energy & fiber for active school-day teens.", nutrients: ["Fiber", "Carbs", "Zinc"] },
    { emoji: "🥜", name: "Almonds", category: "Nut", reason: "Healthy fats & magnesium for hormone balance.", nutrients: ["Vitamin E", "Magnesium", "Protein"] },
    { emoji: "🍠", name: "Sweet Potato", category: "Vegetable", reason: "Vitamin A for teen skin; carbs fuel sports.", nutrients: ["Vitamin A", "Fiber", "Potassium"] },
    { emoji: "🐟", name: "Tilapia", category: "Fish", reason: "High protein and Vitamin D for bone density growth.", nutrients: ["Protein", "Vitamin D", "B12"] },
    { emoji: "🫘", name: "Lentils", category: "Legume", reason: "Plant-based protein and high fiber for digestive health.", nutrients: ["Protein", "Fiber", "Iron"] }
  ],
  adult: [
    { emoji: "🥑", name: "Avocado", category: "Fruit", reason: "Heart-healthy fats lower cholesterol in adults.", nutrients: ["Healthy Fat", "Potassium", "Fiber"] },
    { emoji: "🐟", name: "Salmon", category: "Fish", reason: "Reduces inflammation; supports heart health.", nutrients: ["Omega-3", "Vitamin D", "B12"] },
    { emoji: "🥦", name: "Broccoli", category: "Vegetable", reason: "Antioxidants fight stress; Vitamin C boosts immunity.", nutrients: ["Vitamin C", "Folate", "Fiber"] },
    { emoji: "🌾", name: "Oats", category: "Grain", reason: "Lowers LDL cholesterol; great fiber-rich breakfast.", nutrients: ["Beta-Glucan", "Fiber", "Protein"] },
    { emoji: "🧊", name: "Tofu", category: "Plant Protein", reason: "Complete plant protein; excellent for heart health.", nutrients: ["Protein", "Calcium", "Iron"] },
    { emoji: "🥚", name: "Egg", category: "Protein", reason: "Affordable complete nutrition with all essential aminos.", nutrients: ["Protein", "B12", "Vitamin D"] },
    { emoji: "🐠", name: "Tuna", category: "Fish", reason: "Very high protein and B12 for metabolic health.", nutrients: ["Protein", "B12", "Selenium"] },
    { emoji: "🧄", name: "Garlic", category: "Spice", reason: "Contains allicin which may help improve blood pressure.", nutrients: ["Vitamin C", "Manganese", "B6"] }
  ],
  senior: [
    { emoji: "🐟", name: "Salmon", category: "Fish", reason: "Vitamin D & omega-3 combat age-related bone loss.", nutrients: ["Vitamin D", "Omega-3", "B12"] },
    { emoji: "🍶", name: "Yogurt", category: "Dairy", reason: "Probiotics for gut health; calcium for senior bones.", nutrients: ["Calcium", "Probiotics", "Protein"] },
    { emoji: "🥬", name: "Spinach", category: "Vegetable", reason: "Vitamin K supports bone density; folate for brain.", nutrients: ["Vitamin K", "Iron", "Folate"] },
    { emoji: "🥕", name: "Carrot", category: "Vegetable", reason: "Vitamin A supports eye health that declines with age.", nutrients: ["Vitamin A", "Fiber", "Potassium"] },
    { emoji: "🥚", name: "Egg", category: "Protein", reason: "Easy to eat; high B12 & Vitamin D often low in seniors.", nutrients: ["B12", "Vitamin D", "Protein"] },
    { emoji: "🌾", name: "Oats", category: "Grain", reason: "Fiber controls blood sugar & cholesterol in seniors.", nutrients: ["Fiber", "Beta-Glucan", "Zinc"] },
    { emoji: "🐟", name: "Sardines", category: "Fish", reason: "Soft bones provide extra calcium; high in B12 and Omega-3.", nutrients: ["Calcium", "B12", "Omega-3"] },
    { emoji: "🧡", name: "Papaya", category: "Fruit", reason: "Contains enzymes that aid digestion and high Vitamin C.", nutrients: ["Vitamin C", "Vitamin A", "Fiber"] }
  ]
};
