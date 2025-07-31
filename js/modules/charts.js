/**
 * Модуль для работы с графиками
 */

// Функция для определения контрастного цвета текста
function getContrastColor(hexColor) {
    // Убираем # если есть
    const hex = hexColor.replace('#', '');
    
    // Конвертируем в RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Вычисляем яркость по формуле
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Возвращаем черный для светлых цветов, белый для темных
    return brightness > 128 ? '#000000' : '#ffffff';
}

// Инициализация Chart.js графиков
function initDepartmentCharts(departmentsData) {
    console.log('=== Инициализация графиков подразделений ===');
    
    if (!departmentsData || Object.keys(departmentsData).length === 0) {
        console.log('Нет данных для графиков');
        return;
    }

    // Подготавливаем данные для графиков
    const chartData = prepareDepartmentChartData(departmentsData);
    
    // Создаем графики
    createPieChart(chartData);
    createDeviationsBarChart(chartData);
    createPercentageBarChart(chartData);
}

// Подготовка данных для графиков
function prepareDepartmentChartData(departmentsData) {
    const colors = [
        '#E74C3C', // Красный (темнее)
        '#3498DB', // Синий
        '#2ECC71', // Зеленый
        '#F39C12', // Оранжевый
        '#9B59B6', // Фиолетовый
        '#1ABC9C', // Бирюзовый
        '#34495E', // Темно-серый
        '#E67E22', // Темно-оранжевый
        '#8E44AD'  // Темно-фиолетовый
    ];

    // Создаем массив данных для сортировки
    const dataArray = [];
    Object.keys(departmentsData).forEach((deptKey) => {
        const dept = departmentsData[deptKey];
        if (dept.current) {
            dataArray.push({
                name: dept.name.replace(' - группа', ''),
                deviations: dept.current.deviations,
                percentage: dept.current.percentage
            });
        }
    });

    // Сортируем по убыванию процента отклонений
    dataArray.sort((a, b) => b.percentage - a.percentage);

    // Извлекаем отсортированные данные
    const departments = dataArray.map(item => item.name);
    const deviations = dataArray.map(item => item.deviations);
    const percentages = dataArray.map(item => item.percentage);

    return {
        departments,
        deviations,
        percentages,
        colors: colors.slice(0, departments.length)
    };
}

// Создание круговой диаграммы "Доля отклонений по КЦ"
function createPieChart(chartData) {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    // Уничтожаем предыдущий график если есть
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
    }

    window.pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.departments,
            datasets: [{
                data: chartData.percentages,
                backgroundColor: chartData.colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: true,
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: (value, context) => {
                        return value.toFixed(2) + '%';
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toFixed(2) + '%';
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'datalabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                chart.data.datasets.forEach((dataset, i) => {
                    const meta = chart.getDatasetMeta(i);
                    meta.data.forEach((element, index) => {
                        const value = dataset.data[index];
                        // Показываем текст только для секторов больше 1%
                        if (value > 1) {
                            const position = element.tooltipPosition();
                            const backgroundColor = dataset.backgroundColor[index];
                            
                            // Определяем контрастный цвет для текста
                            const textColor = getContrastColor(backgroundColor);
                            
                            // Настройки текста
                            ctx.font = 'bold 14px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            // Добавляем тень для лучшей читаемости
                            ctx.shadowColor = textColor === '#ffffff' ? '#000000' : '#ffffff';
                            ctx.shadowBlur = 3;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            // Основной текст
                            ctx.fillStyle = textColor;
                            ctx.fillText(value.toFixed(2) + '%', position.x, position.y);
                            
                            // Сбрасываем тень
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                            ctx.shadowOffsetX = 0;
                            ctx.shadowOffsetY = 0;
                        }
                    });
                });
            }
        }]
    });
    
    // Создаем кастомную легенду
    createCustomLegend(chartData);
}

// Создание кастомной легенды для круговой диаграммы
function createCustomLegend(chartData) {
    const legendContainer = document.getElementById('pieChartLegend');
    if (!legendContainer) return;
    
    let legendHTML = '';
    chartData.departments.forEach((department, index) => {
        const color = chartData.colors[index];
        const percentage = chartData.percentages[index];
        
        legendHTML += `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${color};"></div>
                <span>${department}: ${percentage.toFixed(2)}%</span>
            </div>
        `;
    });
    
    legendContainer.innerHTML = legendHTML;
}

