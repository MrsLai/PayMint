import { TranslationDictionary } from './en';

export const fr: TranslationDictionary = {
  // Navigation & Global Actions
  'nav.calculator': 'Calculateur',
  'nav.compare': 'Comparer Offre',
  'nav.compareCompact': 'Comparer',
  'nav.retirement': 'Retraite',
  'nav.retirementMobile': 'Retraite',
  'nav.calculateMobile': 'Calculer',
  'nav.settings': 'Paramètres',
  'nav.install': 'Installer',
  'nav.share': 'Partager',
  'nav.clearAmounts': 'Effacer Montants',
  'nav.skipToMain': 'Aller au contenu principal',
  'nav.openGuide': 'Comment utiliser PocketWage',
  'nav.shortcutsLabel': 'Raccourcis clavier',

  // Periods
  'period.Hourly': 'Horaire',
  'period.Daily': 'Journalier',
  'period.Weekly': 'Hebdomadaire',
  'period.Fortnightly': 'Bimensuel',
  'period.Monthly': 'Mensuel',
  'period.Annual': 'Annuel',

  // Calculator View
  'calc.heroTitle': 'Calculateur de Salaire Brut en Net',
  'calc.quickTour': 'Visite Guidée',
  'calc.retirementBtn': 'Retraite',
  'calc.compareOfferBtn': 'Comparer Augmentation / Offre',
  'calc.perOrdinaryHour': 'Par heure normale',
  'calc.workdayHours': 'Journée de {hours}h',
  'calc.perWeek': 'Base hebdomadaire',
  'calc.perFortnight': 'Toutes les 2 semaines',
  'calc.perCalendarMonth': 'Par mois civil',
  'calc.weeksPerYear': '{weeks} semaines / an',
  'calc.loadedHourly': 'Majoré : {rate}/h (+{pct}%)',
  'calc.employmentType': 'Statut d’emploi',
  'calc.fullTime': 'Temps Plein',
  'calc.partTime': 'Temps Partiel',
  'calc.casual': 'Occasionnel (Casual)',
  'calc.agreedWeeklyHours': 'Heures Hebdo Convenues',
  'calc.fortnightlyEquiv': '{hours}h / 2 sem.',
  'calc.casualLoading': 'Majoration Casual',
  'calc.taxFreeThreshold': 'Seuil Exonéré ($18,200)',
  'calc.shiftsOvertimeToggle': 'Heures Sup., Week-end & Jours Fériés',
  'calc.shiftsOvertimeDesc':
    'Heures supplémentaires, majorations week-end et méthode cumulée vs composée',
  'calc.saturdayHours': 'Samedi (h/sem)',
  'calc.sundayHours': 'Dimanche (h/sem)',
  'calc.publicHolidayHours': 'Jour Férié (h/sem)',
  'calc.overtimeHours': 'Heures Sup. (h/sem)',
  'calc.casualPenaltyRule': 'Règle Majoration Casual',
  'calc.compounding': 'Composée (125% × Maj.)',
  'calc.cumulative': 'Cumulée (+25% + Maj.)',
  'calc.casualPhNote':
    'Casual : non payé si non travaillé ; {mult}x si travaillé un jour férié.',
  'calc.leaveTitle': 'Congés Acquis & Retraite OTE',
  'calc.annualLeaveEst': 'Congés Payés Annuels',
  'calc.personalLeaveEst': 'Congés Maladie / Perso',
  'calc.leaveCasualNone': 'Aucun — couvert par la majoration de {pct}%',
  'calc.leaveHoursYr': '{hrs}h / an',
  'calc.oteSuperLabel': '{label} sur OTE ({ote})',
  'calc.overtimeExclNote': 'Heures sup. ({ot}) exclues de l’OTE',
  'calc.beforeTaxGross': 'Avant impôts (brut)',
  'calc.totalPackageIncl': 'Package total (incl. {label})',
  'calc.cashTakeHome': 'Salaire Net en Poche',
  'calc.taxShort': 'Impôts',
  'calc.countryRulesLabel': 'Règles Fiscales et {label}',
  'calc.latestPct': 'Dernier {pct}%',
  'calc.onTop': '+ En sus',
  'calc.included': 'Inclus',
  'calc.workSchedule': 'Temps de Travail',
  'calc.privateHealth': 'Mutuelle Santé',
  'calc.optional': 'Optionnel',
  'calc.autoSynced': 'Synchronisé · Règles {year} et {label}',
  'calc.syncLatestRules': 'Appliquer Règles ({year})',
  'calc.dependents': 'Personnes à charge (₫6.2M/mois) :',
  'calc.effectiveTaxRate': 'Taux Effectif :',
  'calc.marginal': 'Marginal :',
  'calc.summaryTitle': 'Résumé Complet du Salaire et des Retenues',
  'calc.summaryEmpty':
    'Saisissez un montant ci-dessus pour afficher le détail complet brut et net',
  'calc.takeHomeRatio': 'Part nette :',
  'calc.downloadCsv': 'Télécharger CSV',
  'calc.exportPdf': 'Exporter PDF',
  'calc.colPeriod': 'Période',
  'calc.colGross': 'Brut (Avant Impôts)',
  'calc.colTaxLevies': 'Impôts et Taxes',
  'calc.colAfterTax': 'Après Impôts',
  'calc.colPhiOther': 'Mutuelle & Autres',
  'calc.colConverted': 'Converti ({code})',
  'calc.paidOnTop': '(payé en plus)',
  'calc.includedInPackage': '(inclus dans le package)',

  // Proportion Chart
  'chart.title': 'Répartition Impôts vs. Salaire Net',
  'chart.subtitle':
    'Part de votre rémunération {period} ({currency}) entre salaire net, impôts et {label}.',
  'chart.empty':
    'Saisissez un salaire horaire, journalier, hebdomadaire, bimensuel, mensuel ou annuel ci-dessus.',
  'chart.incomeTax': 'Impôt sur le Revenu',
  'chart.totalPackage': 'Package Total {period} (incl. {label})',

  // Currency Converter
  'currency.title': 'Convertisseur de Devises',
  'currency.retirementTitle': 'Convertisseur Retraite',
  'currency.subtitleCalc':
    'Convertissez votre salaire brut et net en {currency} vers une autre devise',
  'currency.subtitleCompare':
    'Convertissez votre salaire actuel, cible et gain de {currency} vers une autre devise',
  'currency.subtitleRetirement':
    'Convertissez votre capital retraite et revenu mensuel à 4 % de {currency} vers une autre devise',
  'currency.offOption': 'Désactivé ({currency} seul) — Choisir devise',
  'currency.pinnedFavorites': 'Favoris Épinglés ({count}/{max})',
  'currency.allCurrencies': 'Toutes les Devises',
  'currency.pin': 'Épingler',
  'currency.pinned': 'Épinglée',

  // Payrise Compare
  'compare.heroTitle': "Comparateur d'Augmentation et d'Offre",
  'compare.heroSubtitle':
    'Comparez votre salaire actuel face à une augmentation ou une nouvelle offre ({currency}) selon les règles {authority}.',
  'compare.currentPay': 'Salaire Actuel',
  'compare.targetOffer': 'Cible / Nouvelle Offre',
  'compare.targetIncreasePct': 'Augmentation Cible (%)',
  'compare.netGainAnnual': 'Gain Net Annuel',
  'compare.netGainMonthly': 'Gain Net Mensuel',
  'compare.netGainHourly': 'Gain Net Horaire',
  'compare.savedTitle': "Comparaisons d'Offres Enregistrées",
  'compare.savedDesc':
    'Stockées localement dans votre navigateur pour retrouver et comparer vos offres à tout moment.',
  'compare.savePlaceholder': "Nom de l'offre (ex. Poste Senior chez Acme)",
  'compare.saveBtn': 'Enregistrer',
  'compare.loadBtn': 'Charger',
  'compare.deleteBtn': 'Supprimer',
  'compare.clearSavedBtn': 'Tout Effacer',
  'compare.savedEmpty':
    'Aucune comparaison enregistrée. Saisissez les montants ci-dessus puis cliquez sur Enregistrer.',
  'compare.savedBadge': 'Sauvegardé localement',

  // Retirement Projections
  'retirement.heroTitle': 'Projections de Patrimoine Retraite',
  'retirement.futureValue': 'Valeur Future',
  'retirement.todaysMoney': "Euros d'Aujourd'hui",

  // Global Settings
  'settings.title': 'Paramètres',
  'settings.subtitle':
    'Gérez la langue, les règles fiscales par pays, le thème, les couleurs d’accentuation et vos préférences en un seul endroit.',
  'settings.languageLabel': 'Langue',
  'settings.tabTax': 'Impôts & Retraite',
  'settings.tabTaxDesc': 'Juridiction fiscale, barèmes et taux de retraite',
  'settings.tabTheme': 'Thème & Apparence',
  'settings.tabThemeDesc': 'Mode Clair, Sombre, Minuit et couleurs d’accent',
  'settings.tabPrefs': 'Préférences & Défauts',
  'settings.tabPrefsDesc':
    'Langue, horaire, devises favorites, retraite et vie privée',

  // Tax Settings
  'tax.title': 'Règles Fiscales et Retraite par Pays',
  'tax.resetAustralia': 'Réinitialiser (Australie)',
  'tax.selectCountry': 'Sélectionner la Juridiction Fiscale',
  'tax.collapseAll': 'Tout Réduire',
  'tax.expandAll': 'Tout Développer',

  // Theme Settings
  'theme.title': 'Paramètres de Thème et d’Apparence',
  'theme.resetDefault': 'Réinitialiser par Défaut',
  'theme.displayMode': "Mode d'Affichage",
  'theme.displayModeDesc':
    'Choisissez Clair standard, Sombre doux ou Minuit haut contraste pour écrans OLED.',
  'theme.accentColor': "Palette de Couleurs d'Accent",
  'theme.accentColorDesc':
    'Choisissez une couleur d’accentuation pour les boutons, onglets actifs et graphiques.',

  // Preferences Settings
  'prefs.title': 'Préférences et Paramètres par Défaut',
  'prefs.subtitle':
    'Personnalisez la langue, le rythme de travail, les devises favorites, les hypothèses retraite et le démarrage.',
  'prefs.languageTitle': "Langue de l'Interface",
  'prefs.languageDesc':
    'Choisissez la langue d’affichage pour la navigation, le calculateur, les paramètres et les rapports.',
  'prefs.scheduleTitle': 'Horaire de Travail et Base de Calcul',
  'prefs.scheduleDesc':
    'Utilisé pour synchroniser les taux horaire, journalier, mensuel et annuel.',
  'prefs.resetSchedule': 'Réinitialiser Horaire ({code})',
  'prefs.hoursPerDay': 'Heures par Jour',
  'prefs.daysPerWeek': 'Jours par Semaine',
  'prefs.weeksPerYear': 'Semaines Payées / An',
  'prefs.activeInputPeriod': 'Période de Saisie Active',
  'prefs.currencyTitle': 'Convertisseur & Devises Épinglées',
  'prefs.currencyDesc':
    'Épinglez jusqu’à {max} devises ({count}/{max} épinglées) pour les garder en haut des listes.',
  'prefs.clearPinned': 'Effacer Épinglées',
  'prefs.activeConversionCurrency': 'Devise de Conversion Active',
  'prefs.offCurrencyOnly': 'Désactivé ({currency} seul)',
  'prefs.pinFavoriteCurrencies': 'Épingler des Devises Favorites ({count}/{max})',
  'prefs.retirementTitle': 'Hypothèses de Projection Retraite',
  'prefs.retirementDesc':
    'Ajustez le taux d’épargne, rendement attendu, inflation, horizon et mode de calcul.',
  'prefs.resetAssumptions': 'Réinitialiser Hypothèses',
  'prefs.savingsRate': "Taux d'Épargne (% du Net)",
  'prefs.annualReturn': 'Rendement Annuel',
  'prefs.annualInflation': 'Inflation Annuelle',
  'prefs.horizonYears': 'Horizon (Années)',
  'prefs.valueMode': 'Mode de Valeur Projetée',
  'prefs.includeEmployer':
    'Inclure la cotisation employeur {label} ({rate}%) dans la croissance projetée',
  'prefs.privacyTitle': 'Accueil, Raccourcis et Confidentialité',
  'prefs.privacyDesc':
    'Votre dernier salaire saisi, vos préférences et vos comparaisons enregistrées restent stockés localement dans votre navigateur (jamais envoyés sur un serveur).',
  'prefs.showWelcomeTitle': "Afficher le Guide d'Accueil au Démarrage",
  'prefs.showWelcomeDesc':
    'Afficher automatiquement l’aperçu de démarrage rapide à l’ouverture de PocketWage.',
  'prefs.previewGuide': 'Voir le Guide',
  'prefs.shortcutsTitle': 'Référence des Raccourcis Clavier',
  'prefs.shortcutsDesc':
    'Afficher la navigation (Ctrl+1..4) et les raccourcis d’action rapide.',
  'prefs.viewShortcuts': 'Voir Raccourcis',
  'prefs.clearAmountsTitle': 'Effacer les Montants de Session',
  'prefs.clearAmountsDesc':
    'Effacez immédiatement les salaires, déductions, comparaisons et épargne saisis.',
  'prefs.clearAllAmounts': 'Tout Effacer',

  // Cross-Device Cloud Sync (Optional)
  'sync.title': 'Synchronisation Multi-Appareils (Optionnel)',
  'sync.desc':
    'Par défaut, vos données restent sur ce navigateur uniquement. Activez cette option pour utiliser Google Sign-In et synchroniser vos données.',
  'sync.toggleLabel': 'Activer la synchronisation multi-appareils',
  'sync.signInGoogle': 'Se connecter avec Google',
  'sync.signingIn': 'Connexion...',
  'sync.signOut': 'Se déconnecter et rester en local',
  'sync.syncNow': 'Synchroniser',
  'sync.syncing': 'Synchronisation...',
  'sync.synced': 'Synchronisé entre appareils',
  'sync.localOnly': 'Local uniquement',
  'sync.askSyncBtn': 'Synchroniser',
  'sync.signedInAs': 'Connecté : {email}',
  'sync.freeNote': 'Offre gratuite Firebase Spark · Privé sur votre compte Google',

  // PDF Report & Print
  'pdf.previewTitle': 'Aperçu du Rapport PDF Imprimable',
  'pdf.previewHint':
    'A4 Portrait · Sélectionnez « Enregistrer au format PDF » comme destination d’impression',
  'pdf.saveHtml': 'Enregistrer HTML',
  'pdf.printSavePdf': 'Imprimer / Enregistrer PDF',
  'pdf.closePreview': "Fermer l'aperçu PDF",
  'pdf.reportTitle': 'Rapport de Salaire et Revenu Net',
  'pdf.generated': 'Généré le {date}',
  'pdf.annualNet': 'Salaire Net Annuel',
  'pdf.annualGross': 'Brut Imposable Annuel',
  'pdf.annualTaxLevies': 'Impôts & Taxes Annuels',
  'pdf.annualRetirement': '{label} Annuel',
  'pdf.grossPayAllocation': 'Répartition du Salaire Brut',
  'pdf.payBreakdownByPeriod': 'Détail par Période ({currency})',
  'pdf.annualDeductionSummary': 'Résumé Annuel des Retenues',
  'pdf.totalAnnualDeductions': 'Total Annuel Impôts & Retenues',
  'pdf.netAnnualTakeHomeCash': 'Salaire Net Annuel en Poche',

  // Quick Tutorial
  'tour.badge': 'Tutoriel Rapide · Étape {current} sur {total}',
  'tour.exit': 'Quitter',
  'tour.back': 'Retour',
  'tour.next': 'Suivant',
  'tour.finish': 'Terminer',
  'tour.step1Title': '1. Saisissez un Montant',
  'tour.step1Desc':
    'Choisissez Temps Plein, Partiel ou Casual puis saisissez un tarif sur 6 périodes (horaire à annuel) avec calcul immédiat.',
  'tour.step2Title': '2. Convertissez les Devises',
  'tour.step2Desc':
    'Choisissez une devise cible pour convertir brut et net en temps réel, et épinglez jusqu’à 5 favoris.',
  'tour.step3Title': '3. Personnalisez Statut, Shifts & Impôts',
  'tour.step3Desc':
    'Basculez entre 26 pays (2026–2027), ajustez majoration casual, heures sup., week-ends et retraite OTE.',
  'tour.step4Title': '4. Résumé, Congés & Export CSV / PDF',
  'tour.step4Desc':
    'Consultez les 6 périodes, les congés au prorata et la retraite OTE ci-dessous, puis exportez en CSV / PDF.',
  'tour.step5Title': '5. Comparateur, Retraite & Soutien',
  'tour.step5Desc':
    'Changez d’onglet (Ctrl+1..4) pour comparer des offres, simuler la retraite, changer de langue ou soutenir via Stripe.',

  // Welcome Modal & Offline
  'welcome.title': 'Bienvenue sur PocketWage',
  'welcome.subtitle':
    'Salaire net mondial, majorations casual/supplémentaires, comparateur d’offres et retraite sur 26 pays.',
  'welcome.getStarted': 'Commencer',
  'welcome.shortcuts': 'Raccourcis',
  'welcome.guideCalcTitle': '01. Calculateur Salaire, Casual & Heures Sup.',
  'welcome.guideCalcAction': 'Ouvrir Calculateur',
  'welcome.guideCalcDesc':
    'Temps Plein, Partiel ou Casual sur 6 fréquences de paie, majorations week-end/fériés, retraite OTE et estimation de congés.',
  'welcome.guideCompareTitle': '02. Comparateur d’Augmentation & Offres',
  'welcome.guideCompareAction': 'Comparer Offres',
  'welcome.guideCompareDesc':
    'Comparez votre salaire actuel à une nouvelle offre ou un pourcentage (+5% à +25%) pour voir le gain net réel.',
  'welcome.guideRetireTitle': '03. Projections Retraite',
  'welcome.guideRetireAction': 'Planifier Retraite',
  'welcome.guideRetireDesc':
    'Simulez la croissance composée sur 1–50 ans en valeur future ou pouvoir d’achat d’aujourd’hui.',
  'welcome.localSavedNote':
    'Enregistré localement dans votre navigateur — cliquez sur Effacer à tout moment.',
  'welcome.supportLink': 'Soutenir PocketWage via Stripe',
  'offline.banner': 'Mode Hors Ligne — Application prête en cache',

  // Supporter Tips (Stripe)
  'support.button': 'Pourboire / Soutien',
  'support.modalTitle': 'Soutenir PocketWage',
  'support.modalSubtitle':
    'PocketWage est gratuit. Laissez un don facultatif via Stripe Checkout pour soutenir les mises à jour fiscales.',
  'support.chooseAmount': 'Choisir un montant ({currency})',
  'support.customAmount': 'Montant libre',
  'support.payButton': 'Continuer vers Stripe ({amount})',
  'support.redirecting': 'Connexion à Stripe Checkout...',
  'support.notConfiguredTitle': 'Stripe Checkout n’est pas encore configuré',
  'support.notConfiguredDesc':
    'Ajoutez STRIPE_SECRET_KEY dans vos Secrets serveur (ou VITE_STRIPE_DONATION_URL) pour accepter des dons.',
  'support.thankYouNotice':
    'Merci pour votre soutien à PocketWage ! Paiement Stripe confirmé.',
  'support.cancelledNotice':
    'Paiement Stripe annulé — aucun débit effectué.',
  'support.secureNote': 'Paiement sécurisé par Stripe · Facultatif',
  'support.errorGeneric':
    'Impossible de démarrer Stripe Checkout pour le moment.',

  // Notices
  'notice.amountsCleared': 'Tous les montants saisis ont été effacés',
  'notice.languageChanged': 'Langue changée en {name}',
  'notice.comparisonSaved': 'Comparaison « {name} » enregistrée localement',
  'notice.comparisonLoaded': 'Comparaison « {name} » chargée',
  'notice.syncEnabled': 'Connecté en tant que {name} — synchronisation activée',
  'notice.syncDisabled': 'Déconnecté — retour au stockage local uniquement',
  'notice.syncedNow': 'Espace synchronisé dans le cloud',

  // Legal & Policies
  'legal.privacyPolicy': 'Politique de Confidentialité',
  'legal.termsConditions': 'Conditions d’Utilisation',
  'legal.footerNotice': 'PocketWage · Estimations salariales et retraite locales',
  'legal.disclaimer':
    'Remarque : Nos calculateurs fournissent uniquement des estimations informatives générales et ne constituent pas un conseil financier, fiscal, juridique ou comptable.',
  'legal.effectiveDate': 'Dernière mise à jour : 15 novembre 2026',
  'legal.close': 'Fermer',
  'legal.summaryTitle': 'Documents Légaux et Confidentialité',
  'legal.summaryDesc':
    'Consultez comment PocketWage protège vos données localement et les conditions d’utilisation.',

  // Partner & Referral Integrations
  'calc.exportTaxApp': 'Export Fiscal',
  'partner.superPrompt':
    'Découvrez comment le regroupement ou le versement volontaire dans un fonds {label} ou ETF à frais réduits augmente votre retraite.',
  'partner.openRetirement': 'Plan Retraite',
  'partner.disclosure':
    'Lien partenaire · PocketWage peut percevoir une commission sans frais pour vous',
  'partner.novatedToggle': 'Comparer les Économies Novated Lease',
  'partner.novatedDesc':
    'Estimez l’économie fiscale avant impôt et transmettez votre salaire brut à un partenaire de leasing.',
  'partner.novatedPartnersTitle':
    'Comparer les devis novated lease avec votre salaire brut de {gross}',
  'partner.novatedNote':
    'Estimations basées sur les règles avant impôt applicables, hors frais de financement',
  'partner.taxModalTitle': 'Exporter le Résumé Fiscal Annuel',
  'partner.taxPartnersHeading': 'Poursuivre avec un Logiciel Fiscal & Comptable',
  'partner.taxModalPrivacy':
    'Seuls des montants agrégés sont transmis si vous ouvrez un lien partenaire — PocketWage peut percevoir une commission sans surcoût.',
};
