// ── State ──────────────────────────────────────────────────────────────────
let userAge = null, ageGroup = null;
const historyRef = db.ref("nutrisense/history");

// ── Firebase Connection Status ─────────────────────────────────────────────
db.ref(".info/connected").on("value", snap => {
  const ok = snap.val();
  document.getElementById("dbDot").className    = "db-dot " + (ok ? "connected" : "error");
  document.getElementById("dbLabel").textContent = ok ? "Firebase Connected" : "Offline";
});

// ── Firebase History Listener ──────────────────────────────────────────────
historyRef.orderByChild("timestamp").limitToLast(50).on("value", snap => {
  const data  = snap.val();
  const grid  = document.getElementById("historyGrid");
  const empty = document.getElementById("historyEmpty");
  const count = document.getElementById("historyCount");

  if (!data) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    count.textContent = "0 analyses saved";
    return;
  }

  const entries = Object.entries(data).reverse();
  count.textContent = `${entries.length} analyse${entries.length !== 1 ? "s" : ""} saved in Firebase`;
  empty.classList.add("hidden");

  grid.innerHTML = entries.map(([, e]) => `
    <div class="history-card" onclick="quickAnalyze('${e.food.toLowerCase()}')">
      <div class="history-card-top">
        <div class="history-food">${e.emoji} ${e.food}</div>
        <div class="history-score">⭐ ${e.score}</div>
      </div>
      <div class="history-age">${e.ageIcon} ${e.ageLabel} · Age ${e.age}</div>
      <div class="history-macros">
        <span class="history-macro">🔥 ${e.calories} kcal</span>
        <span class="history-macro">💪 ${e.protein}g protein</span>
        <span class="history-macro">⚡ ${e.carbs}g carbs</span>
      </div>
      <div class="history-time">🕐 ${new Date(e.timestamp).toLocaleString()}</div>
    </div>`).join("");
});

// ── Helpers ────────────────────────────────────────────────────────────────
function getAgeGroup(age) {
  if (age <= 12) return "child";
  if (age <= 17) return "teen";
  if (age <= 59) return "adult";
  return "senior";
}

function findFood(q) {
  if (foodDB[q]) return foodDB[q];
  for (const k of Object.keys(foodDB))
    if (k.includes(q) || q.includes(k)) return foodDB[k];
  return null;
}

// ── Set Age ────────────────────────────────────────────────────────────────
function setAge() {
  const age = parseInt(document.getElementById("ageInput").value);
  if (!age || age < 1 || age > 120) {
    const inp = document.getElementById("ageInput");
    inp.style.borderColor = "#ef4444";
    setTimeout(() => inp.style.borderColor = "", 2000);
    return;
  }
  userAge  = age;
  ageGroup = getAgeGroup(age);
  const n  = dailyNeeds[ageGroup];
  document.getElementById("ageCard").classList.add("hidden");
  document.getElementById("profileBadge").classList.remove("hidden");
  document.getElementById("profileIcon").textContent = n.icon;
  document.getElementById("profileInfo").textContent = `Age ${age} · ${n.label}`;
  document.getElementById("agePrompt").classList.add("hidden");
  document.getElementById("suggestionsPrompt").classList.add("hidden");
  renderSuggestions();
}

function resetAge() {
  userAge = null; ageGroup = null;
  document.getElementById("profileBadge").classList.add("hidden");
  document.getElementById("ageCard").classList.remove("hidden");
  document.getElementById("ageInput").value = "";
  document.getElementById("suggestionsGrid").innerHTML = "";
  document.getElementById("suggestionsPrompt").classList.remove("hidden");
  document.getElementById("resultsPanel").classList.add("hidden");
}

// ── Suggestions ────────────────────────────────────────────────────────────
function renderSuggestions() {
  document.getElementById("suggestionsGrid").innerHTML =
    suggestions[ageGroup].map(s => `
      <div class="suggestion-card" onclick="quickAnalyze('${s.name.toLowerCase()}')">
        <div class="sug-top">
          <div class="sug-emoji">${s.emoji}</div>
          <div><div class="sug-name">${s.name}</div><span class="sug-category">${s.category}</span></div>
        </div>
        <div class="sug-reason">${s.reason}</div>
        <div class="sug-nutrients">${s.nutrients.map(n=>`<span class="sug-tag">✓ ${n}</span>`).join("")}</div>
      </div>`).join("");
}

// ── Analyze Food ───────────────────────────────────────────────────────────
function quickAnalyze(food) {
  document.getElementById("foodInput").value = food;
  document.getElementById("analyze").scrollIntoView({ behavior:"smooth" });
  setTimeout(analyzeFood, 400);
}

