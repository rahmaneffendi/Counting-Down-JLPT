const TARGET_DATE = "2026-12-06";
const targetMoment = new Date(`${TARGET_DATE}T00:00:00+09:00`); // tetap untuk referensi display

const SUGGESTION_EMAIL = "abdulrahmaneffendi789@gmail.com";

const elements = {
  days:    document.getElementById("days"),
  hours:   document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  status:  document.getElementById("status-message"),
  tzLocal: document.getElementById("tz-local"),
  ribbon:  document.querySelectorAll(".language-ribbon span"),
  eyebrow: document.querySelector(".eyebrow"),
  title:   document.getElementById("page-title"),
  lead:    document.querySelector(".lead"),
  units:   document.querySelectorAll(".time-block span"),
  infoLabels: document.querySelectorAll(".info-panel span"),
  infoValues: document.querySelectorAll(".info-panel strong"),
};

const pad = (n, len = 2) => String(n).padStart(len, "0");

// ── Language data ─────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: "ja", label: "Japanese", native: "日本語", short: "日本", flag: "🇯🇵" },
  { code: "en", label: "English", native: "English", short: "EN", flag: "🇬🇧" },
  { code: "zh", label: "China", native: "中文", short: "中文", flag: "🇨🇳" },
  { code: "id", label: "Indonesia", native: "Indonesia", short: "ID", flag: "🇮🇩" },
  { code: "vi", label: "Vietnam", native: "Tiếng Việt", short: "VI", flag: "🇻🇳" },
  { code: "th", label: "Thailand", native: "ไทย", short: "ไทย", flag: "🇹🇭" },
  { code: "ar", label: "Arabic", native: "العربية", short: "عربي", flag: "🇸🇦" },
];

