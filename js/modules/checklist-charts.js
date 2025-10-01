/**
 * Модуль для работы с графиками чек-листов
 */

// Глобальные переменные для хранения экземпляров графиков
let checklistResultChart = null;
let checklistMotivationChart = null;
let checklistObjectionsChart = null;

// Переменная для хранения режима отображения (count/percent)
let checklistChartsDisplayMode = 'count';

// Переменная для хранения режима группировки (months/departments)
let checklistChartsGroupingMode = 'months';

// Инициализация графиков чек-листов
function initChecklistCharts() {
    console.log('=== Инициализация графиков чек-листов ===');

    // Проверяем наличие данных
    const data = window.checklistFilteredData || checklistFilteredData;
    if (typeof data === 'undefined' || !data || data.length === 0) {
        console.log('Нет данных для графиков чек-листов');
        return;
    }

    console.log('Найдено данных для графиков:', data.length);

    // Создаем данные на основе реальных данных с учетом режима группировки
    const chartData = generateRealChecklistChartData(data);

    // Инициализируем переключатели (только один раз)
    const toggleElement = document.getElementById('checklistChartsToggle');
    if (toggleElement && !toggleElement.hasAttribute('data-initialized')) {
        initToggleSwitch();
        toggleElement.setAttribute('data-initialized', 'true');
    }
    
    const groupingToggleElement = document.getElementById('checklistGroupingToggle');
    if (groupingToggleElement && !groupingToggleElement.hasAttribute('data-initialized')) {
        initGroupingToggleSwitch();
        groupingToggleElement.setAttribute('data-initialized', 'true');
    }

    // Создаем графики
    createChecklistResultChart(chartData.result);
    createChecklistMotivationChart(chartData.motivation);
    createChecklistObjectionsChart(chartData.objections);
}

// Получение текущих фильтров
function getChecklistFilters() {
    return {
        dashboard: document.getElementById('checklistDashboard')?.value || 'Автооценка',
        dateFrom: document.getElementById('checklistDateFrom')?.value || '2025-05-01',
        dateTo: document.getElementById('checklistDateTo')?.value || '2025-07-30',
        kc: document.getElementById('checklistKcFilter')?.value || '',
        group: document.getElementById('checklistGroupFilter')?.value || '',
        operator: document.getElementById('checklistOperatorFilter')?.value || '',
        block0: document.getElementById('checklistBlock0Filter')?.value || '',
        block1: document.getElementById('checklistBlock1Filter')?.value || ''
    };
}

// Генерация данных на основе реальных данных с поддержкой двух режимов группировки
function generateRealChecklistChartData(data) {
    console.log('=== Генерируем данные графиков ===');
    console.log('Входные данные:', data.length, 'записей');
    console.log('Режим группировки:', checklistChartsGroupingMode);
    console.log('Пример записи:', data[0]);

    if (data.length === 0) {
        console.log('Нет данных для отображения, используем тестовые данные');
        return generateChecklistChartData({});
    }

    if (checklistChartsGroupingMode === 'months') {
        return generateMonthlyGroupedData(data);
    } else {
        return generateDepartmentGroupedData(data);
    }
}

