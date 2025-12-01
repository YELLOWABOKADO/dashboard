// ===== EMPLOYEE DETAILS DASHBOARD MODULE =====
console.log('🚀 МОДУЛЬ EMPLOYEE-DETAILS-DASHBOARD.JS НАЧАЛ ЗАГРУЖАТЬСЯ');

let empDetailsAllData = [];
let empDetailsFilteredData = [];
let empDetailsCurrentEmployee = null;
let empDetailsSecondEmployee = null;
let empDetailsCompareMode = 'single';

// Переменные для графиков
let empDetailsBlock0Chart = null;
let empDetailsBlock1Chart = null;
let empDetailsDailyChart = null;
let empDetailsComparisonChart = null;

// Загрузка данных для дашборда детализации по сотруднику
async function loadEmployeeDetailsData(dashboardType = 'Автооценка') {
    console.log(`[Employee Details] Начинаем загрузку данных для дашборда: ${dashboardType}...`);

    // Проверяем, что вкладка существует (убираем проверку активности для отладки)
    const tab = document.getElementById('employeeDetailsSectionContent');
    if (!tab) {
        console.error('[Employee Details] Блок employeeDetailsSectionContent не найден');
        return;
    }
    console.log('[Employee Details] Вкладка найдена, активна:', tab.classList.contains('active'));

    const loadingElement = document.getElementById('empDetailsLoading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
        loadingElement.innerHTML = 'Загрузка данных...';
    } else {
        console.error('[Employee Details] Элемент загрузки не найден');
    }

    try {
        const fileName = 'operator_data_days.json';
        console.log(`[Employee Details] Загружаем файл: ${fileName}`);
        const response = await fetch(fileName);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        empDetailsAllData = await response.json();
        console.log(`[Employee Details] ✅ Успешно загружено ${empDetailsAllData.length} записей`);

        if (empDetailsAllData.length > 0) {
            console.log('[Employee Details] Пример записи:', empDetailsAllData[0]);
            populateEmployeeDetailsFilters();
            
            if (loadingElement) {
                loadingElement.innerHTML = 'Выберите сотрудника для просмотра данных';
            }
        } else {
            throw new Error('Файл пустой');
        }

    } catch (error) {
        console.error('[Employee Details] Ошибка загрузки:', error.message);
        if (loadingElement) {
            loadingElement.innerHTML = `Ошибка загрузки данных: ${error.message}`;
        }
    }
}

// Проверка существования элементов
function checkEmployeeDetailsElements() {
    const elements = [
        'empDetailsKcFilter',
        'empDetailsGroupFilter', 
        'empDetailsOperatorFilter',
        'empDetailsSecondOperator',
        'empDetailsUpdateButton',
        'empDetailsCompareMode',
        'empDetailsLoading'
    ];

    console.log('[Employee Details] Проверяем существование элементов:');
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`  ${id}: ${element ? '✅' : '❌'}`);
    });
}

