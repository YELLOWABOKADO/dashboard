/**
 * Логика для вкладки "Подразделения"
 */

// Данные для разных режимов отображения с предыдущими периодами
const departmentsMockDataByGranularity = {
    'День': {
        current: [
            {
                name: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 300,
                deviations: 21,
                percentage: 7
            },
            {
                name: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 280,
                deviations: 14,
                percentage: 5
            },
            {
                name: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 320,
                deviations: 16,
                percentage: 5
            },
            {
                name: 'Коровина - группа',
                callCenter: 'КЦ2',
                calls: 290,
                deviations: 15,
                percentage: 5.2
            }
        ],
        previous: [
            {
                name: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 285,
                deviations: 23,
                percentage: 8.1
            },
            {
                name: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 295,
                deviations: 15,
                percentage: 5.1
            },
            {
                name: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 310,
                deviations: 17,
                percentage: 5.5
            },
            {
                name: 'Коровина - группа',
                callCenter: 'КЦ2',
                calls: 275,
                deviations: 14,
                percentage: 5.1
            }
        ]
    },
    'Неделя': {
        current: [
            {
                name: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 2100,
                deviations: 147,
                percentage: 7
            },
            {
                name: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 1960,
                deviations: 98,
                percentage: 5
            },
            {
                name: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 2240,
                deviations: 112,
                percentage: 5
            },
            {
                name: 'Коровина - группа',
                callCenter: 'КЦ2',
                calls: 2030,
                deviations: 105,
                percentage: 5.2
            }
        ],
        previous: [
            {
                name: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 2205,
                deviations: 154,
                percentage: 7
            },
            {
                name: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 2058,
                deviations: 103,
                percentage: 5
            },
            {
                name: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 2352,
                deviations: 118,
                percentage: 5
            },
            {
                name: 'Коровина - группа',
                callCenter: 'КЦ2',
                calls: 2132,
                deviations: 110,
                percentage: 5.2
            }
        ]
    },
    'Месяц': {
        current: [
            {
                name: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 9000,
                deviations: 630,
                percentage: 7
            },
            {
                name: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 8400,
                deviations: 420,
                percentage: 5
            },
            {
                name: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 9600,
                deviations: 480,
                percentage: 5
            },
            {
                name: 'Коровина - группа',
                callCenter: 'КЦ2',
                calls: 8700,
                deviations: 450,
                percentage: 5.2
            }
        ],
        previous: [
            {
                name: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 9450,
                deviations: 661,
                percentage: 7
            },
            {
                name: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 8820,
                deviations: 441,
                percentage: 5
            },
            {
                name: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 10080,
                deviations: 504,
                percentage: 5
            },
            {
                name: 'Коровина - группа',
                callCenter: 'КЦ2',
                calls: 9135,
                deviations: 473,
                percentage: 5.2
            }
        ]
    }
};

// Текущие данные (по умолчанию - месяц)
let departmentsData = departmentsMockDataByGranularity['Месяц'];
let currentGranularity = 'Месяц';

// Функция для расчета процентного изменения
function calculateDepartmentChange(current, previous) {
    if (!previous || previous === 0) {
        return current > 0 ? 100 : 0;
    }
    
    const change = ((current - previous) / previous) * 100;
    return Math.round(change * 10) / 10;
}

// Функция для создания бейджа с изменением для подразделений
function createDepartmentChangeBadge(current, previous) {
    const change = calculateDepartmentChange(current, previous);
    const sign = change > 0 ? '+' : '';
    const cssClass = change > 0 ? 'badge-success' : (change < 0 ? 'badge-danger' : 'badge-neutral');
    
    return `<span class="badge ${cssClass}">${sign}${change}%</span>`;
}

