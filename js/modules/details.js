console.log('🚀 МОДУЛЬ DETAILS.JS НАЧАЛ ЗАГРУЖАТЬСЯ');

window.immediateTest = function() {
    console.log('✅ Немедленный тест работает - модуль загружается');
    const container = document.getElementById('employeesDetails');
    if (container) {
        container.innerHTML = '<div style="padding: 20px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 4px;">✅ Тест успешен! Контейнер найден и функция работает.</div>';
    } else {
        console.error('❌ Контейнер employeesDetails не найден');
    }
};

function initEmployeeDetails() {
    console.log('=== Инициализация динамики сотрудников ===');
    
    const container = document.getElementById('employeesDetails');
    console.log('Контейнер динамики найден:', !!container);
    
    // Обработчик для блока динамики будет добавлен через initCollapsibleSections
    // Но добавим дополнительную проверку
    const detailsHeader = document.getElementById('employeesDetailsHeader');
    if (detailsHeader) {
        console.log('Заголовок динамики найден');
    } else {
        console.error('Заголовок динамики не найден');
    }
    
    console.log('Пробуем загрузить динамику для тестирования...');
    setTimeout(() => {
        try {
            loadSimpleEmployeeDetails();
        } catch (error) {
            console.error('Ошибка при загрузке простой динамики:', error);
            const container = document.getElementById('employeesDetails');
            if (container) {
                container.innerHTML = '<div style="padding: 20px; text-align: center;">Динамика загружена (тестовый режим)</div>';
            }
        }
    }, 1000);
}

// Функция для получения списка дат в диапазоне (для детализации)
function getDetailsDateRange(startDate, endDate) {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
}

// Функция для получения периодов в зависимости от режима отображения
function getPeriods(startDate, endDate, granularity) {
    const periods = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    switch (granularity) {
        case 'День':
            // Возвращаем все дни в диапазоне
            return getDetailsDateRange(startDate, endDate).map(date => ({
                key: date,
                label: formatDateForHeader(date),
                dates: [date]
            }));

        case 'Неделя':
            // Группируем по неделям
            const current = new Date(start);
            while (current <= end) {
                const weekStart = new Date(current);
                const weekEnd = new Date(current);
                weekEnd.setDate(weekEnd.getDate() + 6);
                
                // Ограничиваем конец недели концом периода
                if (weekEnd > end) {
                    weekEnd.setTime(end.getTime());
                }

                const weekDates = getDetailsDateRange(
                    weekStart.toISOString().split('T')[0],
                    weekEnd.toISOString().split('T')[0]
                );

                periods.push({
                    key: `week-${weekStart.toISOString().split('T')[0]}`,
                    label: `${formatDateForHeader(weekStart.toISOString().split('T')[0])}-${formatDateForHeader(weekEnd.toISOString().split('T')[0])}`,
                    dates: weekDates
                });

                current.setDate(current.getDate() + 7);
            }
            return periods;

        case 'Месяц':
            // Группируем по месяцам
            const currentMonth = new Date(start.getFullYear(), start.getMonth(), 1);
            while (currentMonth <= end) {
                const monthStart = new Date(Math.max(currentMonth.getTime(), start.getTime()));
                const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                
                // Ограничиваем конец месяца концом периода
                if (monthEnd > end) {
                    monthEnd.setTime(end.getTime());
                }

                const monthDates = getDetailsDateRange(
                    monthStart.toISOString().split('T')[0],
                    monthEnd.toISOString().split('T')[0]
                );

                const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
                const monthLabel = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

                periods.push({
                    key: `month-${currentMonth.getFullYear()}-${currentMonth.getMonth()}`,
                    label: monthLabel,
                    dates: monthDates
                });

                currentMonth.setMonth(currentMonth.getMonth() + 1);
            }
            return periods;

        default:
            return [];
    }
}

