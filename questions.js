// TOEIC Part 5 文法問題バンク（750点レベル）
const QUESTIONS = [
  // ===== 時制 =====
  {
    id: 1,
    category: "時制",
    text: "By the time the manager arrives, the team ___ the report.",
    translation: "マネージャーが到着するころには、チームはレポートを仕上げているでしょう。",
    choices: ["will finish", "will have finished", "has finished", "finished"],
    answer: 1,
    explanation: "「by the time + 現在形」の節が未来の基準点を示すとき、主節には未来完了形（will have + 過去分詞）を使います。「マネージャーが到着するころには、チームはレポートを仕上げているでしょう」という完了の意味を表します。",
    grammarPoint: "未来完了形: will have + 過去分詞"
  },
  {
    id: 2,
    category: "時制",
    text: "The company ___ in this city for over 50 years when it celebrates its anniversary next month.",
    translation: "その会社は来月の周年記念を祝う時点で、この街で50年以上営業し続けていることになります。",
    choices: ["operates", "has operated", "will have been operating", "operated"],
    answer: 2,
    explanation: "「next month（来月）に周年記念を祝う時点」まで50年以上操業を継続している動作を表すため、未来完了進行形（will have been + -ing）を使います。",
    grammarPoint: "未来完了進行形: will have been + -ing"
  },
  {
    id: 3,
    category: "時制",
    text: "She ___ the documents before the client called yesterday.",
    translation: "昨日クライアントが電話してくる前に、彼女は書類を送っていた。",
    choices: ["sends", "had sent", "has sent", "will send"],
    answer: 1,
    explanation: "「yesterday（昨日）クライアントが電話してきた」という過去の時点より前に書類を送ったことを表すため、過去完了形（had + 過去分詞）を使います。",
    grammarPoint: "過去完了形: had + 過去分詞（過去の基準点より前の出来事）"
  },
  {
    id: 4,
    category: "時制",
    text: "The new product ___ on the market since January.",
    translation: "その新製品は1月から市場に出続けています。",
    choices: ["is", "was", "has been", "will be"],
    answer: 2,
    explanation: "「since January（1月から現在まで）」は継続を示すキーワードです。過去から現在まで続く状態を表すには現在完了形（has/have been）を使います。",
    grammarPoint: "現在完了形: have/has + 過去分詞（since/for との相性が良い）"
  },

  // ===== 品詞 =====
  {
    id: 5,
    category: "品詞",
    text: "The CEO gave a ___ speech at the annual conference.",
    translation: "CEOは年次会議で感動的なスピーチをした。",
    choices: ["inspire", "inspiration", "inspirational", "inspirationally"],
    answer: 2,
    explanation: "空欄は名詞 speech を修飾する位置にあるため、形容詞が必要です。「inspire（動詞）」「inspiration（名詞）」「inspirational（形容詞）」「inspirationally（副詞）」の中で形容詞は inspirational です。",
    grammarPoint: "品詞識別: 名詞を修飾するのは形容詞（-al, -ive, -ful など）"
  },
  {
    id: 6,
    category: "品詞",
    text: "The project was completed ___ thanks to the team's effort.",
    translation: "そのプロジェクトはチームの努力のおかげで見事に完了した。",
    choices: ["success", "successful", "successfully", "successive"],
    answer: 2,
    explanation: "空欄は動詞 completed を修飾する副詞の位置です。「success（名詞）」「successful（形容詞）」「successfully（副詞）」「successive（形容詞：連続した）」の中で副詞は successfully です。",
    grammarPoint: "品詞識別: 動詞・形容詞・副詞を修飾するのは副詞（多くは -ly 形）"
  },
  {
    id: 7,
    category: "品詞",
    text: "There was a significant ___ in sales during the holiday season.",
    translation: "ホリデーシーズン中、売上に大幅な増加があった。",
    choices: ["increase", "increasing", "increased", "increasingly"],
    answer: 0,
    explanation: "冠詞 a の後ろ、前置詞 in の前には名詞が入ります。「increase」は名詞（増加）として使えます。「increasing」は形容詞/動名詞、「increased」は形容詞、「increasingly」は副詞です。",
    grammarPoint: "品詞識別: 冠詞（a/an/the）の直後は名詞または形容詞＋名詞"
  },
  {
    id: 8,
    category: "品詞",
    text: "Employees are encouraged to dress ___ for the client meeting.",
    translation: "従業員はクライアントとの会議のためにプロらしい服装をするよう促されています。",
    choices: ["profession", "professional", "professionally", "professionalism"],
    answer: 2,
    explanation: "dress（動詞）を修飾するには副詞が必要です。「professionally（副詞）」が正解です。",
    grammarPoint: "品詞識別: 動詞を後ろから修飾するのは副詞"
  },

  // ===== 前置詞 =====
  {
    id: 9,
    category: "前置詞",
    text: "The meeting has been rescheduled ___ Friday.",
    translation: "会議は金曜日に再スケジュールされました。",
    choices: ["in", "on", "at", "by"],
    answer: 1,
    explanation: "特定の曜日・日付には前置詞 on を使います。「on Friday（金曜日に）」が正しい表現です。in は月・年・季節、at は時刻・特定の場所に使います。",
    grammarPoint: "時の前置詞: on + 曜日/日付, in + 月/年/季節, at + 時刻"
  },
  {
    id: 10,
    category: "前置詞",
    text: "The report must be submitted ___ the end of this week.",
    translation: "レポートは今週末までに提出しなければなりません。",
    choices: ["until", "by", "during", "within"],
    answer: 1,
    explanation: "「by（〜までに）」は期限を表します。「until（〜まで）」は動作の継続を表すのに対し、by は締め切りを表します。「the end of this week」は期限なので by が正解です。",
    grammarPoint: "by vs until: by = 期限（〜までに完了）, until = 継続（〜までずっと）"
  },
  {
    id: 11,
    category: "前置詞",
    text: "The new policy applies ___ all employees regardless of their position.",
    translation: "新しい方針はポジションに関係なく全従業員に適用されます。",
    choices: ["for", "to", "with", "about"],
    answer: 1,
    explanation: "「apply to（〜に適用される）」が正しい熟語表現です。apply for は「〜に応募する」という意味になります。",
    grammarPoint: "熟語: apply to（〜に適用される）, apply for（〜に応募する）"
  },
  {
    id: 12,
    category: "前置詞",
    text: "The factory is located ___ the outskirts of the city.",
    translation: "その工場は市の郊外に位置しています。",
    choices: ["in", "on", "at", "by"],
    answer: 1,
    explanation: "「on the outskirts of（〜の郊外に）」は決まった表現です。outskirts（郊外）は複数形で使い、前置詞 on と組み合わせます。",
    grammarPoint: "熟語: on the outskirts of（〜の郊外に）"
  },

  // ===== 接続詞・接続副詞 =====
  {
    id: 13,
    category: "接続詞",
    text: "___ the weather was bad, the outdoor event was canceled.",
    translation: "天気が悪かったので、屋外イベントは中止された。",
    choices: ["Despite", "Because of", "Although", "Because"],
    answer: 3,
    explanation: "空欄の後ろに「the weather was bad（主語＋動詞）」という節が続くため、節を導く接続詞が必要です。Because（なぜなら〜だから）が正解です。Despite と Because of は前置詞句なので後ろに名詞句が来ます。Although は「〜にもかかわらず」という逆接になります。",
    grammarPoint: "接続詞 vs 前置詞: because + 節, because of + 名詞句; although + 節, despite + 名詞句"
  },
  {
    id: 14,
    category: "接続詞",
    text: "The presentation was well-received; ___, the team received positive feedback from the client.",
    translation: "プレゼンテーションは好評だった。したがって、チームはクライアントから好意的なフィードバックを受けた。",
    choices: ["however", "therefore", "otherwise", "meanwhile"],
    answer: 1,
    explanation: "セミコロン後の文は「チームがクライアントから好意的なフィードバックを受けた」という内容で、前文の結果を表します。therefore（したがって）が因果関係を示す正解です。however は逆接、otherwise は「さもなければ」、meanwhile は「一方」です。",
    grammarPoint: "接続副詞: therefore（だから）, however（しかし）, otherwise（さもなければ）"
  },
  {
    id: 15,
    category: "接続詞",
    text: "Please submit the form ___ you have completed all sections.",
    translation: "すべてのセクションを記入したら、フォームを提出してください。",
    choices: ["unless", "once", "despite", "whereas"],
    answer: 1,
    explanation: "「すべてのセクションを記入したら（したうえで）提出してください」という意味では once（〜したら、〜すると）が正解です。unless は「〜でない限り」、whereas は「〜に対して（対比）」です。",
    grammarPoint: "接続詞: once（〜したら）, unless（〜でない限り）, whereas（〜に対して）"
  },

  // ===== 関係詞 =====
  {
    id: 16,
    category: "関係詞",
    text: "The employee ___ performance exceeded expectations received a bonus.",
    translation: "成果が期待を超えた従業員はボーナスを受け取った。",
    choices: ["who", "whom", "whose", "which"],
    answer: 2,
    explanation: "空欄の後ろに「performance exceeded expectations（名詞＋動詞）」が続いており、所有格の関係詞が必要です。whose は「〜の」という所有格で、「成果が期待を超えた従業員」を表します。",
    grammarPoint: "関係詞: whose（所有格）+ 名詞 + 動詞"
  },
  {
    id: 17,
    category: "関係詞",
    text: "This is the office ___ the director works.",
    translation: "ここがディレクターが働いているオフィスです。",
    choices: ["which", "that", "where", "when"],
    answer: 2,
    explanation: "先行詞が「office（場所）」で、後ろに完全な節（the director works）が続く場合は、場所の関係副詞 where を使います。which/that の後ろは不完全な節（目的語や主語が欠けている）になります。",
    grammarPoint: "関係副詞: where（場所）, when（時）, why（理由）+ 完全な節"
  },
  {
    id: 18,
    category: "関係詞",
    text: "The report ___ was submitted last week contained several errors.",
    translation: "先週提出されたレポートにはいくつかの誤りが含まれていた。",
    choices: ["whom", "whose", "which", "where"],
    answer: 2,
    explanation: "先行詞「The report（物）」を修飾し、後ろに動詞 was submitted が続くため、主格の関係代名詞 which が必要です。whom は人の目的格、whose は所有格です。",
    grammarPoint: "関係代名詞: who/that（人・主格）, which/that（物・主格）"
  },

  // ===== 仮定法 =====
  {
    id: 19,
    category: "仮定法",
    text: "If the project ___ on time, we would have met the deadline.",
    translation: "もしプロジェクトが時間通りに完了していたなら、私たちは締め切りに間に合っていたでしょう。",
    choices: ["completed", "had been completed", "has been completed", "would be completed"],
    answer: 1,
    explanation: "「would have + 過去分詞」があることから仮定法過去完了の文です。if 節には「had + 過去分詞」を使います。「もしプロジェクトが時間通りに完了していたなら、締め切りに間に合っていたでしょう」という過去の事実と異なる仮定です。",
    grammarPoint: "仮定法過去完了: If + had + 過去分詞, would have + 過去分詞"
  },
  {
    id: 20,
    category: "仮定法",
    text: "If she ___ the training, she would be more confident now.",
    translation: "もし彼女が研修を受けていたなら、今頃はもっと自信があるでしょう。",
    choices: ["attended", "had attended", "attends", "would attend"],
    answer: 1,
    explanation: "「now（現在）」が示すとおり、現在の状態（自信がある）に対する仮定ですが、if 節の行為（研修参加）は過去の出来事を表しています。これは「混合仮定法」で、if 節は仮定法過去完了（had attended）、主節は仮定法過去（would be）を使います。",
    grammarPoint: "混合仮定法: If + had + 過去分詞（過去）, would + 原形（現在への影響）"
  },

  // ===== 不定詞・動名詞 =====
  {
    id: 21,
    category: "不定詞・動名詞",
    text: "The manager suggested ___ the meeting to next week.",
    translation: "マネージャーは会議を来週に延期することを提案した。",
    choices: ["postpone", "to postpone", "postponing", "postponed"],
    answer: 2,
    explanation: "suggest は動名詞（-ing形）を目的語にとる動詞です。「suggest + -ing」で「〜することを提案する」を表します。suggest to do という形は正しくありません。",
    grammarPoint: "動名詞を目的語にとる動詞: suggest, avoid, consider, enjoy, mind, finish など"
  },
  {
    id: 22,
    category: "不定詞・動名詞",
    text: "The company decided ___ its operations overseas.",
    translation: "その会社は海外で事業を拡大することを決定した。",
    choices: ["expanding", "to expand", "expand", "expanded"],
    answer: 1,
    explanation: "decide は不定詞（to + 原形）を目的語にとる動詞です。「decide to do」で「〜することを決定する」を表します。",
    grammarPoint: "不定詞を目的語にとる動詞: decide, plan, agree, want, expect, hope など"
  },
  {
    id: 23,
    category: "不定詞・動名詞",
    text: "I remember ___ the email, but I cannot find it in my sent folder.",
    translation: "私はそのメールを送ったことを覚えているが、送信フォルダに見当たらない。",
    choices: ["to send", "sending", "sent", "send"],
    answer: 1,
    explanation: "remember + -ing は「（過去に）〜したことを覚えている」という意味です。remember + to do は「（これから）〜することを覚えている（忘れずに〜する）」を意味します。ここでは「送ったことを覚えている」という過去の記憶なので sending が正解です。",
    grammarPoint: "remember -ing（過去の行為を覚えている）vs remember to do（これからする行為を忘れない）"
  },

  // ===== 比較 =====
  {
    id: 24,
    category: "比較",
    text: "This quarter's results are ___ than we had anticipated.",
    translation: "今四半期の結果は私たちが予想していたよりも良かった。",
    choices: ["good", "well", "better", "best"],
    answer: 2,
    explanation: "than があることから比較級が必要です。good の比較級は better です。well（副詞）の比較級も better ですが、ここでは形容詞として results を修飾するため、形容詞 better が正解です。",
    grammarPoint: "不規則変化: good → better → best, bad → worse → worst, many/much → more → most"
  },
  {
    id: 25,
    category: "比較",
    text: "The new software is ___ efficient as the previous version.",
    translation: "新しいソフトウェアは旧バージョンと同じくらい効率的です。",
    choices: ["more", "most", "as", "twice as"],
    answer: 2,
    explanation: "「as ___ as」の形（同等比較）では、空欄には原級（形容詞/副詞の原形）が入ります。「as efficient as（〜と同じくらい効率的）」が正しい同等比較の表現です。",
    grammarPoint: "同等比較: as + 原級 + as（〜と同じくらい）"
  },

  // ===== 受動態 =====
  {
    id: 26,
    category: "受動態",
    text: "The new policy ___ by the board of directors last month.",
    translation: "新しい方針は先月、取締役会によって承認された。",
    choices: ["approved", "was approved", "has approved", "approves"],
    answer: 1,
    explanation: "「last month（先月）」という過去の時点を示す表現があり、かつ主語「The new policy」は承認される側（受け身）なので、過去形の受動態（was + 過去分詞）が正解です。",
    grammarPoint: "受動態: be動詞 + 過去分詞。主語が動作を「受ける」側のとき使用"
  },
  {
    id: 27,
    category: "受動態",
    text: "The presentation ___ currently being reviewed by the committee.",
    translation: "そのプレゼンテーションは現在、委員会によって審査されています。",
    choices: ["has", "is", "was", "will"],
    answer: 1,
    explanation: "「currently（現在）」と「being reviewed（審査されている）」から現在進行形の受動態です。現在進行形受動態は「is/am/are + being + 過去分詞」で、主語が3人称単数の The presentation なので is が正解です。",
    grammarPoint: "進行形受動態: is/are + being + 過去分詞（現在進行）"
  },

  // ===== 語彙・コロケーション =====
  {
    id: 28,
    category: "語彙",
    text: "The company will ___ a new office in Singapore next year.",
    translation: "その会社は来年、シンガポールに新しいオフィスを開く予定です。",
    choices: ["open", "establish", "found", "launch"],
    answer: 0,
    explanation: "「open an office（事務所を開く）」は自然なコロケーションです。establish/found は組織・会社の設立に使い、launch は製品・サービスの開始に使います。",
    grammarPoint: "コロケーション: open an office（事務所を開く）, open an account（口座を開く）"
  },
  {
    id: 29,
    category: "語彙",
    text: "Please ___ to our newsletter to receive the latest updates.",
    translation: "最新情報を受け取るには、ニュースレターを購読してください。",
    choices: ["subscribe", "describe", "prescribe", "inscribe"],
    answer: 0,
    explanation: "「subscribe to（〜を購読する/登録する）」が正解です。describe（描写する）、prescribe（処方する）、inscribe（刻む）はすべて文脈に合いません。",
    grammarPoint: "熟語: subscribe to（〜を購読する）, subscribe for（〜に加入する）"
  },
  {
    id: 30,
    category: "語彙",
    text: "The merger ___ significant changes in the company's organizational structure.",
    translation: "その合併は会社の組織構造に大きな変化をもたらした。",
    choices: ["resulted in", "resulted from", "resulted to", "resulted by"],
    answer: 0,
    explanation: "「result in（〜という結果をもたらす）」が正解です。result from は「〜が原因で生じる」という逆の因果関係を表します。「合併が組織構造の大きな変化をもたらした」という文なので result in が適切です。",
    grammarPoint: "result in（〜をもたらす）vs result from（〜から生じる）"
  },

  // ===== 数量詞・代名詞 =====
  {
    id: 31,
    category: "数量詞",
    text: "_____ of the applicants met the minimum qualifications.",
    translation: "応募者のうち誰も最低資格を満たしていなかった。",
    choices: ["Each", "Neither", "None", "Every"],
    answer: 2,
    explanation: "「None of + 複数名詞（または不可算名詞）」で「〜のうち誰も／何も〜ない」という否定の意味を表します。Neither は2者間で使い、Each/Every は肯定的な意味です。applicants（複数）に合う否定表現は None です。",
    grammarPoint: "None of + 複数名詞（否定）, Neither of + 2者（否定）, Each of + 複数名詞（肯定・単数扱い）"
  },
  {
    id: 32,
    category: "数量詞",
    text: "The company has ___ time to complete the project before the deadline.",
    translation: "会社には締め切りまでにプロジェクトを完了するための時間が少しある。",
    choices: ["few", "a few", "little", "a little"],
    answer: 3,
    explanation: "time は不可算名詞なので few/a few（可算名詞用）は使えません。little（ほとんどない）と a little（少しある）のうち、「締め切りまでに〜する少しの時間がある」という肯定的な文脈なので a little が正解です。",
    grammarPoint: "可算名詞: few（ほぼゼロ）/ a few（少しある）; 不可算名詞: little（ほぼゼロ）/ a little（少しある）"
  },

  // ===== 助動詞 =====
  {
    id: 33,
    category: "助動詞",
    text: "You ___ submit the report by Friday; it's mandatory.",
    translation: "金曜日までにレポートを提出しなければなりません。それは義務です。",
    choices: ["should", "must", "might", "could"],
    answer: 1,
    explanation: "「mandatory（義務）」とあるため、強い義務を表す must が正解です。should は「〜すべき」という提案・アドバイス、might/could は可能性を表します。",
    grammarPoint: "must（義務）vs should（推奨）vs might（可能性）"
  },
  {
    id: 34,
    category: "助動詞",
    text: "The figures in the report ___ be incorrect; please double-check them.",
    translation: "レポートの数値は誤っているかもしれません。もう一度確認してください。",
    choices: ["must", "should", "may", "will"],
    answer: 2,
    explanation: "「〜かもしれない」という可能性の推量には may（または might）を使います。must は「〜に違いない」という強い確信、should は「〜のはず」という期待を表します。",
    grammarPoint: "may（〜かもしれない）, must（〜に違いない）, should（〜のはず）"
  },

  // ===== 分詞 =====
  {
    id: 35,
    category: "分詞",
    text: "___ the problem, the engineer found a solution quickly.",
    translation: "問題を特定したうえで、そのエンジニアは素早く解決策を見つけた。",
    choices: ["Identifying", "Identified", "To identify", "Being identified"],
    answer: 0,
    explanation: "主文の主語 the engineer が「問題を特定する」という能動の関係にあるため、現在分詞（Identifying）を使った分詞構文が正解です。Identified（過去分詞）を使うと受動の意味になります。",
    grammarPoint: "分詞構文: 能動 → 現在分詞（doing）, 受動 → 過去分詞（done）"
  },
  {
    id: 36,
    category: "分詞",
    text: "The documents ___ by the accountant were sent to the auditors.",
    translation: "会計士によって準備された書類は監査役に送られた。",
    choices: ["preparing", "prepared", "to prepare", "prepare"],
    answer: 1,
    explanation: "後置修飾で「会計士によって準備された書類」という受動の関係を表すため、過去分詞（prepared）が正解です。現在分詞（preparing）は能動（準備している書類）の意味になります。",
    grammarPoint: "名詞の後置修飾: 現在分詞（能動・進行）vs 過去分詞（受動・完了）"
  },
];

// カテゴリ一覧を抽出
const CATEGORIES = [...new Set(QUESTIONS.map(q => q.category))];
