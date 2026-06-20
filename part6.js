// ===== Storage =====
const P6_PROGRESS_KEY = 'toeic_p6_progress';
const P6_EXTRA_KEY    = 'toeic_p6_extra';
const P6_API_KEY      = 'toeic_api_key';

function loadP6Progress() {
  try { return JSON.parse(localStorage.getItem(P6_PROGRESS_KEY) || '{}'); }
  catch { return {}; }
}
function saveP6Progress(data) {
  localStorage.setItem(P6_PROGRESS_KEY, JSON.stringify(data));
}
function loadExtraPassages() {
  try { return JSON.parse(localStorage.getItem(P6_EXTRA_KEY) || '[]'); }
  catch { return []; }
}
function saveExtraPassages(list) {
  localStorage.setItem(P6_EXTRA_KEY, JSON.stringify(list));
}

// ===== Init =====
function initP6() {
  P6_PASSAGES.forEach((p, i) => { if (!p._id) p._id = `p6_b${i}`; });
  const extras = loadExtraPassages();
  extras.forEach(p => P6_PASSAGES.push(p));
  renderSelectPage();
}

// ===== Page navigation =====
function showPage(name) {
  document.querySelectorAll('.p6-page').forEach(p => p.classList.add('hidden'));
  document.getElementById('page-' + name).classList.remove('hidden');
  document.querySelectorAll('.t-nav-btn[data-page]').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.t-nav-btn[data-page="${name}"]`);
  if (btn) btn.classList.add('active');
  stopP6Timer();
  if (name === 'select')   renderSelectPage();
  if (name === 'review')   renderReviewPage();
  if (name === 'progress') renderProgressPage();
  if (name === 'generate') renderGeneratePage();
}

// ===== Select page =====
function renderSelectPage() {
  const prog  = loadP6Progress();
  const grid  = document.getElementById('passage-card-grid');
  const DIFF  = { easy: 'easy', medium: 'medium', hard: 'hard' };
  const DIFF_LABEL = { easy: '易', medium: '標準', hard: '難' };

  grid.innerHTML = P6_PASSAGES.map((p, i) => {
    const pr = prog[p._id];
    const done = pr && pr.attempts > 0;
    const score = done ? `${pr.lastScore} / 4` : null;
    const isAI = p._id.startsWith('gen_');

    return `<div class="p6-passage-card${done ? ' done' : ''}" onclick="startPassage(${i})">
      <div class="p6-card-meta">
        <span class="p6-type-badge">${esc(p.type)}</span>
        <span class="t-badge t-badge-${DIFF[p.difficulty] || 'medium'}">${DIFF_LABEL[p.difficulty] || '標準'}</span>
        ${isAI ? '<span class="p6-ai-badge">AI生成</span>' : ''}
        ${done ? '<span class="p6-done-badge">✓ 完了</span>' : ''}
      </div>
      <div class="p6-card-title">${esc(p.title)}</div>
      <div class="p6-card-intro">${esc(p.intro)}</div>
      <div class="p6-card-stats">
        <span>空欄 4問</span>
        ${score ? `<span>最高 ${score}</span>` : ''}
        ${pr && pr.attempts ? `<span>${pr.attempts}回挑戦</span>` : ''}
      </div>
      <div class="p6-card-btn">始める →</div>
    </div>`;
  }).join('');
}

// ===== Timer =====
const P6_TIME_LIMIT = 180; // 3 minutes per passage
let p6TimerInterval = null;
let p6TimeElapsed = 0;

function startP6Timer() {
  stopP6Timer();
  p6TimeElapsed = 0;
  updateP6TimerDisplay(P6_TIME_LIMIT);
  p6TimerInterval = setInterval(() => {
    p6TimeElapsed++;
    updateP6TimerDisplay(P6_TIME_LIMIT - p6TimeElapsed);
  }, 1000);
}

function stopP6Timer() {
  if (p6TimerInterval) { clearInterval(p6TimerInterval); p6TimerInterval = null; }
}

function updateP6TimerDisplay(remaining) {
  const el = document.getElementById('p6-timer');
  if (!el) return;
  el.className = 'p6-timer-value';
  if (remaining > 0) {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    if (remaining <= 30) el.classList.add('danger');
    else if (remaining <= 60) el.classList.add('warning');
  } else {
    el.textContent = `+${-remaining}s`;
    el.classList.add('danger');
  }
}

// ===== Quiz state =====
let currentPassageIdx = null;
let p6Answers = {};  // n -> selectedIndex (0-3)
let p6Submitted = false;

function startPassage(idx) {
  currentPassageIdx = idx;
  p6Answers = {};
  p6Submitted = false;
  renderReadingPage();
  document.querySelectorAll('.p6-page').forEach(p => p.classList.add('hidden'));
  document.getElementById('page-reading').classList.remove('hidden');
  document.querySelectorAll('.t-nav-btn[data-page]').forEach(b => b.classList.remove('active'));
  window.scrollTo(0, 0);
  startP6Timer();
}

// ===== Build passage HTML with blanks =====
function buildPassageHtml(passage, submitted) {
  const lines      = passage.passageLines;
  const transLines = submitted && passage.passageTranslation
    ? passage.passageTranslation.split('\n')
    : null;
  const qMap = {};
  passage.questions.forEach(q => { qMap[q.n] = q; });

  return lines.map((line, idx) => {
    if (line === '') return '<div class="p6-gap"></div>';

    const html = line.replace(/\[(\d+)\]/g, (_, nStr) => {
      const n = parseInt(nStr);
      const q = qMap[n];
      if (!q) return `<span class="p6-blank">[${n}]</span>`;
      const sel = p6Answers[n];
      if (submitted && sel !== undefined) {
        const correct = sel === q.ans;
        if (correct) {
          return `<span class="p6-blank-filled correct">${esc(q.opts[sel])}</span>`;
        } else {
          return `<span class="p6-blank-filled wrong">${esc(q.opts[sel])}</span><span class="p6-blank-arrow">→</span><span class="p6-blank-filled correct">${esc(q.opts[q.ans])}</span>`;
        }
      }
      const filled = sel !== undefined ? q.opts[sel] : null;
      return filled
        ? `<span class="p6-blank-filled pending" onclick="focusQuestion(${n})">${esc(filled)}</span>`
        : `<span class="p6-blank" onclick="focusQuestion(${n})">(${n})</span>`;
    });

    // Find which question (if any) has a blank on this line
    const blankNums = [...line.matchAll(/\[(\d+)\]/g)].map(m => parseInt(m[1]));
    const firstQ    = blankNums.length > 0 ? qMap[blankNums[0]] : null;

    let trans      = transLines?.[idx] || null;
    let transClass = 'p6-trans-line';

    if (submitted && firstQ) {
      if (firstQ.isSentence) {
        // 文挿入: 正解選択肢の日本語訳を使う（passageTranslation は [NNN] のまま翻訳されるため）
        const correctTrans = firstQ.optTranslations?.[firstQ.ans];
        if (correctTrans) { trans = correctTrans; transClass = 'p6-trans-line p6-trans-sentence'; }
      } else {
        // 単語挿入: 黄色ハイライト
        transClass = 'p6-trans-line p6-trans-line-blank';
      }
    }

    const transHtml = trans ? `<div class="${transClass}">${esc(trans)}</div>` : '';
    return `<div class="p6-passage-line">${html}</div>${transHtml}`;
  }).join('');
}

function focusQuestion(n) {
  const el = document.getElementById(`q-block-${n}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== Render reading page =====
function renderReadingPage() {
  const p = P6_PASSAGES[currentPassageIdx];
  const prog = loadP6Progress();
  const pr = prog[p._id];

  document.getElementById('reading-intro').textContent  = p.intro;
  document.getElementById('reading-title').textContent  = p.title;
  document.getElementById('score-display').textContent  = '— / 4';
  document.getElementById('result-banner').classList.add('hidden');
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('retry-btn').classList.add('hidden');

  renderPassageBody();
  renderQuestionsPanel();
  updateSubmitBtn();
}

function renderPassageBody() {
  const p = P6_PASSAGES[currentPassageIdx];
  document.getElementById('passage-body').innerHTML = buildPassageHtml(p, p6Submitted);
}

function renderQuestionsPanel() {
  const p   = P6_PASSAGES[currentPassageIdx];
  const div = document.getElementById('questions-list');

  div.innerHTML = p.questions.map(q => {
    const sel       = p6Answers[q.n];
    const answered  = sel !== undefined;
    const submitted = p6Submitted;

    const optHtml = q.opts.map((opt, i) => {
      let cls = 'p6-choice';
      if (submitted) {
        if (i === q.ans)                  cls += ' correct-ans';
        else if (i === sel && sel !== q.ans) cls += ' wrong-ans';
        else if (i === sel)               cls += ' correct-ans';
      } else if (i === sel) {
        cls += ' selected';
      }
      const label = submitted
        ? (i === q.ans ? ' ○' : (i === sel && sel !== q.ans ? ' ✗' : ''))
        : '';
      const optTrans = submitted && q.optTranslations?.[i]
        ? `<span class="p6-opt-trans">${esc(q.optTranslations[i])}</span>` : '';
      return `<button class="${cls}" onclick="selectP6Answer(${q.n}, ${i})" ${submitted ? 'disabled' : ''}>
        <span class="p6-choice-key">${String.fromCharCode(65 + i)}${label}</span>
        <span class="p6-opt-wrap"><span>${esc(opt)}</span>${optTrans}</span>
      </button>`;
    }).join('');

    const expHtml = submitted
      ? `<div class="p6-explanation">
           <div class="p6-exp-gp">${esc(q.grammarPoint)}</div>
           <div>${esc(q.exp)}</div>
         </div>`
      : '';

    const sentTag = q.isSentence ? '<span class="p6-sentence-tag">文挿入</span>' : '';
    return `<div class="p6-q-block ${submitted ? (p6Answers[q.n] === q.ans ? 'correct' : 'incorrect') : (answered ? 'answered' : '')}" id="q-block-${q.n}">
      <div class="p6-q-num">問題 (${q.n}) ${sentTag}</div>
      <div class="p6-choices">${optHtml}</div>
      ${expHtml}
    </div>`;
  }).join('');
}

function selectP6Answer(n, i) {
  if (p6Submitted) return;
  p6Answers[n] = i;
  renderPassageBody();
  renderQuestionsPanel();
  updateSubmitBtn();
}

function updateSubmitBtn() {
  const p   = P6_PASSAGES[currentPassageIdx];
  const btn = document.getElementById('submit-btn');
  const answered = p.questions.every(q => p6Answers[q.n] !== undefined);
  btn.disabled = !answered;
}

function submitAnswers() {
  if (p6Submitted) return;
  p6Submitted = true;
  stopP6Timer();

  const p       = P6_PASSAGES[currentPassageIdx];
  const correct = p.questions.filter(q => p6Answers[q.n] === q.ans).length;
  const total   = p.questions.length;

  // Save progress
  const prog = loadP6Progress();
  const prev = prog[p._id] || { attempts: 0, bestScore: -1 };
  prog[p._id] = {
    attempts:  prev.attempts + 1,
    bestScore: Math.max(prev.bestScore, correct),
    lastScore: correct,
    totalQ:    total,
    wrongNs:   p.questions.filter(q => p6Answers[q.n] !== q.ans).map(q => q.n),
  };
  saveP6Progress(prog);

  // Update UI
  document.getElementById('score-display').textContent = `${correct} / ${total}`;
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('retry-btn').classList.remove('hidden');

  const banner  = document.getElementById('result-banner');
  const pct     = Math.round(correct / total * 100);
  let msg, cls;
  if (pct === 100) { msg = '全問正解！素晴らしい！'; cls = 'success'; }
  else if (pct >= 75) { msg = `${correct}/${total} 正解。あと一歩！`; cls = 'good'; }
  else if (pct >= 50) { msg = `${correct}/${total} 正解。解説を確認しましょう。`; cls = 'ok'; }
  else { msg = `${correct}/${total} 正解。解説をよく読んで復習しましょう。`; cls = 'bad'; }

  const timeTaken = p6TimeElapsed;
  const tm = Math.floor(timeTaken / 60), ts = timeTaken % 60;
  const timeStr = `${tm}:${ts.toString().padStart(2, '0')}`;
  banner.innerHTML = `<span class="p6-result-score">${correct}/${total}</span><span class="p6-result-msg">${msg}</span><span style="font-size:11px;color:var(--text3);font-family:monospace;margin-left:auto">${timeStr}</span>`;
  banner.className = `p6-result-banner ${cls}`;
  banner.classList.remove('hidden');

  renderPassageBody();
  renderQuestionsPanel();
  showTranslation(p);
}

function showTranslation(p) {
  const area = document.getElementById('translation-area');
  if (p.passageTranslation) {
    area.classList.add('hidden');
    renderPassageBody();
  } else {
    area.classList.remove('hidden');
    document.getElementById('translate-btn').disabled = false;
    document.getElementById('translate-status').textContent = '';
  }
}

async function generateTranslation() {
  const p      = P6_PASSAGES[currentPassageIdx];
  const apiKey = localStorage.getItem(P6_API_KEY);
  const btn    = document.getElementById('translate-btn');
  const status = document.getElementById('translate-status');

  if (!apiKey) { status.textContent = '設定からAPIキーを入力してください'; return; }

  btn.disabled = true;
  status.textContent = '翻訳中...';

  const passageText = p.passageLines.join('\n');
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: `以下のTOEICパッセージを日本語に翻訳してください。\n・元の行数・行順を完全に維持し、1行ずつ対応させてください\n・空行は空行のままにしてください\n・翻訳文のみ返してください（説明不要）\n\n${passageText}` }],
      }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    p.passageTranslation = data.content[0].text.trim();
    document.getElementById('translation-area').classList.add('hidden');
    renderPassageBody();
  } catch (e) {
    status.textContent = `エラー: ${e.message}`;
    btn.disabled = false;
  }
}

