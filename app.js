// ===== ストレージ =====
const STORAGE_KEY = 'toeic_progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      totalAnswered: 0,
      totalCorrect: 0,
      categoryStats: {},
      wrongQuestionIds: [],
      history: []
    };
  } catch {
    return { totalAnswered: 0, totalCorrect: 0, categoryStats: {}, wrongQuestionIds: [], history: [] };
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ===== グローバル状態 =====
let progress = loadProgress();
let sessionQuestions = [];
let sessionIndex = 0;
let sessionCorrect = 0;
let currentCategory = 'all';
let answered = false;

let reviewQuestions = [];
let reviewIndex = 0;
let reviewAnswered = false;

// ===== タイマー状態 =====
const QUESTION_TIME_LIMIT = 45;
let questionTimer = null;
let questionTimeElapsed = 0;
let sessionTotalTime = 0;
let reviewTotalTime = 0;

// ===== タイマー =====
function startTimer(timerId) {
  stopTimer();
  questionTimeElapsed = 0;
  updateTimerDisplay(timerId, QUESTION_TIME_LIMIT);
  questionTimer = setInterval(() => {
    questionTimeElapsed++;
    const remaining = Math.max(0, QUESTION_TIME_LIMIT - questionTimeElapsed);
    updateTimerDisplay(timerId, remaining);
  }, 1000);
}

function stopTimer() {
  if (questionTimer) {
    clearInterval(questionTimer);
    questionTimer = null;
  }
}

function updateTimerDisplay(timerId, remaining) {
  const el = document.getElementById(timerId);
  if (!el) return;
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  el.className = 'timer-display';
  if (remaining <= 10) el.classList.add('danger');
  else if (remaining <= 20) el.classList.add('warning');
}

// ===== AI生成問題のストレージ管理 =====
function loadExtraQuestions() {
  try { return JSON.parse(localStorage.getItem('toeic_extra_questions')) || []; }
  catch { return []; }
}

function saveExtraQuestions(questions) {
  localStorage.setItem('toeic_extra_questions', JSON.stringify(questions));
}

function initExtraQuestions() {
  const extras = loadExtraQuestions();
  extras.forEach(q => {
    if (!QUESTIONS.find(e => e.id === q.id)) QUESTIONS.push(q);
  });
  const allCats = [...new Set(QUESTIONS.map(q => q.category))];
  allCats.forEach(cat => { if (!CATEGORIES.includes(cat)) CATEGORIES.push(cat); });
}

// ===== ページ切り替え =====
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById('page-' + name).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-page="${name}"]`).classList.add('active');
  stopTimer();

  if (name === 'progress') renderProgress();
  if (name === 'review') renderReviewList();
  if (name === 'generate') renderGeneratePage();
}

// ===== カテゴリ選択 =====
function showCategorySelect() {
  document.getElementById('category-select-area').classList.remove('hidden');
  document.getElementById('question-area').classList.add('hidden');
  document.getElementById('session-result').classList.add('hidden');
  renderCategories();
}

function renderCategories() {
  const grid = document.getElementById('category-grid');
  grid.innerHTML = CATEGORIES.map(cat => {
    const stats = progress.categoryStats[cat];
    const rate = stats && stats.answered > 0 ? Math.round(stats.correct / stats.answered * 100) : null;
    const badge = rate !== null ? `<span class="cat-rate ${rate >= 70 ? 'good' : rate >= 50 ? 'ok' : 'bad'}">${rate}%</span>` : '<span class="cat-rate none">未挑戦</span>';
    return `<button class="cat-btn" onclick="startPractice('${cat}')">
      <span class="cat-name">${cat}</span>
      ${badge}
    </button>`;
  }).join('');
}

// ===== 問題演習 =====
function startPractice(category) {
  currentCategory = category;
  const pool = category === 'all' ? QUESTIONS : QUESTIONS.filter(q => q.category === category);
  sessionQuestions = shuffle([...pool]);
  sessionIndex = 0;
  sessionCorrect = 0;
  sessionTotalTime = 0;

  document.getElementById('category-select-area').classList.add('hidden');
  document.getElementById('session-result').classList.add('hidden');
  document.getElementById('question-area').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  if (sessionIndex >= sessionQuestions.length) {
    showSessionResult();
    return;
  }
  answered = false;
  const q = sessionQuestions[sessionIndex];
  document.getElementById('question-counter').textContent = `${sessionIndex + 1} / ${sessionQuestions.length}`;
  document.getElementById('question-category-badge').textContent = q.category;
  document.getElementById('question-text').textContent = q.text;
  document.getElementById('explanation-area').classList.add('hidden');
  document.getElementById('time-taken-display').textContent = '';
  startTimer('question-timer');

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = q.choices.map((c, i) =>
    `<button class="choice-btn" onclick="selectAnswer(${i})">${String.fromCharCode(65 + i)}. ${c}</button>`
  ).join('');
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const timeTaken = questionTimeElapsed;
  stopTimer();
  sessionTotalTime += timeTaken;

  const q = sessionQuestions[sessionIndex];
  const correct = index === q.answer;

  // 進捗を更新
  progress.totalAnswered++;
  if (!progress.categoryStats[q.category]) progress.categoryStats[q.category] = { answered: 0, correct: 0 };
  progress.categoryStats[q.category].answered++;

  if (correct) {
    sessionCorrect++;
    progress.totalCorrect++;
    progress.categoryStats[q.category].correct++;
    progress.wrongQuestionIds = progress.wrongQuestionIds.filter(id => id !== q.id);
  } else {
    if (!progress.wrongQuestionIds.includes(q.id)) {
      progress.wrongQuestionIds.push(q.id);
    }
  }

  progress.history.unshift({ date: new Date().toLocaleDateString('ja-JP'), category: q.category, correct });
  if (progress.history.length > 50) progress.history = progress.history.slice(0, 50);
  saveProgress(progress);

  // ボタンの色を変える
  const btns = document.querySelectorAll('#choices .choice-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === index) btn.classList.add('incorrect');
  });

  // 解説を表示
  const banner = document.getElementById('result-banner');
  banner.textContent = correct ? '正解！' : `不正解。正解は ${String.fromCharCode(65 + q.answer)}. ${q.choices[q.answer]}`;
  banner.className = 'result-banner ' + (correct ? 'correct' : 'incorrect');
  document.getElementById('translation-box').textContent = q.translation || '';
  document.getElementById('explanation-text').textContent = q.explanation;
  document.getElementById('grammar-point').textContent = '文法ポイント: ' + q.grammarPoint;
  document.getElementById('time-taken-display').textContent = `解答時間: ${timeTaken}秒`;
  document.getElementById('explanation-area').classList.remove('hidden');
}

function nextQuestion() {
  sessionIndex++;
  showQuestion();
}

function endSession() {
  stopTimer();
  showCategorySelect();
}

function showSessionResult() {
  document.getElementById('question-area').classList.add('hidden');
  document.getElementById('session-result').classList.remove('hidden');

  const rate = Math.round(sessionCorrect / sessionQuestions.length * 100);
  const avgTime = Math.round(sessionTotalTime / sessionQuestions.length);
  document.getElementById('result-score-display').textContent = `${rate}%`;
  document.getElementById('result-stats').innerHTML = `
    <div class="stat-row"><span>問題数</span><strong>${sessionQuestions.length}</strong></div>
    <div class="stat-row"><span>正解数</span><strong>${sessionCorrect}</strong></div>
    <div class="stat-row"><span>不正解数</span><strong>${sessionQuestions.length - sessionCorrect}</strong></div>
    <div class="stat-row"><span>平均解答時間</span><strong>${avgTime}秒</strong></div>
  `;
}

// ===== 弱点復習 =====
function renderReviewList() {
  const listEl = document.getElementById('review-list');
  const emptyEl = document.getElementById('review-empty');
  const reviewArea = document.getElementById('review-question-area');
  reviewArea.classList.add('hidden');

  const wrong = QUESTIONS.filter(q => progress.wrongQuestionIds.includes(q.id));
  if (wrong.length === 0) {
    listEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
    return;
  }
  emptyEl.classList.add('hidden');

  listEl.innerHTML = `
    <div class="review-summary">間違えた問題: ${wrong.length}問</div>
    <div class="wrong-list">
      ${wrong.map(q => `
        <div class="wrong-item">
          <span class="badge">${q.category}</span>
          <span class="wrong-text">${q.text.length > 50 ? q.text.slice(0, 50) + '...' : q.text}</span>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-primary mt-20" onclick="startReview()">復習開始</button>
  `;
}

function startReview() {
  reviewQuestions = shuffle(QUESTIONS.filter(q => progress.wrongQuestionIds.includes(q.id)));
  reviewIndex = 0;
  reviewTotalTime = 0;
  document.getElementById('review-list').innerHTML = '';
  document.getElementById('review-empty').classList.add('hidden');
  document.getElementById('review-question-area').classList.remove('hidden');
  showReviewQuestion();
}

function showReviewQuestion() {
  if (reviewIndex >= reviewQuestions.length) {
    endReview();
    return;
  }
  reviewAnswered = false;
  const q = reviewQuestions[reviewIndex];
  document.getElementById('review-counter').textContent = `${reviewIndex + 1} / ${reviewQuestions.length}`;
  document.getElementById('review-category-badge').textContent = q.category;
  document.getElementById('review-question-text').textContent = q.text;
  document.getElementById('review-explanation-area').classList.add('hidden');
  document.getElementById('review-time-taken-display').textContent = '';
  startTimer('review-timer');

  const choicesEl = document.getElementById('review-choices');
  choicesEl.innerHTML = q.choices.map((c, i) =>
    `<button class="choice-btn" onclick="selectReviewAnswer(${i})">${String.fromCharCode(65 + i)}. ${c}</button>`
  ).join('');
}

function selectReviewAnswer(index) {
  if (reviewAnswered) return;
  reviewAnswered = true;

  const timeTaken = questionTimeElapsed;
  stopTimer();
  reviewTotalTime += timeTaken;

  const q = reviewQuestions[reviewIndex];
  const correct = index === q.answer;

  progress.totalAnswered++;
  if (!progress.categoryStats[q.category]) progress.categoryStats[q.category] = { answered: 0, correct: 0 };
  progress.categoryStats[q.category].answered++;

  if (correct) {
    progress.totalCorrect++;
    progress.categoryStats[q.category].correct++;
    progress.wrongQuestionIds = progress.wrongQuestionIds.filter(id => id !== q.id);
  }

  progress.history.unshift({ date: new Date().toLocaleDateString('ja-JP'), category: q.category, correct });
  if (progress.history.length > 50) progress.history = progress.history.slice(0, 50);
  saveProgress(progress);

  const btns = document.querySelectorAll('#review-choices .choice-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === index) btn.classList.add('incorrect');
  });

  const banner = document.getElementById('review-result-banner');
  banner.textContent = correct ? '正解！弱点克服！' : `不正解。正解は ${String.fromCharCode(65 + q.answer)}. ${q.choices[q.answer]}`;
  banner.className = 'result-banner ' + (correct ? 'correct' : 'incorrect');
  document.getElementById('review-translation-box').textContent = q.translation || '';
  document.getElementById('review-explanation-text').textContent = q.explanation;
  document.getElementById('review-grammar-point').textContent = '文法ポイント: ' + q.grammarPoint;
  document.getElementById('review-time-taken-display').textContent = `解答時間: ${timeTaken}秒`;
  document.getElementById('review-explanation-area').classList.remove('hidden');
}

