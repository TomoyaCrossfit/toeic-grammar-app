const DIFF_COLORS = { easy: "#2d6a4f", medium: "#b07d2a", hard: "#c9402b" };

let currentIndex = 0;
let answers = {};
let submitted = false;
let totalCorrect = 0;
let totalAnswered = 0;
let usedIndices = [0];
let elapsed = 0;
let finalTime = null;
let timerInterval = null;

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

// ===== Render =====
function renderPassage() {
  const p = PASSAGES[currentIndex];
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
  const p = PASSAGES[currentIndex];
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
  const p = PASSAGES[currentIndex];
  const correct = p.questions.filter(q => answers[q.id] === q.answer).length;
  const t = finalTime;
  const color = t < 120 ? "#2d6a4f" : t < 180 ? "#b07d2a" : "#c9402b";
  const emoji = t < 120 ? "🏃 速い！" : t < 180 ? "👍 良いペース" : "📖 じっくり読んだね";
  const banner = document.getElementById("result-banner");
  banner.innerHTML = `
    <div class="r-result-score">${correct} / ${p.questions.length}</div>
    <div>
      <div class="r-result-msg">${RESULT_MSGS[correct]}</div>
      <div class="r-result-time">解答時間: <span style="color:${color};font-weight:500">${formatTime(t)}</span> ${emoji}</div>
    </div>
  `;
  banner.classList.remove("hidden");
}

function updateScoreDisplay() {
  document.getElementById("score-display").textContent =
    totalAnswered > 0 ? `${totalCorrect} / ${totalAnswered}` : "— / —";
}

function updateProgress() {
  document.getElementById("passage-progress").textContent =
    `${usedIndices.length} / ${PASSAGES.length}`;
}

function updateSubmitBtn() {
  const allAnswered = PASSAGES[currentIndex].questions.every(q => answers[q.id]);
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
  if (!PASSAGES[currentIndex].questions.every(q => answers[q.id])) return;
  stopTimer();
  finalTime = elapsed;
  submitted = true;
  const correct = PASSAGES[currentIndex].questions.filter(q => answers[q.id] === q.answer).length;
  totalCorrect += correct;
  totalAnswered += PASSAGES[currentIndex].questions.length;
  renderPassage();
  renderQuestions();
  renderResultBanner();
  updateTimerDisplay();
  updateScoreDisplay();
  document.getElementById("submit-btn").classList.add("hidden");
}

function nextPassage() {
  const remaining = PASSAGES.map((_, i) => i).filter(i => !usedIndices.includes(i));
  let next;
  if (remaining.length === 0) {
    next = Math.floor(Math.random() * PASSAGES.length);
    usedIndices = [next];
  } else {
    next = remaining[Math.floor(Math.random() * remaining.length)];
    usedIndices.push(next);
  }
  currentIndex = next;
  answers = {};
  submitted = false;
  finalTime = null;
  document.getElementById("result-banner").classList.add("hidden");
  document.getElementById("submit-btn").classList.remove("hidden");
  document.getElementById("submit-btn").disabled = true;
  document.getElementById("timer-box").style.borderColor = "#2d6a4f";
  updateProgress();
  renderPassage();
  renderQuestions();
  startTimer();
}

// ===== Init =====
updateProgress();
renderPassage();
renderQuestions();
updateSubmitBtn();
updateScoreDisplay();
startTimer();
