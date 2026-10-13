document.addEventListener('DOMContentLoaded', function () {
    var menuToggle = document.querySelector('.mobile-menu-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    var menuLinks = document.querySelectorAll('.mobile-menu a');
    var scrollTopBtn = document.querySelector('.scroll-top');
    var fadeElements = document.querySelectorAll('.fade-in');

    var zipFinderForm = document.getElementById('zipFinderForm');
    var zipCodeInput = document.getElementById('zipCode');
    var helpCategoryInput = document.getElementById('helpCategory');
    var finderStatus = document.getElementById('finderStatus');
    var locationSummary = document.getElementById('locationSummary');
    var finderResults = document.getElementById('finderResults');

    var categoryMap = {
        housing: {
            label: 'Housing & Shelter',
            findhelpTerm: 'housing',
            mapsQuery: 'housing assistance',
            eventQuery: 'housing assistance community help'
        },
        food: {
            label: 'Food & Nutrition',
            findhelpTerm: 'food',
            mapsQuery: 'food pantry',
            eventQuery: 'food pantry community meal'
        },
        recovery: {
            label: 'Recovery Support',
            findhelpTerm: 'recovery',
            mapsQuery: 'recovery support',
            eventQuery: 'recovery support group'
        },
        'mental-health': {
            label: 'Mental Health',
            findhelpTerm: 'mental health',
            mapsQuery: 'mental health services',
            eventQuery: 'mental health support group'
        },
        jobs: {
            label: 'Jobs & Employment',
            findhelpTerm: 'employment',
            mapsQuery: 'job center employment assistance',
            eventQuery: 'job fair workforce support'
        },
        family: {
            label: 'Family Support',
            findhelpTerm: 'family',
            mapsQuery: 'family services',
            eventQuery: 'family support parenting class'
        },
        reentry: {
            label: 'Reentry & Legal Aid',
            findhelpTerm: 'legal',
            mapsQuery: 'legal aid reentry services',
            eventQuery: 'reentry support legal aid'
        },
        transportation: {
            label: 'Transportation',
            findhelpTerm: 'transit',
            mapsQuery: 'transportation assistance',
            eventQuery: 'transportation assistance services'
        },
        faith: {
            label: 'Prayer & Community Support',
            findhelpTerm: 'spiritual support',
            mapsQuery: 'church community outreach',
            eventQuery: 'community prayer support group'
        },
        general: {
            label: 'General Local Help',
            findhelpTerm: 'help',
            mapsQuery: 'community assistance',
            eventQuery: 'community assistance support'
        }
    };

    function setStatus(message, type) {
        if (!finderStatus) return;
        finderStatus.textContent = message || '';
        finderStatus.classList.remove('error', 'success');
        if (type) {
            finderStatus.classList.add(type);
        }
    }

    function normalizeZip(value) {
        return String(value || '').replace(/\D/g, '').slice(0, 5);
    }

    function isValidZip(zip) {
        return /^\d{5}$/.test(zip);
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function titleCase(value) {
        return String(value || '').replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        });
    }

    function buildLocationSummary(placeName, stateName, zip, categoryLabel) {
        locationSummary.innerHTML =
            '<div class="location-summary-card">' +
                '<strong>Showing search options for ' + escapeHtml(placeName) + ', ' + escapeHtml(stateName) + ' ' + escapeHtml(zip) + '</strong>' +
                '<p>Category selected: ' + escapeHtml(categoryLabel) + '. Use the options below to search trusted local-help directories, nearby places, and community events or support opportunities in this area.</p>' +
            '</div>';
    }

    function buildResultCard(badgeText, badgeClass, title, description, actions) {
        var actionHtml = actions.map(function (action) {
            return '<a class="result-action ' + (action.primary ? 'primary' : '') + '" href="' + action.href + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(action.label) + '</a>';
        }).join('');

        return (
            '<article class="result-card">' +
                '<span class="result-badge ' + badgeClass + '">' + escapeHtml(badgeText) + '</span>' +
                '<h3>' + escapeHtml(title) + '</h3>' +
                '<p>' + escapeHtml(description) + '</p>' +
                '<div class="result-actions">' + actionHtml + '</div>' +
            '</article>'
        );
    }

    function renderResults(placeName, stateName, stateAbbr, zip, categoryKey) {
        var category = categoryMap[categoryKey] || categoryMap.general;
        var locationPhrase = placeName + ', ' + stateAbbr + ' ' + zip;
        var generalLocationPhrase = placeName + ', ' + stateName + ' ' + zip;

        var findhelpUrl = 'https://www.findhelp.org/search/text?postal=' + encodeURIComponent(zip) + '&term=' + encodeURIComponent(category.findhelpTerm);
        var national211Url = 'https://www.211.org/';
        var texas211GuidedUrl = 'https://www.211texas.org/guided-search/';
        var texas211SearchUrl = 'https://www.211texas.org/search/';
        var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(category.mapsQuery + ' near ' + locationPhrase);
        var googleEventsUrl = 'https://www.google.com/search?q=' + encodeURIComponent(category.eventQuery + ' in ' + generalLocationPhrase);
        var eventbriteUrl = 'https://www.eventbrite.com/d/' + encodeURIComponent(stateAbbr.toLowerCase()) + '--' + encodeURIComponent(placeName.toLowerCase()) + '/' + encodeURIComponent(category.eventQuery.replace(/\s+/g, '-')) + '/';
        var googleGeneralUrl = 'https://www.google.com/search?q=' + encodeURIComponent(category.label + ' near ' + generalLocationPhrase);

        var cards = '';

        cards += buildResultCard(
            'Local Help',
            'primary',
            'Search Findhelp for ' + category.label,
            'Open a ZIP-based community resource search focused on ' + category.label.toLowerCase() + ' in your area.',
            [
                { label: 'Open Findhelp Search', href: findhelpUrl, primary: true }
            ]
        );

        if (stateAbbr === 'TX') {
            cards += buildResultCard(
                'Texas 211',
                'gold',
                'Search Texas 211 Resources',
                'Use Texas 211 for category-based local resource lookup. This is especially useful for housing, food, employment, health, and crisis support in Texas.',
                [
                    { label: 'Open Texas 211 Guided Search', href: texas211GuidedUrl, primary: true },
                    { label: 'Open Texas 211 Search', href: texas211SearchUrl, primary: false }
                ]
            );
        } else {
            cards += buildResultCard(
                '211',
                'gold',
                'Find Your Local 211',
                'Open the national 211 site to connect with your local 211 network for human-guided resource navigation and nearby assistance.',
                [
                    { label: 'Open 211', href: national211Url, primary: true }
                ]
            );
        }

        cards += buildResultCard(
            'Nearby Search',
            'primary',
            'Search Nearby Places',
            'Open a map search for nearby services related to ' + category.label.toLowerCase() + ', based on this ZIP code area.',
            [
                { label: 'Open Nearby Map Search', href: mapsUrl, primary: true },
                { label: 'Open Web Search', href: googleGeneralUrl, primary: false }
            ]
        );

        cards += buildResultCard(
            'Events & Groups',
            'gold',
            'Search Local Events, Meetings, and Support Opportunities',
            'Look for current local events, workshops, support groups, resource fairs, and community activities in this area.',
            [
                { label: 'Search Google for Local Events', href: googleEventsUrl, primary: true },
                { label: 'Search Eventbrite', href: eventbriteUrl, primary: false }
            ]
        );

        finderResults.innerHTML = cards;
    }

    async function lookupZip(zip) {
        var response = await fetch('https://api.zippopotam.us/us/' + encodeURIComponent(zip), {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('We could not find that ZIP code. Please check it and try again.');
        }

        return response.json();
    }

    if (zipCodeInput) {
        zipCodeInput.addEventListener('input', function () {
            this.value = normalizeZip(this.value);
        });
    }

    if (zipFinderForm) {
        zipFinderForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            var zip = normalizeZip(zipCodeInput ? zipCodeInput.value : '');
            var categoryKey = helpCategoryInput ? helpCategoryInput.value : 'general';
            var category = categoryMap[categoryKey] || categoryMap.general;

            locationSummary.innerHTML = '';
            finderResults.innerHTML = '';

            if (!isValidZip(zip)) {
                setStatus('Please enter a valid 5-digit U.S. ZIP code.', 'error');
                return;
            }

            setStatus('Looking up that ZIP code and building local search options...', null);

            try {
                var data = await lookupZip(zip);
                var firstPlace = data && data.places && data.places[0] ? data.places[0] : null;

                if (!firstPlace) {
                    throw new Error('We could not get location details for that ZIP code.');
                }

                var placeName = titleCase(firstPlace['place name'] || '');
                var stateName = titleCase(firstPlace['state'] || '');
                var stateAbbr = String(firstPlace['state abbreviation'] || '').toUpperCase();

                buildLocationSummary(placeName, stateName, zip, category.label);
                renderResults(placeName, stateName, stateAbbr, zip, categoryKey);
                setStatus('Local search options are ready below.', 'success');

                var top = document.getElementById('zip-resource-finder').getBoundingClientRect().top + window.scrollY - 70;
                window.scrollTo({ top: top, behavior: 'smooth' });
            } catch (error) {
                setStatus(error && error.message ? error.message : 'There was a problem searching that ZIP code.', 'error');
            }
        });
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
});
