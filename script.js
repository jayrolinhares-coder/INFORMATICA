// ===== PARTICLE BACKGROUND =====
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 160 : 260; // cyan or purple
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6, 214, 160, ${0.08 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
  const typedEl = document.querySelector('.typed-text');
  if (!typedEl) return;

  const phrases = [
    'Técnico de Informática',
    'Herói da Tecnologia',
    'Mago dos Computadores',
    'Guardião da Rede',
    'Domador de Bugs'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }
  type();
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      counter.textContent = current.toLocaleString('pt-BR') + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    requestAnimationFrame(updateCounter);
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Trigger counter animation
          if (entry.target.classList.contains('about-stats')) {
            animateCounters();
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll, .timeline-item, .about-stats').forEach(el => {
    observer.observe(el);
  });
}

// ===== PUN CARDS REVEAL =====
function initPunCards() {
  document.querySelectorAll('.pun-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('revealed');
    });
  });
}

// ===== LIGHTBOX =====
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ===== QUIZ =====
function initQuiz() {
  const quizData = [
    {
      question: 'O que significa a sigla "RAM" em informática?',
      options: [
        'Rede de Acesso Múltiplo',
        'Random Access Memory',
        'Registro Automático de Memória',
        'Rápido e Muito Bom'
      ],
      correct: 1,
      explanation: 'RAM significa "Random Access Memory" (Memória de Acesso Aleatório). É a memória volátil do computador que armazena dados temporariamente enquanto estão em uso.'
    },
    {
      question: 'Qual é a função principal do processador (CPU)?',
      options: [
        'Armazenar arquivos permanentemente',
        'Exibir imagens na tela',
        'Processar instruções e realizar cálculos',
        'Conectar à internet'
      ],
      correct: 2,
      explanation: 'A CPU (Central Processing Unit) é o "cérebro" do computador, responsável por processar todas as instruções e realizar cálculos necessários para o funcionamento do sistema.'
    },
    {
      question: 'O que é um "backup"?',
      options: [
        'Um tipo de vírus de computador',
        'Uma cópia de segurança dos dados',
        'Uma peça do hardware',
        'Um programa de edição de texto'
      ],
      correct: 1,
      explanation: 'Backup é uma cópia de segurança dos dados importantes. Todo técnico sabe: "Quem não faz backup, chora em dobro!" 😅'
    },
    {
      question: 'O que a sigla "SSD" representa?',
      options: [
        'Sistema de Segurança Digital',
        'Super Speed Drive',
        'Solid State Drive',
        'Software de Sistema Dinâmico'
      ],
      correct: 2,
      explanation: 'SSD significa "Solid State Drive" (Unidade de Estado Sólido). É mais rápido que o HD convencional porque não possui partes mecânicas móveis.'
    },
    {
      question: 'Qual atalho do teclado é usado para "Desfazer" uma ação?',
      options: [
        'Ctrl + C',
        'Ctrl + V',
        'Ctrl + Z',
        'Ctrl + X'
      ],
      correct: 2,
      explanation: 'Ctrl + Z é o atalho universal para desfazer. É o melhor amigo de todo técnico – se a vida tivesse Ctrl+Z, seria bem mais fácil! 😄'
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  const questionEl = document.querySelector('.quiz-question');
  const optionsEl = document.querySelector('.quiz-options');
  const feedbackEl = document.querySelector('.quiz-feedback');
  const nextBtn = document.getElementById('quiz-next');
  const resultEl = document.querySelector('.quiz-result');
  const scoreEl = document.querySelector('.quiz-score');
  const scoreLabelEl = document.querySelector('.quiz-score-label');
  const progressSteps = document.querySelectorAll('.quiz-progress .step');

  if (!questionEl) return;

  function loadQuestion() {
    answered = false;
    feedbackEl.classList.remove('show', 'correct', 'wrong');
    nextBtn.style.display = 'none';

    const q = quizData[currentQuestion];
    questionEl.innerHTML = `<span class="q-number">Pergunta ${currentQuestion + 1} de ${quizData.length}</span>${q.question}`;

    optionsEl.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((option, i) => {
      const div = document.createElement('div');
      div.className = 'quiz-option';
      div.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${option}</span>`;
      div.addEventListener('click', () => selectAnswer(i));
      optionsEl.appendChild(div);
    });

    // Update progress
    progressSteps.forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i < currentQuestion) step.classList.add('completed');
      if (i === currentQuestion) step.classList.add('active');
    });
  }

  function selectAnswer(index) {
    if (answered) return;
    answered = true;

    const q = quizData[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');

    options[index].classList.add(index === q.correct ? 'correct' : 'wrong');
    if (index !== q.correct) {
      options[q.correct].classList.add('correct');
    }

    if (index === q.correct) {
      score++;
      feedbackEl.className = 'quiz-feedback show correct';
      feedbackEl.innerHTML = `✅ Correto! ${q.explanation}`;
    } else {
      feedbackEl.className = 'quiz-feedback show wrong';
      feedbackEl.innerHTML = `❌ Ops! ${q.explanation}`;
    }

    nextBtn.style.display = 'inline-flex';
    nextBtn.textContent = currentQuestion < quizData.length - 1 ? 'Próxima →' : 'Ver Resultado';
  }

  nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      showResult();
    }
  });

  function showResult() {
    document.querySelector('.quiz-question').style.display = 'none';
    optionsEl.style.display = 'none';
    feedbackEl.style.display = 'none';
    nextBtn.style.display = 'none';
    document.querySelector('.quiz-progress').style.display = 'none';

    resultEl.classList.add('show');
    scoreEl.textContent = `${score}/${quizData.length}`;

    const percentage = (score / quizData.length) * 100;
    let message = '';
    if (percentage === 100) {
      message = '🏆 Perfeito! Você é um verdadeiro Técnico de Informática! Seu computador nunca vai travar!';
    } else if (percentage >= 60) {
      message = '👏 Muito bem! Você tem bons conhecimentos. Só não tenta formatar o PC usando um martelo! 🔨';
    } else {
      message = '💡 Continue estudando! Todo expert já foi um iniciante. Lembre-se: Ctrl+Z é seu melhor amigo!';
    }

    scoreLabelEl.innerHTML = message;

    const restartBtn = document.getElementById('quiz-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        resultEl.classList.remove('show');
        document.querySelector('.quiz-question').style.display = '';
        optionsEl.style.display = '';
        feedbackEl.style.display = '';
        document.querySelector('.quiz-progress').style.display = '';
        loadQuestion();
      });
    }
  }

  loadQuestion();
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===== EASTER EGG: Konami Code =====
function initEasterEgg() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        document.body.style.transition = '0.5s';
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
          alert('🎮 Easter Egg ativado! Você é um verdadeiro geek! O Konami Code funciona até aqui! 🕹️');
          document.body.style.filter = '';
        }, 500);
      }
    } else {
      konamiIndex = 0;
    }
  });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollProgress();
  initNavbar();
  initTypingEffect();
  initScrollAnimations();
  initPunCards();
  initLightbox();
  initQuiz();
  initBackToTop();
  initSmoothScroll();
  initEasterEgg();
});
