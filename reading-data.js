const PASSAGES = [
  {
    type: "Memo", difficulty: "medium", title: "Updated Expense Reimbursement Policy",
    lines: [
      { en: "INTERNAL MEMORANDUM", ja: "社内メモ" },
      { en: "", ja: "" },
      { en: "TO: All Employees", ja: "宛先：全社員" },
      { en: "FROM: Finance Department", ja: "差出人：財務部" },
      { en: "DATE: October 3", ja: "日付：10月3日" },
      { en: "RE: Updates to Expense Reimbursement Policy", ja: "件名：経費精算ポリシーの改定について" },
      { en: "", ja: "" },
      { en: "Effective November 1st, the company will implement several changes to our expense reimbursement procedures.", ja: "11月1日より、会社は経費精算手続きにいくつかの変更を実施します。" },
      { en: "Please read the following carefully.", ja: "以下をよくお読みください。" },
      { en: "", ja: "" },
      { en: "Meal Expenses: The daily meal allowance for domestic business travel will increase from $45 to $60.", ja: "食事費：国内出張の1日あたりの食事手当は、45ドルから60ドルに引き上げられます。" },
      { en: "For international travel, the allowance remains at $90 per day.", ja: "海外出張については、1日90ドルのまま変更ありません。" },
      { en: "Receipts are required for any single meal exceeding $25.", ja: "25ドルを超える食事には領収書が必要です。" },
      { en: "", ja: "" },
      { en: "Transportation: Employees must now book all flights through the company's preferred travel portal, CorporateTravel.net.", ja: "交通費：今後、全てのフライトは会社指定の出張予約ポータル「CorporateTravel.net」で予約してください。" },
      { en: "Bookings made outside this portal will not be reimbursed unless prior written approval has been obtained from a department head.", ja: "部門長の事前書面承認がない限り、このポータル外で行った予約は払い戻しされません。" },
      { en: "", ja: "" },
      { en: "Submission Deadline: All expense reports must be submitted within 21 days of the travel end date.", ja: "提出期限：全ての経費報告書は出張終了日から21日以内に提出してください。" },
      { en: "Reports submitted after this window will require VP-level approval and may be subject to delay.", ja: "この期限を過ぎた報告書は副社長レベルの承認が必要となり、処理が遅れる場合があります。" },
      { en: "", ja: "" },
      { en: "The updated policy document is available on the company intranet.", ja: "改定されたポリシー文書は社内イントラネットで閲覧できます。" },
      { en: "Questions should be directed to expenses@company.com.", ja: "ご質問はexpenses@company.comまでお問い合わせください。" },
    ],
    questions: [
      { id: 1, text: "What is the main purpose of this memo?", options: { A: "To announce changes to the travel booking system", B: "To inform employees of updated expense reimbursement procedures", C: "To introduce a new finance department contact", D: "To remind employees of the expense submission deadline" }, answer: "B", explanation: "「will implement several changes to our expense reimbursement procedures」が目的をそのまま述べています。" },
      { id: 2, text: "Under the new policy, when is a receipt required for a meal?", options: { A: "For any meal during international travel", B: "For any single meal costing more than $25", C: "For all meals regardless of cost", D: "Only for meals exceeding the daily allowance" }, answer: "B", explanation: "「Receipts are required for any single meal exceeding $25」と明記されています。" },
      { id: 3, text: "What happens if an employee books a flight outside the approved portal without prior approval?", options: { A: "They must pay a penalty fee", B: "The booking will be automatically cancelled", C: "The cost will not be reimbursed", D: "They must submit a written explanation" }, answer: "C", explanation: "「Bookings made outside this portal will not be reimbursed unless prior written approval has been obtained」と述べられています。" }
    ]
  },
  {
    type: "Form / Survey", difficulty: "easy", title: "Employee Satisfaction Survey",
    lines: [
      { en: "ANNUAL EMPLOYEE SATISFACTION SURVEY", ja: "年次従業員満足度調査" },
      { en: "Bluewave Solutions — Human Resources Department", ja: "Bluewave Solutions — 人事部" },
      { en: "", ja: "" },
      { en: "Thank you for taking the time to complete this survey.", ja: "本調査にご協力いただきありがとうございます。" },
      { en: "Your feedback is anonymous and will be used to improve our workplace environment.", ja: "ご回答は匿名で処理され、職場環境の改善に活用されます。" },
      { en: "Please answer all questions honestly.", ja: "全ての質問に正直にお答えください。" },
      { en: "", ja: "" },
      { en: "Section 1: Work Environment", ja: "セクション1：職場環境" },
      { en: "Q1. How satisfied are you with your current workload?", ja: "Q1. 現在の業務量に満足していますか？" },
      { en: "Q2. Do you have the tools and resources needed to perform your job effectively?", ja: "Q2. 業務を効果的に遂行するための道具やリソースは揃っていますか？" },
      { en: "Q3. How would you rate the physical working conditions of your office?", ja: "Q3. オフィスの物理的な作業環境をどのように評価しますか？" },
      { en: "", ja: "" },
      { en: "Section 2: Management & Communication", ja: "セクション2：マネジメントとコミュニケーション" },
      { en: "Q4. Does your manager provide clear expectations and regular feedback?", ja: "Q4. 上司は明確な期待を示し、定期的なフィードバックを行っていますか？" },
      { en: "Q5. How effectively does senior leadership communicate company goals?", ja: "Q5. 上層部は会社の目標を効果的に伝えていますか？" },
      { en: "", ja: "" },
      { en: "Section 3: Growth & Development", ja: "セクション3：成長と能力開発" },
      { en: "Q6. Are you satisfied with the professional development opportunities available to you?", ja: "Q6. 提供されているキャリア開発の機会に満足していますか？" },
      { en: "Q7. Do you feel your career goals are supported by the organization?", ja: "Q7. 組織があなたのキャリア目標を支援していると感じますか？" },
      { en: "", ja: "" },
      { en: "Please submit completed surveys to HR by Friday, November 8th.", ja: "記入済みの調査票は11月8日（金）までに人事部へ提出してください。" },
      { en: "Results will be shared company-wide in the December newsletter.", ja: "結果は12月のニュースレターで全社に共有されます。" },
      { en: "For questions, contact hr@bluewavesolutions.com.", ja: "ご質問はhr@bluewavesolutions.comまでご連絡ください。" },
    ],
    questions: [
      { id: 1, text: "What is the stated purpose of the survey?", options: { A: "To evaluate individual employee performance", B: "To improve the workplace environment", C: "To determine salary adjustments", D: "To assess management effectiveness only" }, answer: "B", explanation: "「Your feedback is anonymous and will be used to improve our workplace environment」と明記されています。" },
      { id: 2, text: "How will the survey results be shared with employees?", options: { A: "Via a direct email from HR", B: "At the annual company meeting", C: "In the December newsletter", D: "Through the company intranet portal" }, answer: "C", explanation: "「Results will be shared company-wide in the December newsletter」と記載されています。" },
      { id: 3, text: "What is indicated about the survey responses?", options: { A: "Employees must sign their names", B: "Responses will be kept anonymous", C: "Only managers will review the results", D: "Participation is mandatory" }, answer: "B", explanation: "「Your feedback is anonymous」と冒頭に明記されています。" }
    ]
  },
  {
    type: "Article", difficulty: "hard", title: "Urban Vertical Farming Expansion",
    lines: [
      { en: "The vertical farming industry, once regarded as a niche experiment in urban agriculture, has entered a period of rapid commercialization.", ja: "かつて都市農業のニッチな実験として見られていた垂直農業産業は、急速な商業化の段階に入っています。" },
      { en: "According to a recent industry report, the global market is projected to reach $24 billion by 2030, up from approximately $5.6 billion in 2022.", ja: "最近の業界レポートによると、世界市場は2022年の約56億ドルから2030年には240億ドルに達すると予測されています。" },
      { en: "", ja: "" },
      { en: "Vertical farms grow crops in stacked, climate-controlled layers using LED lighting and hydroponic or aeroponic systems, eliminating the need for soil and dramatically reducing water consumption — by up to 95 percent compared to conventional agriculture.", ja: "垂直農場は、LED照明と水耕または空中栽培システムを用いた積層型の温度管理された空間で作物を栽培し、土壌を不要とし、従来農業と比べ最大95%の節水を実現します。" },
      { en: "Proponents argue that these facilities can be positioned near city centers, reducing transportation costs and improving the freshness of produce reaching consumers.", ja: "支持者は、これらの施設を都市中心部の近くに設置することで輸送コストを削減し、消費者に届く農産物の鮮度を高めることができると主張しています。" },
      { en: "", ja: "" },
      { en: "Despite these advantages, critics point to the high energy demands of artificial lighting as a significant barrier to sustainability.", ja: "これらの利点にもかかわらず、批評家たちは人工照明の高いエネルギー需要を持続可能性への大きな障壁として指摘しています。" },
      { en: "A 2023 analysis found that energy costs account for as much as 40 percent of operating expenses for typical vertical farms.", ja: "2023年の分析では、エネルギーコストが一般的な垂直農場の運営費の最大40%を占めることが判明しました。" },
      { en: "Several operators have responded by partnering with renewable energy providers or integrating on-site solar installations to offset their carbon footprint.", ja: "複数の運営者は、再生可能エネルギー事業者との提携や施設内への太陽光発電設備の導入によって、カーボンフットプリントの相殺を図っています。" },
      { en: "", ja: "" },
      { en: "Investment in the sector has nonetheless slowed following a wave of high-profile bankruptcies in 2023 and 2024, prompting analysts to call for more realistic unit economics before the industry can achieve long-term viability.", ja: "しかし、2023年から2024年にかけて著名企業の経営破綻が相次いだことで業界への投資は鈍化しており、アナリストたちは業界が長期的な存続可能性を達成するにはより現実的なユニットエコノミクスが必要だと訴えています。" },
    ],
    questions: [
      { id: 1, text: "What is the main topic of the article?", options: { A: "The environmental impact of traditional farming", B: "The growth and challenges of the vertical farming industry", C: "Government investment in urban agriculture", D: "New LED technologies for crop production" }, answer: "B", explanation: "記事全体が垂直農業の急成長とそれが直面する課題（エネルギーコスト・倒産）を論じています。" },
      { id: 2, text: "According to the article, what is a major drawback of vertical farming?", options: { A: "Limited variety of crops that can be grown", B: "High water consumption compared to conventional farming", C: "Significant energy costs due to artificial lighting", D: "Difficulty locating suitable urban spaces" }, answer: "C", explanation: "「energy costs account for as much as 40 percent of operating expenses」と述べられており、エネルギーコストが主な課題として挙げられています。" },
      { id: 3, text: "What can be inferred from the mention of bankruptcies in 2023 and 2024?", options: { A: "Vertical farming technology has proven ineffective", B: "Investor confidence in the sector has been affected", C: "Government subsidies have been withdrawn", D: "Consumer demand for locally grown produce has declined" }, answer: "B", explanation: "「investment in the sector has slowed following a wave of high-profile bankruptcies」から、倒産が投資家心理に悪影響を与えたと推測できます。" }
    ]
  },
  {
    type: "Business Email", difficulty: "hard", title: "Contract Renewal Negotiation",
    lines: [
      { en: "From: Marcus Webb <m.webb@nexuslegal.com>", ja: "差出人：Marcus Webb <m.webb@nexuslegal.com>" },
      { en: "To: Patricia Solis <p.solis@arrowheadmfg.com>", ja: "宛先：Patricia Solis <p.solis@arrowheadmfg.com>" },
      { en: "Subject: RE: Service Agreement Renewal — Proposal for Discussion", ja: "件名：RE: サービス契約更新 — 協議のための提案" },
      { en: "", ja: "" },
      { en: "Dear Patricia,", ja: "Patricia様" },
      { en: "", ja: "" },
      { en: "Thank you for your email outlining Arrowhead Manufacturing's position regarding the upcoming renewal of our legal services agreement.", ja: "法律サービス契約の更新に関するArrowhead Manufacturingの立場を説明いただいたメールありがとうございます。" },
      { en: "I appreciate the transparency with which your team has approached these discussions.", ja: "貴チームがこの協議に真摯に取り組んでいただいていることに感謝します。" },
      { en: "", ja: "" },
      { en: "As I understand it, your primary concerns are the proposed 12% fee increase and the shift from quarterly to monthly billing cycles.", ja: "ご懸念の主な点は、提案されている12%の料金値上げと、四半期払いから月次払いへの変更だと理解しています。" },
      { en: "I would like to address each point in turn.", ja: "それぞれの点について順を追って説明させてください。" },
      { en: "", ja: "" },
      { en: "Regarding fees, the proposed increase reflects a significant expansion in the scope of services we have been providing over the past year, particularly in the areas of regulatory compliance and international contract review.", ja: "料金について、提案した値上げは過去1年間に当社が提供してきたサービス範囲の大幅な拡大、特に法令遵守と国際契約レビューの領域での拡大を反映しています。" },
      { en: "That said, we are prepared to revise the increase to 8% in exchange for a two-year commitment rather than the standard one-year renewal.", ja: "ただし、通常の1年更新ではなく2年契約をご締結いただける場合、値上げ幅を8%に修正することが可能です。" },
      { en: "", ja: "" },
      { en: "With respect to billing cycles, we are willing to maintain quarterly invoicing provided that payment terms are shortened from 45 to 30 days.", ja: "請求サイクルについては、支払条件を45日から30日に短縮していただく場合に限り、四半期払いを維持することに同意します。" },
      { en: "", ja: "" },
      { en: "I believe these adjustments represent a fair balance of interests.", ja: "これらの調整は双方の利益の公平なバランスを表していると考えています。" },
      { en: "I would welcome the opportunity to discuss further at your convenience.", ja: "ご都合のよいときにさらに協議できる機会をいただければ幸いです。" },
      { en: "Please let me know your availability for a call next week.", ja: "来週の通話のご都合をお知らせください。" },
      { en: "", ja: "" },
      { en: "Best regards,", ja: "よろしくお願いいたします。" },
      { en: "Marcus Webb", ja: "Marcus Webb" },
      { en: "Senior Partner, Nexus Legal", ja: "シニアパートナー、Nexus Legal" },
    ],
    questions: [
      { id: 1, text: "What is the main purpose of this email?", options: { A: "To terminate the existing service agreement", B: "To respond to concerns about a contract renewal proposal", C: "To introduce new legal services to Arrowhead Manufacturing", D: "To request payment for outstanding invoices" }, answer: "B", explanation: "「Thank you for outlining…concerns」「I would like to address each point」から、契約更新に関する懸念への返答だとわかります。" },
      { id: 2, text: "What condition does Marcus Webb attach to the reduced fee increase?", options: { A: "Arrowhead must increase its monthly usage of legal services", B: "Arrowhead must agree to a two-year contract", C: "Payment must be made in advance each quarter", D: "The billing cycle must change to monthly" }, answer: "B", explanation: "「we are prepared to revise the increase to 8% in exchange for a two-year commitment」と明記されています。" },
      { id: 3, text: "What compromise does Marcus offer regarding billing cycles?", options: { A: "Switching to monthly invoicing with extended payment terms", B: "Keeping quarterly invoicing if payment terms are shortened to 30 days", C: "Offering a discount for early payment under monthly billing", D: "Maintaining the current 45-day payment terms unchanged" }, answer: "B", explanation: "「willing to maintain quarterly invoicing provided that payment terms are shortened from 45 to 30 days」と述べられています。" }
    ]
  }
];

const RESULT_MSGS = [
  "もう一度挑戦しましょう！解説をよく読んで復習してください。",
  "あと少し！解説を確認してみましょう。",
  "惜しい！次は満点を目指して。",
  "全問正解！素晴らしいです 🎉"
];
