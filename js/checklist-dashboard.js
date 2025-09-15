// ===== CHECKLIST DASHBOARD MODULE =====

let checklistAllData = [];
let checklistFilteredData = [];

// Экспортируем отфильтрованные данные для использования другими модулями
if (typeof window !== 'undefined') {
    window.checklistFilteredData = checklistFilteredData;
}

// Переменные для сортировки таблиц
let operatorTableSortColumn = 0; // По умолчанию сортируем по операторам (колонка 0)
let operatorTableSortDirection = 'asc';
let detailsTableSortColumn = 1; // По умолчанию сортируем по операторам (колонка 1)
let detailsTableSortDirection = 'asc';

function showChecklistDebug(message) {
    const debugDiv = document.getElementById('checklistDebugInfo');
    if (debugDiv) {
        debugDiv.style.display = 'block';
        debugDiv.innerHTML += message + '<br>';
    }
    console.log('[Checklist Dashboard]', message);
}

// Загрузка данных для дашборда чек-листов
async function loadChecklistData(dashboardType = 'Автооценка') {
    console.log(`[Checklist Dashboard] Начинаем загрузку данных для дашборда: ${dashboardType}...`);

    // Показываем индикатор загрузки
    const loadingElement = document.getElementById('checklistLoading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
        loadingElement.innerHTML = 'Загрузка данных...';
    }

    try {
        // Пока все дашборды используют один и тот же источник данных
        const fileName = 'operator_data_days.json';

        const response = await fetch(fileName);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        checklistAllData = await response.json();

        console.log(`[Checklist Dashboard] ✅ Успешно загружено ${checklistAllData.length} записей для дашборда "${dashboardType}"`);

        if (checklistAllData.length > 0) {
            console.log('[Checklist Dashboard] Пример записи:', checklistAllData[0]);

            // Проверяем данные для Коротенко П. Р.
            const korotenkoRecords = checklistAllData.filter(item => item.operator === 'Коротенко П. Р.');
            console.log(`[Checklist Dashboard] Найдено записей для Коротенко П. Р.: ${korotenkoRecords.length}`);
            if (korotenkoRecords.length > 0) {
                const korotenkoIssues = korotenkoRecords.filter(item => item.score === 1);
                console.log(`[Checklist Dashboard] Из них проблем (score=1): ${korotenkoIssues.length}`);
                console.log(`[Checklist Dashboard] Процент проблем: ${((korotenkoIssues.length / korotenkoRecords.length) * 100).toFixed(1)}%`);
            }

            populateChecklistFilters();
            applyChecklistFilters();

            // Инициализируем сортировку таблиц после загрузки данных
            initTableSorting();
            // Обновляем заголовки таблиц с индикаторами сортировки по умолчанию
            updateOperatorTableHeaders();
            updateDetailsTableHeaders();

            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            document.getElementById('checklistResultsTable').style.display = 'table';
            document.getElementById('checklistOperatorTable').style.display = 'table';
        } else {
            throw new Error('Файл пустой');
        }

    } catch (error) {
        console.error('[Checklist Dashboard] Ошибка загрузки из файла:', error.message);
        showChecklistDebug('Ошибка загрузки данных: ' + error.message);

        if (loadingElement) {
            loadingElement.innerHTML = `Ошибка загрузки данных для дашборда "${dashboardType}"`;
        }
    }
}



// Заполнение фильтров
function populateChecklistFilters() {
    console.log('[Checklist Dashboard] Заполняем фильтры...');

    const kcs = [...new Set(checklistAllData.map(item => item.kc))].sort();
    const groups = [...new Set(checklistAllData.map(item => item.group))].sort();
    const operators = [...new Set(checklistAllData.map(item => item.operator))].sort();
    const blocks0 = [...new Set(checklistAllData.map(item => item.Block_0_lvl))].sort();
    const blocks1 = [...new Set(checklistAllData.map(item => item.Block_1_lvl))].sort();

    console.log(`[Checklist Dashboard] КЦ: ${kcs.length}, Группы: ${groups.length}, Операторы: ${operators.length}, Блоки 0: ${blocks0.length}, Блоки 1: ${blocks1.length}`);

    populateChecklistSelect('checklistKcFilter', kcs);
    populateChecklistSelect('checklistGroupFilter', groups);
    populateChecklistSelect('checklistOperatorFilter', operators);
    populateChecklistSelect('checklistBlock0Filter', blocks0);
    populateChecklistSelect('checklistBlock1Filter', blocks1);
}