// Генерация данных с группировкой по месяцам (текущий режим)
function generateMonthlyGroupedData(data) {
    console.log('=== Группировка по месяцам ===');
    
    // Получаем уникальные группы
    const groups = [...new Set(data.map(item => item.group.replace(' - группа', '')))].sort();
    console.log('Группы:', groups);

    // Группируем данные по месяцам
    const monthlyData = {};
    const monthlyTotals = {}; // Для расчета процентов

    data.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                label: monthLabel,
                business: {},
                motivation: {},
                client: {}
            };
        }

        if (!monthlyTotals[monthKey]) {
            monthlyTotals[monthKey] = {
                business: {},
                motivation: {},
                client: {}
            };
        }

        const groupName = item.group.replace(' - группа', '');
        const block0 = item.Block_0_lvl;

        // Инициализируем счетчики для группы если их нет
        if (!monthlyTotals[monthKey].business[groupName]) {
            monthlyTotals[monthKey].business[groupName] = 0;
            monthlyTotals[monthKey].motivation[groupName] = 0;
            monthlyTotals[monthKey].client[groupName] = 0;
        }

        // Считаем общее количество записей по блокам для каждой группы
        if (block0 === 'Влияние на бизнес') {
            monthlyTotals[monthKey].business[groupName]++;
            if (item.score === 1) {
                monthlyData[monthKey].business[groupName] = (monthlyData[monthKey].business[groupName] || 0) + 1;
            }
        } else if (block0 === 'Влияние на мотивацию сотрудника') {
            monthlyTotals[monthKey].motivation[groupName]++;
            if (item.score === 1) {
                monthlyData[monthKey].motivation[groupName] = (monthlyData[monthKey].motivation[groupName] || 0) + 1;
            }
        } else if (block0 === 'Клиентоцентричность') {
            monthlyTotals[monthKey].client[groupName]++;
            if (item.score === 1) {
                monthlyData[monthKey].client[groupName] = (monthlyData[monthKey].client[groupName] || 0) + 1;
            }
        }
    });

    const months = Object.keys(monthlyData).sort();
    const monthLabels = months.map(m => monthlyData[m].label);

    console.log('Месяцы:', monthLabels);
    
    // Функция для создания данных по блоку
    const createBlockData = (blockType) => {
        return groups.map(group => {
            return months.map(month => {
                const issues = monthlyData[month][blockType][group] || 0;
                const total = monthlyTotals[month][blockType][group] || 0;
                
                if (checklistChartsDisplayMode === 'percent') {
                    return total > 0 ? ((issues / total) * 100) : 0;
                } else {
                    return issues;
                }
            });
        });
    };

    return {
        result: {
            labels: monthLabels,
            groups: groups,
            data: createBlockData('business'),
            title: 'Влияние на бизнес',
            totals: months.map(month => {
                return groups.map(group => monthlyTotals[month].business[group] || 0);
            })
        },
        motivation: {
            labels: monthLabels,
            groups: groups,
            data: createBlockData('motivation'),
            title: 'Влияние на мотивацию сотрудника',
            totals: months.map(month => {
                return groups.map(group => monthlyTotals[month].motivation[group] || 0);
            })
        },
        objections: {
            labels: monthLabels,
            groups: groups,
            data: createBlockData('client'),
            title: 'Клиентоцентричность',
            totals: months.map(month => {
                return groups.map(group => monthlyTotals[month].client[group] || 0);
            })
        }
    };
}

