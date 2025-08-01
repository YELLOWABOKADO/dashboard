/**
 * Модуль динамики компании
 */

console.log('🚀 МОДУЛЬ COMPANY-DYNAMICS.JS НАЧАЛ ЗАГРУЖАТЬСЯ');

// Функция инициализации динамики компании
function initCompanyDynamics() {
    console.log('=== Инициализация динамики компании ===');
    
    // Инициализируем сворачивающиеся блоки
    if (typeof initCollapsibleSections === 'function') {
        initCollapsibleSections();
    }
    
    console.log('Динамика компании инициализирована');
}

// Функция получения фильтров для динамики компании
function getCompanyDynamicsFilters() {
    const timeGranularity = document.getElementById('timeGranularity')?.value || 'Месяц';
    const callCenter = document.getElementById('callCenter')?.value || 'Все КЦ';
    const dashboard = document.getElementById('dashboard')?.value || 'Автооценка';
    
    // Вычисляем даты на основе режима отображения
    const dates = calculateDynamicDates(timeGranularity);
    
    return {
        startDate: dates.startDate,
        endDate: dates.endDate,
        timeGranularity: timeGranularity,
        callCenter: callCenter,
        dashboard: dashboard
    };
}

// Функция вычисления дат на основе режима отображения
function calculateDynamicDates(timeGranularity) {
    const today = new Date();
    let startDate, endDate;
    
    switch (timeGranularity) {
        case 'Месяц':
            // Последние 3 месяца
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Последний день текущего месяца
            startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1); // Первый день 3 месяца назад
            break;
            
        case 'Неделя':
            // Последние 15 недель
            endDate = new Date(today);
            startDate = new Date(today);
            startDate.setDate(today.getDate() - (15 * 7)); // 15 недель назад
            break;
            
        case 'День':
            // Последние 15 дней
            endDate = new Date(today);
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 15); // 15 дней назад
            break;
            
        default:
            // По умолчанию - последние 3 месяца
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    }
    
    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
}

// Функция загрузки динамики компании
async function loadCompanyDynamics() {
    console.log('=== Загрузка динамики компании ===');
    
    const container = document.getElementById('companyDynamics');
    if (!container) {
        console.error('Контейнер динамики компании не найден');
        return;
    }
    
    // Показываем индикатор загрузки
    container.innerHTML = '<div class="loading">Загрузка динамики компании...</div>';
    
    try {
        // Получаем фильтры
        const filters = getCompanyDynamicsFilters();
        console.log('Фильтры динамики компании:', filters);
        
        // Загружаем данные операторов
        const operatorData = await loadOperatorData();
        if (!operatorData) {
            console.error('Не удалось загрузить данные операторов');
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки данных</div>';
            return;
        }
        
        // Получаем периоды в зависимости от режима отображения
        const periods = getPeriods(filters.startDate, filters.endDate, filters.timeGranularity);
        console.log('Периоды для динамики компании:', periods);
        
        if (periods.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Нет периодов для отображения</div>';
            return;
        }
        
        // Фильтруем сотрудников по КЦ
        const filteredEmployees = filterEmployeesForCompanyDynamics(operatorData, filters);
        console.log('Отфильтрованные сотрудники для динамики компании:', filteredEmployees);
        
        if (filteredEmployees.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Нет данных для выбранных фильтров</div>';
            return;
        }
        
        // Агрегируем данные по компании
        const companyData = aggregateCompanyData(filteredEmployees, operatorData, periods);
        
        // Генерируем HTML таблицы динамики компании
        const tableHTML = generateCompanyDynamicsTable(companyData, periods, filters.timeGranularity);
        container.innerHTML = tableHTML;
        
        console.log(`Динамика компании загружена успешно (${filters.timeGranularity}, ${periods.length} периодов)`);
        
    } catch (error) {
        console.error('Ошибка при загрузке динамики компании:', error);
        container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки динамики компании</div>';
    }
}

// Фильтрация сотрудников для динамики компании
function filterEmployeesForCompanyDynamics(operatorData, filters) {
    return Object.keys(operatorData).filter(employeeName => {
        const employee = operatorData[employeeName];
        
        // Фильтр по КЦ
        if (filters.callCenter !== 'Все КЦ' && employee['КЦ'] !== filters.callCenter) {
            return false;
        }
        
        return true;
    });
}

