// Скрипт для исправления детализации по сотруднику
// Выполните этот код в консоли браузера

console.log('=== ИСПРАВЛЕНИЕ ДЕТАЛИЗАЦИИ ПО СОТРУДНИКУ ===');

// Проверяем наличие данных
if (typeof empDetailsAllData === 'undefined' || empDetailsAllData.length === 0) {
    console.log('Данные не загружены, загружаем...');

    fetch('operator_data_days.json')
        .then(response => response.json())
        .then(data => {
            window.empDetailsAllData = data;
            console.log('Данные загружены:', data.length);
            fillFilters();
        })
        .catch(error => {
            console.error('Ошибка загрузки:', error);
        });
} else {
    console.log('Данные уже загружены:', empDetailsAllData.length);
    fillFilters();
}

function fillFilters() {
    console.log('Заполняем фильтры...');

    const data = window.empDetailsAllData || empDetailsAllData;

    if (!data || data.length === 0) {
        console.error('Нет данных для заполнения');
        return;
    }

    // Получаем уникальные значения
    const operators = [...new Set(data.map(item => item.operator))].sort();
    const groups = [...new Set(data.map(item => item.group))].sort();
    const kcs = [...new Set(data.map(item => item.kc))].sort();

    console.log('Найдено:', {
        operators: operators.length,
        groups: groups.length,
        kcs: kcs.length
    });

    // Заполняем операторов
    const operatorSelect = document.getElementById('empDetailsOperatorFilter');
    if (operatorSelect) {
        operatorSelect.innerHTML = '<option value="">Выберите сотрудника</option>';
        operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator;
            option.textContent = operator;
            operatorSelect.appendChild(option);
        });
        console.log('✅ Операторы заполнены:', operatorSelect.options.length);
    } else {
        console.error('❌ Элемент empDetailsOperatorFilter не найден');
    }

    // Заполняем второй селект операторов
    const secondOperatorSelect = document.getElementById('empDetailsSecondOperator');
    if (secondOperatorSelect) {
        secondOperatorSelect.innerHTML = '<option value="">Выберите второго сотрудника</option>';
        operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator;
            option.textContent = operator;
            secondOperatorSelect.appendChild(option);
        });
        console.log('✅ Второй селект операторов заполнен');
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
        console.log('✅ Группы заполнены:', groupSelect.options.length);
    } else {
        console.error('❌ Элемент empDetailsGroupFilter не найден');
    }

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
        console.log('✅ КЦ заполнены:', kcSelect.options.length);
    } else {
        console.error('❌ Элемент empDetailsKcFilter не найден');
    }

    console.log('=== ФИЛЬТРЫ ЗАПОЛНЕНЫ ===');
}

// Экспортируем функцию для повторного использования
window.applyEmployeeDetailsFilters = fillFilters;
console.log('Используйте fixEmployeeDetailsFilters() для повторного заполнения фильтров');
