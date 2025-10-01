// Navigation active state
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
            
            // Add scrolled class to header for transparent effect
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        // Check for saved theme preference or default to light theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (savedTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (newTheme === 'dark') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
        
        // Certificate modal functionality
        const modal = document.getElementById('certModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalImage = document.getElementById('modalImage');
        const closeBtn = document.querySelector('.close-btn');
        const showButtons = document.querySelectorAll('.show-btn');

        showButtons.forEach(button => {
            button.addEventListener('click', () => {
                const certTitle = button.parentElement.querySelector('h4').textContent;
                modalTitle.textContent = certTitle;

                const src = button.getAttribute('data-src');
                modalImage.src = src;
                modalImage.alt = certTitle + " Certificate";

                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Add subtle animations to elements when they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
                // Handle timeline dots scaling on scroll
                if (entry.target.classList.contains('timeline-item')) {
                    const dot = entry.target.querySelector('.timeline-dot');
                    if (dot) {
                        if (entry.isIntersecting) {
                            dot.style.transform = 'scale(1.2)';
                            dot.style.boxShadow = '0 0 0 6px var(--accent-pink)';
                        } else {
                            dot.style.transform = 'scale(1)';
                            dot.style.boxShadow = '0 0 0 3px var(--white)';
                        }
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.card, .timeline-item, .skill-category, .cert-card, .project-card').forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });

        // Animated counters
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counterNumber = entry.target.querySelector('.counter-number');
                    const target = parseFloat(counterNumber.textContent);
                    animateCounter(counterNumber, 0, target, 2000);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.counter-item').forEach(item => {
            counterObserver.observe(item);
        });

        function animateCounter(element, start, end, duration) {
            const startTime = performance.now();
            const isFloat = end % 1 !== 0;

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = start + (end - start) * easeOutQuart;

                if (isFloat) {
                    element.textContent = current.toFixed(2);
                } else {
                    element.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        }

        // Download modal functionality
        const downloadModal = document.getElementById('downloadModal');
        const downloadCloseBtn = downloadModal.querySelector('.close-btn');

        function showDownloadModal() {
            downloadModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function downloadResume() {
            const link = document.createElement('a');
            link.href = 'docs/cv-frida.pdf';
            link.download = 'cv-frida.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            closeDownloadModal();
        }

        function closeDownloadModal() {
            downloadModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        downloadCloseBtn.addEventListener('click', closeDownloadModal);

        window.addEventListener('click', (e) => {
            if (e.target === downloadModal) {
                closeDownloadModal();
            }
        });
        // Typing animation for looping titles
        const typedText = document.getElementById('typed-text');
        const texts = ['Data Enthusiast', 'Data Analyst', 'Data Scientist', 'AI Engineer', 'Machine Learning Engineer', 'Data Engineer'];
        let currentTextIndex = 0;
        let index = 0;
        let isTyping = true;

        function type() {
            const currentText = texts[currentTextIndex];
            if (isTyping) {
                if (index < currentText.length) {
                    typedText.textContent += currentText.charAt(index);
                    index++;
                    setTimeout(type, 150);
                } else {
                    isTyping = false;
                    setTimeout(type, 1000); // pause before erasing
                }
            } else {
                if (index > 0) {
                    typedText.textContent = currentText.substring(0, index - 1);
                    index--;
                    setTimeout(type, 100);
                } else {
                    isTyping = true;
                    currentTextIndex = (currentTextIndex + 1) % texts.length;
                    setTimeout(type, 500); // pause before typing next
                }
            }
        }

        type();

        // Cursor blink animation
        const cursor = document.querySelector('.cursor');
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);

        // Sailor Moon wand cursor

        const sailorMoonWandCursor = document.createElement('div');

        sailorMoonWandCursor.classList.add('sailor-moon-wand-cursor');

        sailorMoonWandCursor.innerHTML = '<div class="wand"></div>';

        document.body.appendChild(sailorMoonWandCursor);

        document.addEventListener('mousemove', (e) => {

            sailorMoonWandCursor.style.left = e.clientX + 'px';

            sailorMoonWandCursor.style.top = e.clientY + 'px';

        });

        // Parallax scrolling effect for hero section
        const hero = document.getElementById('home');
        const heroBefore = hero.querySelector('::before');
        const heroAfter = hero.querySelector('::after');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            // Move the floating circles
            if (heroBefore) {
                heroBefore.style.transform = `translateY(${rate * 0.3}px)`;
            }
            if (heroAfter) {
                heroAfter.style.transform = `translateY(${rate * 0.2}px)`;
            }
        });

        // Mouse-following parallax effects for background elements
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            const moveX = (mouseX - 0.5) * 20; // Adjust sensitivity
            const moveY = (mouseY - 0.5) * 20;

            if (heroBefore) {
                heroBefore.style.transform += ` translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
            }
            if (heroAfter) {
                heroAfter.style.transform += ` translate(${moveX * 0.3}px, ${moveY * 0.3}px)`;
            }
        });
