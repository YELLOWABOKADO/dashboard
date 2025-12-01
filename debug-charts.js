// Отладочный скрипт для проверки диаграмм

console.log('=== Отладка диаграмм ===');

// Проверяем загрузку Chart.js
console.log('Chart.js загружен:', typeof Chart !== 'undefined');

// Проверяем наличие функций
console.log('Функции charts.js:');
console.log('- initDepartmentCharts:', typeof initDepartmentCharts);
console.log('- initEmployeeCharts:', typeof initEmployeeCharts);
console.log('- createDepartmentsBarChart:', typeof createDepartmentsBarChart);
console.log('- createEmployeesBarChart:', typeof createEmployeesBarChart);
console.log('- initChartToggle:', typeof initChartToggle);

// Проверяем наличие canvas элементов
console.log('Canvas элементы:');
console.log('- departmentsBarChart:', !!document.getElementById('departmentsBarChart'));
console.log('- employeesBarChart:', !!document.getElementById('employeesBarChart'));

// Проверяем переключатели
console.log('Переключатели:');
const deptToggles = document.querySelectorAll('[data-target="departments"] .toggle-btn');
const empToggles = document.querySelectorAll('[data-target="employees"] .toggle-btn');
console.log('- departments toggles:', deptToggles.length);
console.log('- employees toggles:', empToggles.length);

// Проверяем данные
console.log('Данные диаграмм:');
console.log('- departmentsChartData:', !!window.departmentsChartData);
console.log('- employeesChartData:', !!window.employeesChartData);

// Тестируем создание диаграммы с тестовыми данными
function testChartCreation() {
    console.log('=== Тест создания диаграмм ===');
    
    const testData = {
        departments: ['Тест 1', 'Тест 2'],
        deviations: [100, 80],
        percentages: [10.5, 8.2]
    };
    
    try {
        if (typeof createDepartmentsBarChart === 'function') {
            console.log('Пытаемся создать диаграмму подразделений...');
            createDepartmentsBarChart(testData, 'count');
            console.log('✓ Диаграмма подразделений создана');
        } else {
            console.error('✗ Функция createDepartmentsBarChart не найдена');
        }
    } catch (error) {
        console.error('✗ Ошибка создания диаграммы подразделений:', error);
    }
    
    try {
        if (typeof createEmployeesBarChart === 'function') {
            console.log('Пытаемся создать диаграмму сотрудников...');
            createEmployeesBarChart(testData, 'count');
            console.log('✓ Диаграмма сотрудников создана');
        } else {
            console.error('✗ Функция createEmployeesBarChart не найдена');
        }
    } catch (error) {
        console.error('✗ Ошибка создания диаграммы сотрудников:', error);
    }
}

// Запускаем тест после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(testChartCreation, 1000);
    });
} else {
    setTimeout(testChartCreation, 1000);
}