function populateChecklistSelect(selectId, options) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const currentValue = select.value;

    // Очищаем все опции кроме первой
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    select.value = currentValue;
}

// Применение фильтров
function applyChecklistFilters() {
    const dateFrom = document.getElementById('checklistDateFrom')?.value;
    const dateTo = document.getElementById('checklistDateTo')?.value;
    const kc = document.getElementById('checklistKcFilter')?.value;
    const group = document.getElementById('checklistGroupFilter')?.value;
    const operator = document.getElementById('checklistOperatorFilter')?.value;
    const block0 = document.getElementById('checklistBlock0Filter')?.value;
    const block1 = document.getElementById('checklistBlock1Filter')?.value;

    checklistFilteredData = checklistAllData.filter(item => {
        const itemDate = item.date;

        return (!dateFrom || itemDate >= dateFrom) &&
            (!dateTo || itemDate <= dateTo) &&
            (!kc || item.kc === kc) &&
            (!group || item.group === group) &&
            (!operator || item.operator === operator) &&
            (!block0 || item.Block_0_lvl === block0) &&
            (!block1 || item.Block_1_lvl === block1);
    });

    console.log(`[Checklist Dashboard] Отфильтровано записей: ${checklistFilteredData.length} из ${checklistAllData.length}`);

    // Обновляем глобальную переменную для использования другими модулями
    window.checklistFilteredData = checklistFilteredData;

    updateChecklistStats();
    updateChecklistCharts();
    updateChecklistOperatorTable();
    updateChecklistTable();

    // Обновляем заголовки таблиц с индикаторами сортировки
    updateOperatorTableHeaders();
    updateDetailsTableHeaders();
}

// Обновление статистики
function updateChecklistStats() {
    const totalRecords = checklistFilteredData.length;
    const totalIssues = checklistFilteredData.filter(item => item.score === 1).length;
    const uniqueOperators = new Set(checklistFilteredData.map(item => item.operator)).size;
    const uniqueGroups = new Set(checklistFilteredData.map(item => item.group)).size;
    const issueRate = totalRecords > 0 ? ((totalIssues / totalRecords) * 100).toFixed(1) : 0;

    const dates = checklistFilteredData.map(item => item.date);
    const minDate = dates.length > 0 ? Math.min(...dates.map(d => new Date(d))) : 0;
    const maxDate = dates.length > 0 ? Math.max(...dates.map(d => new Date(d))) : 0;
    const daysDiff = dates.length > 0 ? Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1 : 0;

    document.getElementById('checklistTotalRecords').textContent = totalRecords;
    document.getElementById('checklistTotalIssues').textContent = totalIssues;
    document.getElementById('checklistUniqueOperators').textContent = uniqueOperators;
    document.getElementById('checklistUniqueGroups').textContent = uniqueGroups;
    document.getElementById('checklistIssueRate').textContent = issueRate + '%';
    document.getElementById('checklistDateRange').textContent = daysDiff;

    // Обновляем сводную информацию
    updateChecklistSummary();
}