const COPY = {
  ja: {
    htmlLang: "ja",
    documentTitle: "JLPT 2026 カウントダウン | 日本語能力試験までの日数",
    ribbon: ["日本語能力試験", "令和八年"],
    eyebrow: "2026年12月6日・日曜日",
    title: ["JLPT 2026", "冬の試験まで"],
    lead: "一日一日を大切に。合格へ向かう静かな集中を、今日から積み重ねましょう。",
    units: ["日", "時間", "分", "秒"],
    statusToday: "本日はJLPT試験日です。落ち着いて力を出し切りましょう。",
    statusDays: (days) => `試験日まであと${days}日。今日の一歩を、合格につなげましょう。`,
    jstLabel: "日本時間",
    infoLabels: ["試験日", "曜日", "目標"],
    infoValues: ["2026年12月6日", "日曜日", "合格をつかむ"],
    languagePanelHead: "⛩ 言語",
    timezonePanelHead: "⛩ タイムゾーン",
    languageAria: "言語を変更",
    languageListAria: "言語選択",
    timezoneAria: "タイムゾーンを変更",
    timezoneListAria: "タイムゾーン選択",
    timezoneButton: "時間帯",
    darkAria: "ダークモードに切り替え",
    lightAria: "ライトモードに切り替え",
    darkLabel: "夜",
    lightLabel: "昼",
    suggestLabel: "意見",
    suggestAria: "ご意見・ご要望を送る",
    suggestSubject: "JLPTカウントダウンサイトへのご意見",
    suggestBody: "サイトへのご意見・ご要望をこちらにご記入ください:\n\n",
  },
  en: {
    htmlLang: "en",
    documentTitle: "JLPT 2026 Countdown | Days Until the Japanese Language Proficiency Test",
    ribbon: ["Japanese Language Proficiency Test", "Reiwa 8"],
    eyebrow: "Sunday, December 6, 2026",
    title: ["JLPT 2026", "Until the Winter Exam"],
    lead: "Value each day. Build the quiet focus that carries you toward passing, starting today.",
    units: ["Days", "Hours", "Min", "Sec"],
    statusToday: "Today is JLPT exam day. Stay calm and give it everything.",
    statusDays: (days) => `${days} days until the exam. Let today's step move you closer to passing.`,
    jstLabel: "Japan time",
    infoLabels: ["Exam date", "Day", "Goal"],
    infoValues: ["December 6, 2026", "Sunday", "Pass the exam"],
    languagePanelHead: "⛩ Language",
    timezonePanelHead: "⛩ Timezone",
    languageAria: "Change language",
    languageListAria: "Language selection",
    timezoneAria: "Change timezone",
    timezoneListAria: "Timezone selection",
    timezoneButton: "Time",
    darkAria: "Switch to dark mode",
    lightAria: "Switch to light mode",
    darkLabel: "Night",
    lightLabel: "Day",
    suggestLabel: "Suggest",
    suggestAria: "Send a suggestion or request",
    suggestSubject: "Suggestion for JLPT Countdown site",
    suggestBody: "Please write your suggestion or request here:\n\n",
  },
  zh: {
    htmlLang: "zh-CN",
    documentTitle: "JLPT 2026 倒计时 | 距离日本语能力测试",
    ribbon: ["日本语能力测试", "令和八年"],
    eyebrow: "2026年12月6日・星期日",
    title: ["JLPT 2026", "距离冬季考试"],
    lead: "珍惜每一天。从今天开始，把通向合格的专注一点点积累起来。",
    units: ["天", "小时", "分", "秒"],
    statusToday: "今天是JLPT考试日。保持冷静，发挥全部实力。",
    statusDays: (days) => `距离考试还有${days}天。让今天的一步更接近合格。`,
    jstLabel: "日本时间",
    infoLabels: ["考试日期", "星期", "目标"],
    infoValues: ["2026年12月6日", "星期日", "通过考试"],
    languagePanelHead: "⛩ 语言",
    timezonePanelHead: "⛩ 时区",
    languageAria: "更改语言",
    languageListAria: "语言选择",
    timezoneAria: "更改时区",
    timezoneListAria: "时区选择",
    timezoneButton: "时区",
    darkAria: "切换到深色模式",
    lightAria: "切换到浅色模式",
    darkLabel: "夜",
    lightLabel: "昼",
    suggestLabel: "建议",
    suggestAria: "发送建议或请求",
    suggestSubject: "关于JLPT倒计时网站的建议",
    suggestBody: "请在此处写下您的建议或请求：\n\n",
  },
  id: {
    htmlLang: "id",
    documentTitle: "Hitung Mundur JLPT 2026 | Sisa Hari Menuju Ujian Bahasa Jepang",
    ribbon: ["Ujian Kemampuan Bahasa Jepang", "Tahun Reiwa 8"],
    eyebrow: "Minggu, 6 Desember 2026",
    title: ["JLPT 2026", "Menuju Ujian Musim Dingin"],
    lead: "Hargai setiap hari. Mulai hari ini, bangun fokus tenang yang membawamu menuju kelulusan.",
    units: ["Hari", "Jam", "Menit", "Detik"],
    statusToday: "Hari ini adalah hari ujian JLPT. Tetap tenang dan keluarkan kemampuan terbaikmu.",
    statusDays: (days) => `${days} hari lagi menuju ujian. Jadikan langkah hari ini makin dekat ke lulus.`,
    jstLabel: "Waktu Jepang",
    infoLabels: ["Tanggal ujian", "Hari", "Target"],
    infoValues: ["6 Desember 2026", "Minggu", "Lulus ujian"],
    languagePanelHead: "⛩ Bahasa",
    timezonePanelHead: "⛩ Zona waktu",
    languageAria: "Ganti bahasa",
    languageListAria: "Pilihan bahasa",
    timezoneAria: "Ganti zona waktu",
    timezoneListAria: "Pilihan zona waktu",
    timezoneButton: "Waktu",
    darkAria: "Ganti ke mode gelap",
    lightAria: "Ganti ke mode terang",
    darkLabel: "Malam",
    lightLabel: "Siang",
    suggestLabel: "Saran",
    suggestAria: "Kirim saran atau request",
    suggestSubject: "Saran untuk situs Hitung Mundur JLPT",
    suggestBody: "Silakan tulis saran atau request kamu di sini:\n\n",
  },
  vi: {
    htmlLang: "vi",
    documentTitle: "Đếm Ngược JLPT 2026 | Số Ngày Đến Kỳ Thi Năng Lực Tiếng Nhật",
    ribbon: ["Kỳ thi năng lực tiếng Nhật", "Năm Reiwa 8"],
    eyebrow: "Chủ nhật, ngày 6 tháng 12 năm 2026",
    title: ["JLPT 2026", "Đến Kỳ Thi Mùa Đông"],
    lead: "Trân trọng từng ngày. Từ hôm nay, hãy tích lũy sự tập trung bình tĩnh để tiến tới đỗ kỳ thi.",
    units: ["Ngày", "Giờ", "Phút", "Giây"],
    statusToday: "Hôm nay là ngày thi JLPT. Hãy bình tĩnh và làm hết sức mình.",
    statusDays: (days) => `Còn ${days} ngày đến kỳ thi. Bước đi hôm nay sẽ đưa bạn gần hơn tới mục tiêu đỗ.`,
    jstLabel: "Giờ Nhật Bản",
    infoLabels: ["Ngày thi", "Thứ", "Mục tiêu"],
    infoValues: ["6 tháng 12, 2026", "Chủ nhật", "Đỗ kỳ thi"],
    languagePanelHead: "⛩ Ngôn ngữ",
    timezonePanelHead: "⛩ Múi giờ",
    languageAria: "Đổi ngôn ngữ",
    languageListAria: "Chọn ngôn ngữ",
    timezoneAria: "Đổi múi giờ",
    timezoneListAria: "Chọn múi giờ",
    timezoneButton: "Giờ",
    darkAria: "Chuyển sang chế độ tối",
    lightAria: "Chuyển sang chế độ sáng",
    darkLabel: "Tối",
    lightLabel: "Sáng",
    suggestLabel: "Góp ý",
    suggestAria: "Gửi góp ý hoặc yêu cầu",
    suggestSubject: "Góp ý cho trang Đếm Ngược JLPT",
    suggestBody: "Vui lòng viết góp ý hoặc yêu cầu của bạn ở đây:\n\n",
  },
  th: {
    htmlLang: "th",
    documentTitle: "นับถอยหลัง JLPT 2026 | จำนวนวันสู่การสอบวัดระดับภาษาญี่ปุ่น",
    ribbon: ["การสอบวัดระดับภาษาญี่ปุ่น", "ปีเรวะที่ 8"],
    eyebrow: "วันอาทิตย์ที่ 6 ธันวาคม 2026",
    title: ["JLPT 2026", "สู่การสอบฤดูหนาว"],
    lead: "ให้คุณค่ากับทุกวัน สร้างสมาธิที่สงบนิ่งซึ่งจะพาไปสู่ความสำเร็จ เริ่มตั้งแต่วันนี้",
    units: ["วัน", "ชั่วโมง", "นาที", "วินาที"],
    statusToday: "วันนี้คือวันสอบ JLPT ตั้งสติและทำให้เต็มที่",
    statusDays: (days) => `อีก ${days} วันถึงวันสอบ ก้าวของวันนี้จะพาคุณเข้าใกล้ความสำเร็จมากขึ้น`,
    jstLabel: "เวลาญี่ปุ่น",
    infoLabels: ["วันสอบ", "วัน", "เป้าหมาย"],
    infoValues: ["6 ธันวาคม 2026", "วันอาทิตย์", "สอบผ่าน"],
    languagePanelHead: "⛩ ภาษา",
    timezonePanelHead: "⛩ เขตเวลา",
    languageAria: "เปลี่ยนภาษา",
    languageListAria: "เลือกภาษา",
    timezoneAria: "เปลี่ยนเขตเวลา",
    timezoneListAria: "เลือกเขตเวลา",
    timezoneButton: "เวลา",
    darkAria: "สลับเป็นโหมดมืด",
    lightAria: "สลับเป็นโหมดสว่าง",
    darkLabel: "กลางคืน",
    lightLabel: "กลางวัน",
    suggestLabel: "แนะนำ",
    suggestAria: "ส่งข้อเสนอแนะหรือคำขอ",
    suggestSubject: "ข้อเสนอแนะสำหรับเว็บนับถอยหลัง JLPT",
    suggestBody: "กรุณาเขียนข้อเสนอแนะหรือคำขอของคุณที่นี่:\n\n",
  },
  ar: {
    htmlLang: "ar",
    htmlDir: "rtl",
    documentTitle: "العد التنازلي لاختبار JLPT 2026 | الأيام المتبقية لاختبار كفاءة اللغة اليابانية",
    ribbon: ["اختبار كفاءة اللغة اليابانية", "السنة الثامنة من عصر ريوا"],
    eyebrow: "الأحد، 6 ديسمبر 2026",
    title: ["JLPT 2026", "حتى اختبار الشتاء"],
    lead: "قدّر كل يوم. ابنِ تركيزًا هادئًا يقودك نحو النجاح، ابتداءً من اليوم.",
    units: ["يوم", "ساعة", "دقيقة", "ثانية"],
    statusToday: "اليوم هو يوم اختبار JLPT. حافظ على هدوئك وابذل قصارى جهدك.",
    statusDays: (days) => `باقٍ ${days} يومًا على الاختبار. اجعل خطوة اليوم تقربك من النجاح.`,
    jstLabel: "توقيت اليابان",
    infoLabels: ["تاريخ الاختبار", "اليوم", "الهدف"],
    infoValues: ["6 ديسمبر 2026", "الأحد", "اجتياز الاختبار"],
    languagePanelHead: "⛩ اللغة",
    timezonePanelHead: "⛩ المنطقة الزمنية",
    languageAria: "تغيير اللغة",
    languageListAria: "اختيار اللغة",
    timezoneAria: "تغيير المنطقة الزمنية",
    timezoneListAria: "اختيار المنطقة الزمنية",
    timezoneButton: "الوقت",
    darkAria: "التبديل إلى الوضع الداكن",
    lightAria: "التبديل إلى الوضع الفاتح",
    darkLabel: "ليل",
    lightLabel: "نهار",
    suggestLabel: "اقتراح",
    suggestAria: "إرسال اقتراح أو طلب",
    suggestSubject: "اقتراح لموقع العد التنازلي لـ JLPT",
    suggestBody: "يرجى كتابة اقتراحك أو طلبك هنا:\n\n",
  },
};