// Агрегация данных по компании
function aggregateCompanyData(filteredEmployees, operatorData, periods) {
    const companyData = [];
    
    periods.forEach(period => {
        let totalCalls = 0;
        let totalDeviations = 0;
        
        // Суммируем данные всех сотрудников за период
        filteredEmployees.forEach(employeeName => {
            const employeeData = operatorData[employeeName]['Данные'];
            period.dates.forEach(date => {
                if (employeeData && employeeData[date]) {
                    totalCalls += employeeData[date]['Звонков'] || 0;
                    totalDeviations += employeeData[date]['Отклонений'] || 0;
                }
            });
        });
        
        const percentage = totalCalls > 0 ? (totalDeviations / totalCalls) * 100 : 0;
        
        companyData.push({
            period: period.label,
            calls: totalCalls,
            deviations: totalDeviations,
            percentage: Math.round(percentage * 100) / 100
        });
    });
    
    return companyData;
}

// Генерация HTML таблицы динамики компании
function generateCompanyDynamicsTable(companyData, periods, granularity) {
    // Определяем режим отображения для заголовка
    const modeLabels = {
        'День': 'По дням (последние 15 дней)',
        'Неделя': 'По неделям (последние 15 недель)', 
        'Месяц': 'По месяцам (последние 3 месяца)'
    };
    
    // Создаем заголовки таблицы
    const isScrollable = granularity === 'День' && periods.length > 10;
    
    let tableHTML = `
        <div class="details-table-container">
            <div class="details-mode-selector">
                <span class="details-mode-label">${modeLabels[granularity] || 'Динамика компании'}</span>
            </div>
            <div class="details-table-wrapper ${isScrollable ? 'scrollable' : ''}">
                <table class="details-table">
                    <thead>
                        <tr>
                            <th class="details-header-employee">Показатель</th>
    `;
    
    // Добавляем заголовки периодов как столбцы
    companyData.forEach(periodData => {
        tableHTML += `<th class="details-header-period">${periodData.period}</th>`;
    });
    
    tableHTML += `
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Создаем строку "Звонков"
    tableHTML += `
        <tr class="details-row">
            <td class="details-employee-name">Звонков</td>
    `;
    companyData.forEach(periodData => {
        tableHTML += `<td class="details-cell">${periodData.calls.toLocaleString()}</td>`;
    });
    tableHTML += '</tr>';
    
    // Создаем строку "Отклонений"
    tableHTML += `
        <tr class="details-row">
            <td class="details-employee-name">Отклонений</td>
    `;
    companyData.forEach(periodData => {
        tableHTML += `<td class="details-cell">${periodData.deviations.toLocaleString()}</td>`;
    });
    tableHTML += '</tr>';
    
    // Создаем строку "% отклонений"
    tableHTML += `
        <tr class="details-row">
            <td class="details-employee-name">% отклонений</td>
    `;
    companyData.forEach(periodData => {
        tableHTML += `<td class="details-cell"><span class="details-percentage">${periodData.percentage.toFixed(2)}%</span></td>`;
    });
    tableHTML += '</tr>';
    
    // Создаем строку "Изменение"
    tableHTML += `
        <tr class="details-row">
            <td class="details-employee-name">Изменение</td>
    `;
    companyData.forEach((periodData, index) => {
        let changeHTML = '';
        if (index > 0) {
            const prevPeriodData = companyData[index - 1];
            const change = calculatePercentageChange(periodData.percentage, prevPeriodData.percentage);
            
            if (Math.abs(change) > 0.1) { // Показываем изменение только если оно значимое
                const changeClass = change > 0 ? 'positive' : 'negative';
                const changeSign = change > 0 ? '+' : '';
                changeHTML = `<span class="details-change ${changeClass}">${changeSign}${Math.round(change)}%</span>`;
            } else {
                changeHTML = '<span class="details-change neutral">0%</span>';
            }
        } else {
            changeHTML = '<span class="details-change neutral">—</span>';
        }
        
        tableHTML += `<td class="details-cell">${changeHTML}</td>`;
    });
    tableHTML += '</tr>';
    
    tableHTML += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return tableHTML;
}

// Экспорт функций для браузера
if (typeof window !== 'undefined') {
    window.initCompanyDynamics = initCompanyDynamics;
    window.loadCompanyDynamics = loadCompanyDynamics;
    window.getCompanyDynamicsFilters = getCompanyDynamicsFilters;
    window.calculateDynamicDates = calculateDynamicDates;
    
    console.log('=== company-dynamics.js загружен ===');
    console.log('Функции экспортированы:', {
        initCompanyDynamics: typeof window.initCompanyDynamics,
        loadCompanyDynamics: typeof window.loadCompanyDynamics,
        getCompanyDynamicsFilters: typeof window.getCompanyDynamicsFilters,
        calculateDynamicDates: typeof window.calculateDynamicDates
    });
}

console.log('🏁 МОДУЛЬ COMPANY-DYNAMICS.JS ПОЛНОСТЬЮ ЗАГРУЖЕН');