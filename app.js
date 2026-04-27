// ── State ───────────────────────────────────────────────────────────────────
let userAge = null, ageGroup = null, userGender = 'male';
let currentUser = null;
let isSubscribed = false;
let isAISubscribed = false;
let isAdmin = false;
let currentDailyIntake = { calories:0, protein:0, carbs:0, fat:0, fiber:0, vitaminC:0, calcium:0, iron:0, potassium:0, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0 };
let dailyFoodLog = [];
let lastAnalyzedFood = null;
let lastAnalyzedQuery = null;
function getNeeds() { return getDailyNeeds(ageGroup, userGender); }
function selectGender(g) {
    userGender = g;
    document.getElementById('genderMale').classList.toggle('active', g==='male');
    document.getElementById('genderFemale').classList.toggle('active', g==='female');
    if (userAge) { 
        const n=getNeeds(); 
        document.getElementById('profileIcon').textContent=n.icon; 
        document.getElementById('profileInfo').textContent=`Age ${userAge} · ${n.label}`; 
        renderDashboard(); 
        renderStickyBar(); 
        renderDailyFoodLog();
    }
}

const historyRef = db.ref("nutrisense/history");
// auth is initialized in firebase-config.js

// ── Firebase Connection ──────────────────────────────────────────────────────
db.ref(".info/connected").on("value", snap => {
    const ok = snap.val();
    document.getElementById("dbDot").className = "db-dot " + (ok ? "connected" : "error");
    document.getElementById("dbLabel").textContent = ok ? "Firebase Connected" : "Offline";
});

// ── History Listener ─────────────────────────────────────────────────────────
historyRef.orderByChild("timestamp").limitToLast(50).on("value", snap => {
    const data = snap.val();
    const grid = document.getElementById("historyGrid");
    const empty = document.getElementById("historyEmpty");
    const count = document.getElementById("historyCount");
    if (!data) { grid.innerHTML = ""; empty.classList.remove("hidden"); count.textContent = "0 analyses saved"; return; }
    const entries = Object.entries(data).reverse();
    count.textContent = `${entries.length} analyse${entries.length !== 1 ? "s" : ""} saved`;
    empty.classList.add("hidden");
    grid.innerHTML = entries.map(([, e]) => `
    <div class="history-card" onclick="quickAnalyze('${e.food.toLowerCase()}')">
      <div class="history-card-top"><div class="history-food">${e.emoji} ${e.food}</div><div class="history-score">⭐ ${e.score}</div></div>
      <div class="history-age">${e.ageIcon} ${e.ageLabel} · Age ${e.age}</div>
      <div class="history-macros">
        <span class="history-macro">🔥 ${e.calories} kcal</span>
        <span class="history-macro">💪 ${e.protein}g protein</span>
        <span class="history-macro">⚡ ${e.carbs}g carbs</span>
      </div>
      <div class="history-time">🕐 ${new Date(e.timestamp).toLocaleString()}</div>
    </div>`).join("");
});

// ── Auth State ───────────────────────────────────────────────────────────────
auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        document.getElementById("loginBtn").classList.add("hidden");
        document.getElementById("userProfileHeader").classList.remove("hidden");
        document.getElementById("userNameHeader").textContent = user.email.split('@')[0];
        db.ref(`nutrisense/users/${user.uid}`).on("value", snap => {
            const data = snap.val() || {};
            isAdmin = data.isAdmin || false;
            isSubscribed = true; // All logged-in users get standard features
            isAISubscribed = isAdmin || data.aiSubscribed || false;
        });
        const today = new Date().toISOString().split('T')[0];
        db.ref(`nutrisense/intake/${user.uid}/${today}`).on("value", snap => {
            currentDailyIntake = snap.val() || { calories:0, protein:0, carbs:0, fat:0, fiber:0, vitaminC:0, calcium:0, iron:0, potassium:0, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0 };
            if (isSubscribed) { renderDashboard(); renderStickyBar(); }
        });
    } else {
        document.getElementById("loginBtn").classList.remove("hidden");
        document.getElementById("userProfileHeader").classList.add("hidden");
        isSubscribed = false; isAISubscribed = false; isAdmin = false;
    }
});

// ── Modal Helpers ────────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.remove("hidden"); }
function closeModal(id) { document.getElementById(id).classList.add("hidden"); }

function switchAuthTab(type) {
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    event.target.classList.add("active");
    document.getElementById("userAuthFields").classList.toggle("hidden", type !== "user");
    document.getElementById("adminAuthFields").classList.toggle("hidden", type !== "admin");
}

