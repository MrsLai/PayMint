import { LanguageCode } from '../i18n';

export type LegalDocTab = 'privacy' | 'terms';

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDocumentBundle {
  privacy: LegalSection[];
  terms: LegalSection[];
}

const EN_LEGAL: LegalDocumentBundle = {
  privacy: [
    {
      heading: '01. Local-First Browser Storage (Default)',
      body: [
        'By default, PocketWage operates entirely inside your browser. Your last entered salary, pay frequency, country tax and retirement rules, theme, language preference, and saved job-offer comparisons are stored strictly in your own browser’s localStorage.',
        'You can remove entered figures at any time using Clear Amounts, delete individual or all saved comparisons, or clear your browser site data.',
      ],
    },
    {
      heading: '02. Optional Cross-Device Sync (Opt-In Only)',
      body: [
        'Cloud synchronization is disabled by default and is never required to use PocketWage. Only if you explicitly enable Cross-Device Sync and sign in with Google via Firebase Authentication does PocketWage sync your salary workspace and saved job-offer comparisons to Google Cloud Firestore.',
        'Synced records are stored privately under your authenticated user ID (`users/{userId}`) and isolated via Firestore Security Rules so only your verified account can read or write them. PocketWage does not write your email address or display name into Firestore documents.',
        'You can click "Sign out & stay local" at any time to stop cloud sync while keeping your data locally in your browser.',
      ],
    },
    {
      heading: '03. External Network Requests & Third-Party Services',
      body: [
        'Live Currency Exchange Rates: When you select a conversion currency, your browser requests public exchange rate tables directly from open.er-api.com. Salary amounts and personal details are never sent in that request.',
        'Offline PWA Cache & Typography: Static application files and display fonts (Plus Jakarta Sans and JetBrains Mono) may be cached locally by the service worker to support offline calculations.',
        'Firebase Infrastructure: Optional sign-in, cloud sync, and optional bot-protection checks rely on Google Firebase services subject to Google’s Privacy Policy.',
      ],
    },
    {
      heading: '04. No Advertising Trackers, Data Sales & Optional Partner Links',
      body: [
        'PocketWage does not run third-party advertising trackers, behavioral profiling scripts, or analytics brokers, and we never sell or rent user data.',
        'Optional Partner & Referral Links: Certain optional callouts (such as superannuation/ETF platforms, novated lease quote providers, and tax software exports) contain referral links. If you choose to click an external partner link, anonymized aggregate salary or tax figures may be included in the destination URL query string and PocketWage may earn a referral commission at no cost to you. External partner sites are governed by their own privacy policies.',
      ],
    },
    {
      heading: '05. Managing or Deleting Your Data',
      body: [
        'Local Data: Use "Clear Amounts" in the top bar or Preferences, use "Clear Saved" in Payrise Compare, or clear site storage in your browser settings.',
        'Cloud Data: While signed in, deleting saved comparisons removes them from Firestore immediately. You may also sign out to return to local-only storage.',
      ],
    },
  ],
  terms: [
    {
      heading: '01. Acceptance of Terms',
      body: [
        'By accessing or using PocketWage, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue using the application.',
      ],
    },
    {
      heading: '02. Estimates Only — Not Financial, Tax, or Legal Advice',
      body: [
        'All salary breakdowns, income tax calculations, levies, superannuation/retirement contributions, novated lease tax-saving estimates, payrise comparisons, and compound wealth projections provided by PocketWage are mathematical estimates for informational and personal planning purposes only.',
        'Tax scales, thresholds, deductions, and statutory contribution rules change over time and vary by individual circumstances. PocketWage does not provide financial, tax, accounting, or legal advice. Always verify important decisions with a qualified accountant, financial adviser, or official tax authority (such as the ATO, IRS, or HMRC).',
      ],
    },
    {
      heading: '03. Currency Rates, Partner Links & Third-Party Availability',
      body: [
        'Reference exchange rates come from third-party public feeds and built-in fallback baselines; they may differ from bank, payroll, or foreign-exchange provider execution rates.',
        'Third-Party Financial Partners: Any links to superannuation, ETF, novated leasing, or tax software providers are informational referrals and not endorsements or personal financial recommendations. PocketWage may receive affiliate compensation if you engage with a partner.',
        'Optional Cross-Device Sync operates on Google Firebase’s free Spark tier, which enforces daily usage quotas. If daily quotas are exhausted, cloud sync pauses temporarily until Google’s quota resets, while local browser storage remains available.',
      ],
    },
    {
      heading: '04. Acceptable Use',
      body: [
        'You agree to use PocketWage lawfully and not to attempt unauthorized access, automated scraping, denial-of-service traffic, or bypassing security controls on our hosting or Firebase infrastructure.',
      ],
    },
    {
      heading: '05. Disclaimer of Warranties & Limitation of Liability',
      body: [
        'PocketWage is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including accuracy, completeness, fitness for a particular purpose, or uninterrupted availability.',
        'To the maximum extent permitted by applicable law, PocketWage and its creators shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from reliance on calculator estimates, exported CSV/PDF files, or temporary service interruptions.',
      ],
    },
    {
      heading: '06. Updates to These Terms',
      body: [
        'We may update the Privacy Policy or Terms and Conditions as features, third-party integrations, or tax regulations evolve. Continued use of PocketWage after updates constitutes acceptance of the revised terms.',
      ],
    },
  ],
};