// Создание столбчатой диаграммы "Количество отклонений по КЦ"
function createDeviationsBarChart(chartData) {
    const ctx = document.getElementById('deviationsBarChart');
    if (!ctx) return;

    // Сортируем данные по убыванию для столбчатой диаграммы
    const sortedData = chartData.departments.map((dept, index) => ({
        department: dept,
        deviations: chartData.deviations[index]
    })).sort((a, b) => b.deviations - a.deviations);

    const sortedDepartments = sortedData.map(item => item.department);
    const sortedDeviations = sortedData.map(item => item.deviations);

    // Вычисляем диапазон для обрезки диаграммы
    const minValue = Math.min(...sortedDeviations);
    const maxValue = Math.max(...sortedDeviations);
    // Обрезаем от 70% минимального значения, но не меньше 0
    const cutoffValue = Math.max(0, Math.floor(minValue * 0.7));

    // Уничтожаем предыдущий график если есть
    if (window.deviationsBarChartInstance) {
        window.deviationsBarChartInstance.destroy();
    }

    window.deviationsBarChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedDepartments,
            datasets: [{
                data: sortedDeviations,
                backgroundColor: '#FFA726',
                borderColor: '#FF9800',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Делаем диаграмму горизонтальной
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Отклонений: ' + context.parsed.x.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: cutoffValue, // Начинаем от 70% минимального значения
                    max: maxValue * 1.1, // Увеличиваем отступ для размещения текста
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'datalabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                const cutoff = cutoffValue;
                
                chart.data.datasets.forEach((dataset, i) => {
                    const meta = chart.getDatasetMeta(i);
                    meta.data.forEach((element, index) => {
                        const value = dataset.data[index];
                        if (value > 0) {
                            // Вычисляем позицию для размещения текста в центре видимой части столбца
                            const cutoffPixel = chart.scales.x.getPixelForValue(cutoff);
                            const valuePixel = chart.scales.x.getPixelForValue(value);
                            const textX = cutoffPixel + (valuePixel - cutoffPixel) / 2;
                            
                            ctx.fillStyle = '#fff';
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            // Добавляем тень для лучшей читаемости
                            ctx.shadowColor = '#000';
                            ctx.shadowBlur = 2;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            // Размещаем текст в центре видимой части столбца
                            ctx.fillText(value.toLocaleString(), textX, element.y);
                            
                            // Сбрасываем тень
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                            ctx.shadowOffsetX = 0;
                            ctx.shadowOffsetY = 0;
                        }
                    });
                });
            }
        }]
    });
}

// Создание столбчатой диаграммы "Процент отклонений по КЦ"
function createPercentageBarChart(chartData) {
    const ctx = document.getElementById('percentageBarChart');
    if (!ctx) return;

    // Данные уже отсортированы в prepareDepartmentChartData по убыванию процентов

    // Вычисляем диапазон для обрезки диаграммы
    const minValue = Math.min(...chartData.percentages);
    const maxValue = Math.max(...chartData.percentages);
    // Обрезаем от 70% минимального значения, но не меньше 0
    const cutoffValue = Math.max(0, minValue * 0.7);

    // Уничтожаем предыдущий график если есть
    if (window.percentageBarChartInstance) {
        window.percentageBarChartInstance.destroy();
    }

    window.percentageBarChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.departments,
            datasets: [{
                data: chartData.percentages,
                backgroundColor: '#FFA726',
                borderColor: '#FF9800',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Делаем диаграмму горизонтальной
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Процент: ' + context.parsed.x.toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: cutoffValue, // 70% от минимального значения
                    max: maxValue * 1.1, // Увеличиваем отступ для размещения текста
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + '%';
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'datalabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                const cutoff = cutoffValue;
                
                chart.data.datasets.forEach((dataset, i) => {
                    const meta = chart.getDatasetMeta(i);
                    meta.data.forEach((element, index) => {
                        const value = dataset.data[index];
                        if (value > 0) {
                            // Вычисляем позицию для размещения текста в центре видимой части столбца
                            const cutoffPixel = chart.scales.x.getPixelForValue(cutoff);
                            const valuePixel = chart.scales.x.getPixelForValue(value);
                            const textX = cutoffPixel + (valuePixel - cutoffPixel) / 2;
                            
                            ctx.fillStyle = '#fff';
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            // Добавляем тень для лучшей читаемости
                            ctx.shadowColor = '#000';
                            ctx.shadowBlur = 2;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            // Размещаем текст в центре видимой части столбца
                            ctx.fillText(value.toFixed(2) + '%', textX, element.y);
                            
                            // Сбрасываем тень
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                            ctx.shadowOffsetX = 0;
                            ctx.shadowOffsetY = 0;
                        }
                    });
                });
            }
        }]
    });
}

