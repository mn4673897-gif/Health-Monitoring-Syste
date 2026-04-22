import { db } from './firebase-config.js';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const foodDatabase = {
    "egg": { p: 6, b: "Brain health", diet: ["Boiled Egg", "Omelet"] },
    "chicken": { p: 27, b: "Muscle growth", diet: ["Grilled Breast", "Salad"] },
    "fish": { p: 22, b: "Heart health", diet: ["Baked Fish", "Sushi"] }
};

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveBtn');
    const sendChat = document.getElementById('sendChat');

    // --- FUNCTION 1: SAVE & ANALYZE ---
    saveBtn.addEventListener('click', async () => {
        const age = document.getElementById('userAge').value;
        const food = document.getElementById('foodInput').value.toLowerCase().trim();

        if (!age || !food) return alert("Please fill in age and food!");

        const info = foodDatabase[food] || { p: 5, b: "General Nutrition", diet: ["Balanced Meal"] };

        try {
            await addDoc(collection(db, "health_logs"), {
                age: parseInt(age),
                food: food,
                protein: info.p,
                timestamp: new Date()
            });

            // Update Recommendation UI
            const resArea = document.getElementById('resultArea');
            resArea.classList.remove('hidden');
            document.getElementById('analysisText').innerHTML = `<strong>${food.toUpperCase()}</strong>: ${info.p}g Protein. ${info.b}.`;

            const dietList = document.getElementById('dietList');
            dietList.innerHTML = info.diet.map(item => `<li>⭐ ${item}</li>`).join('');

        } catch (e) { console.error("Firebase Error:", e); }
    });

    // --- FUNCTION 2: CHATBOT ---
    sendChat.addEventListener('click', () => {
        const input = document.getElementById('chatInput');
        const display = document.getElementById('chatDisplay');
        const msg = input.value.toLowerCase();
        let reply = "Eat more protein to stay healthy!";

        if (msg.includes("gain")) reply = "Try eating 1.2g of protein per kg of body weight.";
        if (msg.includes("diet")) reply = "A balanced diet for your age includes lean protein and greens.";

        display.innerHTML += `<p style="color:#a855f7">You: ${input.value}</p>`;
        display.innerHTML += `<p>Bot: ${reply}</p>`;
        input.value = "";
        display.scrollTop = display.scrollHeight;
    });

    // --- FUNCTION 3: REAL-TIME DASHBOARD ---
    const q = query(collection(db, "health_logs"), orderBy("timestamp", "desc"), limit(10));
    onSnapshot(q, (snapshot) => {
        let total = 0;
        snapshot.forEach(doc => total += (doc.data().protein || 0));
        const percent = Math.min((total / 50) * 100, 100);
        document.getElementById('progressBar').style.width = percent + "%";
        document.getElementById('progressText').textContent = `${total}g / 50g Daily Goal`;
    });
});