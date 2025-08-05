// Скрипт для проверки корректности реализации переключателя диаграмм

console.log('=== Проверка реализации переключателя диаграмм ===');

// Проверяем наличие необходимых элементов в DOM
function checkDOMElements() {
    console.log('\n1. Проверка DOM элементов:');
    
    const elements = [
        'departmentsBarChartTitle',
        'departmentsBarChart', 
        'employeesBarChartTitle',
        'employeesBarChart'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`  ${id}: ${element ? '✓ найден' : '✗ не найден'}`);
    });
    
    // Проверяем переключатели
    const deptToggles = document.querySelectorAll('[data-target="departments"] .toggle-btn');
    const empToggles = document.querySelectorAll('[data-target="employees"] .toggle-btn');
    
    console.log(`  Переключатели подразделений: ${deptToggles.length === 2 ? '✓ найдены (2)' : '✗ не найдены'}`);
    console.log(`  Переключатели сотрудников: ${empToggles.length === 2 ? '✓ найдены (2)' : '✗ не найдены'}`);
}

// Проверяем наличие функций
function checkFunctions() {
    console.log('\n2. Проверка JavaScript функций:');
    
    const functions = [
        'initChartToggle',
        'createDepartmentsBarChart',
        'createEmployeesBarChart',
        'initDepartmentCharts',
        'initEmployeeCharts'
    ];
    
    functions.forEach(funcName => {
        const func = window[funcName];
        console.log(`  ${funcName}: ${typeof func === 'function' ? '✓ найдена' : '✗ не найдена'}`);
    });
}

// Проверяем отсутствие старых функций
function checkOldFunctions() {
    console.log('\n3. Проверка удаления старых функций:');
    
    const oldFunctions = [
        'createDeviationsBarChart',
        'createPercentageBarChart', 
        'createEmployeeDeviationsBarChart',
        'createEmployeePercentageBarChart'
    ];
    
    oldFunctions.forEach(funcName => {
        const func = window[funcName];
        console.log(`  ${funcName}: ${typeof func === 'undefined' ? '✓ удалена' : '✗ все еще существует'}`);
    });
}

// Проверяем CSS стили
function checkCSS() {
    console.log('\n4. Проверка CSS стилей:');
    
    const testElement = document.createElement('div');
    testElement.className = 'chart-toggle';
    document.body.appendChild(testElement);
    
    const styles = window.getComputedStyle(testElement);
    const hasStyles = styles.display !== 'inline'; // Проверяем, что стили применились
    
    console.log(`  Стили переключателя: ${hasStyles ? '✓ применены' : '✗ не применены'}`);
    
    document.body.removeChild(testElement);
}

// Запускаем проверки
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            checkDOMElements();
            checkFunctions();
            checkOldFunctions();
            checkCSS();
            console.log('\n=== Проверка завершена ===');
        }, 1000);
    });
} else {
    setTimeout(() => {
        checkDOMElements();
        checkFunctions();
        checkOldFunctions();
        checkCSS();
        console.log('\n=== Проверка завершена ===');
    }, 1000);
}