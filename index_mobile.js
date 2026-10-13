document.addEventListener('DOMContentLoaded', function () {
    var menuToggle = document.querySelector('.mobile-menu-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    var menuLinks = document.querySelectorAll('.mobile-menu a');
    var scrollTopBtn = document.querySelector('.scroll-top');
    var fadeElements = document.querySelectorAll('.fade-in');
    var contactForm = document.querySelector('.contact-form');
    var statusBox = document.querySelector('.form-status');
    var heroImage = document.getElementById('hero-mobile-slideshow');
    var braceletPromoImage = document.querySelector('.bracelet-promo-image');
    var meetingImage = document.querySelector('.meeting-image');
    var countdownRoot = document.querySelector('[data-meeting-countdown]');

    function setInlineStyles(el, styles) {
        if (!el) return;
        Object.keys(styles).forEach(function (key) {
            el.style[key] = styles[key];
        });
    }

    function clearInlineStyles(el, properties) {
        if (!el) return;
        properties.forEach(function (prop) {
            el.style[prop] = '';
        });
    }

    function setFieldFeedback(input, state, message) {
        if (!input) return;

        var group = input.closest('.form-group');
        if (!group) return;

        var existing = group.querySelector('.field-msg');
        if (existing) existing.remove();

        input.classList.remove('error', 'success');

        if (state === 'error') {
            input.classList.add('error');
            setInlineStyles(input, {
                borderColor: '#d64545',
                backgroundColor: '#fff5f5'
            });
        } else if (state === 'success') {
            input.classList.add('success');
            setInlineStyles(input, {
                borderColor: '#2eaf6b',
                backgroundColor: '#f2fff7'
            });
        } else {
            clearInlineStyles(input, ['borderColor', 'backgroundColor']);
        }

        if (message) {
            var msg = document.createElement('div');
            msg.className = 'field-msg ' + state;
            msg.textContent = message;
            setInlineStyles(msg, {
                marginTop: '4px',
                fontSize: '0.78rem',
                fontWeight: '700',
                lineHeight: '1.35',
                color: state === 'error' ? '#d64545' : '#2eaf6b'
            });
            group.appendChild(msg);
        }
    }

    function setStatus(message, state) {
        if (!statusBox) return;
        statusBox.textContent = message || '';
        statusBox.classList.remove('error', 'success');
        if (state) statusBox.classList.add(state);
        setInlineStyles(statusBox, {
            color: state === 'error' ? '#d64545' : state === 'success' ? '#2eaf6b' : ''
        });
    }

    function clearFormFeedback() {
        if (!contactForm) return;
        contactForm.querySelectorAll('.field-msg').forEach(function (node) {
            node.remove();
        });
        contactForm.querySelectorAll('input, textarea').forEach(function (input) {
            input.classList.remove('error', 'success');
            clearInlineStyles(input, ['borderColor', 'backgroundColor']);
        });
        setStatus('', null);
    }

    function formatPhone(value) {
        var digits = String(value || '').replace(/\D/g, '').slice(0, 10);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return digits.slice(0, 3) + '-' + digits.slice(3);
        return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
    }

    function getPhoneDigits(value) {
        return String(value || '').replace(/\D/g, '');
    }

    function isValidUSPhone(value) {
        var digits = getPhoneDigits(value);
        if (!digits) return { empty: true, valid: true };
        if (digits.length !== 10) return { valid: false, message: 'U.S. numbers only. Use 10 digits like 555-555-5555.' };
        return { valid: true, digits: digits };
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
    }

    function trimAndCollapse(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function decorateLabels() {
        if (!contactForm) return;
        contactForm.querySelectorAll('.form-group').forEach(function (group) {
            var label = group.querySelector('label');
            var field = group.querySelector('input, textarea');
            if (!label || !field) return;

            var base = trimAndCollapse(label.textContent)
                .replace(/\s*\(optional\)\s*$/i, '')
                .replace(/\s*\*\s*$/g, '');

            if ((field.name || '').toLowerCase() === 'phone') {
                label.textContent = base + ' (optional)';
            } else {
                label.textContent = base + ' *';
            }
        });
    }

    function validateRequiredInput(input, message) {
        if (!input) return true;
        var value = trimAndCollapse(input.value);
        if (!value) {
            setFieldFeedback(input, 'error', message || 'This field is required.');
            return false;
        }
        setFieldFeedback(input, 'success', 'Looks good.');
        return true;
    }

    function validateEmailInput(input) {
        if (!input) return true;
        var value = trimAndCollapse(input.value);
        if (!value) {
            setFieldFeedback(input, 'error', 'Email address is required.');
            return false;
        }
        if (!isValidEmail(value)) {
            setFieldFeedback(input, 'error', 'Enter a valid email address.');
            return false;
        }
        setFieldFeedback(input, 'success', 'Valid email address.');
        return true;
    }

    function validatePhoneInput(input) {
        if (!input) return true;
        var value = String(input.value || '').trim();
        var result = isValidUSPhone(value);

        if (result.empty) {
            setFieldFeedback(input, null, '');
            return true;
        }

        if (!result.valid) {
            setFieldFeedback(input, 'error', result.message);
            return false;
        }

        setFieldFeedback(input, 'success', 'Valid U.S. phone number.');
        return true;
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            var isOpen = mobileMenu.classList.toggle('open');
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        menuLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function handleScroll() {
        if (!scrollTopBtn) return;
        if (window.scrollY > 320) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    function handleFadeIn() {
        fadeElements.forEach(function (element) {
            var elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 60) {
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    var heroImages = ['1.jpg', '2.jpg', '3.jpg', '7.jpg', '16.jpg', '17.jpg'];

    heroImages.forEach(function (src) {
        var preloadImage = new Image();
        preloadImage.src = src;
    });

    if (heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var slideIndex = 0;
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

    if (braceletPromoImage) {
        braceletPromoImage.addEventListener('error', function () {
            braceletPromoImage.classList.add('image-missing');
            braceletPromoImage.removeAttribute('src');
            braceletPromoImage.setAttribute('alt', 'Image Coming Soon');
        }, { once: true });
    }

    if (meetingImage) {
        meetingImage.addEventListener('error', function () {
            meetingImage.classList.add('image-missing');
            meetingImage.removeAttribute('src');
            meetingImage.setAttribute('alt', 'Image Coming Soon');
        }, { once: true });
    }

    function setCountdownValue(id, value) {
        var element = document.getElementById(id);
        if (element) {
            element.textContent = String(value).padStart(2, '0');
        }
    }

    function updateMeetingCountdown() {
        if (!countdownRoot) return;

        var now = new Date();
        var target = new Date(countdownRoot.dataset.rttDate || '2026-10-24T13:00:00-05:00');
        if (Number.isNaN(target.getTime())) return;
        var diff = Math.max(0, target.getTime() - now.getTime());
        var totalSeconds = Math.floor(diff / 1000);
        var days = Math.floor(totalSeconds / 86400);
        var hours = Math.floor((totalSeconds % 86400) / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;

        var label = document.querySelector('.meeting-countdown-label');
        if (label) label.textContent = now.getTime() >= target.getTime() ? 'Check the calendar for meeting updates' : 'Planned meeting date in';
        setCountdownValue('meeting-countdown-days', days);
        setCountdownValue('meeting-countdown-hours', hours);
        setCountdownValue('meeting-countdown-minutes', minutes);
        setCountdownValue('meeting-countdown-seconds', seconds);
    }

    if (countdownRoot) {
        updateMeetingCountdown();
        setInterval(updateMeetingCountdown, 1000);
    }

    decorateLabels();

    if (contactForm) {
        var firstNameInput = contactForm.querySelector('#firstName');
        var lastNameInput = contactForm.querySelector('#lastName');
        var emailInput = contactForm.querySelector('#email');
        var phoneInput = contactForm.querySelector('#phone');
        var messageInput = contactForm.querySelector('#message');

        if (phoneInput) {
            phoneInput.setAttribute('inputmode', 'numeric');
            phoneInput.setAttribute('autocomplete', 'tel');
            phoneInput.setAttribute('placeholder', '555-555-5555');

            phoneInput.addEventListener('input', function () {
                var formatted = formatPhone(this.value);
                this.value = formatted;
                validatePhoneInput(this);
            });

            phoneInput.addEventListener('blur', function () {
                validatePhoneInput(this);
            });
        }

        if (emailInput) {
            emailInput.setAttribute('autocomplete', 'email');
            emailInput.setAttribute('placeholder', 'name@example.com');

            emailInput.addEventListener('input', function () {
                var value = trimAndCollapse(this.value);
                if (!value) {
                    setFieldFeedback(this, null, '');
                    return;
                }
                validateEmailInput(this);
            });

            emailInput.addEventListener('blur', function () {
                validateEmailInput(this);
            });
        }

        if (firstNameInput) {
            firstNameInput.addEventListener('blur', function () {
                validateRequiredInput(this, 'First name is required.');
            });
            firstNameInput.addEventListener('input', function () {
                if (trimAndCollapse(this.value)) {
                    setFieldFeedback(this, 'success', 'Looks good.');
                } else {
                    setFieldFeedback(this, null, '');
                }
            });
        }

        if (lastNameInput) {
            lastNameInput.addEventListener('blur', function () {
                validateRequiredInput(this, 'Last name is required.');
            });
            lastNameInput.addEventListener('input', function () {
                if (trimAndCollapse(this.value)) {
                    setFieldFeedback(this, 'success', 'Looks good.');
                } else {
                    setFieldFeedback(this, null, '');
                }
            });
        }

        if (messageInput) {
            messageInput.addEventListener('blur', function () {
                validateRequiredInput(this, 'Message is required.');
            });
            messageInput.addEventListener('input', function () {
                if (trimAndCollapse(this.value)) {
                    setFieldFeedback(this, 'success', 'Looks good.');
                } else {
                    setFieldFeedback(this, null, '');
                }
            });
        }

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            clearFormFeedback();

            var submitBtn = contactForm.querySelector('.btn-submit');
            var originalText = submitBtn ? submitBtn.textContent : 'Send Message';

            var firstOk = validateRequiredInput(firstNameInput, 'First name is required.');
            var lastOk = validateRequiredInput(lastNameInput, 'Last name is required.');
            var emailOk = validateEmailInput(emailInput);
            var phoneOk = validatePhoneInput(phoneInput);
            var messageOk = validateRequiredInput(messageInput, 'Message is required.');

            if (!firstOk || !lastOk || !emailOk || !phoneOk || !messageOk) {
                setStatus('Please fix the highlighted fields.', 'error');
                return;
            }

            var formData = new FormData(contactForm);
            var turnstileToken = formData.get('cf-turnstile-response');

            if (!turnstileToken) {
                setStatus('Complete the security check first.', 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            try {
                var response = await fetch(contactForm.action || 'contact.php', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json'
                    },
                    credentials: 'same-origin'
                });

                var contentType = response.headers.get('content-type') || '';
                var payload = null;

                if (contentType.indexOf('application/json') !== -1) {
                    payload = await response.json();
                } else {
                    payload = {
                        success: false,
                        message: (await response.text()).slice(0, 200)
                    };
                }

                if (!response.ok || !payload || payload.success !== true) {
                    throw new Error((payload && payload.message) ? payload.message : 'There was a problem sending your message.');
                }

                contactForm.reset();
                clearFormFeedback();
                decorateLabels();

                if (window.turnstile) {
                    var widget = document.querySelector('.cf-turnstile');
                    if (widget) {
                        window.turnstile.reset(widget);
                    } else {
                        window.turnstile.reset();
                    }
                }

                if (submitBtn) {
                    submitBtn.textContent = 'Message Sent';
                }

                setStatus('Your message was sent successfully.', 'success');

                setTimeout(function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }
                }, 2200);
            } catch (error) {
                setStatus(error && error.message ? error.message : 'There was a problem sending your message.', 'error');

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        });
    }
});
