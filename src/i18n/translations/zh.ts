import { TranslationDictionary } from './en';

export const zh: TranslationDictionary = {
  // Navigation & Global Actions
  'nav.calculator': '薪资计算器',
  'nav.compare': '涨薪对比',
  'nav.compareCompact': '涨薪对比',
  'nav.retirement': '退休规划',
  'nav.retirementMobile': '退休',
  'nav.calculateMobile': '计算',
  'nav.settings': '全局设置',
  'nav.install': '安装应用',
  'nav.share': '分享',
  'nav.clearAmounts': '清空金额',
  'nav.skipToMain': '跳至主内容',
  'nav.openGuide': '使用指南',
  'nav.shortcutsLabel': '键盘快捷键',

  // Periods
  'period.Hourly': '时薪',
  'period.Daily': '日薪',
  'period.Weekly': '周薪',
  'period.Fortnightly': '双周薪',
  'period.Monthly': '月薪',
  'period.Annual': '年薪',

  // Calculator View
  'calc.heroTitle': '税后实发薪资计算器',
  'calc.quickTour': '快速教程',
  'calc.retirementBtn': '退休规划',
  'calc.compareOfferBtn': '涨薪 / Offer 对比',
  'calc.perOrdinaryHour': '每标准工时',
  'calc.workdayHours': '每日 {hours} 小时',
  'calc.perWeek': '每周计薪基准',
  'calc.perFortnight': '每 2 周一次',
  'calc.perCalendarMonth': '每自然月',
  'calc.weeksPerYear': '每年 {weeks} 周',
  'calc.loadedHourly': '含加成时薪: {rate}/hr (+{pct}%)',
  'calc.employmentType': '雇佣类型',
  'calc.fullTime': '全职 (Full-Time)',
  'calc.partTime': '兼职 (Part-Time)',
  'calc.casual': '临时工 (Casual)',
  'calc.agreedWeeklyHours': '约定每周工时',
  'calc.fortnightlyEquiv': '每双周 {hours} 小时',
  'calc.casualLoading': '临时工加成 (Casual Loading)',
  'calc.taxFreeThreshold': '免税额门槛 ($18,200)',
  'calc.shiftsOvertimeToggle': '加班、周末与法定假日班次',
  'calc.shiftsOvertimeDesc':
    '选填加班工时、倍率加给及临时工复利/累加规则',
  'calc.saturdayHours': '周六 (时/周)',
  'calc.sundayHours': '周日 (时/周)',
  'calc.publicHolidayHours': '法定假日 (时/周)',
  'calc.overtimeHours': '加班 (时/周)',
  'calc.casualPenaltyRule': '临时工加给计算规则',
  'calc.compounding': '复利叠加 (125% × 倍率)',
  'calc.cumulative': '累加计算 (+25% + 加给)',
  'calc.casualPhNote':
    '临时工：未出勤无薪；法定假日出勤按 {mult}x 倍率计算。',
  'calc.leaveTitle': '年假累计与养老金 OTE 基数',
  'calc.annualLeaveEst': '年假 (Annual Leave)',
  'calc.personalLeaveEst': '病事假 (Personal Leave)',
  'calc.leaveCasualNone': '无 — 已包含在 {pct}% 临时工加成中',
  'calc.leaveHoursYr': '{hrs} 小时 / 年',
  'calc.oteSuperLabel': '按 OTE 计算 {label} ({ote})',
  'calc.overtimeExclNote': '加班费 ({ot}) 不计入 OTE 基数',
  'calc.beforeTaxGross': '税前总薪资',
  'calc.totalPackageIncl': '总薪酬包 (含 {label})',
  'calc.cashTakeHome': '税后实发',
  'calc.taxShort': '税费',
  'calc.countryRulesLabel': '国家税制与 {label} 规则',
  'calc.latestPct': '最新 {pct}%',
  'calc.onTop': '+ 额外缴纳',
  'calc.included': '包含在包内',
  'calc.workSchedule': '工作制度',
  'calc.privateHealth': '商业医保',
  'calc.optional': '可选',
  'calc.autoSynced': '已自动同步 · 最新 {year} 税制与 {label} 规则',
  'calc.syncLatestRules': '同步最新 ({year}) 规则',
  'calc.dependents': '赡养人口 (₫6.2M/月):',
  'calc.effectiveTaxRate': '实际税率:',
  'calc.marginal': '边际税率:',
  'calc.summaryTitle': '完整薪资与扣款明细表',
  'calc.summaryEmpty': '在上方输入任意周期的薪资金额，即可查看完整税前税后明细',
  'calc.takeHomeRatio': '实发比例:',
  'calc.downloadCsv': '下载 CSV',
  'calc.exportPdf': '导出 PDF',
  'calc.colPeriod': '周期',
  'calc.colGross': '税前薪资',
  'calc.colTaxLevies': '个税与附加费',
  'calc.colAfterTax': '税后薪资',
  'calc.colPhiOther': '医保与其他扣款',
  'calc.colConverted': '换算 ({code})',
  'calc.paidOnTop': '(雇主额外缴纳)',
  'calc.includedInPackage': '(含于总包内)',

  // Proportion Chart
  'chart.title': '税费与实发薪资占比',
  'chart.subtitle':
    '您的 {period} 总薪酬 ({currency}) 在税后实发、税费及 {label} 之间的分配比例。',
  'chart.empty':
    '在上方输入时薪、日薪、周薪、双周薪、月薪或年薪，即可渲染交互式分布环形图。',
  'chart.incomeTax': '个人所得税',
  'chart.totalPackage': '{period} 总薪酬包 (含 {label})',

  // Currency Converter
  'currency.title': '实时汇率换算器',
  'currency.retirementTitle': '退休财富汇率换算器',
  'currency.subtitleCalc': '将 {currency} 税前与税后实发薪资换算为其他币种',
  'currency.subtitleCompare': '将当前、目标薪资及涨幅差额从 {currency} 换算为其他币种',
  'currency.subtitleRetirement':
    '将预计退休金及 4% 月度提取额从 {currency} 换算为其他币种',
  'currency.offOption': '关闭 (仅 {currency}) — 选择目标币种',
  'currency.pinnedFavorites': '已置顶常用币种 ({count}/{max})',
  'currency.allCurrencies': '所有货币',
  'currency.pin': '置顶',
  'currency.pinned': '已置顶',

  // Payrise Compare
  'compare.heroTitle': '涨薪与新 Offer 对比',
  'compare.heroSubtitle':
    '基于 {authority} 规则，将当前薪资与涨薪或新工作 Offer ({currency}) 并排对比。',
  'compare.currentPay': '当前薪资',
  'compare.targetOffer': '目标 / 新 Offer',
  'compare.targetIncreasePct': '目标涨幅 (%)',
  'compare.netGainAnnual': '年度净增收',
  'compare.netGainMonthly': '月度净增收',
  'compare.netGainHourly': '每小时净增收',
  'compare.savedTitle': '已保存的工作 Offer 对比',
  'compare.savedDesc':
    '数据通过 localStorage 保存在本地浏览器中，方便随时回顾与对比不同 Offer。',
  'compare.savePlaceholder': 'Offer 标签（如：Acme 高级工程师）',
  'compare.saveBtn': '保存对比',
  'compare.loadBtn': '载入',
  'compare.deleteBtn': '删除',
  'compare.clearSavedBtn': '清空已保存',
  'compare.savedEmpty':
    '暂无已保存的对比。在上方输入薪资金额并点击「保存对比」即可保存在浏览器本地。',
  'compare.savedBadge': '本地已保存',

  // Retirement Projections
  'retirement.heroTitle': '退休财富复利预测',
  'retirement.futureValue': '未来名义价值',
  'retirement.todaysMoney': '按今日购买力',

  // Global Settings
  'settings.title': '全局设置',
  'settings.subtitle':
    '一站式管理界面语言、各国税制与养老金规则、外观主题配色以及计算默认参数。',
  'settings.languageLabel': '界面语言',
  'settings.tabTax': '税制与养老金规则',
  'settings.tabTaxDesc': '国家/地区税率、个税级距与退休金比例',
  'settings.tabTheme': '主题与外观',
  'settings.tabThemeDesc': '浅色、深色、午夜高对比模式与主题强调色',
  'settings.tabPrefs': '偏好与默认参数',
  'settings.tabPrefsDesc': '语言切换、工时制度、置顶币种、退休与隐私设置',

  // Tax Settings
  'tax.title': '各国个人所得税与养老金规则',
  'tax.resetAustralia': '恢复澳大利亚默认',
  'tax.selectCountry': '选择税务管辖区',
  'tax.collapseAll': '全部折叠',
  'tax.expandAll': '全部展开',

  // Theme Settings
  'theme.title': '主题与外观设置',
  'theme.resetDefault': '恢复默认主题',
  'theme.displayMode': '显示模式',
  'theme.displayModeDesc':
    '可选择标准浅色、护眼深色，或专为 OLED 与高可读性打造的午夜高对比模式。',
  'theme.accentColor': '主题强调色板',
  'theme.accentColorDesc': '为按钮、导航高亮、焦点边框及图表选择专属强调色。',

  // Preferences Settings
  'prefs.title': '偏好与计算默认设置',
  'prefs.subtitle':
    '自定义界面语言、默认工作制、常用货币置顶、退休预测参数与启动引导。',
  'prefs.languageTitle': '界面语言与区域显示',
  'prefs.languageDesc': '选择导航菜单、计算器标签、全局设置及导出报告的显示语言。',
  'prefs.scheduleTitle': '工时制度与计薪基准',
  'prefs.scheduleDesc': '用于在计算器中同步换算时薪、日薪、月薪与年薪。',
  'prefs.resetSchedule': '恢复 {code} 默认工时',
  'prefs.hoursPerDay': '每日工时',
  'prefs.daysPerWeek': '每周工作天数',
  'prefs.weeksPerYear': '每年计薪周数',
  'prefs.activeInputPeriod': '当前输入周期',
  'prefs.currencyTitle': '汇率换算与置顶常用币种',
  'prefs.currencyDesc':
    '最多置顶 {max} 个常用币种 ({count}/{max} 已置顶)，使其显示在下拉列表顶部。',
  'prefs.clearPinned': '清空置顶',
  'prefs.activeConversionCurrency': '当前目标换算币种',
  'prefs.offCurrencyOnly': '关闭 (仅 {currency})',
  'prefs.pinFavoriteCurrencies': '置顶常用货币 ({count}/{max})',
  'prefs.retirementTitle': '退休复利模型默认参数',
  'prefs.retirementDesc': '调整储蓄比例、年化收益、通胀率、投资年限与折现模式。',
  'prefs.resetAssumptions': '恢复默认参数',
  'prefs.savingsRate': '储蓄率 (占净收入 %)',
  'prefs.annualReturn': '年化收益率',
  'prefs.annualInflation': '年通胀率',
  'prefs.horizonYears': '投资年限 (年)',
  'prefs.valueMode': '预测估值模式',
  'prefs.includeEmployer':
    '在退休预测增长中计入雇主缴纳的 {label} ({rate}%)',
  'prefs.privacyTitle': '新手引导、快捷键与会话隐私',
  'prefs.privacyDesc':
    '您最近输入的薪资、偏好设置与已保存的 Offer 对比均仅保存在本地浏览器中（绝不上传至任何服务器）。',
  'prefs.showWelcomeTitle': '启动时显示欢迎指南',
  'prefs.showWelcomeDesc': '每次打开 PocketWage 时自动弹出快速功能概览。',
  'prefs.previewGuide': '预览指南',
  'prefs.shortcutsTitle': '键盘快捷键说明',
  'prefs.shortcutsDesc': '查看页面切换 (Ctrl+1..4) 与快捷操作按键。',
  'prefs.viewShortcuts': '查看快捷键',
  'prefs.clearAmountsTitle': '清空当前会话金额',
  'prefs.clearAmountsDesc': '立即清除已输入的薪资、扣款、对比数据及起始储蓄额。',
  'prefs.clearAllAmounts': '清空全部金额',

  // Cross-Device Cloud Sync (Optional)
  'sync.title': '跨设备云同步（可选）',
  'sync.desc':
    '默认情况下数据仅保存在当前浏览器。仅当您主动希望在多设备间同步最近薪资与对比记录时，再开启 Google 登录同步。',
  'sync.toggleLabel': '开启跨设备同步',
  'sync.signInGoogle': '使用 Google 账号登录',
  'sync.signingIn': '正在登录...',
  'sync.signOut': '退出并仅限本地',
  'sync.syncNow': '立即同步',
  'sync.syncing': '正在同步...',
  'sync.synced': '已跨设备同步',
  'sync.localOnly': '仅本地存储',
  'sync.askSyncBtn': '跨设备同步',
  'sync.signedInAs': '已登录 {email}',
  'sync.freeNote': '免费 Firebase Spark 额度 · 仅限您的 Google 账号私密访问',

  // PDF Report & Print
  'pdf.previewTitle': '可打印 PDF 报告预览',
  'pdf.previewHint': 'A4 纵向排版 · 在打印对话框中选择「另存为 PDF」即可保存',
  'pdf.saveHtml': '保存 HTML',
  'pdf.printSavePdf': '打印 / 另存为 PDF',
  'pdf.closePreview': '关闭 PDF 预览',
  'pdf.reportTitle': '薪资结构与税后实发明细报告',
  'pdf.generated': '生成日期 {date}',
  'pdf.annualNet': '年度税后实发',
  'pdf.annualGross': '年度应税总薪资',
  'pdf.annualTaxLevies': '年度税费与附加',
  'pdf.annualRetirement': '年度 {label}',
  'pdf.grossPayAllocation': '税前薪资分配比例',
  'pdf.payBreakdownByPeriod': '各周期薪资明细 ({currency})',
  'pdf.annualDeductionSummary': '年度扣款与税费汇总',
  'pdf.totalAnnualDeductions': '年度税费与扣款合计',
  'pdf.netAnnualTakeHomeCash': '年度税后现金净收入',

  // Quick Tutorial
  'tour.badge': '快速教程 · 第 {current} / {total} 步',
  'tour.exit': '退出教程',
  'tour.back': '上一步',
  'tour.next': '下一步',
  'tour.finish': '完成',
  'tour.step1Title': '1. 选择雇佣类型并输入薪资',
  'tour.step1Desc':
    '先选择全职、兼职或临时工，再输入时薪、日薪、周薪、双周薪、月薪或年薪，六个周期与税后实发将同步更新。',
  'tour.step2Title': '2. 汇率换算与置顶常用币种',
  'tour.step2Desc':
    '选择目标货币即可实时查看换算后的税前与实发收入，并支持置顶最多 5 个常用币种。',
  'tour.step3Title': '3. 自定义雇佣规则、班次与税制',
  'tour.step3Desc':
    '切换已同步 2026–2027 最新规则的 26 个国家，调整免税额门槛、临时工加成、周末加班与 OTE 养老金。',
  'tour.step4Title': '4. 查看明细、年假并导出 CSV / PDF',
  'tour.step4Desc':
    '在下方查看完整六周期明细、OTE 养老金与按比例计算的年假估计，并随时导出 CSV / PDF 报表。',
  'tour.step5Title': '5. 涨薪对比、退休规划与赞赏支持',
  'tour.step5Desc':
    '随时切换标签页（Ctrl+1..4）进行涨薪对比、退休财富测算，或在设置切换繁体中文与通过 Stripe 打赏支持。',

  // Welcome Modal & Offline
  'welcome.title': '欢迎使用 PocketWage',
  'welcome.subtitle':
    '支持全职/兼职/临时工、加班倍率、涨薪对比与退休复利预测，覆盖 26 个国家。',
  'welcome.getStarted': '开始使用',
  'welcome.shortcuts': '快捷键',
  'welcome.guideCalcTitle': '01. 薪资、临时工、班次与实发计算器',
  'welcome.guideCalcAction': '打开计算器',
  'welcome.guideCalcDesc':
    '支持全职、兼职与临时工切换，时薪至年薪共 6 种周期同步计算，包含周末/假日加班倍率、免税额门槛、OTE 养老金与年假估算。',
  'welcome.guideCompareTitle': '02. 涨薪与新 Offer 对比',
  'welcome.guideCompareAction': '对比 Offer',
  'welcome.guideCompareDesc':
    '将当前薪资与目标薪资或新 Offer 并排对比，支持直接输入或一键套用涨幅预设 (+5% 至 +25%)。',
  'welcome.guideRetireTitle': '03. 退休财富复利预测',
  'welcome.guideRetireAction': '退休规划',
  'welcome.guideRetireDesc':
    '结合每月实发储蓄与雇主养老金缴纳模拟 1–50 年复利增长，支持按未来名义价值或今日购买力查看。',
  'welcome.localSavedNote':
    '所有数据默认仅保存在本地浏览器 — 随时可点击「清空金额」保护隐私。',
  'welcome.supportLink': '通过 Stripe 赞赏支持 PocketWage',
  'offline.banner': '离线模式 — 缓存应用已就绪',

  // Supporter Tips (Stripe)
  'support.button': '赞赏 / 支持',
  'support.modalTitle': '支持 PocketWage 持续更新',
  'support.modalSubtitle':
    'PocketWage 完全免费使用。欢迎通过 Stripe Checkout 小额打赏，支持功能维护与每年税制更新。',
  'support.chooseAmount': '选择赞赏金额 ({currency})',
  'support.customAmount': '自定义金额',
  'support.payButton': '前往 Stripe 结账 ({amount})',
  'support.redirecting': '正在连接 Stripe Checkout...',
  'support.notConfiguredTitle': '尚未配置 Stripe Checkout',
  'support.notConfiguredDesc':
    '请在服务端 Secrets 配置 STRIPE_SECRET_KEY（或设置 VITE_STRIPE_DONATION_URL 付款链接）以开启赞赏收款。',
  'support.thankYouNotice': '感谢您支持 PocketWage！您的 Stripe 赞赏已成功。',
  'support.cancelledNotice': '已取消 Stripe 结账 — 未产生任何扣款。',
  'support.secureNote': '由 Stripe 安全处理付款 · 完全自愿且不影响免费使用',
  'support.errorGeneric': '暂时无法启动 Stripe Checkout，请稍后重试。',

  // Notices
  'notice.amountsCleared': '已清空所有薪资与储蓄金额',
  'notice.languageChanged': '界面语言已切换为 {name}',
  'notice.comparisonSaved': '已本地保存对比「{name}」',
  'notice.comparisonLoaded': '已载入对比「{name}」',
  'notice.syncEnabled': '已登录 {name} — 已开启跨设备同步',
  'notice.syncDisabled': '已退出登录 — 已切回仅本地模式',
  'notice.syncedNow': '工作区已同步至云端',

  // Legal & Policies
  'legal.privacyPolicy': '隐私政策',
  'legal.termsConditions': '使用条款',
  'legal.footerNotice': 'PocketWage · 本地优先的薪资与退休估算工具',
  'legal.disclaimer':
    '注意：我们的计算器仅提供一般参考估算，不构成财务、税务、法律或会计建议。',
  'legal.effectiveDate': '最后更新：2026年11月15日',
  'legal.close': '关闭',
  'legal.summaryTitle': '隐私与服务条款',
  'legal.summaryDesc':
    '查看 PocketWage 如何在本地保护您的数据隐私以及使用估算功能的相关条款。',

  // Partner & Referral Integrations
  'calc.exportTaxApp': '税务导出',
  'partner.superPrompt':
    '了解合并账户或通过薪资扣缴投入低费率 {label} 或 ETF 基金对长期退休余额的影响。',
  'partner.openRetirement': '退休规划',
  'partner.disclosure': '合作伙伴推荐 · PocketWage 可能获得佣金，您无需支付额外费用',
  'partner.novatedToggle': '对比汽车薪资租赁节税 (Novated Lease)',
  'partner.novatedDesc':
    '估算税前薪资扣缴节税额度，并将税前总薪资带入合作汽车租赁报价工具。',
  'partner.novatedPartnersTitle':
    '按您的税前年薪 {gross} 对比实时租赁报价',
  'partner.novatedNote': '估算基于合规税前扣缴规则，不含经销商融资手续费',
  'partner.taxModalTitle': '导出年度税务摘要',
  'partner.taxPartnersHeading': '转入合作税务与记账软件',
  'partner.taxModalPrivacy':
    '点击合作链接时仅传递汇总薪资与税额参数，PocketWage 可能获得推荐佣金，您无需额外付费。',
};