// ── Login ────────────────────────────────────────────────────────────────────
async function handleLogin(type) {
    if (type === 'admin') {
        const pass = document.getElementById("adminPass").value;
        if (pass === "mikeakosayo1234") {
            isAdmin = true; isSubscribed = true; isAISubscribed = true;
            document.getElementById("loginBtn").classList.add("hidden");
            document.getElementById("userProfileHeader").classList.remove("hidden");
            document.getElementById("userNameHeader").textContent = "Admin 👑";
            closeModal("authModal");
            alert("✅ Admin Access Granted! All features unlocked.");
        } else {
            alert("❌ Invalid Admin Password!");
        }
        return;
    }
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value;
    if (!email || !pass) { alert("Please enter your email and password."); return; }
    if (pass.length < 6) { alert("Password must be at least 6 characters."); return; }
    try {
        await auth.signInWithEmailAndPassword(email, pass);
        closeModal("authModal");
    } catch (e) {
        // Try to create account if not found
        if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential' || e.code === 'auth/invalid-email') {
            try {
                await auth.createUserWithEmailAndPassword(email, pass);
                closeModal("authModal");
                alert("✅ New account created and logged in!");
            } catch (e2) {
                showAuthError(e2.code);
            }
        } else {
            showAuthError(e.code);
        }
    }
}

function showAuthError(code) {
    const msgs = {
        'auth/email-already-in-use':   '⚠️ Email already in use. Try logging in instead.',
        'auth/weak-password':           '⚠️ Password too weak. Use at least 6 characters.',
        'auth/wrong-password':          '❌ Incorrect password. Please try again.',
        'auth/invalid-email':           '⚠️ Invalid email format.',
        'auth/user-not-found':          '⚠️ No account found. A new one was attempted.',
        'auth/too-many-requests':       '🚫 Too many attempts. Please try again later.',
        'auth/network-request-failed':  '🌐 Network error. Check your internet connection.',
        'auth/operation-not-allowed':   '🚫 Email/Password login not enabled in Firebase Console. Go to Firebase → Authentication → Sign-in Methods → Enable Email/Password.'
    };
    alert(msgs[code] || `Error: ${code}`);
}

function logout() {
    if (isAdmin && !currentUser) {
        isAdmin = false; isSubscribed = false; isAISubscribed = false;
        document.getElementById("loginBtn").classList.remove("hidden");
        document.getElementById("userProfileHeader").classList.add("hidden");
    } else { auth.signOut(); }
}

// ── Subscription ─────────────────────────────────────────────────────────────
function handleSubscription(tier) {
    if (!currentUser && !isAdmin) { alert("Please login first."); openModal("authModal"); return; }
    const price = tier === 'ai' ? "₱99.00" : "₱45.00";
    const name = tier === 'ai' ? "AI Vision" : "Pro";
    // READY FOR PAYMENT API - replace this block with actual payment gateway
    if (confirm(`Proceed with ${price} payment for NutriSense ${name}?\n\n(Payment API integration point)`)) {
        if (currentUser) {
            const updateData = tier === 'ai' ? { aiSubscribed: true } : { subscribed: true };
            db.ref(`nutrisense/users/${currentUser.uid}`).update(updateData);
        }
        if (tier === 'ai') isAISubscribed = true;
        else isSubscribed = true;
        alert(`✅ NutriSense ${name} activated!`);
        closeModal(tier === 'ai' ? "aiSubModal" : "subModal");
    }
}

// ── AI Vision Scanner ────────────────────────────────────────────────────────
function openAIScanner() {
    if (!currentUser && !isAdmin) { alert("Please login to use AI Vision."); openModal("authModal"); return; }
    if (!isAISubscribed) { openModal("aiSubModal"); return; }
    openModal("scannerModal");
}

function simulateScan() {
    const dish = document.getElementById("dishDescription").value.trim().toLowerCase();
    if (!dish) { alert("Please describe the dish first!"); return; }
    closeModal("scannerModal");
    document.getElementById("foodInput").value = dish;
    const lt = document.querySelector(".loading-text");
    if (lt) lt.innerHTML = "🤖 AI Vision Analyzing Dish<span class='dots'></span>";
    document.getElementById("resultsPanel").classList.add("hidden");
    document.getElementById("loadingIndicator").classList.remove("hidden");
    setTimeout(() => { analyzeFood(); }, 1500);
}