// Заполнение фильтров
function populateEmployeeDetailsFilters() {
    console.log('[Employee Details] Заполняем фильтры...');
    console.log('[Employee Details] Количество записей для обработки:', empDetailsAllData.length);

    // Проверяем элементы
    checkEmployeeDetailsElements();

    if (!empDetailsAllData || empDetailsAllData.length === 0) {
        console.error('[Employee Details] Нет данных для заполнения фильтров');
        return;
    }

    const kcs = [...new Set(empDetailsAllData.map(item => item.kc))].sort();
    const groups = [...new Set(empDetailsAllData.map(item => item.group))].sort();
    const operators = [...new Set(empDetailsAllData.map(item => item.operator))].sort();

    console.log('[Employee Details] Найдено уникальных значений:', {
        kcs: kcs.length,
        groups: groups.length,
        operators: operators.length
    });

    // Заполняем КЦ
    const kcSelect = document.getElementById('empDetailsKcFilter');
    if (kcSelect) {
        kcSelect.innerHTML = '<option value="">Все КЦ</option>';
        kcs.forEach(kc => {
            const option = document.createElement('option');
            option.value = kc;
            option.textContent = kc;
            kcSelect.appendChild(option);
        });
        console.log('[Employee Details] КЦ заполнены:', kcs);
    } else {
        console.error('[Employee Details] Элемент empDetailsKcFilter не найден');
    }

    // Заполняем группы
    const groupSelect = document.getElementById('empDetailsGroupFilter');
    if (groupSelect) {
        groupSelect.innerHTML = '<option value="">Все группы</option>';
        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            groupSelect.appendChild(option);
        });
        console.log('[Employee Details] Группы заполнены:', groups);
    } else {
        console.error('[Employee Details] Элемент empDetailsGroupFilter не найден');
    }

    // Заполняем операторов
    const operatorSelect = document.getElementById('empDetailsOperatorFilter');
    const secondOperatorSelect = document.getElementById('empDetailsSecondOperator');
    
    if (operatorSelect) {
        operatorSelect.innerHTML = '<option value="">Выберите сотрудника</option>';
        operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator;
            option.textContent = operator;
            operatorSelect.appendChild(option);
        });
        console.log('[Employee Details] Операторы заполнены в первый селект:', operators.length);
    } else {
        console.error('[Employee Details] Элемент empDetailsOperatorFilter не найден');
    }

    if (secondOperatorSelect) {
        secondOperatorSelect.innerHTML = '<option value="">Выберите второго сотрудника</option>';
        operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator;
            option.textContent = operator;
            secondOperatorSelect.appendChild(option);
        });
        console.log('[Employee Details] Операторы заполнены во второй селект');
    } else {
        console.error('[Employee Details] Элемент empDetailsSecondOperator не найден');
    }

    console.log(`[Employee Details] ✅ Фильтры заполнены: ${kcs.length} КЦ, ${groups.length} групп, ${operators.length} операторов`);
    
    // Принудительно обновляем DOM
    setTimeout(() => {
        console.log('[Employee Details] Проверяем заполнение после таймаута...');
        const kcOptions = document.getElementById('empDetailsKcFilter').options.length;
        const groupOptions = document.getElementById('empDetailsGroupFilter').options.length;
        const operatorOptions = document.getElementById('empDetailsOperatorFilter').options.length;
        
        console.log('[Employee Details] Опции в селектах:', {
            kc: kcOptions,
            groups: groupOptions,
            operators: operatorOptions
        });
        
        if (operatorOptions <= 1) {
            console.error('[Employee Details] Операторы не добавились, повторяем...');
            // Повторяем заполнение операторов
            const operatorSelect = document.getElementById('empDetailsOperatorFilter');
            if (operatorSelect && operators.length > 0) {
                operatorSelect.innerHTML = '<option value="">Выберите сотрудника</option>';
                operators.forEach(operator => {
                    const option = document.createElement('option');
                    option.value = operator;
                    option.textContent = operator;
                    operatorSelect.appendChild(option);
                });
                console.log('[Employee Details] Операторы повторно добавлены');
            }
        }
    }, 100);
}

