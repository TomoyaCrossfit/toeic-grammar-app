const DIFF_COLORS = { easy: "#2d6a4f", medium: "#b07d2a", hard: "#c9402b" };
const PROGRESS_KEY = "toeic_reading_progress";

let currentPassageIndex = null;
let answers = {};
let submitted = false;
let elapsed = 0;
let finalTime = null;
let timerInterval = null;

// ===== Storage =====
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}

function savePassageResult(idx, correct, time, wrongQIds) {
  const prog = loadProgress();
  const prev = prog[idx] || { attempts: 0, bestScore: -1, bestTime: null };
  prog[idx] = {
    attempts: prev.attempts + 1,
    bestScore: Math.max(prev.bestScore, correct),
    bestTime: prev.bestTime === null ? time : Math.min(prev.bestTime, time),
    lastScore: correct,
    wrongQIds: wrongQIds
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
}

function resetProgress() {
  if (!confirm("進捗をリセットしてよいですか？")) return;
  localStorage.removeItem(PROGRESS_KEY);
  renderProgressPage();
}

// ===== Timer =====
function startTimer() {
  clearInterval(timerInterval);
  elapsed = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => { elapsed++; updateTimerDisplay(); }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerDisplay() {
  const el = document.getElementById("timer-display");
  const box = document.getElementById("timer-box");
  const t = submitted ? finalTime : elapsed;
  el.textContent = formatTime(t);
  el.className = "r-timer-value";
  if (t >= 180) { el.classList.add("danger"); box.style.borderColor = "#c9402b"; }
  else if (t >= 120) { el.classList.add("warning"); box.style.borderColor = "#b07d2a"; }
  else { box.style.borderColor = "#2d6a4f"; }
}

// ===== Page routing =====
function showPage(page) {
  if (page !== "reading") stopTimer();
  document.querySelectorAll(".r-page").forEach(p => p.classList.add("hidden"));
  document.getElementById("page-" + page).classList.remove("hidden");
  document.querySelectorAll(".r-nav-btn[data-page]").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.r-nav-btn[data-page="${page}"]`);
  if (btn) btn.classList.add("active");

  if (page === "select") renderSelectPage();
  if (page === "progress") renderProgressPage();
  if (page === "review") renderReviewPage();
  window.scrollTo(0, 0);
}

// ===== Passage Select =====
function startPassage(index) {
  currentPassageIndex = index;
  answers = {};
  submitted = false;
  finalTime = null;

  const p = PASSAGES[index];
  document.getElementById("reading-title-display").textContent = p.title;
  document.getElementById("reading-meta-display").textContent = `${p.type} · ${p.difficulty} · ${p.questions.length}問`;
  document.getElementById("result-banner").classList.add("hidden");
  document.getElementById("submit-btn").classList.remove("hidden");
  document.getElementById("submit-btn").disabled = true;
  document.getElementById("retry-btn").classList.add("hidden");
  document.getElementById("score-display").textContent = "— / —";
  document.getElementById("timer-box").style.borderColor = "#2d6a4f";

  renderPassage();
  renderQuestions();
  showPage("reading");
  startTimer();
}

function retryPassage() {
  if (currentPassageIndex !== null) startPassage(currentPassageIndex);
}

function renderSelectPage() {
  const prog = loadProgress();
  document.getElementById("passage-card-grid").innerHTML = PASSAGES.map((p, i) => {
    const stat = prog[i];
    const attempted = stat ? stat.attempts : 0;
    const bestScore = stat && stat.bestScore >= 0 ? stat.bestScore : null;
    const totalQ = p.questions.length;
    const rateText = bestScore !== null ? `${bestScore} / ${totalQ}` : "未挑戦";
    const rateColor = bestScore === null ? "#888"
      : bestScore === totalQ ? "#2d6a4f"
      : bestScore >= totalQ / 2 ? "#b07d2a"
      : "#c9402b";
    const diffColor = DIFF_COLORS[p.difficulty];
    const hasWeak = stat && stat.wrongQIds && stat.wrongQIds.length > 0;
    const barPct = bestScore !== null ? Math.round(bestScore / totalQ * 100) : 0;

    return `
      <div class="passage-card">
        <div class="passage-card-meta">
          <span class="r-type-badge">${p.type}</span>
          <span class="r-diff-badge" style="border-color:${diffColor};color:${diffColor}">${p.difficulty}</span>
          ${hasWeak ? `<span class="r-weak-badge">弱点あり</span>` : ""}
        </div>
        <div class="passage-card-title">${p.title}</div>
        <div class="passage-card-stats">
          <span style="color:${rateColor}">ベスト: ${rateText}</span>
          <span>挑戦: ${attempted}回</span>
        </div>
        ${attempted > 0 ? `
          <div class="prog-bar-wrap">
            <div class="prog-bar" style="width:${barPct}%;background:${rateColor}"></div>
          </div>` : ""}
        <button class="r-btn r-btn-solid" onclick="startPassage(${i})" style="margin-top:4px">
          ${attempted > 0 ? "もう一度解く" : "開始する"}
        </button>
      </div>`;
  }).join("");
}

// ===== Passage Render =====
function renderPassage() {
  const p = PASSAGES[currentPassageIndex];
  document.getElementById("passage-meta").innerHTML = `
    <span class="r-type-badge">${p.type}</span>
    <span class="r-diff-badge" style="border-color:${DIFF_COLORS[p.difficulty]};color:${DIFF_COLORS[p.difficulty]}">${p.difficulty}</span>
  `;
  document.getElementById("passage-title").textContent = p.title;
  document.getElementById("passage-body").innerHTML = p.lines.map(line => {
    if (line.en === "") return `<div class="r-passage-gap"></div>`;
    return `<div class="r-line-wrap">
      <div class="r-line-en">${line.en}</div>
      ${submitted && line.ja ? `<div class="r-line-ja">${line.ja}</div>` : ""}
    </div>`;
  }).join("");
}

function renderQuestions() {
  const p = PASSAGES[currentPassageIndex];
  document.getElementById("questions-list").innerHTML = p.questions.map(q => {
    const chosen = answers[q.id];
    const isCorrect = submitted && chosen === q.answer;
    const isWrong = submitted && chosen && chosen !== q.answer;
    let cardClass = "r-question";
    if (submitted) cardClass += isCorrect ? " correct" : " incorrect";
    else if (chosen) cardClass += " answered";

    const choices = ["A", "B", "C", "D"].map(k => {
      let cls = "r-choice";
      if (!submitted && chosen === k) cls += " selected";
      if (submitted && k === q.answer) cls += " correct-ans";
      if (submitted && isWrong && k === chosen) cls += " wrong-ans";
      return `<button class="${cls}" ${submitted ? "disabled" : ""} onclick="selectAnswer(${q.id},'${k}')">
        <span class="r-choice-key">${k}</span>
        <span>${q.options[k]}</span>
      </button>`;
    }).join("");

    return `<div class="${cardClass}" id="q-card-${q.id}">
      <div class="r-q-num">Question ${q.id}</div>
      <div class="r-q-text">${q.text}</div>
      <div class="r-choices">${choices}</div>
      ${submitted ? `<div class="r-explanation">${q.explanation}</div>` : ""}
    </div>`;
  }).join("");
}

function renderResultBanner() {
  const p = PASSAGES[currentPassageIndex];
  const correct = p.questions.filter(q => answers[q.id] === q.answer).length;
  const t = finalTime;
  const color = t < 120 ? "#2d6a4f" : t < 180 ? "#b07d2a" : "#c9402b";
  const emoji = t < 120 ? "🏃 速い！" : t < 180 ? "👍 良いペース" : "📖 じっくり読んだね";
  const banner = document.getElementById("result-banner");
  banner.innerHTML = `
    <div class="r-result-score">${correct} / ${p.questions.length}</div>
    <div>
      <div class="r-result-msg">${RESULT_MSGS[correct] || ""}</div>
      <div class="r-result-time">解答時間: <span style="color:${color};font-weight:500">${formatTime(t)}</span> ${emoji}</div>
    </div>
  `;
  banner.classList.remove("hidden");
}

function updateSubmitBtn() {
  const allAnswered = PASSAGES[currentPassageIndex].questions.every(q => answers[q.id]);
  document.getElementById("submit-btn").disabled = !allAnswered;
}

// ===== Actions =====
function selectAnswer(qid, key) {
  if (submitted) return;
  answers[qid] = key;
  renderQuestions();
  updateSubmitBtn();
}

function submitAnswers() {
  const p = PASSAGES[currentPassageIndex];
  if (!p.questions.every(q => answers[q.id])) return;
  stopTimer();
  finalTime = elapsed;
  submitted = true;

  const correct = p.questions.filter(q => answers[q.id] === q.answer).length;
  const wrongQIds = p.questions
    .filter(q => answers[q.id] !== q.answer)
    .map(q => q.id);

  savePassageResult(currentPassageIndex, correct, finalTime, wrongQIds);

  document.getElementById("score-display").textContent = `${correct} / ${p.questions.length}`;
  renderPassage();
  renderQuestions();
  renderResultBanner();
  updateTimerDisplay();
  document.getElementById("submit-btn").classList.add("hidden");
  document.getElementById("retry-btn").classList.remove("hidden");
}

// ===== Progress Page =====
function renderProgressPage() {
  const prog = loadProgress();
  const attempted = Object.keys(prog).length;
  let totalAttempts = 0, bestCorrect = 0, bestTotal = 0;
  PASSAGES.forEach((p, i) => {
    const stat = prog[i];
    if (stat) {
      totalAttempts += stat.attempts;
      bestCorrect += stat.bestScore >= 0 ? stat.bestScore : 0;
      bestTotal += p.questions.length;
    }
  });
  const overallRate = bestTotal > 0 ? Math.round(bestCorrect / bestTotal * 100) : 0;

  document.getElementById("prog-overview").innerHTML = `
    <div class="prog-stat">
      <div class="prog-stat-num">${attempted}</div>
      <div class="prog-stat-label">挑戦済みPassage</div>
    </div>
    <div class="prog-stat">
      <div class="prog-stat-num">${totalAttempts}</div>
      <div class="prog-stat-label">累計挑戦回数</div>
    </div>
    <div class="prog-stat">
      <div class="prog-stat-num">${overallRate}%</div>
      <div class="prog-stat-label">ベスト正解率</div>
    </div>
  `;

  document.getElementById("prog-rows").innerHTML = PASSAGES.map((p, i) => {
    const stat = prog[i];
    if (!stat) return `
      <div class="prog-row">
        <div class="prog-title">${p.title}</div>
        <div class="prog-bar-wrap"><div class="prog-bar" style="width:0%"></div></div>
        <div class="prog-info" style="color:#aaa">未挑戦</div>
      </div>`;
    const rate = stat.bestScore / p.questions.length;
    const barColor = rate >= 0.8 ? "#2d6a4f" : rate >= 0.5 ? "#b07d2a" : "#c9402b";
    const bestTimeStr = stat.bestTime !== null ? formatTime(stat.bestTime) : "—";
    return `
      <div class="prog-row">
        <div class="prog-title">${p.title}</div>
        <div class="prog-bar-wrap">
          <div class="prog-bar" style="width:${rate * 100}%;background:${barColor}"></div>
        </div>
        <div class="prog-info">
          ベスト ${stat.bestScore}/${p.questions.length}（${stat.attempts}回）<br>
          最速 ${bestTimeStr}
        </div>
      </div>`;
  }).join("");
}

// ===== Review Page =====
function renderReviewPage() {
  const prog = loadProgress();
  const weakPassages = PASSAGES
    .map((p, i) => ({ p, i, stat: prog[i] }))
    .filter(({ stat }) => stat && stat.wrongQIds && stat.wrongQIds.length > 0);

  const container = document.getElementById("review-list");
  if (weakPassages.length === 0) {
    container.innerHTML = `<div class="empty-msg">間違えた問題がまだありません。<br>問題を解くと、間違えた問題がここに記録されます。</div>`;
    return;
  }

  container.innerHTML = weakPassages.map(({ p, i, stat }) => {
    const wrongQs = p.questions.filter(q => stat.wrongQIds.includes(q.id));
    return `
      <div class="review-passage-card">
        <div class="review-passage-header">
          <span class="r-type-badge">${p.type}</span>
          <span class="review-passage-title">${p.title}</span>
          <button class="r-btn r-btn-solid" onclick="startPassage(${i})">もう一度解く</button>
        </div>
        ${wrongQs.map(q => `
          <div class="review-question">
            <div class="review-q-text">${q.text}</div>
            <div class="review-q-answer">正解: <strong>${q.answer}</strong> — ${q.options[q.answer]}</div>
            <div class="review-q-exp">${q.explanation}</div>
          </div>`).join("")}
      </div>`;
  }).join("");
}

// ===== Init =====
renderSelectPage();