function nextReviewQuestion() {
  reviewIndex++;
  showReviewQuestion();
}

function endReview() {
  stopTimer();
  document.getElementById('review-question-area').classList.add('hidden');
  renderReviewList();
}

// ===== 進捗ページ =====
function renderProgress() {
  const rate = progress.totalAnswered > 0 ? Math.round(progress.totalCorrect / progress.totalAnswered * 100) : 0;
  const wrongCount = progress.wrongQuestionIds.length;

  document.getElementById('stats-overview').innerHTML = `
    <div class="stat-card">
      <div class="stat-num">${progress.totalAnswered}</div>
      <div class="stat-label">累計回答数</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">${rate}%</div>
      <div class="stat-label">総合正答率</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">${wrongCount}</div>
      <div class="stat-label">要復習問題数</div>
    </div>
  `;

  const catStatsEl = document.getElementById('category-stats');
  catStatsEl.innerHTML = CATEGORIES.map(cat => {
    const stats = progress.categoryStats[cat];
    const answered = stats ? stats.answered : 0;
    const correct = stats ? stats.correct : 0;
    const rate = answered > 0 ? Math.round(correct / answered * 100) : 0;
    const barClass = rate >= 70 ? 'bar-good' : rate >= 50 ? 'bar-ok' : 'bar-bad';
    return `
      <div class="cat-stat-row">
        <div class="cat-stat-name">${cat}</div>
        <div class="cat-stat-bar-wrap">
          <div class="cat-stat-bar ${barClass}" style="width:${answered > 0 ? rate : 0}%"></div>
        </div>
        <div class="cat-stat-info">${answered > 0 ? `${correct}/${answered} (${rate}%)` : '未挑戦'}</div>
      </div>
    `;
  }).join('');

  const histEl = document.getElementById('history-list');
  if (progress.history.length === 0) {
    histEl.innerHTML = '<p class="empty-msg">まだ学習履歴がありません。</p>';
  } else {
    histEl.innerHTML = progress.history.slice(0, 10).map(h =>
      `<div class="history-item">
        <span class="history-date">${h.date}</span>
        <span class="badge">${h.category}</span>
        <span class="history-result ${h.correct ? 'correct-text' : 'incorrect-text'}">${h.correct ? '正解' : '不正解'}</span>
      </div>`
    ).join('');
  }
}

