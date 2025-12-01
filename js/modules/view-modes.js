/**
 * Переключатель режимов "Сводка / Подробно" и расчёт кратких карточек
 */
(function () {
    window.dynamicsViewMode = window.dynamicsViewMode || 'summary';
    window.ratingsViewMode = window.ratingsViewMode || 'summary';

    document.addEventListener('DOMContentLoaded', () => {
        initViewToggle('dynamicsViewModeToggle', 'dynamics');
        initViewToggle('ratingsViewModeToggle', 'ratings');

        if (typeof getDynamicsFilters === 'function') {
            renderDynamicsSummary(getDynamicsFilters());
        }
        if (typeof getRatingsFilters === 'function') {
            renderRatingsSummary(getRatingsFilters());
        }
        applyMode('dynamics', window.dynamicsViewMode, false);
        applyMode('ratings', window.ratingsViewMode, false);
    });

    function initViewToggle(toggleId, target) {
        const toggle = document.getElementById(toggleId);
        if (!toggle) return;
        toggle.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-mode-btn');
            if (!btn) return;
            toggle.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyMode(target, btn.dataset.mode, true);
        });
    }

    function applyMode(target, mode, triggerUpdate) {
        const tab = document.getElementById(`${target}Tab`);
        if (!tab) return;
        const isSummary = mode === 'summary';
        tab.classList.toggle('summary-mode', isSummary);

        if (target === 'dynamics') {
            window.dynamicsViewMode = mode;
            if (isSummary) {
                setHeavyPlaceholders(tab, 'Сводка: нажмите «Подробно», чтобы показать таблицы.');
                if (typeof renderDynamicsSummary === 'function' && typeof getDynamicsFilters === 'function') {
                    renderDynamicsSummary(getDynamicsFilters());
                }
            } else if (triggerUpdate && typeof updateDynamicsData === 'function') {
                updateDynamicsData();
            }
        }

        if (target === 'ratings') {
            window.ratingsViewMode = mode;
            if (isSummary) {
                setHeavyPlaceholders(tab, 'Сводка: включите «Подробно», чтобы увидеть таблицу рейтинга.');
                if (typeof renderRatingsSummary === 'function' && typeof getRatingsFilters === 'function') {
                    renderRatingsSummary(getRatingsFilters());
                }
            } else if (triggerUpdate && typeof updateRatingsData === 'function') {
                updateRatingsData();
            }
        }
    }

    function setHeavyPlaceholders(root, text) {
        root.querySelectorAll('[data-heavy="true"]').forEach(section => {
            const content = section.querySelector('.details-container') || section.querySelector('.collapsible-content') || section;
            if (content) {
                content.innerHTML = `<div class="placeholder">${text}</div>`;
            }
        });
    }

    function inRange(dateStr, start, end) {
        const d = new Date(dateStr);
        return (!start || d >= new Date(start)) && (!end || d <= new Date(end));
    }

    function filterPass(employee, filters) {
        if (!filters) return true;
        if (filters.callCenter && filters.callCenter !== 'Все КЦ' && employee['КЦ'] !== filters.callCenter) return false;
        if (Array.isArray(filters.departments) && filters.departments.length && !filters.departments.includes('all')) {
            const dep = employee['Группа'] || '';
            if (!filters.departments.some(d => dep.includes(d))) return false;
        }
        if (Array.isArray(filters.employees) && filters.employees.length && !filters.employees.includes('all')) {
            const name = employee.name || '';
            if (!filters.employees.includes(name)) return false;
        }
        return true;
    }

    function aggregateOperator(name, employee, filters) {
        if (!filterPass({ ...employee, name }, filters)) return null;
        const dates = employee['Данные'] || {};
        let calls = 0;
        let deviations = 0;
        Object.keys(dates).forEach(date => {
            if (!inRange(date, filters.startDate, filters.endDate)) return;
            const day = dates[date];
            calls += Number(day['Звонков'] || 0);
            deviations += Number(day['Отклонений'] || 0);
        });
        if (calls === 0 && deviations === 0) return null;
        return {
            name,
            group: employee['Группа'] || '',
            calls,
            deviations,
            percent: calls ? (deviations / calls) * 100 : 0
        };
    }

    async function renderDynamicsSummary(filters) {
        const data = typeof loadOperatorData === 'function' ? await loadOperatorData() : null;
        if (!data) return;
        const metrics = Object.entries(data)
            .map(([name, emp]) => aggregateOperator(name, emp, filters))
            .filter(Boolean);
        updateSummaryCards(metrics, 'dyn');
    }

    async function renderRatingsSummary(filters) {
        const data = typeof loadOperatorData === 'function' ? await loadOperatorData() : null;
        if (!data) return;
        const metrics = Object.entries(data)
            .map(([name, emp]) => aggregateOperator(name, emp, filters))
            .filter(Boolean);
        updateSummaryCards(metrics, 'rat');
    }

    function updateSummaryCards(metrics, prefix) {
        const countEl = document.getElementById(`${prefix}SummaryCount`);
        const avgEl = document.getElementById(`${prefix}SummaryAvg`);
        const callsEl = document.getElementById(`${prefix}SummaryCalls`);
        const bestEl = document.getElementById(`${prefix}SummaryBest`);
        const worstEl = document.getElementById(`${prefix}SummaryWorst`);
        const bestGroupEl = document.getElementById(`${prefix}SummaryBestGroup`);
        const worstGroupEl = document.getElementById(`${prefix}SummaryWorstGroup`);

        if (!metrics.length) {
            [countEl, avgEl, callsEl, bestEl, worstEl, bestGroupEl, worstGroupEl].forEach(el => el && (el.textContent = '—'));
            const cnt = document.getElementById(`${prefix}SummaryCount`) || document.getElementById(`${prefix}SummaryCount`);
            if (cnt) cnt.textContent = '0';
            return;
        }

        const totalCalls = metrics.reduce((acc, m) => acc + m.calls, 0);
        const totalDev = metrics.reduce((acc, m) => acc + m.deviations, 0);
        const avg = totalCalls ? (totalDev / totalCalls) * 100 : 0;
        const sorted = [...metrics].sort((a, b) => a.percent - b.percent);
        const best = sorted[0];
        const worst = sorted[sorted.length - 1];

        if (countEl) countEl.textContent = metrics.length.toString();
        if (avgEl) avgEl.textContent = `${avg.toFixed(2)}%`;
        if (callsEl) callsEl.textContent = `${totalDev} отклон. / ${totalCalls} звонков`;

        if (bestEl) bestEl.textContent = `${best.name} (${best.percent.toFixed(2)}%)`;
        if (bestGroupEl) bestGroupEl.textContent = best.group || '—';
        if (worstEl) worstEl.textContent = `${worst.name} (${worst.percent.toFixed(2)}%)`;
        if (worstGroupEl) worstGroupEl.textContent = worst.group || '—';
    }

    // Делаем функции видимыми глобально
    window.renderDynamicsSummary = renderDynamicsSummary;
    window.renderRatingsSummary = renderRatingsSummary;
})();
