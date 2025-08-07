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
    
    // Сохраняем данные для переключения
    window.departmentsChartData = chartData;
    
    // Создаем графики
    createPieChart(chartData);
    createDepartmentsBarChart(chartData, 'count'); // По умолчанию показываем количество
    
    // Инициализируем обработчики переключателя
    initChartToggle('departments');
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

// Создание второй круговой диаграммы "Топ отклонений" для подразделений
function createDepartmentsTopChart(chartData) {
    const ctx = document.getElementById('departmentsTopChart');
    if (!ctx) return;

    // Уничтожаем предыдущий график если есть
    if (window.departmentsTopChartInstance) {
        window.departmentsTopChartInstance.destroy();
    }

    // Берем топ-5 подразделений по количеству отклонений
    const topData = chartData.departments.map((dept, index) => ({
        name: dept,
        deviations: chartData.deviations[index],
        percentage: chartData.percentages[index],
        color: chartData.colors[index]
    })).sort((a, b) => b.deviations - a.deviations).slice(0, 5);

    window.departmentsTopChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: topData.map(item => item.name),
            datasets: [{
                data: topData.map(item => item.deviations),
                backgroundColor: topData.map(item => item.color),
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
                            return context.label + ': ' + context.parsed.toLocaleString() + ' отклонений';
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
                        if (value > 0) {
                            const position = element.tooltipPosition();
                            const backgroundColor = dataset.backgroundColor[index];
                            
                            const textColor = getContrastColor(backgroundColor);
                            
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            ctx.shadowColor = textColor === '#ffffff' ? '#000000' : '#ffffff';
                            ctx.shadowBlur = 3;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            ctx.fillStyle = textColor;
                            ctx.fillText(value.toLocaleString(), position.x, position.y);
                            
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
    createDepartmentsTopLegend(topData);
}

// Создание кастомной легенды для топ диаграммы подразделений
function createDepartmentsTopLegend(topData) {
    const legendContainer = document.getElementById('departmentsTopChartLegend');
    if (!legendContainer) return;
    
    let legendHTML = '';
    topData.forEach((item, index) => {
        legendHTML += `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${item.color};"></div>
                <span>${item.name}: ${item.deviations.toLocaleString()}</span>
            </div>
        `;
    });
    
    legendContainer.innerHTML = legendHTML;
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
    
    // Сохраняем данные для переключения
    window.employeesChartData = chartData;
    
    // Создаем графики
    createEmployeePieChart(chartData);
    createEmployeesBarChart(chartData, 'count'); // По умолчанию показываем количество
    
    // Инициализируем обработчики переключателя
    initChartToggle('employees');
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

// Создание второй круговой диаграммы "Топ отклонений" для сотрудников
function createEmployeesTopChart(chartData) {
    const ctx = document.getElementById('employeesTopChart');
    if (!ctx) return;

    // Уничтожаем предыдущий график если есть
    if (window.employeesTopChartInstance) {
        window.employeesTopChartInstance.destroy();
    }

    // Берем топ-5 сотрудников по количеству отклонений
    const topData = chartData.employees.map((emp, index) => ({
        name: emp,
        deviations: chartData.deviations[index],
        percentage: chartData.percentages[index],
        color: chartData.colors[index]
    })).sort((a, b) => b.deviations - a.deviations).slice(0, 5);

    window.employeesTopChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: topData.map(item => item.name),
            datasets: [{
                data: topData.map(item => item.deviations),
                backgroundColor: topData.map(item => item.color),
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
                            return context.label + ': ' + context.parsed.toLocaleString() + ' отклонений';
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
                        if (value > 0) {
                            const position = element.tooltipPosition();
                            const backgroundColor = dataset.backgroundColor[index];
                            
                            const textColor = getContrastColor(backgroundColor);
                            
                            ctx.font = 'bold 10px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            ctx.shadowColor = textColor === '#ffffff' ? '#000000' : '#ffffff';
                            ctx.shadowBlur = 2;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            ctx.fillStyle = textColor;
                            ctx.fillText(value.toLocaleString(), position.x, position.y);
                            
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
    createEmployeesTopLegend(topData);
}

// Создание кастомной легенды для топ диаграммы сотрудников
function createEmployeesTopLegend(topData) {
    const legendContainer = document.getElementById('employeesTopChartLegend');
    if (!legendContainer) return;
    
    let legendHTML = '';
    topData.forEach((item, index) => {
        legendHTML += `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${item.color};"></div>
                <span>${item.name}: ${item.deviations.toLocaleString()}</span>
            </div>
        `;
    });
    
    legendContainer.innerHTML = legendHTML;
}



// Инициализация обработчиков переключателя
function initChartToggle(target) {
    console.log('initChartToggle вызвана для:', target);
    
    const toggleButtons = document.querySelectorAll(`.toggle-btn[data-target="${target}"]`);
    console.log('Найдено кнопок переключателя:', toggleButtons.length);
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mode = this.dataset.mode;
            const target = this.dataset.target;
            
            // Обновляем активную кнопку
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Обновляем заголовок
            const title = mode === 'count' ? 'Количество отклонений' : 'Процент отклонений';
            document.getElementById(`${target}BarChartTitle`).textContent = title;
            
            // Перерисовываем диаграмму
            if (target === 'departments' && window.departmentsChartData) {
                createDepartmentsBarChart(window.departmentsChartData, mode);
            } else if (target === 'employees' && window.employeesChartData) {
                createEmployeesBarChart(window.employeesChartData, mode);
            }
        });
    });
}

// Объединенная функция для создания столбчатой диаграммы подразделений
function createDepartmentsBarChart(chartData, mode) {
    console.log('createDepartmentsBarChart вызвана:', { chartData, mode });
    
    const ctx = document.getElementById('departmentsBarChart');
    if (!ctx) {
        console.error('Canvas departmentsBarChart не найден!');
        return;
    }
    
    console.log('Canvas найден, создаем диаграмму...');

    // Уничтожаем предыдущий график если есть
    if (window.departmentsBarChartInstance) {
        window.departmentsBarChartInstance.destroy();
    }

    const isCountMode = mode === 'count';
    const data = isCountMode ? chartData.deviations : chartData.percentages;
    const labels = chartData.departments;

    // Сортируем данные по убыванию
    const sortedData = labels.map((dept, index) => ({
        department: dept,
        value: data[index]
    })).sort((a, b) => b.value - a.value);

    const sortedLabels = sortedData.map(item => item.department);
    const sortedValues = sortedData.map(item => item.value);

    // Вычисляем диапазон для обрезки диаграммы
    const minValue = Math.min(...sortedValues);
    const maxValue = Math.max(...sortedValues);
    const cutoffValue = Math.max(0, isCountMode ? Math.floor(minValue * 0.7) : minValue * 0.7);

    window.departmentsBarChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedLabels,
            datasets: [{
                data: sortedValues,
                backgroundColor: '#FFA726',
                borderColor: '#FF9800',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const suffix = isCountMode ? '' : '%';
                            const value = isCountMode ? context.parsed.x.toLocaleString() : context.parsed.x.toFixed(2);
                            return (isCountMode ? 'Отклонений: ' : 'Процент: ') + value + suffix;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: cutoffValue,
                    max: maxValue * 1.1,
                    ticks: {
                        callback: function(value) {
                            return isCountMode ? value.toLocaleString() : value.toFixed(1) + '%';
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
                            const cutoffPixel = chart.scales.x.getPixelForValue(cutoff);
                            const valuePixel = chart.scales.x.getPixelForValue(value);
                            const textX = cutoffPixel + (valuePixel - cutoffPixel) / 2;
                            
                            ctx.fillStyle = '#fff';
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            ctx.shadowColor = '#000';
                            ctx.shadowBlur = 2;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            const displayValue = isCountMode ? value.toLocaleString() : value.toFixed(2) + '%';
                            ctx.fillText(displayValue, textX, element.y);
                            
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

// Объединенная функция для создания столбчатой диаграммы сотрудников
function createEmployeesBarChart(chartData, mode) {
    console.log('createEmployeesBarChart вызвана:', { chartData, mode });
    
    const ctx = document.getElementById('employeesBarChart');
    if (!ctx) {
        console.error('Canvas employeesBarChart не найден!');
        return;
    }
    
    console.log('Canvas найден, создаем диаграмму...');

    // Уничтожаем предыдущий график если есть
    if (window.employeesBarChartInstance) {
        window.employeesBarChartInstance.destroy();
    }

    const isCountMode = mode === 'count';
    const data = isCountMode ? chartData.deviations : chartData.percentages;
    const labels = chartData.employees;

    // Сортируем данные по убыванию
    const sortedData = labels.map((emp, index) => ({
        employee: emp,
        value: data[index]
    })).sort((a, b) => b.value - a.value);

    const sortedLabels = sortedData.map(item => item.employee);
    const sortedValues = sortedData.map(item => item.value);

    // Вычисляем диапазон для обрезки диаграммы
    const minValue = Math.min(...sortedValues);
    const maxValue = Math.max(...sortedValues);
    const cutoffValue = Math.max(0, isCountMode ? Math.floor(minValue * 0.7) : minValue * 0.7);

    window.employeesBarChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedLabels,
            datasets: [{
                data: sortedValues,
                backgroundColor: '#FFA726',
                borderColor: '#FF9800',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const suffix = isCountMode ? '' : '%';
                            const value = isCountMode ? context.parsed.x.toLocaleString() : context.parsed.x.toFixed(2);
                            return (isCountMode ? 'Отклонений: ' : 'Процент: ') + value + suffix;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: cutoffValue,
                    max: maxValue * 1.1,
                    ticks: {
                        callback: function(value) {
                            return isCountMode ? value.toLocaleString() : value.toFixed(1) + '%';
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
                            const cutoffPixel = chart.scales.x.getPixelForValue(cutoff);
                            const valuePixel = chart.scales.x.getPixelForValue(value);
                            const textX = cutoffPixel + (valuePixel - cutoffPixel) / 2;
                            
                            ctx.fillStyle = '#fff';
                            ctx.font = 'bold 10px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            
                            ctx.shadowColor = '#000';
                            ctx.shadowBlur = 2;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            const displayValue = isCountMode ? value.toLocaleString() : value.toFixed(2) + '%';
                            ctx.fillText(displayValue, textX, element.y);
                            
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
    window.createDepartmentsTopChart = createDepartmentsTopChart;
    window.createDepartmentsTopLegend = createDepartmentsTopLegend;
    window.initEmployeeCharts = initEmployeeCharts;
    window.prepareEmployeeChartData = prepareEmployeeChartData;
    window.createEmployeePieChart = createEmployeePieChart;
    window.createEmployeeCustomLegend = createEmployeeCustomLegend;
    window.createEmployeesTopChart = createEmployeesTopChart;
    window.createEmployeesTopLegend = createEmployeesTopLegend;
    window.initChartToggle = initChartToggle;
    window.createDepartmentsBarChart = createDepartmentsBarChart;
    window.createEmployeesBarChart = createEmployeesBarChart;
    
    console.log('=== charts.js загружен ===');
}