function resetProgress() {
  if (!confirm('進捗をすべてリセットしますか？')) return;
  progress = { totalAnswered: 0, totalCorrect: 0, categoryStats: {}, wrongQuestionIds: [], history: [] };
  saveProgress(progress);
  renderProgress();
}

// ===== AI問題生成 =====
function renderGeneratePage() {
  const savedKey = localStorage.getItem('toeic_api_key') || '';
  document.getElementById('api-key-input').value = savedKey;

  const catSelect = document.getElementById('gen-category');
  catSelect.innerHTML = `<option value="_random_">🎲 ランダム（自動選択）</option>` +
    CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('');

  renderGeneratedList();
}

function renderGeneratedList() {
  const extras = loadExtraQuestions();
  const listEl = document.getElementById('generated-list');
  if (extras.length === 0) {
    listEl.innerHTML = '<p class="empty-msg">まだAI生成問題はありません。</p>';
    return;
  }
  listEl.innerHTML = `
    <div class="gen-summary">${extras.length}問のAI生成問題</div>
    ${extras.map(q => `
      <div class="gen-item">
        <span class="badge">${q.category}</span>
        <span class="gen-text">${q.text.length > 55 ? q.text.slice(0, 55) + '...' : q.text}</span>
        <button class="btn-icon" onclick="deleteGeneratedQuestion(${q.id})" title="削除">✕</button>
      </div>
    `).join('')}
    <div class="mt-20">
      <button class="btn btn-danger" onclick="deleteAllGeneratedQuestions()">すべて削除</button>
    </div>
  `;
}