const ES_LEGAL: LegalDocumentBundle = {
  privacy: [
    {
      heading: '01. Almacenamiento Local por Defecto',
      body: [
        'Por defecto, PocketWage funciona íntegramente en tu navegador. Tu último salario ingresado, frecuencia, reglas fiscales, idioma, tema y comparaciones guardadas se almacenan exclusivamente en el localStorage de tu navegador.',
        'Puedes borrar los montos en cualquier momento con "Borrar Montos" o limpiar los datos del sitio en tu navegador.',
      ],
    },
    {
      heading: '02. Sincronización en la Nube Opcional',
      body: [
        'La sincronización entre dispositivos está desactivada por defecto. Solo si la activas explícitamente e inicias sesión con Google (Firebase Authentication), PocketWage sincronizará tu espacio de trabajo y comparaciones guardadas de forma privada bajo tu UID en Cloud Firestore.',
        'PocketWage no guarda tu correo electrónico dentro de Firestore y puedes cerrar sesión en cualquier momento para volver al modo 100 % local.',
      ],
    },
    {
      heading: '03. Servicios de Terceros y Tasas de Cambio',
      body: [
        'Al elegir una moneda de conversión, tu navegador consulta tasas públicas en open.er-api.com sin enviar tus montos salariales ni datos personales. Las fuentes tipográficas y recursos PWA se almacenan en caché para uso sin conexión.',
      ],
    },
    {
      heading: '04. Sin Rastreadores Publicitarios',
      body: [
        'PocketWage no utiliza rastreadores publicitarios de terceros ni vende o comparte datos de usuarios.',
      ],
    },
  ],
  terms: [
    {
      heading: '01. Solo Estimaciones — Sin Asesoramiento Fiscal o Financiero',
      body: [
        'Los cálculos de impuestos, aportes de retiro, conversiones de moneda y proyecciones de PocketWage son estimaciones informativas basadas en parámetros generales 2026–2027 y los datos ingresados.',
        'No constituyen asesoramiento fiscal, contable, legal ni financiero. Verifica siempre las cifras oficiales con un profesional o autoridad tributaria.',
      ],
    },
    {
      heading: '02. Disponibilidad y Cuotas Gratuitas',
      body: [
        'La sincronización opcional utiliza el plan gratuito Firebase Spark con cuotas diarias. Si se alcanza el límite diario, la sincronización se pausa hasta el reinicio diario mientras tus datos locales siguen intactos.',
      ],
    },
    {
      heading: '03. Uso Aceptable y Limitación de Responsabilidad',
      body: [
        'PocketWage se ofrece «tal cual» y «según disponibilidad», sin garantías expresas o implícitas. En la medida permitida por la ley, no asumimos responsabilidad por decisiones tomadas con base en estas estimaciones.',
      ],
    },
  ],
};

