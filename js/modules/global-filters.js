/**
 * Единые фильтры для всех вкладок
 */
(function () {
    const applyBtn = document.getElementById('applyGlobalFilters');
    if (!applyBtn) {
        return;
    }

    const map = {
        dateStart: ['startDate', 'deptStartDate', 'dynStartDate', 'ratStartDate', 'empDynStartDate', 'checklistDateFrom'],
        dateEnd: ['endDate', 'deptEndDate', 'dynEndDate', 'ratEndDate', 'empDynEndDate', 'checklistDateTo'],
        granularity: ['timeGranularity', 'dynTimeGranularity', 'empDynGranularity'],
        callCenter: ['callCenter', 'deptCallCenter', 'dynCallCenter', 'ratCallCenter'],
        dashboard: ['dashboard', 'deptDashboard', 'dynDashboard', 'ratDashboard', 'checklistDashboard']
    };

    function setValue(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.tagName === 'SELECT') {
            el.value = value;
        } else {
            el.value = value;
        }
    }

    async function applyGlobalFilters() {
        const gStart = document.getElementById('globalStartDate')?.value;
        const gEnd = document.getElementById('globalEndDate')?.value;
        const gGran = document.getElementById('globalGranularity')?.value;
        const gCallCenter = document.getElementById('globalCallCenter')?.value;
        const gDashboard = document.getElementById('globalDashboard')?.value;

        if (gStart) map.dateStart.forEach(id => setValue(id, gStart));
        if (gEnd) map.dateEnd.forEach(id => setValue(id, gEnd));
        if (gGran) {
            map.granularity.forEach(id => {
                if (id === 'empDynGranularity') {
                    setValue(id, gGran === 'Неделя' ? 'week' : 'month');
                } else {
                    setValue(id, gGran);
                }
            });
        }
        if (gCallCenter) {
            map.callCenter.forEach(id => setValue(id, gCallCenter));
        }
        if (gDashboard) {
            map.dashboard.forEach(id => setValue(id, gDashboard));
        }

        if (typeof syncEmployeeDynamicsFilters === 'function') {
            syncEmployeeDynamicsFilters();
        }

        // Обновляем основные экраны
        if (typeof updateCompanyData === 'function') await updateCompanyData();
        if (typeof updateDepartmentsData === 'function') await updateDepartmentsData();
        if (typeof updateEmployeesData === 'function') await updateEmployeesData();
        if (typeof updateDynamicsData === 'function') await updateDynamicsData();
        if (typeof updateRatingsData === 'function') await updateRatingsData();

        // Сводки сразу перерисовываем
        if (typeof renderDynamicsSummary === 'function') {
            const filters = typeof getDynamicsFilters === 'function' ? getDynamicsFilters() : {};
            renderDynamicsSummary(filters);
        }
        if (typeof renderRatingsSummary === 'function') {
            const filters = typeof getRatingsFilters === 'function' ? getRatingsFilters() : {};
            renderRatingsSummary(filters);
        }
    }

    applyBtn.addEventListener('click', () => applyGlobalFilters());
})();
