/**
 * Модуль для работы с графиками
 */

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
    
    // Создаем график, учитывая активный режим
    const activeButton = document.querySelector('.toggle-btn[data-target="departments"].active');
    const mode = activeButton ? activeButton.dataset.mode : 'count';
    createDepartmentsBarChart(chartData, mode);
    
    // Инициализируем обработчики переключателя
    initChartToggle('departments');
}

// Подготовка данных для графиков
function prepareDepartmentChartData(departmentsData) {
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

    // Сортируем по возрастанию процента отклонений (меньше = лучше)
    dataArray.sort((a, b) => a.percentage - b.percentage);

    // Извлекаем отсортированные данные
    const departments = dataArray.map(item => item.name);
    const deviations = dataArray.map(item => item.deviations);
    const percentages = dataArray.map(item => item.percentage);

    return {
        departments,
        deviations,
        percentages
    };
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
    
    // Создаем график, учитывая активный режим
    const activeButton = document.querySelector('.toggle-btn[data-target="employees"].active');
    const mode = activeButton ? activeButton.dataset.mode : 'count';
    createEmployeesBarChart(chartData, mode); // По умолчанию показываем количество
    
    // Инициализируем обработчики переключателя
    initChartToggle('employees');
}

// Подготовка данных для графиков сотрудников
function prepareEmployeeChartData(employeesData) {
    // Создаем массив данных для сортировки (берем только первые 10 для читаемости)
    const dataArray = employeesData.current
        .map(emp => ({
            name: emp.name,
            deviations: emp.deviations,
            percentage: emp.percentage
        }))
        .sort((a, b) => a.percentage - b.percentage)
        .slice(0, 10); // Ограничиваем 10 сотрудниками (лучшие по отклонениям)

    // Извлекаем отсортированные данные
    const employees = dataArray.map(item => item.name);
    const deviations = dataArray.map(item => item.deviations);
    const percentages = dataArray.map(item => item.percentage);

    return {
        employees,
        deviations,
        percentages
    };
}


// Инициализация обработчиков переключателя
function initChartToggle(target) {
    console.log('initChartToggle вызвана для:', target);
    
    const toggleButtons = Array.from(document.querySelectorAll(`.toggle-btn[data-target="${target}"]`));
    console.log('Найдено кнопок переключателя:', toggleButtons.length);
    
    toggleButtons.forEach(button => {
        if (button.dataset.chartToggleInitialized === 'true') {
            return;
        }

        button.dataset.chartToggleInitialized = 'true';

        button.addEventListener('click', function() {
            const mode = this.dataset.mode || 'count';
            const target = this.dataset.target;
            
            // Обновляем активную кнопку
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Обновляем заголовок
            const titleElement = document.getElementById(`${target}BarChartTitle`);
            if (titleElement) {
                titleElement.textContent = mode === 'count' ? 'Количество отклонений' : 'Процент отклонений';
            }
            
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

    // Сортируем данные по возрастанию (меньше отклонений сверху)
    const sortedData = labels.map((dept, index) => ({
        department: dept,
        value: data[index]
    })).sort((a, b) => a.value - b.value);

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

    // Сортируем данные по возрастанию (меньше отклонений сверху)
    const sortedData = labels.map((emp, index) => ({
        employee: emp,
        value: data[index]
    })).sort((a, b) => a.value - b.value);

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
    window.initDepartmentCharts = initDepartmentCharts;
    window.prepareDepartmentChartData = prepareDepartmentChartData;
    window.initEmployeeCharts = initEmployeeCharts;
    window.prepareEmployeeChartData = prepareEmployeeChartData;
    window.initChartToggle = initChartToggle;
    window.createDepartmentsBarChart = createDepartmentsBarChart;
    window.createEmployeesBarChart = createEmployeesBarChart;
    
    console.log('=== charts.js загружен ===');
}