const FR_LEGAL: LegalDocumentBundle = {
  privacy: [
    {
      heading: '01. Stockage Local par Défaut',
      body: [
        'Par défaut, PocketWage fonctionne exclusivement dans votre navigateur. Vos montants saisis, préférences et comparaisons d’offres enregistrées restent stockés dans votre localStorage.',
        'Vous pouvez effacer vos montants à tout moment via « Effacer » ou supprimer les données du site dans votre navigateur.',
      ],
    },
    {
      heading: '02. Synchronisation Cloud Optionnelle',
      body: [
        'La synchronisation multi-appareils est désactivée par défaut. Uniquement si vous l’activez volontairement avec Google Sign-In (Firebase Authentication), vos paramètres et comparaisons sont stockés de façon privée sous votre identifiant UID dans Cloud Firestore.',
        'Aucune adresse e-mail n’est écrite dans Firestore et vous pouvez vous déconnecter à tout moment pour revenir au mode local.',
      ],
    },
    {
      heading: '03. Services Tiers et Taux de Change',
      body: [
        'Lorsqu’une devise cible est sélectionnée, votre navigateur récupère les taux publics depuis open.er-api.com sans transmettre votre salaire ni données personnelles. Le cache PWA permet l’usage hors ligne.',
      ],
    },
    {
      heading: '04. Aucun Traceur Publicitaire',
      body: [
        'PocketWage n’utilise aucun traceur publicitaire et ne vend jamais de données.',
      ],
    },
  ],
  terms: [
    {
      heading: '01. Estimations Uniquement — Pas de Conseil Fiscal ou Financier',
      body: [
        'Les calculs d’impôts, cotisations retraite, conversions et projections fournis par PocketWage sont des estimations indicatives basées sur des barèmes 2026–2027 et vos paramètres.',
        'Ils ne constituent pas un conseil fiscal, juridique ou financier. Consultez un professionnel ou l’administration fiscale compétente avant toute décision.',
      ],
    },
    {
      heading: '02. Disponibilité du Service',
      body: [
        'La synchronisation optionnelle repose sur l’offre gratuite Firebase Spark soumise à des quotas quotidiens. En cas de dépassement, vos données locales restent pleinement accessibles.',
      ],
    },
    {
      heading: '03. Limitation de Responsabilité',
      body: [
        'PocketWage est fourni « en l’état » sans garantie d’exactitude absolue ni de disponibilité continue.',
      ],
    },
  ],
};

const IT_LEGAL: LegalDocumentBundle = {
  privacy: [
    {
      heading: '01. Archiviazione Locale Predefinita',
      body: [
        'Per impostazione predefinita, PocketWage funziona interamente nel tuo browser. Stipendio inserito, impostazioni e confronti salvati restano nel localStorage locale.',
        'Puoi cancellare gli importi in qualsiasi momento con «Azzera Importi» o rimuovere i dati del sito dal browser.',
      ],
    },
    {
      heading: '02. Sincronizzazione Cloud Facoltativa',
      body: [
        'La sincronizzazione tra dispositivi è disattivata per impostazione predefinita. Solo se la attivi esplicitamente accedendo con Google (Firebase Authentication), i dati vengono salvati in modo privato sotto il tuo UID su Cloud Firestore.',
        'PocketWage non salva il tuo indirizzo email in Firestore e puoi disconnetterti in qualsiasi momento tornando alla modalità solo locale.',
      ],
    },
    {
      heading: '03. Tassi di Cambio e Servizi Esterni',
      body: [
        'Selezionando una valuta estera, il browser richiede i tassi pubblici da open.er-api.com senza inviare importi o dati personali. Le risorse PWA sono memorizzate nella cache per l’uso offline.',
      ],
    },
    {
      heading: '04. Nessun Tracciamento Pubblicitario',
      body: [
        'PocketWage non utilizza tracker pubblicitari di terze parti né vende o condivide dati degli utenti.',
      ],
    },
  ],
  terms: [
    {
      heading: '01. Solo Stime — Nessuna Consulenza Fiscale o Finanziaria',
      body: [
        'Tutti i calcoli di imposte, contributi previdenziali, conversioni e proiezioni pensionistiche sono stime a scopo puramente informativo e di pianificazione personale.',
        'Non costituiscono consulenza fiscale, legale o finanziaria. Verifica sempre i dati ufficiali con un consulente qualificato.',
      ],
    },
    {
      heading: '02. Disponibilità e Quote Gratuite',
      body: [
        'La sincronizzazione facoltativa utilizza il piano gratuito Firebase Spark soggetto a limiti giornalieri. In caso di raggiungimento del limite, i dati restano disponibili localmente nel browser.',
      ],
    },
    {
      heading: '03. Esclusione di Garanzie',
      body: [
        'PocketWage è fornito «così com’è» e «come disponibile» senza garanzie di accuratezza assoluta o continuità.',
      ],
    },
  ],
};

