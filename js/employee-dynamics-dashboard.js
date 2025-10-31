// ===== EMPLOYEE DYNAMICS DASHBOARD MODULE =====
console.log('🚀 МОДУЛЬ EMPLOYEE-DYNAMICS-DASHBOARD.JS НАЧАЛ ЗАГРУЖАТЬСЯ');

let empDynAllData = [];
let empDynFilteredData = [];
let empDynChart = null;
let empDynBlockCharts = {}; // Графики по блокам
let empDynComparisonChart = null; // График сравнения

// Загрузка данных
async function loadEmployeeDynamicsData() {
    console.log('[Employee Dynamics] Загружаем данные...');
    
    try {
        const response = await fetch('operator_data_days.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        empDynAllData = await response.json();
        console.log('[Employee Dynamics] Данные загружены:', empDynAllData.length, 'записей');
        
        populateEmployeeDynamicsFilters();
        
    } catch (error) {
        console.error('[Employee Dynamics] Ошибка загрузки:', error);
        const loadingElement = document.getElementById('empDynLoading');
        if (loadingElement) {
            loadingElement.innerHTML = `Ошибка загрузки данных: ${error.message}`;
        }
    }
}

// Заполнение фильтров
function populateEmployeeDynamicsFilters() {
    console.log('[Employee Dynamics] Заполняем фильтры...');
    
    const operatorSelect = document.getElementById('empDynOperator');
    const compareSelect = document.getElementById('empDynCompareOperator');
    
    if (!operatorSelect) {
        console.error('[Employee Dynamics] Селект сотрудников не найден');
        return;
    }
    
    // Получаем уникальных операторов
    const operators = [...new Set(empDynAllData.map(item => item.operator))].sort();
    
    // Заполняем основной селект
    operatorSelect.innerHTML = '<option value="">Выберите сотрудника</option>';
    operators.forEach(operator => {
        const option = document.createElement('option');
        option.value = operator;
        option.textContent = operator;
        operatorSelect.appendChild(option);
    });
    
    // Заполняем селект сравнения
    if (compareSelect) {
        compareSelect.innerHTML = '<option value="">Не выбрано</option>';
        operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator;
            option.textContent = operator;
            compareSelect.appendChild(option);
        });
    }
    
    console.log('[Employee Dynamics] ✅ Добавлено сотрудников:', operators.length);
}

