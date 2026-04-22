import { db } from './firebase-config.js';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const foodDB = {
    "egg": { p: 6, b: "Brain health & repair" },
    "chicken": { p: 27, b: "Muscle growth" },
    "milk": { p: 8, b: "Stronger bones" },
    "fish": { p: 22, b: "Heart health" }
};

const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('click', async () => {
    const age = document.getElementById('userAge').value;
    const food = document.getElementById('foodInput').value.toLowerCase();

    if (!age || !food) return;

    const info = foodDB[food] || { p: "N/A", b: "General Nutrition" };

    try {
        await addDoc(collection(db, "health_logs"), {
            age: parseInt(age),
            food: food,
            protein: info.p,
            benefit: info.b,
            timestamp: new Date()
        });

        document.getElementById('resultArea').classList.remove('hidden');
        document.getElementById('analysisText').innerHTML = `<strong>${food.toUpperCase()}</strong>: Provides ${info.p}g protein. ${info.b}.`;
    } catch (e) {
        console.error(e);
    }
});

// Real-time listener for history
const q = query(collection(db, "health_logs"), orderBy("timestamp", "desc"), limit(4));
onSnapshot(q, (snapshot) => {
    const logList = document.getElementById('logList');
    logList.innerHTML = "";
    snapshot.forEach((doc) => {
        const d = doc.data();
        logList.innerHTML += `<div class="log-item"><span>${d.food}</span><span style="color:#818cf8">${d.protein}g P</span></div>`;
    });
});