// Генерация данных с группировкой по подразделениям (новый режим)
function generateDepartmentGroupedData(data) {
    console.log('=== Группировка по подразделениям ===');
    
    // Получаем уникальные месяцы
    const monthsSet = new Set();
    data.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthsSet.add(monthKey);
    });
    
    const months = Array.from(monthsSet).sort();
    const monthLabels = months.map(monthKey => {
        const [year, month] = monthKey.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    });
    
    console.log('Месяцы:', monthLabels);
    
    // Получаем уникальные группы
    const groups = [...new Set(data.map(item => item.group.replace(' - группа', '')))].sort();
    console.log('Группы:', groups);

    // Группируем данные по подразделениям
    const departmentData = {};
    const departmentTotals = {}; // Для расчета процентов

    // Инициализируем структуру данных
    groups.forEach(group => {
        departmentData[group] = {
            business: {},
            motivation: {},
            client: {}
        };
        departmentTotals[group] = {
            business: {},
            motivation: {},
            client: {}
        };
        
        months.forEach(monthKey => {
            departmentData[group].business[monthKey] = 0;
            departmentData[group].motivation[monthKey] = 0;
            departmentData[group].client[monthKey] = 0;
            departmentTotals[group].business[monthKey] = 0;
            departmentTotals[group].motivation[monthKey] = 0;
            departmentTotals[group].client[monthKey] = 0;
        });
    });

    data.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const groupName = item.group.replace(' - группа', '');
        const block0 = item.Block_0_lvl;

        // Считаем общее количество записей по блокам для каждого месяца
        if (block0 === 'Влияние на бизнес') {
            departmentTotals[groupName].business[monthKey]++;
            if (item.score === 1) {
                departmentData[groupName].business[monthKey]++;
            }
        } else if (block0 === 'Влияние на мотивацию сотрудника') {
            departmentTotals[groupName].motivation[monthKey]++;
            if (item.score === 1) {
                departmentData[groupName].motivation[monthKey]++;
            }
        } else if (block0 === 'Клиентоцентричность') {
            departmentTotals[groupName].client[monthKey]++;
            if (item.score === 1) {
                departmentData[groupName].client[monthKey]++;
            }
        }
    });

    console.log('Данные по подразделениям (проблемы):', departmentData);
    console.log('Общие данные по подразделениям (всего записей):', departmentTotals);
    
    // Функция для создания данных по блоку
    const createBlockData = (blockType) => {
        return months.map(monthKey => {
            return groups.map(group => {
                const issues = departmentData[group][blockType][monthKey] || 0;
                const total = departmentTotals[group][blockType][monthKey] || 0;
                
                if (checklistChartsDisplayMode === 'percent') {
                    return total > 0 ? ((issues / total) * 100) : 0;
                } else {
                    return issues;
                }
            });
        });
    };

    return {
        result: {
            labels: groups, // Теперь по оси X идут подразделения
            groups: monthLabels, // А в легенде - месяцы
            data: createBlockData('business'),
            title: 'Влияние на бизнес',
            totals: months.map(monthKey => {
                return groups.map(group => departmentTotals[group].business[monthKey] || 0);
            })
        },
        motivation: {
            labels: groups, // Теперь по оси X идут подразделения
            groups: monthLabels, // А в легенде - месяцы
            data: createBlockData('motivation'),
            title: 'Влияние на мотивацию сотрудника',
            totals: months.map(monthKey => {
                return groups.map(group => departmentTotals[group].motivation[monthKey] || 0);
            })
        },
        objections: {
            labels: groups, // Теперь по оси X идут подразделения
            groups: monthLabels, // А в легенде - месяцы
            data: createBlockData('client'),
            title: 'Клиентоцентричность',
            totals: months.map(monthKey => {
                return groups.map(group => departmentTotals[group].client[monthKey] || 0);
            })
        }
    };
}

// Генерация тестовых данных для графиков (оставляем для совместимости)
function generateChecklistChartData(filters) {
    const groups = ['Гридчина', 'Мельникова', 'Коровина', 'Сычева', 'Группа 1'];
    const months = ['Март', 'Апрель', 'Май'];

    // Базовые значения для разных типов графиков
    const baseValues = {
        result: [24, 39, 45],
        motivation: [34, 39, 15],
        objections: [3, 18, 20]
    };

    const generateGroupData = (baseVals) => {
        return groups.map(group => {
            return months.map((month, index) => {
                const base = baseVals[index];
                const variation = Math.floor(Math.random() * 20) - 10; // ±10
                return Math.max(0, base + variation);
            });
        });
    };

    return {
        result: {
            labels: months,
            groups: groups,
            data: generateGroupData(baseValues.result),
            title: 'Нацеленность на результат'
        },
        motivation: {
            labels: months,
            groups: groups,
            data: generateGroupData(baseValues.motivation),
            title: 'Мотивация'
        },
        objections: {
            labels: months,
            groups: groups,
            data: generateGroupData(baseValues.objections),
            title: 'Работа с возражениями'
        }
    };
}

// Создание графика "Влияние на бизнес"
function createChecklistResultChart(data) {
    const ctx = document.getElementById('checklistResultChart');
    if (!ctx) {
        console.log('Canvas checklistResultChart не найден');
        return;
    }

    if (checklistResultChart) {
        checklistResultChart.destroy();
    }

    console.log('Создаем график "Влияние на бизнес":', data);

    const datasets = data.groups.map((group, index) => ({
        label: group,
        data: data.data[index] || [],
        backgroundColor: getGroupColor(index, 0.7),
        borderColor: getGroupColor(index),
        borderWidth: 1
    }));

    checklistResultChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: datasets
        },
        options: getChecklistBarChartOptions(data.title, data)
    });
}