// Обновление сводной информации
function updateChecklistSummary() {
    const issues = checklistFilteredData.filter(item => item.score === 1);

    // Функция для скрытия/показа блока
    function toggleSummaryItem(elementId, hasData) {
        const element = document.getElementById(elementId);
        const parentItem = element ? element.closest('.checklist-summary-item') : null;
        if (parentItem) {
            parentItem.style.display = hasData ? 'block' : 'none';
        }
    }

    // Если нет проблем, скрываем весь блок сводной информации
    const summarySection = document.querySelector('.checklist-summary-section');
    if (issues.length === 0) {
        if (summarySection) {
            summarySection.style.display = 'none';
        }
        return;
    } else {
        if (summarySection) {
            summarySection.style.display = 'block';
        }
    }

    let visibleItemsCount = 0;

    // Топ блок 0
    const block0Stats = {};
    issues.forEach(item => {
        if (item.Block_0_lvl && item.Block_0_lvl.trim()) {
            block0Stats[item.Block_0_lvl] = (block0Stats[item.Block_0_lvl] || 0) + 1;
        }
    });
    const topBlock0 = Object.keys(block0Stats).sort((a, b) => block0Stats[b] - block0Stats[a])[0];
    const topBlock0Element = document.getElementById('checklistTopBlock0');
    if (topBlock0Element) {
        if (topBlock0) {
            topBlock0Element.textContent = `${topBlock0} (${block0Stats[topBlock0]})`;
            toggleSummaryItem('checklistTopBlock0', true);
            visibleItemsCount++;
        } else {
            toggleSummaryItem('checklistTopBlock0', false);
        }
    }

    // Топ блок 1
    const block1Stats = {};
    issues.forEach(item => {
        if (item.Block_1_lvl && item.Block_1_lvl.trim()) {
            block1Stats[item.Block_1_lvl] = (block1Stats[item.Block_1_lvl] || 0) + 1;
        }
    });
    const topBlock1 = Object.keys(block1Stats).sort((a, b) => block1Stats[b] - block1Stats[a])[0];
    const topBlock1Element = document.getElementById('checklistTopBlock1');
    if (topBlock1Element) {
        if (topBlock1) {
            topBlock1Element.textContent = `${topBlock1} (${block1Stats[topBlock1]})`;
            toggleSummaryItem('checklistTopBlock1', true);
            visibleItemsCount++;
        } else {
            toggleSummaryItem('checklistTopBlock1', false);
        }
    }

    // Топ оператор
    const operatorStats = {};
    issues.forEach(item => {
        if (item.operator && item.operator.trim()) {
            operatorStats[item.operator] = (operatorStats[item.operator] || 0) + 1;
        }
    });
    const topOperator = Object.keys(operatorStats).sort((a, b) => operatorStats[b] - operatorStats[a])[0];
    const topOperatorElement = document.getElementById('checklistTopOperator');
    if (topOperatorElement) {
        if (topOperator) {
            topOperatorElement.textContent = `${topOperator} (${operatorStats[topOperator]})`;
            toggleSummaryItem('checklistTopOperator', true);
            visibleItemsCount++;
        } else {
            toggleSummaryItem('checklistTopOperator', false);
        }
    }

    // Топ группа
    const groupStats = {};
    issues.forEach(item => {
        if (item.group && item.group.trim()) {
            groupStats[item.group] = (groupStats[item.group] || 0) + 1;
        }
    });
    const topGroup = Object.keys(groupStats).sort((a, b) => groupStats[b] - groupStats[a])[0];
    const topGroupElement = document.getElementById('checklistTopGroup');
    if (topGroupElement) {
        if (topGroup) {
            topGroupElement.textContent = `${topGroup} (${groupStats[topGroup]})`;
            toggleSummaryItem('checklistTopGroup', true);
            visibleItemsCount++;
        } else {
            toggleSummaryItem('checklistTopGroup', false);
        }
    }

    // Обновляем CSS класс сетки в зависимости от количества видимых элементов
    const summaryGrid = document.querySelector('.checklist-summary-grid');
    if (summaryGrid) {
        // Удаляем старые классы
        summaryGrid.classList.remove('items-1', 'items-2', 'items-3', 'items-4');
        // Добавляем новый класс
        if (visibleItemsCount > 0) {
            summaryGrid.classList.add(`items-${visibleItemsCount}`);
        }
    }
}

// Обновление графиков
function updateChecklistCharts() {
    updateChecklistBlockChart('checklistBlock0Chart', 'Block_0_lvl');
    updateChecklistBlockChart('checklistBlock1Chart', 'Block_1_lvl');

    // Инициализируем новые графики динамики
    if (typeof window.updateChecklistDynamicsCharts === 'function') {
        window.updateChecklistDynamicsCharts();
    } else if (typeof initChecklistCharts === 'function') {
        initChecklistCharts();
    }
}

function updateChecklistBlockChart(containerId, blockField) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const issues = checklistFilteredData.filter(item => item.score === 1);

    const stats = {};
    issues.forEach(item => {
        stats[item[blockField]] = (stats[item[blockField]] || 0) + 1;
    });

    const sortedStats = Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Топ 10

    const maxValue = sortedStats.length > 0 ? sortedStats[0][1] : 1;

    container.innerHTML = sortedStats.map(([label, value]) => `
        <div class="checklist-bar-item">
            <div class="checklist-bar-label" title="${label}">${label.length > 20 ? label.substring(0, 20) + '...' : label}</div>
            <div class="checklist-bar-visual">
                <div class="checklist-bar-fill" style="width: ${(value / maxValue) * 100}%"></div>
            </div>
            <div class="checklist-bar-value">${value}</div>
        </div>
    `).join('');

    if (sortedStats.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">Нет данных для отображения</div>';
    }
}