// Функция для форматирования даты для заголовка
function formatDateForHeader(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}`;
}

// Функция для агрегации данных за период (для детализации)
function aggregateDetailsDataForPeriod(employeeData, dates) {
    let totalCalls = 0;
    let totalDeviations = 0;

    dates.forEach(date => {
        const dayData = getEmployeeDataForDate(employeeData, date);
        totalCalls += dayData.calls;
        totalDeviations += dayData.deviations;
    });

    const percentage = totalCalls > 0 ? (totalDeviations / totalCalls) * 100 : 0;

    return {
        calls: totalCalls,
        deviations: totalDeviations,
        percentage: Math.round(percentage * 100) / 100
    };
}

// Функция для получения данных сотрудника за конкретную дату
function getEmployeeDataForDate(employeeData, date) {
    if (employeeData && employeeData[date]) {
        const data = employeeData[date];
        return {
            calls: data['Звонков'] || 0,
            deviations: data['Отклонений'] || 0,
            percentage: data['%'] || 0
        };
    }
    return { calls: 0, deviations: 0, percentage: 0 };
}

// Функция для вычисления изменения в процентах
function calculatePercentageChange(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

// Основная функция загрузки реальной динамики
async function loadRealEmployeeDetails() {
    console.log('=== Загрузка реальной динамики сотрудников ===');
    
    const container = document.getElementById('employeesDetails');
    if (!container) {
        console.error('Контейнер динамики не найден');
        return;
    }

    // Получаем параметры фильтров
    const startDate = document.getElementById('empStartDate')?.value || '2025-07-01';
    const endDate = document.getElementById('empEndDate')?.value || '2025-07-31';
    const granularity = document.getElementById('empTimeGranularity')?.value || 'Месяц';
    const callCenter = document.getElementById('empCallCenter')?.value || 'Все КЦ';

    console.log('Параметры динамики:', { startDate, endDate, granularity, callCenter });

    try {
        // Загружаем данные операторов
        const operatorData = await loadOperatorData();
        if (!operatorData) {
            console.error('Не удалось загрузить данные операторов');
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки данных</div>';
            return;
        }

        // Получаем периоды в зависимости от режима отображения
        const periods = getPeriods(startDate, endDate, granularity);
        console.log('Периоды для динамики:', periods);

        if (periods.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Нет периодов для отображения</div>';
            return;
        }

        // Фильтруем сотрудников по выбранному КЦ
        const filteredEmployees = Object.keys(operatorData).filter(employeeName => {
            const employee = operatorData[employeeName];
            if (callCenter === 'Все КЦ') return true;
            return employee['КЦ'] === callCenter;
        });

        console.log('Отфильтрованные сотрудники:', filteredEmployees);

        if (filteredEmployees.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Нет данных для выбранных фильтров</div>';
            return;
        }

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

        container.innerHTML = tableHTML;
        console.log(`Реальная динамика загружена успешно (${granularity}, ${periods.length} периодов)`);

    } catch (error) {
        console.error('Ошибка при загрузке реальной динамики:', error);
        container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки динамики</div>';
    }
}

// Функция для загрузки простой динамики (оставляем для совместимости)
function loadSimpleEmployeeDetails() {
    console.log('=== Переадресация на загрузку реальной динамики ===');
    loadRealEmployeeDetails();
}

function testDetailsContainer() {
    console.log('=== Тестирование контейнера динамики ===');
    
    const container = document.getElementById('employeesDetails');
    console.log('Поиск контейнера employeesDetails:', !!container);
    
    if (container) {
        container.innerHTML = '<div style="padding: 20px; background: #f0f8ff; border: 1px solid #007bff; border-radius: 4px;">✅ Динамика работает! Контейнер найден и содержимое загружено.</div>';
        console.log('Тестовое содержимое загружено в контейнер');
    } else {
        console.error('Контейнер не найден, ищем все возможные элементы...');
        
        const detailsElements = document.querySelectorAll('[id*="details"], [class*="details"]');
        console.log('Найдено элементов с details:', detailsElements.length);
        detailsElements.forEach((el, index) => {
            console.log(`Элемент ${index}:`, el.id, el.className);
        });
        
        const empTab = document.getElementById('employeesTab');
        console.log('Вкладка сотрудников найдена:', !!empTab);
        
        if (empTab) {
            const allDivs = empTab.querySelectorAll('div');
            console.log('Всего div элементов во вкладке сотрудников:', allDivs.length);
        }
    }
}

function forceInitDetails() {
    console.log('=== Принудительная инициализация динамики ===');
    
    testDetailsContainer();
    
    const container = document.getElementById('employeesDetails');
    if (container) {
        console.log('Контейнер найден, загружаем реальную динамику...');
        loadRealEmployeeDetails();
    } else {
        console.error('Контейнер динамики не найден при принудительной инициализации');
        setTimeout(() => {
            console.log('Повторная попытка поиска контейнера...');
            testDetailsContainer();
        }, 2000);
    }
}

function updateEmployeeDetails() {
    console.log('=== Обновление динамики сотрудников ===');
    
    const filters = {
        startDate: document.getElementById('empStartDate')?.value || '2025-07-01',
        endDate: document.getElementById('empEndDate')?.value || '2025-07-31',
        timeGranularity: document.getElementById('empTimeGranularity')?.value || 'Месяц',
        callCenter: document.getElementById('empCallCenter')?.value || 'Все КЦ'
    };
    
    console.log('Обновляем динамику с фильтрами:', filters);
    loadRealEmployeeDetails();
}

if (typeof window !== 'undefined') {
    window.initEmployeeDetails = initEmployeeDetails;
    window.loadSimpleEmployeeDetails = loadSimpleEmployeeDetails;
    window.loadRealEmployeeDetails = loadRealEmployeeDetails;
    window.updateEmployeeDetails = updateEmployeeDetails;
    window.forceInitDetails = forceInitDetails;
    window.testDetailsContainer = testDetailsContainer;
    
    // Экспортируем вспомогательные функции для модуля динамики
    window.getPeriods = getPeriods;
    window.aggregateDetailsDataForPeriod = aggregateDetailsDataForPeriod;
    window.calculatePercentageChange = calculatePercentageChange;
    window.getDetailsDateRange = getDetailsDateRange;
    window.formatDateForHeader = formatDateForHeader;
    
    console.log('=== details.js загружен ===');
    console.log('Функции экспортированы:', {
        initEmployeeDetails: typeof window.initEmployeeDetails,
        loadSimpleEmployeeDetails: typeof window.loadSimpleEmployeeDetails,
        loadRealEmployeeDetails: typeof window.loadRealEmployeeDetails,
        updateEmployeeDetails: typeof window.updateEmployeeDetails,
        forceInitDetails: typeof window.forceInitDetails,
        testDetailsContainer: typeof window.testDetailsContainer
    });
    
    window.testDetails = function() {
        console.log('=== Тестирование детализации из консоли ===');
        testDetailsContainer();
        setTimeout(() => {
            forceInitDetails();
        }, 500);
    };
    
    console.log('💡 Для тестирования детализации выполните в консоли: testDetails()');
    console.log('🔧 Для немедленного теста выполните: immediateTest()');
    console.log('🆕 Для тестирования реальной детализации выполните: testRealDetails()');
    
    // Добавляем функцию для тестирования реальной детализации
    window.testRealDetails = function() {
        console.log('=== Тестирование реальной детализации ===');
        if (typeof loadRealEmployeeDetails === 'function') {
            loadRealEmployeeDetails();
        } else {
            console.error('Функция loadRealEmployeeDetails не найдена');
        }
    };

    // Функция для тестирования разных режимов отображения
    window.testDetailsMode = function(mode) {
        console.log(`=== Тестирование режима: ${mode} ===`);
        
        // Устанавливаем режим
        const granularitySelect = document.getElementById('empTimeGranularity');
        if (granularitySelect) {
            granularitySelect.value = mode;
            console.log(`Режим установлен: ${mode}`);
        }
        
        // Загружаем детализацию
        if (typeof loadRealEmployeeDetails === 'function') {
            loadRealEmployeeDetails();
        } else {
            console.error('Функция loadRealEmployeeDetails не найдена');
        }
    };

    console.log('🧪 Для тестирования режимов выполните:');
    console.log('   testDetailsMode("День") - для режима по дням');
    console.log('   testDetailsMode("Неделя") - для режима по неделям'); 
    console.log('   testDetailsMode("Месяц") - для режима по месяцам');

    // Функция для проверки конфликтов функций
    window.checkFunctionConflicts = function() {
        console.log('=== Проверка конфликтов функций ===');
        console.log('getCompanyData:', typeof getCompanyData);
        console.log('getDepartmentsData:', typeof getDepartmentsData);
        console.log('getEmployeesData:', typeof getEmployeesData);
        console.log('loadOperatorData:', typeof loadOperatorData);
        console.log('getDetailsDateRange:', typeof getDetailsDateRange);
        console.log('aggregateDetailsDataForPeriod:', typeof aggregateDetailsDataForPeriod);
        
        // Проверяем, что функции из real-data-processor доступны
        if (typeof getCompanyData === 'function') {
            console.log('✅ getCompanyData доступна');
        } else {
            console.error('❌ getCompanyData недоступна');
        }
    };

    console.log('🔍 Для проверки конфликтов выполните: checkFunctionConflicts()');
    
    setTimeout(() => {
        console.log('Пробуем принудительную инициализацию детализации...');
        forceInitDetails();
    }, 3000);
}

console.log('🏁 МОДУЛЬ DETAILS.JS ПОЛНОСТЬЮ ЗАГРУЖЕН');