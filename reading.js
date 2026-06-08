const DIFF_COLORS = { easy: "#3fb950", medium: "#e3b341", hard: "#f85149" };
const PROGRESS_KEY = "toeic_reading_progress";
const EXTRA_PASSAGES_KEY = "toeic_reading_extra_passages";

let currentPassageIndex = null;
let answers = {};
let submitted = false;
let elapsed = 0;
let finalTime = null;
let timerInterval = null;

// ===== Extra Passages =====
function initExtraPassages() {
  // Assign stable IDs to built-in passages
  PASSAGES.forEach((p, i) => { p._id = `b${i}`; });
  // Append AI-generated passages from localStorage
  try {
    const extras = JSON.parse(localStorage.getItem(EXTRA_PASSAGES_KEY) || "[]");
    extras.forEach(p => PASSAGES.push(p));
  } catch {}
}

function saveExtraPassages() {
  const extras = PASSAGES.filter(p => p._id && p._id.startsWith("gen_"));
  localStorage.setItem(EXTRA_PASSAGES_KEY, JSON.stringify(extras));
}

function deleteGeneratedPassage(pid) {
  const idx = PASSAGES.findIndex(p => p._id === pid);
  if (idx === -1) return;
  // If currently reading this passage, go back
  if (currentPassageIndex === idx) showPage("select");
  PASSAGES.splice(idx, 1);
  const prog = loadProgress();
  delete prog[pid];
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
  saveExtraPassages();
  renderGeneratePage();
  renderSelectPage();
}

// ===== Storage =====
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}

