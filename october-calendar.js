/* One calendar for both layouts. Published schedules are not confirmed event listings. */
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
        var currentMonth = new Date(2026, 9, 1);
        var selectedDate = null;
        var weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        calendarGrid.setAttribute('role', 'group');
        eventList.setAttribute('role', 'region');

        function dateKey(date) {
            return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
        }

        function monthLabel(date) {
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }

        function prettyDate(key, includeYear) {
            return new Date(key + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: includeYear ? 'numeric' : undefined
            });
        }

        function monthItems(date) {
            var year = date.getFullYear();
            var month = date.getMonth();
            var items = [{
                date: dateKey(new Date(year, month, 21)),
                kind: 'schedule',
                marker: 'Meeting',
                title: 'Redeeming The Time Meeting',
                time: '1:00 PM Central Time',
                status: 'Monthly schedule',
                location: 'Online · joining details available from the team',
                description: 'Our published monthly schedule is the 21st at 1:00 PM Central. Contact us to confirm this month’s meeting and request the joining details.'
            }];

            if (month === 9) {
                items.push({
                    date: dateKey(new Date(year, month, 31)),
                    kind: 'observance',
                    marker: 'Halloween',
                    title: 'Halloween',
                    time: 'October 31',
                    status: 'Seasonal observance',
                    location: 'A date on the calendar, not an RTT hosted event',
                    description: 'A little autumn spirit for the season. No Halloween gathering has been announced by Redeeming The Time Today.'
                });
            }

            return items;
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

        function renderAgenda() {
            var items = monthItems(currentMonth);
            var visible = selectedDate ? items.filter(function (item) { return item.date === selectedDate; }) : items;
            var label = selectedDate ? prettyDate(selectedDate, false) : monthLabel(currentMonth);
            eventList.replaceChildren();
            eventList.setAttribute('aria-label', 'Calendar details for ' + label);

            if (resetButton) {
                resetButton.setAttribute('aria-pressed', String(!selectedDate));
            }

            if (selectionStatus) {
                selectionStatus.textContent = label + (visible.length ? ' · ' + (selectedDate ? 'date details' : 'published schedule') : ' · no confirmed gatherings');
            }

            if (!visible.length) {
                var empty = element('article', 'event-headline-card event-empty');
                empty.appendChild(element('p', 'event-date', label));
                empty.appendChild(element('h3', '', 'A little room to make a difference'));
                empty.appendChild(element('p', 'event-purpose', 'No confirmed gathering is listed for this date. Check the whole month for the published meeting schedule, or ask the team about ways to get involved.'));
                empty.appendChild(contactLink('Ask about getting involved'));
                eventList.appendChild(empty);
                return;
            }

            visible.forEach(function (item) {
                var card = element('article', 'event-headline-card event-entry' + (item.kind === 'observance' ? ' event-observance' : ''));
                var meta = element('div', 'event-meta');
                meta.appendChild(element('span', 'event-date', prettyDate(item.date, true)));
                meta.appendChild(element('span', 'event-time', item.time));
                meta.appendChild(element('span', 'event-status', item.status));
                card.appendChild(meta);
                card.appendChild(element('h3', '', item.title));
                card.appendChild(element('p', 'event-location', item.location));
                card.appendChild(element('p', 'event-purpose', item.description));
                if (item.kind === 'schedule') card.appendChild(contactLink('Request meeting details'));
                eventList.appendChild(card);
            });

            if (!selectedDate) {
                eventList.appendChild(element('p', 'calendar-agenda-note', 'Additional outreach dates will be shared here when confirmed.'));
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
            var today = dateKey(new Date());
            var items = monthItems(currentMonth);
            calendarMonth.textContent = monthLabel(currentMonth);
            calendarGrid.setAttribute('aria-label', monthLabel(currentMonth) + ' dates');
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
                    cell.setAttribute('aria-label', prettyDate(key, true) + (dayItems.length ? '. ' + dayItems.map(function (item) {
                        return item.title + ', ' + item.status.toLowerCase();
                    }).join('. ') : '. No confirmed gatherings listed'));
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

        function changeMonth(offset) {
            currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
            selectedDate = null;
            renderCalendar();
            renderAgenda();
        }

        if (previousButton) previousButton.addEventListener('click', function () { changeMonth(-1); });
        if (nextButton) nextButton.addEventListener('click', function () { changeMonth(1); });
        if (resetButton) resetButton.addEventListener('click', function () {
            selectedDate = null;
            renderCalendar();
            renderAgenda();
        });
        if (todayButton) todayButton.addEventListener('click', function () {
            var now = new Date();
            currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            selectedDate = dateKey(now);
            renderCalendar();
            renderAgenda();
        });

        renderCalendar();
        renderAgenda();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCalendar);
    } else {
        initializeCalendar();
    }
})();
