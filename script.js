// Valentine cinematic interactions
const body = document.body;
const introScreen = document.getElementById("introScreen");
const floatingLayer = document.getElementById("floatingLayer");
const sparkles = document.getElementById("sparkles");
const fxCanvas = document.getElementById("fxCanvas");
const fxContext = fxCanvas.getContext("2d");
const heroTyping = document.getElementById("heroTyping");
const openHeartButton = document.getElementById("openHeart");
const surpriseSection = document.getElementById("surprise");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const openLetterButton = document.getElementById("openLetter");
const envelope = document.getElementById("envelope");
const countdownTime = document.getElementById("countdownTime");
const promiseYes = document.getElementById("promiseYes");
const photoModal = document.getElementById("photoModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");
const bouquetModal = document.getElementById("bouquetModal");
const closeBouquet = document.getElementById("closeBouquet");
const sliderTrack = document.getElementById("sliderTrack");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const revealItems = document.querySelectorAll(".reveal");

let fxParticles = [];
let fxFrame;
let heartRainTimer;
let sliderIndex = 0;
let sliderTimer;

// Intro screen timing
body.classList.add("is-locked");
setTimeout(() => {
  introScreen.classList.add("intro--hide");
  body.classList.remove("is-locked");
}, 3000);

// Floating hearts and sparkles
const createFloatingHeart = () => {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  const size = 10 + Math.random() * 18;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${8 + Math.random() * 8}s`;
  heart.style.opacity = `${0.3 + Math.random() * 0.5}`;
  floatingLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 16000);
};

const createSparkles = () => {
  for (let i = 0; i < 26; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 4}s`;
    sparkles.appendChild(sparkle);
  }
};

for (let i = 0; i < 18; i += 1) {
  setTimeout(createFloatingHeart, i * 300);
}
setInterval(createFloatingHeart, 1100);
createSparkles();

// Typewriter effect for hero subtitle
const heroMessage = "You are the best thing in my life";
let heroChar = 0;
const typeHero = () => {
  if (heroChar <= heroMessage.length) {
    heroTyping.textContent = heroMessage.slice(0, heroChar);
    heroChar += 1;
    setTimeout(typeHero, 70);
  }
};
typeHero();

// Effects canvas
const resizeFxCanvas = () => {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
};
resizeFxCanvas();
window.addEventListener("resize", resizeFxCanvas);

const startFxLoop = () => {
  if (fxFrame) return;
  const render = () => {
    fxContext.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    fxParticles = fxParticles.filter((p) => p.life > 0);
    fxParticles.forEach((p) => {
      p.life -= 1;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0;
      p.rotation += p.spin || 0;
      fxContext.save();
      fxContext.translate(p.x, p.y);
      fxContext.rotate(p.rotation);
      fxContext.globalAlpha = Math.max(p.life / p.maxLife, 0);
      fxContext.fillStyle = p.color;
      fxContext.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      fxContext.restore();
    });
    if (fxParticles.length > 0) {
      fxFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(fxFrame);
      fxFrame = null;
    }
  };
  fxFrame = requestAnimationFrame(render);
};

const spawnConfetti = (originX, originY) => {
  const colors = ["#ff5e8a", "#ffd1e0", "#ff97b7", "#ff3b75", "#fff0f6"];
  const count = 140;
  for (let i = 0; i < count; i += 1) {
    fxParticles.push({
      x: originX + (Math.random() - 0.5) * 200,
      y: originY + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 1,
      size: 6 + Math.random() * 6,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 180,
      maxLife: 180,
      gravity: 0.03,
    });
  }
  startFxLoop();
};

const spawnFirework = (originX, originY) => {
  const colors = ["#ff5e8a", "#ffd1e0", "#ff9ac1", "#fff0f6"];
  const count = 50;
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 2.8;
    fxParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 4 + Math.random() * 3,
      rotation: Math.random() * Math.PI,
      spin: 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 90,
      maxLife: 90,
      gravity: 0.02,
    });
  }
  startFxLoop();
};

const launchFireworks = () => {
  const bursts = 4;
  for (let i = 0; i < bursts; i += 1) {
    setTimeout(() => {
      spawnFirework(
        fxCanvas.width * (0.2 + Math.random() * 0.6),
        fxCanvas.height * (0.2 + Math.random() * 0.4)
      );
    }, i * 300);
  }
};