const ZH_LEGAL: LegalDocumentBundle = {
  privacy: [
    {
      heading: '01. 默认本地优先存储',
      body: [
        '默认情况下，PocketWage 完全在您的浏览器本地运行。您输入的薪资、发薪周期、国家税制设置、主题语言及已保存的岗位对比记录仅保存在浏览器 localStorage 中。',
        '您可以随时点击「清空金额」清除输入的金额，或清除已保存的对比记录与浏览器站点数据。',
      ],
    },
    {
      heading: '02. 可选跨设备云同步（仅主动开启）',
      body: [
        '跨设备同步默认关闭。仅当您明确开启同步并使用 Google 登录（Firebase Authentication）后，PocketWage 才会将工作区配置与对比记录私有同步至您账户专属的 Cloud Firestore 路径。',
        'PocketWage 不会将您的电子邮箱写入 Firestore 文档，您可随时退出登录并切回仅本地模式。',
      ],
    },
    {
      heading: '03. 第三方服务与汇率请求',
      body: [
        '当您选择目标转换货币时，浏览器会直接向 open.er-api.com 请求公开汇率，不会发送任何薪资金额或个人身份信息。PWA 离线缓存仅用于保存应用静态资源。',
      ],
    },
    {
      heading: '04. 无广告追踪或数据出售',
      body: [
        'PocketWage 不包含任何第三方广告追踪脚本，也不会出售或出租用户数据。',
      ],
    },
  ],
  terms: [
    {
      heading: '01. 仅作测算参考 — 不构成税务或理财建议',
      body: [
        'PocketWage 提供的税后收入、扣除项、退休金/养老金复利预测及汇率换算均基于公开税制参数（2026–2027）与您的输入生成，仅供个人规划参考，不构成税务、法律、会计或投资建议。',
        '请以当地官方税务机关或持牌专业人士的最终核算为准。',
      ],
    },
    {
      heading: '02. 免费云服务配额说明',
      body: [
        '可选云同步基于免费的 Firebase Spark 配额运行。若达到每日免费读写上限，云同步将暂时暂停至次日重置，本地数据与离线计算仍可正常使用。',
      ],
    },
    {
      heading: '03. 免责声明与责任限制',
      body: [
        'PocketWage 按「现状」及「可用」基础提供，不对计算误差、实时汇率差异或网络中断承担任何直接或间接赔偿责任。',
      ],
    },
  ],
};