function savePassageResult(pid, correct, time, wrongQIds) {
  const prog = loadProgress();
  const prev = prog[pid] || { attempts: 0, bestScore: -1, bestTime: null };
  prog[pid] = {
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
  if (t >= 180) { el.classList.add("danger"); box.style.borderColor = "rgba(248,81,73,0.5)"; }
  else if (t >= 120) { el.classList.add("warning"); box.style.borderColor = "rgba(227,179,65,0.4)"; }
  else { box.style.borderColor = "rgba(63,185,80,0.3)"; }
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
  if (page === "generate") renderGeneratePage();
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
  document.getElementById("reading-meta-display").textContent =
    `${p.type} · ${p.difficulty} · ${p.questions.length}問`;
  document.getElementById("result-banner").classList.add("hidden");
  document.getElementById("submit-btn").classList.remove("hidden");
  document.getElementById("submit-btn").disabled = true;
  document.getElementById("retry-btn").classList.add("hidden");
  document.getElementById("score-display").textContent = "— / —";
  document.getElementById("timer-box").style.borderColor = "rgba(63,185,80,0.3)";

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
    const pid = p._id;
    const stat = prog[pid];
    const attempted = stat ? stat.attempts : 0;
    const bestScore = stat && stat.bestScore >= 0 ? stat.bestScore : null;
    const totalQ = p.questions.length;
    const rateText = bestScore !== null ? `${bestScore} / ${totalQ}` : "未挑戦";
    const rateColor = bestScore === null ? "#656d76"
      : bestScore === totalQ ? "#3fb950"
      : bestScore >= totalQ / 2 ? "#e3b341"
      : "#f85149";
    const diffColor = DIFF_COLORS[p.difficulty];
    const hasWeak = stat && stat.wrongQIds && stat.wrongQIds.length > 0;
    const barPct = bestScore !== null ? Math.round(bestScore / totalQ * 100) : 0;
    const isGenerated = pid && pid.startsWith("gen_");

    return `
      <div class="passage-card">
        <div class="passage-card-meta">
          <span class="r-type-badge">${p.type}</span>
          <span class="r-diff-badge" style="border-color:${diffColor};color:${diffColor}">${p.difficulty}</span>
          ${isGenerated ? `<span class="gen-ai-badge">AI生成</span>` : ""}
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
  const color = t < 120 ? "#3fb950" : t < 180 ? "#e3b341" : "#f85149";
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

  savePassageResult(p._id, correct, finalTime, wrongQIds);

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
  const attempted = PASSAGES.filter(p => prog[p._id]).length;
  let totalAttempts = 0, bestCorrect = 0, bestTotal = 0;
  PASSAGES.forEach(p => {
    const stat = prog[p._id];
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
    const stat = prog[p._id];
    const isGen = p._id && p._id.startsWith("gen_");
    const label = `${p.title}${isGen ? " <span style='font-size:.55rem;color:#7a7060'>[AI]</span>" : ""}`;
    if (!stat) return `
      <div class="prog-row">
        <div class="prog-title">${label}</div>
        <div class="prog-bar-wrap"><div class="prog-bar" style="width:0%"></div></div>
        <div class="prog-info" style="color:#aaa">未挑戦</div>
      </div>`;
    const rate = stat.bestScore / p.questions.length;
    const barColor = rate >= 0.8 ? "#3fb950" : rate >= 0.5 ? "#e3b341" : "#f85149";
    const bestTimeStr = stat.bestTime !== null ? formatTime(stat.bestTime) : "—";
    return `
      <div class="prog-row">
        <div class="prog-title">${label}</div>
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
    .map((p, i) => ({ p, i, stat: prog[p._id] }))
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

// ===== Generate Page =====
async function generatePassage() {
  const apiKey = document.getElementById("gen-api-key").value.trim();
  if (!apiKey) { setGenStatus("APIキーを入力してください", "error"); return; }
  localStorage.setItem("toeic_reading_anthropic_key", apiKey);

  const type = document.getElementById("gen-type").value;
  const difficulty = document.getElementById("gen-difficulty").value;
  const count = parseInt(document.getElementById("gen-qcount").value);
  const diffDescs = {
    easy: "短めの文書・基本的な語彙・直接的な設問（TOEIC 600点レベル）",
    medium: "標準的なビジネス文書・TOEIC 750点レベルの語彙・適度な推論",
    hard: "長めで複雑な文書・上級語彙・推論と行間読みが必要な設問（TOEIC 900点レベル）"
  };

  const btn = document.getElementById("gen-btn");
  btn.disabled = true;
  setGenStatus("生成中... しばらくお待ちください", "generating");

  const idNums = Array.from({ length: count }, (_, i) => i + 1);
  const exampleQs = idNums.map(n => `    { "id": ${n}, "text": "Question text", "options": { "A": "...", "B": "...", "C": "...", "D": "..." }, "answer": "A", "explanation": "解説（日本語）" }`).join(",\n");

  const prompt = `You are a TOEIC Part 7 question creator. Generate one authentic ${type} passage with exactly ${count} comprehension questions.

REQUIREMENTS:
- Document type: ${type}
- Difficulty: ${difficulty} — ${diffDescs[difficulty]}
- Realistic business content (plausible company names, dates, context)
- TOEIC Part 7 style: questions test inference, detail, purpose, vocabulary in context
- Each passage line must have an English sentence AND a Japanese translation
- Use empty lines { "en": "", "ja": "" } to separate paragraphs
- Exactly ${count} questions, IDs 1 through ${count}
- Answer explanations in Japanese (cite the relevant passage text)

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "type": "${type}",
  "difficulty": "${difficulty}",
  "title": "Document title",
  "lines": [
    { "en": "English sentence", "ja": "日本語訳" },
    { "en": "", "ja": "" }
  ],
  "questions": [
${exampleQs}
  ]
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
    const text = data.content.map(b => b.text || "").join("");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSONの解析に失敗しました");
    const passage = JSON.parse(jsonMatch[0]);
    passage._id = `gen_${Date.now()}`;
    PASSAGES.push(passage);
    saveExtraPassages();
    setGenStatus(`「${passage.title}」を追加しました！問題選択ページで確認できます。`, "success");
    renderGeneratePage();
  } catch (e) {
    setGenStatus("エラー: " + e.message, "error");
  }

  btn.disabled = false;
}

function setGenStatus(msg, type) {
  const el = document.getElementById("gen-status");
  el.textContent = msg;
  el.className = "gen-status " + (type || "");
}

function renderGeneratePage() {
  const savedKey = localStorage.getItem("toeic_reading_anthropic_key");
  if (savedKey && document.getElementById("gen-api-key")) {
    document.getElementById("gen-api-key").value = savedKey;
  }

  const generated = PASSAGES.filter(p => p._id && p._id.startsWith("gen_"));
  const list = document.getElementById("generated-list");
  if (generated.length === 0) {
    list.innerHTML = `<div class="empty-msg">まだ生成済みのパッセージはありません。<br>上のフォームから生成してください。</div>`;
    return;
  }
  list.innerHTML = generated.map((p, gi) => {
    const idx = PASSAGES.indexOf(p);
    return `
      <div class="gen-item">
        <div class="gen-item-info">
          <span class="r-type-badge">${p.type}</span>
          <span class="r-diff-badge" style="border-color:${DIFF_COLORS[p.difficulty]};color:${DIFF_COLORS[p.difficulty]}">${p.difficulty}</span>
          <span class="gen-item-title">${p.title}</span>
          <span class="gen-item-meta">${p.questions.length}問</span>
        </div>
        <div style="display:flex;gap:8px;flex-shrink:0">
          <button class="r-btn r-btn-outline" style="font-size:0.65rem;padding:5px 12px" onclick="startPassage(${idx})">練習する</button>
          <button class="gen-delete-btn" onclick="deleteGeneratedPassage('${p._id}')">削除</button>
        </div>
      </div>`;
  }).join("");
}

// ===== Init =====
initExtraPassages();
renderSelectPage();