function deleteGeneratedQuestion(id) {
  const extras = loadExtraQuestions().filter(q => q.id !== id);
  saveExtraQuestions(extras);
  const idx = QUESTIONS.findIndex(q => q.id === id);
  if (idx !== -1) QUESTIONS.splice(idx, 1);
  renderGeneratedList();
  renderCategories();
}

function deleteAllGeneratedQuestions() {
  if (!confirm('AI生成問題をすべて削除しますか？')) return;
  loadExtraQuestions().forEach(q => {
    const idx = QUESTIONS.findIndex(e => e.id === q.id);
    if (idx !== -1) QUESTIONS.splice(idx, 1);
  });
  saveExtraQuestions([]);
  renderGeneratedList();
  renderCategories();
}

async function generateQuestions() {
  const apiKey = document.getElementById('api-key-input').value.trim();
  if (!apiKey) { alert('APIキーを入力してください'); return; }
  localStorage.setItem('toeic_api_key', apiKey);

  const rawCategory = document.getElementById('gen-category').value;
  const category = rawCategory === '_random_'
    ? CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
    : rawCategory;
  const count = parseInt(document.getElementById('gen-count').value);
  const btn = document.getElementById('generate-btn');
  const status = document.getElementById('gen-status');

  btn.disabled = true;
  status.textContent = `生成中... ${rawCategory === '_random_' ? `カテゴリ「${category}」` : ''} しばらくお待ちください`;
  status.className = 'gen-status generating';

  const prompt = `あなたはTOEIC Part 5の問題作成の専門家です。以下の条件で問題を${count}問作成してください。

カテゴリ: ${category}
難易度: TOEIC 750点レベル（ビジネス英語）

JSON配列のみで回答してください（説明文不要）：
[
  {
    "category": "${category}",
    "text": "英語の問題文（空欄は___ で表す、Part 5形式）",
    "translation": "問題文の日本語訳（正解の語を入れた完全な文）",
    "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    "answer": 正解のインデックス（0〜3の整数）,
    "explanation": "なぜその答えが正しいかの日本語解説",
    "grammarPoint": "重要文法ポイント（日本語・短く）"
  }
]`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: Math.min(8000, count * 400 + 500),
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || `HTTPエラー: ${res.status}`);
    }

    const data = await res.json();
    const text = data.content[0].text.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('レスポンスのJSON解析に失敗しました');

    const newQuestions = JSON.parse(jsonMatch[0]);

    const extras = loadExtraQuestions();
    const maxId = Math.max(0, ...QUESTIONS.map(q => q.id), ...extras.map(q => q.id));
    newQuestions.forEach((q, i) => { q.id = maxId + i + 1; });

    saveExtraQuestions([...extras, ...newQuestions]);
    newQuestions.forEach(q => {
      QUESTIONS.push(q);
      if (!CATEGORIES.includes(q.category)) CATEGORIES.push(q.category);
    });

    status.textContent = `${newQuestions.length}問を追加しました！問題演習ですぐに使えます。`;
    status.className = 'gen-status success';
    renderGeneratedList();
    renderCategories();
  } catch (err) {
    status.textContent = `エラー: ${err.message}`;
    status.className = 'gen-status error';
  } finally {
    btn.disabled = false;
  }
}

// ===== ユーティリティ =====
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== 初期化 =====
initExtraQuestions();
showCategorySelect();
renderCategories();
