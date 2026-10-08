/* ═══════════════════════════════════════════════════════════════
   ABHINIT KUMAR PORTFOLIO – script.js
   All interactions, animations, typed text, counters, 3D card
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Page load animation ── */
    document.body.classList.add('page-is-loaded');

    /* ══════════════════════════════════════════
       1. THEME TOGGLE
    ══════════════════════════════════════════ */
    const themeToggle = document.getElementById('themeToggle');
    const docEl = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'dark') {
            docEl.setAttribute('data-theme', 'dark');
            themeToggle.querySelector('i').className = 'fas fa-sun';
        } else {
            docEl.removeAttribute('data-theme');
            themeToggle.querySelector('i').className = 'fas fa-moon';
        }
    }

    // Init
    applyTheme(localStorage.getItem('theme') || 'light');

    themeToggle.addEventListener('click', () => {
        const isDark = docEl.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
    });

    /* ══════════════════════════════════════════
       2. NAVBAR – scroll shrink & active link
    ══════════════════════════════════════════ */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        updateActiveNav();
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    /* ══════════════════════════════════════════
       3. HAMBURGER MENU
    ══════════════════════════════════════════ */
    const hamburger = document.getElementById('hamburger');
    const navLinkList = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        const open = navLinkList.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
    });

    // Close on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinkList.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    /* ══════════════════════════════════════════
       4. TYPED TEXT EFFECT
    ══════════════════════════════════════════ */
    const phrases = [
        'Software Engineer (New Grad)',
        'Full-Stack Developer',
        'React & Node.js Developer',
        'DSA Enthusiast'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedEl = document.getElementById('typedText');

    function type() {
        if (!typedEl) return;
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 50 : 80;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 300;
        }

        setTimeout(type, delay);
    }
    setTimeout(type, 500);

    /* ══════════════════════════════════════════
       5. STATS COUNTER ANIMATION
    ══════════════════════════════════════════ */
    const statCards = document.querySelectorAll('.stat-card');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        const statsSection = document.getElementById('stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
            countersStarted = true;
            statCards.forEach(card => {
                const target = parseFloat(card.dataset.count);
                const decimal = parseInt(card.dataset.decimal || 0);
                const counterEl = card.querySelector('.counter');
                const duration = 1800;
                const step = 16;
                const increment = target / (duration / step);
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counterEl.textContent = decimal > 0
                        ? current.toFixed(decimal)
                        : Math.floor(current);
                }, step);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters(); // Run immediately in case already in view

    /* ══════════════════════════════════════════
       6. INTERSECTION OBSERVER – entrance animations
    ══════════════════════════════════════════ */
    const animatables = document.querySelectorAll(
        '.stat-card, .skill-category, .project-card, .achievement-card, ' +
        '.timeline-item, .education-card, .contact-card, .learning-item, ' +
        '.about-text, .about-card, .hero-content, .cert-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${i * 0.05}s`;
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatables.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    /* ══════════════════════════════════════════
       7. 3D PROFILE CARD & CARDS TILT – mouse follow tilt
    ══════════════════════════════════════════ */
    const card3d = document.getElementById('profileCard3d');
    const cardLight = document.getElementById('cardLight');
    const isMobile = () => window.innerWidth <= 768;

    if (card3d) {
        card3d.addEventListener('mousemove', (e) => {
            if (isMobile()) return;

            const rect = card3d.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateY = ((x - cx) / cx) * 12;
            const rotateX = -((y - cy) / cy) * 8;

            card3d.style.animation = 'none';
            card3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

            // Light cursor follow
            if (cardLight) {
                cardLight.style.left = `${x}px`;
                cardLight.style.top = `${y}px`;
            }
        });

        card3d.addEventListener('mouseleave', () => {
            card3d.style.animation = 'cardFloat 6s ease-in-out infinite';
            card3d.style.transform = '';
        });
    }

    // 3D tilt for Project and Certification Cards
    const tiltCards = document.querySelectorAll('.project-card, .cert-card, .achievement-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (isMobile()) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateY = ((x - cx) / cx) * 8;
            const rotateX = -((y - cy) / cy) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ══════════════════════════════════════════
       8. BACK TO TOP BUTTON
    ══════════════════════════════════════════ */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ══════════════════════════════════════════
       9. SMOOTH SCROLL for anchor links
    ══════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navH = navbar ? navbar.offsetHeight : 68;
                const top = target.getBoundingClientRect().top + window.scrollY - navH;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ══════════════════════════════════════════
       10. NOTIFICATION HELPER
    ══════════════════════════════════════════ */
    function showNotification(message) {
        const backdrop = document.createElement('div');
        backdrop.className = 'notification-backdrop';
        document.body.appendChild(backdrop);

        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-rocket"></i>
                <span>${message}</span>
            </div>`;
        document.body.appendChild(notif);

        requestAnimationFrame(() => {
            backdrop.classList.add('show');
            notif.classList.add('show');
        });

        setTimeout(() => {
            notif.classList.remove('show');
            backdrop.classList.remove('show');
            setTimeout(() => { notif.remove(); backdrop.remove(); }, 400);
        }, 2200);
    }

    /* ══════════════════════════════════════════
       11. PROJECT CARD HOVER EFFECT – skill tags
    ══════════════════════════════════════════ */
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.setProperty('--accent-glow', '1');
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--accent-glow', '0');
        });
    });

    /* ══════════════════════════════════════════
       12. RESUME DOWNLOAD (placeholder – user can link actual file)
    ══════════════════════════════════════════ */
    const resumeBtn = document.getElementById('download-resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('resume.html', '_blank');
            showNotification('Opening Abhinit Kumar\'s Resume...');
        });
    }

    /* ══════════════════════════════════════════
       13. FLOATING TOYS (preserved from original)
    ══════════════════════════════════════════ */
    const floatingToys = document.querySelector('.floating-toys');
    if (floatingToys) {
        floatingToys.classList.add('fast-toys');
    }

    /* ══════════════════════════════════════════
       14. DATE & TIME (for any page that has it)
    ══════════════════════════════════════════ */
    const dateEl = document.getElementById('current-date');
    const timeEl = document.getElementById('current-time');

    function updateDateTime() {
        const now = new Date();
        if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (timeEl) timeEl.textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    if (dateEl || timeEl) {
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    /* ══════════════════════════════════════════
       15. PAGE TRANSITION for internal links
    ══════════════════════════════════════════ */
    document.querySelectorAll('a:not([href^="#"]):not([href^="http"]):not([href^="mailto"]):not([href^="tel"])').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.target === '_blank') return;
            e.preventDefault();
            const href = link.getAttribute('href');
            document.body.classList.add('page-transition-out');
            setTimeout(() => { window.location.href = href; }, 500);
        });
    });

    /* ══════════════════════════════════════════
       16. PROJECTS DATA (for any legacy menu usage)
    ══════════════════════════════════════════ */
    const projects = [
        {
            title: 'Hostel Meal ON/OFF Tracker',
            description: 'Real-time full-stack PWA used daily by 50+ hostel students.',
            technologies: ['React', 'Firebase Auth', 'Cloud Firestore', 'PWA'],
            demoLink: 'https://meal-production-f164.up.railway.app/',
            githubLink: '#',
            moreLink: '#'
        },
        {
            title: 'LoanFlow / Zetheta WorkBridge',
            description: 'Web-based loan and workflow management platform.',
            technologies: ['Next.js', 'Node.js', 'Express', 'MongoDB'],
            demoLink: 'https://loan-flow-ashy.vercel.app/',
            githubLink: 'https://loan-flow-ashy.vercel.app/',
            moreLink: '#'
        },
        {
            title: 'Digital Twin – Water Tank Simulation',
            description: 'Software-only Digital Twin simulating a water-tank system.',
            technologies: ['Software Simulation', 'System Modeling', 'Visualization'],
            demoLink: '#',
            githubLink: '#',
            moreLink: '#'
        },
        {
            title: 'Bank & ATM Management System',
            description: 'File-based CLI banking application with OOP principles.',
            technologies: ['C++', 'OOP', 'File Handling'],
            demoLink: './ytport/2025port/atm/index.html',
            githubLink: '#',
            moreLink: '#'
        },
        {
            title: 'DSA Learning Challenge App',
            description: 'Gamified DSA learning platform with Flutter and Firebase.',
            technologies: ['Flutter', 'Firebase'],
            demoLink: '#',
            githubLink: '#',
            moreLink: '#'
        },
        {
            title: 'Portfolio / Profile Card',
            description: 'Personal portfolio showcasing projects and skills.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Next.js'],
            demoLink: './index.html',
            githubLink: '#',
            moreLink: '#'
        }
    ];

    // Expose projects globally in case legacy pages need it
    window.portfolioProjects = projects;

    /* ══════════════════════════════════════════
       17. SKILL TAG HOVER – subtle ripple
    ══════════════════════════════════════════ */
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.style.transform = 'scale(0.95)';
            setTimeout(() => tag.style.transform = '', 150);
        });
    });

    /* ══════════════════════════════════════════
       18. PROFILE IMAGE ENLARGE ON HOVER & CLICK
    ══════════════════════════════════════════ */
    const imgPreviewOverlay = document.getElementById('imgPreviewOverlay');
    const imgPreviewClose = document.getElementById('imgPreviewClose');
    const navAvatar = document.querySelector('.nav-avatar');
    const cardPhoto = document.querySelector('.card-photo');

    let hoverTimer = null;

    function openImgPreview() {
        if (imgPreviewOverlay) {
            imgPreviewOverlay.classList.add('show');
        }
    }

    function closeImgPreview() {
        if (imgPreviewOverlay) {
            imgPreviewOverlay.classList.remove('show');
        }
    }

    const triggerElements = [navAvatar, cardPhoto].filter(Boolean);

    triggerElements.forEach(element => {
        // Hover trigger with smooth delay
        element.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => {
                openImgPreview();
            }, 180);
        });

        element.addEventListener('mouseleave', () => {
            if (hoverTimer) clearTimeout(hoverTimer);
        });

        // Click trigger for instant enlarged view
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            openImgPreview();
        });
    });

    if (imgPreviewClose) {
        imgPreviewClose.addEventListener('click', closeImgPreview);
    }

    if (imgPreviewOverlay) {
        imgPreviewOverlay.addEventListener('click', (e) => {
            if (e.target === imgPreviewOverlay) closeImgPreview();
        });
    }

    console.log('✅ Portfolio JS initialized – Abhinit Kumar');

}); // end DOMContentLoaded