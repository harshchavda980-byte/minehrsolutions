/**
 * MineHR Premium Custom Datepicker Component
 * Matches the required double-view layout (Days View & Months View)
 * with a high-end, responsive, glassmorphic design.
 */

class MineHRDatePicker {
    constructor(elementId, options = {}) {
        this.input = document.getElementById(elementId);
        if (!this.input) return;

        this.options = {
            onSelect: null,
            ...options
        };

        this.currentDate = new Date(); // Date being viewed in calendar
        this.selectedDate = null;      // Date selected by the user
        this.view = 'days';            // 'days' or 'months'
        
        // Try parsing initial input value
        if (this.input.value) {
            const parsed = new Date(this.input.value);
            if (!isNaN(parsed.getTime())) {
                this.selectedDate = parsed;
                this.currentDate = new Date(parsed);
            }
        }

        this.initDOM();
        this.initEvents();
        this.render();
    }

    initDOM() {
        // Wrap input in a container for absolute positioning of picker
        const wrapper = document.createElement('div');
        wrapper.className = 'minehr-datepicker-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';

        this.input.parentNode.insertBefore(wrapper, this.input);
        wrapper.appendChild(this.input);

        // Hide default browser picker if any, and make readonly to prevent manual editing issues
        this.input.setAttribute('autocomplete', 'off');
        this.input.style.cursor = 'pointer';

        // Create the Datepicker Panel
        this.panel = document.createElement('div');
        this.panel.className = 'minehr-datepicker-panel';
        this.panel.style.display = 'none';
        
        wrapper.appendChild(this.panel);

        // Append stylesheet dynamically if not present
        if (!document.getElementById('minehr-datepicker-styles')) {
            const styles = document.createElement('style');
            styles.id = 'minehr-datepicker-styles';
            styles.innerHTML = `
                .minehr-datepicker-panel {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    width: 320px;
                    background: #11141e; /* Solid Opaque Deep Dark background */
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                    padding: 20px;
                    z-index: 10000;
                    user-select: none;
                    font-family: 'Outfit', 'Poppins', sans-serif;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0;
                    transform: translateY(10px);
                }

                /* Solid Light Mode Adaptability */
                .light .minehr-datepicker-panel {
                    background: #ffffff !important;
                    border: 1px solid rgba(0, 0, 0, 0.1) !important;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12) !important;
                }

                .light .minehr-datepicker-title-btn {
                    background: rgba(0, 0, 0, 0.06) !important;
                    color: #0f172a !important;
                }

                .light .minehr-datepicker-arrow {
                    color: #0f172a !important;
                }

                .light .minehr-datepicker-cell {
                    color: #0f172a !important;
                }

                .light .minehr-datepicker-month-cell {
                    color: #0f172a !important;
                }

                .light .minehr-datepicker-today-btn {
                    color: #0f172a !important;
                }

                .light .minehr-datepicker-today-btn:hover {
                    color: #d97706 !important;
                }

                .light .minehr-datepicker-cell.other-month {
                    color: #94a3b8 !important;
                    opacity: 0.5 !important;
                }

                .light .minehr-datepicker-cell.selected {
                    background: #fbd38d !important;
                    color: #0f172a !important;
                }

                .minehr-datepicker-panel.active {
                    opacity: 1;
                    transform: translateY(0);
                }

                .minehr-datepicker-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .minehr-datepicker-arrow {
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: bold;
                    color: var(--text-primary, #ffffff);
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .minehr-datepicker-arrow:hover {
                    background: rgba(255,255,255,0.08);
                    color: var(--primary, #6366f1);
                }

                .minehr-datepicker-title-btn {
                    cursor: pointer;
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-primary, #ffffff);
                    padding: 6px 16px;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 15px;
                    transition: all 0.2s;
                }

                .minehr-datepicker-title-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: scale(1.03);
                }

                /* Days Grid View */
                .minehr-datepicker-weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    font-size: 12px;
                    font-weight: 800;
                    color: var(--text-muted, #94a3b8);
                    margin-bottom: 10px;
                    text-transform: uppercase;
                }

                .minehr-datepicker-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 6px;
                    margin-bottom: 15px;
                }

                .minehr-datepicker-cell {
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13.5px;
                    font-weight: 600;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--text-primary, #ffffff);
                }

                .minehr-datepicker-cell:hover:not(.empty):not(.disabled) {
                    background: rgba(99, 102, 241, 0.15);
                    color: #fff;
                    transform: scale(1.05);
                }

                .minehr-datepicker-cell.other-month {
                    color: var(--text-muted, #4b5563);
                    opacity: 0.4;
                }

                .minehr-datepicker-cell.selected {
                    background: #fbd38d !important; /* Premium Warm Gold / Orange */
                    color: #121520 !important;
                    font-weight: 800;
                    box-shadow: 0 4px 12px rgba(251, 211, 141, 0.3);
                }

                .minehr-datepicker-cell.today-marker {
                    border: 1px solid rgba(251, 211, 141, 0.5);
                }

                /* Months View */
                .minehr-datepicker-months-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 15px;
                    padding: 5px 0;
                }

                .minehr-datepicker-month-cell {
                    padding: 14px 0;
                    text-align: center;
                    font-size: 14px;
                    font-weight: 700;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--text-primary, #ffffff);
                }

                .minehr-datepicker-month-cell:hover {
                    background: rgba(99, 102, 241, 0.15);
                    color: #fff;
                }

                .minehr-datepicker-month-cell.selected {
                    background: var(--primary, #6366f1);
                    color: white;
                }

                /* Footer */
                .minehr-datepicker-footer {
                    border-top: 1px solid var(--glass-border, rgba(255,255,255,0.06));
                    padding-top: 12px;
                    text-align: center;
                }

                .minehr-datepicker-today-btn {
                    cursor: pointer;
                    display: inline-block;
                    font-size: 13.5px;
                    font-weight: 700;
                    color: var(--text-primary, #ffffff);
                    transition: all 0.2s;
                }

                .minehr-datepicker-today-btn:hover {
                    color: #fbd38d;
                    transform: scale(1.03);
                }
            `;
            document.head.appendChild(styles);
        }
    }

