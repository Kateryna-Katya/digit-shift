document.addEventListener('DOMContentLoaded', () => {

  // --- 1. ПЛАВНЫЙ СКРОЛЛ (LENIS) ---
  if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
      });

      function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
              e.preventDefault();
              const targetId = this.getAttribute('href');
              if (targetId === '#') return;
              const targetElement = document.querySelector(targetId);
              if(targetElement) {
                  lenis.scrollTo(targetElement, { offset: -80 });
                  // Закрытие меню
                  const burgerBtn = document.getElementById('burger-btn');
                  const navMenu = document.getElementById('nav-menu');
                  const body = document.body;
                  if(burgerBtn && burgerBtn.classList.contains('active')){
                      burgerBtn.classList.remove('active');
                      navMenu.classList.remove('active');
                      body.classList.remove('nav-open');
                  }
              }
          });
      });
  } else {
      console.warn('Lenis не найден.');
  }


  // --- 2. АНИМАЦИИ (GSAP) ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // A. Hero Section
      const tlHero = gsap.timeline({ defaults: { ease: "power3.out" } });
      if(document.querySelector('.hero__label')) tlHero.from('.hero__label', { y: 20, opacity: 0, duration: 0.8, delay: 0.2 });
      if(document.querySelector('.hero__title .line')) tlHero.from('.hero__title .line', { y: 100, opacity: 0, duration: 1, stagger: 0.15 }, "-=0.6");
      if(document.querySelector('.hero__desc')) tlHero.from('.hero__desc', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");
      if(document.querySelector('.hero__actions')) tlHero.from('.hero__actions', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");
      if(document.querySelector('.hero__box')) tlHero.from('.hero__box', { rotation: -45, scale: 0, opacity: 0, duration: 1.2 }, "-=1");

      // B. Заголовки (с проверкой)
      document.querySelectorAll('.section').forEach(section => {
          const title = section.querySelector('.section__title');
          const line = section.querySelector('.section__line');

          if (title) {
              gsap.from(title, {
                  scrollTrigger: { trigger: section, start: "top 85%" },
                  y: 30, opacity: 0, duration: 0.8
              });
          }
          if (line) {
              gsap.from(line, {
                  scrollTrigger: { trigger: section, start: "top 85%" },
                  width: 0, duration: 1, delay: 0.2
              });
          }
      });

      // C. ПРЕИМУЩЕСТВА (BENEFITS)
      const benefitCards = document.querySelectorAll('.benefit-card');
      const benefitsSection = document.querySelector('#benefits');

      if (benefitCards.length > 0 && benefitsSection) {
          gsap.from(benefitCards, {
              scrollTrigger: {
                  trigger: benefitsSection,
                  start: "top 80%", // Запуск раньше
              },
              y: 50,
              opacity: 0,
              duration: 0.8,
              stagger: 0.2,
              clearProps: "all" // ВАЖНО: Удаляет стили после анимации
          });
      }

      // D. БЛОГ (BLOG) - ИСПРАВЛЕНО
      const blogCards = document.querySelectorAll('.blog-card');
      const blogSection = document.querySelector('#blog');

      if (blogCards.length > 0 && blogSection) {
           gsap.from(blogCards, {
              scrollTrigger: {
                  trigger: blogSection,
                  start: "top 80%", // Запуск раньше
              },
              y: 50,
              opacity: 0,
              duration: 0.8,
              stagger: 0.2,
              clearProps: "all" // ВАЖНО: Теперь блог точно появится
          });
      }

  }


  // --- 3. ИНТЕРАКТИВ (МЕНЮ И ФОРМА) ---
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const body = document.body;

  if (burgerBtn && navMenu) {
      burgerBtn.addEventListener('click', () => {
          burgerBtn.classList.toggle('active');
          navMenu.classList.toggle('active');
          body.classList.toggle('nav-open');
      });
  }

  // Форма
  const form = document.getElementById('contact-form');
  if (form) {
      const phoneInput = document.getElementById('phone');
      const captchaInput = document.getElementById('captcha');
      const captchaLabel = document.getElementById('captcha-math');
      const formStatus = document.getElementById('form-status');

      let num1 = Math.floor(Math.random() * 10) + 1;
      let num2 = Math.floor(Math.random() * 10) + 1;
      if(captchaLabel) captchaLabel.textContent = `${num1} + ${num2}`;

      if(phoneInput) {
          phoneInput.addEventListener('input', function(e) {
              this.value = this.value.replace(/[^0-9]/g, '');
          });
      }

      form.addEventListener('submit', function(e) {
          e.preventDefault();
          document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
          let isValid = true;

          const name = document.getElementById('name');
          const email = document.getElementById('email');
          const policy = document.getElementById('policy');

          if(name && name.value.trim() === '') {
              document.getElementById('name-error').textContent = 'Введите имя';
              isValid = false;
          }
          if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
              document.getElementById('email-error').textContent = 'Некорректный email';
              isValid = false;
          }
          if(phoneInput && phoneInput.value.length < 10) {
              document.getElementById('phone-error').textContent = 'Минимум 10 цифр';
              isValid = false;
          }
          if(captchaInput && parseInt(captchaInput.value) !== (num1 + num2)) {
              document.getElementById('captcha-error').textContent = 'Ошибка';
              isValid = false;
          }
          if(policy && !policy.checked) {
              document.getElementById('policy-error').textContent = 'Требуется согласие';
              isValid = false;
          }

          if(isValid) {
              const btn = form.querySelector('button');
              const originalText = btn.textContent;
              btn.textContent = 'Отправка...';
              btn.disabled = true;

              setTimeout(() => {
                  btn.textContent = originalText;
                  btn.disabled = false;
                  if(formStatus) {
                      formStatus.textContent = 'Спасибо! Мы свяжемся с вами.';
                      formStatus.style.color = 'green';
                      setTimeout(() => { formStatus.textContent = ''; }, 3000);
                  }
                  form.reset();
                  num1 = Math.floor(Math.random() * 10) + 1;
                  num2 = Math.floor(Math.random() * 10) + 1;
                  if(captchaLabel) captchaLabel.textContent = `${num1} + ${num2}`;
              }, 1500);
          }
      });
  }

  // Cookie
  const cookiePopup = document.getElementById('cookie-popup');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookiePopup && cookieAccept && !localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => cookiePopup.classList.add('active'), 2000);
      cookieAccept.addEventListener('click', () => {
          localStorage.setItem('cookiesAccepted', 'true');
          cookiePopup.classList.remove('active');
      });
  }
});