function getStoredLanguage() {
  try {
    const saved = localStorage.getItem("jlpt-lang");
    return COPY[saved] ? saved : "ja";
  } catch {
    return "ja";
  }
}

let selectedLang = getStoredLanguage();
let currentCopy = COPY[selectedLang];

// ── Timezone data ──────────────────────────────────────────────────────────────

const TIMEZONES = [
  { label: "JST",  name: "日本 · Tokyo",              tz: "Asia/Tokyo",            flag: "🇯🇵" },
  { label: "WIB",  name: "Indonesia · Jakarta",        tz: "Asia/Jakarta",          flag: "🇮🇩" },
  { label: "WITA", name: "Indonesia · Makassar",       tz: "Asia/Makassar",         flag: "🇮🇩" },
  { label: "WIT",  name: "Indonesia · Jayapura",       tz: "Asia/Jayapura",         flag: "🇮🇩" },
  { label: "SGT",  name: "Singapore",                  tz: "Asia/Singapore",        flag: "🇸🇬" },
  { label: "MYT",  name: "Malaysia · Kuala Lumpur",    tz: "Asia/Kuala_Lumpur",     flag: "🇲🇾" },
  { label: "PHT",  name: "Philippines · Manila",       tz: "Asia/Manila",           flag: "🇵🇭" },
  { label: "KST",  name: "Korea · Seoul",              tz: "Asia/Seoul",            flag: "🇰🇷" },
  { label: "CST",  name: "China · Shanghai",           tz: "Asia/Shanghai",         flag: "🇨🇳" },
  { label: "ICT",  name: "Thailand · Bangkok",         tz: "Asia/Bangkok",          flag: "🇹🇭" },
  { label: "IST",  name: "India · Mumbai",             tz: "Asia/Kolkata",          flag: "🇮🇳" },
  { label: "AEST", name: "Australia · Sydney",         tz: "Australia/Sydney",      flag: "🇦🇺" },
  { label: "UTC",  name: "Universal Time",             tz: "UTC",                   flag: "🌐" },
  { label: "GMT",  name: "UK · London",                tz: "Europe/London",         flag: "🇬🇧" },
  { label: "CET",  name: "France · Paris",             tz: "Europe/Paris",          flag: "🇫🇷" },
  { label: "EST",  name: "US · New York",              tz: "America/New_York",      flag: "🇺🇸" },
  { label: "CST",  name: "US · Chicago",               tz: "America/Chicago",       flag: "🇺🇸" },
  { label: "PST",  name: "US · Los Angeles",           tz: "America/Los_Angeles",   flag: "🇺🇸" },
  { label: "BRT",  name: "Brazil · São Paulo",         tz: "America/Sao_Paulo",     flag: "🇧🇷" },
];