const JA_LEGAL: LegalDocumentBundle = {
  privacy: [
    {
      heading: '01. ローカル優先ストレージ（初期設定）',
      body: [
        '初期状態では、PocketWage は完全にブラウザ内で動作します。入力した給与額、国の税制設定、言語・テーマ設定、保存したオファー比較はブラウザの localStorage にのみ保存されます。',
        '「金額をクリア」またはブラウザのサイトデータ削除によりいつでも消去できます。',
      ],
    },
    {
      heading: '02. 任意のクロスデバイス同期（オプトイン）',
      body: [
        'クラウド同期は初期状態でオフです。明示的に同期を有効化し Google ログイン（Firebase Authentication）を行った場合のみ、作業状態と比較履歴が Cloud Firestore の専用領域に非公開で同期されます。',
        'Firestore ドキュメントにメールアドレスは保存されず、いつでもログアウトしてローカル専用に戻せます。',
      ],
    },
    {
      heading: '03. 外部為替 API とオフラインキャッシュ',
      body: [
        '換算通貨を選択すると、ブラウザが open.er-api.com から公開為替レートを取得します（給与額や個人情報は送信されません）。PWA キャッシュによりオフライン計算にも対応します。',
      ],
    },
    {
      heading: '04. 広告トラッキングなし',
      body: [
        'PocketWage は広告用トラッカーを使用せず、ユーザーデータを販売・共有しません。',
      ],
    },
  ],
  terms: [
    {
      heading: '01. 試算目的のみ — 税務・投資助言ではありません',
      body: [
        'PocketWage の手取り計算、税金・年金試算、昇給比較、老後資産シミュレーションは参考値であり、税務・会計・法律・金融助言ではありません。実際の申告や契約は専門家または公的機関にご確認ください。',
      ],
    },
    {
      heading: '02. 無料枠とサービス提供範囲',
      body: [
        '任意のクラウド同期は Firebase Spark 無料枠で動作します。1日の無料上限に達した場合は翌日リセットまで同期が一時停止しますが、ローカルデータは引き続き利用できます。',
      ],
    },
    {
      heading: '03. 免責事項',
      body: [
        'PocketWage は「現状有姿」で提供され、計算結果の完全性や無停止動作を保証するものではありません。',
      ],
    },
  ],
};

const TH_LEGAL: LegalDocumentBundle = {
  privacy: [
    {
      heading: '01. การเก็บข้อมูลในเครื่องเป็นหลัก (ค่าเริ่มต้น)',
      body: [
        'โดยค่าเริ่มต้น PocketWage ทำงานทั้งหมดภายในเบราว์เซอร์ของคุณ ยอดเงินเดือนที่กรอกล่าสุด การตั้งค่าภาษีของประเทศ ภาษา ธีม และรายการเปรียบเทียบข้อเสนองานที่บันทึกไว้ จะถูกเก็บไว้เฉพาะใน localStorage ของเบราว์เซอร์คุณเท่านั้น',
        'คุณสามารถกด "ล้างจำนวนเงิน" หรือลบรายการที่บันทึกไว้ได้ทุกเมื่อเพื่อความเป็นส่วนตัว',
      ],
    },
    {
      heading: '02. การซิงค์ข้ามอุปกรณ์แบบเลือกเปิดเอง (Optional)',
      body: [
        'การซิงค์บนคลาวด์ปิดอยู่เป็นค่าเริ่มต้น ระบบจะเชื่อมต่อ Firebase Authentication (Google Sign-In) และ Cloud Firestore เฉพาะเมื่อคุณเลือกเปิด "ซิงค์ข้ามอุปกรณ์" ด้วยตนเองเท่านั้น',
        'ข้อมูลจะถูกแยกเก็บอย่างเป็นส่วนตัวภายใต้รหัสผู้ใช้ของคุณ และไม่มีการบันทึกอีเมลลงในเอกสาร Firestore คุณสามารถออกจากระบบเพื่อกลับไปใช้โหมดเก็บในเครื่องได้ตลอดเวลา',
      ],
    },
    {
      heading: '03. บริการภายนอกและอัตราแลกเปลี่ยน',
      body: [
        'เมื่อเลือกแปลงสกุลเงิน เบราว์เซอร์จะดึงอัตราแลกเปลี่ยนสาธารณะจาก open.er-api.com โดยตรง โดยไม่ส่งยอดเงินเดือนหรือข้อมูลส่วนตัวของคุณออกไป และระบบ PWA จะแคชไฟล์แอปไว้เพื่อรองรับการใช้งานแบบออฟไลน์',
      ],
    },
    {
      heading: '04. ไม่มีการติดตามโฆษณาหรือขายข้อมูล',
      body: [
        'PocketWage ไม่ฝังตัวติดตามโฆษณาของบุคคลที่สาม และไม่ขายหรือเผยแพร่ข้อมูลของผู้ใช้',
      ],
    },
  ],
  terms: [
    {
      heading: '01. การยอมรับข้อกำหนด',
      body: [
        'การใช้งาน PocketWage ถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขฉบับนี้ หากไม่เห็นด้วย กรุณาหยุดใช้งานแอปพลิเคชัน',
      ],
    },
    {
      heading: '02. ใช้เพื่อการประมาณการเท่านั้น — ไม่ใช่คำแนะนำทางการเงินหรือภาษี',
      body: [
        'ตัวเลขภาษี เงินสมทบเกษียณ การแปลงสกุลเงิน และประมาณการความมั่งคั่งทั้งหมดเป็นการคำนวณเบื้องต้นตามเกณฑ์ปี 2026–2027 และข้อมูลที่คุณกรอก ไม่ถือเป็นคำแนะนำทางภาษี บัญชี กฎหมาย หรือการลงทุน โปรดตรวจสอบกับผู้เชี่ยวชาญหรือหน่วยงานภาษีทางการก่อนตัดสินใจ',
      ],
    },
    {
      heading: '03. ความพร้อมใช้งานและโควตาฟรี',
      body: [
        'ฟีเจอร์ซิงค์คลาวด์เสริมทำงานบนแพ็กเกจฟรี Firebase Spark หากเกินโควตารายวัน การซิงค์จะหยุดชั่วคราวจนกว่าโควตาจะรีเซ็ตในวันถัดไป โดยข้อมูลในเบราว์เซอร์ของคุณยังคงใช้งานได้ตามปกติ',
      ],
    },
    {
      heading: '04. ข้อจำกัดความรับผิดชอบ',
      body: [
        'PocketWage ให้บริการ "ตามสภาพที่เป็นอยู่" (As-Is) โดยไม่รับประกันความถูกต้องสมบูรณ์หรือความต่อเนื่องตลอดเวลา และไม่รับผิดชอบต่อความเสียหายใด ๆ ที่เกิดจากการนำค่าประมาณการไปใช้อ้างอิง',
      ],
    },
  ],
};