// Применение фильтров и обновление данных
async function applyEmployeeDynamicsFilters() {
    console.log('[Employee Dynamics] Применяем фильтры...');
    
    // Проверяем, загружены ли данные
    if (!empDynAllData || empDynAllData.length === 0) {
        console.log('[Employee Dynamics] Данные не загружены, загружаем...');
        await loadEmployeeDynamicsData();
    }
    
    const selectedOperator = document.getElementById('empDynOperator').value;
    const compareOperator = document.getElementById('empDynCompareOperator').value;
    const dateFrom = document.getElementById('empDynStartDate').value;
    const dateTo = document.getElementById('empDynEndDate').value;
    const granularity = document.getElementById('empDynGranularity').value;
    
    if (!selectedOperator) {
        document.getElementById('empDynLoading').innerHTML = 'Выберите сотрудника для просмотра данных';
        document.getElementById('empDynTable').style.display = 'none';
        document.getElementById('empDynEmployeeInfo').style.display = 'none';
        document.getElementById('empDynBlocksSection').style.display = 'none';
        document.getElementById('empDynBlocks1Section').style.display = 'none';
        document.getElementById('empDynComparisonSection').style.display = 'none';
        document.getElementById('empDynRankingSection').style.display = 'none';
        return;
    }
    
    // Фильтруем данные по выбранному сотруднику и датам
    empDynFilteredData = empDynAllData.filter(item => {
        const itemDate = new Date(item.date);
        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;
        
        return item.operator === selectedOperator &&
               (!from || itemDate >= from) &&
               (!to || itemDate <= to);
    });
    
    if (empDynFilteredData.length === 0) {
        document.getElementById('empDynLoading').innerHTML = 'Нет данных для выбранного периода';
        return;
    }
    
    // Показываем информацию о сотруднике
    const firstRecord = empDynFilteredData[0];
    document.getElementById('empDynName').textContent = selectedOperator;
    document.getElementById('empDynGroup').textContent = firstRecord.group || '-';
    document.getElementById('empDynKc').textContent = firstRecord.kc || '-';
    document.getElementById('empDynEmployeeInfo').style.display = 'block';
    
    console.log('[Employee Dynamics] Отфильтровано записей:', empDynFilteredData.length);
    
    // Группируем данные по выбранной гранулярности
    const groupedData = groupDataByPeriodNew(empDynFilteredData, granularity);
    console.log('[Employee Dynamics] Сгруппировано периодов:', groupedData.length);
    
    // Обновляем статистику
    updateEmployeeDynamicsStatsNew(empDynFilteredData);
    
    // Обновляем таблицу
    updateEmployeeDynamicsTableNew(groupedData);
    
    // Обновляем график
    updateEmployeeDynamicsChartNew(groupedData);
    
    // Обновляем детализацию по блокам 0 уровня
    updateBlocksAnalysis(empDynFilteredData);
    document.getElementById('empDynBlocksSection').style.display = 'block';
    
    // Обновляем детализацию по блокам 1 уровня
    updateBlocks1Analysis(empDynFilteredData);
    document.getElementById('empDynBlocks1Section').style.display = 'block';
    
    // Обновляем рейтинг
    updateEmployeeRanking(selectedOperator, dateFrom, dateTo);
    document.getElementById('empDynRankingSection').style.display = 'block';
    
    // Обработка сравнения
    if (compareOperator && compareOperator !== selectedOperator) {
        const compareData = empDynAllData.filter(item => {
            const itemDate = new Date(item.date);
            const from = dateFrom ? new Date(dateFrom) : null;
            const to = dateTo ? new Date(dateTo) : null;
            
            return item.operator === compareOperator &&
                   (!from || itemDate >= from) &&
                   (!to || itemDate <= to);
        });
        
        if (compareData.length > 0) {
            updateComparison(empDynFilteredData, compareData, selectedOperator, compareOperator, granularity);
            document.getElementById('empDynComparisonSection').style.display = 'block';
        }
    } else {
        document.getElementById('empDynComparisonSection').style.display = 'none';
    }
    
    document.getElementById('empDynLoading').style.display = 'none';
    document.getElementById('empDynTable').style.display = 'table';
    
    console.log('[Employee Dynamics] ✅ Данные обновлены успешно');
}

// Группировка данных по периодам
function groupDataByPeriod(data, dates, granularity) {
    const grouped = {};
    
    dates.forEach(date => {
        let periodKey;
        const d = new Date(date);
        
        if (granularity === 'week') {
            // Получаем номер недели
            const weekNum = getWeekNumber(d);
            const year = d.getFullYear();
            periodKey = `${year}-W${weekNum.toString().padStart(2, '0')}`;
        } else {
            // Месяц
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            periodKey = `${year}-${month}`;
        }
        
        if (!grouped[periodKey]) {
            grouped[periodKey] = {
                period: periodKey,
                calls: 0,
                issues: 0,
                dates: []
            };
        }
        
        const dayData = data[date];
        grouped[periodKey].calls += dayData['Звонков'] || 0;
        grouped[periodKey].issues += dayData['Отклонений'] || 0;
        grouped[periodKey].dates.push(date);
    });
    
    // Вычисляем проценты и форматируем периоды
    const result = Object.keys(grouped).sort().map(key => {
        const item = grouped[key];
        const rate = item.calls > 0 ? ((item.issues / item.calls) * 100).toFixed(2) : 0;
        
        return {
            period: formatPeriod(key, granularity),
            periodKey: key,
            calls: item.calls,
            issues: item.issues,
            rate: parseFloat(rate),
            dates: item.dates
        };
    });
    
    return result;
}

