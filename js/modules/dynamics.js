/**
 * Модуль управления вкладкой "Динамика"
 */

console.log('🚀 МОДУЛЬ DYNAMICS.JS НАЧАЛ ЗАГРУЖАТЬСЯ');

// Функция инициализации модуля динамики
function initDynamicsModule() {
    console.log('=== Инициализация модуля динамики ===');
    
    // Инициализируем фильтры для динамики
    setupDynamicsFilters();
    
    // Инициализируем сворачивающиеся блоки
    if (typeof initCollapsibleSections === 'function') {
        initCollapsibleSections();
    }
    
    console.log('Модуль динамики инициализирован');
}

// Настройка фильтров для вкладки динамики
function setupDynamicsFilters() {
    console.log('=== Настройка фильтров динамики ===');
    
    // Обработчик кнопки "Обновить"
    const updateButton = document.getElementById('dynUpdateButton');
    if (updateButton) {
        updateButton.addEventListener('click', async function () {
            console.log('=== Кнопка "Обновить" динамики нажата ===');
            await updateDynamicsData();
        });
    }
    
    // Настройка мультиселекта для групп
    setupDynamicsMultiSelect('dynDepartments', 'Все группы');
    
    // Настройка мультиселекта для сотрудников
    setupDynamicsMultiSelect('dynEmployees', 'Все сотрудники');
}

// Настройка мультиселекта для динамики
function setupDynamicsMultiSelect(prefix, defaultText) {
    const button = document.getElementById(prefix + 'Button');
    const dropdown = document.getElementById(prefix + 'Dropdown');
    const textSpan = document.getElementById(prefix + 'Text');
    
    if (!button || !dropdown || !textSpan) {
        console.log(`Элементы мультиселекта ${prefix} не найдены`);
        return;
    }
    
    // Обработчик клика по кнопке
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    
    // Закрытие при клике вне элемента
    document.addEventListener('click', function() {
        dropdown.style.display = 'none';
    });
    
    // Обработчик изменения чекбоксов
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
    const allCheckbox = dropdown.querySelector('input[value="all"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.value === 'all') {
                // Если выбран "Все", снимаем остальные
                checkboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            } else {
                // Если выбран конкретный элемент, снимаем "Все"
                if (allCheckbox) allCheckbox.checked = false;
            }
            
            updateDynamicsMultiSelectText(prefix, defaultText);
        });
    });
}

// Обновление текста мультиселекта для динамики
function updateDynamicsMultiSelectText(prefix, defaultText) {
    const dropdown = document.getElementById(prefix + 'Dropdown');
    const textSpan = document.getElementById(prefix + 'Text');
    
    if (!dropdown || !textSpan) return;
    
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
    const allCheckbox = dropdown.querySelector('input[value="all"]:checked');
    
    if (allCheckbox || checkboxes.length === 0) {
        textSpan.textContent = defaultText;
    } else if (checkboxes.length === 1) {
        textSpan.textContent = checkboxes[0].nextElementSibling.textContent;
    } else {
        textSpan.textContent = `Выбрано: ${checkboxes.length}`;
    }
}

// Основная функция обновления данных динамики
async function updateDynamicsData() {
    console.log('=== Обновление данных динамики ===');
    
    // Получаем параметры фильтров
    const filters = getDynamicsFilters();
    console.log('Фильтры динамики:', filters);
    
    // Проверяем валидность диапазона дат
    if (!validateDateRange(filters.startDate, filters.endDate, filters.timeGranularity)) {
        return;
    }
    
    // Загружаем динамику
    await loadDynamicsDetails();
}

// Получение значений фильтров динамики
function getDynamicsFilters() {
    return {
        startDate: document.getElementById('dynStartDate')?.value || '2025-07-01',
        endDate: document.getElementById('dynEndDate')?.value || '2025-07-31',
        timeGranularity: document.getElementById('dynTimeGranularity')?.value || 'Месяц',
        callCenter: document.getElementById('dynCallCenter')?.value || 'Все КЦ',
        dashboard: document.getElementById('dynDashboard')?.value || 'Автооценка',
        departments: getSelectedDynamicsValues('dynDepartments'),
        employees: getSelectedDynamicsValues('dynEmployees')
    };
}

