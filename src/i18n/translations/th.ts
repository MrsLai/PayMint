import { TranslationDictionary } from './en';

export const th: TranslationDictionary = {
  // Navigation & Global Actions
  'nav.calculator': 'เครื่องคำนวณ',
  'nav.compare': 'เปรียบเทียบเงินเดือน',
  'nav.compareCompact': 'เปรียบเทียบ',
  'nav.retirement': 'เกษียณอายุ',
  'nav.retirementMobile': 'เกษียณ',
  'nav.calculateMobile': 'คำนวณ',
  'nav.settings': 'ตั้งค่า',
  'nav.install': 'ติดตั้ง',
  'nav.share': 'แชร์',
  'nav.clearAmounts': 'ล้างจำนวนเงิน',
  'nav.skipToMain': 'ข้ามไปยังเนื้อหาหลัก',
  'nav.openGuide': 'วิธีใช้งาน PocketWage',
  'nav.shortcutsLabel': 'คีย์ลัด',

  // Periods
  'period.Hourly': 'รายชั่วโมง',
  'period.Daily': 'รายวัน',
  'period.Weekly': 'รายสัปดาห์',
  'period.Fortnightly': 'รายปักษ์ (2 สัปดาห์)',
  'period.Monthly': 'รายเดือน',
  'period.Annual': 'รายปี',

  // Calculator View
  'calc.heroTitle': 'เครื่องคำนวณเงินเดือนและรายรับสุทธิ',
  'calc.quickTour': 'แนะนำการใช้งาน',
  'calc.retirementBtn': 'เกษียณอายุ',
  'calc.compareOfferBtn': 'เปรียบเทียบขึ้นเงินเดือน / ข้อเสนอ',
  'calc.perOrdinaryHour': 'ต่อชั่วโมงทำงานปกติ',
  'calc.workdayHours': 'วันละ {hours} ชม.',
  'calc.perWeek': 'ฐานรายสัปดาห์',
  'calc.perFortnight': 'ทุก ๆ 2 สัปดาห์',
  'calc.perCalendarMonth': 'ต่อเดือนตามปฏิทิน',
  'calc.weeksPerYear': '{weeks} สัปดาห์ / ปี',
  'calc.loadedHourly': 'รวมค่าชดเชย: {rate}/ชม. (+{pct}%)',
  'calc.employmentType': 'ประเภทการจ้างงาน',
  'calc.fullTime': 'พนักงานประจำ (Full-Time)',
  'calc.partTime': 'พาร์ทไทม์ (Part-Time)',
  'calc.casual': 'ชั่วคราว (Casual)',
  'calc.agreedWeeklyHours': 'ชั่วโมงต่อสัปดาห์ที่ตกลง',
  'calc.fortnightlyEquiv': '{hours} ชม. / 2 สัปดาห์',
  'calc.casualLoading': 'ค่าชดเชย Casual Loading',
  'calc.taxFreeThreshold': 'สิทธิ์ยกเว้นภาษีขั้นต่ำ ($18,200)',
  'calc.shiftsOvertimeToggle': 'ล่วงเวลา กะวันหยุดสุดสัปดาห์ และนักขัตฤกษ์',
  'calc.shiftsOvertimeDesc':
    'กำหนดชั่วโมงล่วงเวลา ตัวคูณค่าแรง และวิธีคิด Casual แบบทบต้นหรือสะสม',
  'calc.saturdayHours': 'วันเสาร์ (ชม./สัปดาห์)',
  'calc.sundayHours': 'วันอาทิตย์ (ชม./สัปดาห์)',
  'calc.publicHolidayHours': 'วันหยุดนักขัตฤกษ์ (ชม./สัปดาห์)',
  'calc.overtimeHours': 'ล่วงเวลา OT (ชม./สัปดาห์)',
  'calc.casualPenaltyRule': 'กฎตัวคูณ Casual',
  'calc.compounding': 'คิดทบต้น (125% × ตัวคูณ)',
  'calc.cumulative': 'คิดสะสม (+25% + ส่วนเพิ่ม)',
  'calc.casualPhNote':
    'พนักงาน Casual: ไม่ได้ค่าจ้างหากไม่ทำงานวันหยุด; รับเรต {mult}x เมื่อเข้ากะวันหยุดนักขัตฤกษ์',
  'calc.leaveTitle': 'สิทธิวันลาสะสมและฐาน OTE กองทุนเกษียณ',
  'calc.annualLeaveEst': 'วันลาพักร้อนประจำปี',
  'calc.personalLeaveEst': 'วันลาป่วย / ลากิจ',
  'calc.leaveCasualNone': 'ไม่มี — รวมอยู่ใน Casual Loading {pct}% แล้ว',
  'calc.leaveHoursYr': '{hrs} ชม. / ปี',
  'calc.oteSuperLabel': '{label} บนฐาน OTE ({ote})',
  'calc.overtimeExclNote': 'ค่าล่วงเวลา ({ot}) ไม่นับรวมในฐาน OTE',
  'calc.beforeTaxGross': 'ก่อนหักภาษี (Gross)',
  'calc.totalPackageIncl': 'แพ็กเกจรวม (รวม {label})',
  'calc.cashTakeHome': 'เงินรับสุทธิเข้ากระเป๋า',
  'calc.taxShort': 'ภาษี',
  'calc.countryRulesLabel': 'กฎภาษีประเทศและ {label}',
  'calc.latestPct': 'ล่าสุด {pct}%',
  'calc.onTop': '+ จ่ายเพิ่ม',
  'calc.included': 'รวมในฐาน',
  'calc.workSchedule': 'ตารางทำงาน',
  'calc.privateHealth': 'ประกันสุขภาพเอกชน',
  'calc.optional': 'ไม่บังคับ',
  'calc.autoSynced': 'ซิงค์อัตโนมัติ · กฎภาษีและ {label} ล่าสุดปี {year}',
  'calc.syncLatestRules': 'ซิงค์กฎล่าสุด ({year})',
  'calc.dependents': 'ผู้พึ่งพิง (₫6.2M/เดือน):',
  'calc.effectiveTaxRate': 'อัตราภาษีที่แท้จริง:',
  'calc.marginal': 'อัตราส่วนเพิ่ม:',
  'calc.summaryTitle': 'สรุปรายได้และรายการหักทั้งหมด',
  'calc.summaryEmpty':
    'กรอกจำนวนเงินด้านบนเพื่อดูรายละเอียดรายได้ก่อนหักภาษีและเงินรับสุทธิ',
  'calc.takeHomeRatio': 'สัดส่วนรับสุทธิ:',
  'calc.downloadCsv': 'ดาวน์โหลด CSV',
  'calc.exportPdf': 'ส่งออก PDF',
  'calc.colPeriod': 'รอบการจ่าย',
  'calc.colGross': 'ก่อนหักภาษี (Gross)',
  'calc.colTaxLevies': 'ภาษีและค่าธรรมเนียม',
  'calc.colAfterTax': 'หลังหักภาษี',
  'calc.colPhiOther': 'ประกันและรายการอื่น',
  'calc.colConverted': 'แปลงค่า ({code})',
  'calc.paidOnTop': '(นายจ้างสมทบเพิ่ม)',
  'calc.includedInPackage': '(รวมในแพ็กเกจแล้ว)',

  // Proportion Chart
  'chart.title': 'สัดส่วนภาษีเทียบกับเงินรับสุทธิ',
  'chart.subtitle':
    'สัดส่วนแพ็กเกจรายได้{period} ({currency}) แบ่งตามเงินรับสุทธิ ภาษี และ {label}',
  'chart.empty':
    'กรอกเงินเดือนรายชั่วโมง รายวัน รายสัปดาห์ ราย 2 สัปดาห์ รายเดือน หรือรายปีด้านบน เพื่อแสดงกราฟสัดส่วน',
  'chart.incomeTax': 'ภาษีเงินได้',
  'chart.totalPackage': 'แพ็กเกจรวม{period} (รวม {label})',

  // Currency Converter
  'currency.title': 'เครื่องแปลงสกุลเงิน',
  'currency.retirementTitle': 'เครื่องแปลงสกุลเงินเกษียณ',
  'currency.subtitleCalc':
    'แปลงรายได้ก่อนหักภาษีและเงินรับสุทธิจาก {currency} เป็นสกุลเงินอื่น',
  'currency.subtitleCompare':
    'แปลงรายได้ปัจจุบัน เป้าหมาย และส่วนต่างที่เพิ่มขึ้นจาก {currency} เป็นสกุลเงินอื่น',
  'currency.subtitleRetirement':
    'แปลงเงินออมเกษียณที่คาดการณ์และรายได้ 4% ต่อเดือนจาก {currency} เป็นสกุลเงินอื่น',
  'currency.offOption': 'ปิด (เฉพาะ {currency}) — เลือกสกุลเงินเพื่อแปลง',
  'currency.pinnedFavorites': 'สกุลเงินโปรดที่ปักหมุด ({count}/{max})',
  'currency.allCurrencies': 'สกุลเงินทั้งหมด',
  'currency.pin': 'ปักหมุด',
  'currency.pinned': 'ปักหมุดแล้ว',

  // Payrise Compare
  'compare.heroTitle': 'เปรียบเทียบการขึ้นเงินเดือนและข้อเสนองานใหม่',
  'compare.heroSubtitle':
    'เปรียบเทียบรายได้ปัจจุบันกับเงินเดือนใหม่หรือข้อเสนองาน ({currency}) ตามกฎของ {authority}',
  'compare.currentPay': 'รายได้ปัจจุบัน',
  'compare.targetOffer': 'เป้าหมาย / ข้อเสนอใหม่',
  'compare.targetIncreasePct': 'เป้าหมายปรับขึ้น (%)',
  'compare.netGainAnnual': 'รายรับสุทธิเพิ่มต่อปี',
  'compare.netGainMonthly': 'รายรับสุทธิเพิ่มต่อเดือน',
  'compare.netGainHourly': 'รายรับสุทธิเพิ่มต่อชั่วโมง',
  'compare.savedTitle': 'รายการเปรียบเทียบข้อเสนองานที่บันทึกไว้',
  'compare.savedDesc':
    'บันทึกไว้ในเบราว์เซอร์ของคุณ (localStorage) เพื่อกลับมาดูและเปรียบเทียบได้ทุกเมื่อ',
  'compare.savePlaceholder': 'ชื่อข้อเสนอ (เช่น ตำแหน่ง Senior ที่ Acme)',
  'compare.saveBtn': 'บันทึกการเปรียบเทียบ',
  'compare.loadBtn': 'โหลด',
  'compare.deleteBtn': 'ลบ',
  'compare.clearSavedBtn': 'ล้างรายการที่บันทึก',
  'compare.savedEmpty':
    'ยังไม่มีรายการเปรียบเทียบที่บันทึกไว้ กรอกจำนวนเงินด้านบนแล้วกด บันทึกการเปรียบเทียบ เพื่อเก็บไว้ในเบราว์เซอร์',
  'compare.savedBadge': 'บันทึกในเครื่อง',

  // Retirement Projections
  'retirement.heroTitle': 'คาดการณ์ความมั่งคั่งเพื่อการเกษียณ',
  'retirement.futureValue': 'มูลค่าในอนาคต',
  'retirement.todaysMoney': 'มูลค่าเงินวันนี้',

  // Global Settings
  'settings.title': 'ตั้งค่า',
  'settings.subtitle':
    'จัดการภาษา กฎภาษีและกองทุนเกษียณของแต่ละประเทศ ธีม สีเน้น และค่าเริ่มต้นการคำนวณในที่เดียว',
  'settings.languageLabel': 'ภาษา',
  'settings.tabTax': 'กฎภาษีและกองทุนเกษียณ',
  'settings.tabTaxDesc': 'ประเทศ ขั้นบันไดภาษี และอัตราเงินสมทบเกษียณ',
  'settings.tabTheme': 'ธีมและรูปลักษณ์',
  'settings.tabThemeDesc': 'โหมดสว่าง โหมดมืด โหมดมิดไนท์คอนทราสต์สูง และสีเน้น',
  'settings.tabPrefs': 'ค่ากำหนดและค่าเริ่มต้น',
  'settings.tabPrefsDesc':
    'ภาษา ชั่วโมงทำงาน สกุลเงินโปรด การเกษียณ และความเป็นส่วนตัว',

  // Tax Settings
  'tax.title': 'กฎภาษีและกองทุนเกษียณตามประเทศ',
  'tax.resetAustralia': 'รีเซ็ตเป็นค่าเริ่มต้นออสเตรเลีย',
  'tax.selectCountry': 'เลือกประเทศสำหรับกฎภาษี',
  'tax.collapseAll': 'ย่อทั้งหมด',
  'tax.expandAll': 'ขยายทั้งหมด',

  // Theme Settings
  'theme.title': 'ตั้งค่าธีมและรูปลักษณ์',
  'theme.resetDefault': 'รีเซ็ตเป็นค่าเริ่มต้น',
  'theme.displayMode': 'โหมดการแสดงผล',
  'theme.displayModeDesc':
    'เลือกโหมดสว่างมาตรฐาน โหมดมืดสบายตา หรือโหมดมิดไนท์คอนทราสต์สูงสำหรับจอ OLED',
  'theme.accentColor': 'ชุดสีเน้น (Accent Color)',
  'theme.accentColorDesc':
    'เลือกสีหลักสำหรับปุ่ม แท็บที่เลือก เส้นโฟกัส และกราฟเกษียณอายุ',

  // Preferences Settings
  'prefs.title': 'ค่ากำหนดและค่าเริ่มต้นการคำนวณ',
  'prefs.subtitle':
    'ปรับแต่งภาษาของแอป ตารางเวลาทำงาน สกุลเงินที่ปักหมุด สมมติฐานเกษียณ และการเริ่มต้นใช้งาน',
  'prefs.languageTitle': 'ภาษาของอินเทอร์เฟซ',
  'prefs.languageDesc':
    'เลือกภาษาสำหรับเมนู ป้ายกำกับในเครื่องคำนวณ หน้าตั้งค่า และรายงานที่ส่งออก',
  'prefs.scheduleTitle': 'ตารางทำงานและฐานการคำนวณ',
  'prefs.scheduleDesc':
    'ใช้สำหรับเชื่อมโยงอัตราค่าจ้างรายชั่วโมง รายวัน รายเดือน และรายปีให้ตรงกันอัตโนมัติ',
  'prefs.resetSchedule': 'รีเซ็ตเป็นตารางเวลา {code}',
  'prefs.hoursPerDay': 'ชั่วโมงทำงานต่อวัน',
  'prefs.daysPerWeek': 'วันทำงานต่อสัปดาห์',
  'prefs.weeksPerYear': 'สัปดาห์ที่ได้รับค่าจ้างต่อปี',
  'prefs.activeInputPeriod': 'รอบการกรอกข้อมูลหลัก',
  'prefs.currencyTitle': 'ตัวแปลงสกุลเงินและรายการปักหมุด',
  'prefs.currencyDesc':
    'ปักหมุดได้สูงสุด {max} สกุลเงิน (ปักหมุดแล้ว {count}/{max}) เพื่อให้อยู่ด้านบนของรายการเสมอ',
  'prefs.clearPinned': 'ล้างหมุดทั้งหมด',
  'prefs.activeConversionCurrency': 'สกุลเงินปลายทางที่ใช้งาน',
  'prefs.offCurrencyOnly': 'ปิด (เฉพาะ {currency})',
  'prefs.pinFavoriteCurrencies': 'ปักหมุดสกุลเงินโปรด ({count}/{max})',
  'prefs.retirementTitle': 'สมมติฐานการคำนวณเกษียณ',
  'prefs.retirementDesc':
    'ปรับอัตราการออม ผลตอบแทนคาดหวัง อัตราเงินเฟ้อ ระยะเวลาลงทุน และโหมดปรับเงินเฟ้อ',
  'prefs.resetAssumptions': 'รีเซ็ตสมมติฐาน',
  'prefs.savingsRate': 'อัตราการออม (% ของรายรับสุทธิ)',
  'prefs.annualReturn': 'ผลตอบแทนต่อปี',
  'prefs.annualInflation': 'อัตราเงินเฟ้อต่อปี',
  'prefs.horizonYears': 'ระยะเวลา (ปี)',
  'prefs.valueMode': 'โหมดมูลค่าที่คาดการณ์',
  'prefs.includeEmployer':
    'รวมเงินสมทบจากนายจ้าง {label} ({rate}%) ในการคำนวณเงินออมเกษียณ',
  'prefs.privacyTitle': 'คำแนะนำเริ่มต้น คีย์ลัด และความเป็นส่วนตัว',
  'prefs.privacyDesc':
    'เงินเดือนล่าสุด การตั้งค่า และรายการเปรียบเทียบที่บันทึกจะถูกเก็บไว้ในเบราว์เซอร์ของคุณเท่านั้น (ไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์)',
  'prefs.showWelcomeTitle': 'แสดงคู่มือต้อนรับเมื่อเปิดแอป',
  'prefs.showWelcomeDesc':
    'แสดงภาพรวมการใช้งานเบื้องต้นอัตโนมัติทุกครั้งที่เปิด PocketWage',
  'prefs.previewGuide': 'ดูคู่มือ',
  'prefs.shortcutsTitle': 'รายการคีย์ลัด',
  'prefs.shortcutsDesc':
    'ดูปุ่มลัดสำหรับสลับหน้า (Ctrl+1..4) และคำสั่งด่วน',
  'prefs.viewShortcuts': 'ดูคีย์ลัด',
  'prefs.clearAmountsTitle': 'ล้างข้อมูลตัวเลขในเซสชัน',
  'prefs.clearAmountsDesc':
    'ลบเงินเดือน รายการหัก ตัวเลขเปรียบเทียบ และเงินออมตั้งต้นทั้งหมดทันที',
  'prefs.clearAllAmounts': 'ล้างจำนวนเงินทั้งหมด',

  // Cross-Device Cloud Sync (Optional)
  'sync.title': 'ซิงค์ข้ามอุปกรณ์ (ไม่บังคับ)',
  'sync.desc':
    'โดยปกติข้อมูลจะถูกเก็บไว้ในเบราว์เซอร์นี้เท่านั้น เปิดใช้งานหากต้องการล็อกอินด้วย Google เพื่อซิงค์เงินเดือนล่าสุดและรายการเปรียบเทียบข้ามอุปกรณ์',
  'sync.toggleLabel': 'เปิดการซิงค์ข้ามอุปกรณ์',
  'sync.signInGoogle': 'ลงชื่อเข้าใช้ด้วย Google',
  'sync.signingIn': 'กำลังลงชื่อเข้าใช้...',
  'sync.signOut': 'ออกจากระบบและใช้แบบออฟไลน์ในเครื่อง',
  'sync.syncNow': 'ซิงค์ทันที',
  'sync.syncing': 'กำลังซิงค์...',
  'sync.synced': 'ซิงค์ข้ามอุปกรณ์แล้ว',
  'sync.localOnly': 'เก็บในเครื่องเท่านั้น',
  'sync.askSyncBtn': 'ซิงค์ข้ามอุปกรณ์',
  'sync.signedInAs': 'ลงชื่อเข้าใช้เป็น {email}',
  'sync.freeNote': 'แพ็กเกจฟรี Firebase Spark · ส่วนตัวเฉพาะบัญชี Google ของคุณ',

  // PDF Report & Print
  'pdf.previewTitle': 'ตัวอย่างรายงาน PDF สำหรับพิมพ์',
  'pdf.previewHint':
    'A4 แนวตั้ง · เลือก "บันทึกเป็น PDF" (Save as PDF) เป็นปลายทางในหน้าต่างสั่งพิมพ์',
  'pdf.saveHtml': 'บันทึก HTML',
  'pdf.printSavePdf': 'พิมพ์ / บันทึกเป็น PDF',
  'pdf.closePreview': 'ปิดตัวอย่าง PDF',
  'pdf.reportTitle': 'รายงานสรุปเงินเดือนและรายรับสุทธิ',
  'pdf.generated': 'สร้างเมื่อ {date}',
  'pdf.annualNet': 'เงินรับสุทธิรายปี',
  'pdf.annualGross': 'รายได้ก่อนหักภาษีรายปี',
  'pdf.annualTaxLevies': 'ภาษีและค่าธรรมเนียมรายปี',
  'pdf.annualRetirement': '{label} รายปี',
  'pdf.grossPayAllocation': 'สัดส่วนการจัดสรรรายได้รวม',
  'pdf.payBreakdownByPeriod': 'รายละเอียดรายได้ตามรอบ ({currency})',
  'pdf.annualDeductionSummary': 'สรุปรายการหักประจำปี',
  'pdf.totalAnnualDeductions': 'รวมภาษีและรายการหักประจำปี',
  'pdf.netAnnualTakeHomeCash': 'เงินสดรับสุทธิประจำปี',

  // Quick Tutorial
  'tour.badge': 'แนะนำการใช้งาน · ขั้นตอน {current} จาก {total}',
  'tour.exit': 'ออกจากการแนะนำ',
  'tour.back': 'ย้อนกลับ',
  'tour.next': 'ถัดไป',
  'tour.finish': 'เสร็จสิ้น',
  'tour.step1Title': '1. เลือกประเภทการจ้างและกรอกเงินเดือน',
  'tour.step1Desc':
    'เลือก Full-Time, Part-Time หรือ Casual แล้วกรอกเรตได้ทั้ง 6 รอบ (รายชั่วโมงถึงรายปี) ระบบจะซิงค์ให้อัตโนมัติ',
  'tour.step2Title': '2. แปลงสกุลเงินและปักหมุดที่ชอบ',
  'tour.step2Desc':
    'เลือกสกุลเงินปลายทางเพื่อดูยอดก่อนหักภาษีและเงินรับสุทธิตามอัตราแลกเปลี่ยนจริง และปักหมุดสกุลเงินโปรดได้สูงสุด 5 สกุล',
  'tour.step3Title': '3. ปรับเงื่อนไขการจ้าง กะพิเศษ และภาษี',
  'tour.step3Desc':
    'สลับได้ 26 ประเทศ (กฎภาษีปี 2026–2027) พร้อมตั้งค่า Tax-Free Threshold, Casual Loading, OT และ OTE Super',
  'tour.step4Title': '4. ตรวจดูสรุป วันลา และส่งออก CSV / PDF',
  'tour.step4Desc':
    'ดูตารางสรุปครบทั้ง 6 รอบ ยอดสมทบ OTE และประมาณการวันลาตามสัดส่วนด้านล่าง หรือส่งออก CSV / PDF ได้ทันที',
  'tour.step5Title': '5. เปรียบเทียบ วางแผนเกษียณ และสนับสนุน',
  'tour.step5Desc':
    'สลับแท็บ (Ctrl+1..4) เพื่อเปรียบเทียบการขึ้นเงินเดือน วางแผนเกษียณ เปลี่ยนภาษา หรือให้ทิปสนับสนุนผ่าน Stripe',

  // Welcome Modal & Offline
  'welcome.title': 'ยินดีต้อนรับสู่ PocketWage',
  'welcome.subtitle':
    'คำนวณรายรับสุทธิ รองรับ Full-Time/Part-Time/Casual ค่ากะ/OT และวางแผนเกษียณ 26 ประเทศ',
  'welcome.getStarted': 'เริ่มต้นใช้งาน',
  'welcome.shortcuts': 'คีย์ลัด',
  'welcome.guideCalcTitle': '01. คำนวณเงินเดือน Casual กะพิเศษ และรับสุทธิ',
  'welcome.guideCalcAction': 'เปิดเครื่องคิดเลข',
  'welcome.guideCalcDesc':
    'สลับระหว่าง Full-Time, Part-Time และ Casual กรอกได้ 6 รอบการจ่าย พร้อมคิดเรตวันหยุด/OT, OTE Super และสิทธิวันลา',
  'welcome.guideCompareTitle': '02. เปรียบเทียบปรับเงินเดือนและข้อเสนองาน',
  'welcome.guideCompareAction': 'เปรียบเทียบข้อเสนอ',
  'welcome.guideCompareDesc':
    'เทียบรายได้ปัจจุบันกับข้อเสนอใหม่แบบระบุจำนวนเงินหรือเลือก % ปรับขึ้น (+5% ถึง +25%)',
  'welcome.guideRetireTitle': '03. คาดการณ์เงินออมเกษียณระยะยาว',
  'welcome.guideRetireAction': 'วางแผนเกษียณ',
  'welcome.guideRetireDesc':
    'จำลองผลตอบแทนทบต้น 1–50 ปีจากเงินออมรายเดือนและเงินสมทบนายจ้างทั้งมูลค่าในอนาคตและมูลค่าปัจจุบัน',
  'welcome.localSavedNote':
    'ข้อมูลบันทึกในเบราว์เซอร์ของคุณเท่านั้น — กด ล้างจำนวนเงิน ได้ตลอดเวลาเพื่อความเป็นส่วนตัว',
  'welcome.supportLink': 'สนับสนุนผู้พัฒนา PocketWage ผ่าน Stripe',
  'offline.banner': 'โหมดออฟไลน์ — แอปแคชพร้อมใช้งานแล้ว',

  // Supporter Tips (Stripe)
  'support.button': 'ให้ทิป / สนับสนุน',
  'support.modalTitle': 'สนับสนุน PocketWage',
  'support.modalSubtitle':
    'PocketWage เปิดให้ใช้งานฟรี หากแอปนี้ช่วยคุณได้ สามารถส่งทิปเล็ก ๆ น้อย ๆ ผ่าน Stripe Checkout เพื่อสนับสนุนการอัปเดตฐานภาษีประจำปี',
  'support.chooseAmount': 'เลือกจำนวนเงินสนับสนุน ({currency})',
  'support.customAmount': 'ระบุจำนวนเอง',
  'support.payButton': 'ดำเนินการต่อด้วย Stripe ({amount})',
  'support.redirecting': 'กำลังเชื่อมต่อ Stripe Checkout...',
  'support.notConfiguredTitle': 'ยังไม่ได้ตั้งค่า Stripe Checkout',
  'support.notConfiguredDesc':
    'เพิ่ม STRIPE_SECRET_KEY ใน Secrets ของเซิร์ฟเวอร์ (หรือ VITE_STRIPE_DONATION_URL) เพื่อเปิดรับทิปจริง',
  'support.thankYouNotice':
    'ขอบคุณที่สนับสนุน PocketWage! การชำระเงินผ่าน Stripe สำเร็จแล้ว',
  'support.cancelledNotice':
    'ยกเลิกการชำระเงิน Stripe แล้ว — ไม่มีการเรียกเก็บเงิน',
  'support.secureNote': 'ชำระเงินอย่างปลอดภัยโดย Stripe · ไม่บังคับ',
  'support.errorGeneric':
    'ไม่สามารถเปิด Stripe Checkout ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',

  // Notices
  'notice.amountsCleared': 'ล้างข้อมูลเงินเดือนและเงินออมทั้งหมดแล้ว',
  'notice.languageChanged': 'เปลี่ยนภาษาเป็น {name} แล้ว',
  'notice.comparisonSaved': 'บันทึก "{name}" ไว้ในเบราว์เซอร์แล้ว',
  'notice.comparisonLoaded': 'โหลดรายการ "{name}" แล้ว',
  'notice.syncEnabled': 'ลงชื่อเข้าใช้เป็น {name} — เปิดซิงค์ข้ามอุปกรณ์แล้ว',
  'notice.syncDisabled': 'ออกจากระบบแล้ว — กลับสู่โหมดบันทึกในเครื่อง',
  'notice.syncedNow': 'ซิงค์ข้อมูลขึ้นคลาวด์แล้ว',

  // Legal & Policies
  'legal.privacyPolicy': 'นโยบายความเป็นส่วนตัว',
  'legal.termsConditions': 'ข้อกำหนดและเงื่อนไข',
  'legal.footerNotice': 'PocketWage · เครื่องมือประมาณการเงินเดือนและเกษียณแบบเก็บข้อมูลในเครื่อง',
  'legal.disclaimer':
    'หมายเหตุ: เครื่องคำนวณของเราให้ข้อมูลประมาณการทั่วไปเพื่อประกอบความรู้เท่านั้น และไม่ถือเป็นคำแนะนำทางการเงิน ภาษี กฎหมาย หรือบัญชี',
  'legal.effectiveDate': 'อัปเดตล่าสุด: 15 พฤศจิกายน 2026',
  'legal.close': 'ปิด',
  'legal.summaryTitle': 'นโยบายและข้อกำหนดการใช้งาน',
  'legal.summaryDesc':
    'ดูรายละเอียดการคุ้มครองความเป็นส่วนตัวในเครื่อง และข้อกำหนดการใช้งานการประมาณการของ PocketWage',

  // Partner & Referral Integrations
  'calc.exportTaxApp': 'ส่งออกข้อมูลภาษี',
  'partner.superPrompt':
    'ดูว่าการรวมกองทุนหรือสมทบเพิ่มเข้า {label} หรือกองทุน ETF ค่าธรรมเนียมต่ำ ส่งผลต่อยอดเงินเกษียณของคุณอย่างไร',
  'partner.openRetirement': 'วางแผนเกษียณ',
  'partner.disclosure': 'ลิงก์พันธมิตร · PocketWage อาจได้รับค่าคอมมิชชันโดยไม่มีค่าใช้จ่ายเพิ่มสำหรับคุณ',
  'partner.novatedToggle': 'เปรียบเทียบความคุ้มค่า Novated Lease',
  'partner.novatedDesc':
    'ประมาณการภาษีที่ประหยัดได้จากการหักก่อนภาษี และส่งเงินเดือนรวมไปยังพันธมิตรสินเชื่อเช่ารถ',
  'partner.novatedPartnersTitle':
    'เปรียบเทียบใบเสนอราคา Novated Lease ด้วยเงินเดือนรวม {gross}',
  'partner.novatedNote': 'เป็นการประมาณการตามเกณฑ์หักก่อนภาษี ไม่รวมค่าธรรมเนียมไฟแนนซ์',
  'partner.taxModalTitle': 'ส่งออกสรุปภาษีประจำปี',
  'partner.taxPartnersHeading': 'ดำเนินการต่อด้วยซอฟต์แวร์ภาษีและบัญชี',
  'partner.taxModalPrivacy':
    'ส่งเฉพาะตัวเลขรายได้และภาษีรวมเมื่อเปิดลิงก์พันธมิตร — PocketWage อาจได้รับค่าแนะนำโดยไม่มีค่าใช้จ่ายเพิ่ม',
};