// ── Target timestamp calculation ───────────────────────────────────────────────

// Returns the UTC timestamp for 2026-12-06 00:00:00 in the given timezone.
// Probe at noon UTC December 6 to safely calculate the offset without date-wrap issues.
function getTargetTimestamp(tz) {
  const probe = new Date(`${TARGET_DATE}T12:00:00Z`);

  const fmt = (tzId) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: tzId,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .format(probe)
      .split(":")
      .map(Number);

  const [uh, um] = fmt("UTC");
  const [th, tm] = fmt(tz);

  const offsetMs = ((th - uh) * 60 + (tm - um)) * 60_000;
  return new Date(`${TARGET_DATE}T00:00:00Z`).getTime() - offsetMs;
}

// Returns "GMT+9", "GMT+7", etc. for the target date
function getOffsetLabel(tz) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  }).formatToParts(new Date(`${TARGET_DATE}T12:00:00Z`));
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
}

// ── State ──────────────────────────────────────────────────────────────────────

let selectedTz = (() => {
  try { return localStorage.getItem("jlpt-tz") || "Asia/Tokyo"; }
  catch { return "Asia/Tokyo"; }
})();

let targetTimestamp = getTargetTimestamp(selectedTz);

// ── Countdown ──────────────────────────────────────────────────────────────────