// Применение фильтров и обновление данных
function applyEmployeeDetailsFilters() {
    console.log('[Employee Details] === ПРИМЕНЕНИЕ ФИЛЬТРОВ ===');
    console.log('[Employee Details] Данные загружены:', empDetailsAllData.length, 'записей');
    
    // Проверяем, что данные загружены
    if (!empDetailsAllData || empDetailsAllData.length === 0) {
        console.error('[Employee Details] Данные не загружены! Загружаем...');
        loadEmployeeDetailsData().then(() => {
            console.log('[Employee Details] Данные загружены, повторяем применение фильтров');
            applyEmployeeDetailsFilters();
        });
        return;
    }
    
    const dateFrom = document.getElementById('empDetailsDateFrom').value;
    const dateTo = document.getElementById('empDetailsDateTo').value;
    const selectedKc = document.getElementById('empDetailsKcFilter').value;
    const selectedGroup = document.getElementById('empDetailsGroupFilter').value;
    const selectedOperator = document.getElementById('empDetailsOperatorFilter').value;
    
    empDetailsCompareMode = document.getElementById('empDetailsCompareMode').value;
    const selectedSecondOperator = document.getElementById('empDetailsSecondOperator').value;

    console.log('[Employee Details] Применяем фильтры:', {
        dateFrom, dateTo, selectedKc, selectedGroup, selectedOperator, 
        empDetailsCompareMode, selectedSecondOperator
    });

    // Показываем/скрываем элементы в зависимости от режима
    const secondOperatorContainer = document.getElementById('empDetailsSecondOperatorContainer');
    const compareSection = document.getElementById('empDetailsCompareSection');
    
    if (empDetailsCompareMode === 'compare') {
        secondOperatorContainer.style.display = 'block';
        compareSection.style.display = 'block';
    } else {
        secondOperatorContainer.style.display = 'none';
        compareSection.style.display = 'none';
    }

    if (!selectedOperator) {
        document.getElementById('empDetailsLoading').innerHTML = 'Выберите сотрудника для просмотра данных';
        document.getElementById('empDetailsTable').style.display = 'none';
        resetEmployeeDetailsStats();
        return;
    }

    // Фильтруем данные
    empDetailsFilteredData = empDetailsAllData.filter(item => {
        const itemDate = new Date(item.date);
        const fromDate = dateFrom ? new Date(dateFrom) : null;
        const toDate = dateTo ? new Date(dateTo) : null;

        return (!fromDate || itemDate >= fromDate) &&
               (!toDate || itemDate <= toDate) &&
               (!selectedKc || item.kc === selectedKc) &&
               (!selectedGroup || item.group === selectedGroup) &&
               (item.operator === selectedOperator);
    });

    empDetailsCurrentEmployee = selectedOperator;

    // Если режим сравнения и выбран второй сотрудник
    if (empDetailsCompareMode === 'compare' && selectedSecondOperator) {
        const secondEmployeeData = empDetailsAllData.filter(item => {
            const itemDate = new Date(item.date);
            const fromDate = dateFrom ? new Date(dateFrom) : null;
            const toDate = dateTo ? new Date(dateTo) : null;

            return (!fromDate || itemDate >= fromDate) &&
                   (!toDate || itemDate <= toDate) &&
                   (!selectedKc || item.kc === selectedKc) &&
                   (!selectedGroup || item.group === selectedGroup) &&
                   (item.operator === selectedSecondOperator);
        });

        empDetailsSecondEmployee = selectedSecondOperator;
        updateEmployeeComparison(empDetailsFilteredData, secondEmployeeData);
    }

    console.log(`[Employee Details] Отфильтровано ${empDetailsFilteredData.length} записей для ${selectedOperator}`);

    updateEmployeeDetailsStats();
    updateEmployeeProfile();
    updateEmployeeDetailsTable();
    updateEmployeeDetailsCharts();

    document.getElementById('empDetailsLoading').style.display = 'none';
    document.getElementById('empDetailsTable').style.display = 'table';
}

// Обновление статистических карточек
function updateEmployeeDetailsStats() {
    console.log('[Employee Details] Обновляем статистику...');
    console.log('[Employee Details] Отфильтрованных данных:', empDetailsFilteredData.length);
    
    const totalRecords = empDetailsFilteredData.length;
    const totalIssues = empDetailsFilteredData.filter(item => item.score === 1).length;
    const issueRate = totalRecords > 0 ? ((totalIssues / totalRecords) * 100).toFixed(1) : 0;

    // Подсчет дней в периоде
    const dates = [...new Set(empDetailsFilteredData.map(item => item.date))];
    const dateRange = dates.length;

    // Среднее количество записей в день
    const avgDaily = dateRange > 0 ? (totalRecords / dateRange).toFixed(1) : 0;

    // Топ проблемный блок
    const blockIssues = {};
    empDetailsFilteredData.filter(item => item.score === 1).forEach(item => {
        const block = item.Block_0_lvl;
        blockIssues[block] = (blockIssues[block] || 0) + 1;
    });

    const topBlock = Object.keys(blockIssues).length > 0 
        ? Object.keys(blockIssues).reduce((a, b) => blockIssues[a] > blockIssues[b] ? a : b)
        : '-';

    console.log('[Employee Details] Статистика:', {
        totalRecords,
        totalIssues,
        issueRate,
        dateRange,
        topBlock,
        avgDaily
    });

    // Обновляем элементы
    document.getElementById('empDetailsTotalRecords').textContent = totalRecords;
    document.getElementById('empDetailsTotalIssues').textContent = totalIssues;
    document.getElementById('empDetailsIssueRate').textContent = issueRate + '%';
    document.getElementById('empDetailsDateRange').textContent = dateRange;
    document.getElementById('empDetailsTopBlock').textContent = topBlock;
    document.getElementById('empDetailsAvgDaily').textContent = avgDaily;
    
    console.log('[Employee Details] Статистика обновлена');
}

