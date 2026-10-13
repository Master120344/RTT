/* Shared October and November 2026 calendar. All listed times are Austin Central Time. */
(function () {
    'use strict';

    function initializeCalendar() {
        var calendarGrid = document.querySelector('.event-calendar-grid');
        var calendarMonth = document.querySelector('.calendar-month');
        var eventList = document.querySelector('.event-headline-cards');
        if (!calendarGrid || !calendarMonth || !eventList) return;

        var previousButton = document.querySelector('.calendar-prev');
        var nextButton = document.querySelector('.calendar-next');
        var todayButton = document.querySelector('.calendar-today');
        var resetButton = document.querySelector('.calendar-show-all, .calendar-reset');
        var selectionStatus = document.querySelector('.calendar-selection-status');
        var eventCount = document.querySelector('.calendar-event-count');
        var filterButtons = document.querySelectorAll('[data-calendar-filter]');
        var filterSelect = document.querySelector('.calendar-category-filter');
        var currentMonth = new Date(2026, 9, 1);
        var selectedDate = null;
        var selectedCategory = 'all';
        var firstMonth = new Date(2026, 9, 1);
        var lastMonth = new Date(2026, 10, 1);
        var weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var churchAddress = '1844 Teri Rd, Austin, TX 78744';
        var churchHost = 'Dove Springs iHOP Church';

        calendarGrid.setAttribute('role', 'group');
        eventList.setAttribute('role', 'region');

        function dateKey(date) {
            return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
        }

        function monthLabel(date) {
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }

        function todayInAustin() {
            var parts = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric'
            }).formatToParts(new Date());
            var values = {};
            parts.forEach(function (part) { values[part.type] = Number(part.value); });
            return new Date(values.year, values.month - 1, values.day);
        }

        function prettyDate(key, includeYear) {
            return new Date(key + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: includeYear ? 'numeric' : undefined
            });
        }

        function monthItems(date) {
            var year = date.getFullYear();
            var month = date.getMonth();
            if (year !== 2026 || (month !== 9 && month !== 10)) return [];

            var items = [];
            var lastDay = new Date(year, month + 1, 0).getDate();
            for (var day = 1; day <= lastDay; day++) {
                var eventDate = new Date(year, month, day);
                var weekday = eventDate.getDay();
                var churchEvent = null;
                if (weekday === 0) {
                    churchEvent = {
                        marker: 'Church', title: 'Sunday Church', startTime: '12:30',
                        time: '12:30 PM to 2:00 PM Central',
                        description: 'Gather for Sunday worship, encouragement, and fellowship with Dove Springs iHOP Church.'
                    };
                } else if (weekday === 3) {
                    churchEvent = {
                        marker: 'Prayer', title: 'Wednesday Prayer', startTime: '18:30',
                        time: '6:30 PM Central',
                        description: 'Come together in prayer for our neighbors, families, and community. An ending time has not been announced.'
                    };
                } else if (weekday === 5) {
                    churchEvent = {
                        marker: 'Bible study', title: 'Friday Bible Study', startTime: '18:30',
                        time: '6:30 PM to 8:00 PM Central',
                        description: 'An evening to read Scripture together, ask questions, and find encouragement for the week ahead.'
                    };
                }
                if (churchEvent) {
                    churchEvent.date = dateKey(eventDate);
                    churchEvent.kind = 'church';
                    churchEvent.category = 'church';
                    churchEvent.status = 'Church schedule';
                    churchEvent.organizer = churchHost;
                    churchEvent.location = churchHost;
                    churchEvent.address = churchAddress;
                    items.push(churchEvent);
                }
            }

            if (month === 9) {
                items.push({
                    date: '2026-10-24', kind: 'meeting', category: 'rtt', marker: 'RTT meeting',
                    title: 'RTT Planning Meeting', startTime: '13:00', time: '1:00 PM to 1:30 PM Central',
                    status: 'Planned · venue confirmation pending', organizer: 'Redeeming The Time Today',
                    location: 'Austin Public Library · Pleasant Hill Branch',
                    address: '211 E William Cannon Dr, Austin, TX 78745',
                    description: 'Meet the RTT team for 30 minutes to share outreach ideas, discuss practical needs, and plan how we can serve Austin together. Confirm the venue with RTT before attending.',
                    contactLabel: 'Ask RTT about this meeting'
                });
                items.push({
                    date: '2026-10-29', kind: 'outreach', category: 'rtt', marker: 'Outreach',
                    title: 'RTT Community Outreach', startTime: '13:00', time: '1:00 PM Central',
                    status: 'Planned · details to follow', organizer: 'Redeeming The Time Today',
                    location: 'Location to be announced',
                    description: 'An afternoon to meet our neighbors and bring practical kindness to the community. The location, activities, and volunteer details will be shared when confirmed.',
                    contactLabel: 'Ask RTT about outreach'
                });
                items.push({
                    date: '2026-10-31', kind: 'observance', category: 'seasonal', marker: 'Halloween',
                    title: 'Halloween', startTime: '00:00', time: 'All day', status: 'Seasonal observance',
                    location: 'October 31',
                    description: 'A little autumn spirit for the season. No Halloween gathering has been announced by Redeeming The Time Today.'
                });
            }

            var monthPrefix = dateKey(new Date(year, month, 1)).slice(0, 7);
            var externalItems = Array.isArray(window.RTTCommunityEvents) ? window.RTTCommunityEvents : [];
            externalItems.forEach(function (item) {
                if (!item || typeof item.date !== 'string' || !/^2026-(10|11)-\d{2}$/.test(item.date)) return;
                var itemDate = new Date(item.date + 'T12:00:00');
                if (dateKey(itemDate) !== item.date || item.date.slice(0, 7) !== monthPrefix) return;
                if (typeof item.title !== 'string' || !item.title.trim()) return;
                var external = Object.assign({}, item);
                external.kind = 'resource';
                external.category = 'community';
                external.marker = external.marker || 'Community';
                external.status = external.status || 'External community program';
                external.time = external.time || 'See program details';
                items.push(external);
            });

            return items.sort(function (a, b) {
                return a.date.localeCompare(b.date) || (a.startTime || '23:59').localeCompare(b.startTime || '23:59') || a.title.localeCompare(b.title);
            });
        }

        function visibleMonthItems() {
            return monthItems(currentMonth).filter(function (item) {
                return selectedCategory === 'all' || item.category === selectedCategory;
            });
        }

        function element(tag, className, content) {
            var node = document.createElement(tag);
            if (className) node.className = className;
            if (content !== undefined) node.textContent = content;
            return node;
        }

        function contactLink(label) {
            var link = element('a', 'event-details-link', label);
            link.href = '#contact';
            return link;
        }

        function externalLink(label, url, className) {
            if (typeof url !== 'string' || !/^https:\/\//i.test(url)) return null;
            var link = element('a', className || 'event-details-link source-link', label);
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            return link;
        }

        function appendDetail(list, label, value, className) {
            if (typeof value !== 'string' || !value.trim()) return;
            var row = element('div', 'event-detail-row' + (className ? ' ' + className : ''));
            row.appendChild(element('dt', 'event-detail-label', label));
            row.appendChild(element('dd', 'event-detail-value', value));
            list.appendChild(row);
        }

        function renderFilters() {
            filterButtons.forEach(function (button) {
                var active = button.dataset.calendarFilter === selectedCategory;
                button.setAttribute('aria-pressed', String(active));
                button.classList.toggle('active', active);
            });
            if (filterSelect) filterSelect.value = selectedCategory;
        }

        function renderAgenda() {
            var items = visibleMonthItems();
            var visible = selectedDate ? items.filter(function (item) { return item.date === selectedDate; }) : items;
            var label = selectedDate ? prettyDate(selectedDate, false) : monthLabel(currentMonth);
            eventList.replaceChildren();
            eventList.setAttribute('aria-label', 'Calendar details for ' + label);
            if (resetButton) resetButton.setAttribute('aria-pressed', String(!selectedDate));
            var countLabel = visible.length + (visible.length === 1 ? ' listing' : ' listings');
            if (eventCount) eventCount.textContent = countLabel;
            if (selectionStatus) selectionStatus.textContent = label + ' · ' + countLabel + ' · Central Time';
            renderFilters();

            if (!visible.length) {
                var empty = element('article', 'event-headline-card event-empty');
                empty.appendChild(element('p', 'event-date', label));
                empty.appendChild(element('h3', '', 'A little room to make a difference'));
                empty.appendChild(element('p', 'event-purpose', selectedCategory === 'all'
                    ? 'No gathering is listed for this date. Choose another date or see the whole month for church, RTT, and community listings.'
                    : 'No listing matches this filter. Choose All to explore the other opportunities on the calendar.'));
                empty.appendChild(contactLink('Ask about getting involved'));
                eventList.appendChild(empty);
                return;
            }

            visible.forEach(function (item) {
                var card = element('article', 'event-headline-card event-entry event-' + item.kind);
                var meta = element('div', 'event-meta');
                var eventDate = element('time', 'event-date', prettyDate(item.date, true));
                eventDate.setAttribute('datetime', item.date);
                meta.appendChild(eventDate);
                meta.appendChild(element('span', 'event-time', item.time));
                meta.appendChild(element('span', 'event-status', item.status));
                card.appendChild(meta);
                card.appendChild(element('h3', '', item.title));
                if (item.location && item.location !== item.organizer) card.appendChild(element('p', 'event-location', item.location));
                if (item.description) card.appendChild(element('p', 'event-purpose', item.description));
                var details = element('dl', 'event-detail-list');
                appendDetail(details, 'Host', item.organizer, 'event-host');
                appendDetail(details, 'Address', item.address, 'event-address');
                appendDetail(details, 'Who can attend', item.eligibility);
                appendDetail(details, 'Cost', item.cost);
                appendDetail(details, 'Contact', item.contact);
                appendDetail(details, 'Registration', item.registration);
                if (details.childNodes.length) card.appendChild(details);

                var links = element('div', 'event-links');
                if (item.address) {
                    var directions = externalLink('Directions', 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(item.address), 'event-details-link event-map-link');
                    if (directions) links.appendChild(directions);
                }
                if (item.kind === 'resource') {
                    var source = externalLink(item.sourceLabel || 'Official program details', item.sourceUrl, 'event-details-link event-source-link source-link');
                    if (source) links.appendChild(source);
                    var registration = externalLink('Register with the organizer', item.registrationUrl, 'event-details-link event-registration-link');
                    if (registration) links.appendChild(registration);
                }
                if (item.contactLabel) links.appendChild(contactLink(item.contactLabel));
                if (links.childNodes.length) card.appendChild(links);
                eventList.appendChild(card);
            });

            if (!selectedDate) {
                eventList.appendChild(element('p', 'calendar-agenda-note', 'All times are local to Austin. Church schedules can change; confirm with the host before attending. RTT plans are marked separately from programs hosted by other organizations.'));
            }
        }

        function focusDay(day) {
            var button = calendarGrid.querySelector('[data-calendar-day="' + day + '"]');
            if (button) button.focus();
        }

        function renderCalendar() {
            var year = currentMonth.getFullYear();
            var month = currentMonth.getMonth();
            var startingDay = new Date(year, month, 1).getDay();
            var daysInMonth = new Date(year, month + 1, 0).getDate();
            var today = dateKey(todayInAustin());
            var items = visibleMonthItems();
            calendarMonth.textContent = monthLabel(currentMonth);
            if (previousButton) previousButton.disabled = currentMonth.getTime() <= firstMonth.getTime();
            if (nextButton) nextButton.disabled = currentMonth.getTime() >= lastMonth.getTime();
            calendarGrid.setAttribute('aria-label', monthLabel(currentMonth) + ' dates, Central Time');
            calendarGrid.replaceChildren();

            weekdayNames.forEach(function (name) {
                var heading = element('div', 'calendar-day-header', name.slice(0, 3));
                heading.setAttribute('aria-hidden', 'true');
                calendarGrid.appendChild(heading);
            });

            function appendBlank() {
                var blank = element('div', 'calendar-day empty');
                blank.setAttribute('aria-hidden', 'true');
                calendarGrid.appendChild(blank);
            }

            for (var blankIndex = 0; blankIndex < startingDay; blankIndex++) appendBlank();

            for (var day = 1; day <= daysInMonth; day++) {
                (function (dayNumber) {
                    var key = dateKey(new Date(year, month, dayNumber));
                    var dayItems = items.filter(function (item) { return item.date === key; });
                    var cell = element('button', 'calendar-day');
                    cell.type = 'button';
                    cell.dataset.calendarDay = String(dayNumber);
                    cell.dataset.calendarDate = key;
                    cell.setAttribute('aria-pressed', String(selectedDate === key));
                    var dayLabel = prettyDate(key, true) + (key === today ? '. Today' : '');
                    cell.setAttribute('aria-label', dayLabel + (dayItems.length ? '. ' + dayItems.length + (dayItems.length === 1 ? ' listing. ' : ' listings. ') + dayItems.map(function (item) {
                        return item.title + ', ' + item.time + ', ' + item.status.toLowerCase();
                    }).join('. ') : '. No listings for this filter'));
                    if (key === today) {
                        cell.classList.add('today');
                        cell.setAttribute('aria-current', 'date');
                    }
                    if (selectedDate === key) cell.classList.add('active-filter');
                    cell.appendChild(element('span', 'calendar-date', dayNumber));

                    if (dayItems.length) {
                        var markers = element('span', 'calendar-event-markers');
                        markers.setAttribute('aria-hidden', 'true');
                        dayItems.forEach(function (item) {
                            cell.classList.add(item.kind === 'observance' ? 'has-observance' : 'has-event');
                            if (item.kind === 'resource') cell.classList.add('has-resource');
                            markers.appendChild(element('span', 'calendar-event-marker ' + item.kind + '-label', item.marker));
                        });
                        cell.appendChild(markers);
                    }

                    cell.addEventListener('click', function () {
                        selectedDate = selectedDate === key ? null : key;
                        renderCalendar();
                        renderAgenda();
                        focusDay(dayNumber);
                    });

                    cell.addEventListener('keydown', function (event) {
                        var target = dayNumber;
                        if (event.key === 'ArrowLeft') target--;
                        else if (event.key === 'ArrowRight') target++;
                        else if (event.key === 'ArrowUp') target -= 7;
                        else if (event.key === 'ArrowDown') target += 7;
                        else if (event.key === 'Home') target = 1;
                        else if (event.key === 'End') target = daysInMonth;
                        else return;
                        event.preventDefault();
                        focusDay(Math.max(1, Math.min(daysInMonth, target)));
                    });
                    calendarGrid.appendChild(cell);
                })(day);
            }

            var trailingBlanks = (7 - ((startingDay + daysInMonth) % 7)) % 7;
            for (var trailing = 0; trailing < trailingBlanks; trailing++) appendBlank();
        }

        function refresh() {
            renderCalendar();
            renderAgenda();
        }

        function changeMonth(offset) {
            var targetMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
            if (targetMonth < firstMonth || targetMonth > lastMonth) return;
            currentMonth = targetMonth;
            selectedDate = null;
            refresh();
        }

        function changeCategory(value) {
            if (['all', 'church', 'rtt', 'community'].indexOf(value) === -1) return;
            selectedCategory = value;
            selectedDate = null;
            refresh();
        }

        if (previousButton) previousButton.addEventListener('click', function () { changeMonth(-1); });
        if (nextButton) nextButton.addEventListener('click', function () { changeMonth(1); });
        if (resetButton) resetButton.addEventListener('click', function () {
            selectedDate = null;
            refresh();
        });
        if (todayButton) todayButton.addEventListener('click', function () {
            var now = todayInAustin();
            var nowMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            currentMonth = nowMonth < firstMonth ? firstMonth : (nowMonth > lastMonth ? lastMonth : nowMonth);
            selectedDate = nowMonth >= firstMonth && nowMonth <= lastMonth ? dateKey(now) : null;
            refresh();
        });
        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () { changeCategory(button.dataset.calendarFilter); });
        });
        if (filterSelect) filterSelect.addEventListener('change', function () { changeCategory(filterSelect.value); });

        refresh();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeCalendar);
    else initializeCalendar();
})();