function updateCountdown() {
  const remaining = targetTimestamp - Date.now();

  if (remaining <= 0) {
    elements.days.textContent    = "000";
    elements.hours.textContent   = "00";
    elements.minutes.textContent = "00";
    elements.seconds.textContent = "00";
    elements.status.textContent  = currentCopy.statusToday;
    return;
  }

  const totalSec = Math.floor(remaining / 1000);
  const days     = Math.floor(totalSec / 86400);
  const hours    = Math.floor((totalSec % 86400) / 3600);
  const minutes  = Math.floor((totalSec % 3600) / 60);
  const seconds  = totalSec % 60;

  elements.days.textContent    = pad(days, 3);
  elements.hours.textContent   = pad(hours);
  elements.minutes.textContent = pad(minutes);
  elements.seconds.textContent = pad(seconds);
  elements.status.textContent  = currentCopy.statusDays(days);
}

// ── Language UI ──────────────────────────────────────────────────────────────

const langBtn   = document.getElementById("lang-btn");
const langPanel = document.getElementById("lang-panel");
const langList  = document.getElementById("lang-list");
const langLabel = document.getElementById("lang-label");
const suggestBtn = document.getElementById("suggest-btn");

function setTextList(nodes, values) {
  nodes.forEach((node, index) => {
    if (values[index] !== undefined) node.textContent = values[index];
  });
}