const VI_LEGAL: LegalDocumentBundle = {
  privacy: [
    {
      heading: '01. Lưu Trữ Cục Bộ Mặc Định',
      body: [
        'Mặc định, PocketWage hoạt động hoàn toàn trên trình duyệt của bạn. Mức lương nhập gần nhất, cấu hình thuế theo quốc gia, giao diện và danh sách so sánh offer chỉ được lưu trong localStorage của thiết bị.',
        'Bạn có thể nhấn "Xóa Số Tiền" hoặc xóa dữ liệu trang web bất kỳ lúc nào.',
      ],
    },
    {
      heading: '02. Đồng Bộ Đám Mây Tùy Chọn (Chỉ Khi Tự Bật)',
      body: [
        'Tính năng đồng bộ đa thiết bị mặc định tắt. Chỉ khi bạn chủ động bật và đăng nhập Google (Firebase Authentication), PocketWage mới đồng bộ dữ liệu riêng tư dưới UID của bạn trên Cloud Firestore.',
        'Ứng dụng không ghi email của bạn vào tài liệu Firestore và bạn có thể đăng xuất để quay về chế độ chỉ lưu cục bộ bất cứ lúc nào.',
      ],
    },
    {
      heading: '03. Tỷ Giá Ngoại Tệ & Bộ Nhớ Đệm PWA',
      body: [
        'Khi chọn quy đổi tiền tệ, trình duyệt tải bảng tỷ giá công khai từ open.er-api.com mà không gửi kèm lương hay thông tin cá nhân của bạn.',
      ],
    },
    {
      heading: '04. Không Theo Dõi Quảng Cáo',
      body: [
        'PocketWage không chạy trình theo dõi quảng cáo bên thứ ba và không bán hay chia sẻ dữ liệu người dùng.',
      ],
    },
  ],
  terms: [
    {
      heading: '01. Chỉ Mang Tính Ước Tính — Không Phải Tư Vấn Tài Chính / Thuế',
      body: [
        'Mọi kết quả thuế, bảo hiểm/hưu trí, quy đổi ngoại tệ và dự báo tài sản đều chỉ nhằm mục đích tham khảo và lập kế hoạch cá nhân, không cấu thành tư vấn thuế, kế toán, pháp lý hay tài chính.',
        'Vui lòng đối chiếu với cơ quan thuế hoặc chuyên gia tư vấn trước khi đưa ra quyết định quan trọng.',
      ],
    },
    {
      heading: '02. Hạn Mức Dịch Vụ Miễn Phí & Trách Nhiệm',
      body: [
        'Đồng bộ đám mây tùy chọn sử dụng gói miễn phí Firebase Spark có giới hạn lượt đọc/ghi hàng ngày. PocketWage được cung cấp theo nguyên trạng ("as is") và không chịu trách nhiệm pháp lý đối với thiệt hại phát sinh từ việc sử dụng các số liệu ước tính.',
      ],
    },
  ],
};