// Функция сортировки таблицы операторов
function sortOperatorTable(columnIndex, columnName) {
    // Определяем направление сортировки
    if (operatorTableSortColumn === columnIndex) {
        operatorTableSortDirection = operatorTableSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        operatorTableSortColumn = columnIndex;
        operatorTableSortDirection = 'asc';
    }

    // Обновляем заголовки таблицы
    updateOperatorTableHeaders();

    // Перерисовываем таблицу с новой сортировкой
    updateChecklistOperatorTable();
}

// Обновление заголовков таблицы операторов с индикаторами сортировки
function updateOperatorTableHeaders() {
    const headers = document.querySelectorAll('#checklistOperatorTable th');
    headers.forEach((header, index) => {
        // Удаляем старые индикаторы
        header.classList.remove('sorted-asc', 'sorted-desc');
        const existingArrow = header.querySelector('.sort-arrow');
        if (existingArrow) {
            existingArrow.remove();
        }

        // Добавляем новый индикатор для активной колонки
        if (operatorTableSortColumn === index) {
            header.classList.add(operatorTableSortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
            const arrow = document.createElement('span');
            arrow.className = 'sort-arrow';
            arrow.textContent = operatorTableSortDirection === 'asc' ? ' ↑' : ' ↓';
            header.appendChild(arrow);
        }
    });
}

// Обновление таблицы операторов
function updateChecklistOperatorTable() {
    const tbody = document.getElementById('checklistOperatorBody');
    if (!tbody) return;

    // Группируем данные по операторам
    const operatorStats = {};
    checklistFilteredData.forEach(item => {
        const key = `${item.operator}|${item.group}|${item.kc}`;
        if (!operatorStats[key]) {
            operatorStats[key] = {
                operator: item.operator,
                group: item.group,
                kc: item.kc,
                total: 0,
                issues: 0,
                issueRate: 0,
                block0Stats: {},
                block1Stats: {}
            };
        }

        operatorStats[key].total++;
        if (item.score === 1) {
            operatorStats[key].issues++;
            operatorStats[key].block0Stats[item.Block_0_lvl] = (operatorStats[key].block0Stats[item.Block_0_lvl] || 0) + 1;
            operatorStats[key].block1Stats[item.Block_1_lvl] = (operatorStats[key].block1Stats[item.Block_1_lvl] || 0) + 1;
        }
        // Вычисляем процент проблем
        operatorStats[key].issueRate = operatorStats[key].total > 0 ?
            ((operatorStats[key].issues / operatorStats[key].total) * 100) : 0;
    });

    let sortedOperators = Object.values(operatorStats);

    // Применяем сортировку если выбрана колонка
    if (operatorTableSortColumn !== null) {
        sortedOperators.sort((a, b) => {
            let valueA, valueB;

            switch (operatorTableSortColumn) {
                case 0: // Оператор
                    valueA = a.operator;
                    valueB = b.operator;
                    break;
                case 1: // Группа
                    valueA = a.group;
                    valueB = b.group;
                    break;
                case 2: // КЦ
                    valueA = a.kc;
                    valueB = b.kc;
                    break;
                case 3: // Всего
                    valueA = a.total;
                    valueB = b.total;
                    break;
                case 4: // Проблем
                    valueA = a.issues;
                    valueB = b.issues;
                    break;
                case 5: // Доля проблем
                    valueA = a.issueRate;
                    valueB = b.issueRate;
                    break;
                case 6: // Топ блок 0
                    valueA = Object.keys(a.block0Stats).sort((x, y) => a.block0Stats[y] - a.block0Stats[x])[0] || '';
                    valueB = Object.keys(b.block0Stats).sort((x, y) => b.block0Stats[y] - b.block0Stats[x])[0] || '';
                    break;
                case 7: // Топ блок 1
                    valueA = Object.keys(a.block1Stats).sort((x, y) => a.block1Stats[y] - a.block1Stats[x])[0] || '';
                    valueB = Object.keys(b.block1Stats).sort((x, y) => b.block1Stats[y] - b.block1Stats[x])[0] || '';
                    break;
                default:
                    return 0;
            }

            // Сравнение значений
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                const comparison = valueA.localeCompare(valueB);
                return operatorTableSortDirection === 'asc' ? comparison : -comparison;
            } else {
                const comparison = valueA - valueB;
                return operatorTableSortDirection === 'asc' ? comparison : -comparison;
            }
        });
    } else {
        // Сортировка по умолчанию - по операторам (возрастание)
        sortedOperators.sort((a, b) => a.operator.localeCompare(b.operator));
    }

    // Отладочная информация для Коротенко П. Р.
    const korotenkoData = sortedOperators.find(op => op.operator === 'Коротенко П. Р.');
    if (korotenkoData) {
        console.log('[Checklist Dashboard] Коротенко П. Р. статистика:', korotenkoData);
    }

    tbody.innerHTML = sortedOperators.map(op => {
        const issueRate = op.issueRate.toFixed(1);
        const topBlock0 = Object.keys(op.block0Stats).sort((a, b) => op.block0Stats[b] - op.block0Stats[a])[0] || '-';
        const topBlock1 = Object.keys(op.block1Stats).sort((a, b) => op.block1Stats[b] - op.block1Stats[a])[0] || '-';

        return `
            <tr>
                <td>${op.operator}</td>
                <td>${op.group}</td>
                <td>${op.kc}</td>
                <td>${op.total}</td>
                <td class="score-${op.issues > 0 ? 1 : 0}">${op.issues}</td>
                <td>${issueRate}%</td>
                <td title="${topBlock0}">${topBlock0.length > 25 ? topBlock0.substring(0, 25) + '...' : topBlock0}</td>
                <td title="${topBlock1}">${topBlock1.length > 25 ? topBlock1.substring(0, 25) + '...' : topBlock1}</td>
            </tr>
        `;
    }).join('');
}

