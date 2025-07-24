/**
 * Логика для вкладки "Команда" (сотрудники)
 */

// Данные для разных режимов отображения с предыдущими периодами
const employeesMockDataByGranularity = {
    'День': {
        current: [
            {
                name: 'Иванов И.И.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 50,
                deviations: 3,
                percentage: 6
            },
            {
                name: 'Петров П.П.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 45,
                deviations: 2,
                percentage: 4.4
            },
            {
                name: 'Сидоров С.С.',
                department: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 55,
                deviations: 3,
                percentage: 5.5
            },
            {
                name: 'Смирнова А.А.',
                department: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 60,
                deviations: 3,
                percentage: 5
            }
        ],
        previous: [
            {
                name: 'Иванов И.И.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 48,
                deviations: 4,
                percentage: 8.3
            },
            {
                name: 'Петров П.П.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 47,
                deviations: 2,
                percentage: 4.3
            },
            {
                name: 'Сидоров С.С.',
                department: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 52,
                deviations: 3,
                percentage: 5.8
            },
            {
                name: 'Смирнова А.А.',
                department: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 58,
                deviations: 3,
                percentage: 5.2
            }
        ]
    },
    'Неделя': {
        current: [
            {
                name: 'Иванов И.И.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 350,
                deviations: 21,
                percentage: 6
            },
            {
                name: 'Петров П.П.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 315,
                deviations: 14,
                percentage: 4.4
            },
            {
                name: 'Сидоров С.С.',
                department: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 385,
                deviations: 21,
                percentage: 5.5
            },
            {
                name: 'Смирнова А.А.',
                department: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 420,
                deviations: 21,
                percentage: 5
            }
        ],
        previous: [
            {
                name: 'Иванов И.И.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 368,
                deviations: 22,
                percentage: 6
            },
            {
                name: 'Петров П.П.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 331,
                deviations: 15,
                percentage: 4.5
            },
            {
                name: 'Сидоров С.С.',
                department: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 404,
                deviations: 22,
                percentage: 5.4
            },
            {
                name: 'Смирнова А.А.',
                department: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 441,
                deviations: 22,
                percentage: 5
            }
        ]
    },
    'Месяц': {
        current: [
            {
                name: 'Иванов И.И.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 1500,
                deviations: 90,
                percentage: 6
            },
            {
                name: 'Петров П.П.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 1350,
                deviations: 60,
                percentage: 4.4
            },
            {
                name: 'Сидоров С.С.',
                department: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 1650,
                deviations: 90,
                percentage: 5.5
            },
            {
                name: 'Смирнова А.А.',
                department: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 1800,
                deviations: 90,
                percentage: 5
            }
        ],
        previous: [
            {
                name: 'Иванов И.И.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 1575,
                deviations: 95,
                percentage: 6
            },
            {
                name: 'Петров П.П.',
                department: 'Гридчина - группа',
                callCenter: 'КЦ1',
                calls: 1418,
                deviations: 63,
                percentage: 4.4
            },
            {
                name: 'Сидоров С.С.',
                department: 'Сычева - группа',
                callCenter: 'КЦ1',
                calls: 1733,
                deviations: 95,
                percentage: 5.5
            },
            {
                name: 'Смирнова А.А.',
                department: 'Мельникова - группа',
                callCenter: 'КЦ2',
                calls: 1890,
                deviations: 95,
                percentage: 5
            }
        ]
    }
};

// Текущие данные (по умолчанию - месяц)
let employeesData = employeesMockDataByGranularity['Месяц'];
let currentGranularity = 'Месяц';

// Функция для расчета процентного изменения для сотрудников
function calculateEmployeeChange(current, previous) {
    if (!previous || previous === 0) {
        return current > 0 ? 100 : 0;
    }
    
    const change = ((current - previous) / previous) * 100;
    return Math.round(change * 10) / 10;
}

// Функция для создания бейджа с изменением для сотрудников
function createEmployeeChangeBadge(current, previous) {
    const change = calculateEmployeeChange(current, previous);
    const sign = change > 0 ? '+' : '';
    const cssClass = change > 0 ? 'badge-success' : (change < 0 ? 'badge-danger' : 'badge-neutral');
    
    return `<span class="badge ${cssClass}">${sign}${change}%</span>`;
}