// Функция для инициализации вкладки "Подразделения"
function initDepartmentsTab() {
    // Получаем текущий режим отображения
    const granularity = document.getElementById('timeGranularity') ? 
        document.getElementById('timeGranularity').value : 'Месяц';
    
    // Обновляем данные подразделений
    updateDepartmentsData(granularity);
    
    // Добавляем обработчик изменения режима отображения
    document.querySelectorAll('input[name="timeGranularity"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const granularity = this.value;
                // Обновляем данные
                updateDepartmentsData(granularity);
            }
        });
    });
    
    // Добавляем обработчик выбора контакт-центра
    document.querySelectorAll('input[name="callCenter"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                // Обновляем данные с учетом выбранного КЦ
                updateDepartmentsTable();
            }
        });
    });
    
    // Добавляем обработчик выбора подразделений
    document.querySelectorAll('#departmentsDropdown input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Обновляем данные с учетом выбранных подразделений
            updateDepartmentsTable();
        });
    });
    
    // Добавляем обработчик кнопки обновления
    document.getElementById('updateButton').addEventListener('click', function() {
        const granularity = document.getElementById('selectedTimeGranularity').textContent;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        // Проверяем ограничения на выбор дат
        if (validateDateRange(startDate, endDate, granularity)) {
            updateDepartmentsData(granularity);
        } else {
            // Если даты не соответствуют ограничениям, корректируем их
            adjustDateRangeForGranularity(granularity);
            // И обновляем данные
            updateDepartmentsData(granularity);
        }
    });
}

// Функция для обновления данных подразделений
function updateDepartmentsData(granularity) {
    // Обновляем текущие данные в зависимости от выбранного режима отображения
    departmentsData = departmentsMockDataByGranularity[granularity];
    currentGranularity = granularity;
    
    // Обновляем таблицу с данными
    updateDepartmentsTable();
}

// Функция для обновления таблицы с данными подразделений
function updateDepartmentsTable() {
    // Получаем выбранный контакт-центр
    const callCenterSelect = document.getElementById('callCenter');
    const selectedCallCenter = callCenterSelect ? callCenterSelect.value : 'Все КЦ';
    
    // Фильтруем данные по выбранному контакт-центру
    let currentData = departmentsData.current;
    let previousData = departmentsData.previous;
    
    if (selectedCallCenter !== 'Все КЦ') {
        currentData = currentData.filter(dept => dept.callCenter === selectedCallCenter);
        previousData = previousData.filter(dept => dept.callCenter === selectedCallCenter);
    }
    
    // Создаем или обновляем таблицу
    const tableContainer = document.getElementById('departmentsTable');
    if (!tableContainer) return;
    
    let tableHTML = `
        <h4>Подразделения</h4>
        <table>
            <thead>
                <tr>
                    <th>ПОДРАЗДЕЛЕНИЕ</th>
                    <th class="text-right">КОНТАКТ-ЦЕНТР</th>
                    <th class="text-right">ОЦЕНЕНО ЗВОНКОВ</th>
                    <th class="text-right">ОТКЛОНЕНИЙ</th>
                    <th class="text-right">% ОТКЛОНЕНИЙ</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Добавляем строки данных
    currentData.forEach((dept, index) => {
        const prevDept = previousData[index];
        const percentageClass = dept.percentage >= 10 ? 'percentage-high' : 
                               (dept.percentage >= 5 ? 'percentage-medium' : 'percentage-low');
        
        tableHTML += `
            <tr>
                <td>${dept.name}</td>
                <td class="text-right">${dept.callCenter}</td>
                <td class="text-right">${dept.calls.toLocaleString()} ${createDepartmentChangeBadge(dept.calls, prevDept.calls)}</td>
                <td class="text-right">${dept.deviations.toLocaleString()} ${createDepartmentChangeBadge(dept.deviations, prevDept.deviations)}</td>
                <td class="text-right"><span class="${percentageClass}">${dept.percentage}%</span> ${createDepartmentChangeBadge(dept.percentage, prevDept.percentage)}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчик для вкладки "Подразделения"
    document.querySelector('.tab-button[data-tab="departments"]').addEventListener('click', function() {
        // Инициализируем вкладку "Подразделения" при первом переключении на нее
        if (!window.departmentsTabInitialized) {
            initDepartmentsTab();
            window.departmentsTabInitialized = true;
        }
    });
});