// Получение выбранных значений мультиселекта динамики
function getSelectedDynamicsValues(prefix) {
    const dropdown = document.getElementById(prefix + 'Dropdown');
    if (!dropdown) return [];
    
    const allCheckbox = dropdown.querySelector('input[value="all"]:checked');
    if (allCheckbox) return ['all'];
    
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Функция загрузки динамики по команде
async function loadDynamicsTeamDetails() {
    console.log('=== Загрузка динамики по команде ===');
    
    const container = document.getElementById('dynamicsTeamDetails');
    if (!container) {
        console.error('Контейнер динамики по команде не найден');
        return;
    }
    
    // Показываем индикатор загрузки
    container.innerHTML = '<div class="loading">Загрузка динамики по команде...</div>';
    
    try {
        // Получаем фильтры
        const filters = getDynamicsFilters();
        
        // Загружаем данные операторов
        const operatorData = await loadOperatorData();
        if (!operatorData) {
            console.error('Не удалось загрузить данные операторов');
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки данных</div>';
            return;
        }
        
        // Получаем периоды в зависимости от режима отображения
        const periods = getPeriods(filters.startDate, filters.endDate, filters.timeGranularity);
        console.log('Периоды для динамики:', periods);
        
        if (periods.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Нет периодов для отображения</div>';
            return;
        }
        
        // Фильтруем сотрудников
        const filteredEmployees = filterEmployeesForDynamics(operatorData, filters);
        console.log('Отфильтрованные сотрудники:', filteredEmployees);
        
        if (filteredEmployees.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Нет данных для выбранных фильтров</div>';
            return;
        }
        
        // Генерируем HTML таблицы динамики по команде
        const tableHTML = generateDynamicsTeamTable(filteredEmployees, operatorData, periods, filters.timeGranularity);
        container.innerHTML = tableHTML;
        
        console.log(`Динамика по команде загружена успешно (${filters.timeGranularity}, ${periods.length} периодов, ${filteredEmployees.length} сотрудников)`);
        
    } catch (error) {
        console.error('Ошибка при загрузке динамики по команде:', error);
        container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки динамики по команде</div>';
    }
}

// Функция загрузки динамики по подразделениям
async function loadDynamicsDepartmentsDetails() {
    console.log('=== Загрузка динамики по подразделениям ===');
    
    const container = document.getElementById('dynamicsDepartmentsDetails');
    if (!container) {
        console.error('Контейнер динамики по подразделениям не найден');
        return;
    }
    
    // Показываем индикатор загрузки
    container.innerHTML = '<div class="loading">Загрузка динамики по подразделениям...</div>';
    
    try {
        // Получаем фильтры
        const filters = getDynamicsFilters();
        
        // Загружаем данные операторов
        const operatorData = await loadOperatorData();
        if (!operatorData) {
            console.error('Не удалось загрузить данные операторов');
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки данных</div>';
            return;
        }
        
        // Получаем периоды в зависимости от режима отображения
        const periods = getPeriods(filters.startDate, filters.endDate, filters.timeGranularity);
        console.log('Периоды для динамики по подразделениям:', periods);
        
        if (periods.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Нет периодов для отображения</div>';
            return;
        }
        
        // Группируем данные по подразделениям
        const departmentsData = groupDataByDepartments(operatorData, filters);
        console.log('Данные по подразделениям:', departmentsData);
        
        if (Object.keys(departmentsData).length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Нет данных для выбранных фильтров</div>';
            return;
        }
        
        // Генерируем HTML таблицы динамики по подразделениям
        const tableHTML = generateDynamicsDepartmentsTable(departmentsData, periods, filters.timeGranularity);
        container.innerHTML = tableHTML;
        
        console.log(`Динамика по подразделениям загружена успешно (${filters.timeGranularity}, ${periods.length} периодов, ${Object.keys(departmentsData).length} подразделений)`);
        
    } catch (error) {
        console.error('Ошибка при загрузке динамики по подразделениям:', error);
        container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки динамики по подразделениям</div>';
    }
}

// Основная функция загрузки динамики (загружает оба блока)
async function loadDynamicsDetails() {
    console.log('=== Загрузка всей динамики ===');
    await loadDynamicsTeamDetails();
    await loadDynamicsDepartmentsDetails();
}

// Фильтрация сотрудников для динамики
function filterEmployeesForDynamics(operatorData, filters) {
    return Object.keys(operatorData).filter(employeeName => {
        const employee = operatorData[employeeName];
        
        // Фильтр по КЦ
        if (filters.callCenter !== 'Все КЦ' && employee['КЦ'] !== filters.callCenter) {
            return false;
        }
        
        // Фильтр по группам
        if (filters.departments.length > 0 && !filters.departments.includes('all')) {
            const employeeDepartment = employee['Группа'];
            if (!filters.departments.some(dept => employeeDepartment && employeeDepartment.includes(dept))) {
                return false;
            }
        }
        
        // Фильтр по сотрудникам
        if (filters.employees.length > 0 && !filters.employees.includes('all')) {
            if (!filters.employees.includes(employeeName)) {
                return false;
            }
        }
        
        return true;
    });
}

// Генерация HTML таблицы динамики по команде
function generateDynamicsTeamTable(filteredEmployees, operatorData, periods, granularity) {
    // Определяем режим отображения для заголовка
    const modeLabels = {
        'День': 'По дням',
        'Неделя': 'По неделям', 
        'Месяц': 'По месяцам'
    };
    
    // Создаем заголовки таблицы
    const isScrollable = granularity === 'День' && periods.length > 10;
    
    let tableHTML = `
        <div class="details-table-container">
            <div class="details-mode-selector">
                <span class="details-mode-label">${modeLabels[granularity] || 'По периодам'}</span>
            </div>
            <div class="details-table-wrapper ${isScrollable ? 'scrollable' : ''}">
                <table class="details-table">
                    <thead>
                        <tr>
                            <th class="details-header-employee">% отклонений</th>
    `;
    
    // Добавляем заголовки периодов
    periods.forEach(period => {
        tableHTML += `<th class="details-header-period">${period.label}</th>`;
    });
    
    tableHTML += `
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Создаем строки для каждого сотрудника
    filteredEmployees.forEach(employeeName => {
        const employee = operatorData[employeeName];
        const employeeData = employee['Данные'];
        
        tableHTML += `
            <tr class="details-row">
                <td class="details-employee-name">${employeeName}</td>
        `;
        
        // Добавляем данные по периодам
        periods.forEach((period, index) => {
            const periodData = aggregateDetailsDataForPeriod(employeeData, period.dates);
            const percentage = periodData.percentage;
            
            // Получаем данные предыдущего периода для сравнения (если есть)
            let changeHTML = '';
            if (index > 0) {
                const prevPeriod = periods[index - 1];
                const prevPeriodData = aggregateDetailsDataForPeriod(employeeData, prevPeriod.dates);
                const change = calculatePercentageChange(percentage, prevPeriodData.percentage);
                
                if (Math.abs(change) > 0.1) { // Показываем изменение только если оно значимое
                    const changeClass = change > 0 ? 'positive' : 'negative';
                    const changeSign = change > 0 ? '+' : '';
                    changeHTML = `<span class="details-change ${changeClass}">${changeSign}${Math.round(change)}%</span>`;
                }
            }
            
            // Показываем дополнительную информацию при наведении
            const tooltipInfo = `Звонков: ${periodData.calls}, Отклонений: ${periodData.deviations}`;
            
            tableHTML += `
                <td class="details-cell" title="${tooltipInfo}">
                    <div class="details-cell-content">
                        <span class="details-percentage">${percentage.toFixed(1)}%</span>
                        ${changeHTML}
                    </div>
                </td>
            `;
        });
        
        tableHTML += '</tr>';
    });
    
    tableHTML += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return tableHTML;
}

// Группировка данных по подразделениям
function groupDataByDepartments(operatorData, filters) {
    const departmentsData = {};
    
    Object.keys(operatorData).forEach(employeeName => {
        const employee = operatorData[employeeName];
        
        // Фильтр по КЦ
        if (filters.callCenter !== 'Все КЦ' && employee['КЦ'] !== filters.callCenter) {
            return;
        }
        
        // Фильтр по группам
        if (filters.departments.length > 0 && !filters.departments.includes('all')) {
            const employeeDepartment = employee['Группа'];
            if (!filters.departments.some(dept => employeeDepartment && employeeDepartment.includes(dept))) {
                return;
            }
        }
        
        const department = employee['Группа'] || 'Без группы';
        
        if (!departmentsData[department]) {
            departmentsData[department] = {
                employees: [],
                data: {}
            };
        }
        
        departmentsData[department].employees.push(employeeName);
        departmentsData[department].data[employeeName] = employee['Данные'];
    });
    
    return departmentsData;
}

// Агрегация данных подразделения за период
function aggregateDepartmentDataForPeriod(departmentData, dates) {
    let totalCalls = 0;
    let totalDeviations = 0;
    
    // Суммируем данные всех сотрудников подразделения
    Object.keys(departmentData.data).forEach(employeeName => {
        const employeeData = departmentData.data[employeeName];
        dates.forEach(date => {
            if (employeeData && employeeData[date]) {
                totalCalls += employeeData[date]['Звонков'] || 0;
                totalDeviations += employeeData[date]['Отклонений'] || 0;
            }
        });
    });
    
    const percentage = totalCalls > 0 ? (totalDeviations / totalCalls) * 100 : 0;
    
    return {
        calls: totalCalls,
        deviations: totalDeviations,
        percentage: Math.round(percentage * 100) / 100
    };
}

// Генерация HTML таблицы динамики по подразделениям
function generateDynamicsDepartmentsTable(departmentsData, periods, granularity) {
    // Определяем режим отображения для заголовка
    const modeLabels = {
        'День': 'По дням',
        'Неделя': 'По неделям', 
        'Месяц': 'По месяцам'
    };
    
    // Создаем заголовки таблицы
    const isScrollable = granularity === 'День' && periods.length > 10;
    
    let tableHTML = `
        <div class="details-table-container">
            <div class="details-mode-selector">
                <span class="details-mode-label">${modeLabels[granularity] || 'По периодам'} - Подразделения</span>
            </div>
            <div class="details-table-wrapper ${isScrollable ? 'scrollable' : ''}">
                <table class="details-table">
                    <thead>
                        <tr>
                            <th class="details-header-employee">% отклонений</th>
    `;
    
    // Добавляем заголовки периодов
    periods.forEach(period => {
        tableHTML += `<th class="details-header-period">${period.label}</th>`;
    });
    
    tableHTML += `
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Создаем строки для каждого подразделения
    Object.keys(departmentsData).forEach(departmentName => {
        const departmentData = departmentsData[departmentName];
        
        tableHTML += `
            <tr class="details-row">
                <td class="details-employee-name">${departmentName} (${departmentData.employees.length} чел.)</td>
        `;
        
        // Добавляем данные по периодам
        periods.forEach((period, index) => {
            const periodData = aggregateDepartmentDataForPeriod(departmentData, period.dates);
            const percentage = periodData.percentage;
            
            // Получаем данные предыдущего периода для сравнения (если есть)
            let changeHTML = '';
            if (index > 0) {
                const prevPeriod = periods[index - 1];
                const prevPeriodData = aggregateDepartmentDataForPeriod(departmentData, prevPeriod.dates);
                const change = calculatePercentageChange(percentage, prevPeriodData.percentage);
                
                if (Math.abs(change) > 0.1) { // Показываем изменение только если оно значимое
                    const changeClass = change > 0 ? 'positive' : 'negative';
                    const changeSign = change > 0 ? '+' : '';
                    changeHTML = `<span class="details-change ${changeClass}">${changeSign}${Math.round(change)}%</span>`;
                }
            }
            
            // Показываем дополнительную информацию при наведении
            const tooltipInfo = `Звонков: ${periodData.calls}, Отклонений: ${periodData.deviations}, Сотрудников: ${departmentData.employees.length}`;
            
            tableHTML += `
                <td class="details-cell" title="${tooltipInfo}">
                    <div class="details-cell-content">
                        <span class="details-percentage">${percentage.toFixed(1)}%</span>
                        ${changeHTML}
                    </div>
                </td>
            `;
        });
        
        tableHTML += '</tr>';
    });
    
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
    window.initDynamicsModule = initDynamicsModule;
    window.updateDynamicsData = updateDynamicsData;
    window.loadDynamicsDetails = loadDynamicsDetails;
    window.loadDynamicsTeamDetails = loadDynamicsTeamDetails;
    window.loadDynamicsDepartmentsDetails = loadDynamicsDepartmentsDetails;
    window.getDynamicsFilters = getDynamicsFilters;
    window.setupDynamicsFilters = setupDynamicsFilters;
    
    console.log('=== dynamics.js загружен ===');
    console.log('Функции экспортированы:', {
        initDynamicsModule: typeof window.initDynamicsModule,
        updateDynamicsData: typeof window.updateDynamicsData,
        loadDynamicsDetails: typeof window.loadDynamicsDetails,
        loadDynamicsTeamDetails: typeof window.loadDynamicsTeamDetails,
        loadDynamicsDepartmentsDetails: typeof window.loadDynamicsDepartmentsDetails,
        getDynamicsFilters: typeof window.getDynamicsFilters,
        setupDynamicsFilters: typeof window.setupDynamicsFilters
    });
}

console.log('🏁 МОДУЛЬ DYNAMICS.JS ПОЛНОСТЬЮ ЗАГРУЖЕН');