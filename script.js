const TARGET_DATE = "2026-07-05";
const targetMoment = new Date(`${TARGET_DATE}T00:00:00+09:00`); // tetap untuk referensi display

const elements = {
  days:    document.getElementById("days"),
  hours:   document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  status:  document.getElementById("status-message"),
  tzLocal: document.getElementById("tz-local"),
};

const pad = (n, len = 2) => String(n).padStart(len, "0");

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

// Returns the UTC timestamp for 2026-07-05 00:00:00 in the given timezone.
// Probe at noon UTC July 5 to safely calculate the offset without date-wrap issues.
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
    elements.status.textContent  = "本日はJLPT試験日です。落ち着いて力を出し切りましょう。";
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
  elements.status.textContent  = `試験日まであと${days}日。今日の一歩を、合格につなげましょう。`;
}

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
  elements.tzLocal.textContent = `${found?.flag ?? ""} 日本時間: ${jstTime}`;
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
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanel();
});

// ── Init ──────────────────────────────────────────────────────────────────────

updateTzLocal();
updateCountdown();
setInterval(updateCountdown, 1000);
