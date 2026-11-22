import { TranslationDictionary } from './en';

export const es: TranslationDictionary = {
  // Navigation & Global Actions
  'nav.calculator': 'Calculadora',
  'nav.compare': 'Comparar Aumento',
  'nav.compareCompact': 'Comparar',
  'nav.retirement': 'Jubilación',
  'nav.retirementMobile': 'Retiro',
  'nav.calculateMobile': 'Calcular',
  'nav.settings': 'Ajustes',
  'nav.install': 'Instalar',
  'nav.share': 'Compartir',
  'nav.clearAmounts': 'Limpiar Montos',
  'nav.skipToMain': 'Ir al contenido principal',
  'nav.openGuide': 'Cómo usar PocketWage',
  'nav.shortcutsLabel': 'Atajos de teclado',

  // Periods
  'period.Hourly': 'Por hora',
  'period.Daily': 'Diario',
  'period.Weekly': 'Semanal',
  'period.Fortnightly': 'Quincenal',
  'period.Monthly': 'Mensual',
  'period.Annual': 'Anual',

  // Calculator View
  'calc.heroTitle': 'Calculadora de Salario Neto',
  'calc.quickTour': 'Guía Rápida',
  'calc.retirementBtn': 'Jubilación',
  'calc.compareOfferBtn': 'Comparar Aumento / Oferta',
  'calc.perOrdinaryHour': 'Por hora ordinaria',
  'calc.workdayHours': 'Jornada de {hours}h',
  'calc.perWeek': 'Base semanal',
  'calc.perFortnight': 'Cada 2 semanas',
  'calc.perCalendarMonth': 'Por mes calendario',
  'calc.weeksPerYear': '{weeks} semanas / año',
  'calc.loadedHourly': 'Con recargo: {rate}/h (+{pct}%)',
  'calc.employmentType': 'Tipo de Empleo',
  'calc.fullTime': 'Tiempo Completo',
  'calc.partTime': 'Medio Tiempo',
  'calc.casual': 'Casual / Eventual',
  'calc.agreedWeeklyHours': 'Horas Semanales Pactadas',
  'calc.fortnightlyEquiv': '{hours}h / quincena',
  'calc.casualLoading': 'Recargo Casual',
  'calc.taxFreeThreshold': 'Umbral Libre de Impuestos ($18,200)',
  'calc.shiftsOvertimeToggle': 'Horas Extra, Fin de Semana y Feriados',
  'calc.shiftsOvertimeDesc':
    'Horas adicionales opcionales, multiplicadores y regla acumulativa vs compuesta',
  'calc.saturdayHours': 'Sábado (h/sem)',
  'calc.sundayHours': 'Domingo (h/sem)',
  'calc.publicHolidayHours': 'Feriado (h/sem)',
  'calc.overtimeHours': 'Horas Extra (h/sem)',
  'calc.casualPenaltyRule': 'Regla Recargo Casual',
  'calc.compounding': 'Compuesta (125% × Penalidad)',
  'calc.cumulative': 'Acumulativa (+25% + Penalidad)',
  'calc.casualPhNote':
    'Casual: sin pago si no trabaja; {mult}x si trabaja en día feriado.',
  'calc.leaveTitle': 'Licencias y Base OTE de Pensión',
  'calc.annualLeaveEst': 'Vacaciones Anuales',
  'calc.personalLeaveEst': 'Licencia Médica / Personal',
  'calc.leaveCasualNone': 'Ninguna — cubierta por {pct}% de recargo casual',
  'calc.leaveHoursYr': '{hrs}h / año',
  'calc.oteSuperLabel': '{label} sobre OTE ({ote})',
  'calc.overtimeExclNote': 'Horas extra ({ot}) excluidas de OTE',
  'calc.beforeTaxGross': 'Antes de impuestos (bruto)',
  'calc.totalPackageIncl': 'Paquete total (incl. {label})',
  'calc.cashTakeHome': 'Neto en Mano',
  'calc.taxShort': 'Imp.',
  'calc.countryRulesLabel': 'Reglas Fiscales y {label}',
  'calc.latestPct': 'Último {pct}%',
  'calc.onTop': '+ Adicional',
  'calc.included': 'Incluido',
  'calc.workSchedule': 'Horario Laboral',
  'calc.privateHealth': 'Seguro Médico',
  'calc.optional': 'Opcional',
  'calc.autoSynced': 'Sincronizado · Reglas {year} e impuestos ({label})',
  'calc.syncLatestRules': 'Sincronizar Reglas ({year})',
  'calc.dependents': 'Dependientes (₫6.2M/mes):',
  'calc.effectiveTaxRate': 'Tasa Efectiva:',
  'calc.marginal': 'Marginal:',
  'calc.summaryTitle': 'Resumen Completo de Pago y Deducciones',
  'calc.summaryEmpty':
    'Ingresa cualquier monto arriba para ver tu desglose bruto y neto completo',
  'calc.takeHomeRatio': 'Proporción neta:',
  'calc.downloadCsv': 'Descargar CSV',
  'calc.exportPdf': 'Exportar PDF',
  'calc.colPeriod': 'Período',
  'calc.colGross': 'Bruto (Antes de Imp.)',
  'calc.colTaxLevies': 'Impuestos y Tasas',
  'calc.colAfterTax': 'Pago Neto Fiscal',
  'calc.colPhiOther': 'Seguro y Otros',
  'calc.colConverted': 'Convertido ({code})',
  'calc.paidOnTop': '(pagado aparte)',
  'calc.includedInPackage': '(incluido en paquete)',

  // Proportion Chart
  'chart.title': 'Proporción de Impuestos vs. Salario Neto',
  'chart.subtitle':
    'Distribución de tu paquete {period} ({currency}) entre salario neto, impuestos y {label}.',
  'chart.empty':
    'Ingresa un salario por hora, diario, semanal, quincenal, mensual o anual arriba para ver el gráfico interactivo.',
  'chart.incomeTax': 'Impuesto sobre la Renta',
  'chart.totalPackage': 'Paquete Total {period} (incl. {label})',

  // Currency Converter
  'currency.title': 'Conversor de Divisas',
  'currency.retirementTitle': 'Conversor de Jubilación',
  'currency.subtitleCalc':
    'Convierte tu salario bruto y neto en {currency} a otra moneda',
  'currency.subtitleCompare':
    'Convierte tu salario actual, objetivo y aumento de {currency} a otra moneda',
  'currency.subtitleRetirement':
    'Convierte tu patrimonio proyectado e ingreso mensual del 4% de {currency} a otra moneda',
  'currency.offOption': 'Desactivado (solo {currency}) — Elige moneda',
  'currency.pinnedFavorites': 'Favoritas Fijadas ({count}/{max})',
  'currency.allCurrencies': 'Todas las Monedas',
  'currency.pin': 'Fijar',
  'currency.pinned': 'Fijada',

  // Payrise Compare
  'compare.heroTitle': 'Comparación de Aumento y Oferta Laboral',
  'compare.heroSubtitle':
    'Compara tu salario actual lado a lado frente a un aumento o nueva oferta ({currency}) con reglas de {authority}.',
  'compare.currentPay': 'Salario Actual',
  'compare.targetOffer': 'Objetivo / Nueva Oferta',
  'compare.targetIncreasePct': 'Aumento Objetivo (%)',
  'compare.netGainAnnual': 'Ganancia Neta Anual',
  'compare.netGainMonthly': 'Ganancia Neta Mensual',
  'compare.netGainHourly': 'Ganancia Neta por Hora',
  'compare.savedTitle': 'Comparaciones de Ofertas Guardadas',
  'compare.savedDesc':
    'Guardado localmente en tu navegador para revisar y comparar ofertas en cualquier momento.',
  'compare.savePlaceholder': 'Nombre de oferta (ej. Puesto Senior en Acme)',
  'compare.saveBtn': 'Guardar Comparación',
  'compare.loadBtn': 'Cargar',
  'compare.deleteBtn': 'Eliminar',
  'compare.clearSavedBtn': 'Limpiar Guardadas',
  'compare.savedEmpty':
    'Aún no hay comparaciones guardadas. Ingresa montos arriba y haz clic en Guardar Comparación para conservarlas en tu navegador.',
  'compare.savedBadge': 'Guardado local',

  // Retirement Projections
  'retirement.heroTitle': 'Proyecciones de Patrimonio para el Retiro',
  'retirement.futureValue': 'Valor Futuro',
  'retirement.todaysMoney': 'Dinero de Hoy',

  // Global Settings
  'settings.title': 'Ajustes',
  'settings.subtitle':
    'Administra el idioma, reglas fiscales por país, tema visual, colores de acento y preferencias de cálculo en un solo lugar.',
  'settings.languageLabel': 'Idioma',
  'settings.tabTax': 'Impuestos y Pensión',
  'settings.tabTaxDesc': 'Jurisdicción fiscal, tramos y tasas de retiro',
  'settings.tabTheme': 'Tema y Apariencia',
  'settings.tabThemeDesc': 'Modo Claro, Oscuro, Medianoche y colores de acento',
  'settings.tabPrefs': 'Preferencias y Valores',
  'settings.tabPrefsDesc':
    'Idioma, jornada laboral, divisas favoritas, retiro y privacidad',

  // Tax Settings
  'tax.title': 'Reglas Fiscales y de Jubilación por País',
  'tax.resetAustralia': 'Restablecer a Australia',
  'tax.selectCountry': 'Seleccionar Jurisdicción Fiscal',
  'tax.collapseAll': 'Contraer Todo',
  'tax.expandAll': 'Expandir Todo',

  // Theme Settings
  'theme.title': 'Configuración de Tema y Apariencia',
  'theme.resetDefault': 'Restablecer Predeterminado',
  'theme.displayMode': 'Modo de Pantalla',
  'theme.displayModeDesc':
    'Elige entre Claro estándar, Oscuro suave o Medianoche de alto contraste para pantallas OLED.',
  'theme.accentColor': 'Paleta de Color de Acento',
  'theme.accentColorDesc':
    'Elige un color distintivo para botones, pestañas activas, enfoque y gráficos de retiro.',

  // Preferences Settings
  'prefs.title': 'Preferencias y Valores Predeterminados',
  'prefs.subtitle':
    'Personaliza el idioma de la interfaz, jornada laboral, monedas fijadas, supuestos de retiro e inicio.',
  'prefs.languageTitle': 'Idioma de la Interfaz',
  'prefs.languageDesc':
    'Elige el idioma para la navegación, etiquetas de la calculadora, ajustes y reportes exportados.',
  'prefs.scheduleTitle': 'Horario Laboral y Base Salarial',
  'prefs.scheduleDesc':
    'Se utiliza para sincronizar tarifas por hora, día, mes y año en la calculadora.',
  'prefs.resetSchedule': 'Restablecer Horario ({code})',
  'prefs.hoursPerDay': 'Horas por Día Laboral',
  'prefs.daysPerWeek': 'Días por Semana',
  'prefs.weeksPerYear': 'Semanas Pagadas / Año',
  'prefs.activeInputPeriod': 'Período de Entrada Activo',
  'prefs.currencyTitle': 'Conversor y Monedas Fijadas',
  'prefs.currencyDesc':
    'Fija hasta {max} monedas ({count}/{max} fijadas) para mantenerlas arriba en cada selector.',
  'prefs.clearPinned': 'Limpiar Fijadas',
  'prefs.activeConversionCurrency': 'Moneda de Conversión Activa',
  'prefs.offCurrencyOnly': 'Desactivado (solo {currency})',
  'prefs.pinFavoriteCurrencies': 'Fijar Monedas Favoritas ({count}/{max})',
  'prefs.retirementTitle': 'Supuestos de Modelado de Retiro',
  'prefs.retirementDesc':
    'Ajusta la tasa de ahorro base, rendimiento esperado, inflación, horizonte y modo de valor.',
  'prefs.resetAssumptions': 'Restablecer Supuestos',
  'prefs.savingsRate': 'Tasa de Ahorro (% del Neto)',
  'prefs.annualReturn': 'Rendimiento Anual',
  'prefs.annualInflation': 'Inflación Anual',
  'prefs.horizonYears': 'Horizonte (Años)',
  'prefs.valueMode': 'Modo de Valor Proyectado',
  'prefs.includeEmployer':
    'Incluir aporte del empleador {label} ({rate}%) en el crecimiento proyectado',
  'prefs.privacyTitle': 'Bienvenida, Atajos y Privacidad de Sesión',
  'prefs.privacyDesc':
    'Tu último salario, preferencias y comparaciones guardadas se almacenan localmente en tu navegador (nunca se envían a ningún servidor).',
  'prefs.showWelcomeTitle': 'Mostrar Guía de Bienvenida al Iniciar',
  'prefs.showWelcomeDesc':
    'Muestra automáticamente el resumen de inicio rápido al abrir PocketWage.',
  'prefs.previewGuide': 'Ver Guía',
  'prefs.shortcutsTitle': 'Referencia de Atajos de Teclado',
  'prefs.shortcutsDesc':
    'Ver navegación (Ctrl+1..4) y teclas de acción rápida.',
  'prefs.viewShortcuts': 'Ver Atajos',
  'prefs.clearAmountsTitle': 'Borrar Montos de la Sesión',
  'prefs.clearAmountsDesc':
    'Elimina de inmediato salarios, deducciones, comparaciones y ahorros iniciales.',
  'prefs.clearAllAmounts': 'Borrar Todos los Montos',

  // Cross-Device Cloud Sync (Optional)
  'sync.title': 'Sincronización Entre Dispositivos (Opcional)',
  'sync.desc':
    'Por defecto, tus datos solo se guardan en este navegador. Actívalo si deseas iniciar sesión con Google para sincronizar tu salario y comparaciones.',
  'sync.toggleLabel': 'Activar sincronización entre dispositivos',
  'sync.signInGoogle': 'Iniciar sesión con Google',
  'sync.signingIn': 'Iniciando sesión...',
  'sync.signOut': 'Cerrar sesión y usar solo local',
  'sync.syncNow': 'Sincronizar Ahora',
  'sync.syncing': 'Sincronizando...',
  'sync.synced': 'Sincronizado en la nube',
  'sync.localOnly': 'Solo local',
  'sync.askSyncBtn': 'Sincronizar dispositivos',
  'sync.signedInAs': 'Conectado como {email}',
  'sync.freeNote': 'Plan gratuito Firebase Spark · Privado en tu cuenta de Google',

  // PDF Report & Print
  'pdf.previewTitle': 'Vista Previa del Informe PDF Imprimible',
  'pdf.previewHint':
    'A4 Vertical · Selecciona "Guardar como PDF" como destino en el diálogo de impresión',
  'pdf.saveHtml': 'Guardar HTML',
  'pdf.printSavePdf': 'Imprimir / Guardar PDF',
  'pdf.closePreview': 'Cerrar vista previa PDF',
  'pdf.reportTitle': 'Informe de Desglose Salarial y Salario Neto',
  'pdf.generated': 'Generado {date}',
  'pdf.annualNet': 'Salario Neto Anual',
  'pdf.annualGross': 'Bruto Imponible Anual',
  'pdf.annualTaxLevies': 'Impuestos y Tasas Anuales',
  'pdf.annualRetirement': '{label} Anual',
  'pdf.grossPayAllocation': 'Asignación del Salario Bruto',
  'pdf.payBreakdownByPeriod': 'Desglose de Pago por Período ({currency})',
  'pdf.annualDeductionSummary': 'Resumen Anual de Deducciones',
  'pdf.totalAnnualDeductions': 'Total Anual de Impuestos y Deducciones',
  'pdf.netAnnualTakeHomeCash': 'Efectivo Neto Anual en Mano',

  // Quick Tutorial
  'tour.badge': 'Tutorial Rápido · Paso {current} de {total}',
  'tour.exit': 'Salir del Tutorial',
  'tour.back': 'Atrás',
  'tour.next': 'Siguiente',
  'tour.finish': 'Finalizar',
  'tour.step1Title': '1. Ingresa Cualquier Monto',
  'tour.step1Desc':
    'Elige Tiempo Completo, Medio Tiempo o Casual e ingresa un monto por hora, diario, semanal, quincenal, mensual o anual.',
  'tour.step2Title': '2. Convierte Monedas y Fija Favoritas',
  'tour.step2Desc':
    'Selecciona una moneda destino para ver el bruto y neto convertidos en vivo, y fija hasta 5 favoritas.',
  'tour.step3Title': '3. Personaliza Empleo, Turnos y Reglas',
  'tour.step3Desc':
    'Cambia entre 26 países sincronizados 2026–2027 y ajusta recargo casual, horas extra, feriados y umbral libre.',
  'tour.step4Title': '4. Revisa Resumen, Licencias y CSV / PDF',
  'tour.step4Desc':
    'Consulta los 6 períodos, pensión OTE y vacaciones proporcionales abajo o descarga CSV / PDF en cualquier momento.',
  'tour.step5Title': '5. Compara Ofertas, Retiro y Propinas',
  'tour.step5Desc':
    'Cambia de pestaña (Ctrl+1..4) para comparar aumentos, proyectar jubilación, cambiar idioma o apoyar vía Stripe.',

  // Welcome Modal & Offline
  'welcome.title': 'Bienvenido a PocketWage',
  'welcome.subtitle':
    'Salario neto global, turnos casual/extras, comparación de aumentos y retiro en 26 países.',
  'welcome.getStarted': 'Comenzar',
  'welcome.shortcuts': 'Atajos',
  'welcome.guideCalcTitle': '01. Calculadora Salarial, Casual y Turnos',
  'welcome.guideCalcAction': 'Abrir Calculadora',
  'welcome.guideCalcDesc':
    'Alterna entre Tiempo Completo, Medio Tiempo y Casual en 6 períodos (por hora a anual), turnos extras, pensión OTE y vacaciones proporcionales.',
  'welcome.guideCompareTitle': '02. Comparación de Aumento y Oferta',
  'welcome.guideCompareAction': 'Comparar Ofertas',
  'welcome.guideCompareDesc':
    'Compara tu salario actual frente a una nueva oferta por monto o porcentaje (+5% a +25%) con impacto neto por hora, mes y año.',
  'welcome.guideRetireTitle': '03. Proyecciones de Retiro',
  'welcome.guideRetireAction': 'Planificar Retiro',
  'welcome.guideRetireDesc':
    'Simula crecimiento compuesto de 1 a 50 años según tu ahorro neto mensual y aportes del empleador en valor futuro o dinero de hoy.',
  'welcome.localSavedNote':
    'Guardado localmente en tu navegador — pulsa Borrar Montos cuando quieras.',
  'welcome.supportLink': 'Apoyar a PocketWage vía Stripe',
  'offline.banner': 'Modo Sin Conexión — App en caché lista',

  // Supporter Tips (Stripe)
  'support.button': 'Propina / Apoyar',
  'support.modalTitle': 'Apoyar a PocketWage',
  'support.modalSubtitle':
    'PocketWage es gratuito. Si te resultó útil, deja una propina opcional mediante Stripe Checkout para apoyar nuevas actualizaciones.',
  'support.chooseAmount': 'Elige un monto ({currency})',
  'support.customAmount': 'Monto personalizado',
  'support.payButton': 'Continuar a Stripe ({amount})',
  'support.redirecting': 'Conectando con Stripe Checkout...',
  'support.notConfiguredTitle': 'Stripe Checkout aún no está configurado',
  'support.notConfiguredDesc':
    'Agrega STRIPE_SECRET_KEY en tus Secrets del servidor (o VITE_STRIPE_DONATION_URL) para recibir aportes reales.',
  'support.thankYouNotice':
    '¡Gracias por apoyar a PocketWage! Tu aporte con Stripe se completó.',
  'support.cancelledNotice':
    'Pago cancelado en Stripe — no se realizó ningún cargo.',
  'support.secureNote': 'Procesado de forma segura por Stripe · Opcional',
  'support.errorGeneric':
    'No se pudo iniciar Stripe Checkout ahora. Inténtalo de nuevo.',

  // Notices
  'notice.amountsCleared': 'Todos los montos de salario y ahorro fueron borrados',
  'notice.languageChanged': 'Idioma cambiado a {name}',
  'notice.comparisonSaved': 'Comparación "{name}" guardada localmente',
  'notice.comparisonLoaded': 'Comparación "{name}" cargada',
  'notice.syncEnabled': 'Sesión iniciada como {name} — sincronización activada',
  'notice.syncDisabled': 'Sesión cerrada — modo local activado',
  'notice.syncedNow': 'Espacio de trabajo sincronizado en la nube',

  // Legal & Policies
  'legal.privacyPolicy': 'Política de Privacidad',
  'legal.termsConditions': 'Términos y Condiciones',
  'legal.footerNotice': 'PocketWage · Estimaciones salariales y de retiro locales',
  'legal.disclaimer':
    'Nota: Nuestras calculadoras ofrecen únicamente estimaciones informativas generales y no constituyen asesoramiento financiero, fiscal, legal ni contable.',
  'legal.effectiveDate': 'Última actualización: 15 de noviembre de 2026',
  'legal.close': 'Cerrar',
  'legal.summaryTitle': 'Documentos Legales y Privacidad',
  'legal.summaryDesc':
    'Consulta cómo PocketWage protege tus datos localmente y los términos de uso de las estimaciones.',

  // Partner & Referral Integrations
  'calc.exportTaxApp': 'Exportar Impuestos',
  'partner.superPrompt':
    'Descubre cómo consolidar o aportar voluntariamente a un fondo {label} o ETF de bajas comisiones impacta tu saldo de jubilación.',
  'partner.openRetirement': 'Plan de Retiro',
  'partner.disclosure':
    'Enlace de socio · PocketWage puede recibir una comisión sin costo adicional para ti',
  'partner.novatedToggle': 'Comparar Ahorro en Novated Lease',
  'partner.novatedDesc':
    'Estima el ahorro fiscal antes de impuestos y envía tu salario bruto a un proveedor de leasing vehicular.',
  'partner.novatedPartnersTitle':
    'Compara cotizaciones de novated lease con tu salario bruto de {gross}',
  'partner.novatedNote':
    'Las estimaciones asumen reglas elegibles antes de impuestos y excluyen cargos financieros',
  'partner.taxModalTitle': 'Exportar Resumen Fiscal Anual',
  'partner.taxPartnersHeading': 'Continuar con un Software Fiscal y Contable',
  'partner.taxModalPrivacy':
    'Solo se comparten cifras agregadas de salario e impuestos si abres un enlace asociado; PocketWage puede recibir una comisión sin costo adicional.',
};