function applyLanguage() {
  currentCopy = COPY[selectedLang];
  document.documentElement.lang = currentCopy.htmlLang;
  document.documentElement.dir = currentCopy.htmlDir || "ltr";
  document.title = currentCopy.documentTitle;

  setTextList(elements.ribbon, currentCopy.ribbon);
  setTextList(elements.units, currentCopy.units);
  setTextList(elements.infoLabels, currentCopy.infoLabels);
  setTextList(elements.infoValues, currentCopy.infoValues);

  elements.eyebrow.textContent = currentCopy.eyebrow;
  elements.title.innerHTML = `${currentCopy.title[0]}<br />${currentCopy.title[1]}`;
  elements.lead.textContent = currentCopy.lead;

  document.querySelector("[data-i18n='languagePanelHead']").textContent = currentCopy.languagePanelHead;
  document.querySelector("[data-i18n='timezonePanelHead']").textContent = currentCopy.timezonePanelHead;
  langBtn.setAttribute("aria-label", currentCopy.languageAria);
  langList.setAttribute("aria-label", currentCopy.languageListAria);
  tzBtn.setAttribute("aria-label", currentCopy.timezoneAria);
  tzList.setAttribute("aria-label", currentCopy.timezoneListAria);
  document.getElementById("tz-fab-label").textContent = currentCopy.timezoneButton;

  suggestBtn.setAttribute("aria-label", currentCopy.suggestAria);
  suggestBtn.href = `mailto:${SUGGESTION_EMAIL}?subject=${encodeURIComponent(currentCopy.suggestSubject)}&body=${encodeURIComponent(currentCopy.suggestBody)}`;
  document.getElementById("suggest-fab-label").textContent = currentCopy.suggestLabel;

  const found = LANGUAGES.find((lang) => lang.code === selectedLang);
  langLabel.textContent = found?.short ?? "日本";

  applyTheme();
  updateTzLocal();
  updateCountdown();
}

function renderLangList() {
  langList.innerHTML = "";
  LANGUAGES.forEach(({ code, label, native, flag }) => {
    const li = document.createElement("li");
    li.className = "lang-item";
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", code === selectedLang ? "true" : "false");
    li.innerHTML =
      `<span class="lang-item-flag">${flag}</span>` +
      `<span class="lang-item-label"><strong>${native}</strong> ${label}</span>`;
    li.addEventListener("click", () => selectLanguage(code));
    langList.appendChild(li);
  });
}

function selectLanguage(code) {
  selectedLang = COPY[code] ? code : "ja";
  try { localStorage.setItem("jlpt-lang", selectedLang); } catch {}
  applyLanguage();
  closeLangPanel();
  renderLangList();
  renderTzList();
}

function openLangPanel() {
  renderLangList();
  closePanel();
  langPanel.hidden = false;
  langBtn.setAttribute("aria-expanded", "true");
  const selected = langList.querySelector("[aria-selected='true']");
  if (selected) selected.scrollIntoView({ block: "nearest" });
}

function closeLangPanel() {
  langPanel.hidden = true;
  langBtn.setAttribute("aria-expanded", "false");
}

langBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  langPanel.hidden ? openLangPanel() : closeLangPanel();
});

// ── Timezone UI ────────────────────────────────────────────────────────────────

const tzBtn   = document.getElementById("tz-btn");
const tzPanel = document.getElementById("tz-panel");
const tzList  = document.getElementById("tz-list");
const tzWrap  = document.getElementById("tz-fab-wrap");

function updateTzLocal() {
  if (selectedTz === "Asia/Tokyo") {
    elements.tzLocal.hidden = true;
    return;
  }
  const found = TIMEZONES.find((t) => t.tz === selectedTz);
  // Show what midnight in the selected timezone equals in JST
  const jstTime = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric", month: "long", day: "numeric",
    weekday: "short", hour: "2-digit", minute: "2-digit",
  }).format(new Date(targetTimestamp));
  elements.tzLocal.textContent = `${found?.flag ?? ""} ${currentCopy.jstLabel}: ${jstTime}`;
  elements.tzLocal.hidden = false;
}