const ZH_TW_LEGAL: LegalDocumentBundle = {
  privacy: [
    {
      heading: '01. 本機優先的瀏覽器儲存（預設）',
      body: [
        '預設情況下，PocketWage 完全在您的瀏覽器中執行。您最後輸入的薪資、計薪週期、各國稅率設定、主題、語言偏好以及已儲存的工作 Offer 比較，僅儲存在您裝置瀏覽器的 localStorage 中。',
        '您可以隨時使用「清除金額」按鈕移除輸入數據、刪除已儲存的比較項目，或清除瀏覽器網站資料。',
      ],
    },
    {
      heading: '02. 選用跨裝置雲端同步（僅在主動開啟時）',
      body: [
        '雲端同步功能預設為停用。僅當您主動開啟「跨裝置同步」並使用 Google 帳號透過 Firebase Authentication 登入後，PocketWage 才會將工作區與 Offer 比較私密地同步至 Google Cloud Firestore。',
        '資料儲存在您驗證後的使用者 UID 名下，並透過 Firestore 安全規則嚴格隔離。PocketWage 不會在 Firestore 文件中寫入您的電子郵件，您可隨時登出並回到純本機模式。',
      ],
    },
    {
      heading: '03. 即時匯率查詢與離線快取',
      body: [
        '當您選擇匯率換算目標幣別時，瀏覽器會向 open.er-api.com 請求公開匯率資料，過程中絕不會傳送您的薪資金額或個人資訊。字型與 PWA 靜態資源可能會快取於本機以支援離線計算。',
      ],
    },
    {
      heading: '04. 贊助付款與無廣告追蹤聲明',
      body: [
        'PocketWage 不執行第三方廣告追蹤器，亦不會出售或出租使用者資料。',
        '若您選擇透過 Stripe Checkout 自願打賞支持開發者，交易過程完全由 Stripe 安全處理，PocketWage 本機計算機不存取或儲存任何信用卡資訊。',
      ],
    },
  ],
  terms: [
    {
      heading: '01. 僅供參考之試算結果 — 非財務、稅務或法律建議',
      body: [
        'PocketWage 提供的所有薪資明細、稅負、臨時工加成、加班倍率、退休金 OTE、特休預估與複利推算皆為數學估算，僅供個人規劃參考，不構成正式財務、稅務、會計或法律建議。',
        '各國稅法與勞資規定可能調整，重大決定前請諮詢合格會計師、理財顧問或官方稅務機關（如澳洲 ATO）。',
      ],
    },
    {
      heading: '02. 免責聲明與免費額度說明',
      body: [
        '選用雲端同步採用 Firebase 免費 Spark 方案，受限於每日讀寫配額；若達當日上限，雲端同步將暫停至額度重置，而本機瀏覽器儲存仍可正常使用。',
        'PocketWage 按「現狀」提供，對於因依賴估算結果所產生之任何直接或間接損失概不負責。',
      ],
    },
  ],
};

const LEGAL_CONTENT_MAP: Record<LanguageCode, LegalDocumentBundle> = {
  en: EN_LEGAL,
  es: ES_LEGAL,
  fr: FR_LEGAL,
  it: IT_LEGAL,
  zh: ZH_LEGAL,
  'zh-TW': ZH_TW_LEGAL,
  ja: JA_LEGAL,
  th: TH_LEGAL,
  vi: VI_LEGAL,
};

export function getLegalContent(lang: LanguageCode): LegalDocumentBundle {
  return LEGAL_CONTENT_MAP[lang] ?? EN_LEGAL;
}
