const TARGET_ISO = "2026-07-05T00:00:00+09:00";
const targetDate = new Date(TARGET_ISO).getTime();
const targetMoment = new Date(TARGET_ISO);

const elements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  status: document.getElementById("status-message"),
  tzLocal: document.getElementById("tz-local"),
};

const pad = (value, length = 2) => String(value).padStart(length, "0");

function updateCountdown() {
  const now = Date.now();
  const remaining = targetDate - now;

  if (remaining <= 0) {
    elements.days.textContent = "000";
    elements.hours.textContent = "00";
    elements.minutes.textContent = "00";
    elements.seconds.textContent = "00";
    elements.status.textContent = "本日はJLPT試験日です。落ち着いて力を出し切りましょう。";
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  elements.days.textContent = pad(days, 3);
  elements.hours.textContent = pad(hours);
  elements.minutes.textContent = pad(minutes);
  elements.seconds.textContent = pad(seconds);
  elements.status.textContent = `試験日まであと${days}日。今日の一歩を、合格につなげましょう。`;
}

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

// ── Timezone UI ────────────────────────────────────────────────────────────────

const tzBtn   = document.getElementById("tz-btn");
const tzPanel = document.getElementById("tz-panel");
const tzList  = document.getElementById("tz-list");
const tzWrap  = document.getElementById("tz-fab-wrap");

let selectedTz = (() => {
  try { return localStorage.getItem("jlpt-tz") || "Asia/Tokyo"; }
  catch { return "Asia/Tokyo"; }
})();

function fmtShort(tz) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz, month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(targetMoment);
}

function fmtJa(tz) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: tz, year: "numeric", month: "long",
    day: "numeric", weekday: "short",
    hour: "2-digit", minute: "2-digit",
  }).format(targetMoment);
}

function updateTzLocal() {
  if (selectedTz === "Asia/Tokyo") {
    elements.tzLocal.hidden = true;
    return;
  }
  const found = TIMEZONES.find(t => t.tz === selectedTz);
  elements.tzLocal.textContent = `${found?.flag ?? ""} 現地時間: ${fmtJa(selectedTz)}`;
  elements.tzLocal.hidden = false;
}

function renderTzList() {
  tzList.innerHTML = "";
  TIMEZONES.forEach(({ label, name, tz, flag }) => {
    const li = document.createElement("li");
    li.className = "tz-item";
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", tz === selectedTz ? "true" : "false");
    li.innerHTML =
      `<span class="tz-item-flag">${flag}</span>` +
      `<span class="tz-item-label"><strong>${label}</strong> ${name}</span>` +
      `<span class="tz-item-time">${fmtShort(tz)}</span>`;
    li.addEventListener("click", () => selectTz(tz));
    tzList.appendChild(li);
  });
}

function selectTz(tz) {
  selectedTz = tz;
  try { localStorage.setItem("jlpt-tz", tz); } catch {}
  updateTzLocal();
  closePanel();
  renderTzList();
}

function openPanel() {
  renderTzList();
  tzPanel.hidden = false;
  tzBtn.setAttribute("aria-expanded", "true");

  // scroll selected item into view
  const selected = tzList.querySelector("[aria-selected='true']");
  if (selected) selected.scrollIntoView({ block: "nearest" });
}

function closePanel() {
  tzPanel.hidden = true;
  tzBtn.setAttribute("aria-expanded", "false");
}

tzBtn.addEventListener("click", e => {
  e.stopPropagation();
  tzPanel.hidden ? openPanel() : closePanel();
});

document.addEventListener("click", e => {
  if (!tzPanel.hidden && !tzWrap.contains(e.target)) closePanel();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closePanel();
});

// ── Init ──────────────────────────────────────────────────────────────────────

updateTzLocal();
updateCountdown();
setInterval(updateCountdown, 1000);