function renderTzList() {
  tzList.innerHTML = "";
  TIMEZONES.forEach(({ label, name, tz, flag }) => {
    const li = document.createElement("li");
    li.className = "tz-item";
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", tz === selectedTz ? "true" : "false");
    const offset = getOffsetLabel(tz);
    li.innerHTML =
      `<span class="tz-item-flag">${flag}</span>` +
      `<span class="tz-item-label"><strong>${label}</strong> ${name}</span>` +
      `<span class="tz-item-time">${offset}</span>`;
    li.addEventListener("click", () => selectTz(tz));
    tzList.appendChild(li);
  });
}

function selectTz(tz) {
  selectedTz = tz;
  try { localStorage.setItem("jlpt-tz", tz); } catch {}
  targetTimestamp = getTargetTimestamp(tz);
  updateTzLocal();
  updateCountdown();   // langsung update tampilan
  closePanel();
  renderTzList();
}

function openPanel() {
  renderTzList();
  closeLangPanel();
  tzPanel.hidden = false;
  tzBtn.setAttribute("aria-expanded", "true");
  const selected = tzList.querySelector("[aria-selected='true']");
  if (selected) selected.scrollIntoView({ block: "nearest" });
}

function closePanel() {
  tzPanel.hidden = true;
  tzBtn.setAttribute("aria-expanded", "false");
}

tzBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  tzPanel.hidden ? openPanel() : closePanel();
});

document.addEventListener("click", (e) => {
  if (!tzPanel.hidden && !tzWrap.contains(e.target)) closePanel();
  if (!langPanel.hidden && !tzWrap.contains(e.target)) closeLangPanel();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePanel();
    closeLangPanel();
  }
});

// ── Dark mode ─────────────────────────────────────────────────────────────────

const themeBtn   = document.getElementById("theme-btn");
const iconSun    = document.getElementById("icon-sun");
const iconMoon   = document.getElementById("icon-moon");
const themeLabel = document.getElementById("theme-label");

let darkMode = document.documentElement.getAttribute("data-theme") === "dark";

function applyTheme() {
  if (darkMode) {
    document.documentElement.setAttribute("data-theme", "dark");
    iconSun.hidden  = false;
    iconMoon.hidden = true;
    themeLabel.textContent = currentCopy.lightLabel;
    themeBtn.setAttribute("aria-label", currentCopy.lightAria);
  } else {
    document.documentElement.removeAttribute("data-theme");
    iconSun.hidden  = true;
    iconMoon.hidden = false;
    themeLabel.textContent = currentCopy.darkLabel;
    themeBtn.setAttribute("aria-label", currentCopy.darkAria);
  }
}

themeBtn.addEventListener("click", () => {
  darkMode = !darkMode;
  try { localStorage.setItem("jlpt-theme", darkMode ? "dark" : "light"); } catch {}
  applyTheme();
});

// ── Particle repel ────────────────────────────────────────────────────────────

const particles  = document.querySelectorAll('.particle-inner');
const REPEL_R    = 88;
const REPEL_F    = 52;
const mouse      = { x: -9999, y: -9999 };
let   rafPending = false;

function applyRepel() {
  rafPending = false;
  particles.forEach(el => {
    const r  = el.getBoundingClientRect();
    const dx = (r.left + r.width  * 0.5) - mouse.x;
    const dy = (r.top  + r.height * 0.5) - mouse.y;
    const dist = Math.hypot(dx, dy);
    if (dist < REPEL_R && dist > 0) {
      const f = ((REPEL_R - dist) / REPEL_R) * REPEL_F;
      el.style.transition = 'transform 0.08s linear';
      el.style.transform  = `translate(${(dx / dist) * f}px,${(dy / dist) * f}px)`;
    } else if (el.style.transform) {
      el.style.transition = 'transform 0.7s cubic-bezier(0.34,1.4,0.64,1)';
      el.style.transform  = '';
    }
  });
}

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  if (!rafPending) { rafPending = true; requestAnimationFrame(applyRepel); }
});

document.addEventListener('mouseleave', () => {
  particles.forEach(el => {
    el.style.transition = 'transform 0.7s cubic-bezier(0.34,1.4,0.64,1)';
    el.style.transform  = '';
  });
});

// ── Init ──────────────────────────────────────────────────────────────────────

applyLanguage();
setInterval(updateCountdown, 1000);
