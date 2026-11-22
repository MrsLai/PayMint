import { TranslationDictionary } from './en';

export const it: TranslationDictionary = {
  // Navigation & Global Actions
  'nav.calculator': 'Calcolatore',
  'nav.compare': 'Confronta Aumento',
  'nav.compareCompact': 'Confronta',
  'nav.retirement': 'Pensione',
  'nav.retirementMobile': 'Pensione',
  'nav.calculateMobile': 'Calcola',
  'nav.settings': 'Impostazioni',
  'nav.install': 'Installa',
  'nav.share': 'Condividi',
  'nav.clearAmounts': 'Azzera Importi',
  'nav.skipToMain': 'Vai al contenuto principale',
  'nav.openGuide': 'Come usare PocketWage',
  'nav.shortcutsLabel': 'Scorciatoie da tastiera',

  // Periods
  'period.Hourly': 'Orario',
  'period.Daily': 'Giornaliero',
  'period.Weekly': 'Settimanale',
  'period.Fortnightly': 'Quindicinale',
  'period.Monthly': 'Mensile',
  'period.Annual': 'Annuale',

  // Calculator View
  'calc.heroTitle': 'Calcolatore Stipendio e Netto in Busta',
  'calc.quickTour': 'Tour Rapido',
  'calc.retirementBtn': 'Pensione',
  'calc.compareOfferBtn': 'Confronta Aumento / Offerta',
  'calc.perOrdinaryHour': 'Per ora ordinaria',
  'calc.workdayHours': 'Giornata di {hours}h',
  'calc.perWeek': 'Base settimanale',
  'calc.perFortnight': 'Ogni 2 settimane',
  'calc.perCalendarMonth': 'Per mese solare',
  'calc.weeksPerYear': '{weeks} settimane / anno',
  'calc.loadedHourly': 'Maggiorato: {rate}/h (+{pct}%)',
  'calc.employmentType': 'Tipo di Contratto',
  'calc.fullTime': 'Tempo Pieno',
  'calc.partTime': 'Part-Time',
  'calc.casual': 'Casual / Saltuario',
  'calc.agreedWeeklyHours': 'Ore Settimanali Concordate',
  'calc.fortnightlyEquiv': '{hours}h / 2 sett.',
  'calc.casualLoading': 'Maggiorazione Casual',
  'calc.taxFreeThreshold': 'Soglia Esentasse ($18,200)',
  'calc.shiftsOvertimeToggle': 'Straordinari, Weekend e Festivi',
  'calc.shiftsOvertimeDesc':
    'Ore extra opzionali, moltiplicatori e metodo composto vs cumulativo',
  'calc.saturdayHours': 'Sabato (h/sett)',
  'calc.sundayHours': 'Domenica (h/sett)',
  'calc.publicHolidayHours': 'Festivo (h/sett)',
  'calc.overtimeHours': 'Straordinari (h/sett)',
  'calc.casualPenaltyRule': 'Regola Maggiorazione Casual',
  'calc.compounding': 'Composta (125% × Magg.)',
  'calc.cumulative': 'Cumulativa (+25% + Magg.)',
  'calc.casualPhNote':
    'Casual: non pagato se non lavorato; {mult}x nei giorni festivi lavorati.',
  'calc.leaveTitle': 'Ferie Maturate & Base OTE',
  'calc.annualLeaveEst': 'Ferie Annuali',
  'calc.personalLeaveEst': 'Permessi / Malattia',
  'calc.leaveCasualNone': 'Nessuna — coperta dalla maggiorazione {pct}%',
  'calc.leaveHoursYr': '{hrs}h / anno',
  'calc.oteSuperLabel': '{label} su OTE ({ote})',
  'calc.overtimeExclNote': 'Straordinari ({ot}) esclusi da OTE',
  'calc.beforeTaxGross': 'Prima delle tasse (lordo)',
  'calc.totalPackageIncl': 'Pacchetto totale (incl. {label})',
  'calc.cashTakeHome': 'Netto in Busta',
  'calc.taxShort': 'Tasse',
  'calc.countryRulesLabel': 'Regole Fiscali e {label}',
  'calc.latestPct': 'Attuale {pct}%',
  'calc.onTop': '+ Aggiuntivo',
  'calc.included': 'Incluso',
  'calc.workSchedule': 'Orario di Lavoro',
  'calc.privateHealth': 'Assicurazione Sanitaria',
  'calc.optional': 'Opzionale',
  'calc.autoSynced': 'Sincronizzato · Regole fiscali e {label} {year}',
  'calc.syncLatestRules': 'Sincronizza Regole ({year})',
  'calc.dependents': 'Persone a carico (₫6.2M/mese):',
  'calc.effectiveTaxRate': 'Aliquota Effettiva:',
  'calc.marginal': 'Marginale:',
  'calc.summaryTitle': 'Riepilogo Completo Retribuzione e Trattenute',
  'calc.summaryEmpty':
    'Inserisci un importo qui sopra per vedere il dettaglio completo di lordo e netto',
  'calc.takeHomeRatio': 'Quota netta:',
  'calc.downloadCsv': 'Scarica CSV',
  'calc.exportPdf': 'Esporta PDF',
  'calc.colPeriod': 'Periodo',
  'calc.colGross': 'Lordo (Prima delle Tasse)',
  'calc.colTaxLevies': 'Imposte e Contributi',
  'calc.colAfterTax': 'Dopo le Imposte',
  'calc.colPhiOther': 'Sanità Privata e Altro',
  'calc.colConverted': 'Convertito ({code})',
  'calc.paidOnTop': '(versato in aggiunta)',
  'calc.includedInPackage': '(incluso nel pacchetto)',

  // Proportion Chart
  'chart.title': 'Proporzione Imposte vs. Stipendio Netto',
  'chart.subtitle':
    'Ripartizione del pacchetto {period} ({currency}) tra netto in busta, imposte e {label}.',
  'chart.empty':
    'Inserisci uno stipendio orario, giornaliero, settimanale, quindicinale, mensile o annuale sopra.',
  'chart.incomeTax': 'Imposta sul Reddito',
  'chart.totalPackage': 'Pacchetto Totale {period} (incl. {label})',

  // Currency Converter
  'currency.title': 'Convertitore di Valuta',
  'currency.retirementTitle': 'Convertitore Valuta Pensione',
  'currency.subtitleCalc':
    'Converti lo stipendio lordo e netto da {currency} in un’altra valuta',
  'currency.subtitleCompare':
    'Converti stipendio attuale, obiettivo e incremento da {currency} in un’altra valuta',
  'currency.subtitleRetirement':
    'Converti il capitale pensionistico stimato e la rendita mensile del 4% da {currency} in un’altra valuta',
  'currency.offOption': 'Disattivo (solo {currency}) — Seleziona valuta',
  'currency.pinnedFavorites': 'Preferite Fissate ({count}/{max})',
  'currency.allCurrencies': 'Tutte le Valute',
  'currency.pin': 'Fissa',
  'currency.pinned': 'Fissata',

  // Payrise Compare
  'compare.heroTitle': 'Confronto Aumento e Nuova Offerta',
  'compare.heroSubtitle':
    'Confronta il tuo stipendio attuale affiancato a un aumento o una nuova offerta ({currency}) secondo le regole {authority}.',
  'compare.currentPay': 'Stipendio Attuale',
  'compare.targetOffer': 'Obiettivo / Nuova Offerta',
  'compare.targetIncreasePct': 'Aumento Obiettivo (%)',
  'compare.netGainAnnual': 'Guadagno Netto Annuale',
  'compare.netGainMonthly': 'Guadagno Netto Mensile',
  'compare.netGainHourly': 'Guadagno Netto Orario',
  'compare.savedTitle': 'Confronti Offerte Salvati',
  'compare.savedDesc':
    'Salvati localmente nel tuo browser per rivedere e confrontare le offerte in qualsiasi momento.',
  'compare.savePlaceholder': 'Etichetta offerta (es. Ruolo Senior Acme)',
  'compare.saveBtn': 'Salva Confronto',
  'compare.loadBtn': 'Carica',
  'compare.deleteBtn': 'Elimina',
  'compare.clearSavedBtn': 'Svuota Salvati',
  'compare.savedEmpty':
    'Nessun confronto salvato. Inserisci gli importi qui sopra e clicca su Salva Confronto per conservarli nel browser.',
  'compare.savedBadge': 'Salvato in locale',

  // Retirement Projections
  'retirement.heroTitle': 'Proiezioni Patrimonio Pensionistico',
  'retirement.futureValue': 'Valore Futuro',
  'retirement.todaysMoney': 'Valore di Oggi',

  // Global Settings
  'settings.title': 'Impostazioni',
  'settings.subtitle':
    'Gestisci lingua, regole fiscali e previdenziali per paese, tema, colori accento e preferenze di calcolo in un unico posto.',
  'settings.languageLabel': 'Lingua',
  'settings.tabTax': 'Tasse e Previdenza',
  'settings.tabTaxDesc': 'Giurisdizione fiscale, scaglioni e aliquote pensione',
  'settings.tabTheme': 'Tema e Aspetto',
  'settings.tabThemeDesc': 'Modalità Chiara, Scura, Midnight ad alto contrasto e colori',
  'settings.tabPrefs': 'Preferenze e Predefiniti',
  'settings.tabPrefsDesc':
    'Lingua, orario lavorativo, valute preferite, pensione e privacy',

  // Tax Settings
  'tax.title': 'Regole Fiscali e Previdenziali per Paese',
  'tax.resetAustralia': 'Ripristina Predefiniti Australia',
  'tax.selectCountry': 'Seleziona Giurisdizione Fiscale',
  'tax.collapseAll': 'Comprimi Tutto',
  'tax.expandAll': 'Espandi Tutto',

  // Theme Settings
  'theme.title': 'Impostazioni Tema e Aspetto',
  'theme.resetDefault': 'Ripristina Predefiniti',
  'theme.displayMode': 'Modalità Schermo',
  'theme.displayModeDesc':
    'Scegli Chiaro standard, Scuro riposante o Midnight ad alto contrasto per schermi OLED.',
  'theme.accentColor': 'Palette Colore Accento',
  'theme.accentColorDesc':
    'Scegli un colore distintivo per pulsanti, schede attive, focus e grafici previdenziali.',

  // Preferences Settings
  'prefs.title': 'Preferenze e Valori Predefiniti',
  'prefs.subtitle':
    'Personalizza la lingua dell’interfaccia, l’orario lavorativo, le valute fissate, le ipotesi previdenziali e l’avvio.',
  'prefs.languageTitle': 'Lingua e Localizzazione Interfaccia',
  'prefs.languageDesc':
    'Scegli la lingua di visualizzazione per navigazione, etichette del calcolatore, impostazioni e report esportati.',
  'prefs.scheduleTitle': 'Orario di Lavoro e Base di Calcolo',
  'prefs.scheduleDesc':
    'Utilizzato per sincronizzare tariffe orarie, giornaliere, mensili e annuali nel calcolatore.',
  'prefs.resetSchedule': 'Ripristina Orario ({code})',
  'prefs.hoursPerDay': 'Ore per Giornata Lavorativa',
  'prefs.daysPerWeek': 'Giorni a Settimana',
  'prefs.weeksPerYear': 'Settimane Pagate / Anno',
  'prefs.activeInputPeriod': 'Periodo di Inserimento Attivo',
  'prefs.currencyTitle': 'Convertitore Valuta e Preferite Fissate',
  'prefs.currencyDesc':
    'Fissa fino a {max} valute ({count}/{max} fissate) per mantenerle in cima a ogni menu a tendina.',
  'prefs.clearPinned': 'Rimuovi Fissate',
  'prefs.activeConversionCurrency': 'Valuta di Conversione Attiva',
  'prefs.offCurrencyOnly': 'Disattivo (solo {currency})',
  'prefs.pinFavoriteCurrencies': 'Fissa Valute Preferite ({count}/{max})',
  'prefs.retirementTitle': 'Ipotesi di Proiezione Pensione',
  'prefs.retirementDesc':
    'Regola tasso di risparmio base, rendimento atteso, inflazione, orizzonte temporale e modalità valore.',
  'prefs.resetAssumptions': 'Ripristina Ipotesi',
  'prefs.savingsRate': 'Tasso di Risparmio (% del Netto)',
  'prefs.annualReturn': 'Rendimento Annuo',
  'prefs.annualInflation': 'Inflazione Annua',
  'prefs.horizonYears': 'Orizzonte (Anni)',
  'prefs.valueMode': 'Modalità Valore Proiettato',
  'prefs.includeEmployer':
    'Includi contributo aziendale {label} ({rate}%) nella crescita stimata',
  'prefs.privacyTitle': 'Guida Iniziale, Scorciatoie e Privacy Sessione',
  'prefs.privacyDesc':
    'L’ultimo stipendio inserito, le preferenze e i confronti salvati restano memorizzati localmente nel browser (mai inviati a nessun server).',
  'prefs.showWelcomeTitle': 'Mostra Guida di Benvenuto all’Avvio',
  'prefs.showWelcomeDesc':
    'Visualizza automaticamente la panoramica rapida all’apertura di PocketWage.',
  'prefs.previewGuide': 'Anteprima Guida',
  'prefs.shortcutsTitle': 'Riferimento Scorciatoie da Tastiera',
  'prefs.shortcutsDesc':
    'Visualizza navigazione (Ctrl+1..4) e tasti di azione rapida.',
  'prefs.viewShortcuts': 'Vedi Scorciatoie',
  'prefs.clearAmountsTitle': 'Cancella Importi della Sessione',
  'prefs.clearAmountsDesc':
    'Elimina subito stipendi inseriti, trattenute, confronti e risparmi iniziali.',
  'prefs.clearAllAmounts': 'Azzera Tutti gli Importi',

  // Cross-Device Cloud Sync (Optional)
  'sync.title': 'Sincronizzazione Multi-Dispositivo (Opzionale)',
  'sync.desc':
    'Per impostazione predefinita i dati restano solo su questo browser. Attiva questa opzione per accedere con Google e sincronizzare i tuoi dati.',
  'sync.toggleLabel': 'Abilita sincronizzazione tra dispositivi',
  'sync.signInGoogle': 'Accedi con Google',
  'sync.signingIn': 'Accesso in corso...',
  'sync.signOut': 'Esci e usa solo locale',
  'sync.syncNow': 'Sincronizza Ora',
  'sync.syncing': 'Sincronizzazione...',
  'sync.synced': 'Sincronizzato tra dispositivi',
  'sync.localOnly': 'Solo locale',
  'sync.askSyncBtn': 'Sincronizza dispositivi',
  'sync.signedInAs': 'Accesso effettuato: {email}',
  'sync.freeNote': 'Piano gratuito Firebase Spark · Privato sul tuo account Google',

  // PDF Report & Print
  'pdf.previewTitle': 'Anteprima Report PDF Stampabile',
  'pdf.previewHint':
    'A4 Verticale · Seleziona "Salva come PDF" come destinazione nella finestra di stampa',
  'pdf.saveHtml': 'Salva HTML',
  'pdf.printSavePdf': 'Stampa / Salva come PDF',
  'pdf.closePreview': 'Chiudi anteprima PDF',
  'pdf.reportTitle': 'Report Dettagliato Stipendio e Netto in Busta',
  'pdf.generated': 'Generato il {date}',
  'pdf.annualNet': 'Netto Annuale in Busta',
  'pdf.annualGross': 'Lordo Imponibile Annuale',
  'pdf.annualTaxLevies': 'Imposte e Contributi Annuali',
  'pdf.annualRetirement': '{label} Annuale',
  'pdf.grossPayAllocation': 'Ripartizione dello Stipendio Lordo',
  'pdf.payBreakdownByPeriod': 'Dettaglio Retribuzione per Periodo ({currency})',
  'pdf.annualDeductionSummary': 'Riepilogo Annuale Trattenute',
  'pdf.totalAnnualDeductions': 'Totale Annuale Imposte e Trattenute',
  'pdf.netAnnualTakeHomeCash': 'Netto Annuale Effettivo',

  // Quick Tutorial
  'tour.badge': 'Tutorial Rapido · Passo {current} di {total}',
  'tour.exit': 'Esci dal Tutorial',
  'tour.back': 'Indietro',
  'tour.next': 'Avanti',
  'tour.finish': 'Fine',
  'tour.step1Title': '1. Inserisci Qualsiasi Importo',
  'tour.step1Desc':
    'Scegli Tempo Pieno, Part-Time o Casual e inserisci un importo su 6 periodi (da orario ad annuale) con aggiornamento immediato.',
  'tour.step2Title': '2. Converti Valute e Fissa Preferite',
  'tour.step2Desc':
    'Seleziona una valuta di destinazione per vedere lordo e netto convertiti con tassi reali e fissa fino a 5 valute preferite.',
  'tour.step3Title': '3. Contratto, Turni e Regole Fiscali',
  'tour.step3Desc':
    'Scegli tra 26 paesi (2026–2027), regola maggiorazione casual, straordinari, weekend, soglia esente e OTE.',
  'tour.step4Title': '4. Riepilogo, Ferie ed Esportazione CSV / PDF',
  'tour.step4Desc':
    'Controlla tutti i 6 periodi, ferie pro-quota e previdenza OTE qui sotto, oppure esporta in CSV / PDF.',
  'tour.step5Title': '5. Confronta Offerte, Pensione e Supporto',
  'tour.step5Desc':
    'Cambia scheda (Ctrl+1..4) per confrontare aumenti, pianificare la pensione, cambiare lingua o supportare via Stripe.',

  // Welcome Modal & Offline
  'welcome.title': 'Benvenuto in PocketWage',
  'welcome.subtitle':
    'Stipendio netto globale, turni casual/straordinari, confronto offerte e pensione in 26 paesi.',
  'welcome.getStarted': 'Inizia',
  'welcome.shortcuts': 'Scorciatoie',
  'welcome.guideCalcTitle': '01. Calcolatore Stipendio, Casual e Turni',
  'welcome.guideCalcAction': 'Apri Calcolatore',
  'welcome.guideCalcDesc':
    'Tempo Pieno, Part-Time o Casual su 6 frequenze di paga, maggiorazioni weekend/festivi, previdenza OTE e ferie.',
  'welcome.guideCompareTitle': '02. Confronto Aumenti e Nuove Offerte',
  'welcome.guideCompareAction': 'Confronta Offerte',
  'welcome.guideCompareDesc':
    'Confronta stipendio attuale e nuova offerta con importo diretto o percentuale (+5% a +25%).',
  'welcome.guideRetireTitle': '03. Proiezioni Pensionistiche',
  'welcome.guideRetireAction': 'Pianifica Pensione',
  'welcome.guideRetireDesc':
    'Simula la crescita composta su 1–50 anni in valore futuro o potere d’acquisto odierno.',
  'welcome.localSavedNote':
    'Salvato localmente nel browser — premi Azzera Importi in qualsiasi momento.',
  'welcome.supportLink': 'Supporta PocketWage via Stripe',
  'offline.banner': 'Modalità Offline — App in cache pronta',

  // Supporter Tips (Stripe)
  'support.button': 'Mancia / Supporta',
  'support.modalTitle': 'Supporta PocketWage',
  'support.modalSubtitle':
    'PocketWage è gratuito. Lascia un contributo opzionale con Stripe Checkout per sostenere gli aggiornamenti fiscali.',
  'support.chooseAmount': 'Scegli un importo ({currency})',
  'support.customAmount': 'Importo personalizzato',
  'support.payButton': 'Continua su Stripe ({amount})',
  'support.redirecting': 'Connessione a Stripe Checkout...',
  'support.notConfiguredTitle': 'Stripe Checkout non è ancora configurato',
  'support.notConfiguredDesc':
    'Aggiungi STRIPE_SECRET_KEY nei Secrets del server (o VITE_STRIPE_DONATION_URL) per ricevere contributi.',
  'support.thankYouNotice':
    'Grazie per aver supportato PocketWage! Contributo Stripe completato.',
  'support.cancelledNotice':
    'Checkout Stripe annullato — nessun addebito effettuato.',
  'support.secureNote': 'Pagamento sicuro tramite Stripe · Facoltativo',
  'support.errorGeneric':
    'Impossibile avviare Stripe Checkout ora. Riprova.',

  // Notices
  'notice.amountsCleared': 'Tutti gli importi di stipendio e risparmio azzerati',
  'notice.languageChanged': 'Lingua impostata su {name}',
  'notice.comparisonSaved': 'Confronto "{name}" salvato in locale',
  'notice.comparisonLoaded': 'Confronto "{name}" caricato',
  'notice.syncEnabled': 'Accesso come {name} — sincronizzazione attivata',
  'notice.syncDisabled': 'Disconnesso — modalità solo locale attiva',
  'notice.syncedNow': 'Dati sincronizzati nel cloud',

  // Legal & Policies
  'legal.privacyPolicy': 'Informativa sulla Privacy',
  'legal.termsConditions': 'Termini e Condizioni',
  'legal.footerNotice': 'PocketWage · Stime salariali e previdenziali locali',
  'legal.disclaimer':
    'Nota: I nostri calcolatori forniscono esclusivamente stime informative generali e non costituiscono consulenza finanziaria, fiscale, legale o contabile.',
  'legal.effectiveDate': 'Ultimo aggiornamento: 15 novembre 2026',
  'legal.close': 'Chiudi',
  'legal.summaryTitle': 'Documenti Legali e Privacy',
  'legal.summaryDesc':
    'Scopri come PocketWage protegge i tuoi dati in locale e i termini che regolano le stime.',

  // Partner & Referral Integrations
  'calc.exportTaxApp': 'Esporta Fiscale',
  'partner.superPrompt':
    'Scopri come consolidare o versare volontariamente in un fondo {label} o ETF a basse commissioni influisce sul tuo saldo pensionistico.',
  'partner.openRetirement': 'Piano Pensione',
  'partner.disclosure':
    'Link partner · PocketWage può ricevere una commissione senza costi aggiuntivi per te',
  'partner.novatedToggle': 'Confronta Risparmio Novated Lease',
  'partner.novatedDesc':
    'Stima il risparmio fiscale pre-tasse e invia il tuo stipendio lordo a un partner di leasing.',
  'partner.novatedPartnersTitle':
    'Confronta preventivi novated lease con il tuo lordo di {gross}',
  'partner.novatedNote':
    'Le stime presuppongono regole pre-tasse idonee ed escludono commissioni finanziarie',
  'partner.taxModalTitle': 'Esporta Riepilogo Fiscale Annuale',
  'partner.taxPartnersHeading': 'Continua con un Software Fiscale e Contabile',
  'partner.taxModalPrivacy':
    'Solo importi aggregati vengono passati se apri un link partner — PocketWage può ricevere una commissione senza costi per te.',
};
