const targetDate = new Date("2026-07-05T00:00:00+09:00").getTime();

const elements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  status: document.getElementById("status-message"),
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

updateCountdown();
setInterval(updateCountdown, 1000);