function retryPassage() {
  p6Answers   = {};
  p6Submitted = false;
  document.getElementById('translation-area').classList.add('hidden');
  renderReadingPage();
  startP6Timer();
}

// ===== Review page =====
function renderReviewPage() {
  const prog = loadP6Progress();
  const div  = document.getElementById('review-list');

  const wrongPassages = P6_PASSAGES.filter(p => {
    const pr = prog[p._id];
    return pr && pr.wrongNs && pr.wrongNs.length > 0;
  });

  if (!wrongPassages.length) {
    div.innerHTML = '<div class="p6-empty">間違えた問題がまだありません。パッセージを解いて始めましょう！</div>';
    return;
  }

  div.innerHTML = wrongPassages.map(p => {
    const pr = prog[p._id];
    const wrongQs = p.questions.filter(q => pr.wrongNs.includes(q.n));
    return `<div class="p6-review-card">
      <div class="p6-review-header">
        <span class="p6-type-badge">${esc(p.type)}</span>
        <span class="p6-review-title">${esc(p.title)}</span>
        <button class="p6-review-start-btn" onclick="startPassage(${P6_PASSAGES.indexOf(p)})">再挑戦</button>
      </div>
      ${wrongQs.map(q => `
        <div class="p6-review-q">
          <div class="p6-review-q-num">問題 (${q.n})${q.isSentence ? ' · 文挿入' : ''}</div>
          <div class="p6-review-q-ans">正解: ${String.fromCharCode(65 + q.ans)}. ${esc(q.opts[q.ans])}</div>
          <div class="p6-review-q-exp">${esc(q.exp)}</div>
        </div>
      `).join('')}
    </div>`;
  }).join('');
}