function analyzeFood() {
  const q = document.getElementById("foodInput").value.trim().toLowerCase();
  if (!q) return;
  if (!userAge) {
    document.getElementById("agePrompt").classList.remove("hidden");
    document.getElementById("ageCard").scrollIntoView({ behavior:"smooth" });
    return;
  }
  document.getElementById("agePrompt").classList.add("hidden");
  document.getElementById("resultsPanel").classList.add("hidden");
  document.getElementById("loadingIndicator").classList.remove("hidden");
  setTimeout(() => {
    const data = findFood(q);
    document.getElementById("loadingIndicator").classList.add("hidden");
    data ? renderResults(q, data) : renderNotFound(q);
  }, 800);
}

// ── Render Results ─────────────────────────────────────────────────────────
function renderResults(query, d) {
  const n    = dailyNeeds[ageGroup];
  const name = query.charAt(0).toUpperCase() + query.slice(1);

  document.getElementById("resultsFoodName").textContent = `${d.emoji} ${name}`;
  document.getElementById("resultsMeta").textContent     = `Per 100g · ${n.icon} ${n.label} (Age ${userAge})`;
  document.getElementById("scoreValue").textContent      = d.score;

  const macros = [
    { icon:"🔥", name:"Calories", val:d.calories, unit:"kcal", pct:Math.round(d.calories/n.calories*100) },
    { icon:"💪", name:"Protein",  val:d.protein,  unit:"g",    pct:Math.round(d.protein /n.protein *100) },
    { icon:"⚡", name:"Carbs",    val:d.carbs,    unit:"g",    pct:Math.round(d.carbs   /n.carbs   *100) },
    { icon:"🫒", name:"Fat",      val:d.fat,      unit:"g",    pct:Math.round(d.fat     /n.fat     *100) },
    { icon:"🌿", name:"Fiber",    val:d.fiber,    unit:"g",    pct:Math.round(d.fiber   /n.fiber   *100) }
  ];
  document.getElementById("macroGrid").innerHTML = macros.map(m => `
    <div class="macro-card">
      <div class="macro-icon">${m.icon}</div>
      <div class="macro-value">${m.val}<span class="macro-unit"> ${m.unit}</span></div>
      <div class="macro-name">${m.name}</div>
      <div style="font-size:.75rem;color:var(--green);margin-top:4px">${m.pct}% daily need</div>
    </div>`).join("");

  const micros = [
    { name:"Vitamin C",   val:d.vitaminC,   max:n.vitaminC,   unit:"mg"  },
    { name:"Calcium",     val:d.calcium,    max:n.calcium,    unit:"mg"  },
    { name:"Iron",        val:d.iron,       max:n.iron,       unit:"mg"  },
    { name:"Potassium",   val:d.potassium,  max:n.potassium,  unit:"mg"  },
    { name:"Vitamin A",   val:d.vitaminA,   max:n.vitaminA,   unit:"mcg" },
    { name:"Vitamin D",   val:d.vitaminD,   max:n.vitaminD,   unit:"mcg" },
    { name:"Vitamin B12", val:d.vitaminB12, max:n.vitaminB12, unit:"mcg" },
    { name:"Zinc",        val:d.zinc,       max:n.zinc,       unit:"mg"  }
  ];
  document.getElementById("microBars").innerHTML = micros.map(m => {
    const pct   = Math.min(Math.round(m.val / m.max * 100), 100);
    const color = pct >= 20 ? "var(--green)" : pct >= 10 ? "var(--yellow)" : "var(--text-muted)";
    return `
      <div class="micro-row">
        <div class="micro-label">${m.name}</div>
        <div class="micro-track">
          <div class="micro-fill" data-pct="${pct}" style="background:linear-gradient(90deg,${color},var(--teal))"></div>
        </div>
        <div class="micro-pct" style="color:${color}">${pct}%</div>
      </div>`;
  }).join("");

  const rec = buildRec(name, d);
  const rc  = document.getElementById("recommendationCard");
  rc.className = `recommendation-card ${rec.cls}`;
  rc.innerHTML = `<strong>${rec.title}</strong><br/>${rec.body}`;

  document.getElementById("resultsPanel").classList.remove("hidden");
  document.getElementById("saveToast").classList.add("hidden");

  requestAnimationFrame(() => {
    document.querySelectorAll(".micro-fill").forEach(el => { el.style.width = el.dataset.pct + "%"; });
  });

  // Save to Firebase
  historyRef.push({
    food: name, emoji: d.emoji, score: d.score,
    calories: d.calories, protein: d.protein, carbs: d.carbs,
    age: userAge, ageGroup, ageIcon: n.icon, ageLabel: n.label,
    timestamp: Date.now()
  }).then(() => {
    const t = document.getElementById("saveToast");
    t.classList.remove("hidden");
    setTimeout(() => t.classList.add("hidden"), 3000);
  });
}

