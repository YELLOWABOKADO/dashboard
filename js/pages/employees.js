/**
 * Логика для вкладки "Команда" (сотрудники)
 */

// Данные для разных режимов отображения
const employeesMockDataByGranularity = {
    'День': {
        employees: [
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
        ]
    },
    'Неделя': {
        employees: [
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
        ]
    },
    'Месяц': {
        employees: [
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
        ]
    }
};

// Текущие данные (по умолчанию - месяц)
let employeesData = employeesMockDataByGranularity['Месяц'];

// Функция для инициализации вкладки "Команда"
function initEmployeesTab() {
    // Получаем текущий режим отображения
    const granularity = document.getElementById('selectedTimeGranularity').textContent;
    
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
    
    // Обновляем таблицу с данными
    updateEmployeesTable();
}

// Функция для обновления таблицы с данными сотрудников
function updateEmployeesTable() {
    // Получаем выбранный контакт-центр
    const selectedCallCenter = document.getElementById('selectedCallCenter').textContent;
    
    // Получаем выбранные подразделения
    const selectedDepartments = Array.from(document.querySelectorAll('#departmentsDropdown input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    // Получаем выбранных сотрудников
    const selectedEmployees = Array.from(document.querySelectorAll('#employeesDropdown input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    // Фильтруем данные по выбранному контакт-центру, подразделениям и сотрудникам
    let filteredData = employeesData.employees;
    
    if (selectedCallCenter !== 'Все КЦ') {
        filteredData = filteredData.filter(emp => emp.callCenter === selectedCallCenter);
    }
    
    if (selectedDepartments.length > 0) {
        filteredData = filteredData.filter(emp => selectedDepartments.includes(emp.department));
    }
    
    if (selectedEmployees.length > 0) {
        filteredData = filteredData.filter(emp => selectedEmployees.includes(emp.name));
    }
    
    // Определяем заголовки таблицы
    const headers = [
        { key: 'name', text: 'СОТРУДНИК', class: 'py-3 px-6 text-left' },
        { key: 'department', text: 'ПОДРАЗДЕЛЕНИЕ', class: 'py-3 px-6 text-left' },
        { key: 'callCenter', text: 'КОНТАКТ-ЦЕНТР', class: 'py-3 px-6 text-center' },
        { key: 'calls', text: 'ОЦЕНЕНО ЗВОНКОВ', class: 'py-3 px-6 text-center', render: value => formatNumber(value) },
        { key: 'deviations', text: 'ОТКЛОНЕНИЙ', class: 'py-3 px-6 text-center', render: value => formatNumber(value) },
        { key: 'percentage', text: '% ОТКЛОНЕНИЙ', class: 'py-3 px-6 text-center', render: value => {
            const percentageClass = getDeviationPercentageClass(value);
            return `<span class="${percentageClass}">${formatPercentage(value)}</span>`;
        }}
    ];
    
    // Создаем или обновляем таблицу
    const tableContainer = document.getElementById('employeesTable');
    if (tableContainer) {
        // Если контейнер существует, но таблица еще не создана
        if (!tableContainer.querySelector('table')) {
            createDataTable('employeesTable', headers, filteredData, {
                tbodyId: 'employeesTableBody',
                rowClass: 'border-b border-gray-200'
            });
        } else {
            // Если таблица уже существует, обновляем данные
            const tbody = document.getElementById('employeesTableBody');
            if (tbody) {
                tbody.innerHTML = '';
                
                filteredData.forEach(rowData => {
                    const row = document.createElement('tr');
                    row.className = 'border-b border-gray-200';
                    
                    // Добавляем ячейки данных
                    headers.forEach(header => {
                        const td = document.createElement('td');
                        td.className = header.key === 'name' || header.key === 'department' ? 'py-4 px-6 text-left font-medium' : 'py-4 px-6 text-center';
                        
                        // Если есть функция рендеринга для этого столбца, используем ее
                        if (header.render && typeof header.render === 'function') {
                            td.innerHTML = header.render(rowData[header.key], rowData);
                        } else {
                            td.textContent = rowData[header.key] || '';
                        }
                        
                        row.appendChild(td);
                    });
                    
                    tbody.appendChild(row);
                });
            }
        }
    }
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