// ===== Progress page =====
function renderProgressPage() {
  const prog = loadP6Progress();
  const div  = document.getElementById('prog-overview');
  const rows = document.getElementById('prog-rows');

  const attempts = Object.values(prog);
  const total    = attempts.length;
  const totalQ   = attempts.reduce((s, a) => s + (a.totalQ || 4), 0);
  const totalC   = attempts.reduce((s, a) => s + (a.bestScore || 0), 0);
  const rate     = totalQ > 0 ? Math.round(totalC / totalQ * 100) : 0;

  div.innerHTML = `
    <div class="p6-prog-stat"><div class="p6-prog-num">${total}</div><div class="p6-prog-label">完了パッセージ</div></div>
    <div class="p6-prog-stat"><div class="p6-prog-num">${rate}%</div><div class="p6-prog-label">総合正答率</div></div>
    <div class="p6-prog-stat"><div class="p6-prog-num">${P6_PASSAGES.length}</div><div class="p6-prog-label">総パッセージ数</div></div>
  `;

  rows.innerHTML = P6_PASSAGES.map(p => {
    const pr = prog[p._id];
    if (!pr) return `<div class="p6-prog-row">
      <div class="p6-prog-row-title">${esc(p.title)}</div>
      <div class="p6-prog-bar-wrap"><div class="p6-prog-bar" style="width:0%"></div></div>
      <div class="p6-prog-info">未挑戦</div>
    </div>`;
    const pct = Math.round(pr.bestScore / (pr.totalQ || 4) * 100);
    const barCls = pct >= 75 ? 'good' : pct >= 50 ? 'ok' : 'bad';
    return `<div class="p6-prog-row">
      <div class="p6-prog-row-title">${esc(p.title)}</div>
      <div class="p6-prog-bar-wrap"><div class="p6-prog-bar ${barCls}" style="width:${pct}%"></div></div>
      <div class="p6-prog-info">最高 ${pr.bestScore}/${pr.totalQ || 4} · ${pr.attempts}回</div>
    </div>`;
  }).join('');
}

