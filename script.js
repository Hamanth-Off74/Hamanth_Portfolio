/**
 * Hamanth A's Portfolio - Innovative HUD Edition
 * Features Canvas Particles, Shell Command Parsing, 3D Tilts, and Stats Simulators.
 */

document.addEventListener('DOMContentLoaded', () => {

    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const header = document.getElementById('main-header');
    const scrollProgress = document.getElementById('scroll-progress');

    /* ==========================================================================
       1. SCROLL PROGRESS INDICATOR & HEADER SCROLL EFFECT
       ========================================================================== */
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. DARK / LIGHT THEME TOGGLE & PERSISTENCE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /* ==========================================================================
       3. MOBILE MENU DRAWER TOGGLE
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        const isOpen = mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        mobileNav.setAttribute('aria-hidden', !isOpen);
        
        if (isOpen) {
            bodyElement.style.overflow = 'hidden';
        } else {
            bodyElement.style.overflow = '';
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuBtn.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenuBtn.classList.contains('active')) {
            toggleMenu();
        }
    });

    /* ==========================================================================
       4. HERO SECTION TYPING EFFECT
       ========================================================================== */
    const typingTextEl = document.getElementById('typing-text');
    const roles = [
        "Full Stack Developer",
        "Problem Solver",
        "Tech Enthusiast",
        "B.E. CSE Student"
    ];
    
    let roleIndex = 0;
    charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    const runTypingLoop = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50;
        } else {
            typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeDelay = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeDelay = 500;
        }

        setTimeout(runTypingLoop, typeDelay);
    };

    setTimeout(runTypingLoop, 1000);

    /* ==========================================================================
       5. INTERACTIVE CANVAS PARTICLES (UPGRADED HUD SYSTEM)
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const maxParticles = 75;
    const connectionDistance = 115;
    
    const mouse = {
        x: null,
        y: null,
        radius: 140
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Spawn burst particles on click
    window.addEventListener('click', (event) => {
        // Prevent trigger if clicking on interactive elements (buttons, links, form inputs)
        if (event.target.closest('button, a, input, textarea, form')) return;
        
        const clickX = event.clientX;
        const clickY = event.clientY;
        const burstCount = 12;
        
        for (let i = 0; i < burstCount; i++) {
            particlesArray.push(new Particle(clickX, clickY, true));
        }
        
        // Prevent array size from exploding
        if (particlesArray.length > 200) {
            particlesArray = particlesArray.filter(p => !p.isDead).slice(-150);
        }
    });

    const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
        constructor(x, y, isClickBurst = false) {
            this.isClickBurst = isClickBurst;
            this.isDead = false;
            this.x = x !== undefined ? x : Math.random() * canvas.width;
            this.y = y !== undefined ? y : Math.random() * canvas.height;
            
            if (this.isClickBurst) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2.5 + 1.2;
                this.speedX = Math.cos(angle) * speed;
                this.speedY = Math.sin(angle) * speed;
                this.size = Math.random() * 3.5 + 1.5;
                this.life = 1.0;
                this.decay = Math.random() * 0.02 + 0.015;
            } else {
                this.size = Math.random() * 2.2 + 0.8;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.life = 1.0;
                this.decay = 0;
            }

            // Theme-appropriate colors (Cyan, Purple/Violet, Electric Blue)
            this.colorPalette = Math.floor(Math.random() * 3);
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.isClickBurst) {
                this.life -= this.decay;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            } else {
                // Bounce off canvas boundaries
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            // Mouse repulsion effect
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Push particles away gently
                    const repelFactor = this.isClickBurst ? 0.3 : 0.6;
                    this.x -= (dx / dist) * force * repelFactor;
                    this.y -= (dy / dist) * force * repelFactor;
                }
            }
        }

        draw() {
            if (this.isDead) return;
            
            const isDark = htmlElement.getAttribute('data-theme') === 'dark';
            let fillStyle;
            
            if (isDark) {
                if (this.colorPalette === 0) fillStyle = `rgba(0, 242, 254, ${this.life * 0.5})`; // Neon Cyan
                else if (this.colorPalette === 1) fillStyle = `rgba(124, 58, 237, ${this.life * 0.45})`; // Purple
                else fillStyle = `rgba(2, 84, 196, ${this.life * 0.55})`; // Blue
            } else {
                if (this.colorPalette === 0) fillStyle = `rgba(0, 180, 216, ${this.life * 0.4})`; // Cyan
                else if (this.colorPalette === 1) fillStyle = `rgba(109, 40, 217, ${this.life * 0.35})`; // Purple
                else fillStyle = `rgba(2, 84, 196, ${this.life * 0.45})`; // Blue
            }
            
            ctx.fillStyle = fillStyle;
            
            // Add soft glow to burst particles
            if (this.isClickBurst || this.size > 2.0) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = isDark ? 'rgba(0, 242, 254, 0.4)' : 'rgba(2, 84, 196, 0.2)';
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Reset glow
        }
    }

    const initParticles = () => {
        particlesArray = [];
        for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new Particle());
        }
    };
    initParticles();

    const connectParticles = () => {
        const isDark = htmlElement.getAttribute('data-theme') === 'dark';
        
        // Add mouse coordinates as a vertex in the constellation web
        const points = [...particlesArray];
        if (mouse.x !== null && mouse.y !== null) {
            points.push({
                x: mouse.x,
                y: mouse.y,
                size: 0,
                isMouse: true,
                life: 1.0,
                isDead: false
            });
        }

        for (let a = 0; a < points.length; a++) {
            if (points[a].isDead) continue;
            for (let b = a + 1; b < points.length; b++) {
                if (points[b].isDead) continue;
                if (points[a].isMouse && points[b].isMouse) continue;

                let dx = points[a].x - points[b].x;
                let dy = points[a].y - points[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                // Allow mouse to connect over slightly longer distance
                const currentDist = (points[a].isMouse || points[b].isMouse) ? 140 : connectionDistance;

                if (distance < currentDist) {
                    let baseOpacity = 1 - (distance / currentDist);
                    let opacity = baseOpacity * 0.16;
                    
                    // Fade lines of burst particles as they die
                    opacity *= Math.min(points[a].life, points[b].life);

                    if (points[a].isMouse || points[b].isMouse) {
                        ctx.strokeStyle = isDark 
                            ? `rgba(0, 242, 254, ${opacity * 1.5})` 
                            : `rgba(0, 180, 216, ${opacity * 0.95})`;
                        ctx.lineWidth = 1.1;
                    } else {
                        ctx.strokeStyle = isDark 
                            ? `rgba(2, 84, 196, ${opacity})` 
                            : `rgba(2, 84, 196, ${opacity * 0.55})`;
                        ctx.lineWidth = 0.8;
                    }
                    
                    ctx.beginPath();
                    ctx.moveTo(points[a].x, points[a].y);
                    ctx.lineTo(points[b].x, points[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animateParticles = () => {
        // Implement trails using destination-out composite mode
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';

        // Filter dead click bursts
        particlesArray = particlesArray.filter(p => !p.isDead);

        // Keep core particles count stable
        const activeNormalCount = particlesArray.filter(p => !p.isClickBurst).length;
        if (activeNormalCount < maxParticles) {
            particlesArray.push(new Particle());
        }

        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    };
    animateParticles();

    /* ==========================================================================
       6. LIVE STATS HUD SIMULATOR
       ========================================================================== */
    const pingVal = document.getElementById('ping-val');
    const cpuVal = document.getElementById('cpu-val');
    const ramVal = document.getElementById('ram-val');
    const hudFill = document.getElementById('hud-progress-fill');

    const updateHudStats = () => {
        // Random latency, RAM, and CPU fluctuations
        const ping = Math.floor(Math.random() * 8) + 8; // 8-15 ms
        const ram = Math.floor(Math.random() * 4) + 40;  // 40-43 %
        const cpu = Math.floor(Math.random() * 12) + 12; // 12-23 %

        if (pingVal) pingVal.textContent = `${ping} ms`;
        if (ramVal) ramVal.textContent = `${ram}%`;
        if (cpuVal) cpuVal.textContent = `${cpu}%`;
        if (hudFill) hudFill.style.width = `${cpu}%`;
    };

    setInterval(updateHudStats, 2000);

    /* ==========================================================================
       7. UPGRADED TERMINAL SHELL INPUT PARSER
       ========================================================================== */
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');

    const writeTerminalLine = (text, type = 'default') => {
        const line = document.createElement('div');
        line.classList.add('terminal-line');
        if (type !== 'default') {
            line.classList.add(`log-${type}`);
        }
        line.innerHTML = text;
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmdText = terminalInput.value.trim();
                terminalInput.value = '';

                // Echo typed command
                writeTerminalLine(`visitor@hamanth:~$ ${cmdText}`, 'default');

                if (cmdText === '') return;

                const command = cmdText.toLowerCase();

                // Process commands
                switch (command) {
                    case 'help':
                        writeTerminalLine('Available Diagnostics commands:', 'info');
                        writeTerminalLine('  about    - Show professional summary and introduction');
                        writeTerminalLine('  skills   - Lists technical skills and core concepts');
                        writeTerminalLine('  projects - Display information about completed projects');
                        writeTerminalLine('  contact  - Print direct connection details');
                        writeTerminalLine('  clear    - Clear terminal logs');
                        break;
                    case 'about':
                        writeTerminalLine('Full Stack Developer currently pursuing B.E. Computer Science. Skilled in designing RESTful APIs, securing client gateways (Razorpay), and maintaining scalable Node/Express & MongoDB web systems.', 'success');
                        break;
                    case 'skills':
                        writeTerminalLine('Core Proficiencies:', 'info');
                        writeTerminalLine('  Languages: Java, JavaScript (ES6+), C');
                        writeTerminalLine('  Frontend: HTML5, CSS3, React.js');
                        writeTerminalLine('  Backend: Node.js, Express.js, REST APIs');
                        writeTerminalLine('  Database: MongoDB, SQL');
                        writeTerminalLine('  Concepts: OOP, Version Control (Git/GitHub)');
                        break;
                    case 'projects':
                        writeTerminalLine('Primary Portfolio Projects:', 'info');
                        writeTerminalLine('  1. Sweet Cravings - Dessert Ordering E-Commerce Platform (React, Node, Express, MongoDB, Razorpay API)');
                        writeTerminalLine('  2. Farm Expense Tracker - Agricultural Accounting Dashboard (React, Node, Express, MongoDB)');
                        writeTerminalLine('  3. Ticket Booking System - Console booking application (Java, MVC, File Persistence)');
                        break;
                    case 'contact':
                        writeTerminalLine('Contact Nodes Available:', 'success');
                        writeTerminalLine('  Email: hamanthguru2005@gmail.com');
                        writeTerminalLine('  Phone: +91 8610047817');
                        writeTerminalLine('  GitHub: github.com/Hamanth-Off74');
                        writeTerminalLine('  LinkedIn: linkedin.com/in/hamanth-a-ba260a28a');
                        break;
                    case 'clear':
                        terminalBody.innerHTML = '';
                        writeTerminalLine('Console cleared. Type "help" for options.', 'info');
                        break;
                    default:
                        writeTerminalLine(`Command not found: "${cmdText}". Type "help" to display commands.`, 'error');
                }
            }
        });
    }

    /* ==========================================================================
       8. 3D CARD TILT & GLOW BOUNDARIES
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Get mouse position relative to card boundaries
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update CSS variables for border glow mask
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Compute tilt rotations (max rotation 7 degrees)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6; // Up/down tilt
            const rotateY = ((x - centerX) / centerX) * 6;  // Left/right tilt

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset transforms on exit
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });

    /* ==========================================================================
       9. ACTIVE LINK SCROLL OBSERVER & reveal animations
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillBars = document.querySelectorAll('.skill-progress');

    const navObserverOptions = {
        root: null,
        threshold: 0.3,
        rootMargin: "-10% 0px -40% 0px"
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    // Scroll Reveal Observers
    const revealObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                if (entry.target.id === 'skills' || entry.target.querySelector('.skill-progress')) {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => revealObserver.observe(element));

    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = level;
        });
    };

    /* ==========================================================================
       10. FORM SUBMISSION VALIDATION & POPUP MODALS
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const submitBtn = document.getElementById('submit-btn');

    const validators = {
        name: (val) => val.trim().length > 0,
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        message: (val) => val.trim().length > 0
    };

    const validateInput = (inputEl, errorEl, validator) => {
        const isValid = validator(inputEl.value);
        const groupEl = inputEl.closest('.form-group');
        
        if (isValid) {
            groupEl.classList.remove('invalid');
        } else {
            groupEl.classList.add('invalid');
        }
        return isValid;
    };

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    if (nameInput) nameInput.addEventListener('blur', () => validateInput(nameInput, document.getElementById('name-error'), validators.name));
    if (emailInput) emailInput.addEventListener('blur', () => validateInput(emailInput, document.getElementById('email-error'), validators.email));
    if (messageInput) messageInput.addEventListener('blur', () => validateInput(messageInput, document.getElementById('message-error'), validators.message));

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateInput(nameInput, document.getElementById('name-error'), validators.name);
            const isEmailValid = validateInput(emailInput, document.getElementById('email-error'), validators.email);
            const isMessageValid = validateInput(messageInput, document.getElementById('message-error'), validators.message);

            if (isNameValid && isEmailValid && isMessageValid) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    
                    successModal.classList.add('active');
                    successModal.setAttribute('aria-hidden', 'false');
                    
                    contactForm.reset();
                }, 1500);
            }
        });
    }

    const closeModal = () => {
        successModal.classList.remove('active');
        successModal.setAttribute('aria-hidden', 'true');
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal && successModal.classList.contains('active')) {
            closeModal();
        }
    });

});