// Heart burst on surprise
const burstHearts = (source) => {
  const rect = source.getBoundingClientRect();
  for (let i = 0; i < 18; i += 1) {
    const heart = document.createElement("div");
    heart.className = "burst-heart";
    heart.style.left = `${rect.left + rect.width / 2}px`;
    heart.style.top = `${rect.top + rect.height / 2}px`;
    heart.style.setProperty("--burst-x", `${(Math.random() - 0.5) * 200}px`);
    heart.style.setProperty("--burst-y", `${(Math.random() - 1) * 220}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }
};

// Countdown timer
const getNextValentine = () => {
  const now = new Date();
  const year = now.getFullYear();
  const target = new Date(year, 1, 14, 0, 0, 0);
  return now > target ? new Date(year + 1, 1, 14, 0, 0, 0) : target;
};

const updateCountdown = () => {
  const diff = getNextValentine() - new Date();
  if (diff <= 0) {
    countdownTime.textContent = "It’s today! 💞";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownTime.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
setInterval(updateCountdown, 1000);
updateCountdown();

// Music toggle
const updateMusicState = (isPlaying) => {
  musicToggle.textContent = isPlaying ? "Pause music" : "Play music";
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
};

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {});
    updateMusicState(true);
  } else {
    bgMusic.pause();
    updateMusicState(false);
  }
});

// Surprise reveal
openHeartButton.addEventListener("click", () => {
  surpriseSection.classList.remove("is-hidden");
  surpriseSection.classList.add("is-visible");
  surpriseSection.scrollIntoView({ behavior: "smooth" });
  burstHearts(openHeartButton);
  spawnConfetti(fxCanvas.width / 2, fxCanvas.height * 0.35);
  bgMusic.volume = 0.3;
  bgMusic.play().catch(() => {});
  updateMusicState(true);
});

// Love letter envelope
openLetterButton.addEventListener("click", () => {
  envelope.classList.toggle("is-open");
});

// Reveal on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Photo modal
document.querySelectorAll(".polaroid").forEach((button) => {
  button.addEventListener("click", () => {
    const src = button.getAttribute("data-photo");
    modalImage.src = src;
    photoModal.classList.add("is-open");
    photoModal.setAttribute("aria-hidden", "false");
  });
});

const closePhotoModal = () => {
  photoModal.classList.remove("is-open");
  photoModal.setAttribute("aria-hidden", "true");
};

closeModal.addEventListener("click", closePhotoModal);
photoModal.addEventListener("click", (event) => {
  if (event.target === photoModal) closePhotoModal();
});

// Slider
const updateSlider = () => {
  sliderTrack.style.transform = `translateX(-${sliderIndex * 100}%)`;
};

const slideCount = sliderTrack.children.length;
const goNext = () => {
  sliderIndex = (sliderIndex + 1) % slideCount;
  updateSlider();
};
const goPrev = () => {
  sliderIndex = (sliderIndex - 1 + slideCount) % slideCount;
  updateSlider();
};

nextSlide.addEventListener("click", () => {
  goNext();
  clearInterval(sliderTimer);
});
prevSlide.addEventListener("click", () => {
  goPrev();
  clearInterval(sliderTimer);
});

sliderTimer = setInterval(goNext, 5000);

// Promise section effect
const startHeartRain = () => {
  if (heartRainTimer) return;
  heartRainTimer = setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "rain-heart";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${4 + Math.random() * 3}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
  }, 280);
};

promiseYes.addEventListener("click", () => {
  promiseYes.textContent = "Forever! 💍";
  promiseYes.disabled = true;
  startHeartRain();
  launchFireworks();
  spawnConfetti(fxCanvas.width / 2, fxCanvas.height * 0.3);
  bouquetModal.classList.add("is-open");
  bouquetModal.setAttribute("aria-hidden", "false");
});

const closeBouquetModal = () => {
  bouquetModal.classList.remove("is-open");
  bouquetModal.setAttribute("aria-hidden", "true");
};

closeBouquet.addEventListener("click", closeBouquetModal);
bouquetModal.addEventListener("click", (event) => {
  if (event.target === bouquetModal) closeBouquetModal();
});

// Parallax scroll
window.addEventListener("scroll", () => {
  const offset = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0);
    item.style.transform = `translateY(${offset * speed}px)`;
  });
});
