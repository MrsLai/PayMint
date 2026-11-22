import { TranslationDictionary } from './en';

export const vi: TranslationDictionary = {
  // Navigation & Global Actions
  'nav.calculator': 'Tính Lương',
  'nav.compare': 'So Sánh Tăng Lương',
  'nav.compareCompact': 'So Sánh',
  'nav.retirement': 'Nghỉ Hưu',
  'nav.retirementMobile': 'Hưu Trí',
  'nav.calculateMobile': 'Tính',
  'nav.settings': 'Cài Đặt',
  'nav.install': 'Cài App',
  'nav.share': 'Chia Sẻ',
  'nav.clearAmounts': 'Xóa Số Tiền',
  'nav.skipToMain': 'Chuyển đến nội dung chính',
  'nav.openGuide': 'Hướng dẫn sử dụng PocketWage',
  'nav.shortcutsLabel': 'Phím tắt bàn phím',

  // Periods
  'period.Hourly': 'Theo Giờ',
  'period.Daily': 'Theo Ngày',
  'period.Weekly': 'Theo Tuần',
  'period.Fortnightly': '2 Tuần / Lần',
  'period.Monthly': 'Theo Tháng',
  'period.Annual': 'Theo Năm',

  // Calculator View
  'calc.heroTitle': 'Công Cụ Tính Lương Gross & Thực Nhận (Net)',
  'calc.quickTour': 'Hướng Dẫn Nhanh',
  'calc.retirementBtn': 'Nghỉ Hưu',
  'calc.compareOfferBtn': 'So Sánh Lương / Offer',
  'calc.perOrdinaryHour': 'Mỗi giờ làm chuẩn',
  'calc.workdayHours': '{hours}h / ngày làm việc',
  'calc.perWeek': 'Tính theo tuần',
  'calc.perFortnight': 'Mỗi 2 tuần',
  'calc.perCalendarMonth': 'Mỗi tháng dương lịch',
  'calc.weeksPerYear': '{weeks} tuần / năm',
  'calc.loadedHourly': 'Gồm phụ cấp: {rate}/h (+{pct}%)',
  'calc.employmentType': 'Loại Hình Làm Việc',
  'calc.fullTime': 'Toàn Thời Gian',
  'calc.partTime': 'Bán Thời Gian',
  'calc.casual': 'Thời Vụ (Casual)',
  'calc.agreedWeeklyHours': 'Số Giờ Cam Kết / Tuần',
  'calc.fortnightlyEquiv': '{hours}h / 2 tuần',
  'calc.casualLoading': 'Phụ Cấp Casual',
  'calc.taxFreeThreshold': 'Ngưỡng Miễn Thuế ($18,200)',
  'calc.shiftsOvertimeToggle': 'Tăng Ca, Cuối Tuần & Ngày Lễ',
  'calc.shiftsOvertimeDesc':
    'Giờ làm thêm tùy chọn, hệ số nhân ca & quy tắc tính gộp hay cộng dồn',
  'calc.saturdayHours': 'Thứ Bảy (h/tuần)',
  'calc.sundayHours': 'Chủ Nhật (h/tuần)',
  'calc.publicHolidayHours': 'Ngày Lễ (h/tuần)',
  'calc.overtimeHours': 'Tăng Ca OT (h/tuần)',
  'calc.casualPenaltyRule': 'Quy Tắc Phụ Cấp Casual',
  'calc.compounding': 'Nhân Gộp (125% × Hệ số)',
  'calc.cumulative': 'Cộng Dồn (+25% + Phụ cấp)',
  'calc.casualPhNote':
    'Casual: không hưởng lương nếu nghỉ lễ; hưởng {mult}x nếu đi làm ngày lễ.',
  'calc.leaveTitle': 'Ngày Phép Tích Lũy & Quỹ Hưu OTE',
  'calc.annualLeaveEst': 'Phép Năm (Annual Leave)',
  'calc.personalLeaveEst': 'Nghỉ Ốm / Việc Riêng',
  'calc.leaveCasualNone': 'Không có — đã tính trong phụ cấp casual {pct}%',
  'calc.leaveHoursYr': '{hrs}h / năm',
  'calc.oteSuperLabel': '{label} trên OTE ({ote})',
  'calc.overtimeExclNote': 'Tăng ca ({ot}) không tính vào OTE',
  'calc.beforeTaxGross': 'Trước thuế (Gross)',
  'calc.totalPackageIncl': 'Tổng gói thu nhập (gồm {label})',
  'calc.cashTakeHome': 'Thực Nhận (Net)',
  'calc.taxShort': 'Thuế',
  'calc.countryRulesLabel': 'Quy Định Thuế & {label}',
  'calc.latestPct': 'Mới nhất {pct}%',
  'calc.onTop': '+ Đóng Thêm',
  'calc.included': 'Đã Gồm',
  'calc.workSchedule': 'Lịch Làm Việc',
  'calc.privateHealth': 'Bảo Hiểm Tư',
  'calc.optional': 'Tùy chọn',
  'calc.autoSynced': 'Tự động đồng bộ · Quy định {year} & {label}',
  'calc.syncLatestRules': 'Đồng Bộ Quy Định ({year})',
  'calc.dependents': 'Người phụ thuộc (₫6.2M/tháng):',
  'calc.effectiveTaxRate': 'Thuế Suất Thực Tế:',
  'calc.marginal': 'Bậc Biên:',
  'calc.summaryTitle': 'Tổng Hợp Lương & Các Khoản Khấu Trừ',
  'calc.summaryEmpty':
    'Nhập bất kỳ mức lương nào ở trên để xem chi tiết trước thuế và thực nhận',
  'calc.takeHomeRatio': 'Tỷ lệ thực nhận:',
  'calc.downloadCsv': 'Tải CSV',
  'calc.exportPdf': 'Xuất PDF',
  'calc.colPeriod': 'Kỳ Lương',
  'calc.colGross': 'Trước Thuế (Gross)',
  'calc.colTaxLevies': 'Thuế & Bảo Hiểm',
  'calc.colAfterTax': 'Lương Sau Thuế',
  'calc.colPhiOther': 'BH Tư & Khác',
  'calc.colConverted': 'Quy Đổi ({code})',
  'calc.paidOnTop': '(chủ trả thêm)',
  'calc.includedInPackage': '(nằm trong gói lương)',

  // Proportion Chart
  'chart.title': 'Tỷ Lệ Thuế & Lương Thực Nhận',
  'chart.subtitle':
    'Phân bổ tổng gói thu nhập {period} ({currency}) giữa thực nhận, thuế và {label}.',
  'chart.empty':
    'Nhập mức lương theo giờ, ngày, tuần, 2 tuần, tháng hoặc năm ở trên để hiển thị biểu đồ.',
  'chart.incomeTax': 'Thuế Thu Nhập',
  'chart.totalPackage': 'Tổng Gói {period} (gồm {label})',

  // Currency Converter
  'currency.title': 'Quy Đổi Ngoại Tệ',
  'currency.retirementTitle': 'Quy Đổi Tiền Tệ Hưu Trí',
  'currency.subtitleCalc':
    'Quy đổi lương Gross và thực nhận từ {currency} sang ngoại tệ khác',
  'currency.subtitleCompare':
    'Quy đổi lương hiện tại, mục tiêu và mức tăng từ {currency} sang ngoại tệ khác',
  'currency.subtitleRetirement':
    'Quy đổi quỹ hưu trí dự kiến và thu nhập 4%/tháng từ {currency} sang ngoại tệ khác',
  'currency.offOption': 'Tắt (chỉ {currency}) — Chọn để quy đổi',
  'currency.pinnedFavorites': 'Tiền Tệ Đã Ghim ({count}/{max})',
  'currency.allCurrencies': 'Tất Cả Tiền Tệ',
  'currency.pin': 'Ghim',
  'currency.pinned': 'Đã Ghim',

  // Payrise Compare
  'compare.heroTitle': 'So Sánh Tăng Lương & Offer Mới',
  'compare.heroSubtitle':
    'So sánh trực tiếp thu nhập hiện tại với mức tăng lương hoặc offer mới ({currency}) theo quy định {authority}.',
  'compare.currentPay': 'Lương Hiện Tại',
  'compare.targetOffer': 'Mục Tiêu / Offer Mới',
  'compare.targetIncreasePct': 'Mức Tăng Mục Tiêu (%)',
  'compare.netGainAnnual': 'Thực Nhận Tăng / Năm',
  'compare.netGainMonthly': 'Thực Nhận Tăng / Tháng',
  'compare.netGainHourly': 'Thực Nhận Tăng / Giờ',
  'compare.savedTitle': 'So Sánh Offer Đã Lưu',
  'compare.savedDesc':
    'Được lưu cục bộ trên trình duyệt qua localStorage để bạn xem lại và đối chiếu bất kỳ lúc nào.',
  'compare.savePlaceholder': 'Tên offer (VD: Vị trí Senior tại Acme)',
  'compare.saveBtn': 'Lưu So Sánh',
  'compare.loadBtn': 'Tải Lên',
  'compare.deleteBtn': 'Xóa',
  'compare.clearSavedBtn': 'Xóa Tất Cả',
  'compare.savedEmpty':
    'Chưa có so sánh nào được lưu. Nhập mức lương ở trên rồi nhấn Lưu So Sánh để lưu trên trình duyệt.',
  'compare.savedBadge': 'Lưu cục bộ',

  // Retirement Projections
  'retirement.heroTitle': 'Dự Báo Quỹ Nghỉ Hưu & Lãi Kép',
  'retirement.futureValue': 'Giá Trị Tương Lai',
  'retirement.todaysMoney': 'Theo Giá Trị Hôm Nay',

  // Global Settings
  'settings.title': 'Cài Đặt Chung',
  'settings.subtitle':
    'Quản lý ngôn ngữ hiển thị, quy định thuế theo quốc gia, giao diện, màu nhấn và tùy chọn tính toán tại một nơi.',
  'settings.languageLabel': 'Ngôn ngữ',
  'settings.tabTax': 'Thuế & Hưu Trí',
  'settings.tabTaxDesc': 'Quốc gia áp dụng, biểu thuế & tỷ lệ đóng hưu trí',
  'settings.tabTheme': 'Giao Diện & Màu Sắc',
  'settings.tabThemeDesc': 'Chế độ Sáng, Tối, Nửa Đêm tương phản cao & màu nhấn',
  'settings.tabPrefs': 'Tùy Chọn & Mặc Định',
  'settings.tabPrefsDesc':
    'Ngôn ngữ, lịch làm việc, ngoại tệ ghim, hưu trí & riêng tư',

  // Tax Settings
  'tax.title': 'Quy Định Thuế & Hưu Trí Theo Quốc Gia',
  'tax.resetAustralia': 'Khôi Phục Mặc Định Úc',
  'tax.selectCountry': 'Chọn Quốc Gia Áp Dụng Thuế',
  'tax.collapseAll': 'Thu Gọn Tất Cả',
  'tax.expandAll': 'Mở Rộng Tất Cả',

  // Theme Settings
  'theme.title': 'Cài Đặt Giao Diện & Màu Sắc',
  'theme.resetDefault': 'Khôi Phục Mặc Định',
  'theme.displayMode': 'Chế Độ Hiển Thị',
  'theme.displayModeDesc':
    'Chọn giao diện Sáng, Tối dịu mắt hoặc Nửa Đêm tương phản cao cho màn hình OLED.',
  'theme.accentColor': 'Bảng Màu Nhấn',
  'theme.accentColorDesc':
    'Chọn màu nhấn cho nút bấm, tab đang chọn, viền focus và biểu đồ hưu trí.',

  // Preferences Settings
  'prefs.title': 'Tùy Chọn & Giá Trị Tính Toán Mặc Định',
  'prefs.subtitle':
    'Tùy chỉnh ngôn ngữ giao diện, lịch làm việc mặc định, ngoại tệ ghim, giả định hưu trí và khởi động.',
  'prefs.languageTitle': 'Ngôn Ngữ Giao Diện',
  'prefs.languageDesc':
    'Chọn ngôn ngữ hiển thị cho thanh điều hướng, bảng tính lương, cài đặt và báo cáo xuất file.',
  'prefs.scheduleTitle': 'Lịch Làm Việc & Cơ Sở Tính Lương',
  'prefs.scheduleDesc':
    'Dùng để đồng bộ chính xác mức lương theo Giờ, Ngày, Tháng và Năm.',
  'prefs.resetSchedule': 'Khôi Phục Lịch ({code})',
  'prefs.hoursPerDay': 'Số Giờ / Ngày',
  'prefs.daysPerWeek': 'Số Ngày / Tuần',
  'prefs.weeksPerYear': 'Số Tuần Trả Lương / Năm',
  'prefs.activeInputPeriod': 'Kỳ Lương Đang Nhập',
  'prefs.currencyTitle': 'Quy Đổi & Ghim Ngoại Tệ Yêu Thích',
  'prefs.currencyDesc':
    'Ghim tối đa {max} ngoại tệ ({count}/{max} đã ghim) để luôn hiện ở đầu danh sách chọn.',
  'prefs.clearPinned': 'Bỏ Ghim Tất Cả',
  'prefs.activeConversionCurrency': 'Ngoại Tệ Quy Đổi Hiện Tại',
  'prefs.offCurrencyOnly': 'Tắt (chỉ {currency})',
  'prefs.pinFavoriteCurrencies': 'Ghim Ngoại Tệ ({count}/{max})',
  'prefs.retirementTitle': 'Giả Định Mô Hình Nghỉ Hưu',
  'prefs.retirementDesc':
    'Điều chỉnh tỷ lệ tiết kiệm, lợi suất kỳ vọng, lạm phát, số năm và chế độ giá trị.',
  'prefs.resetAssumptions': 'Khôi Phục Giả Định',
  'prefs.savingsRate': 'Tỷ Lệ Tiết Kiệm (% Net)',
  'prefs.annualReturn': 'Lợi Suất / Năm',
  'prefs.annualInflation': 'Lạm Phát / Năm',
  'prefs.horizonYears': 'Thời Gian (Năm)',
  'prefs.valueMode': 'Chế Độ Giá Trị Dự Báo',
  'prefs.includeEmployer':
    'Tính cả phần đóng {label} ({rate}%) của công ty vào tăng trưởng hưu trí',
  'prefs.privacyTitle': 'Hướng Dẫn, Phím Tắt & Quyền Riêng Tư',
  'prefs.privacyDesc':
    'Mức lương nhập gần nhất, tùy chọn và các so sánh offer đã lưu được lưu cục bộ trên trình duyệt của bạn (không bao giờ gửi lên máy chủ).',
  'prefs.showWelcomeTitle': 'Hiện Hướng Dẫn Chào Mừng Khi Mở App',
  'prefs.showWelcomeDesc':
    'Tự động hiển thị tổng quan hướng dẫn nhanh khi mở PocketWage.',
  'prefs.previewGuide': 'Xem Hướng Dẫn',
  'prefs.shortcutsTitle': 'Danh Sách Phím Tắt',
  'prefs.shortcutsDesc':
    'Xem phím chuyển trang (Ctrl+1..4) và thao tác nhanh.',
  'prefs.viewShortcuts': 'Xem Phím Tắt',
  'prefs.clearAmountsTitle': 'Xóa Số Liệu Phiên Hiện Tại',
  'prefs.clearAmountsDesc':
    'Xóa ngay toàn bộ mức lương, khấu trừ, số liệu so sánh và tiền tiết kiệm đã nhập.',
  'prefs.clearAllAmounts': 'Xóa Toàn Bộ Số Tiền',

  // Cross-Device Cloud Sync (Optional)
  'sync.title': 'Đồng Bộ Đa Thiết Bị (Tùy Chọn)',
  'sync.desc':
    'Mặc định dữ liệu chỉ lưu trên trình duyệt này. Chỉ bật nếu bạn muốn đăng nhập Google để đồng bộ mức lương và các offer đã lưu qua các thiết bị.',
  'sync.toggleLabel': 'Bật đồng bộ đa thiết bị',
  'sync.signInGoogle': 'Đăng nhập bằng Google',
  'sync.signingIn': 'Đang đăng nhập...',
  'sync.signOut': 'Đăng xuất & chỉ lưu cục bộ',
  'sync.syncNow': 'Đồng Bộ Ngay',
  'sync.syncing': 'Đang đồng bộ...',
  'sync.synced': 'Đã đồng bộ đa thiết bị',
  'sync.localOnly': 'Chỉ lưu cục bộ',
  'sync.askSyncBtn': 'Đồng bộ đa thiết bị',
  'sync.signedInAs': 'Đã đăng nhập: {email}',
  'sync.freeNote': 'Gói miễn phí Firebase Spark · Riêng tư theo tài khoản Google',

  // PDF Report & Print
  'pdf.previewTitle': 'Xem Trước Báo Cáo PDF In Ấn',
  'pdf.previewHint':
    'Khổ dọc A4 · Chọn "Lưu dưới dạng PDF" trong hộp thoại in của trình duyệt',
  'pdf.saveHtml': 'Lưu HTML',
  'pdf.printSavePdf': 'In / Lưu Thành PDF',
  'pdf.closePreview': 'Đóng xem trước PDF',
  'pdf.reportTitle': 'Báo Cáo Chi Tiết Lương & Thu Nhập Thực Nhận',
  'pdf.generated': 'Ngày tạo {date}',
  'pdf.annualNet': 'Thực Nhận Cả Năm',
  'pdf.annualGross': 'Tổng Thu Nhập Chịu Thuế / Năm',
  'pdf.annualTaxLevies': 'Thuế & Bảo Hiểm / Năm',
  'pdf.annualRetirement': '{label} / Năm',
  'pdf.grossPayAllocation': 'Phân Bổ Lương Gross',
  'pdf.payBreakdownByPeriod': 'Chi Tiết Lương Theo Kỳ ({currency})',
  'pdf.annualDeductionSummary': 'Tổng Hợp Khấu Trừ Cả Năm',
  'pdf.totalAnnualDeductions': 'Tổng Thuế & Các Khoản Khấu Trừ / Năm',
  'pdf.netAnnualTakeHomeCash': 'Tiền Thực Nhận Ròng Cả Năm',

  // Quick Tutorial
  'tour.badge': 'Hướng Dẫn Nhanh · Bước {current} / {total}',
  'tour.exit': 'Thoát',
  'tour.back': 'Quay Lại',
  'tour.next': 'Tiếp Theo',
  'tour.finish': 'Hoàn Tất',
  'tour.step1Title': '1. Chọn Loại Hình & Nhập Lương',
  'tour.step1Desc':
    'Chọn Toàn Thời Gian, Bán Thời Gian hoặc Casual và nhập bất kỳ kỳ nào trong 6 kỳ (Giờ đến Năm) để tự động đồng bộ.',
  'tour.step2Title': '2. Quy Đổi Ngoại Tệ & Ghim Yêu Thích',
  'tour.step2Desc':
    'Chọn tiền tệ đích để xem mức quy đổi theo tỷ giá trực tiếp và ghim tối đa 5 ngoại tệ hay dùng.',
  'tour.step3Title': '3. Tùy Chỉnh Ca Làm, Phụ Cấp & Thuế',
  'tour.step3Desc':
    'Chuyển giữa 26 quốc gia (2026–2027), bật ngưỡng miễn thuế, phụ cấp casual, giờ cuối tuần, tăng ca & Super trên OTE.',
  'tour.step4Title': '4. Xem Bảng 6 Kỳ, Ngày Phép & Xuất CSV / PDF',
  'tour.step4Desc':
    'Kiểm tra bảng 6 kỳ, quỹ hưu OTE và số giờ phép ước tính bên dưới hoặc xuất báo cáo CSV / PDF bất cứ lúc nào.',
  'tour.step5Title': '5. So Sánh, Hưu Trí & Ủng Hộ Stripe',
  'tour.step5Desc':
    'Chuyển tab (Ctrl+1..4) để so sánh offer, lập kế hoạch hưu trí, đổi ngôn ngữ hoặc ủng hộ qua Stripe.',

  // Welcome Modal & Offline
  'welcome.title': 'Chào mừng đến với PocketWage',
  'welcome.subtitle':
    'Tính lương thực nhận toàn cầu, hỗ trợ Full-Time/Part-Time/Casual, ca tăng ca và hưu trí tại 26 quốc gia.',
  'welcome.getStarted': 'Bắt Đầu',
  'welcome.shortcuts': 'Phím Tắt',
  'welcome.guideCalcTitle': '01. Tính Lương, Casual, Tăng Ca & Thực Nhận',
  'welcome.guideCalcAction': 'Mở Máy Tính',
  'welcome.guideCalcDesc':
    'Chuyển đổi Full-Time, Part-Time và Casual trên 6 kỳ lương, tính phụ cấp cuối tuần/lễ, Super trên OTE và ngày phép theo tỷ lệ.',
  'welcome.guideCompareTitle': '02. So Sánh Tăng Lương & Offer Mới',
  'welcome.guideCompareAction': 'So Sánh Offer',
  'welcome.guideCompareDesc':
    'Đặt lương hiện tại cạnh mức lương mục tiêu theo số tiền hoặc % tăng (+5% đến +25%) để xem chênh lệch thực nhận.',
  'welcome.guideRetireTitle': '03. Dự Báo Tài Sản Hưu Trí',
  'welcome.guideRetireAction': 'Lập Kế Hoạch',
  'welcome.guideRetireDesc':
    'Mô phỏng tăng trưởng lãi kép 1–50 năm theo mức tiết kiệm hàng tháng và quỹ hưu trí chủ lao động.',
  'welcome.localSavedNote':
    'Dữ liệu lưu cục bộ trên trình duyệt — nhấn Xóa Số Tiền bất cứ lúc nào để bảo mật.',
  'welcome.supportLink': 'Ủng hộ PocketWage qua Stripe',
  'offline.banner': 'Chế Độ Ngoại Tuyến — Ứng dụng đã sẵn sàng',

  // Supporter Tips (Stripe)
  'support.button': 'Ủng hộ / Tip',
  'support.modalTitle': 'Ủng Hộ PocketWage',
  'support.modalSubtitle':
    'PocketWage hoàn toàn miễn phí. Bạn có thể gửi một khoản ủng hộ tùy chọn qua Stripe Checkout để hỗ trợ duy trì và cập nhật thuế hàng năm.',
  'support.chooseAmount': 'Chọn mức ủng hộ ({currency})',
  'support.customAmount': 'Số tiền tùy chọn',
  'support.payButton': 'Tiếp tục với Stripe ({amount})',
  'support.redirecting': 'Đang kết nối Stripe Checkout...',
  'support.notConfiguredTitle': 'Stripe Checkout chưa được cấu hình',
  'support.notConfiguredDesc':
    'Thêm STRIPE_SECRET_KEY vào Secrets máy chủ (hoặc VITE_STRIPE_DONATION_URL) để nhận tiền ủng hộ.',
  'support.thankYouNotice':
    'Cảm ơn bạn đã ủng hộ PocketWage! Giao dịch Stripe đã thành công.',
  'support.cancelledNotice':
    'Đã hủy thanh toán Stripe — chưa có khoản phí nào được trừ.',
  'support.secureNote': 'Xử lý bảo mật bởi Stripe · Không bắt buộc',
  'support.errorGeneric':
    'Không thể khởi tạo Stripe Checkout lúc này. Vui lòng thử lại.',

  // Notices
  'notice.amountsCleared': 'Đã xóa toàn bộ số tiền lương và tiết kiệm',
  'notice.languageChanged': 'Đã chuyển ngôn ngữ sang {name}',
  'notice.comparisonSaved': 'Đã lưu so sánh "{name}" trên trình duyệt',
  'notice.comparisonLoaded': 'Đã tải so sánh "{name}"',
  'notice.syncEnabled': 'Đã đăng nhập {name} — bật đồng bộ đa thiết bị',
  'notice.syncDisabled': 'Đã đăng xuất — quay lại chế độ lưu cục bộ',
  'notice.syncedNow': 'Đã đồng bộ dữ liệu lên đám mây',

  // Legal & Policies
  'legal.privacyPolicy': 'Chính Sách Bảo Mật',
  'legal.termsConditions': 'Điều Khoản & Điều Kiện',
  'legal.footerNotice': 'PocketWage · Công cụ ước tính lương & hưu trí ưu tiên lưu cục bộ',
  'legal.disclaimer':
    'Lưu ý: Công cụ tính toán của chúng tôi chỉ cung cấp ước tính mang tính thông tin chung và không phải là tư vấn tài chính, thuế, pháp lý hay kế toán.',
  'legal.effectiveDate': 'Cập nhật lần cuối: 15 tháng 11, 2026',
  'legal.close': 'Đóng',
  'legal.summaryTitle': 'Tài Liệu Pháp Lý & Chính Sách',
  'legal.summaryDesc':
    'Xem cách PocketWage bảo vệ quyền riêng tư cục bộ và các điều khoản áp dụng cho kết quả ước tính.',

  // Partner & Referral Integrations
  'calc.exportTaxApp': 'Xuất Dữ Liệu Thuế',
  'partner.superPrompt':
    'Xem việc gộp quỹ hoặc đóng góp thêm vào quỹ {label} hay ETF phí thấp ảnh hưởng thế nào đến số dư hưu trí.',
  'partner.openRetirement': 'Kế Hoạch Hưu Trí',
  'partner.disclosure': 'Liên kết đối tác · PocketWage có thể nhận hoa hồng mà bạn không mất thêm phí',
  'partner.novatedToggle': 'So Sánh Tiết Kiệm Thuê Xe (Novated Lease)',
  'partner.novatedDesc':
    'Ước tính tiền thuế tiết kiệm trước thuế và chuyển lương gộp sang đối tác thuê xe.',
  'partner.novatedPartnersTitle':
    'So sánh báo giá novated lease với lương gộp {gross}',
  'partner.novatedNote': 'Ước tính theo quy định khấu trừ trước thuế, chưa gồm phí tài chính',
  'partner.taxModalTitle': 'Xuất Tóm Tắt Thuế Hàng Năm',
  'partner.taxPartnersHeading': 'Tiếp Tục Với Phần Mềm Thuế & Kế Toán',
  'partner.taxModalPrivacy':
    'Chỉ các số liệu lương và thuế tổng hợp được chuyển khi bạn mở liên kết đối tác — PocketWage có thể nhận hoa hồng giới thiệu miễn phí cho bạn.',
};