// ── Recommendation ─────────────────────────────────────────────────────────
function buildRec(name, d) {
  const good = (t, b) => ({ cls:"rec-good",     title:"✅ " + t, body: b });
  const mod  = (t, b) => ({ cls:"rec-moderate", title:"⚠️ " + t, body: b });
  const caut = (t, b) => ({ cls:"rec-caution",  title:"🚫 " + t, body: b });

  if (ageGroup === "child") {
    if (d.calcium  > 50) return good("Great for Kids!",  `${name} is rich in calcium — essential for growing bones and teeth in children.`);
    if (d.protein  > 10) return good("Protein Power!",   `${name} supports muscle & tissue development during the active growth phase.`);
    return mod("Good in Moderation", `Pair ${name} with calcium-rich foods to meet children's bone-building needs.`);
  }
  if (ageGroup === "teen") {
    if (d.iron     > 1.5) return good("Iron Boost!",     `${name} provides iron — critical for teen girls and active adolescents.`);
    if (d.protein  > 15)  return good("Muscle Builder!", `${name} delivers protein to support rapid muscle growth during puberty.`);
    return mod("Balanced Choice", `Combine ${name} with iron or protein-rich foods for complete teen nutrition.`);
  }
  if (ageGroup === "adult") {
    if (d.score    >= 88) return good("Excellent Choice!", `${name} is a nutritional powerhouse with a strong macro & micro balance for adults.`);
    if (d.calories > 400) return caut("Portion Control",   `${name} is calorie-dense. Enjoy smaller portions as part of a varied adult diet.`);
    return mod("Good Addition", `${name} is a decent choice. Ensure you hit your daily protein and fiber targets.`);
  }
  // senior
  if (d.vitaminD  > 2)  return good("Excellent for Seniors!", `${name} is rich in Vitamin D — often deficient in seniors — supporting bones & immunity.`);
  if (d.vitaminB12 > 1) return good("Great B12 Source!",      `${name} is high in B12, which seniors commonly lack, supporting nerve function.`);
  if (d.calcium   > 80) return good("Bone Health Support!",   `${name} provides calcium critical for preventing osteoporosis at age 60+.`);
  return mod("Moderate Choice", `Pair ${name} with Vitamin D and calcium-rich foods to support senior bone health.`);
}

// ── Not Found ──────────────────────────────────────────────────────────────
function renderNotFound(q) {
  const p = document.getElementById("resultsPanel");
  p.classList.remove("hidden");
  p.innerHTML = `
    <div style="text-align:center;padding:40px">
      <div style="font-size:3rem;margin-bottom:12px">🤔</div>
      <div style="font-size:1.3rem;font-weight:700;margin-bottom:8px">"${q}" not found</div>
      <div style="color:var(--text-muted);font-family:'Inter',sans-serif;margin-bottom:20px">
        Try: banana, apple, chicken breast, rice, egg, avocado, salmon, milk, broccoli, spinach, oats, carrot, tuna, beef, tofu, almonds, yogurt, orange
      </div>
      <div class="quick-foods" style="justify-content:center">
        <button class="quick-btn" onclick="quickAnalyze('banana')">🍌 Banana</button>
        <button class="quick-btn" onclick="quickAnalyze('salmon')">🐟 Salmon</button>
        <button class="quick-btn" onclick="quickAnalyze('spinach')">🥬 Spinach</button>
        <button class="quick-btn" onclick="quickAnalyze('egg')">🥚 Egg</button>
      </div>
    </div>`;
}

// ── Clear History ──────────────────────────────────────────────────────────
function clearHistory() {
  if (!confirm("Clear all saved analyses from Firebase?")) return;
  historyRef.remove();
}

// ── Background Particles ───────────────────────────────────────────────────
function initParticles() {
  const c = document.getElementById("bgParticles");
  for (let i = 0; i < 15; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const s = Math.random() * 100 + 40;
    p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;` +
      `animation-duration:${Math.random()*20+15}s;animation-delay:${Math.random()*20}s;opacity:0`;
    c.appendChild(p);
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  document.getElementById("suggestionsPrompt").classList.remove("hidden");
});
