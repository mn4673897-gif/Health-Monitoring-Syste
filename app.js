import { db } from './firebase-config.js';
import { translations } from './languages.js';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Basic Nutritional Logic
const foodLibrary = {
    "egg": { protein: 6, nutrients: "Vitamin D, Choline", benefit: "Good for brain health" },
    "chicken": { protein: 27, nutrients: "B6, Phosphorus", benefit: "Helps muscle repair" },
    "rice": { protein: 2.7, nutrients: "Carbohydrates", benefit: "Provides quick energy" }
};

const saveBtn = document.getElementById('saveBtn');
const langBtn = document.getElementById('langBtn');

// Function to Analyze Food based on Age
function getAgeAdvice(age, food) {
    let advice = "";
    if (age < 12) advice = "Great for growing kids!";
    else if (age < 20) advice = "Excellent for active teenagers.";
    else advice = "Good for maintaining adult metabolic health.";
    return advice;
}

// Save Data to Firebase
saveBtn.addEventListener('click', async () => {
    const age = document.getElementById('userAge').value;
    const food = document.getElementById('foodInput').value.toLowerCase();

    if (!age || !food) return alert("Please fill all fields");

    const nutrition = foodLibrary[food] || { protein: "Unknown", nutrients: "Natural minerals", benefit: "General nutrition" };
    const advice = getAgeAdvice(age, food);

    try {
        await addDoc(collection(db, "health_logs"), {
            age: parseInt(age),
            food: food,
            protein: nutrition.protein,
            benefit: nutrition.benefit,
            timestamp: new Date()
        });

        document.getElementById('resultArea').classList.remove('hidden');
        document.getElementById('analysisText').innerHTML = `
            <strong>Protein:</strong> ${nutrition.protein}g <br>
            <strong>Benefit:</strong> ${nutrition.benefit} <br>
            <strong>Advice:</strong> ${advice}
        `;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

// Real-time Database Listener (Updates History automatically)
const q = query(collection(db, "health_logs"), orderBy("timestamp", "desc"), limit(5));
onSnapshot(q, (snapshot) => {
    const logList = document.getElementById('logList');
    logList.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        li.textContent = `${data.food.toUpperCase()} - Age: ${data.age} (${data.protein}g Protein)`;
        logList.appendChild(li);
    });
});

// Language Switcher Logic
langBtn.addEventListener('change', (e) => {
    const lang = e.target.value;
    document.getElementById('ui-header').textContent = translations[lang].header;
    document.getElementById('ui-age-label').textContent = translations[lang].ageLabel;
    document.getElementById('ui-food-label').textContent = translations[lang].foodLabel;
    saveBtn.textContent = translations[lang].btn;
    document.getElementById('ui-history').textContent = translations[lang].history;
});