// Получение номера недели
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Форматирование периода для отображения
function formatPeriod(periodKey, granularity) {
    if (granularity === 'week') {
        const [year, week] = periodKey.split('-W');
        return `${year}, неделя ${week}`;
    } else {
        const [year, month] = periodKey.split('-');
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                           'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
}

// Обновление статистики
function updateEmployeeDynamicsStats(groupedData) {
    const totalCalls = groupedData.reduce((sum, item) => sum + item.calls, 0);
    const totalIssues = groupedData.reduce((sum, item) => sum + item.issues, 0);
    const issueRate = totalCalls > 0 ? ((totalIssues / totalCalls) * 100).toFixed(2) : 0;
    const avgRate = groupedData.length > 0 
        ? (groupedData.reduce((sum, item) => sum + item.rate, 0) / groupedData.length).toFixed(2)
        : 0;
    
    document.getElementById('empDynTotalCalls').textContent = totalCalls.toLocaleString();
    document.getElementById('empDynTotalIssues').textContent = totalIssues.toLocaleString();
    document.getElementById('empDynIssueRate').textContent = issueRate + '%';
    document.getElementById('empDynAvgRate').textContent = avgRate + '%';
}

// Обновление таблицы
function updateEmployeeDynamicsTable(groupedData) {
    const tbody = document.getElementById('empDynTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    groupedData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // Вычисляем изменение относительно предыдущего периода
        let changeHtml = '-';
        if (index > 0) {
            const prevRate = groupedData[index - 1].rate;
            const change = item.rate - prevRate;
            const changeClass = change > 0 ? 'negative-change' : change < 0 ? 'positive-change' : '';
            const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
            changeHtml = `<span class="${changeClass}">${arrow} ${Math.abs(change).toFixed(2)}%</span>`;
        }
        
        row.innerHTML = `
            <td>${item.period}</td>
            <td>${item.calls.toLocaleString()}</td>
            <td>${item.issues.toLocaleString()}</td>
            <td>${item.rate}%</td>
            <td>${changeHtml}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Обновление графика
function updateEmployeeDynamicsChart(groupedData) {
    const ctx = document.getElementById('empDynChart');
    if (!ctx) return;
    
    // Уничтожаем предыдущий график
    if (empDynChart) {
        empDynChart.destroy();
    }
    
    empDynChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: groupedData.map(item => item.period),
            datasets: [
                {
                    label: '% отклонений',
                    data: groupedData.map(item => item.rate),
                    borderColor: '#EE964B',
                    backgroundColor: 'rgba(238, 150, 75, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'Количество звонков',
                    data: groupedData.map(item => item.calls),
                    borderColor: '#0D3B66',
                    backgroundColor: 'rgba(13, 59, 102, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (context.datasetIndex === 0) {
                                    label += context.parsed.y.toFixed(2) + '%';
                                } else {
                                    label += context.parsed.y.toLocaleString();
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '% отклонений'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Количество звонков'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Новая функция группировки для массива данных
function groupDataByPeriodNew(data, granularity) {
    const grouped = {};
    
    data.forEach(item => {
        let periodKey;
        const d = new Date(item.date);
        
        if (granularity === 'week') {
            const weekNum = getWeekNumber(d);
            const year = d.getFullYear();
            periodKey = `${year}-W${weekNum.toString().padStart(2, '0')}`;
        } else {
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            periodKey = `${year}-${month}`;
        }
        
        if (!grouped[periodKey]) {
            grouped[periodKey] = {
                period: periodKey,
                total: 0,
                issues: 0
            };
        }
        
        grouped[periodKey].total++;
        if (item.score === 1) {
            grouped[periodKey].issues++;
        }
    });
    
    const result = Object.keys(grouped).sort().map(key => {
        const item = grouped[key];
        const rate = item.total > 0 ? ((item.issues / item.total) * 100).toFixed(2) : 0;
        
        return {
            period: formatPeriod(key, granularity),
            periodKey: key,
            total: item.total,
            issues: item.issues,
            rate: parseFloat(rate)
        };
    });
    
    return result;
}

// Обновление статистики для нового формата
function updateEmployeeDynamicsStatsNew(data) {
    const totalRecords = data.length;
    const totalIssues = data.filter(item => item.score === 1).length;
    const issueRate = totalRecords > 0 ? ((totalIssues / totalRecords) * 100).toFixed(2) : 0;
    
    // Группируем по датам для расчета среднего
    const byDate = {};
    data.forEach(item => {
        if (!byDate[item.date]) {
            byDate[item.date] = { total: 0, issues: 0 };
        }
        byDate[item.date].total++;
        if (item.score === 1) byDate[item.date].issues++;
    });
    
    const dailyRates = Object.values(byDate).map(d => (d.issues / d.total) * 100);
    const avgRate = dailyRates.length > 0 
        ? (dailyRates.reduce((a, b) => a + b, 0) / dailyRates.length).toFixed(2)
        : 0;
    
    document.getElementById('empDynTotalCalls').textContent = totalRecords.toLocaleString();
    document.getElementById('empDynTotalIssues').textContent = totalIssues.toLocaleString();
    document.getElementById('empDynIssueRate').textContent = issueRate + '%';
    document.getElementById('empDynAvgRate').textContent = avgRate + '%';
}

// Обновление таблицы для нового формата
function updateEmployeeDynamicsTableNew(groupedData) {
    const tbody = document.getElementById('empDynTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    groupedData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        let changeHtml = '-';
        if (index > 0) {
            const prevRate = groupedData[index - 1].rate;
            const change = item.rate - prevRate;
            const changeClass = change > 0 ? 'negative-change' : change < 0 ? 'positive-change' : '';
            const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
            changeHtml = `<span class="${changeClass}">${arrow} ${Math.abs(change).toFixed(2)}%</span>`;
        }
        
        row.innerHTML = `
            <td>${item.period}</td>
            <td>${item.total.toLocaleString()}</td>
            <td>${item.issues.toLocaleString()}</td>
            <td>${item.rate}%</td>
            <td>${changeHtml}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Обновление графика для нового формата
function updateEmployeeDynamicsChartNew(groupedData) {
    const ctx = document.getElementById('empDynChart');
    if (!ctx) return;
    
    if (empDynChart) {
        empDynChart.destroy();
    }
    
    empDynChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: groupedData.map(item => item.period),
            datasets: [
                {
                    label: '% отклонений',
                    data: groupedData.map(item => item.rate),
                    borderColor: '#EE964B',
                    backgroundColor: 'rgba(238, 150, 75, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'Количество записей',
                    data: groupedData.map(item => item.total),
                    borderColor: '#0D3B66',
                    backgroundColor: 'rgba(13, 59, 102, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '% отклонений'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Количество записей'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Анализ по блокам
function updateBlocksAnalysis(data) {
    // Подсчет по блокам 0 уровня
    const blockStats = {};
    data.forEach(item => {
        const block = item.Block_0_lvl;
        if (!blockStats[block]) {
            blockStats[block] = { total: 0, issues: 0 };
        }
        blockStats[block].total++;
        if (item.score === 1) {
            blockStats[block].issues++;
        }
    });
    
    // Топ-3 проблемных блока
    const topBlocks = Object.keys(blockStats)
        .map(block => ({
            block,
            ...blockStats[block],
            rate: (blockStats[block].issues / blockStats[block].total) * 100
        }))
        .sort((a, b) => b.issues - a.issues)
        .slice(0, 3);
    
    updateTopBlocksChart(topBlocks);
    updateBlocksDynamicsChart(data, topBlocks.map(b => b.block));
    updateBlocksDistributionChart(blockStats);
}

// График топ-3 блоков
function updateTopBlocksChart(topBlocks) {
    const ctx = document.getElementById('empDynTopBlocksChart');
    if (!ctx) return;
    
    if (empDynBlockCharts.top) {
        empDynBlockCharts.top.destroy();
    }
    
    empDynBlockCharts.top = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topBlocks.map(b => b.block),
            datasets: [{
                label: 'Количество отклонений',
                data: topBlocks.map(b => b.issues),
                backgroundColor: ['#EE964B', '#F4D35E', '#FAF0CA']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// График динамики по блокам
function updateBlocksDynamicsChart(data, topBlockNames) {
    const ctx = document.getElementById('empDynBlocksDynamicsChart');
    if (!ctx) return;
    
    if (empDynBlockCharts.dynamics) {
        empDynBlockCharts.dynamics.destroy();
    }
    
    // Группируем по датам и блокам
    const byDate = {};
    data.forEach(item => {
        if (!topBlockNames.includes(item.Block_0_lvl)) return;
        if (!byDate[item.date]) {
            byDate[item.date] = {};
        }
        if (!byDate[item.date][item.Block_0_lvl]) {
            byDate[item.date][item.Block_0_lvl] = 0;
        }
        if (item.score === 1) {
            byDate[item.date][item.Block_0_lvl]++;
        }
    });
    
    const dates = Object.keys(byDate).sort();
    const colors = ['#EE964B', '#F4D35E', '#FAF0CA'];
    
    const datasets = topBlockNames.map((block, index) => ({
        label: block,
        data: dates.map(date => byDate[date][block] || 0),
        borderColor: colors[index],
        backgroundColor: colors[index] + '33',
        tension: 0.3
    }));
    
    empDynBlockCharts.dynamics = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(d => new Date(d).toLocaleDateString('ru-RU')),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// График распределения по блокам
function updateBlocksDistributionChart(blockStats) {
    const ctx = document.getElementById('empDynBlocksDistributionChart');
    if (!ctx) return;
    
    if (empDynBlockCharts.distribution) {
        empDynBlockCharts.distribution.destroy();
    }
    
    const blocks = Object.keys(blockStats);
    const colors = ['#EE964B', '#F4D35E', '#FAF0CA', '#0D3B66', '#7c9ff5', '#9b8fd9'];
    
    empDynBlockCharts.distribution = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: blocks,
            datasets: [{
                data: blocks.map(b => blockStats[b].issues),
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// ===== АНАЛИЗ ПО БЛОКАМ 1 УРОВНЯ =====
let empDynBlock1Charts = {}; // Графики по блокам 1 уровня

// Анализ по блокам 1 уровня
function updateBlocks1Analysis(data) {
    // Подсчет по блокам 1 уровня
    const blockStats = {};
    data.forEach(item => {
        const block = item.Block_1_lvl;
        if (!blockStats[block]) {
            blockStats[block] = { total: 0, issues: 0 };
        }
        blockStats[block].total++;
        if (item.score === 1) {
            blockStats[block].issues++;
        }
    });
    
    // Топ-5 проблемных блоков
    const topBlocks = Object.keys(blockStats)
        .map(block => ({
            block,
            ...blockStats[block],
            rate: (blockStats[block].issues / blockStats[block].total) * 100
        }))
        .sort((a, b) => b.issues - a.issues)
        .slice(0, 5);
    
    updateTopBlocks1Chart(topBlocks);
    updateBlocks1DynamicsChart(data, topBlocks.map(b => b.block));
    updateBlocks1DistributionChart(blockStats);
}

// График топ-5 блоков 1 уровня
function updateTopBlocks1Chart(topBlocks) {
    const ctx = document.getElementById('empDynTopBlocks1Chart');
    if (!ctx) return;
    
    if (empDynBlock1Charts.top) {
        empDynBlock1Charts.top.destroy();
    }
    
    empDynBlock1Charts.top = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topBlocks.map(b => b.block),
            datasets: [{
                label: 'Количество отклонений',
                data: topBlocks.map(b => b.issues),
                backgroundColor: ['#EE964B', '#F4D35E', '#FAF0CA', '#0D3B66', '#7c9ff5']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

// График динамики по блокам 1 уровня
function updateBlocks1DynamicsChart(data, topBlockNames) {
    const ctx = document.getElementById('empDynBlocks1DynamicsChart');
    if (!ctx) return;
    
    if (empDynBlock1Charts.dynamics) {
        empDynBlock1Charts.dynamics.destroy();
    }
    
    // Группируем по датам и блокам
    const byDate = {};
    data.forEach(item => {
        if (!topBlockNames.includes(item.Block_1_lvl)) return;
        if (!byDate[item.date]) {
            byDate[item.date] = {};
        }
        if (!byDate[item.date][item.Block_1_lvl]) {
            byDate[item.date][item.Block_1_lvl] = 0;
        }
        if (item.score === 1) {
            byDate[item.date][item.Block_1_lvl]++;
        }
    });
    
    const dates = Object.keys(byDate).sort();
    const colors = ['#EE964B', '#F4D35E', '#FAF0CA', '#0D3B66', '#7c9ff5'];
    
    const datasets = topBlockNames.map((block, index) => ({
        label: block,
        data: dates.map(date => byDate[date][block] || 0),
        borderColor: colors[index],
        backgroundColor: colors[index] + '33',
        tension: 0.3
    }));
    
    empDynBlock1Charts.dynamics = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(d => new Date(d).toLocaleDateString('ru-RU')),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// График распределения по блокам 1 уровня
function updateBlocks1DistributionChart(blockStats) {
    const ctx = document.getElementById('empDynBlocks1DistributionChart');
    if (!ctx) return;
    
    if (empDynBlock1Charts.distribution) {
        empDynBlock1Charts.distribution.destroy();
    }
    
    const blocks = Object.keys(blockStats);
    const colors = ['#EE964B', '#F4D35E', '#FAF0CA', '#0D3B66', '#7c9ff5', '#9b8fd9', '#FAF0CA', '#EE964B'];
    
    empDynBlock1Charts.distribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: blocks,
            datasets: [{
                data: blocks.map(b => blockStats[b].issues),
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Сравнение сотрудников
function updateComparison(data1, data2, name1, name2, granularity) {
    // Статистика
    const stats1 = {
        total: data1.length,
        issues: data1.filter(i => i.score === 1).length
    };
    stats1.rate = ((stats1.issues / stats1.total) * 100).toFixed(2);
    
    const stats2 = {
        total: data2.length,
        issues: data2.filter(i => i.score === 1).length
    };
    stats2.rate = ((stats2.issues / stats2.total) * 100).toFixed(2);
    
    document.getElementById('empDynCompareEmployee1Name').textContent = name1;
    document.getElementById('empDynCompare1Total').textContent = stats1.total.toLocaleString();
    document.getElementById('empDynCompare1Issues').textContent = stats1.issues.toLocaleString();
    document.getElementById('empDynCompare1Rate').textContent = stats1.rate + '%';
    
    document.getElementById('empDynCompareEmployee2Name').textContent = name2;
    document.getElementById('empDynCompare2Total').textContent = stats2.total.toLocaleString();
    document.getElementById('empDynCompare2Issues').textContent = stats2.issues.toLocaleString();
    document.getElementById('empDynCompare2Rate').textContent = stats2.rate + '%';
    
    // Графики
    updateComparisonDynamicsChart(data1, data2, name1, name2, granularity);
    updateComparisonBlocksChart(data1, data2, name1, name2);
}

// График сравнения динамики
function updateComparisonDynamicsChart(data1, data2, name1, name2, granularity) {
    const ctx = document.getElementById('empDynComparisonDynamicsChart');
    if (!ctx) return;
    
    if (empDynComparisonChart) {
        empDynComparisonChart.destroy();
    }
    
    const grouped1 = groupDataByPeriodNew(data1, granularity);
    const grouped2 = groupDataByPeriodNew(data2, granularity);
    
    // Объединяем периоды
    const allPeriods = [...new Set([...grouped1.map(g => g.period), ...grouped2.map(g => g.period)])].sort();
    
    empDynComparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allPeriods,
            datasets: [
                {
                    label: name1,
                    data: allPeriods.map(p => {
                        const item = grouped1.find(g => g.period === p);
                        return item ? item.rate : null;
                    }),
                    borderColor: '#0D3B66',
                    backgroundColor: 'rgba(13, 59, 102, 0.1)',
                    tension: 0.3
                },
                {
                    label: name2,
                    data: allPeriods.map(p => {
                        const item = grouped2.find(g => g.period === p);
                        return item ? item.rate : null;
                    }),
                    borderColor: '#EE964B',
                    backgroundColor: 'rgba(238, 150, 75, 0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '% отклонений'
                    }
                }
            }
        }
    });
}

// График сравнения по блокам
function updateComparisonBlocksChart(data1, data2, name1, name2) {
    const ctx = document.getElementById('empDynComparisonBlocksChart');
    if (!ctx) return;
    
    // Подсчет по блокам
    const blocks1 = {};
    const blocks2 = {};
    
    data1.forEach(item => {
        if (!blocks1[item.Block_0_lvl]) blocks1[item.Block_0_lvl] = { total: 0, issues: 0 };
        blocks1[item.Block_0_lvl].total++;
        if (item.score === 1) blocks1[item.Block_0_lvl].issues++;
    });
    
    data2.forEach(item => {
        if (!blocks2[item.Block_0_lvl]) blocks2[item.Block_0_lvl] = { total: 0, issues: 0 };
        blocks2[item.Block_0_lvl].total++;
        if (item.score === 1) blocks2[item.Block_0_lvl].issues++;
    });
    
    const allBlocks = [...new Set([...Object.keys(blocks1), ...Object.keys(blocks2)])];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allBlocks,
            datasets: [
                {
                    label: name1,
                    data: allBlocks.map(b => {
                        const stats = blocks1[b];
                        return stats ? ((stats.issues / stats.total) * 100).toFixed(2) : 0;
                    }),
                    backgroundColor: 'rgba(13, 59, 102, 0.8)'
                },
                {
                    label: name2,
                    data: allBlocks.map(b => {
                        const stats = blocks2[b];
                        return stats ? ((stats.issues / stats.total) * 100).toFixed(2) : 0;
                    }),
                    backgroundColor: 'rgba(238, 150, 75, 0.8)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '% отклонений'
                    }
                }
            }
        }
    });
}

// Инициализация обработчиков событий
function initEmployeeDynamicsEventListeners() {
    console.log('[Employee Dynamics] Инициализируем обработчики...');
    
    if (window.empDynListenersInitialized) {
        console.log('[Employee Dynamics] Обработчики уже инициализированы');
        return;
    }
    
    const updateButton = document.getElementById('empDynUpdateButton');
    if (updateButton) {
        updateButton.addEventListener('click', applyEmployeeDynamicsFilters);
        console.log('[Employee Dynamics] Обработчик кнопки обновления добавлен');
    }
    
    // Инициализация сворачиваемых секций
    const headers = [
        { id: 'empDynChartHeader', content: 'empDynChartContent' },
        { id: 'empDynTableHeader', content: 'empDynTableContent' },
        { id: 'empDynBlocksHeader', content: 'empDynBlocksContent' },
        { id: 'empDynBlocks1Header', content: 'empDynBlocks1Content' },
        { id: 'empDynComparisonHeader', content: 'empDynComparisonContent' }
    ];
    
    headers.forEach(({ id, content }) => {
        const header = document.getElementById(id);
        if (header) {
            header.addEventListener('click', function() {
                toggleCollapsibleSection(content, header);
            });
        }
    });
    
    window.empDynListenersInitialized = true;
    console.log('[Employee Dynamics] Обработчики инициализированы');
}

// Расчет рейтинга сотрудника
function updateEmployeeRanking(selectedOperator, dateFrom, dateTo) {
    console.log('[Employee Dynamics] Рассчитываем рейтинг для:', selectedOperator);
    
    // Фильтруем данные по периоду
    const periodData = empDynAllData.filter(item => {
        const itemDate = new Date(item.date);
        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;
        
        return (!from || itemDate >= from) && (!to || itemDate <= to);
    });
    
    if (periodData.length === 0) {
        console.log('[Employee Dynamics] Нет данных для расчета рейтинга');
        return;
    }
    
    // Получаем информацию о сотруднике
    const employeeInfo = periodData.find(item => item.operator === selectedOperator);
    if (!employeeInfo) return;
    
    const employeeKc = employeeInfo.kc;
    const employeeGroup = employeeInfo.group;
    
    // Рассчитываем статистику для всех операторов
    const operatorStats = {};
    
    periodData.forEach(item => {
        if (!operatorStats[item.operator]) {
            operatorStats[item.operator] = {
                operator: item.operator,
                kc: item.kc,
                group: item.group,
                total: 0,
                issues: 0
            };
        }
        operatorStats[item.operator].total++;
        if (item.score === 1) {
            operatorStats[item.operator].issues++;
        }
    });
    
    // Преобразуем в массив и добавляем процент
    const operatorList = Object.values(operatorStats).map(op => ({
        ...op,
        rate: op.total > 0 ? (op.issues / op.total) * 100 : 0
    }));
    
    // Сортируем по проценту отклонений (меньше = лучше)
    operatorList.sort((a, b) => a.rate - b.rate);
    
    // Общий рейтинг
    const overallRank = operatorList.findIndex(op => op.operator === selectedOperator) + 1;
    const overallTotal = operatorList.length;
    const overallRate = operatorList.find(op => op.operator === selectedOperator).rate;
    
    // Рейтинг по КЦ
    const kcOperators = operatorList.filter(op => op.kc === employeeKc);
    const kcRank = kcOperators.findIndex(op => op.operator === selectedOperator) + 1;
    const kcTotal = kcOperators.length;
    const kcRate = kcOperators.find(op => op.operator === selectedOperator).rate;
    
    // Рейтинг по группе
    const groupOperators = operatorList.filter(op => op.group === employeeGroup);
    const groupRank = groupOperators.findIndex(op => op.operator === selectedOperator) + 1;
    const groupTotal = groupOperators.length;
    const groupRate = groupOperators.find(op => op.operator === selectedOperator).rate;
    
    // Обновляем UI
    updateRankingCard('empDynRankOverall', overallRank, overallTotal, overallRate);
    updateRankingCard('empDynRankKc', kcRank, kcTotal, kcRate);
    updateRankingCard('empDynRankGroup', groupRank, groupTotal, groupRate);
    
    console.log('[Employee Dynamics] ✅ Рейтинг обновлен');
}

// Обновление карточки рейтинга
function updateRankingCard(prefix, rank, total, rate) {
    const rankElement = document.getElementById(prefix);
    const totalElement = document.getElementById(prefix + 'Total');
    const percentElement = document.getElementById(prefix + 'Percent');
    
    if (rankElement) {
        rankElement.textContent = rank;
        
        // Добавляем класс для топ-3
        const card = rankElement.closest('.ranking-card');
        if (card) {
            card.classList.remove('rank-1', 'rank-2', 'rank-3');
            if (rank === 1) card.classList.add('rank-1');
            else if (rank === 2) card.classList.add('rank-2');
            else if (rank === 3) card.classList.add('rank-3');
        }
    }
    
    if (totalElement) {
        totalElement.textContent = total;
    }
    
    if (percentElement) {
        percentElement.textContent = rate.toFixed(2) + '%';
    }
}

// Экспорт функций
if (typeof window !== 'undefined') {
    window.loadEmployeeDynamicsData = loadEmployeeDynamicsData;
    window.initEmployeeDynamicsEventListeners = initEmployeeDynamicsEventListeners;
    window.applyEmployeeDynamicsFilters = applyEmployeeDynamicsFilters;
}

console.log('✅ МОДУЛЬ EMPLOYEE-DYNAMICS-DASHBOARD.JS ЗАГРУЖЕН');