// Обновление профиля сотрудника
function updateEmployeeProfile() {
    if (empDetailsFilteredData.length === 0) return;

    const employeeData = empDetailsFilteredData[0];
    
    document.getElementById('empDetailsName').textContent = employeeData.operator;
    document.getElementById('empDetailsGroup').textContent = employeeData.group;
    document.getElementById('empDetailsKc').textContent = employeeData.kc;

    // Рассчитываем рейтинг в группе
    calculateEmployeeRankInGroup(employeeData.operator, employeeData.group);
}

// Расчет рейтинга сотрудника в группе
function calculateEmployeeRankInGroup(operator, group) {
    const dateFrom = document.getElementById('empDetailsDateFrom').value;
    const dateTo = document.getElementById('empDetailsDateTo').value;

    // Получаем всех сотрудников из той же группы
    const groupEmployees = [...new Set(empDetailsAllData
        .filter(item => item.group === group)
        .map(item => item.operator))];

    // Рассчитываем статистику для каждого сотрудника группы
    const employeeStats = groupEmployees.map(emp => {
        const empData = empDetailsAllData.filter(item => {
            const itemDate = new Date(item.date);
            const fromDate = dateFrom ? new Date(dateFrom) : null;
            const toDate = dateTo ? new Date(dateTo) : null;

            return item.operator === emp &&
                   item.group === group &&
                   (!fromDate || itemDate >= fromDate) &&
                   (!toDate || itemDate <= toDate);
        });

        const total = empData.length;
        const issues = empData.filter(item => item.score === 1).length;
        const rate = total > 0 ? (issues / total) * 100 : 0;

        return { operator: emp, total, issues, rate };
    });

    // Сортируем по проценту отклонений (меньше = лучше)
    employeeStats.sort((a, b) => a.rate - b.rate);

    // Находим позицию текущего сотрудника
    const rank = employeeStats.findIndex(emp => emp.operator === operator) + 1;
    
    document.getElementById('empDetailsRankInGroup').textContent = 
        `${rank} из ${groupEmployees.length} (${employeeStats.find(emp => emp.operator === operator)?.rate.toFixed(1)}%)`;
}