// Инициализация графиков для сотрудников
function initEmployeeCharts(employeesData) {
    console.log('=== Инициализация графиков сотрудников ===');
    
    if (!employeesData || !employeesData.current || employeesData.current.length === 0) {
        console.log('Нет данных для графиков сотрудников');
        return;
    }

    // Подготавливаем данные для графиков
    const chartData = prepareEmployeeChartData(employeesData);
    
    // Создаем графики
    createEmployeePieChart(chartData);
    createEmployeeDeviationsBarChart(chartData);
    createEmployeePercentageBarChart(chartData);
}

// Подготовка данных для графиков сотрудников
function prepareEmployeeChartData(employeesData) {
    const colors = [
        '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', 
        '#1ABC9C', '#34495E', '#E67E22', '#8E44AD', '#95A5A6',
        '#F1C40F', '#E91E63', '#FF5722', '#607D8B', '#795548'
    ];

    // Создаем массив данных для сортировки (берем только первые 10 для читаемости)
    const dataArray = employeesData.current
        .map(emp => ({
            name: emp.name,
            deviations: emp.deviations,
            percentage: emp.percentage
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10); // Ограничиваем 10 сотрудниками

    // Извлекаем отсортированные данные
    const employees = dataArray.map(item => item.name);
    const deviations = dataArray.map(item => item.deviations);
    const percentages = dataArray.map(item => item.percentage);

    return {
        employees,
        deviations,
        percentages,
        colors: colors.slice(0, employees.length)
    };
}

// Создание круговой диаграммы для сотрудников
function createEmployeePieChart(chartData) {
    const ctx = document.getElementById('employeesPieChart');
    if (!ctx) return;

    // Уничтожаем предыдущий график если есть
    if (window.employeesPieChartInstance) {
        window.employeesPieChartInstance.destroy();
    }

    window.employeesPieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.employees,
            datasets: [{
                data: chartData.percentages,
                backgroundColor: chartData.colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toFixed(2) + '%';
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'datalabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                chart.data.datasets.forEach((dataset, i) => {
                    const meta = chart.getDatasetMeta(i);
                    meta.data.forEach((element, index) => {
                        const value = dataset.data[index];
                        // Показываем текст только для секторов больше 1%
                        if (value > 1) {
                            const position = element.tooltipPosition();
                            const backgroundColor = dataset.backgroundColor[index];
                            
                            // Определяем контрастный цвет для текста
                            const textColor = getContrastColor(backgroundColor);
                            
                            // Настройки текста
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            // Добавляем тень для лучшей читаемости
                            ctx.shadowColor = textColor === '#ffffff' ? '#000000' : '#ffffff';
                            ctx.shadowBlur = 2;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            // Основной текст
                            ctx.fillStyle = textColor;
                            ctx.fillText(value.toFixed(2) + '%', position.x, position.y);
                            
                            // Сбрасываем тень
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                            ctx.shadowOffsetX = 0;
                            ctx.shadowOffsetY = 0;
                        }
                    });
                });
            }
        }]
    });
    
    // Создаем кастомную легенду
    createEmployeeCustomLegend(chartData);
}

// Создание кастомной легенды для сотрудников
function createEmployeeCustomLegend(chartData) {
    const legendContainer = document.getElementById('employeesPieChartLegend');
    if (!legendContainer) return;
    
    let legendHTML = '';
    chartData.employees.forEach((employee, index) => {
        const color = chartData.colors[index];
        const percentage = chartData.percentages[index];
        
        legendHTML += `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${color};"></div>
                <span>${employee}: ${percentage.toFixed(2)}%</span>
            </div>
        `;
    });
    
    legendContainer.innerHTML = legendHTML;
}

