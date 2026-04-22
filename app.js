// Add these new features to your existing app.js

// 1. DIET RECOMMENDATION ENGINE
const ageGuidelines = {
    child: ["Whole Milk", "Soft Fruits", "Pureed Veggies"],
    teen: ["Grilled Chicken", "Eggs", "Quinoa", "Greek Yogurt"],
    adult: ["Lean Beef", "Leafy Greens", "Nuts", "Avocado"],
    senior: ["Fish (Omega-3)", "High Fiber Oats", "Berries"]
};

function updateDietList(age) {
    const list = document.getElementById('dietList');
    list.innerHTML = "";
    let category = age < 13 ? "child" : age < 20 ? "teen" : age < 60 ? "adult" : "senior";

    ageGuidelines[category].forEach(item => {
        let li = document.createElement('li');
        li.textContent = `⭐ ${item}`;
        list.appendChild(li);
    });
}

// 2. CHATBOT LOGIC (Simple AI Simulation)
const chatInput = document.getElementById('chatInput');
const chatDisplay = document.getElementById('chatDisplay');

document.getElementById('sendChat').addEventListener('click', () => {
    const msg = chatInput.value.toLowerCase();
    let response = "I'm not sure, but eating more protein helps!";

    if (msg.includes("muscle")) response = "For muscle, focus on Chicken and Eggs.";
    if (msg.includes("weight")) response = "Try adding more fiber and drinking water.";
    if (msg.includes("energy")) response = "Oats and Bananas are great for energy!";

    const userP = document.createElement('p');
    userP.className = "user-msg";
    userP.textContent = chatInput.value;

    const botP = document.createElement('p');
    botP.className = "bot-msg";
    botP.textContent = response;

    chatDisplay.appendChild(userP);
    chatDisplay.appendChild(botP);
    chatInput.value = "";
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

// 3. INTEGRATION WITH YOUR SAVE BUTTON
// In your existing saveBtn listener, add:
// updateDietList(age);
// updateProgressBar(totalProtein);