// Обновление таблицы с подробными записями
function updateEmployeeDetailsTable() {
    const tbody = document.getElementById('empDetailsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Сортируем по дате (новые сверху)
    const sortedData = [...empDetailsFilteredData].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedData.forEach(item => {
        const row = document.createElement('tr');
        
        // Добавляем класс для проблемных записей
        if (item.score === 1) {
            row.classList.add('issue-row');
        }

        const statusText = item.score === 1 ? 'Проблема' : 'Норма';
        const statusClass = item.score === 1 ? 'status-issue' : 'status-ok';

        row.innerHTML = `
            <td>${formatDate(item.date)}</td>
            <td>${item.Block_0_lvl}</td>
            <td>${item.Block_1_lvl}</td>
            <td>${item.Block_2_lvl}</td>
            <td>${item.score}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;

        tbody.appendChild(row);
    });
}

// Обновление графиков
function updateEmployeeDetailsCharts() {
    updateEmployeeBlock0Chart();
    updateEmployeeBlock1Chart();
    updateEmployeeDailyChart();
}

// График по блокам 0 уровня
function updateEmployeeBlock0Chart() {
    const block0Stats = {};
    
    empDetailsFilteredData.forEach(item => {
        const block = item.Block_0_lvl;
        if (!block0Stats[block]) {
            block0Stats[block] = { total: 0, issues: 0 };
        }
        block0Stats[block].total++;
        if (item.score === 1) {
            block0Stats[block].issues++;
        }
    });

    const chartData = Object.keys(block0Stats).map(block => ({
        block,
        total: block0Stats[block].total,
        issues: block0Stats[block].issues,
        rate: ((block0Stats[block].issues / block0Stats[block].total) * 100).toFixed(1)
    })).sort((a, b) => b.issues - a.issues);

    // Создаем HTML для графика
    const chartContainer = document.getElementById('empDetailsBlock0Chart');
    if (chartContainer) {
        chartContainer.innerHTML = chartData.map(item => `
            <div class="chart-bar-item">
                <div class="chart-bar-label">${item.block}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${(item.issues / Math.max(...chartData.map(d => d.issues))) * 100}%">
                        <span class="chart-bar-value">${item.issues} (${item.rate}%)</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// График по блокам 1 уровня
function updateEmployeeBlock1Chart() {
    const block1Stats = {};
    
    empDetailsFilteredData.forEach(item => {
        const block = item.Block_1_lvl;
        if (!block1Stats[block]) {
            block1Stats[block] = { total: 0, issues: 0 };
        }
        block1Stats[block].total++;
        if (item.score === 1) {
            block1Stats[block].issues++;
        }
    });

    const chartData = Object.keys(block1Stats).map(block => ({
        block,
        total: block1Stats[block].total,
        issues: block1Stats[block].issues,
        rate: ((block1Stats[block].issues / block1Stats[block].total) * 100).toFixed(1)
    })).sort((a, b) => b.issues - a.issues).slice(0, 10); // Топ 10

    const chartContainer = document.getElementById('empDetailsBlock1Chart');
    if (chartContainer) {
        chartContainer.innerHTML = chartData.map(item => `
            <div class="chart-bar-item">
                <div class="chart-bar-label">${item.block}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${(item.issues / Math.max(...chartData.map(d => d.issues))) * 100}%">
                        <span class="chart-bar-value">${item.issues} (${item.rate}%)</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// График динамики по дням
function updateEmployeeDailyChart() {
    // Группируем данные по дням
    const dailyStats = {};
    
    empDetailsFilteredData.forEach(item => {
        const date = item.date;
        if (!dailyStats[date]) {
            dailyStats[date] = { total: 0, issues: 0 };
        }
        dailyStats[date].total++;
        if (item.score === 1) {
            dailyStats[date].issues++;
        }
    });

    // Сортируем по дате
    const sortedDates = Object.keys(dailyStats).sort();
    
    const ctx = document.getElementById('empDetailsDailyChart');
    if (ctx && typeof Chart !== 'undefined') {
        // Уничтожаем предыдущий график
        if (empDetailsDailyChart) {
            empDetailsDailyChart.destroy();
        }

        empDetailsDailyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedDates.map(date => formatDate(date)),
                datasets: [{
                    label: 'Количество проблем',
                    data: sortedDates.map(date => dailyStats[date].issues),
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.1
                }, {
                    label: 'Всего записей',
                    data: sortedDates.map(date => dailyStats[date].total),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Обновление сравнения сотрудников
function updateEmployeeComparison(firstEmployeeData, secondEmployeeData) {
    // Статистика первого сотрудника
    const firstTotal = firstEmployeeData.length;
    const firstIssues = firstEmployeeData.filter(item => item.score === 1).length;
    const firstRate = firstTotal > 0 ? ((firstIssues / firstTotal) * 100).toFixed(1) : 0;

    // Статистика второго сотрудника
    const secondTotal = secondEmployeeData.length;
    const secondIssues = secondEmployeeData.filter(item => item.score === 1).length;
    const secondRate = secondTotal > 0 ? ((secondIssues / secondTotal) * 100).toFixed(1) : 0;

    // Обновляем элементы
    document.getElementById('empDetailsFirstEmployeeName').textContent = empDetailsCurrentEmployee;
    document.getElementById('empDetailsFirstTotal').textContent = firstTotal;
    document.getElementById('empDetailsFirstIssues').textContent = firstIssues;
    document.getElementById('empDetailsFirstRate').textContent = firstRate + '%';

    document.getElementById('empDetailsSecondEmployeeName').textContent = empDetailsSecondEmployee;
    document.getElementById('empDetailsSecondTotal').textContent = secondTotal;
    document.getElementById('empDetailsSecondIssues').textContent = secondIssues;
    document.getElementById('empDetailsSecondRate').textContent = secondRate + '%';

    // Создаем график сравнения по блокам
    updateComparisonChart(firstEmployeeData, secondEmployeeData);
}

// График сравнения по блокам
function updateComparisonChart(firstData, secondData) {
    // Получаем статистику по блокам для обоих сотрудников
    const firstBlocks = {};
    const secondBlocks = {};

    firstData.forEach(item => {
        const block = item.Block_0_lvl;
        if (!firstBlocks[block]) firstBlocks[block] = { total: 0, issues: 0 };
        firstBlocks[block].total++;
        if (item.score === 1) firstBlocks[block].issues++;
    });

    secondData.forEach(item => {
        const block = item.Block_0_lvl;
        if (!secondBlocks[block]) secondBlocks[block] = { total: 0, issues: 0 };
        secondBlocks[block].total++;
        if (item.score === 1) secondBlocks[block].issues++;
    });

    // Получаем все уникальные блоки
    const allBlocks = [...new Set([...Object.keys(firstBlocks), ...Object.keys(secondBlocks)])];

    const ctx = document.getElementById('empDetailsComparisonChart');
    if (ctx && typeof Chart !== 'undefined') {
        if (empDetailsComparisonChart) {
            empDetailsComparisonChart.destroy();
        }

        empDetailsComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: allBlocks,
                datasets: [{
                    label: empDetailsCurrentEmployee,
                    data: allBlocks.map(block => {
                        const stats = firstBlocks[block];
                        return stats ? ((stats.issues / stats.total) * 100).toFixed(1) : 0;
                    }),
                    backgroundColor: 'rgba(52, 152, 219, 0.8)'
                }, {
                    label: empDetailsSecondEmployee,
                    data: allBlocks.map(block => {
                        const stats = secondBlocks[block];
                        return stats ? ((stats.issues / stats.total) * 100).toFixed(1) : 0;
                    }),
                    backgroundColor: 'rgba(231, 76, 60, 0.8)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '% отклонений'
                        }
                    }
                }
            }
        });
    }
}

// Сброс статистики
function resetEmployeeDetailsStats() {
    document.getElementById('empDetailsTotalRecords').textContent = '0';
    document.getElementById('empDetailsTotalIssues').textContent = '0';
    document.getElementById('empDetailsIssueRate').textContent = '0%';
    document.getElementById('empDetailsDateRange').textContent = '0';
    document.getElementById('empDetailsTopBlock').textContent = '-';
    document.getElementById('empDetailsAvgDaily').textContent = '0';

    document.getElementById('empDetailsName').textContent = '-';
    document.getElementById('empDetailsGroup').textContent = '-';
    document.getElementById('empDetailsKc').textContent = '-';
    document.getElementById('empDetailsRankInGroup').textContent = '-';
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

// Инициализация обработчиков событий для вкладки детализации по сотруднику
function initEmployeeDetailsEventListeners() {
    console.log('[Employee Details] Инициализируем обработчики событий...');
    
    // Проверяем, что мы не добавляем обработчики повторно
    if (window.empDetailsListenersInitialized) {
        console.log('[Employee Details] Обработчики уже инициализированы');
        return;
    }

    // Обработчик кнопки обновления
    const updateButton = document.getElementById('empDetailsUpdateButton');
    if (updateButton) {
        updateButton.addEventListener('click', applyEmployeeDetailsFilters);
        console.log('[Employee Details] Обработчик кнопки обновления добавлен');
    } else {
        console.error('[Employee Details] Кнопка обновления не найдена');
    }

    // Обработчик изменения режима сравнения
    const compareModeSelect = document.getElementById('empDetailsCompareMode');
    if (compareModeSelect) {
        compareModeSelect.addEventListener('change', function() {
            empDetailsCompareMode = this.value;
            const secondOperatorContainer = document.getElementById('empDetailsSecondOperatorContainer');
            const compareSection = document.getElementById('empDetailsCompareSection');
            
            if (empDetailsCompareMode === 'compare') {
                secondOperatorContainer.style.display = 'block';
                compareSection.style.display = 'block';
            } else {
                secondOperatorContainer.style.display = 'none';
                compareSection.style.display = 'none';
            }
            console.log('[Employee Details] Режим сравнения изменен на:', empDetailsCompareMode);
        });
        console.log('[Employee Details] Обработчик режима сравнения добавлен');
    }

    // Обработчики фильтров для автоматического обновления списка операторов
    const groupFilter = document.getElementById('empDetailsGroupFilter');
    const kcFilter = document.getElementById('empDetailsKcFilter');
    
    if (groupFilter) {
        groupFilter.addEventListener('change', updateOperatorsList);
        console.log('[Employee Details] Обработчик фильтра групп добавлен');
    }
    
    if (kcFilter) {
        kcFilter.addEventListener('change', updateOperatorsList);
        console.log('[Employee Details] Обработчик фильтра КЦ добавлен');
    }

    // Отмечаем, что обработчики инициализированы
    window.empDetailsListenersInitialized = true;
    console.log('[Employee Details] Все обработчики событий инициализированы');
}

// Обновление списка операторов в зависимости от выбранных фильтров
function updateOperatorsList() {
    const selectedGroup = document.getElementById('empDetailsGroupFilter').value;
    const selectedKc = document.getElementById('empDetailsKcFilter').value;

    // Фильтруем операторов
    let filteredOperators = empDetailsAllData;
    
    if (selectedGroup) {
        filteredOperators = filteredOperators.filter(item => item.group === selectedGroup);
    }
    
    if (selectedKc) {
        filteredOperators = filteredOperators.filter(item => item.kc === selectedKc);
    }

    const operators = [...new Set(filteredOperators.map(item => item.operator))].sort();

    // Обновляем оба селекта операторов
    const operatorSelects = [
        document.getElementById('empDetailsOperatorFilter'),
        document.getElementById('empDetailsSecondOperator')
    ];

    operatorSelects.forEach(select => {
        if (select) {
            const currentValue = select.value;
            select.innerHTML = select.id === 'empDetailsOperatorFilter' 
                ? '<option value="">Выберите сотрудника</option>'
                : '<option value="">Выберите второго сотрудника</option>';
            
            operators.forEach(operator => {
                const option = document.createElement('option');
                option.value = operator;
                option.textContent = operator;
                if (operator === currentValue) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        }
    });
}

// Основная функция инициализации модуля
async function initEmployeeDetailsModule() {
    console.log('🎯 [Employee Details] === ИНИЦИАЛИЗАЦИЯ МОДУЛЯ ===');
    
    // Проверяем, что модуль не был инициализирован ранее
    if (window.empDetailsModuleInitialized) {
        console.log('[Employee Details] Модуль уже инициализирован, пропускаем');
        return;
    }
    
    console.log('[Employee Details] Модуль инициализируется впервые');

    // Инициализируем обработчики событий
    initEmployeeDetailsEventListeners();
    
    // Загружаем данные (ждем завершения)
    await loadEmployeeDetailsData();
    
    // Отмечаем модуль как инициализированный
    window.empDetailsModuleInitialized = true;
    console.log('[Employee Details] Модуль инициализирован');
}

// Функция для тестирования из консоли
function testEmployeeDetailsModule() {
    console.log('=== ТЕСТ МОДУЛЯ ДЕТАЛИЗАЦИИ ПО СОТРУДНИКУ ===');
    checkEmployeeDetailsElements();
    console.log('Данные загружены:', empDetailsAllData.length, 'записей');
    console.log('Обработчики инициализированы:', window.empDetailsListenersInitialized);
    console.log('Модуль инициализирован:', window.empDetailsModuleInitialized);
}

// Принудительная загрузка данных (для отладки)
async function forceLoadEmployeeDetailsData() {
    console.log('[Employee Details] Принудительная загрузка данных...');
    
    try {
        const response = await fetch('operator_data_days.json');
        console.log('[Employee Details] Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        empDetailsAllData = await response.json();
        console.log(`[Employee Details] ✅ Принудительно загружено ${empDetailsAllData.length} записей`);
        
        if (empDetailsAllData.length > 0) {
            console.log('[Employee Details] Пример записи:', empDetailsAllData[0]);
            populateEmployeeDetailsFilters();
            console.log('[Employee Details] Фильтры заполнены принудительно');
        }
        
        return true;
    } catch (error) {
        console.error('[Employee Details] Ошибка принудительной загрузки:', error);
        return false;
    }
}

// Простая функция для тестирования загрузки данных
async function simpleDataTest() {
    console.log('=== ПРОСТОЙ ТЕСТ ЗАГРУЗКИ ДАННЫХ ===');
    try {
        const response = await fetch('operator_data_days.json');
        const data = await response.json();
        console.log('Загружено записей:', data.length);
        if (data.length > 0) {
            const operators = [...new Set(data.map(item => item.operator))];
            console.log('Найдено операторов:', operators.length);
            console.log('Список операторов:', operators);
        }
        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return null;
    }
}

// Принудительное обновление фильтров (для отладки)
function forceUpdateFilters() {
    console.log('[Employee Details] Принудительное обновление фильтров...');
    
    if (!empDetailsAllData || empDetailsAllData.length === 0) {
        console.error('[Employee Details] Нет данных для обновления фильтров');
        return false;
    }
    
    const operators = [...new Set(empDetailsAllData.map(item => item.operator))].sort();
    const groups = [...new Set(empDetailsAllData.map(item => item.group))].sort();
    const kcs = [...new Set(empDetailsAllData.map(item => item.kc))].sort();
    
    console.log('[Employee Details] Обновляем фильтры:', {
        operators: operators.length,
        groups: groups.length,
        kcs: kcs.length
    });
    
    // Обновляем операторов
    const operatorSelect = document.getElementById('empDetailsOperatorFilter');
    if (operatorSelect) {
        operatorSelect.innerHTML = '<option value="">Выберите сотрудника</option>';
        operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator;
            option.textContent = operator;
            operatorSelect.appendChild(option);
        });
        console.log('[Employee Details] Операторы обновлены:', operatorSelect.options.length);
    }
    
    // Обновляем группы
    const groupSelect = document.getElementById('empDetailsGroupFilter');
    if (groupSelect) {
        groupSelect.innerHTML = '<option value="">Все группы</option>';
        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            groupSelect.appendChild(option);
        });
        console.log('[Employee Details] Группы обновлены:', groupSelect.options.length);
    }
    
    // Обновляем КЦ
    const kcSelect = document.getElementById('empDetailsKcFilter');
    if (kcSelect) {
        kcSelect.innerHTML = '<option value="">Все КЦ</option>';
        kcs.forEach(kc => {
            const option = document.createElement('option');
            option.value = kc;
            option.textContent = kc;
            kcSelect.appendChild(option);
        });
        console.log('[Employee Details] КЦ обновлены:', kcSelect.options.length);
    }
    
    return true;
}

// Экспорт функций для глобального использования
if (typeof window !== 'undefined') {
    window.loadEmployeeDetailsData = loadEmployeeDetailsData;
    window.applyEmployeeDetailsFilters = applyEmployeeDetailsFilters;
    window.initEmployeeDetailsEventListeners = initEmployeeDetailsEventListeners;
    window.initEmployeeDetailsModule = initEmployeeDetailsModule;
    window.checkEmployeeDetailsElements = checkEmployeeDetailsElements;
    window.testEmployeeDetailsModule = testEmployeeDetailsModule;
    window.forceLoadEmployeeDetailsData = forceLoadEmployeeDetailsData;
    window.simpleDataTest = simpleDataTest;
    window.forceUpdateFilters = forceUpdateFilters;
}

console.log('🏁 МОДУЛЬ EMPLOYEE-DETAILS-DASHBOARD.JS ПОЛНОСТЬЮ ЗАГРУЖЕН');
console.log('Экспортированные функции:', {
    loadEmployeeDetailsData: typeof window.loadEmployeeDetailsData,
    applyEmployeeDetailsFilters: typeof window.applyEmployeeDetailsFilters,
    initEmployeeDetailsEventListeners: typeof window.initEmployeeDetailsEventListeners,
    initEmployeeDetailsModule: typeof window.initEmployeeDetailsModule,
    checkEmployeeDetailsElements: typeof window.checkEmployeeDetailsElements,
    testEmployeeDetailsModule: typeof window.testEmployeeDetailsModule,
    forceLoadEmployeeDetailsData: typeof window.forceLoadEmployeeDetailsData,
    simpleDataTest: typeof window.simpleDataTest,
    forceUpdateFilters: typeof window.forceUpdateFilters
});