    initEvents() {
        // Show panel on input focus/click
        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            this.show();
        });

        // Hide panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.panel.contains(e.target) && e.target !== this.input) {
                this.hide();
            }
        });
    }

    show() {
        // Hide other open pickers
        document.querySelectorAll('.minehr-datepicker-panel').forEach(p => {
            if (p !== this.panel) {
                p.style.display = 'none';
                p.classList.remove('active');
            }
        });

        this.view = 'days'; // Default to days view on open
        this.panel.style.display = 'block';
        
        // Prevent right-edge window clipping dynamically
        const rect = this.panel.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            this.panel.style.left = 'auto';
            this.panel.style.right = '0';
        } else {
            this.panel.style.left = '0';
            this.panel.style.right = 'auto';
        }

        setTimeout(() => this.panel.classList.add('active'), 10);
        this.render();
    }

    hide() {
        this.panel.classList.remove('active');
        setTimeout(() => {
            this.panel.style.display = 'none';
        }, 200);
    }

    prev() {
        if (this.view === 'days') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else {
            this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        }
        this.render();
    }

    next() {
        if (this.view === 'days') {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        } else {
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        }
        this.render();
    }

    selectDay(day) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        this.selectedDate = new Date(year, month, day);
        this.currentDate = new Date(this.selectedDate);
        
        // Format as YYYY-MM-DD
        const formatted = this.formatDateISO(this.selectedDate);
        this.input.value = formatted;
        
        // Trigger default input events to notify frameworks / other scripts
        this.input.dispatchEvent(new Event('input'));
        this.input.dispatchEvent(new Event('change'));

        if (this.options.onSelect) {
            this.options.onSelect(formatted, this.selectedDate);
        }

        this.hide();
    }

    selectMonth(monthIndex) {
        this.currentDate.setMonth(monthIndex);
        this.view = 'days';
        this.render();
    }

    selectToday() {
        const today = new Date();
        this.selectedDate = today;
        this.currentDate = new Date(today);
        
        const formatted = this.formatDateISO(today);
        this.input.value = formatted;

        this.input.dispatchEvent(new Event('input'));
        this.input.dispatchEvent(new Event('change'));

        if (this.options.onSelect) {
            this.options.onSelect(formatted, today);
        }

        this.hide();
    }

    toggleView() {
        this.view = this.view === 'days' ? 'months' : 'days';
        this.render();
    }

    clear() {
        this.selectedDate = null;
        this.input.value = '';
        this.render();
    }

    formatDateISO(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    formatDisplayDate(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    }

    render() {
        this.panel.innerHTML = '';

        // 1. Header Row
        const header = document.createElement('div');
        header.className = 'minehr-datepicker-header';

        const prevBtn = document.createElement('div');
        prevBtn.className = 'minehr-datepicker-arrow';
        prevBtn.innerHTML = '«';
        prevBtn.onclick = (e) => { e.stopPropagation(); this.prev(); };

        const titleBtn = document.createElement('div');
        titleBtn.className = 'minehr-datepicker-title-btn';
        
        if (this.view === 'days') {
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            titleBtn.innerHTML = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        } else {
            titleBtn.innerHTML = `${this.currentDate.getFullYear()}`;
        }
        titleBtn.onclick = (e) => { e.stopPropagation(); this.toggleView(); };

        const nextBtn = document.createElement('div');
        nextBtn.className = 'minehr-datepicker-arrow';
        nextBtn.innerHTML = '»';
        nextBtn.onclick = (e) => { e.stopPropagation(); this.next(); };

        header.appendChild(prevBtn);
        header.appendChild(titleBtn);
        header.appendChild(nextBtn);
        this.panel.appendChild(header);

        // 2. View Rendering
        if (this.view === 'days') {
            this.renderDaysView();
        } else {
            this.renderMonthsView();
        }

        // 3. Footer Row (Today Button)
        const footer = document.createElement('div');
        footer.className = 'minehr-datepicker-footer';

        const todayBtn = document.createElement('div');
        todayBtn.className = 'minehr-datepicker-today-btn';
        todayBtn.innerHTML = `Today : ${this.formatDisplayDate(new Date())}`;
        todayBtn.onclick = (e) => { e.stopPropagation(); this.selectToday(); };

        footer.appendChild(todayBtn);
        this.panel.appendChild(footer);
    }

    renderDaysView() {
        // Weekday Headers
        const weekdays = document.createElement('div');
        weekdays.className = 'minehr-datepicker-weekdays';
        const daysLabel = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        weekdays.innerHTML = daysLabel.map(d => `<div>${d}</div>`).join('');
        this.panel.appendChild(weekdays);

        // Days Grid
        const grid = document.createElement('div');
        grid.className = 'minehr-datepicker-grid';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Get first day of the month & total days
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const prevMonthTotalDays = new Date(year, month, 0).getDate();

        const today = new Date();

        // 1. Fill previous month's trailing days
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNum = prevMonthTotalDays - i;
            const cell = document.createElement('div');
            cell.className = 'minehr-datepicker-cell other-month';
            cell.innerHTML = dayNum;
            // Support navigating back to previous month when clicking these trailing days
            cell.onclick = (e) => {
                e.stopPropagation();
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.selectDay(dayNum);
            };
            grid.appendChild(cell);
        }

        // 2. Fill current month's days
        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement('div');
            cell.className = 'minehr-datepicker-cell';
            cell.innerHTML = day;

            // Check if selected
            if (this.selectedDate && 
                this.selectedDate.getDate() === day && 
                this.selectedDate.getMonth() === month && 
                this.selectedDate.getFullYear() === year) {
                cell.classList.add('selected');
            }

            // Check if today
            if (today.getDate() === day && 
                today.getMonth() === month && 
                today.getFullYear() === year) {
                cell.classList.add('today-marker');
            }

            cell.onclick = (e) => {
                e.stopPropagation();
                this.selectDay(day);
            };

            grid.appendChild(cell);
        }

        // 3. Fill next month's leading days
        const totalCellsFilled = firstDayIndex + totalDays;
        const remainingCells = (totalCellsFilled % 7 === 0) ? 0 : (7 - (totalCellsFilled % 7));
        for (let day = 1; day <= remainingCells; day++) {
            const cell = document.createElement('div');
            cell.className = 'minehr-datepicker-cell other-month';
            cell.innerHTML = day;
            // Support navigating to next month when clicking these leading days
            cell.onclick = (e) => {
                e.stopPropagation();
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.selectDay(day);
            };
            grid.appendChild(cell);
        }

        this.panel.appendChild(grid);
    }

    renderMonthsView() {
        const grid = document.createElement('div');
        grid.className = 'minehr-datepicker-months-grid';

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        months.forEach((m, idx) => {
            const cell = document.createElement('div');
            cell.className = 'minehr-datepicker-month-cell';
            cell.innerHTML = m;

            if (this.selectedDate && 
                this.selectedDate.getMonth() === idx && 
                this.selectedDate.getFullYear() === this.currentDate.getFullYear()) {
                cell.classList.add('selected');
            }

            cell.onclick = (e) => {
                e.stopPropagation();
                this.selectMonth(idx);
            };

            grid.appendChild(cell);
        });

        this.panel.appendChild(grid);
    }
}

// Automatically expose to window for global access
window.MineHRDatePicker = MineHRDatePicker;