// Функция сортировки таблицы подробных записей
function sortDetailsTable(columnIndex, columnName) {
    // Определяем направление сортировки
    if (detailsTableSortColumn === columnIndex) {
        detailsTableSortDirection = detailsTableSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        detailsTableSortColumn = columnIndex;
        detailsTableSortDirection = 'asc';
    }

    // Обновляем заголовки таблицы
    updateDetailsTableHeaders();

    // Перерисовываем таблицу с новой сортировкой
    updateChecklistTable();
}

// Обновление заголовков таблицы подробных записей с индикаторами сортировки
function updateDetailsTableHeaders() {
    const headers = document.querySelectorAll('#checklistResultsTable th');
    headers.forEach((header, index) => {
        // Удаляем старые индикаторы
        header.classList.remove('sorted-asc', 'sorted-desc');
        const existingArrow = header.querySelector('.sort-arrow');
        if (existingArrow) {
            existingArrow.remove();
        }

        // Добавляем новый индикатор для активной колонки
        if (detailsTableSortColumn === index) {
            header.classList.add(detailsTableSortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
            const arrow = document.createElement('span');
            arrow.className = 'sort-arrow';
            arrow.textContent = detailsTableSortDirection === 'asc' ? ' ↑' : ' ↓';
            header.appendChild(arrow);
        }
    });
}

// Обновление детальной таблицы
function updateChecklistTable() {
    const tbody = document.getElementById('checklistResultsBody');
    const noData = document.getElementById('checklistNoData');
    const table = document.getElementById('checklistResultsTable');

    if (!tbody || !table) return;

    if (checklistFilteredData.length === 0) {
        table.style.display = 'none';
        if (noData) noData.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    if (noData) noData.style.display = 'none';

    // Показываем только проблемы
    const issuesOnly = checklistFilteredData.filter(item => item.score === 1);
    let sortedData = [...issuesOnly];

    // Применяем сортировку если выбрана колонка
    if (detailsTableSortColumn !== null) {
        sortedData.sort((a, b) => {
            let valueA, valueB;

            switch (detailsTableSortColumn) {
                case 0: // Дата
                    valueA = new Date(a.date);
                    valueB = new Date(b.date);
                    break;
                case 1: // Оператор
                    valueA = a.operator;
                    valueB = b.operator;
                    break;
                case 2: // Группа
                    valueA = a.group;
                    valueB = b.group;
                    break;
                case 3: // КЦ
                    valueA = a.kc;
                    valueB = b.kc;
                    break;
                case 4: // Блок 0
                    valueA = a.Block_0_lvl;
                    valueB = b.Block_0_lvl;
                    break;
                case 5: // Блок 1
                    valueA = a.Block_1_lvl;
                    valueB = b.Block_1_lvl;
                    break;
                case 6: // Блок 2
                    valueA = a.Block_2_lvl;
                    valueB = b.Block_2_lvl;
                    break;
                case 7: // Балл
                    valueA = a.score;
                    valueB = b.score;
                    break;
                default:
                    return 0;
            }

            // Сравнение значений
            if (valueA instanceof Date && valueB instanceof Date) {
                const comparison = valueA.getTime() - valueB.getTime();
                return detailsTableSortDirection === 'asc' ? comparison : -comparison;
            } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                const comparison = valueA.localeCompare(valueB);
                return detailsTableSortDirection === 'asc' ? comparison : -comparison;
            } else {
                const comparison = valueA - valueB;
                return detailsTableSortDirection === 'asc' ? comparison : -comparison;
            }
        });
    } else {
        // Сортировка по умолчанию - по операторам (возрастание)
        sortedData.sort((a, b) => a.operator.localeCompare(b.operator));
    }

    tbody.innerHTML = sortedData.slice(0, 500).map(item => `
        <tr>
            <td>${item.date}</td>
            <td>${item.operator}</td>
            <td>${item.group}</td>
            <td>${item.kc}</td>
            <td title="${item.Block_0_lvl}">${item.Block_0_lvl.length > 30 ? item.Block_0_lvl.substring(0, 30) + '...' : item.Block_0_lvl}</td>
            <td title="${item.Block_1_lvl}">${item.Block_1_lvl.length > 30 ? item.Block_1_lvl.substring(0, 30) + '...' : item.Block_1_lvl}</td>
            <td title="${item.Block_2_lvl}">${item.Block_2_lvl.length > 30 ? item.Block_2_lvl.substring(0, 30) + '...' : item.Block_2_lvl}</td>
            <td class="score-${item.score}">${item.score}</td>
        </tr>
    `).join('');

    if (sortedData.length > 500) {
        tbody.innerHTML += `<tr><td colspan="8" style="text-align: center; color: #666; font-style: italic;">Показано первые 500 записей из ${sortedData.length}</td></tr>`;
    }
}

// Инициализация обработчиков сортировки для таблиц
function initTableSorting() {
    // Инициализация сортировки для таблицы операторов
    const operatorHeaders = document.querySelectorAll('#checklistOperatorTable th');
    operatorHeaders.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        header.addEventListener('click', () => {
            sortOperatorTable(index, header.textContent.trim());
        });
    });

    // Инициализация сортировки для таблицы подробных записей
    const detailsHeaders = document.querySelectorAll('#checklistResultsTable th');
    detailsHeaders.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        header.addEventListener('click', () => {
            sortDetailsTable(index, header.textContent.trim());
        });
    });
}