// ── Daily Intake ─────────────────────────────────────────────────────────────
function addToDaily(foodData) {
    const keys = ['calories','protein','carbs','fat','fiber','vitaminC','calcium','iron','potassium','vitaminA','vitaminD','vitaminB12','zinc'];
    keys.forEach(k => { if (foodData[k] != null) currentDailyIntake[k] = (currentDailyIntake[k] || 0) + foodData[k]; });
    
    if (currentUser) {
        const today = new Date().toISOString().split('T')[0];
        db.ref(`nutrisense/intake/${currentUser.uid}/${today}`).set(currentDailyIntake);
    }
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function renderDashboard() {
    if (!userAge) return;
    const n = getNeeds(), m = n.max;
    const trackers = [
        { name:"Calories",  val:currentDailyIntake.calories,  target:n.calories,  limit:m.calories,  unit:"kcal", icon:"🔥" },
        { name:"Protein",   val:currentDailyIntake.protein,   target:n.protein,   limit:m.protein,   unit:"g",    icon:"💪" },
        { name:"Carbs",     val:currentDailyIntake.carbs,     target:n.carbs,     limit:m.carbs,     unit:"g",    icon:"⚡" },
        { name:"Fat",       val:currentDailyIntake.fat,       target:n.fat,       limit:m.fat,       unit:"g",    icon:"🫒" },
        { name:"Fiber",     val:currentDailyIntake.fiber,     target:n.fiber,     limit:m.fiber,     unit:"g",    icon:"🌿" },
        { name:"Vitamin C", val:currentDailyIntake.vitaminC,  target:n.vitaminC,  limit:m.vitaminC,  unit:"mg",   icon:"🍊" },
        { name:"Calcium",   val:currentDailyIntake.calcium,   target:n.calcium,   limit:m.calcium,   unit:"mg",   icon:"🦴" },
        { name:"Iron",      val:currentDailyIntake.iron,      target:n.iron,      limit:m.iron,      unit:"mg",   icon:"🩸" },
        { name:"Zinc",      val:currentDailyIntake.zinc,      target:n.zinc,      limit:m.zinc,      unit:"mg",   icon:"🛡️" }
    ];
    document.getElementById("dashboardGrid").innerHTML = trackers.map(t => {
        const pct = Math.min((t.val / t.limit) * 100, 100);
        const limitPos = Math.min((t.target / t.limit) * 100, 100);
        const isOver = t.val > t.limit;
        const overAmt = Math.round(t.val - t.limit);
        const displayVal = isOver ? `-${overAmt}` : Math.round(t.val);
        const status = isOver ? "status-danger" : t.val > t.target ? "status-warning" : "status-safe";
        const statusTxt = isOver ? `⚠️ EXCEEDED by ${overAmt}${t.unit}` : t.val > t.target ? "✅ Target Met (Watch Limit)" : "✅ Optimal Range";
        return `<div class="dashboard-card">
            <div class="dash-header"><span class="dash-title">${t.icon} ${t.name}</span>
            <span class="dash-value ${isOver ? 'negative' : ''}">${displayVal}<small>${t.unit}</small></span></div>
            <div class="dash-progress-container">
                <div class="dash-progress-fill" style="width:${pct}%;background:${isOver ? '#ef4444' : 'var(--teal)'}"></div>
                <div class="dash-limit-marker" style="left:${limitPos}%"></div>
            </div>
            <div class="dash-meta"><span>Target: ${t.target}${t.unit}</span><span>Max: ${t.limit}${t.unit}</span></div>
            <div class="dash-status ${status}">${statusTxt}</div>
        </div>`;
    }).join("");
}

// ── Meal Plans ────────────────────────────────────────────────────────────────
function renderMealPlans() {
    if (!userAge || !mealPlans[ageGroup]) return;
    const plans = mealPlans[ageGroup];
    document.getElementById("plansGrid").innerHTML = plans.map(p => `
        <div class="plan-card">
            <div class="plan-badge">Daily Plan</div>
            <h3 class="plan-name">${p.name}</h3>
            <p class="plan-desc">${p.description}</p>
            <div class="plan-items">${p.items.map(item => `<span class="plan-item-tag" onclick="quickAnalyze('${item.toLowerCase()}')">➕ ${item}</span>`).join("")}</div>
            <button class="btn-plan-add" onclick="addPlanToDaily('${p.name.replace(/'/g,"\\'")}')">📥 Add Whole Plan to Daily</button>
        </div>`).join("");
}

function addPlanToDaily(planName) {
    if (!currentUser) { alert("Please login to track intake."); openModal("authModal"); return; }
    const plan = mealPlans[ageGroup].find(p => p.name === planName);
    if (!plan) return;
    plan.items.forEach(item => { const food = findFood(item.toLowerCase()); if (food) addToDaily(food); });
    alert(`✅ "${planName}" added to your Daily Intake!`);
}

// ── Meal Builder ───────────────────────────────────────────────────────────────
let builderMeal = []; // Array of { name, emoji, data }

function openBuilder() {
    if (!currentUser && !isAdmin) {
        alert("Please login to use the Custom Meal Builder.");
        openModal("authModal");
        return;
    }
    if (!userAge) {
        alert("Please enter your age first to get personalized suggestions.");
        return;
    }
    document.getElementById("builderAgeLabel").textContent =
        `Building meal for ${getNeeds().icon} ${getNeeds().label} (Age ${userAge})`;
    renderBuilderUI();
    openModal("builderModal");
}

function addFoodToBuilder() {
    const input = document.getElementById("builderFoodInput");
    const q = input.value.trim().toLowerCase();
    if (!q) return;
    const food = findFood(q);
    if (!food) { input.style.borderColor = "#ef4444"; setTimeout(() => input.style.borderColor = "", 2000); return; }
    const name = q.charAt(0).toUpperCase() + q.slice(1);
    builderMeal.push({ name, emoji: food.emoji, data: food });
    input.value = "";
    renderBuilderUI();
}

function removeFoodFromBuilder(idx) {
    builderMeal.splice(idx, 1);
    renderBuilderUI();
}

function clearBuilder() {
    builderMeal = [];
    renderBuilderUI();
}

function renderBuilderUI() {
    const n = getNeeds();
    // ── Food list
    const listEl = document.getElementById("builderFoodsList");
    if (builderMeal.length === 0) {
        listEl.innerHTML = "<p class='builder-empty'>No foods added yet. Type a food above to start.</p>";
    } else {
        listEl.innerHTML = builderMeal.map((item, i) => `
            <div class="builder-food-item">
                <input type="checkbox" ${item.selected !== false ? 'checked' : ''} onchange="toggleBuilderFood(${i})" title="Include in Dashboard">
                <span class="builder-food-emoji">${item.emoji}</span>
                <span class="builder-food-name">${item.name}</span>
                <span class="builder-food-cals">🔥 ${item.data.calories} kcal</span>
                <span class="builder-food-protein">💪 ${item.data.protein}g</span>
                <button class="builder-remove-btn" onclick="removeFoodFromBuilder(${i})">✕</button>
            </div>`).join("");
    }

    // ── Compute totals
    const totals = { calories:0, protein:0, carbs:0, fat:0, fiber:0, vitaminC:0, calcium:0, iron:0, potassium:0, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0 };
    builderMeal.forEach(item => { Object.keys(totals).forEach(k => { totals[k] += item.data[k] || 0; }); });

    // ── Macro summary
    document.getElementById("builderTotalSummary").innerHTML = builderMeal.length > 0 ? `
        <div class="builder-macro-row">
            <span>🔥 ${Math.round(totals.calories)} kcal</span>
            <span>💪 ${Math.round(totals.protein)}g protein</span>
            <span>⚡ ${Math.round(totals.carbs)}g carbs</span>
            <span>🫒 ${Math.round(totals.fat)}g fat</span>
            <span>🌿 ${Math.round(totals.fiber)}g fiber</span>
        </div>` : "";

    // ── Nutrient bars
    const trackedNutrients = [
        { key:"calories",  label:"Calories",   unit:"kcal", target:n.calories },
        { key:"protein",   label:"Protein",    unit:"g",    target:n.protein },
        { key:"carbs",     label:"Carbs",      unit:"g",    target:n.carbs },
        { key:"fat",       label:"Fat",        unit:"g",    target:n.fat },
        { key:"vitaminC",  label:"Vitamin C",  unit:"mg",   target:n.vitaminC },
        { key:"calcium",   label:"Calcium",    unit:"mg",   target:n.calcium },
        { key:"iron",      label:"Iron",       unit:"mg",   target:n.iron },
        { key:"zinc",      label:"Zinc",       unit:"mg",   target:n.zinc }
    ];
    document.getElementById("builderBars").innerHTML = trackedNutrients.map(tr => {
        const val = totals[tr.key];
        const pct = Math.min(Math.round((val / tr.target) * 100), 100);
        const color = pct >= 80 ? "var(--green)" : pct >= 40 ? "var(--yellow)" : "#ef4444";
        return `<div class="builder-bar-row">
            <div class="builder-bar-label">${tr.label}</div>
            <div class="micro-track" style="flex:1;margin:0 10px">
                <div class="micro-fill" style="width:${pct}%;background:${color};transition:width 0.8s ease"></div>
            </div>
            <div style="font-size:.8rem;color:${color};min-width:80px;text-align:right">
                ${Math.round(val)}/${tr.target}${tr.unit}
            </div>
        </div>`;
    }).join("");

    // ── Smart suggestions based on remaining gaps
    const gaps = trackedNutrients
        .filter(tr => totals[tr.key] < tr.target * 0.8)
        .sort((a, b) => (totals[a.key] / a.target) - (totals[b.key] / b.target)); // Most deficient first

    if (gaps.length === 0) {
        document.getElementById("builderSuggestions").innerHTML =
            "<div class='builder-complete'><span>🎉</span><p>Great! Your meal covers most of your daily needs!</p></div>";
        return;
    }

    // Find best food for each gap (not already in the builder)
    const addedNames = new Set(builderMeal.map(m => m.name.toLowerCase()));
    const seen = new Set();
    const suggestionsHtml = gaps.slice(0, 5).map(gap => {
        let bestFood = null, bestVal = 0;
        for (const [k, f] of Object.entries(foodDB)) {
            if (addedNames.has(k) || seen.has(k)) continue;
            if ((f[gap.key] || 0) > bestVal) { bestVal = f[gap.key]; bestFood = { name: k, ...f }; }
        }
        if (!bestFood) return "";
        seen.add(bestFood.name);
        const fillPct = Math.round((bestFood[gap.key] / gap.target) * 100);
        return `<div class="builder-suggestion-item" onclick="builderQuickAdd('${bestFood.name}')">
            <div class="bsi-left">
                <span class="bsi-emoji">${bestFood.emoji}</span>
                <div>
                    <div class="bsi-name">${bestFood.emoji} ${bestFood.name}</div>
                    <div class="bsi-reason">Fills <strong>${gap.label}</strong> gap by +${fillPct}%</div>
                </div>
            </div>
            <button class="bsi-add">+ Add</button>
        </div>`;
    }).filter(Boolean).join("");

    document.getElementById("builderSuggestions").innerHTML =
        suggestionsHtml || "<p class='builder-empty'>All gaps covered!</p>";
}

function builderQuickAdd(foodName) {
    const food = findFood(foodName);
    if (!food) return;
    const name = foodName.charAt(0).toUpperCase() + foodName.slice(1);
    builderMeal.push({ name, emoji: food.emoji, data: food });
    renderBuilderUI();
}

function saveBuilderPlan() {
    if (builderMeal.length === 0) { alert("Add some foods first!"); return; }
    if (!currentUser && !isAdmin) { alert("Please login to save."); return; }
    const plan = {
        name: `My Custom Plan (${new Date().toLocaleDateString()})`,
        items: builderMeal.map(m => m.name),
        ageGroup,
        savedAt: Date.now()
    };
    if (currentUser) {
        db.ref(`nutrisense/customPlans/${currentUser.uid}`).push(plan);
    }
    alert(`✅ "${plan.name}" saved! ${builderMeal.length} foods.`);
    closeModal("builderModal");
}

function toggleBuilderFood(idx) {
    if (builderMeal[idx].selected === undefined) builderMeal[idx].selected = false;
    else builderMeal[idx].selected = !builderMeal[idx].selected;
}

function addBuilderMealToDaily() {
    const selectedFoods = builderMeal.filter(item => item.selected !== false);
    if (selectedFoods.length === 0) { alert("Check some foods to add first!"); return; }
    
    selectedFoods.forEach(item => {
        addToDaily(item.data);
        dailyFoodLog.push({ name: item.name, emoji: item.emoji, data: item.data, timestamp: Date.now() });
    });
    
    renderDailyFoodLog();
    renderStickyBar();
    renderDashboard();
    closeModal("builderModal");
    alert(`✅ ${selectedFoods.length} foods added to your Daily Dashboard!`);
    
    setTimeout(() => {
        document.getElementById('daily-intake').scrollIntoView({behavior: 'smooth'});
    }, 100);
}


// ── Age ───────────────────────────────────────────────────────────────────────
function getAgeGroup(age) {
    if (age <= 12) return "child";
    if (age <= 17) return "teen";
    if (age <= 59) return "adult";
    return "senior";
}

function setAge() {
    const age = parseInt(document.getElementById("ageInput").value);
    if (!age || age < 1 || age > 120) {
        const inp = document.getElementById("ageInput");
        inp.style.borderColor = "#ef4444";
        setTimeout(() => inp.style.borderColor = "", 2000);
        return;
    }
    userAge = age; ageGroup = getAgeGroup(age);
    const n = getNeeds();
    document.getElementById("ageCard").classList.add("hidden");
    document.getElementById("profileBadge").classList.remove("hidden");
    document.getElementById("profileIcon").textContent = n.icon;
    document.getElementById("profileInfo").textContent = `Age ${age} · ${n.label}`;
    document.getElementById("agePrompt").classList.add("hidden");
    document.getElementById("suggestionsPrompt").classList.add("hidden");
    renderSuggestions();
    renderMealPlans();
    renderDashboard();
    renderStickyBar();
    renderDailyFoodLog();
}

function resetAge() {
    userAge = null; ageGroup = null;
    document.getElementById("profileBadge").classList.add("hidden");
    document.getElementById("ageCard").classList.remove("hidden");
    document.getElementById("ageInput").value = "";
    document.getElementById("suggestionsGrid").innerHTML = "";
    document.getElementById("suggestionsPrompt").classList.remove("hidden");
    document.getElementById("resultsPanel").classList.add("hidden");
    document.getElementById("plansGrid").innerHTML = "";
    document.getElementById("stickyDailyBar").classList.add("hidden");
}

// ── Food Lookup ───────────────────────────────────────────────────────────────
function findFood(q) {
    if (foodDB[q]) return foodDB[q];
    for (const k of Object.keys(foodDB)) if (k.includes(q) || q.includes(k)) return foodDB[k];
    return null;
}

function quickAnalyze(food) {
    document.getElementById("foodInput").value = food;
    document.getElementById("analyze").scrollIntoView({ behavior: "smooth" });
    setTimeout(analyzeFood, 400);
}

function analyzeFood() {
    const q = document.getElementById("foodInput").value.trim().toLowerCase();
    if (!q) return;
    if (!userAge) { document.getElementById("agePrompt").classList.remove("hidden"); document.getElementById("ageCard").scrollIntoView({ behavior: "smooth" }); return; }
    document.getElementById("agePrompt").classList.add("hidden");
    document.getElementById("resultsPanel").classList.add("hidden");
    document.getElementById("loadingIndicator").classList.remove("hidden");
    const lt = document.querySelector(".loading-text");
    if (lt) lt.innerHTML = "Analyzing nutrients<span class='dots'></span>";
    setTimeout(() => {
        const data = findFood(q);
        document.getElementById("loadingIndicator").classList.add("hidden");
        if (data) { renderResults(q, data); }
        else renderNotFound(q);
    }, 800);
}

// ── Render Results ────────────────────────────────────────────────────────────
function renderResults(query, d) {
    const n = getNeeds();
    const name = query.charAt(0).toUpperCase() + query.slice(1);
    lastAnalyzedFood = d;
    lastAnalyzedQuery = name;
    document.getElementById("resultsFoodName").textContent = `${d.emoji} ${name}`;
    document.getElementById("resultsMeta").textContent = `Per 100g · ${n.icon} ${n.label} (Age ${userAge})`;
    document.getElementById("scoreValue").textContent = d.score;

    const macros = [
        { icon:"🔥", name:"Calories", val:d.calories, unit:"kcal", pct:Math.round(d.calories/n.calories*100) },
        { icon:"💪", name:"Protein",  val:d.protein,  unit:"g",    pct:Math.round(d.protein/n.protein*100) },
        { icon:"⚡", name:"Carbs",   val:d.carbs,    unit:"g",    pct:Math.round(d.carbs/n.carbs*100) },
        { icon:"🫒", name:"Fat",      val:d.fat,      unit:"g",    pct:Math.round(d.fat/n.fat*100) },
        { icon:"🌿", name:"Fiber",    val:d.fiber,    unit:"g",    pct:Math.round(d.fiber/n.fiber*100) }
    ];
    document.getElementById("macroGrid").innerHTML = macros.map(m => `
    <div class="macro-card">
      <div class="macro-icon">${m.icon}</div>
      <div class="macro-value">${m.val}<span class="macro-unit"> ${m.unit}</span></div>
      <div class="macro-name">${m.name}</div>
      <div style="font-size:.75rem;color:var(--green);margin-top:4px">${m.pct}% of daily need</div>
    </div>`).join("");

    const micros = [
        { name:"Vitamin C",   val:d.vitaminC,  max:n.vitaminC,  unit:"mg",  maxUl:n.max.vitaminC },
        { name:"Calcium",     val:d.calcium,   max:n.calcium,   unit:"mg",  maxUl:n.max.calcium },
        { name:"Iron",        val:d.iron,      max:n.iron,      unit:"mg",  maxUl:n.max.iron },
        { name:"Potassium",   val:d.potassium, max:n.potassium, unit:"mg",  maxUl:n.max.potassium },
        { name:"Vitamin A",   val:d.vitaminA,  max:n.vitaminA,  unit:"mcg", maxUl:n.max.vitaminA },
        { name:"Vitamin D",   val:d.vitaminD,  max:n.vitaminD,  unit:"mcg", maxUl:n.max.vitaminD },
        { name:"Vitamin B12", val:d.vitaminB12,max:n.vitaminB12,unit:"mcg", maxUl:n.max.vitaminB12 },
        { name:"Zinc",        val:d.zinc,      max:n.zinc,      unit:"mg",  maxUl:n.max.zinc }
    ];
    document.getElementById("microBars").innerHTML = micros.map(m => {
        const pct = Math.min(Math.round(m.val / m.max * 100), 100);
        const color = pct >= 20 ? "var(--green)" : pct >= 10 ? "var(--yellow)" : "var(--text-muted)";
        return `<div class="micro-row">
        <div class="micro-label">${m.name}</div>
        <div class="micro-track"><div class="micro-fill" data-pct="${pct}" style="background:linear-gradient(90deg,${color},var(--teal))"></div></div>
        <div class="micro-vals">
            <span class="micro-pct" style="color:${color}">${pct}%</span>
            <span class="micro-limit">Max: ${m.maxUl}${m.unit}</span>
        </div></div>`;
    }).join("");

    const rec = buildRec(name, d);
    const rc = document.getElementById("recommendationCard");
    rc.className = `recommendation-card ${rec.cls}`;
    rc.innerHTML = `<strong>${rec.title}</strong><br/>${rec.body}`;
    document.getElementById("resultsPanel").classList.remove("hidden");
    document.getElementById("saveToast").classList.add("hidden");
    requestAnimationFrame(() => { document.querySelectorAll(".micro-fill").forEach(el => { el.style.width = el.dataset.pct + "%"; }); });

    historyRef.push({ food:name, emoji:d.emoji, score:d.score, calories:d.calories, protein:d.protein, carbs:d.carbs, age:userAge, ageGroup, ageIcon:n.icon, ageLabel:n.label, timestamp:Date.now() })
        .then(() => { const t = document.getElementById("saveToast"); t.classList.remove("hidden"); setTimeout(() => t.classList.add("hidden"), 3000); });
}

// ── Smart Recommendations ─────────────────────────────────────────────────────
function buildRec(name, d) {
    const n = getNeeds();
    const recs = [];
    const findRich = (nutrient) => { let best=null, mx=0; for (const [k,f] of Object.entries(foodDB)) { if(f[nutrient]>mx){mx=f[nutrient];best={name:k,...f};} } return best; };
    const check = (key, label, unit) => {
        const pct = (d[key]/n[key])*100;
        if (pct < 10) { const rich = findRich(key); if (rich) { const rp = Math.round((rich[key]/n[key])*100); recs.push(`<div class="smart-rec"><span class="rec-icon">💡</span><span>Low in <strong>${label}</strong> (${Math.round(pct)}%). Try <strong>${rich.emoji} ${rich.name}</strong> — ${rich[key]}${unit} (${rp}% of your daily need).</span></div>`); } }
    };
    check('protein','Protein','g'); check('vitaminC','Vitamin C','mg'); check('iron','Iron','mg'); check('calcium','Calcium','mg');
    const smartHtml = recs.length > 0 ? `<div class="smart-rec-container"><h4>🎯 Smart Suggestions to Complete Your Meal</h4>${recs.join('')}</div>` : "";

    let ageRec = "";
    if (ageGroup==="child") ageRec = d.calcium>50 ? `✅ <strong>Great for Kids!</strong><br/>${name} is rich in calcium for growing bones.` : `⚠️ <strong>Note:</strong><br/>Pair ${name} with calcium-rich foods.`;
    else if (ageGroup==="teen") ageRec = d.protein>15 ? `✅ <strong>Muscle Builder!</strong><br/>High protein supports teen development.` : `⚠️ <strong>Note:</strong><br/>Add iron/protein-rich foods for complete teen nutrition.`;
    else if (ageGroup==="adult") ageRec = d.calories>400 ? `🚫 <strong>Portion Control:</strong><br/>${name} is calorie-dense. Watch serving size.` : `✅ <strong>Excellent Choice!</strong><br/>Fits well into a balanced adult diet.`;
    else ageRec = d.vitaminD>2 ? `✅ <strong>Senior Health:</strong><br/>High Vitamin D supports bone health at 60+.` : `⚠️ <strong>Bone Health:</strong><br/>Pair with Vitamin D foods to support senior health.`;

    return { cls: d.score>=85?"rec-good":d.score>=70?"rec-moderate":"rec-caution", title:"Nutritional Insight", body: ageRec + smartHtml };
}

// ── Suggestions ───────────────────────────────────────────────────────────────
function renderSuggestions() {
    document.getElementById("suggestionsGrid").innerHTML = suggestions[ageGroup].map(s => `
      <div class="suggestion-card" onclick="quickAnalyze('${s.name.toLowerCase()}')">
        <div class="sug-top"><div class="sug-emoji">${s.emoji}</div><div><div class="sug-name">${s.name}</div><span class="sug-category">${s.category}</span></div></div>
        <div class="sug-reason">${s.reason}</div>
        <div class="sug-nutrients">${s.nutrients.map(n => `<span class="sug-tag">✓ ${n}</span>`).join("")}</div>
      </div>`).join("");
}

// ── Not Found ─────────────────────────────────────────────────────────────────
function renderNotFound(q) {
    const p = document.getElementById("resultsPanel");
    p.classList.remove("hidden");
    p.innerHTML = `<div style="text-align:center;padding:40px">
      <div style="font-size:3rem;margin-bottom:12px">🤔</div>
      <div style="font-size:1.3rem;font-weight:700;margin-bottom:8px">"${q}" not found</div>
      <div style="color:var(--text-muted);margin-bottom:20px">Try: banana, apple, chicken, rice, egg, avocado, salmon, adobo, sinigang...</div>
      <div class="quick-foods" style="justify-content:center">
        <button class="quick-btn" onclick="quickAnalyze('banana')">🍌 Banana</button>
        <button class="quick-btn" onclick="quickAnalyze('salmon')">🐟 Salmon</button>
        <button class="quick-btn" onclick="quickAnalyze('egg')">🥚 Egg</button>
        <button class="quick-btn" onclick="quickAnalyze('adobo')">🥘 Adobo</button>
      </div>
    </div>`;
}

// ── Clear History ─────────────────────────────────────────────────────────────
function clearHistory() {
    if (!confirm("Clear all saved analyses from Firebase?")) return;
    historyRef.remove();
}

// ── Daily Food Log & Sticky Bar ────────────────────────────────────────────────
function addCurrentFoodToDaily() {
    if (!lastAnalyzedFood) return;
    addToDaily(lastAnalyzedFood);
    dailyFoodLog.push({ name: lastAnalyzedQuery, emoji: lastAnalyzedFood.emoji, data: lastAnalyzedFood, timestamp: Date.now() });
    renderDailyFoodLog();
    renderStickyBar();
    renderDashboard();
    alert(`✅ ${lastAnalyzedQuery} added to your Daily Goal!`);
    setTimeout(() => {
        document.getElementById('daily-intake').scrollIntoView({behavior: 'smooth'});
    }, 100);
}

function removeFoodFromDaily(index) {
    const item = dailyFoodLog[index];
    if (!item) return;
    
    // Subtract from current intake
    const keys = ['calories','protein','carbs','fat','fiber','vitaminC','calcium','iron','potassium','vitaminA','vitaminD','vitaminB12','zinc'];
    keys.forEach(k => { 
        if (item.data[k] != null) {
            currentDailyIntake[k] = Math.max(0, (currentDailyIntake[k] || 0) - item.data[k]); 
        }
    });
    
    // Update DB
    if (currentUser) {
        const today = new Date().toISOString().split('T')[0];
        db.ref(`nutrisense/intake/${currentUser.uid}/${today}`).set(currentDailyIntake);
    }
    
    // Remove from log
    dailyFoodLog.splice(index, 1);
    renderDailyFoodLog();
    renderStickyBar();
    renderDashboard();
}

function clearDailyLog() {
    if (!confirm("Clear all foods from today's log? This resets your daily progress.")) return;
    
    currentDailyIntake = { calories:0, protein:0, carbs:0, fat:0, fiber:0, vitaminC:0, calcium:0, iron:0, potassium:0, vitaminA:0, vitaminD:0, vitaminB12:0, zinc:0 };
    if (currentUser) {
        const today = new Date().toISOString().split('T')[0];
        db.ref(`nutrisense/intake/${currentUser.uid}/${today}`).set(currentDailyIntake);
    }
    
    dailyFoodLog = [];
    renderDailyFoodLog();
    renderStickyBar();
    renderDashboard();
}

function renderDailyFoodLog() {
    document.getElementById("dailyFoodLog").classList.remove("hidden");
    const listEl = document.getElementById("foodLogList");
    
    if (dailyFoodLog.length === 0) {
        listEl.innerHTML = "<p class='builder-empty'>No foods added yet. Analyze a food and add it to your daily goal!</p>";
        return;
    }
    
    const n = getNeeds();
    listEl.innerHTML = dailyFoodLog.map((item, i) => {
        const d = item.data;
        return `
        <div class="daily-log-card">
            <div class="dlc-header">
                <div class="dlc-title">
                    <span class="dlc-emoji">${item.emoji}</span>
                    <span class="dlc-name">${item.name}</span>
                </div>
                <button class="builder-remove-btn" onclick="removeFoodFromDaily(${i})" title="Remove">✕</button>
            </div>
            <div class="dlc-nutrients">
                <span class="dlc-nut">🔥 ${d.calories}kcal (${Math.round(d.calories/n.calories*100)}%)</span>
                <span class="dlc-nut">💪 ${d.protein}g (${Math.round(d.protein/n.protein*100)}%)</span>
                <span class="dlc-nut">⚡ ${d.carbs}g (${Math.round(d.carbs/n.carbs*100)}%)</span>
                <span class="dlc-nut">🫒 ${d.fat}g (${Math.round(d.fat/n.fat*100)}%)</span>
                <span class="dlc-nut">🍊 Vit C ${d.vitaminC}mg (${Math.round(d.vitaminC/n.vitaminC*100)}%)</span>
                <span class="dlc-nut">🦴 Calcium ${d.calcium}mg (${Math.round(d.calcium/n.calcium*100)}%)</span>
                <span class="dlc-nut">🩸 Iron ${d.iron}mg (${Math.round(d.iron/n.iron*100)}%)</span>
                <span class="dlc-nut">🛡️ Zinc ${d.zinc}mg (${Math.round(d.zinc/n.zinc*100)}%)</span>
                <span class="dlc-nut">👁️ Vit A ${d.vitaminA}mcg (${Math.round(d.vitaminA/n.vitaminA*100)}%)</span>
                <span class="dlc-nut">☀️ Vit D ${d.vitaminD}mcg (${Math.round(d.vitaminD/n.vitaminD*100)}%)</span>
            </div>
        </div>
    `}).join("");
}

function renderStickyBar() {
    if (!userAge) {
        document.getElementById("stickyDailyBar").classList.add("hidden");
        return;
    }
    
    const n = getNeeds();
    const trackers = [
        { key: 'calories', val: currentDailyIntake.calories, target: n.calories, unit: 'kcal', icon: '🔥' },
        { key: 'protein', val: currentDailyIntake.protein, target: n.protein, unit: 'g', icon: '💪' },
        { key: 'carbs', val: currentDailyIntake.carbs, target: n.carbs, unit: 'g', icon: '⚡' }
    ];
    
    document.getElementById("stickyBarItems").innerHTML = trackers.map(t => {
        const pct = Math.min((t.val / t.target) * 100, 100).toFixed(0);
        const over = t.val > n.max[t.key];
        return `
            <div class="sticky-bar-item ${over ? 'over' : ''}">
                <span class="sb-icon">${t.icon}</span>
                <div class="sb-info">
                    <div class="sb-val">${Math.round(t.val)}${t.unit}</div>
                    <div class="sb-pct">${pct}%</div>
                </div>
            </div>
        `;
    }).join("");
    
    document.getElementById("stickyDailyBar").classList.remove("hidden");
}

// ── Particles & Init ──────────────────────────────────────────────────────────
function initParticles() {
    const c = document.getElementById("bgParticles");
    for (let i = 0; i < 15; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        const s = Math.random() * 100 + 40;
        p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${Math.random()*20+15}s;animation-delay:${Math.random()*20}s;opacity:0`;
        c.appendChild(p);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initParticles();
    document.getElementById("suggestionsPrompt").classList.remove("hidden");
});