function resetProgress() {
  if (!confirm('Part 6の進捗をすべてリセットしますか？')) return;
  localStorage.removeItem(P6_PROGRESS_KEY);
  renderProgressPage();
}

// ===== Generate page =====
function renderGeneratePage() {
  const saved = localStorage.getItem(P6_API_KEY) || '';
  document.getElementById('gen-api-key').value = saved;
  renderGeneratedList();
}

function renderGeneratedList() {
  const extras = loadExtraPassages();
  const div    = document.getElementById('generated-list');
  if (!extras.length) {
    div.innerHTML = '<div class="p6-empty">AI生成パッセージはまだありません。</div>';
    return;
  }
  div.innerHTML = extras.map((p, i) => {
    const idx = P6_PASSAGES.indexOf(p);
    return `<div class="p6-gen-item">
      <div class="p6-gen-item-info">
        <span class="p6-type-badge">${esc(p.type)}</span>
        <span class="p6-gen-title">${esc(p.title)}</span>
        <span class="p6-gen-meta">${p.questions.length}問 · ${p.difficulty}</span>
      </div>
      <button class="p6-gen-del-btn" onclick="deleteGenPassage('${p._id}')">削除</button>
    </div>`;
  }).join('');
}

function deleteGenPassage(id) {
  const idx = P6_PASSAGES.findIndex(p => p._id === id);
  if (idx !== -1) P6_PASSAGES.splice(idx, 1);
  const extras = loadExtraPassages().filter(p => p._id !== id);
  saveExtraPassages(extras);
  const prog = loadP6Progress();
  delete prog[id];
  saveP6Progress(prog);
  renderGeneratedList();
  renderSelectPage();
}