// Создание графика "Влияние на мотивацию сотрудника"
function createChecklistMotivationChart(data) {
    const ctx = document.getElementById('checklistMotivationChart');
    if (!ctx) {
        console.log('Canvas checklistMotivationChart не найден');
        return;
    }

    if (checklistMotivationChart) {
        checklistMotivationChart.destroy();
    }

    console.log('Создаем график "Влияние на мотивацию сотрудника":', data);

    const datasets = data.groups.map((group, index) => ({
        label: group,
        data: data.data[index] || [],
        backgroundColor: getGroupColor(index, 0.7),
        borderColor: getGroupColor(index),
        borderWidth: 1
    }));

    checklistMotivationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: datasets
        },
        options: getChecklistBarChartOptions(data.title, data)
    });
}

// Создание графика "Клиентоцентричность"
function createChecklistObjectionsChart(data) {
    const ctx = document.getElementById('checklistObjectionsChart');
    if (!ctx) {
        console.log('Canvas checklistObjectionsChart не найден');
        return;
    }

    if (checklistObjectionsChart) {
        checklistObjectionsChart.destroy();
    }

    console.log('Создаем график "Клиентоцентричность":', data);

    const datasets = data.groups.map((group, index) => ({
        label: group,
        data: data.data[index] || [],
        backgroundColor: getGroupColor(index, 0.7),
        borderColor: getGroupColor(index),
        borderWidth: 1
    }));

    checklistObjectionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: datasets
        },
        options: getChecklistBarChartOptions(data.title, data)
    });
}



// Получение цвета для группы
function getGroupColor(index, alpha = 1) {
    const colors = [
        '#E74C3C', // Красный
        '#3498DB', // Синий
        '#2ECC71', // Зеленый
        '#F39C12', // Оранжевый
        '#9B59B6'  // Фиолетовый
    ];

    const color = colors[index % colors.length];

    if (alpha < 1) {
        // Конвертируем hex в rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return color;
}

// Общие настройки для линейных графиков чек-листов (оставляем для совместимости)
function getChecklistChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#ddd',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Период'
                },
                grid: {
                    display: false
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Количество'
                },
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };
}

// Настройки для столбчатых графиков чек-листов
function getChecklistBarChartOptions(title, data = null) {
    const isPercent = checklistChartsDisplayMode === 'percent';
    const isDepartmentGrouping = checklistChartsGroupingMode === 'departments';
    
    // Рассчитываем динамический максимум для процентов
    let maxValue = undefined;
    if (isPercent && data && data.data) {
        const allValues = data.data.flat().filter(val => val > 0);
        if (allValues.length > 0) {
            const avgValue = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
            maxValue = Math.min(100, Math.max(50, Math.ceil(avgValue * 2.5 / 10) * 10)); // Округляем до 10
        } else {
            maxValue = 100;
        }
    }
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#ddd',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        if (isPercent) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                        } else {
                            return context.dataset.label + ': ' + context.parsed.y + ' проблем';
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: isDepartmentGrouping ? 'Подразделение' : 'Месяц',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                grid: {
                    display: false
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: isPercent ? 'Процент ошибок (%)' : 'Количество проблем',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                beginAtZero: true,
                max: isPercent ? maxValue : undefined,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    stepSize: isPercent ? 10 : 1,
                    callback: function(value) {
                        return isPercent ? value + '%' : value;
                    }
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        }
    };
}



// Переключение режима отображения графиков
function toggleChecklistChartsMode(mode) {
    if (mode) {
        checklistChartsDisplayMode = mode;
    } else {
        checklistChartsDisplayMode = checklistChartsDisplayMode === 'count' ? 'percent' : 'count';
    }
    
    console.log('Переключен режим отображения графиков на:', checklistChartsDisplayMode);
    
    // Обновляем переключатель
    updateToggleSwitch();
    
    // Перерисовываем графики
    initChecklistCharts();
}

