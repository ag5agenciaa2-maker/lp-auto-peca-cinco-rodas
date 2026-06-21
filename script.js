/* ============================================================
   AUTO PEÇAS CINCO RODAS — interactions
   ============================================================ */

(function () {
  'use strict';

  // ---------- year ----------
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- nav stuck + mobile burger + premium drawer ----------
  const nav = document.getElementById('nav');
  const burger = nav && nav.querySelector('.nav__burger');
  const drawer = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  /* PageSpeed fix: rAF batching evita forced reflow */
  let rafPending = false;
  const onScroll = () => {
    if (!nav || rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      nav.classList.toggle('is-stuck', window.scrollY > 50);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const openDrawer = () => {
    if (!drawer || !drawerOverlay) return;
    drawer.classList.add('is-active');
    drawerOverlay.classList.add('is-active');
    drawer.setAttribute('aria-hidden', 'false');
    drawerOverlay.setAttribute('aria-hidden', 'false');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };

  const closeDrawer = () => {
    if (!drawer || !drawerOverlay) return;
    drawer.classList.remove('is-active');
    drawerOverlay.classList.remove('is-active');
    drawer.setAttribute('aria-hidden', 'true');
    drawerOverlay.setAttribute('aria-hidden', 'true');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  if (burger) {
    burger.addEventListener('click', openDrawer);
  }
  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  if (drawer) {
    drawer.querySelectorAll('.drawer__links a, .drawer__footer a').forEach(a => {
      a.addEventListener('click', closeDrawer);
    });
  }

  // ---------- reveal-on-scroll ----------
  // Apply `reveal` class to common content blocks, then observe.
  const revealSelectors = [
    '.section__head',
    '.impact__copy', '.impact__item',
    '.service',
    '.bento__cell',
    '.vcard',
    '.about__copy', '.about__media',
    '.reviews__head', '.quote', '.carousel__controls',
    '.faq__header', '.faq__item',
    '.loc__copy', '.loc__map',
    '.cta__copy', '.cta__form',
    '.foot__grid > *'
  ];
  /* PageSpeed fix: stagger via dataset em vez de style inline (evita forced reflow) */
  document.querySelectorAll(revealSelectors.join(',')).forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.delay = ((i % 8) * 60);
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- animated counters ----------
  const counters = document.querySelectorAll('[data-count]');
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1500;
      const t0 = performance.now();

      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const v = target * easeOut(p);
        el.textContent = (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('pt-BR')) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => countObserver.observe(c));

  // ---------- reviews carousel (ultra-premium grid) ----------
  const reviewsGrid = document.getElementById('reviewsGrid');
  const reviewsDots = document.getElementById('reviewsDots');
  const reviewsPrev = document.getElementById('reviewsPrev');
  const reviewsNext = document.getElementById('reviewsNext');

  if (reviewsGrid && reviewsDots) {
    const allQuotes = Array.from(reviewsGrid.querySelectorAll('.quote'));
    const totalQuotes = allQuotes.length;
    let currentPage = 0;
    let reviewsTimer = null;

    // Determina quantos cards mostrar por página conforme largura
    const getPerPage = () => window.innerWidth <= 1024 ? (window.innerWidth <= 640 ? 1 : 2) : 3;
    let perPage = getPerPage();
    let totalPages = Math.ceil(totalQuotes / perPage);

    // Cria dots
    const buildDots = () => {
      reviewsDots.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Página ' + (i + 1) + ' de avaliações');
        b.addEventListener('click', () => goToPage(i, true));
        reviewsDots.appendChild(b);
      }
    };
    buildDots();

    const render = () => {
      const dots = Array.from(reviewsDots.children);
      dots.forEach((d, i) => d.classList.toggle('is-active', i === currentPage));

      // Mostra/esconde cards com transição suave
      allQuotes.forEach((q, i) => {
        const start = currentPage * perPage;
        const end = start + perPage;
        const visible = i >= start && i < end;
        q.style.display = visible ? '' : 'none';
        q.style.opacity = visible ? '1' : '0';
        q.style.transform = visible ? 'translateY(0)' : 'translateY(12px)';
      });
    };

    const goToPage = (page, user) => {
      currentPage = (page + totalPages) % totalPages;
      render();
      if (user) restartReviews();
    };

    if (reviewsPrev) {
      reviewsPrev.addEventListener('click', () => goToPage(currentPage - 1, true));
    }
    if (reviewsNext) {
      reviewsNext.addEventListener('click', () => goToPage(currentPage + 1, true));
    }

    const startReviews = () => { reviewsTimer = setInterval(() => goToPage(currentPage + 1), 8000); };
    const stopReviews  = () => { if (reviewsTimer) clearInterval(reviewsTimer); };
    const restartReviews = () => { stopReviews(); startReviews(); };

    reviewsGrid.addEventListener('mouseenter', stopReviews);
    reviewsGrid.addEventListener('mouseleave', startReviews);

    // Recalcula em resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        perPage = getPerPage();
        totalPages = Math.ceil(totalQuotes / perPage);
        currentPage = Math.min(currentPage, totalPages - 1);
        buildDots();
        render();
      }, 250);
    });

    render();
    startReviews();
  }

  // ---------- FAQ accordion ultra-premium ----------
  const faqItems = document.querySelectorAll('.faq__item');
  if (faqItems.length) {
    const closeAllFaq = (except) => {
      faqItems.forEach(other => {
        if (other !== except && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          const otherBtn = other.querySelector('.faq__question');
          const otherAns = other.querySelector('.faq__answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = '0px';
        }
      });
    };

    faqItems.forEach(item => {
      const btn = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains('is-open');

        closeAllFaq(item);

        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = '0px';
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.faq__item')) {
        faqItems.forEach(other => {
          if (other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            const otherBtn = other.querySelector('.faq__question');
            const otherAns = other.querySelector('.faq__answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.style.maxHeight = '0px';
          }
        });
      }
    });

    // Fecha ao pressionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        faqItems.forEach(other => {
          if (other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            const otherBtn = other.querySelector('.faq__question');
            const otherAns = other.querySelector('.faq__answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.style.maxHeight = '0px';
          }
        });
      }
    });
  }

  // ---------- form validation + WhatsApp redirect ----------
  const form = document.getElementById('ctaForm');
  const ok   = document.getElementById('ctaSuccess');
  const WHATSAPP_NUMBER = '5521970368167';

  // Máscara de telefone com DDD — formato (XX) XXXXX-XXXX
  const telInput = document.getElementById('telInput');
  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 7) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
      } else if (v.length > 2) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
      } else if (v.length > 0) {
        v = '(' + v;
      }
      e.target.value = v;
    });
  }

  if (form) {
    const validate = (input) => {
      const label = input.closest('label');
      if (!label) return true;
      const valid = input.checkValidity();
      label.classList.toggle('is-invalid', !valid);
      const errSlot = label.querySelector('.err');
      if (errSlot) {
        if (!valid) {
          if (input.validity.valueMissing) errSlot.textContent = 'Campo obrigatório';
          else if (input.validity.tooShort) errSlot.textContent = 'Muito curto';
          else if (input.validity.patternMismatch) errSlot.textContent = 'Formato inválido';
          else if (input.validity.typeMismatch) errSlot.textContent = 'Formato inválido';
          else errSlot.textContent = 'Confira o campo';
        } else {
          errSlot.textContent = '';
        }
      }
      return valid;
    };

    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', () => validate(input));
      input.addEventListener('input', () => {
        if (input.closest('label').classList.contains('is-invalid')) validate(input);
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
          if (input.closest('label').classList.contains('is-invalid')) validate(input);
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allOk = true;
      form.querySelectorAll('input, textarea, select').forEach(input => {
        if (!validate(input)) allOk = false;
      });
      if (!allOk) {
        const firstBad = form.querySelector('.is-invalid input, .is-invalid textarea, .is-invalid select');
        if (firstBad) firstBad.focus();
        return;
      }

      const nome    = (form.nome.value || '').trim();
      const email   = (form.email.value || '').trim();
      const tel     = (form.tel.value || '').trim();
      const assunto = (form.assunto.value || '').trim();
      const msg     = (form.msg.value || '').trim();

      let text = `Olá, me chamo ${nome}, vim através do site e gostaria de uma informação.`;
      text += `\n\n- E-mail: ${email}`;
      text += `\n- Telefone: ${tel}`;
      text += `\n- Serviço: ${assunto}`;
      if (msg) {
        text += `\n- Situação: ${msg}`;
      }

      const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank');

      if (ok) {
        ok.hidden = false;
        form.reset();
        setTimeout(() => { ok.hidden = true; }, 6000);
      }
    });
  }

  // ---------- smooth-scroll offset for fixed nav ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---------- WhatsApp Premium Experience (AG5 V4 — gatilho por viewport) ----------
  const initWaPremium = () => {
    // Mecânica/oficina = nicho TRANQUILO (não regulado) → badge habilitado
    const MODO_COMPLIANCE = false;

    const bubble        = document.getElementById('wa-message-bubble');
    const typing        = document.getElementById('wa-typing');
    const realMessage   = document.getElementById('wa-real-message');
    const badge         = document.getElementById('wa-notification');
    const closeBtn      = document.getElementById('wa-close-btn');
    const mainBtn       = document.getElementById('wa-main-btn');
    const targetSection = document.getElementById('servicos'); // 3ª seção (hero → impacto → serviços)

    if (!bubble || !typing || !realMessage || !closeBtn || !mainBtn || !targetSection) return;

    const DELAY_BALAO            = 25000; // 25s após entrar na seção
    const DURATION_TYPING        = 2500;  // 2.5s de "digitando..."
    const DURATION_BALAO_VISIVEL = 15000; // 15s exibido depois de aparecer
    const DELAY_BADGE_APOS_SUMIR = 5000;  // 5s após sumir → badge

    let triggered = false;
    let autoHideTimer = null;
    let badgeTimer = null;
    let userClosed = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;

          // Botão flutuante aparece imediatamente
          mainBtn.classList.add('visible');

          // t=25s → balão sobe
          setTimeout(() => {
            if (userClosed) return;
            bubble.classList.add('show');

            // 2.5s de "digitando..." → mensagem real (classes utilitárias, sem inline style)
            setTimeout(() => {
              if (userClosed) return;
              typing.classList.add('is-hidden');
              realMessage.classList.add('is-visible');
              requestAnimationFrame(() => realMessage.classList.add('is-in'));
            }, DURATION_TYPING);

            // t=40s → balão some automaticamente
            autoHideTimer = setTimeout(() => {
              if (userClosed) return;
              bubble.classList.remove('show');

              // t=45s → badge "1" aparece (só se NÃO for Compliance)
              if (!MODO_COMPLIANCE && badge) {
                badgeTimer = setTimeout(() => {
                  if (userClosed) return;
                  badge.classList.add('show');
                }, DELAY_BADGE_APOS_SUMIR);
              }
            }, DURATION_BALAO_VISIVEL);
          }, DELAY_BALAO);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(targetSection);

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      userClosed = true;
      bubble.classList.remove('show');
      if (autoHideTimer) clearTimeout(autoHideTimer);
      if (badgeTimer) clearTimeout(badgeTimer);
      if (!MODO_COMPLIANCE && badge) {
        setTimeout(() => { badge.classList.add('show'); }, DELAY_BADGE_APOS_SUMIR);
      }
    });

    mainBtn.addEventListener('click', () => {
      bubble.classList.remove('show');
      if (badge) badge.classList.remove('show');
      if (autoHideTimer) clearTimeout(autoHideTimer);
      if (badgeTimer) clearTimeout(badgeTimer);
    });
  };

  // ---------- navbar spotlight effect (reactive mouse coordinates) ----------
  const initNavSpotlight = () => {
    const navEl = document.getElementById('nav');
    if (!navEl) return;
    navEl.addEventListener('mousemove', (e) => {
      const rect = navEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      navEl.style.setProperty('--mouse-x', `${x}px`);
      navEl.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  // ---------- interactive videos gallery (hover play + custom controls + premium popup) ----------
  const initVideosGallery = () => {
    const vcards = document.querySelectorAll('.vcard');
    const vpopup = document.getElementById('videoPopup');
    const vpopupClose = document.getElementById('videoPopupClose');
    const vpopupVideo = document.getElementById('vpopupVideo');
    const vpopupTitle = document.getElementById('vpopupTitle');
    let activeCardVideo = null; // Guarda referência do vídeo pequeno ativo que foi expandido

    if (!vcards.length) return;

    vcards.forEach(card => {
      const video = card.querySelector('video');
      const title = card.querySelector('h4') ? card.querySelector('h4').textContent : '5 Rodas';
      const playBtn = card.querySelector('.vctrl-play');
      const volBtn = card.querySelector('.vctrl-volume');
      const expandBtn = card.querySelector('.vctrl-expand');

      if (!video) return;

      // Pré-posiciona no frame 0.01s (primeiro frame colorido ativo) no carregamento para evitar a tela preta inicial
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = 0.01;
      });
      // Fallback caso a página carregue os metadados em cache de forma instantânea
      if (video.readyState >= 1) {
        video.currentTime = 0.01;
      }

      // 1. Play/Pause Customizado (apenas clique, sem hover)
      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Evita cliques fantasmas no card
          if (video.paused) {
            // Pausa todos os outros vídeos e reinicia do início
            vcards.forEach(otherCard => {
              const otherVideo = otherCard.querySelector('video');
              const otherPlayBtn = otherCard.querySelector('.vctrl-play');
              if (otherVideo && otherVideo !== video && !otherVideo.paused) {
                otherVideo.pause();
                otherVideo.currentTime = 0.01;
                if (otherPlayBtn) {
                  otherPlayBtn.querySelector('.icon-play').style.display = 'block';
                  otherPlayBtn.querySelector('.icon-pause').style.display = 'none';
                }
              }
            });
            video.play().catch(err => console.log('Play blocked:', err));
            playBtn.querySelector('.icon-play').style.display = 'none';
            playBtn.querySelector('.icon-pause').style.display = 'block';
          } else {
            video.pause();
            video.currentTime = 0.01;
            playBtn.querySelector('.icon-play').style.display = 'block';
            playBtn.querySelector('.icon-pause').style.display = 'none';
          }
        });
      }

      // 3. Volume Customizado (Mute/Unmute)
      if (volBtn) {
        volBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          video.muted = !video.muted;
          if (video.muted) {
            volBtn.querySelector('.icon-mute').style.display = 'block';
            volBtn.querySelector('.icon-unmute').style.display = 'none';
          } else {
            volBtn.querySelector('.icon-mute').style.display = 'none';
            volBtn.querySelector('.icon-unmute').style.display = 'block';
          }
        });
      }

      // 4. Expandir para o Popup Premium
      if (expandBtn) {
        expandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!vpopup || !vpopupVideo) return;

          activeCardVideo = video; // Salva o vídeo pequeno
          video.pause(); // Pausa o vídeo pequeno

          // Configura o Popup dinamicamente de acordo com a orientação do vídeo
          const isHorizontal = card.classList.contains('vcard--horizontal');
          if (isHorizontal) {
            vpopup.classList.add('is-horizontal');
          } else {
            vpopup.classList.remove('is-horizontal');
          }

          vpopupTitle.textContent = title;
          vpopupVideo.src = video.src;
          vpopupVideo.muted = false; // Abre com som!
          vpopupVideo.setAttribute('controls', 'true'); // Controles habilitados no popup de luxo
          vpopup.hidden = false;
          document.body.classList.add('no-scroll'); // Trava o scroll da página

          // Carrega e toca no popup
          vpopupVideo.load();
          vpopupVideo.play().catch(err => console.log('Popup video blocked:', err));
        });
      }
    });

    // 5. Controles de Fechamento do Popup Premium
    if (vpopup && vpopupVideo) {
      const closePopup = () => {
        vpopupVideo.pause();
        vpopupVideo.src = ''; // Limpa memória
        vpopup.hidden = true;
        vpopup.classList.remove('is-horizontal'); // Reseta a classe de orientação
        document.body.classList.remove('no-scroll'); // Destrava o scroll

        // Retoma o vídeo pequeno se o mouse ainda estiver sobre o card dele
        if (activeCardVideo) {
          const card = activeCardVideo.closest('.vcard');
          if (card && card.matches(':hover')) {
            activeCardVideo.play().catch(err => console.log('Resume blocked:', err));
            const playBtn = card.querySelector('.vctrl-play');
            if (playBtn) {
              playBtn.querySelector('.icon-play').style.display = 'none';
              playBtn.querySelector('.icon-pause').style.display = 'block';
            }
          }
          activeCardVideo = null;
        }
      };

      if (vpopupClose) vpopupClose.addEventListener('click', closePopup);
      vpopup.addEventListener('click', (e) => {
        // Se clicar fora do frame do vídeo (no overlay desfocado), fecha
        if (e.target === vpopup) closePopup();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !vpopup.hidden) closePopup();
      });
    }
  };

  // ---------- interactive 3d card tilt (física de inclinação 3d reativa ao mouse) ----------
  const init3DTiltPlayer = () => {
    const wrapper = document.querySelector('.experience__video-wrapper');
    if (!wrapper) return;
    
    const media = wrapper.closest('.experience__media');
    if (!media) return;

    // Desativa a física em dispositivos móveis por toque para poupar hardware e bateria
    const isMobile = () => window.matchMedia('(max-width: 1000px)').matches;

    media.addEventListener('mousemove', (e) => {
      if (isMobile()) return;

      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Converte coordenadas em rotação física sutil (limite ergonômico de 6 graus de inclinação)
      const rotateX = -(y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;
      
      // Aplica a transformação de rotação e leve escala tridimensional
      wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`;
      
      // Ajusta dinamicamente a sombra e o Ambilight dourado ativo no sentido oposto ao cursor
      wrapper.style.boxShadow = `
        ${-rotateY * 2.5}px ${rotateX * 2.5}px 65px rgba(0, 0, 0, 0.9),
        0 0 45px rgba(255, 210, 0, 0.08)
      `;
    });

    media.addEventListener('mouseleave', () => {
      // Amortecimento suave de retorno para o estado original neutro (Spring Back)
      wrapper.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      wrapper.style.boxShadow = '';
    });
  };
  // ---------- scroll triggered autoplay (play automático ao entrar na seção) ----------
  const initScrollPlay = () => {
    const section = document.getElementById('oficina-em-acao');
    if (!section) return;

    const video = section.querySelector('video');
    const playBtn = section.querySelector('.vctrl-play');
    if (!video) return;

    // Observer inteligente de visibilidade na viewport
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Quando a seção Oficina em Ação entra na viewport, dispara play automático silencioso
          if (video.paused) {
            video.play()
              .then(() => {
                if (playBtn) {
                  playBtn.querySelector('.icon-play').style.display = 'none';
                  playBtn.querySelector('.icon-pause').style.display = 'block';
                }
              })
              .catch(err => console.log('Scroll autoplay blocked:', err));
          }
        } else {
          // Quando a seção sai do campo de visão, pausa o vídeo para preservar recursos da GPU/CPU
          if (!video.paused) {
            video.pause();
            if (playBtn) {
              playBtn.querySelector('.icon-play').style.display = 'block';
              playBtn.querySelector('.icon-pause').style.display = 'none';
            }
          }
        }
      });
    }, { threshold: 0.35 }); // Gatilho ativo quando 35% do container da seção estiver visível

    scrollObserver.observe(section);
  };

  // ---------- parallax multicamadas nas rodas da hero (reativo ao mouse) ----------
  const initHeroWheelsParallax = () => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    if (window.matchMedia('(max-width: 1000px)').matches) return;

    const wheelLarge = hero.querySelector('.hero__wheel--large');
    const wheelSmall = hero.querySelector('.hero__wheel--small');
    const wheelGhost = hero.querySelector('.hero__wheel--ghost');

    if (!wheelLarge) return;

    // Fatores de paralaxe diferentes por camada (quanto maior, mais movimento)
    const FACTOR_LARGE = 0.018;  // Roda grande: movimento muito sutil
    const FACTOR_SMALL = -0.028; // Roda menor: direção oposta
    const FACTOR_GHOST = 0.042;  // Roda fantasma: maior movimento

    let currentX = 0, currentY = 0;
    let targetX  = 0, targetY  = 0;
    const LERP = 0.06; // suavização lenta e orgânica

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      // Normaliza: centro da hero = 0,0; bordas = ±0.5
      targetX = (e.clientX - rect.left - rect.width  / 2) / rect.width;
      targetY = (e.clientY - rect.top  - rect.height / 2) / rect.height;
    });

    hero.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    const animateWheels = () => {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;

      const tx = currentX * window.innerWidth;
      const ty = currentY * window.innerHeight;

      if (wheelLarge) {
        // Combina rotação da animação CSS com translação de parallax
        const translateX = tx * FACTOR_LARGE;
        const translateY = ty * FACTOR_LARGE;
        wheelLarge.style.marginLeft = translateX + 'px';
        wheelLarge.style.marginTop  = translateY + 'px';
      }

      if (wheelSmall) {
        const translateX = tx * FACTOR_SMALL;
        const translateY = ty * FACTOR_SMALL;
        wheelSmall.style.marginLeft = translateX + 'px';
        wheelSmall.style.marginTop  = translateY + 'px';
      }

      if (wheelGhost) {
        const translateX = tx * FACTOR_GHOST;
        const translateY = ty * FACTOR_GHOST;
        wheelGhost.style.marginLeft = translateX + 'px';
        wheelGhost.style.marginTop  = translateY + 'px';
      }

      requestAnimationFrame(animateWheels);
    };
    animateWheels();
  };

  initWaPremium();
  initNavSpotlight();
  initVideosGallery();
  init3DTiltPlayer();
  initScrollPlay();
  initHeroWheelsParallax();

  // Placeholder para futuras interações do grid bento
  const initBentoPremium = () => {};
  initBentoPremium();

})();