async function generatePassage() {
  const apiKey = document.getElementById('gen-api-key').value.trim();
  if (!apiKey) { alert('APIキーを入力してください'); return; }
  localStorage.setItem(P6_API_KEY, apiKey);

  const type  = document.getElementById('gen-type').value;
  const diff  = document.getElementById('gen-difficulty').value;
  const btn   = document.getElementById('gen-btn');
  const status = document.getElementById('gen-status');

  btn.disabled = true;
  status.className = 'p6-gen-status generating';
  status.textContent = 'AI がパッセージを生成中... しばらくお待ちください';

  const firstNum = 100 + Math.floor(Math.random() * 200);
  const nums = [firstNum, firstNum+1, firstNum+2, firstNum+3];

  const prompt = `あなたはTOEIC Part 6の問題作成の専門家です。以下の条件でPart 6問題を1セット作成してください。

文書タイプ: ${type}
難易度: ${diff === 'easy' ? '易しい（TOEIC 600点レベル）' : diff === 'hard' ? '難しい（TOEIC 850点レベル）' : '標準（TOEIC 750点レベル）'}
空欄番号: [${nums[0]}], [${nums[1]}], [${nums[2]}], [${nums[3]}]

Part 6形式:
- 文章中に [${nums[0]}] [${nums[1]}] [${nums[2]}] [${nums[3]}] の4つの空欄を含む
- 各空欄に対して4択問題
- うち1問は文挿入問題（isSentence: true）にする
- 文章はビジネス英語で5〜10段落

【重要ルール】
- 文挿入問題の空欄 [${nums[2]}] は必ず「段落の先頭」または「文と文の間（1つの完全な文が丸ごと抜けている位置）」に置くこと
- 文の途中（"I believe it is [${nums[2]}] for the success" のように文の一部として）絶対に使用しないこと
- 文挿入の空欄の前後は必ず完全な文（ピリオドで終わる文）であること
- 他の3つの空欄（語彙・文法）は文の中の単語1つを置き換える形式にすること
- 空欄の直前・直後にある語を選択肢に含めないこと（例：本文に"has"があるなら選択肢は"approved"のみにし"has approved"としない）

以下のJSON形式のみで返答してください（説明不要）：
{
  "type": "${type}",
  "difficulty": "${diff}",
  "title": "パッセージタイトル（英語）",
  "intro": "Questions ${nums[0]}–${nums[3]} refer to the following ${type.toLowerCase()}.",
  "passageLines": [
    "文章の行1（空欄は [${nums[0]}] のように表記）",
    "文章の行2",
    "",
    "空行は空文字列で表現"
  ],
  "passageTranslation": "パッセージ全体の自然な日本語訳",
  "questions": [
    {
      "n": ${nums[0]},
      "opts": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
      "optTranslations": ["A訳", "B訳", "C訳", "D訳"],
      "ans": 正解インデックス（0〜3）,
      "exp": "日本語解説（なぜ正解か・文法ポイントを含む）",
      "grammarPoint": "文法ポイント（日本語・短く）",
      "isSentence": false
    },
    {
      "n": ${nums[1]},
      "opts": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
      "optTranslations": ["A訳", "B訳", "C訳", "D訳"],
      "ans": 正解インデックス,
      "exp": "日本語解説",
      "grammarPoint": "文法ポイント",
      "isSentence": false
    },
    {
      "n": ${nums[2]},
      "opts": ["完全な英文A", "完全な英文B", "完全な英文C", "完全な英文D"],
      "optTranslations": ["A文の訳", "B文の訳", "C文の訳", "D文の訳"],
      "ans": 正解インデックス,
      "exp": "日本語解説（前後文脈の理由）",
      "grammarPoint": "文挿入問題: 前後の文脈の流れを読む",
      "isSentence": true
    },
    {
      "n": ${nums[3]},
      "opts": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
      "optTranslations": ["A訳", "B訳", "C訳", "D訳"],
      "ans": 正解インデックス,
      "exp": "日本語解説",
      "grammarPoint": "文法ポイント",
      "isSentence": false
    }
  ]
}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data  = await res.json();
    const text  = data.content[0].text.trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSONが見つかりませんでした');
    const p = JSON.parse(match[0]);
    p._id = 'gen_' + Date.now();
    P6_PASSAGES.push(p);
    const extras = loadExtraPassages();
    extras.push(p);
    saveExtraPassages(extras);
    status.className = 'p6-gen-status success';
    status.textContent = `「${p.title}」を追加しました！問題選択から解けます。`;
    renderGeneratedList();
    renderSelectPage();
  } catch (e) {
    status.className = 'p6-gen-status error';
    status.textContent = `エラー: ${e.message}`;
  } finally {
    btn.disabled = false;
  }
}

// ===== Utility =====
function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===== Boot =====
initP6();
