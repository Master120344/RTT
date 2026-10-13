document.addEventListener('DOMContentLoaded', function () {
    var menuToggle = document.querySelector('.mobile-menu-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    var menuLinks = document.querySelectorAll('.mobile-menu a');
    var scrollTopBtn = document.querySelector('.scroll-top');
    var fadeElements = document.querySelectorAll('.fade-in');
    var contactForm = document.querySelector('.contact-form');
    var statusBox = document.querySelector('.form-status');
    var heroImage = document.getElementById('hero-mobile-slideshow');
    var calendarGrid = document.querySelector('.event-calendar-grid');
    var calendarMonth = document.querySelector('.calendar-month');
    var calendarPrev = document.querySelector('.calendar-prev');
    var calendarNext = document.querySelector('.calendar-next');
    var eventHeadlineCards = document.querySelector('.event-headline-cards');
    var braceletPromoImage = document.querySelector('.bracelet-promo-image');
    var meetingImage = document.querySelector('.meeting-image');
    var countdownRoot = document.querySelector('[data-meeting-countdown]');
    var currentDate = new Date(2026, 4, 1);
    var activeFilterDate = null;

    var events = [
        {
            title: 'Community Support Table',
            date: '2026-05-16',
            time: '10:00 AM',
            location: 'Austin, TX',
            status: 'Open',
            description: 'A local support table with encouragement, resource guidance, and connection for individuals and families rebuilding stability.',
            featured: true
        },
        {
            title: 'Mentorship Orientation',
            date: '2026-05-19',
            time: '6:00 PM',
            location: 'North Austin Area',
            status: 'RSVP Soon',
            description: 'An introductory orientation for volunteers interested in consistent mentorship, encouragement, and follow up support.'
        },
        {
            title: 'Volunteer Outreach Day',
            date: '2026-05-23',
            time: '9:30 AM',
            location: 'Community Partner Location',
            status: 'Volunteers Needed',
            description: 'Volunteers will gather for practical outreach, community check ins, and encouragement across the Austin area.'
        },
        {
            title: 'Clothing and Hygiene Kit Prep',
            date: '2026-05-27',
            time: '5:30 PM',
            location: 'South Austin Area',
            status: 'Volunteers Needed',
            description: 'A hands on preparation night to organize basic care items for upcoming outreach and support visits.'
        },
        {
            title: 'Family Encouragement Meet Up',
            date: '2026-05-30',
            time: '11:00 AM',
            location: 'Location To Be Announced',
            status: 'Planning',
            description: 'A supportive meet up for families navigating transition, restoration, and the next steps forward together.'
        },
        {
            title: 'Reentry Resource Check In',
            date: '2026-06-06',
            time: '10:30 AM',
            location: 'East Austin Area',
            status: 'Open',
            description: 'A practical check in for people looking for resource direction, mentoring connections, and community support.'
        },
        {
            title: 'Prayer and Practical Support Night',
            date: '2026-06-12',
            time: '6:30 PM',
            location: 'Community Partner Location',
            status: 'Open',
            description: 'An evening of prayer, encouragement, and practical next-step support for neighbors and families in Austin.'
        },
        {
            title: 'Back to Work Readiness Session',
            date: '2026-06-20',
            time: '10:00 AM',
            location: 'Location To Be Announced',
            status: 'RSVP Soon',
            description: 'A readiness session focused on confidence, preparation, and practical steps for returning to work.'
        }
    ];

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

    var heroImages = [];
    for (var i = 1; i <= 25; i++) {
        heroImages.push(i + '.jpg');
    }

    heroImages.forEach(function (src) {
        var preloadImage = new Image();
        preloadImage.src = src;
    });

    if (heroImage) {
        var slideIndex = 0;
        setInterval(function () {
            slideIndex = (slideIndex + 1) % heroImages.length;
            heroImage.classList.add('is-fading');
            setTimeout(function () {
                heroImage.src = heroImages[slideIndex];
                heroImage.alt = 'Redeeming The Time Today slideshow image ' + (slideIndex + 1);
                heroImage.classList.remove('is-fading');
            }, 350);
        }, 4000);
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

    function getTimeZoneParts(date, timeZone) {
        var formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23'
        });
        var values = {};

        formatter.formatToParts(date).forEach(function (part) {
            if (part.type !== 'literal') {
                values[part.type] = Number(part.value);
            }
        });

        return {
            year: values.year,
            month: values.month - 1,
            day: values.day,
            hour: values.hour,
            minute: values.minute,
            second: values.second
        };
    }

    function centralTimeToDate(year, month, day, hour, minute) {
        var timeZone = 'America/Chicago';
        var desiredUtc = Date.UTC(year, month, day, hour, minute || 0, 0);
        var utcGuess = desiredUtc;

        for (var i = 0; i < 3; i++) {
            var parts = getTimeZoneParts(new Date(utcGuess), timeZone);
            var localAsUtc = Date.UTC(parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second);
            utcGuess += desiredUtc - localAsUtc;
        }

        return new Date(utcGuess);
    }

    function getNextMeetingDate(now) {
        var timeZone = 'America/Chicago';
        var centralNow = getTimeZoneParts(now, timeZone);
        var target = centralTimeToDate(centralNow.year, centralNow.month, 21, 13, 0);

        if (now.getTime() >= target.getTime()) {
            target = centralTimeToDate(centralNow.year, centralNow.month + 1, 21, 13, 0);
        }

        return target;
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
        var target = getNextMeetingDate(now);
        var diff = Math.max(0, target.getTime() - now.getTime());
        var totalSeconds = Math.floor(diff / 1000);
        var days = Math.floor(totalSeconds / 86400);
        var hours = Math.floor((totalSeconds % 86400) / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;

        setCountdownValue('meeting-countdown-days', days);
        setCountdownValue('meeting-countdown-hours', hours);
        setCountdownValue('meeting-countdown-minutes', minutes);
        setCountdownValue('meeting-countdown-seconds', seconds);
    }

    if (countdownRoot && window.Intl && Intl.DateTimeFormat) {
        updateMeetingCountdown();
        setInterval(updateMeetingCountdown, 1000);
    }

    function getLocalDateString(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    function formatMonthYear(date) {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    function getEventsForDate(dateString) {
        return events.filter(function (event) {
            return event.date === dateString;
        });
    }

    function renderEventHeadlines(selectedDate) {
        if (!eventHeadlineCards) return;

        var visibleEvents = events.slice().sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        if (selectedDate) {
            var filtered = visibleEvents.filter(function (event) {
                return event.date === selectedDate;
            });
            if (filtered.length > 0) {
                visibleEvents = filtered;
            }
        }

        eventHeadlineCards.innerHTML = '';

        if (!visibleEvents.length) {
            eventHeadlineCards.innerHTML = '<div class="event-headline-card"><h3>No events on this date</h3><p>Please choose another highlighted date.</p></div>';
            return;
        }

        visibleEvents.forEach(function (event) {
            var card = document.createElement('article');
            card.className = 'event-headline-card';

            if (event.featured) {
                card.classList.add('featured-event');
            }

            var eventDate = new Date(event.date + 'T00:00:00');
            var prettyDate = eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            var mapLink = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(event.location);

            card.innerHTML =
                '<div class="event-meta">' +
                '<span class="event-date">' + prettyDate + '</span>' +
                '<span class="event-time">' + event.time + '</span>' +
                '<span class="event-status">' + event.status + '</span>' +
                '</div>' +
                '<h3>' + event.title + '</h3>' +
                '<p class="event-location"><span class="event-location-text">' + event.location + '</span><a class="event-map-link" href="' + mapLink + '" target="_blank" rel="noopener noreferrer" aria-label="Open map for ' + event.title + '">Map</a></p>' +
                '<p class="event-purpose">' + event.description + '</p>';

            eventHeadlineCards.appendChild(card);
        });
    }

    function renderCalendar(date) {
        if (!calendarGrid || !calendarMonth) return;

        calendarGrid.innerHTML = '';
        calendarMonth.textContent = formatMonthYear(date);

        var year = date.getFullYear();
        var month = date.getMonth();
        var firstDay = new Date(year, month, 1);
        var startingDay = firstDay.getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        dayNames.forEach(function (dayName) {
            var header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = dayName;
            calendarGrid.appendChild(header);
        });

        for (var i = 0; i < startingDay; i++) {
            var emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }

        var todayString = getLocalDateString(new Date());

        for (var day = 1; day <= daysInMonth; day++) {
            var cellDate = new Date(year, month, day);
            var cellDateString = getLocalDateString(cellDate);
            var dayEvents = getEventsForDate(cellDateString);

            var cell = document.createElement('div');
            cell.className = 'calendar-day';

            if (cellDateString === todayString) {
                cell.classList.add('today');
            }

            if (activeFilterDate === cellDateString) {
                cell.classList.add('active-filter');
            }

            var dateLabel = document.createElement('div');
            dateLabel.className = 'calendar-date';
            dateLabel.textContent = day;
            cell.appendChild(dateLabel);

            if (dayEvents.length > 0) {
                cell.classList.add('has-event');

                var markers = document.createElement('div');
                markers.className = 'calendar-event-markers';

                var marker = document.createElement('div');
                marker.className = 'calendar-event-marker';
                markers.appendChild(marker);

                cell.appendChild(markers);

                (function (ds) {
                    cell.addEventListener('click', function () {
                        activeFilterDate = ds;
                        renderCalendar(currentDate);
                        renderEventHeadlines(activeFilterDate);

                        var targetSection = document.getElementById('upcoming-events');
                        if (targetSection) {
                            var top = targetSection.getBoundingClientRect().top + window.scrollY - 70;
                            window.scrollTo({ top: top, behavior: 'smooth' });
                        }
                    });
                })(cellDateString);
            }

            calendarGrid.appendChild(cell);
        }
    }

    if (calendarPrev) {
        calendarPrev.addEventListener('click', function () {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            renderCalendar(currentDate);
        });
    }

    if (calendarNext) {
        calendarNext.addEventListener('click', function () {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            renderCalendar(currentDate);
        });
    }

    activeFilterDate = '2026-05-16';
    renderCalendar(currentDate);
    renderEventHeadlines(activeFilterDate);

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
