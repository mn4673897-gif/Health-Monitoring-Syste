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
    { emoji:"🥛", name:"Milk",         category:"Dairy",         reason:"Builds strong bones — high in calcium & vitamin D.",        nutrients:["Calcium","Vitamin D","Protein"]   },
    { emoji:"🥚", name:"Egg",          category:"Protein",       reason:"Complete protein for brain & muscle development.",           nutrients:["Protein","B12","Iron"]            },
    { emoji:"🥦", name:"Broccoli",     category:"Vegetable",     reason:"Vitamin C & K boost immunity and bone health.",             nutrients:["Vitamin C","Fiber","Folate"]      },
    { emoji:"🍌", name:"Banana",       category:"Fruit",         reason:"Great energy source with heart-healthy potassium.",         nutrients:["Potassium","Carbs","B6"]          },
    { emoji:"🍗", name:"Chicken",      category:"Protein",       reason:"Lean protein with iron & B vitamins for energy.",           nutrients:["Protein","Iron","Niacin"]         },
    { emoji:"🍠", name:"Sweet Potato", category:"Vegetable",     reason:"Vitamin A for vision; complex carbs for sustained energy.", nutrients:["Vitamin A","Fiber","Potassium"]  }
  ],
  teen: [
    { emoji:"🥩", name:"Beef",         category:"Protein",       reason:"High iron & zinc crucial during puberty growth.",           nutrients:["Iron","Zinc","Protein"]           },
    { emoji:"🐟", name:"Salmon",       category:"Fish",          reason:"Omega-3 supports brain focus for studying teens.",          nutrients:["Omega-3","Vitamin D","Protein"]   },
    { emoji:"🥬", name:"Spinach",      category:"Vegetable",     reason:"Iron-rich — vital for teen girls; calcium for growth.",     nutrients:["Iron","Calcium","Folate"]         },
    { emoji:"🌾", name:"Oats",         category:"Grain",         reason:"Sustained energy & fiber for active school-day teens.",     nutrients:["Fiber","Carbs","Zinc"]            },
    { emoji:"🥜", name:"Almonds",      category:"Nut",           reason:"Healthy fats & magnesium for hormone balance.",             nutrients:["Vitamin E","Magnesium","Protein"] },
    { emoji:"🍠", name:"Sweet Potato", category:"Vegetable",     reason:"Vitamin A for teen skin; carbs fuel sports.",              nutrients:["Vitamin A","Fiber","Potassium"]  }
  ],
  adult: [
    { emoji:"🥑", name:"Avocado",      category:"Fruit",         reason:"Heart-healthy fats lower cholesterol in adults.",           nutrients:["Healthy Fat","Potassium","Fiber"] },
    { emoji:"🐟", name:"Salmon",       category:"Fish",          reason:"Reduces inflammation; supports heart health.",              nutrients:["Omega-3","Vitamin D","B12"]       },
    { emoji:"🥦", name:"Broccoli",     category:"Vegetable",     reason:"Antioxidants fight stress; Vitamin C boosts immunity.",     nutrients:["Vitamin C","Folate","Fiber"]      },
    { emoji:"🌾", name:"Oats",         category:"Grain",         reason:"Lowers LDL cholesterol; great fiber-rich breakfast.",       nutrients:["Beta-Glucan","Fiber","Protein"]   },
    { emoji:"🧊", name:"Tofu",         category:"Plant Protein", reason:"Complete plant protein; excellent for heart health.",       nutrients:["Protein","Calcium","Iron"]        },
    { emoji:"🥚", name:"Egg",          category:"Protein",       reason:"Affordable complete nutrition with all essential aminos.",  nutrients:["Protein","B12","Vitamin D"]       }
  ],
  senior: [
    { emoji:"🐟", name:"Salmon",       category:"Fish",          reason:"Vitamin D & omega-3 combat age-related bone loss.",         nutrients:["Vitamin D","Omega-3","B12"]       },
    { emoji:"🍶", name:"Yogurt",       category:"Dairy",         reason:"Probiotics for gut health; calcium for senior bones.",      nutrients:["Calcium","Probiotics","Protein"]  },
    { emoji:"🥬", name:"Spinach",      category:"Vegetable",     reason:"Vitamin K supports bone density; folate for brain.",        nutrients:["Vitamin K","Iron","Folate"]       },
    { emoji:"🥕", name:"Carrot",       category:"Vegetable",     reason:"Vitamin A supports eye health that declines with age.",     nutrients:["Vitamin A","Fiber","Potassium"]  },
    { emoji:"🥚", name:"Egg",          category:"Protein",       reason:"Easy to eat; high B12 & Vitamin D often low in seniors.",  nutrients:["B12","Vitamin D","Protein"]       },
    { emoji:"🌾", name:"Oats",         category:"Grain",         reason:"Fiber controls blood sugar & cholesterol in seniors.",      nutrients:["Fiber","Beta-Glucan","Zinc"]      }
  ]
};
