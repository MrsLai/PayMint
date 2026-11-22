import { TranslationDictionary } from './en';

export const ja: TranslationDictionary = {
  // Navigation & Global Actions
  'nav.calculator': '給与計算',
  'nav.compare': '昇給比較',
  'nav.compareCompact': '比較',
  'nav.retirement': '老後試算',
  'nav.retirementMobile': '老後',
  'nav.calculateMobile': '計算',
  'nav.settings': '設定',
  'nav.install': 'インストール',
  'nav.share': '共有',
  'nav.clearAmounts': '金額クリア',
  'nav.skipToMain': 'メインコンテンツへ',
  'nav.openGuide': '使い方ガイド',
  'nav.shortcutsLabel': 'キーボードショートカット',

  // Periods
  'period.Hourly': '時給',
  'period.Daily': '日給',
  'period.Weekly': '週給',
  'period.Fortnightly': '隔週給',
  'period.Monthly': '月給',
  'period.Annual': '年収',

  // Calculator View
  'calc.heroTitle': '手取り・給与計算ツール',
  'calc.quickTour': 'クイックツアー',
  'calc.retirementBtn': '老後資金試算',
  'calc.compareOfferBtn': '昇給・オファー比較',
  'calc.perOrdinaryHour': '通常1時間あたり',
  'calc.workdayHours': '1日 {hours}時間勤務',
  'calc.perWeek': '週払いの基準',
  'calc.perFortnight': '2週間ごとの支払い',
  'calc.perCalendarMonth': '1ヶ月あたり',
  'calc.weeksPerYear': '年間 {weeks} 週',
  'calc.loadedHourly': '加算後時給: {rate}/hr (+{pct}%)',
  'calc.employmentType': '雇用形態',
  'calc.fullTime': '正社員 (Full-Time)',
  'calc.partTime': 'パート (Part-Time)',
  'calc.casual': 'カジュアル (Casual)',
  'calc.agreedWeeklyHours': '所定週間労働時間',
  'calc.fortnightlyEquiv': '2週間で {hours}時間',
  'calc.casualLoading': 'カジュアル加算',
  'calc.taxFreeThreshold': '基礎控除枠 ($18,200)',
  'calc.shiftsOvertimeToggle': '残業・週末・祝日シフト',
  'calc.shiftsOvertimeDesc':
    '残業時間・割増倍率・カジュアル割増の計算方式を設定',
  'calc.saturdayHours': '土曜 (時間/週)',
  'calc.sundayHours': '日曜 (時間/週)',
  'calc.publicHolidayHours': '祝日 (時間/週)',
  'calc.overtimeHours': '残業 (時間/週)',
  'calc.casualPenaltyRule': 'カジュアル割増計算方式',
  'calc.compounding': '複利加算 (125% × 倍率)',
  'calc.cumulative': '単純合算 (+25% + 割増)',
  'calc.casualPhNote':
    'カジュアル：勤務しない祝日は無給、勤務時は {mult}x の割増率となります。',
  'calc.leaveTitle': '有給付与予測・OTE 年金対象額',
  'calc.annualLeaveEst': '年次有給休暇',
  'calc.personalLeaveEst': '病気・介護休暇',
  'calc.leaveCasualNone': 'なし（{pct}% のカジュアル加算に含む）',
  'calc.leaveHoursYr': '{hrs}時間 / 年',
  'calc.oteSuperLabel': 'OTE ({ote}) に基づく {label}',
  'calc.overtimeExclNote': '残業分 ({ot}) は OTE 年金対象外',
  'calc.beforeTaxGross': '税引前（額面）',
  'calc.totalPackageIncl': '総報酬（{label}込み）',
  'calc.cashTakeHome': '手取り額',
  'calc.taxShort': '税金',
  'calc.countryRulesLabel': '税制・{label}ルール',
  'calc.latestPct': '最新 {pct}%',
  'calc.onTop': '+ 別枠加算',
  'calc.included': 'パッケージ内',
  'calc.workSchedule': '勤務条件',
  'calc.privateHealth': '民間医療保険',
  'calc.optional': '任意',
  'calc.autoSynced': '自動同期 · 最新 {year} 税制・{label}ルール',
  'calc.syncLatestRules': '最新 ({year}) ルール同期',
  'calc.dependents': '扶養人数 (₫6.2M/月):',
  'calc.effectiveTaxRate': '実効税率:',
  'calc.marginal': '限界税率:',
  'calc.summaryTitle': '給与・控除サマリー',
  'calc.summaryEmpty':
    '上のカードに金額を入力すると、額面と手取りの内訳が表示されます',
  'calc.takeHomeRatio': '手取り率:',
  'calc.downloadCsv': 'CSV ダウンロード',
  'calc.exportPdf': 'PDF 出力',
  'calc.colPeriod': '期間',
  'calc.colGross': '額面給与',
  'calc.colTaxLevies': '税金・社会保険料',
  'calc.colAfterTax': '税引後給与',
  'calc.colPhiOther': '保険・その他控除',
  'calc.colConverted': '換算 ({code})',
  'calc.paidOnTop': '（給与に上乗せ）',
  'calc.includedInPackage': '（総報酬に含まれる）',

  // Proportion Chart
  'chart.title': '税金と手取りの割合',
  'chart.subtitle':
    '{period} 総報酬 ({currency}) における手取り、税金、{label}の構成比。',
  'chart.empty':
    '時給・日給・週給・隔週給・月給・年収を入力すると、内訳チャートが表示されます。',
  'chart.incomeTax': '所得税',
  'chart.totalPackage': '{period} 総報酬（{label}込み）',

  // Currency Converter
  'currency.title': '通貨換算ツール',
  'currency.retirementTitle': '老後資金 通貨換算',
  'currency.subtitleCalc': '{currency} の額面と手取りを他の通貨に換算します',
  'currency.subtitleCompare':
    '現在・目標・昇給差額を {currency} から他の通貨に換算します',
  'currency.subtitleRetirement':
    '予測資産と4%月額取崩額を {currency} から他の通貨に換算します',
  'currency.offOption': 'オフ（{currency} のみ）— 通貨を選択',
  'currency.pinnedFavorites': 'ピン留め通貨 ({count}/{max})',
  'currency.allCurrencies': 'すべての通貨',
  'currency.pin': '固定',
  'currency.pinned': '固定済',

  // Payrise Compare
  'compare.heroTitle': '昇給・転職オファー比較',
  'compare.heroSubtitle':
    '{authority} ルールに基づき、現在の給与と昇給・オファー額 ({currency}) を並べて比較します。',
  'compare.currentPay': '現在の給与',
  'compare.targetOffer': '目標 / 新規オファー',
  'compare.targetIncreasePct': '目標昇給率 (%)',
  'compare.netGainAnnual': '年間手取り増',
  'compare.netGainMonthly': '月間手取り増',
  'compare.netGainHourly': '時給換算手取り増',
  'compare.savedTitle': '保存済みの転職・昇給オファー比較',
  'compare.savedDesc':
    'ブラウザのローカル領域に保存されるため、いつでもオファーを比較・再確認できます。',
  'compare.savePlaceholder': 'オファー名（例: A社 シニア職オファー）',
  'compare.saveBtn': '比較を保存',
  'compare.loadBtn': '読み込む',
  'compare.deleteBtn': '削除',
  'compare.clearSavedBtn': 'すべて削除',
  'compare.savedEmpty':
    '保存された比較はまだありません。上で金額を入力し「比較を保存」をクリックするとローカルに保存されます。',
  'compare.savedBadge': 'ローカル保存',

  // Retirement Projections
  'retirement.heroTitle': '老後資産シミュレーション',
  'retirement.futureValue': '将来価値',
  'retirement.todaysMoney': '現在価値（実質）',

  // Global Settings
  'settings.title': 'グローバル設定',
  'settings.subtitle':
    '表示言語、各国の税制・年金ルール、テーマ・アクセントカラー、計算初期値をまとめて管理します。',
  'settings.languageLabel': '表示言語',
  'settings.tabTax': '税制・年金ルール',
  'settings.tabTaxDesc': '国・地域の税率表および退職金設定',
  'settings.tabTheme': 'テーマと外観',
  'settings.tabThemeDesc': 'ライト、ダーク、ミッドナイト高コントラスト＆配色',
  'settings.tabPrefs': '環境設定と初期値',
  'settings.tabPrefsDesc': '言語、勤務時間、固定通貨、老後試算とプライバシー',

  // Tax Settings
  'tax.title': '国別 所得税・年金ルール',
  'tax.resetAustralia': 'オーストラリア既定に戻す',
  'tax.selectCountry': '課税国・地域を選択',
  'tax.collapseAll': 'すべて折りたたむ',
  'tax.expandAll': 'すべて展開',

  // Theme Settings
  'theme.title': 'テーマ・外観設定',
  'theme.resetDefault': 'デフォルトに戻す',
  'theme.displayMode': '表示モード',
  'theme.displayModeDesc':
    '標準ライト、ダーク、OLED・高視認性向けミッドナイトモードから選択できます。',
  'theme.accentColor': 'アクセントカラー',
  'theme.accentColorDesc':
    'ボタン、アクティブタブ、フォーカス枠、グラフの基調色を選択します。',

  // Preferences Settings
  'prefs.title': '環境設定と計算デフォルト',
  'prefs.subtitle':
    '表示言語、標準勤務スケジュール、ピン留め通貨、老後試算条件をカスタマイズします。',
  'prefs.languageTitle': '表示言語・ロケール',
  'prefs.languageDesc':
    'ナビゲーション、計算項目、設定画面および出力レポートの言語を選択します。',
  'prefs.scheduleTitle': '勤務スケジュールと計算基準',
  'prefs.scheduleDesc': '時給・日給・月給・年収の相互換算に使用されます。',
  'prefs.resetSchedule': '{code} 標準に戻す',
  'prefs.hoursPerDay': '1日の所定労働時間',
  'prefs.daysPerWeek': '週の労働日数',
  'prefs.weeksPerYear': '年間の給与週数',
  'prefs.activeInputPeriod': '入力中の給与単位',
  'prefs.currencyTitle': '通貨換算・お気に入り固定',
  'prefs.currencyDesc':
    '最大 {max} 通貨をピン留め ({count}/{max}) して一覧の先頭に表示します。',
  'prefs.clearPinned': '固定を解除',
  'prefs.activeConversionCurrency': '換算先の通貨',
  'prefs.offCurrencyOnly': 'オフ（{currency} のみ）',
  'prefs.pinFavoriteCurrencies': 'お気に入り通貨を固定 ({count}/{max})',
  'prefs.retirementTitle': '老後資産モデルの初期条件',
  'prefs.retirementDesc':
    '貯蓄率、期待利回り、インフレ率、運用期間、実質/名目モードを調整します。',
  'prefs.resetAssumptions': '条件をリセット',
  'prefs.savingsRate': '貯蓄率（手取り比 %）',
  'prefs.annualReturn': '年率リターン',
  'prefs.annualInflation': '年率インフレ',
  'prefs.horizonYears': '運用期間（年）',
  'prefs.valueMode': '表示金額モード',
  'prefs.includeEmployer':
    '雇用主拠出 {label} ({rate}%) を将来予測に含める',
  'prefs.privacyTitle': 'ガイド・ショートカット・プライバシー',
  'prefs.privacyDesc':
    '最後に入力した給与、設定、保存済みの比較データはブラウザのローカルストレージのみに保存され、サーバーには送信されません。',
  'prefs.showWelcomeTitle': '起動時にウェルカムガイドを表示',
  'prefs.showWelcomeDesc': 'PocketWage を開いたときに概要ガイドを自動表示します。',
  'prefs.previewGuide': 'ガイドを見る',
  'prefs.shortcutsTitle': 'キーボードショートカット一覧',
  'prefs.shortcutsDesc': '画面切替 (Ctrl+1..4) や操作ショートカットを確認します。',
  'prefs.viewShortcuts': 'ショートカット表示',
  'prefs.clearAmountsTitle': '入力金額をすべて消去',
  'prefs.clearAmountsDesc':
    '入力した給与、控除、比較額、初期貯蓄額を即座にリセットします。',
  'prefs.clearAllAmounts': 'すべてクリア',

  // Cross-Device Cloud Sync (Optional)
  'sync.title': '複数端末のクラウド同期（任意）',
  'sync.desc':
    '通常はデータはこのブラウザ内のみに保存されます。別端末とも給与や比較データを同期したい場合のみ Google ログインを有効にしてください。',
  'sync.toggleLabel': '複数端末で同期する',
  'sync.signInGoogle': 'Google でログイン',
  'sync.signingIn': 'ログイン中...',
  'sync.signOut': 'ログアウトしてローカルのみ使用',
  'sync.syncNow': '今すぐ同期',
  'sync.syncing': '同期中...',
  'sync.synced': 'クラウド同期済み',
  'sync.localOnly': 'ローカルのみ',
  'sync.askSyncBtn': '端末間で同期',
  'sync.signedInAs': '{email} でログイン中',
  'sync.freeNote': '無料 Firebase Spark プラン · あなたのアカウント専用',

  // PDF Report & Print
  'pdf.previewTitle': '印刷用 PDF レポートプレビュー',
  'pdf.previewHint':
    'A4 縦 · 印刷ダイアログで送信先に「PDF に保存」を選択してください',
  'pdf.saveHtml': 'HTML 保存',
  'pdf.printSavePdf': '印刷 / PDF に保存',
  'pdf.closePreview': 'PDF プレビューを閉じる',
  'pdf.reportTitle': '給与・手取り額・控除明細レポート',
  'pdf.generated': '作成日 {date}',
  'pdf.annualNet': '年間手取り額',
  'pdf.annualGross': '年間課税対象額面',
  'pdf.annualTaxLevies': '年間税金・保険料',
  'pdf.annualRetirement': '年間 {label}',
  'pdf.grossPayAllocation': '額面給与の内訳',
  'pdf.payBreakdownByPeriod': '期間別給与内訳 ({currency})',
  'pdf.annualDeductionSummary': '年間控除サマリー',
  'pdf.totalAnnualDeductions': '年間税金・控除合計',
  'pdf.netAnnualTakeHomeCash': '年間最終手取り額',

  // Quick Tutorial
  'tour.badge': 'クイックツアー · ステップ {current} / {total}',
  'tour.exit': '終了',
  'tour.back': '戻る',
  'tour.next': '次へ',
  'tour.finish': '完了',
  'tour.step1Title': '1. 雇用形態と給与金額を入力',
  'tour.step1Desc':
    '正社員・パート・カジュアルを選び、時給・日給・週給・隔週給・月給・年収のいずれかを入力すると6期間が自動更新されます。',
  'tour.step2Title': '2. 通貨換算とピン留め',
  'tour.step2Desc':
    '換算先通貨を選ぶとリアルタイムレートで比較でき、よく使う通貨を最大5件固定できます。',
  'tour.step3Title': '3. 国別税制・カジュアル加算・シフト調整',
  'tour.step3Desc':
    '26ヶ国の最新2026–2027税制に切り替え、非課税枠や残業・週末割増・OTE 年金を細かく調整できます。',
  'tour.step4Title': '4. 明細・有給予測の確認と CSV / PDF 出力',
  'tour.step4Desc':
    '下の6期間明細・OTE年金・有給休暇予測を確認し、CSVやPDFレポートをいつでも保存できます。',
  'tour.step5Title': '5. 昇給比較・老後試算・チップサポート',
  'tour.step5Desc':
    'タブ（Ctrl+1..4）から昇給比較、老後試算、言語切替（繁體中文含む）や Stripe での任意サポートを行えます。',

  // Welcome Modal & Offline
  'welcome.title': 'PocketWage へようこそ',
  'welcome.subtitle':
    '26ヶ国対応の手取り計算、カジュアル/残業シフト試算、昇給比較、老後資産シミュレーション。',
  'welcome.getStarted': 'はじめる',
  'welcome.shortcuts': 'ショートカット',
  'welcome.guideCalcTitle': '01. 給与・カジュアル・シフト＆手取り計算',
  'welcome.guideCalcAction': '計算機を開く',
  'welcome.guideCalcDesc':
    '正社員・パート・カジュアルを切り替え、6種類の給与期間、週末/祝日割増、OTE年金、有給付与予測を一括計算します。',
  'welcome.guideCompareTitle': '02. 昇給・転職オファー比較',
  'welcome.guideCompareAction': 'オファー比較',
  'welcome.guideCompareDesc':
    '現在の給与と新オファーを並べて比較し、金額指定や昇給率（+5%〜+25%）で手取り増加額を確認できます。',
  'welcome.guideRetireTitle': '03. 老後資産・退職積立シミュレーション',
  'welcome.guideRetireAction': '老後プラン',
  'welcome.guideRetireDesc':
    '毎月の手取り貯蓄と雇用主拠出から1〜50年の複利成長を予測し、将来価値と現在価値を切り替えて確認できます。',
  'welcome.localSavedNote':
    '入力はすべてブラウザ内にローカル保存されます — 「金額クリア」でいつでも削除可能。',
  'welcome.supportLink': 'Stripe で PocketWage を応援する',
  'offline.banner': 'オフラインモード — キャッシュ済みアプリを利用可能',

  // Supporter Tips (Stripe)
  'support.button': '応援チップ',
  'support.modalTitle': 'PocketWage を応援する',
  'support.modalSubtitle':
    'PocketWage は無料でご利用いただけます。今後の開発や毎年の税制アップデートを支援したい場合は、Stripe Checkout から任意のチップをお送りいただけます。',
  'support.chooseAmount': '金額を選択 ({currency})',
  'support.customAmount': 'カスタム金額',
  'support.payButton': 'Stripe で続ける ({amount})',
  'support.redirecting': 'Stripe Checkout に接続中...',
  'support.notConfiguredTitle': 'Stripe Checkout はまだ設定されていません',
  'support.notConfiguredDesc':
    'サーバーの Secrets に STRIPE_SECRET_KEY（または VITE_STRIPE_DONATION_URL）を設定すると決済が有効になります。',
  'support.thankYouNotice':
    'PocketWage へのご支援ありがとうございます！Stripe でのお支払いが完了しました。',
  'support.cancelledNotice':
    'Stripe 決済はキャンセルされました — 請求は発生していません。',
  'support.secureNote': 'Stripe による安全な決済 · 利用は完全任意です',
  'support.errorGeneric':
    '現在 Stripe Checkout を開始できません。後ほどお試しください。',

  // Notices
  'notice.amountsCleared': 'すべての給与・貯蓄金額をクリアしました',
  'notice.languageChanged': '表示言語を {name} に切り替えました',
  'notice.comparisonSaved': '比較「{name}」をローカルに保存しました',
  'notice.comparisonLoaded': '比較「{name}」を読み込みました',
  'notice.syncEnabled': '{name} としてログイン — クラウド同期を有効化しました',
  'notice.syncDisabled': 'ログアウトしました — ローカル保存モードに切り替え',
  'notice.syncedNow': 'クラウドへ同期しました',

  // Legal & Policies
  'legal.privacyPolicy': 'プライバシーポリシー',
  'legal.termsConditions': '利用規約',
  'legal.footerNotice': 'PocketWage · ローカル優先の給与・老後資金試算ツール',
  'legal.disclaimer':
    '注記：当計算機は一般的な情報提供を目的とした概算のみを行うものであり、財務・税務・法務・会計上の助言を提供するものではありません。',
  'legal.effectiveDate': '最終更新日: 2026年11月15日',
  'legal.close': '閉じる',
  'legal.summaryTitle': 'プライバシー・利用規約',
  'legal.summaryDesc':
    'PocketWage のローカルデータ保護方針および試算結果に関する利用規約をご確認いただけます。',

  // Partner & Referral Integrations
  'calc.exportTaxApp': '税務連携',
  'partner.superPrompt':
    '低コストの {label} や ETF への統合・追加拠出が将来の老後資産残高に与える影響を確認できます。',
  'partner.openRetirement': '老後プラン',
  'partner.disclosure': '提携リンク · PocketWage が紹介手数料を受け取る場合があります（追加費用なし）',
  'partner.novatedToggle': 'Novated Lease 節税比較',
  'partner.novatedDesc':
    '税引前給与天引きによる節税見込額を試算し、提携リース見積りへ総支給額を引き継ぎます。',
  'partner.novatedPartnersTitle':
    '年収 {gross} を基に提携リースの見積りを比較',
  'partner.novatedNote': '対象となる税引前控除ルールに基づく概算です（手数料別）',
  'partner.taxModalTitle': '年間税務サマリーをエクスポート',
  'partner.taxPartnersHeading': '提携の税務・会計ソフトで続ける',
  'partner.taxModalPrivacy':
    '提携リンク利用時のみ集計済みの給与・税額パラメータが渡されます（追加費用なし）。',
};