// Инициализация дашборда чек-листов
function initChecklistDashboard() {
    console.log('[Checklist Dashboard] Инициализация дашборда чек-листов...');

    // Добавляем обработчики для всех фильтров
    const filterIds = ['checklistDateFrom', 'checklistDateTo', 'checklistKcFilter', 'checklistGroupFilter', 'checklistOperatorFilter', 'checklistBlock0Filter', 'checklistBlock1Filter'];

    filterIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', applyChecklistFilters);
        }
    });

    // Добавляем обработчик для кнопки "Обновить"
    const updateButton = document.getElementById('checklistUpdateButton');
    if (updateButton) {
        updateButton.addEventListener('click', async function () {
            console.log('[Checklist Dashboard] Кнопка "Обновить" нажата');
            const dashboardType = document.getElementById('checklistDashboard')?.value || 'Автооценка';
            await loadChecklistData(dashboardType);
        });
    }

    // Добавляем обработчик для изменения дашборда (пока без функциональности)
    const dashboardSelect = document.getElementById('checklistDashboard');
    if (dashboardSelect) {
        dashboardSelect.addEventListener('change', function () {
            console.log('[Checklist Dashboard] Дашборд изменен на:', this.value, '(пока без функциональности)');
            // Пока не перезагружаем данные при смене дашборда
        });
    }

    // Сортировка таблиц инициализируется в loadChecklistData() после загрузки данных

    // Переключатель режима графиков теперь инициализируется в модуле checklist-charts.js

    // Загружаем данные по умолчанию
    loadChecklistData();
}

// Экспортируем функции для использования в основном приложении
if (typeof window !== 'undefined') {
    window.checklistDashboard = {
        init: initChecklistDashboard,
        loadData: loadChecklistData,
        applyFilters: applyChecklistFilters,
        updateDashboard: function (dashboardType) {
            return loadChecklistData(dashboardType);
        }
    };
}