// Создание столбчатой диаграммы "Количество отклонений" для сотрудников
function createEmployeeDeviationsBarChart(chartData) {
    const ctx = document.getElementById('employeesDeviationsBarChart');
    if (!ctx) return;

    // Сортируем данные по убыванию для столбчатой диаграммы
    const sortedData = chartData.employees.map((emp, index) => ({
        employee: emp,
        deviations: chartData.deviations[index]
    })).sort((a, b) => b.deviations - a.deviations);

    const sortedEmployees = sortedData.map(item => item.employee);
    const sortedDeviations = sortedData.map(item => item.deviations);

    // Вычисляем диапазон для обрезки диаграммы
    const minValue = Math.min(...sortedDeviations);
    const maxValue = Math.max(...sortedDeviations);
    // Обрезаем от 70% минимального значения, но не меньше 0
    const cutoffValue = Math.max(0, Math.floor(minValue * 0.7));

    // Уничтожаем предыдущий график если есть
    if (window.employeesDeviationsBarChartInstance) {
        window.employeesDeviationsBarChartInstance.destroy();
    }

    window.employeesDeviationsBarChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedEmployees,
            datasets: [{
                data: sortedDeviations,
                backgroundColor: '#FFA726',
                borderColor: '#FF9800',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Делаем диаграмму горизонтальной
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Отклонений: ' + context.parsed.x.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: cutoffValue, // Начинаем от 70% минимального значения
                    max: maxValue * 1.1, // Увеличиваем отступ для размещения текста
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'datalabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                const cutoff = cutoffValue;
                
                chart.data.datasets.forEach((dataset, i) => {
                    const meta = chart.getDatasetMeta(i);
                    meta.data.forEach((element, index) => {
                        const value = dataset.data[index];
                        if (value > 0) {
                            // Вычисляем позицию для размещения текста в центре видимой части столбца
                            const cutoffPixel = chart.scales.x.getPixelForValue(cutoff);
                            const valuePixel = chart.scales.x.getPixelForValue(value);
                            const textX = cutoffPixel + (valuePixel - cutoffPixel) / 2;
                            
                            ctx.fillStyle = '#fff';
                            ctx.font = 'bold 10px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            // Добавляем тень для лучшей читаемости
                            ctx.shadowColor = '#000';
                            ctx.shadowBlur = 2;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            // Размещаем текст в центре видимой части столбца
                            ctx.fillText(value.toLocaleString(), textX, element.y);
                            
                            // Сбрасываем тень
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                            ctx.shadowOffsetX = 0;
                            ctx.shadowOffsetY = 0;
                        }
                    });
                });
            }
        }]
    });
}

// Создание столбчатой диаграммы "Процент отклонений" для сотрудников
function createEmployeePercentageBarChart(chartData) {
    const ctx = document.getElementById('employeesPercentageBarChart');
    if (!ctx) return;

    // Данные уже отсортированы в prepareEmployeeChartData по убыванию процентов

    // Вычисляем диапазон для обрезки диаграммы
    const minValue = Math.min(...chartData.percentages);
    const maxValue = Math.max(...chartData.percentages);
    // Обрезаем от 70% минимального значения, но не меньше 0
    const cutoffValue = Math.max(0, minValue * 0.7);

    // Уничтожаем предыдущий график если есть
    if (window.employeesPercentageBarChartInstance) {
        window.employeesPercentageBarChartInstance.destroy();
    }

    window.employeesPercentageBarChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.employees,
            datasets: [{
                data: chartData.percentages,
                backgroundColor: '#FFA726',
                borderColor: '#FF9800',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Делаем диаграмму горизонтальной
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Процент: ' + context.parsed.x.toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: cutoffValue, // Начинаем от 70% минимального значения
                    max: maxValue * 1.1, // Увеличиваем отступ для размещения текста
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + '%';
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'datalabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                const cutoff = cutoffValue;
                
                chart.data.datasets.forEach((dataset, i) => {
                    const meta = chart.getDatasetMeta(i);
                    meta.data.forEach((element, index) => {
                        const value = dataset.data[index];
                        if (value > 0) {
                            // Вычисляем позицию для размещения текста в центре видимой части столбца
                            const cutoffPixel = chart.scales.x.getPixelForValue(cutoff);
                            const valuePixel = chart.scales.x.getPixelForValue(value);
                            const textX = cutoffPixel + (valuePixel - cutoffPixel) / 2;
                            
                            ctx.fillStyle = '#fff';
                            ctx.font = 'bold 10px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            // Добавляем тень для лучшей читаемости
                            ctx.shadowColor = '#000';
                            ctx.shadowBlur = 2;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            // Размещаем текст в центре видимой части столбца
                            ctx.fillText(value.toFixed(2) + '%', textX, element.y);
                            
                            // Сбрасываем тень
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                            ctx.shadowOffsetX = 0;
                            ctx.shadowOffsetY = 0;
                        }
                    });
                });
            }
        }]
    });
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.getContrastColor = getContrastColor;
    window.initDepartmentCharts = initDepartmentCharts;
    window.prepareDepartmentChartData = prepareDepartmentChartData;
    window.createPieChart = createPieChart;
    window.createCustomLegend = createCustomLegend;
    window.createDeviationsBarChart = createDeviationsBarChart;
    window.createPercentageBarChart = createPercentageBarChart;
    window.initEmployeeCharts = initEmployeeCharts;
    window.prepareEmployeeChartData = prepareEmployeeChartData;
    window.createEmployeePieChart = createEmployeePieChart;
    window.createEmployeeCustomLegend = createEmployeeCustomLegend;
    window.createEmployeeDeviationsBarChart = createEmployeeDeviationsBarChart;
    window.createEmployeePercentageBarChart = createEmployeePercentageBarChart;
    console.log('=== charts.js загружен ===');
}