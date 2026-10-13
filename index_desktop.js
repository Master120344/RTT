document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('nav');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const fadeElements = document.querySelectorAll('.fade-in');
    const contactForm = document.querySelector('.contact-form');
    const statusBox = document.querySelector('.form-status');

    const heroImage = document.getElementById('hero-slideshow-image');

    function handleScroll() {
        const scrollY = window.scrollY;

        if (nav) {
            if (scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        if (scrollTopBtn) {
            if (scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    }

    function handleFadeIn() {
        fadeElements.forEach(function (element) {
            const elementTop = element.getBoundingClientRect().top;
            const trigger = window.innerHeight - 100;

            if (elementTop < trigger) {
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleFadeIn);

    handleScroll();
    handleFadeIn();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const heroImages = ['1.jpg', '2.jpg', '3.jpg', '7.jpg', '16.jpg', '17.jpg'];

    heroImages.forEach(function (src) {
        const img = new Image();
        img.src = src;
    });

    if (heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let slideIndex = 0;

        setInterval(function () {
            if (document.hidden || heroImage.dataset.paused === 'true') return;
            slideIndex = (slideIndex + 1) % heroImages.length;
            heroImage.classList.add('is-fading');

            setTimeout(function () {
                heroImage.src = heroImages[slideIndex];
                heroImage.alt = 'People and moments from the Redeeming The Time Today community';
                heroImage.classList.remove('is-fading');
            }, 350);
        }, 6000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn ? submitBtn.textContent : 'Send Message';

            if (statusBox) {
                statusBox.textContent = '';
            }

            const formData = new FormData(contactForm);
            const turnstileToken = formData.get('cf-turnstile-response');

            if (!turnstileToken) {
                if (statusBox) {
                    statusBox.textContent = 'Please complete the security check first.';
                }
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Message failed to send');
                }

                contactForm.reset();

                if (statusBox) {
                    statusBox.textContent = 'Your message was sent successfully.';
                }

                if (submitBtn) {
                    submitBtn.textContent = 'Message Sent';
                }

                if (window.turnstile) {
                    const widget = document.querySelector('.cf-turnstile');
                    if (widget) {
                        window.turnstile.reset(widget);
                    }
                }

                setTimeout(function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }
                }, 2500);
            } catch (error) {
                if (statusBox) {
                    statusBox.textContent = 'There was a problem sending your message. Please try again.';
                }

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }

                console.error(error);
            }
        });
    }
});