// Функция для инициализации вкладки "Команда"
function initEmployeesTab() {
    // Получаем текущий режим отображения
    const granularity = document.getElementById('timeGranularity') ? 
        document.getElementById('timeGranularity').value : 'Месяц';
    
    // Обновляем данные сотрудников
    updateEmployeesData(granularity);
    
    // Добавляем обработчик изменения режима отображения
    document.querySelectorAll('input[name="timeGranularity"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const granularity = this.value;
                // Обновляем данные
                updateEmployeesData(granularity);
            }
        });
    });
    
    // Добавляем обработчик выбора контакт-центра
    document.querySelectorAll('input[name="callCenter"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                // Обновляем данные с учетом выбранного КЦ
                updateEmployeesTable();
            }
        });
    });
    
    // Добавляем обработчик выбора подразделений
    document.querySelectorAll('#departmentsDropdown input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Обновляем данные с учетом выбранных подразделений
            updateEmployeesTable();
        });
    });
    
    // Добавляем обработчик выбора сотрудников
    document.querySelectorAll('#employeesDropdown input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Обновляем данные с учетом выбранных сотрудников
            updateEmployeesTable();
        });
    });
    
    // Добавляем обработчик кнопки обновления
    document.getElementById('updateButton').addEventListener('click', function() {
        const granularity = document.getElementById('selectedTimeGranularity').textContent;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        // Проверяем ограничения на выбор дат
        if (validateDateRange(startDate, endDate, granularity)) {
            updateEmployeesData(granularity);
        } else {
            // Если даты не соответствуют ограничениям, корректируем их
            adjustDateRangeForGranularity(granularity);
            // И обновляем данные
            updateEmployeesData(granularity);
        }
    });
}

// Функция для обновления данных сотрудников
function updateEmployeesData(granularity) {
    // Обновляем текущие данные в зависимости от выбранного режима отображения
    employeesData = employeesMockDataByGranularity[granularity];
    currentGranularity = granularity;
    
    // Обновляем таблицу с данными
    updateEmployeesTable();
}

// Функция для обновления таблицы с данными сотрудников
function updateEmployeesTable() {
    // Получаем выбранный контакт-центр
    const callCenterSelect = document.getElementById('callCenter');
    const selectedCallCenter = callCenterSelect ? callCenterSelect.value : 'Все КЦ';
    
    // Фильтруем данные по выбранному контакт-центру
    let currentData = employeesData.current;
    let previousData = employeesData.previous;
    
    if (selectedCallCenter !== 'Все КЦ') {
        currentData = currentData.filter(emp => emp.callCenter === selectedCallCenter);
        previousData = previousData.filter(emp => emp.callCenter === selectedCallCenter);
    }
    
    // Создаем или обновляем таблицу
    const tableContainer = document.getElementById('employeesTable');
    if (!tableContainer) return;
    
    let tableHTML = `
        <h4>Сотрудники</h4>
        <table>
            <thead>
                <tr>
                    <th>СОТРУДНИК</th>
                    <th>ПОДРАЗДЕЛЕНИЕ</th>
                    <th class="text-right">КЦ</th>
                    <th class="text-right">ОЦЕНЕНО ЗВОНКОВ</th>
                    <th class="text-right">ОТКЛОНЕНИЙ</th>
                    <th class="text-right">% ОТКЛОНЕНИЙ</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Добавляем строки данных
    currentData.forEach((emp, index) => {
        const prevEmp = previousData[index];
        const percentageClass = emp.percentage >= 10 ? 'percentage-high' : 
                               (emp.percentage >= 5 ? 'percentage-medium' : 'percentage-low');
        
        tableHTML += `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td class="text-right">${emp.callCenter}</td>
                <td class="text-right">${emp.calls.toLocaleString()} ${createEmployeeChangeBadge(emp.calls, prevEmp.calls)}</td>
                <td class="text-right">${emp.deviations.toLocaleString()} ${createEmployeeChangeBadge(emp.deviations, prevEmp.deviations)}</td>
                <td class="text-right"><span class="${percentageClass}">${emp.percentage}%</span> ${createEmployeeChangeBadge(emp.percentage, prevEmp.percentage)}</td>
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
    // Добавляем обработчик для вкладки "Команда"
    document.querySelector('.tab-button[data-tab="employees"]').addEventListener('click', function() {
        // Инициализируем вкладку "Команда" при первом переключении на нее
        if (!window.employeesTabInitialized) {
            initEmployeesTab();
            window.employeesTabInitialized = true;
        }
    });
});