// Обновление внешнего вида переключателя
function updateToggleSwitch() {
    const toggleSwitch = document.getElementById('checklistChartsToggle');
    if (!toggleSwitch) return;
    
    const options = toggleSwitch.querySelectorAll('.toggle-option');
    
    // Убираем активный класс со всех опций
    options.forEach(option => option.classList.remove('active'));
    
    // Добавляем активный класс к текущей опции
    const activeOption = toggleSwitch.querySelector(`[data-mode="${checklistChartsDisplayMode}"]`);
    if (activeOption) {
        activeOption.classList.add('active');
    }
    
    // Обновляем позицию слайдера
    toggleSwitch.setAttribute('data-active', checklistChartsDisplayMode);
}

// Инициализация переключателя режима отображения
function initToggleSwitch() {
    const toggleSwitch = document.getElementById('checklistChartsToggle');
    if (!toggleSwitch) return;
    
    console.log('Инициализируем переключатель режима графиков...');
    
    // Добавляем обработчики кликов на опции
    const options = toggleSwitch.querySelectorAll('.toggle-option');
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const mode = this.getAttribute('data-mode');
            console.log('Выбран режим:', mode);
            toggleChecklistChartsMode(mode);
        });
    });
    
    // Устанавливаем начальное состояние
    updateToggleSwitch();
}

// Инициализация переключателя группировки
function initGroupingToggleSwitch() {
    const toggleSwitch = document.getElementById('checklistGroupingToggle');
    if (!toggleSwitch) return;
    
    console.log('Инициализируем переключатель группировки графиков...');
    
    // Добавляем обработчики кликов на опции
    const options = toggleSwitch.querySelectorAll('.toggle-option');
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const mode = this.getAttribute('data-mode');
            console.log('Выбран режим группировки:', mode);
            toggleChecklistGroupingMode(mode);
        });
    });
    
    // Устанавливаем начальное состояние
    updateGroupingToggleSwitch();
}

// Переключение режима группировки графиков
function toggleChecklistGroupingMode(mode) {
    if (mode) {
        checklistChartsGroupingMode = mode;
    } else {
        checklistChartsGroupingMode = checklistChartsGroupingMode === 'months' ? 'departments' : 'months';
    }
    
    console.log('Переключен режим группировки графиков на:', checklistChartsGroupingMode);
    
    // Обновляем переключатель
    updateGroupingToggleSwitch();
    
    // Перерисовываем графики
    initChecklistCharts();
}

// Обновление внешнего вида переключателя группировки
function updateGroupingToggleSwitch() {
    const toggleSwitch = document.getElementById('checklistGroupingToggle');
    if (!toggleSwitch) return;
    
    const options = toggleSwitch.querySelectorAll('.toggle-option');
    
    // Убираем активный класс со всех опций
    options.forEach(option => option.classList.remove('active'));
    
    // Добавляем активный класс к текущей опции
    const activeOption = toggleSwitch.querySelector(`[data-mode="${checklistChartsGroupingMode}"]`);
    if (activeOption) {
        activeOption.classList.add('active');
    }
    
    // Обновляем позицию слайдера
    toggleSwitch.setAttribute('data-active', checklistChartsGroupingMode);
    
    console.log('Обновлен переключатель группировки:', checklistChartsGroupingMode);
}

// Обновление графиков при изменении фильтров
function updateChecklistDynamicsCharts() {
    console.log('Обновление динамических графиков чек-листов...');
    initChecklistCharts();
}

// Экспорт функций для использования в других модулях
if (typeof window !== 'undefined') {
    window.initChecklistCharts = initChecklistCharts;
    window.updateChecklistDynamicsCharts = updateChecklistDynamicsCharts;
    window.toggleChecklistChartsMode = toggleChecklistChartsMode;
    window.toggleChecklistGroupingMode = toggleChecklistGroupingMode;
    window.initToggleSwitch = initToggleSwitch;
    window.updateToggleSwitch = updateToggleSwitch;
    window.initGroupingToggleSwitch = initGroupingToggleSwitch;
    window.updateGroupingToggleSwitch = updateGroupingToggleSwitch;
}