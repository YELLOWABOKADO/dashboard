/**
 * Модуль для работы с графиками чек-листов
 */

// Глобальные переменные для хранения экземпляров графиков
let checklistResultChart = null;
let checklistMotivationChart = null;
let checklistObjectionsChart = null;

// Инициализация графиков чек-листов
function initChecklistCharts() {
    console.log('=== Инициализация графиков чек-листов ===');

    // Проверяем наличие данных
    if (typeof checklistFilteredData === 'undefined' || !checklistFilteredData || checklistFilteredData.length === 0) {
        console.log('Нет данных для графиков чек-листов');
        return;
    }

    // Создаем данные на основе реальных данных
    const chartData = generateRealChecklistChartData(checklistFilteredData);

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

// Генерация данных на основе реальных данных с месячной агрегацией
function generateRealChecklistChartData(data) {
    console.log('Генерируем месячные данные графиков из', data.length, 'записей');

    // Фильтруем только проблемы (score = 1)
    const issuesData = data.filter(item => item.score === 1);
    console.log('Найдено проблем:', issuesData.length);

    if (issuesData.length === 0) {
        console.log('Нет проблем для отображения, используем тестовые данные');
        return generateChecklistChartData({});
    }

    // Получаем уникальные группы
    const groups = [...new Set(issuesData.map(item => item.group.replace(' - группа', '')))].sort();
    console.log('Группы:', groups);

    // Группируем данные по месяцам
    const monthlyData = {};
    issuesData.forEach(item => {
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

        const groupName = item.group.replace(' - группа', '');
        const block0 = item.Block_0_lvl;

        // Распределяем по блокам 0 уровня
        if (block0 === 'Влияние на бизнес') {
            monthlyData[monthKey].business[groupName] = (monthlyData[monthKey].business[groupName] || 0) + 1;
        } else if (block0 === 'Влияние на мотивацию сотрудника') {
            monthlyData[monthKey].motivation[groupName] = (monthlyData[monthKey].motivation[groupName] || 0) + 1;
        } else if (block0 === 'Клиентоцентричность') {
            monthlyData[monthKey].client[groupName] = (monthlyData[monthKey].client[groupName] || 0) + 1;
        }
    });

    const months = Object.keys(monthlyData).sort();
    const monthLabels = months.map(m => monthlyData[m].label);

    console.log('Месяцы:', monthLabels);
    console.log('Данные по месяцам:', monthlyData);

    // Функция для создания данных по блоку
    const createBlockData = (blockType) => {
        return groups.map(group => {
            return months.map(month => {
                return monthlyData[month][blockType][group] || 0;
            });
        });
    };

    return {
        result: {
            labels: monthLabels,
            groups: groups,
            data: createBlockData('business'),
            title: 'Влияние на бизнес'
        },
        motivation: {
            labels: monthLabels,
            groups: groups,
            data: createBlockData('motivation'),
            title: 'Влияние на мотивацию сотрудника'
        },
        objections: {
            labels: monthLabels,
            groups: groups,
            data: createBlockData('client'),
            title: 'Клиентоцентричность'
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
    if (!ctx) return;

    if (checklistResultChart) {
        checklistResultChart.destroy();
    }

    const datasets = data.groups.map((group, index) => ({
        label: group,
        data: data.data[index],
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
        options: getChecklistBarChartOptions(data.title)
    });
}

// Создание графика "Влияние на мотивацию сотрудника"
function createChecklistMotivationChart(data) {
    const ctx = document.getElementById('checklistMotivationChart');
    if (!ctx) return;

    if (checklistMotivationChart) {
        checklistMotivationChart.destroy();
    }

    const datasets = data.groups.map((group, index) => ({
        label: group,
        data: data.data[index],
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
        options: getChecklistBarChartOptions(data.title)
    });
}

// Создание графика "Клиентоцентричность"
function createChecklistObjectionsChart(data) {
    const ctx = document.getElementById('checklistObjectionsChart');
    if (!ctx) return;

    if (checklistObjectionsChart) {
        checklistObjectionsChart.destroy();
    }

    const datasets = data.groups.map((group, index) => ({
        label: group,
        data: data.data[index],
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
        options: getChecklistBarChartOptions(data.title)
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
function getChecklistBarChartOptions(title) {
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
                        return context.dataset.label + ': ' + context.parsed.y + ' проблем';
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Месяц',
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
                    text: 'Количество проблем',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    stepSize: 1
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        }
    };
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
}