// TOEIC Part 6 — Passage Completion
// passageLines: 本文（[131] のような番号が空欄）
// questions: n=問題番号, opts=選択肢, ans=正解index(0-3), exp=解説, grammarPoint=文法ポイント, isSentence=文挿入問題

const P6_PASSAGES = [
  {
    _id: 'p6_b0',
    type: 'Business Email',
    difficulty: 'medium',
    title: 'Shipment Delay Notification',
    intro: 'Questions 131–134 refer to the following email.',
    passageLines: [
      'To: s.carter@globalimports.com',
      'From: d.park@fastship-logistics.com',
      'Date: September 12',
      'Subject: Update on Your Shipment (#FS-2891)',
      '',
      'Dear Ms. Carter,',
      '',
      'I am writing to [131] you that there has been an unexpected delay in processing your recent order. Due to severe weather conditions affecting our East Coast facilities, our main shipping center has been operating at [132] capacity.',
      '',
      '[133] The new estimated delivery date is September 22. To compensate for the inconvenience, we have upgraded your shipment to express delivery at no additional charge.',
      '',
      'We sincerely [134] for any inconvenience this may cause and appreciate your continued business with FastShip Logistics.',
      '',
      'Best regards,',
      'David Park',
      'Customer Relations Manager, FastShip Logistics',
    ],
    questions: [
      {
        n: 131,
        opts: ['inform', 'informing', 'informed', 'information'],
        ans: 0,
        exp: 'to + 動詞の原形が必要です。「I am writing to inform you」は「お知らせするためにご連絡しています」という意味で、ビジネスメールの定型表現です。',
        grammarPoint: 'to不定詞の用法: to inform（目的を示す）'
      },
      {
        n: 132,
        opts: ['reduce', 'reduces', 'reduced', 'reduction'],
        ans: 2,
        exp: '「at reduced capacity（縮小した能力で）」は定型表現。前置詞 at の後に形容詞的に使われる過去分詞 reduced が正解です。reduction は名詞なので不適切。',
        grammarPoint: '過去分詞の形容詞用法: reduced capacity'
      },
      {
        n: 133,
        isSentence: true,
        opts: [
          'We assure you that this situation will be resolved shortly.',
          'Our company recently opened a new distribution center in Ohio.',
          'Please note that all returns must be processed within 30 days.',
          'FastShip Logistics has been serving customers since 1998.',
        ],
        ans: 0,
        exp: '前の文で遅延の理由を説明し、次の文で新しい配達日と補償を伝えています。この流れを橋渡しするのは「状況はまもなく解決される」という保証の文（A）が最適です。',
        grammarPoint: '文挿入問題: 前後の文脈の流れを読む'
      },
      {
        n: 134,
        opts: ['apologize', 'apologizing', 'apologized', 'apology'],
        ans: 0,
        exp: '「We sincerely apologize for...」はビジネスメールの定型謝罪表現。主語 We の後には動詞原形の apologize が正解。apology は名詞なので文法的に不正解。',
        grammarPoint: 'ビジネス定型表現: We sincerely apologize for ...'
      },
    ]
  },
  {
    _id: 'p6_b1',
    type: 'Notice',
    difficulty: 'easy',
    title: 'Office Renovation Notice',
    intro: 'Questions 135–138 refer to the following notice.',
    passageLines: [
      'NOTICE TO ALL STAFF',
      'Ridgeline Technologies — Facilities Management',
      '',
      'The fourth-floor conference rooms will be [135] renovated from November 4 to November 18. During this period, all staff members are encouraged to use the conference facilities on the second floor instead.',
      '',
      '[136] Bookings for alternative meeting spaces can be made through the company intranet under the "Facilities" tab.',
      '',
      'Any meetings [137] scheduled in the fourth-floor rooms during the renovation period must be relocated to alternative venues. Please contact the Facilities team at ext. 4400 if you require [138] in rescheduling your meetings.',
      '',
      'We thank you for your cooperation and apologize for any inconvenience caused.',
    ],
    questions: [
      {
        n: 135,
        opts: ['extensive', 'extensively', 'extension', 'extend'],
        ans: 1,
        exp: '動詞 renovated を修飾するので副詞が必要です。extensively（徹底的に・大規模に）が正解。extensive は形容詞なので動詞を修飾できません。',
        grammarPoint: '品詞識別: 動詞を修飾するのは副詞（-ly）'
      },
      {
        n: 136,
        isSentence: true,
        opts: [
          'Employees are advised to book spaces in advance to avoid scheduling conflicts.',
          'The renovation is expected to cost approximately $50,000.',
          'A new coffee machine has been installed in the break room.',
          'Management will hold a town hall meeting next quarter.',
        ],
        ans: 0,
        exp: '次の文で「予約方法（イントラネット）」について述べています。この直前には「予約を事前にしておくべき」という促す文（A）が自然に入ります。B・C・Dは文脈とつながりません。',
        grammarPoint: '文挿入問題: 次文への論理的な橋渡しを選ぶ'
      },
      {
        n: 137,
        opts: ['already', 'currently', 'previously', 'recently'],
        ans: 2,
        exp: '「previously scheduled meetings（以前に予定された会議）」は工事期間中の既存の予約を指します。「以前に」という意味の previously が文脈に最も合います。',
        grammarPoint: '副詞の選択: previously scheduled（以前に予定された）'
      },
      {
        n: 138,
        opts: ['assist', 'assistance', 'assistant', 'assisting'],
        ans: 1,
        exp: '動詞 require の目的語には名詞が来ます。assistance（支援・手伝い）が名詞で正解。assist は動詞、assistant は「補助者」という人を指す名詞なので不自然。',
        grammarPoint: '品詞識別: require + 名詞目的語（assistance）'
      },
    ]
  },
  {
    _id: 'p6_b2',
    type: 'Business Letter',
    difficulty: 'hard',
    title: 'Partnership Proposal Follow-up',
    intro: 'Questions 139–142 refer to the following letter.',
    passageLines: [
      'October 8',
      '',
      'Ms. Laura Hendricks',
      'Director of Business Development',
      'Apex Solutions Inc.',
      '',
      'Dear Ms. Hendricks,',
      '',
      'I am writing to follow up on our meeting last month [139] the potential partnership between our two companies. I believe our [140] aligns closely with Apex\'s strategic objectives, and I am confident that a collaboration would be mutually beneficial.',
      '',
      'As we discussed, our proprietary platform has already demonstrated [141] results for clients in the financial services sector, with an average productivity increase of 23 percent.',
      '',
      '[142] I would be happy to arrange a demonstration at your offices at a time that is convenient for your team. Please feel free to contact me directly at the number below.',
      '',
      'I look forward to hearing from you.',
      '',
      'Sincerely,',
      'James Whitfield',
      'CEO, NovaTech Systems',
    ],
    questions: [
      {
        n: 139,
        opts: ['regarding', 'regarded', 'to regard', 'regards'],
        ans: 0,
        exp: '前置詞 regarding（〜に関して）が空欄に入ります。「our meeting regarding the potential partnership」で「提携の可能性に関する会議」という意味になります。',
        grammarPoint: '前置詞 regarding: 〜に関して（concerning/about の代替表現）'
      },
      {
        n: 140,
        opts: ['offer', 'offering', 'offered', 'offers'],
        ans: 1,
        exp: '「our offering（当社の提供サービス・製品）」は名詞としてのビジネス用語。所有格 our の後には名詞が来るため、名詞用法の offering が正解です。',
        grammarPoint: 'ビジネス名詞: offering（提供するサービス・商品）'
      },
      {
        n: 141,
        opts: ['measure', 'measuring', 'measured', 'measurement'],
        ans: 2,
        exp: '「demonstrated」の後に来る名詞 results を修飾する形容詞的な過去分詞が必要。「measured results（定量的に計測された結果）」はビジネスで「具体的な成果」を意味する表現です。',
        grammarPoint: '形容詞的過去分詞: measured results（定量的な成果）'
      },
      {
        n: 142,
        isSentence: true,
        opts: [
          'In the meantime, I have attached our latest product brochure for your review.',
          'Our company was founded in 2005 and has grown steadily since then.',
          'The financial services sector is one of our primary target markets.',
          'I appreciate the time you took to meet with me last month.',
        ],
        ans: 0,
        exp: '次の文で「デモの手配を提案する」と続きます。直前には追加の参考資料を提供したという内容（A）が最も自然に橋渡しになります。B・C・Dは次の文との流れが不自然です。',
        grammarPoint: '文挿入問題: 直後の提案文への橋渡し'
      },
    ]
  },
];
