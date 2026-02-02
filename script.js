const pages = document.querySelectorAll(".page");
const music = document.getElementById("bgMusic");
const flame = document.getElementById("flame");

/* PAGE NAV */
function openLetter() {
  goTo("home");
}

function goTo(id) {
  pages.forEach((p) => p.classList.remove("active"));
  const page = document.getElementById(id);
  page.classList.add("active");
  music.play();

  // ===== AUTO PAUSE VIDEO WHEN LEAVING VIDEO PAGE =====
  const videoEl = document.querySelector("video");
  if (videoEl && id !== "video") {
    videoEl.pause();
    videoEl.currentTime = 0; // reset ke awal (opsional, tapi enak)
    music.play(); // pastikan musik nyala lagi
  }

  // reset landing letter animation when coming back
  if (id === "landing") {
    const box = document.querySelector("#landing .section-box");
    box.classList.remove("opened");
  }

  page.querySelectorAll(".typing").forEach((el, i) => {
    setTimeout(() => typeText(el, 60), i * 400);
  });

  if (id === "cake") {
    setTimeout(() => fireworkBurst(innerWidth / 2, innerHeight / 2 - 150), 600);
  }
}

// trigger typing on first load (landing)
window.addEventListener("load", () => {
  document.querySelectorAll("#landing .typing").forEach((el, i) => {
    setTimeout(() => typeText(el, 60), i * 400);
  });
});

function openLetter() {
  const box = document.querySelector("#landing .section-box");
  box.classList.add("opened");

  setTimeout(() => {
    goTo("home");
  }, 700); // tunggu animasi selesai
}

/* THEME */
function setTheme(theme) {
  document.body.className = theme === "default" ? "" : theme;
  fireworkBurst(innerWidth / 2, innerHeight / 2);
}

/* TYPING */
function typeText(el, speed) {
  const text = el.dataset.text;
  el.textContent = "";
  let i = 0;
  (function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i++);
      setTimeout(type, speed);
    }
  })();
}

//cake animation
function toggleCandle() {
  flame.classList.toggle("off");

  document.querySelector(".fancy-cake").style.animation = "cakePop 0.6s ease";

  fireworkBurst(innerWidth / 2, innerHeight / 2 - 200);
}

/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

/* BACKGROUND PARTICLES */
let bgParticles = [];
for (let i = 0; i < 120; i++) {
  bgParticles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    dy: Math.random() * 0.6 + 0.2,
    alpha: Math.random() * 0.4 + 0.2,
  });
}

/* FIREWORKS */
let fireworks = [];
function fireworkBurst(x, y) {
  for (let i = 0; i < 80; i++) {
    fireworks.push({
      x,
      y,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 8,
      dy: (Math.random() - 0.5) * 8,
      life: 80,
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bgParticles.forEach((p) => {
    p.y += p.dy;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,180,180,${p.alpha})`;
    ctx.fill();
  });

  fireworks.forEach((f, i) => {
    f.x += f.dx;
    f.y += f.dy;
    f.life--;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue(
      "--particle",
    );
    ctx.fill();
    if (f.life <= 0) fireworks.splice(i, 1);
  });

  requestAnimationFrame(animate);
}
animate();

// ===== IMAGE ZOOM FEATURE =====
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");

document.querySelectorAll(".gallery img").forEach((img) => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

// close when click outside image
modal.addEventListener("click", () => {
  modal.style.display = "none";
  modalImg.src = "";
});

// close with ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.style.display = "none";
    modalImg.src = "";
  }
});

// ===== STOP BG MUSIC WHEN VIDEO PLAYS =====
// ===== STOP BG MUSIC WHEN VIDEO PLAYS =====
const videoEl = document.querySelector("video");

if (videoEl) {
  videoEl.addEventListener("play", () => {
    music.pause();
    if (musicToggleBtn) musicToggleBtn.textContent = "▶️";
  });

  videoEl.addEventListener("pause", () => {
    music.play();
    if (musicToggleBtn) musicToggleBtn.textContent = "⏸️";
  });

  videoEl.addEventListener("ended", () => {
    music.play();
    if (musicToggleBtn) musicToggleBtn.textContent = "⏸️";
  });
}

// ===== MUSIC TOGGLE BUTTON =====
const musicToggleBtn = document.getElementById("musicToggle");

if (musicToggleBtn && music) {
  // default: music is playing (kalau belum, coba play)
  music.play().catch(() => {});

  musicToggleBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      musicToggleBtn.textContent = "⏸️";
    } else {
      music.pause();
      musicToggleBtn.textContent = "▶️";
    }
  });
}
