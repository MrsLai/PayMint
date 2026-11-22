import { TranslationDictionary } from './en';

export const zhTW: TranslationDictionary = {
  // Navigation & Global Actions
  'nav.calculator': '薪資計算機',
  'nav.compare': '調薪比較',
  'nav.compareCompact': '調薪比較',
  'nav.retirement': '退休規劃',
  'nav.retirementMobile': '退休',
  'nav.calculateMobile': '計算',
  'nav.settings': '系統設定',
  'nav.install': '安裝應用',
  'nav.share': '分享',
  'nav.clearAmounts': '清除金額',
  'nav.skipToMain': '跳至主要內容',
  'nav.openGuide': 'PocketWage 使用指南',
  'nav.shortcutsLabel': '鍵盤快捷鍵',

  // Periods
  'period.Hourly': '時薪',
  'period.Daily': '日薪',
  'period.Weekly': '週薪',
  'period.Fortnightly': '雙週薪',
  'period.Monthly': '月薪',
  'period.Annual': '年薪',

  // Calculator View
  'calc.heroTitle': '稅後實領薪資計算機',
  'calc.quickTour': '快速導覽',
  'calc.retirementBtn': '退休規劃',
  'calc.compareOfferBtn': '調薪 / Offer 比較',
  'calc.perOrdinaryHour': '每標準工時',
  'calc.workdayHours': '每日 {hours} 小時',
  'calc.perWeek': '每週計薪基準',
  'calc.perFortnight': '每 2 週一次',
  'calc.perCalendarMonth': '每曆月',
  'calc.weeksPerYear': '每年 {weeks} 週',
  'calc.loadedHourly': '含加成時薪: {rate}/hr (+{pct}%)',
  'calc.employmentType': '僱傭類型',
  'calc.fullTime': '全職 (Full-Time)',
  'calc.partTime': '兼職 (Part-Time)',
  'calc.casual': '臨時工 (Casual)',
  'calc.agreedWeeklyHours': '約定每週工時',
  'calc.fortnightlyEquiv': '每雙週 {hours} 小時',
  'calc.casualLoading': '臨時工加成 (Casual Loading)',
  'calc.taxFreeThreshold': '免稅額門檻 ($18,200)',
  'calc.shiftsOvertimeToggle': '加班、週末與國定假日班別',
  'calc.shiftsOvertimeDesc':
    '選填加班工時、倍率加給，以及臨時工複利或累加計算規則',
  'calc.saturdayHours': '週六 (時/週)',
  'calc.sundayHours': '週日 (時/週)',
  'calc.publicHolidayHours': '國定假日 (時/週)',
  'calc.overtimeHours': '加班 (時/週)',
  'calc.casualPenaltyRule': '臨時工加給計算規則',
  'calc.compounding': '複利疊加 (125% × 倍率)',
  'calc.cumulative': '累加計算 (+25% + 加給)',
  'calc.casualPhNote':
    '臨時工：未出勤無薪；於國定假日出勤時按 {mult}x 倍率計算。',
  'calc.leaveTitle': '特休累積與退休金 OTE 基數',
  'calc.annualLeaveEst': '年假 (Annual Leave)',
  'calc.personalLeaveEst': '病事假 (Personal Leave)',
  'calc.leaveCasualNone': '無 — 已包含於 {pct}% 臨時工加成內',
  'calc.leaveHoursYr': '{hrs} 小時 / 年',
  'calc.oteSuperLabel': '依 OTE 計算 {label} ({ote})',
  'calc.overtimeExclNote': '加班費 ({ot}) 不計入 OTE 退休金基數',
  'calc.beforeTaxGross': '稅前總薪資',
  'calc.totalPackageIncl': '總薪酬包 (含 {label})',
  'calc.cashTakeHome': '稅後實領現金',
  'calc.taxShort': '稅費',
  'calc.countryRulesLabel': '國家稅制與 {label} 規則',
  'calc.latestPct': '最新 {pct}%',
  'calc.onTop': '+ 額外提撥',
  'calc.included': '包含於總包',
  'calc.workSchedule': '工作制度',
  'calc.privateHealth': '私人醫療保險',
  'calc.optional': '選填',
  'calc.autoSynced': '已自動同步 · 最新 {year} 稅制與 {label} 規則',
  'calc.syncLatestRules': '同步最新 ({year}) 規則',
  'calc.dependents': '撫養親屬 (₫6.2M/月):',
  'calc.effectiveTaxRate': '實質稅率:',
  'calc.marginal': '邊際稅率:',
  'calc.summaryTitle': '完整薪資與扣繳明細表',
  'calc.summaryEmpty':
    '請在上方輸入任一週期的薪資金額，即可查看完整的稅前與稅後實領明細',
  'calc.takeHomeRatio': '實領比例:',
  'calc.downloadCsv': '下載 CSV',
  'calc.exportPdf': '匯出 PDF',
  'calc.colPeriod': '計薪週期',
  'calc.colGross': '稅前薪資',
  'calc.colTaxLevies': '所得稅與附加費',
  'calc.colAfterTax': '稅後薪資',
  'calc.colPhiOther': '醫保與其他扣款',
  'calc.colConverted': '換算 ({code})',
  'calc.paidOnTop': '(雇主額外提撥)',
  'calc.includedInPackage': '(含於總薪酬包內)',

  // Proportion Chart
  'chart.title': '稅負與實領薪資佔比',
  'chart.subtitle':
    '您的 {period} 總薪酬 ({currency}) 在稅後實領、稅費及 {label} 之間的分配比例。',
  'chart.empty':
    '在上方輸入時薪、日薪、週薪、雙週薪、月薪或年薪，即可顯示互動式圓餅佔比圖。',
  'chart.incomeTax': '個人所得稅',
  'chart.totalPackage': '{period} 總薪酬包 (含 {label})',

  // Currency Converter
  'currency.title': '即時匯率換算器',
  'currency.retirementTitle': '退休資產匯率換算器',
  'currency.subtitleCalc': '將 {currency} 稅前與稅後實領薪資換算為其他幣別',
  'currency.subtitleCompare': '將目前薪資、目標薪資與調薪差額從 {currency} 換算為其他幣別',
  'currency.subtitleRetirement':
    '將預估退休總額與 4% 每月提領金額從 {currency} 換算為其他幣別',
  'currency.offOption': '關閉 (僅顯示 {currency}) — 選擇目標幣別',
  'currency.pinnedFavorites': '已釘選常用幣別 ({count}/{max})',
  'currency.allCurrencies': '所有貨幣',
  'currency.pin': '釘選',
  'currency.pinned': '已釘選',

  // Payrise Compare
  'compare.heroTitle': '調薪與新 Offer 比較',
  'compare.heroSubtitle':
    '依據 {authority} 規則，將目前薪資與調薪或新工作 Offer ({currency}) 並排比較。',
  'compare.currentPay': '目前薪資',
  'compare.targetOffer': '目標 / 新 Offer',
  'compare.targetIncreasePct': '目標調幅 (%)',
  'compare.netGainAnnual': '年度淨增收',
  'compare.netGainMonthly': '每月淨增收',
  'compare.netGainHourly': '每小時淨增收',
  'compare.savedTitle': '已儲存的工作 Offer 比較',
  'compare.savedDesc':
    '資料透過 localStorage 儲存在您的瀏覽器本機中，方便隨時開啟與比較。',
  'compare.savePlaceholder': 'Offer 標籤（例如：Acme 資深工程師）',
  'compare.saveBtn': '儲存比較',
  'compare.loadBtn': '載入',
  'compare.deleteBtn': '刪除',
  'compare.clearSavedBtn': '清除已儲存',
  'compare.savedEmpty':
    '目前沒有已儲存的比較。在上方輸入薪資並點擊「儲存比較」即可保存在本機瀏覽器。',
  'compare.savedBadge': '已存於本機',

  // Retirement Projections
  'retirement.heroTitle': '退休資產複利預測',
  'retirement.futureValue': '未來名目價值',
  'retirement.todaysMoney': '折算今日購買力',

  // Global Settings
  'settings.title': '系統設定',
  'settings.subtitle':
    '一站式管理介面語言、各國稅制與退休金規則、顯示主題配色與計算預設值。',
  'settings.languageLabel': '介面語言',
  'settings.tabTax': '稅制與退休金規則',
  'settings.tabTaxDesc': '國家稅務管轄區、所得稅級距與退休提撥比例',
  'settings.tabTheme': '主題與外觀',
  'settings.tabThemeDesc': '淺色、深色、午夜高對比模式與主題強調色',
  'settings.tabPrefs': '偏好與預設參數',
  'settings.tabPrefsDesc': '語言切換、工時制度、常用貨幣釘選、退休與隱私設定',

  // Tax Settings
  'tax.title': '各國個人所得稅與退休金規則',
  'tax.resetAustralia': '重設為澳洲預設值',
  'tax.selectCountry': '選擇稅務管轄區',
  'tax.collapseAll': '全部收合',
  'tax.expandAll': '全部展開',

  // Theme Settings
  'theme.title': '主題與外觀設定',
  'theme.resetDefault': '恢復預設主題',
  'theme.displayMode': '顯示模式',
  'theme.displayModeDesc':
    '可選擇標準淺色、舒適深色，或專為 OLED 與高對比閱讀設計的午夜模式。',
  'theme.accentColor': '主題強調色系',
  'theme.accentColorDesc': '為按鈕、作用中分頁、焦點外框與圖表挑選強調色彩。',

  // Preferences Settings
  'prefs.title': '偏好與計算預設設定',
  'prefs.subtitle':
    '自訂介面語言、預設工作制度、常用貨幣釘選、退休複利參數與啟動導覽。',
  'prefs.languageTitle': '介面語言與地區顯示',
  'prefs.languageDesc': '選擇導覽列、計算機標籤、設定頁面與匯出報表的顯示語言。',
  'prefs.scheduleTitle': '工時制度與計薪基準',
  'prefs.scheduleDesc': '用於在計算機中同步換算時薪、日薪、週薪、雙週薪、月薪與年薪。',
  'prefs.resetSchedule': '恢復 {code} 預設工時',
  'prefs.hoursPerDay': '每日標準工時',
  'prefs.daysPerWeek': '每週工作天數',
  'prefs.weeksPerYear': '每年計薪週數',
  'prefs.activeInputPeriod': '目前輸入計薪週期',
  'prefs.currencyTitle': '匯率換算與常用貨幣釘選',
  'prefs.currencyDesc':
    '最多釘選 {max} 個常用幣別 ({count}/{max} 已釘選)，使其優先顯示於下拉選單頂部。',
  'prefs.clearPinned': '清除釘選',
  'prefs.activeConversionCurrency': '目前目標換算幣別',
  'prefs.offCurrencyOnly': '關閉 (僅顯示 {currency})',
  'prefs.pinFavoriteCurrencies': '釘選常用貨幣 ({count}/{max})',
  'prefs.retirementTitle': '退休複利模型預設參數',
  'prefs.retirementDesc': '調整儲蓄比例、年化報酬率、通膨率、投資年數與折現模式。',
  'prefs.resetAssumptions': '恢復預設參數',
  'prefs.savingsRate': '儲蓄率 (佔淨收入 %)',
  'prefs.annualReturn': '年化報酬率',
  'prefs.annualInflation': '年通膨率',
  'prefs.horizonYears': '投資年期 (年)',
  'prefs.valueMode': '預測估值模式',
  'prefs.includeEmployer':
    '在退休成長預測中計入雇主提撥的 {label} ({rate}%)',
  'prefs.privacyTitle': '使用導覽、快捷鍵與隱私保護',
  'prefs.privacyDesc':
    '您最後輸入的薪資、偏好設定與已儲存的 Offer 比較僅存放於本機瀏覽器中（絕不上傳至任何伺服器）。',
  'prefs.showWelcomeTitle': '啟動時顯示歡迎指南',
  'prefs.showWelcomeDesc': '每次開啟 PocketWage 時自動顯示功能簡介指南。',
  'prefs.previewGuide': '預覽指南',
  'prefs.shortcutsTitle': '鍵盤快捷鍵一覽',
  'prefs.shortcutsDesc': '查看分頁切換 (Ctrl+1..4) 與快速操作熱鍵。',
  'prefs.viewShortcuts': '查看快捷鍵',
  'prefs.clearAmountsTitle': '清除目前工作階段金額',
  'prefs.clearAmountsDesc': '立即清除已輸入的薪資、扣款、比較數字與起始儲蓄額。',
  'prefs.clearAllAmounts': '清除所有金額',

  // Cross-Device Cloud Sync (Optional)
  'sync.title': '跨裝置雲端同步（選用）',
  'sync.desc':
    '預設所有資料僅儲存在此瀏覽器中。僅在您明確開啟並使用 Google 登入時，才會私密同步您的薪資工作區與比較紀錄。',
  'sync.toggleLabel': '啟用跨裝置同步',
  'sync.signInGoogle': '使用 Google 帳號登入',
  'sync.signingIn': '登入中...',
  'sync.signOut': '登出並改回純本機模式',
  'sync.syncNow': '立即同步',
  'sync.syncing': '同步中...',
  'sync.synced': '已跨裝置同步',
  'sync.localOnly': '僅存本機',
  'sync.askSyncBtn': '跨裝置同步',
  'sync.signedInAs': '已登入：{email}',
  'sync.freeNote': '免費 Firebase Spark 方案 · 僅限您的 Google 帳號存取',

  // PDF Report & Print
  'pdf.previewTitle': '可列印 PDF 報告預覽',
  'pdf.previewHint': 'A4 直向 · 請在列印視窗中選擇「另存為 PDF」作為目的地',
  'pdf.saveHtml': '儲存 HTML',
  'pdf.printSavePdf': '列印 / 另存為 PDF',
  'pdf.closePreview': '關閉 PDF 預覽',
  'pdf.reportTitle': '薪資明細與稅後實領分析報告',
  'pdf.generated': '產生日期：{date}',
  'pdf.annualNet': '年度實領現金',
  'pdf.annualGross': '年度應稅總薪資',
  'pdf.annualTaxLevies': '年度稅額與附加費',
  'pdf.annualRetirement': '年度 {label}',
  'pdf.grossPayAllocation': '稅前薪資分配比例',
  'pdf.payBreakdownByPeriod': '各計薪週期明細 ({currency})',
  'pdf.annualDeductionSummary': '年度扣繳與稅額摘要',
  'pdf.totalAnnualDeductions': '年度稅費與扣款總計',
  'pdf.netAnnualTakeHomeCash': '年度實領淨現金',

  // Quick Tutorial
  'tour.badge': '快速導覽 · 第 {current} / {total} 步',
  'tour.exit': '結束導覽',
  'tour.back': '上一步',
  'tour.next': '下一步',
  'tour.finish': '完成',
  'tour.step1Title': '1. 選擇僱傭類型並輸入薪資',
  'tour.step1Desc':
    '先選擇全職、兼職或臨時工，再輸入時薪、日薪、週薪、雙週薪、月薪或年薪。6 種週期與實領薪資將即時連動更新。',
  'tour.step2Title': '2. 匯率換算與常用貨幣釘選',
  'tour.step2Desc':
    '選擇目標貨幣即可查看即時匯率換算的稅前與實領薪資，並可將最多 5 個常用幣別釘選至頂部。',
  'tour.step3Title': '3. 自訂國家稅制、臨時工加成與班別',
  'tour.step3Desc':
    '切換已同步 2026–2027 最新規則的 26 個國家，調整免稅額門檻、臨時工加成、週末/國定假日加班與 OTE 退休金。',
  'tour.step4Title': '4. 檢視明細、特休估計並匯出 CSV / PDF',
  'tour.step4Desc':
    '在下方檢視完整的 6 週期明細、OTE 退休金與按比例計算的年假/病假時數，並可隨時匯出 CSV 或 PDF 報告。',
  'tour.step5Title': '5. Offer 比較、退休預測與贊助支持',
  'tour.step5Desc':
    '隨時切換分頁（Ctrl+1..4）比較調薪幅度、預測退休資產，在設定切換繁體中文或透過 Stripe 小額支持開發者。',

  // Welcome Modal & Offline
  'welcome.title': '歡迎使用 PocketWage',
  'welcome.subtitle':
    '支援全職/兼職/臨時工薪資模型、加班倍率試算、調薪比較與退休預測，涵蓋 26 個國家。',
  'welcome.getStarted': '開始使用',
  'welcome.shortcuts': '快捷鍵',
  'welcome.guideCalcTitle': '01. 薪資、臨時工加成、班別與實領計算機',
  'welcome.guideCalcAction': '開啟計算機',
  'welcome.guideCalcDesc':
    '自由切換全職、兼職與臨時工，輸入時薪至年薪共 6 種週期，支援週末/國定假日/加班倍率、免稅額門檻、OTE 退休金與按比例特休估計。',
  'welcome.guideCompareTitle': '02. 調薪與新工作 Offer 比較',
  'welcome.guideCompareAction': '比較 Offer',
  'welcome.guideCompareDesc':
    '將目前薪資與目標薪資或新工作 Offer 並排比較，支援直接輸入金額或一鍵套用調幅百分比 (+5% 至 +25%)。',
  'welcome.guideRetireTitle': '03. 退休資產複利預測',
  'welcome.guideRetireAction': '規劃退休',
  'welcome.guideRetireDesc':
    '根據每月實領儲蓄與雇主退休提撥模擬 1–50 年複利成長，隨時切換未來名目價值或今日購買力，並可換算任意幣別。',
  'welcome.localSavedNote':
    '所有資料預設儲存於本機瀏覽器 — 隨時可點擊「清除金額」保障隱私。',
  'welcome.supportLink': '透過 Stripe 贊助支持 PocketWage',
  'offline.banner': '離線模式 — 快取應用程式已就緒',

  // Supporter Tips (Stripe)
  'support.button': '贊助 / 打賞',
  'support.modalTitle': '支持 PocketWage 持續開發',
  'support.modalSubtitle':
    'PocketWage 完全免費使用。若這個工具對您有幫助，歡迎透過 Stripe Checkout 小額打賞支持維護與稅率更新。',
  'support.chooseAmount': '選擇贊助金額 ({currency})',
  'support.customAmount': '自訂金額',
  'support.payButton': '前往 Stripe 結帳 ({amount})',
  'support.redirecting': '正在連線至 Stripe Checkout...',
  'support.notConfiguredTitle': '尚未設定 Stripe Checkout 金鑰',
  'support.notConfiguredDesc':
    '請於伺服器 Secrets 設定 STRIPE_SECRET_KEY（或設定 VITE_STRIPE_DONATION_URL 付款連結）以啟用線上贊助收款。',
  'support.thankYouNotice': '感謝您贊助支持 PocketWage！您的 Stripe 付款已成功。',
  'support.cancelledNotice': '已取消 Stripe 結帳 — 未產生任何扣款。',
  'support.secureNote': '由 Stripe 安全處理付款 · 完全自願且不影響任何免費功能',
  'support.errorGeneric': '目前無法啟動 Stripe Checkout，請稍後再試。',

  // Notices
  'notice.amountsCleared': '已清除所有薪資與儲蓄金額',
  'notice.languageChanged': '顯示語言已切換為 {name}',
  'notice.comparisonSaved': '已在瀏覽器儲存比較「{name}」',
  'notice.comparisonLoaded': '已載入比較「{name}」',
  'notice.syncEnabled': '已登入 {name} — 跨裝置同步已開啟',
  'notice.syncDisabled': '已登出 — 已切回純本機模式',
  'notice.syncedNow': '工作區已同步至雲端',

  // Legal & Policies
  'legal.privacyPolicy': '隱私權政策',
  'legal.termsConditions': '服務條款',
  'legal.footerNotice': 'PocketWage · 本機優先的薪資與退休估算工具',
  'legal.disclaimer':
    '注意：我們的計算機僅提供一般資訊參考估算，並不構成財務、稅務、法律或會計建議。',
  'legal.effectiveDate': '最後更新：2026 年 11 月 15 日',
  'legal.close': '關閉',
  'legal.summaryTitle': '隱私權與服務條款',
  'legal.summaryDesc':
    '了解 PocketWage 如何在本機保護您的隱私資料，以及估算結果的適用條款。',

  // Partner & Referral Integrations
  'calc.exportTaxApp': '稅務匯出',
  'partner.superPrompt':
    '查看整合帳戶或薪資自提投入低費率 {label} 或 ETF 基金對長期退休餘額的影響。',
  'partner.openRetirement': '退休規劃',
  'partner.disclosure': '合作夥伴推薦 · PocketWage 可能獲得推薦佣金，您無須支付額外費用',
  'partner.novatedToggle': '比較汽車薪資租賃節稅 (Novated Lease)',
  'partner.novatedDesc':
    '估算稅前薪資扣繳節稅額度，並將稅前薪資帶入合作夥伴租賃試算工具。',
  'partner.novatedPartnersTitle':
    '依據您的稅前年薪 {gross} 比較即時租賃報價',
  'partner.novatedNote': '估算假設符合稅前薪資扣繳資格，不含經銷商融資手續費',
  'partner.taxModalTitle': '匯出年度稅務摘要',
  'partner.taxPartnersHeading': '前往合作報稅與會計軟體',
  'partner.taxModalPrivacy':
    '僅於您點擊合作連結時傳送彙總薪資與稅額數據；PocketWage 可能獲得推薦佣金而不增加您的費用。',
};
