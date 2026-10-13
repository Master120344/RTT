document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('nav');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const fadeElements = document.querySelectorAll('.fade-in');
    const contactForm = document.querySelector('.contact-form');
    const statusBox = document.querySelector('.form-status');

    const calendarGrid = document.querySelector('.event-calendar-grid');
    const calendarMonth = document.querySelector('.calendar-month');
    const calendarPrev = document.querySelector('.calendar-prev');
    const calendarNext = document.querySelector('.calendar-next');
    const eventHeadlineCards = document.querySelector('.event-headline-cards');

    const heroImage = document.getElementById('hero-slideshow-image');

    let currentDate = new Date();
    let activeFilterDate = null;

    const events = [
        {
            title: 'iHop Church Tent Event',
            date: '2026-04-12',
            time: '4:00 PM',
            location: 'Rahway, NJ',
            description: 'A special community tent event focused on worship, prayer, encouragement, outreach, and bringing people together.',
            featured: true
        },
        {
            title: 'Community Food Outreach',
            date: '2026-04-20',
            time: '1:00 PM',
            location: 'Rahway, NJ',
            description: 'Food support and community care for local families and neighbors in need.'
        },
        {
            title: 'Youth Encouragement Night',
            date: '2026-04-27',
            time: '6:30 PM',
            location: 'Rahway, NJ',
            description: 'A night of encouragement, mentorship, connection, and hope for young people.'
        },
        {
            title: 'Prayer and Restoration Gathering',
            date: '2026-05-03',
            time: '5:00 PM',
            location: 'Rahway, NJ',
            description: 'A gathering centered on prayer, renewal, faith, and support for the community.'
        },
        {
            title: 'Volunteer Outreach Day',
            date: '2026-05-16',
            time: '10:00 AM',
            location: 'Rahway, NJ',
            description: 'Join us as we serve the community through outreach and practical help.'
        }
    ];

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

    const heroImages = [];
    for (let i = 1; i <= 20; i++) {
        heroImages.push(i + '.jpg');
    }

    heroImages.forEach(function (src) {
        const img = new Image();
        img.src = src;
    });

    if (heroImage) {
        let slideIndex = 0;

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

    function formatMonthYear(date) {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }

    function getLocalDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    function getEventsForDate(dateString) {
        return events.filter(function (event) {
            return event.date === dateString;
        });
    }

    function renderEventHeadlines(selectedDate) {
        if (!eventHeadlineCards) return;

        let visibleEvents = events.slice().sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        if (selectedDate) {
            const filtered = visibleEvents.filter(function (event) {
                return event.date === selectedDate;
            });

            if (filtered.length > 0) {
                visibleEvents = filtered;
            }
        }

        eventHeadlineCards.innerHTML = '';

        if (visibleEvents.length === 0) {
            eventHeadlineCards.innerHTML = '<div class="event-headline-card"><h3>No events on this date</h3><p>Please choose another highlighted date on the calendar.</p></div>';
            return;
        }

        visibleEvents.forEach(function (event) {
            const card = document.createElement('article');
            card.className = 'event-headline-card';

            if (event.featured) {
                card.classList.add('featured-event');
            }

            const eventDate = new Date(event.date + 'T00:00:00');
            const prettyDate = eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            card.innerHTML = `
                <div class="event-meta">
                    <span class="event-date">${prettyDate}</span>
                    <span class="event-time">${event.time}</span>
                </div>
                <h3>${event.title}</h3>
                <p class="event-location">${event.location}</p>
                <p>${event.description}</p>
            `;

            eventHeadlineCards.appendChild(card);
        });
    }

    function renderCalendar(date) {
        if (!calendarGrid || !calendarMonth) return;

        calendarGrid.innerHTML = '';
        calendarMonth.textContent = formatMonthYear(date);

        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const startingDay = firstDay.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        dayNames.forEach(function (dayName) {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = dayName;
            calendarGrid.appendChild(header);
        });

        for (let i = 0; i < startingDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            calendarGrid.appendChild(empty);
        }

        const todayString = getLocalDateString(new Date());

        for (let day = 1; day <= daysInMonth; day++) {
            const cellDate = new Date(year, month, day);
            const cellDateString = getLocalDateString(cellDate);
            const dayEvents = getEventsForDate(cellDateString);

            const cell = document.createElement('div');
            cell.className = 'calendar-day';

            if (cellDateString === todayString) {
                cell.classList.add('today');
            }

            if (dayEvents.length > 0) {
                cell.classList.add('has-event');
            }

            const dateLabel = document.createElement('div');
            dateLabel.className = 'calendar-date';
            dateLabel.textContent = day;
            cell.appendChild(dateLabel);

            if (dayEvents.length > 0) {
                const markers = document.createElement('div');
                markers.className = 'calendar-event-markers';

                dayEvents.slice(0, 2).forEach(function (event) {
                    const marker = document.createElement('div');
                    marker.className = 'calendar-event-marker';
                    marker.textContent = event.title;
                    markers.appendChild(marker);
                });

                cell.appendChild(markers);

                cell.addEventListener('click', function () {
                    activeFilterDate = cellDateString;
                    renderEventHeadlines(activeFilterDate);

                    const targetSection = document.getElementById('upcoming-events');
                    if (targetSection) {
                        const navHeight = nav ? nav.offsetHeight : 0;
                        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - 15;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
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

    renderCalendar(currentDate);
    renderEventHeadlines(activeFilterDate);

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