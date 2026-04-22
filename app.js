import { db } from './firebase-config.js';
import { translations } from './languages.js';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// 1. DATA REPOSITORY
const nutritionData = {
    "egg": { p: 6, b: "Brain & Cell Repair", diet: ["Boiled Egg", "Spinach Salad"] },
    "chicken": { p: 27, b: "Muscle Growth & Recovery", diet: ["Grilled Breast", "Quinoa Bowl"] },
    "milk": { p: 8, b: "Bone Density & Strength", diet: ["Oatmeal", "Yogurt Parfait"] }
};

let totalProtein = 0;

// 2. MAIN LOGIC: SAVE & ANALYZE
document.getElementById('saveBtn').addEventListener('click', async () => {
    const age = document.getElementById('userAge').value;
    const food = document.getElementById('foodInput').value.toLowerCase();

    if (!age || !food) return alert("Fields Required!");

    const stats = nutritionData[food] || { p: 5, b: "General Health Support", diet: ["Balanced Veggies"] };

    try {
        await addDoc(collection(db, "health_logs"), {
            age: parseInt(age),
            food: food,
            protein: stats.p,
            timestamp: new Date()
        });

        showResult(food, stats, age);
        updateDiet(stats.diet);
    } catch (e) { console.error(e); }
});

function showResult(food, stats, age) {
    const res = document.getElementById('resultArea');
    res.classList.remove('hidden');
    document.getElementById('analysisText').innerHTML = `
        <strong>${food.toUpperCase()}</strong> detected.<br>
        Provides ${stats.p}g protein. Benefit: ${stats.b}.
    `;
}

function updateDiet(items) {
    const list = document.getElementById('dietList');
    list.innerHTML = items.map(i => `<li>✨ ${i}</li>`).join('');
}

// 3. CHATBOT SIMULATION
document.getElementById('sendChat').addEventListener('click', () => {
    const input = document.getElementById('chatInput');
    const display = document.getElementById('chatDisplay');
    const msg = input.value.toLowerCase();

    let reply = "Focus on lean proteins for a steady progress!";
    if (msg.includes("gain")) reply = "To gain, increase protein to 1.2g per kg of weight.";
    if (msg.includes("best")) reply = "Eggs and Fish are top-tier for your age group.";

    display.innerHTML += `<p style="color:var(--secondary)">You: ${input.value}</p>`;
    display.innerHTML += `<p>Bot: ${reply}</p>`;
    input.value = "";
    display.scrollTop = display.scrollHeight;
});

// 4. REAL-TIME DASHBOARD UPDATE
const q = query(collection(db, "health_logs"), orderBy("timestamp", "desc"), limit(10));
onSnapshot(q, (snapshot) => {
    totalProtein = 0;
    snapshot.forEach(doc => totalProtein += (doc.data().protein || 0));

    const percent = Math.min((totalProtein / 50) * 100, 100);
    document.getElementById('progressBar').style.width = percent + "%";
    document.getElementById('progressText').textContent = `${totalProtein}g / 50g Goal`;
});