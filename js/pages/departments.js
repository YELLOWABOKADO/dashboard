/**
 * Логика для вкладки "Подразделения"
 */

// Данные для разных режимов отображения
const departmentsMockDataByGranularity = {
    'День': {
        departments: [
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
        ]
    },
    'Неделя': {
        departments: [
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
        ]
    },
    'Месяц': {
        departments: [
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
        ]
    }
};

// Текущие данные (по умолчанию - месяц)
let departmentsData = departmentsMockDataByGranularity['Месяц'];

// Функция для инициализации вкладки "Подразделения"
function initDepartmentsTab() {
    // Получаем текущий режим отображения
    const granularity = document.getElementById('selectedTimeGranularity').textContent;
    
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
    
    // Обновляем таблицу с данными
    updateDepartmentsTable();
}

// Функция для обновления таблицы с данными подразделений
function updateDepartmentsTable() {
    // Получаем выбранный контакт-центр
    const selectedCallCenter = document.getElementById('selectedCallCenter').textContent;
    
    // Получаем выбранные подразделения
    const selectedDepartments = Array.from(document.querySelectorAll('#departmentsDropdown input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    // Фильтруем данные по выбранному контакт-центру и подразделениям
    let filteredData = departmentsData.departments;
    
    if (selectedCallCenter !== 'Все КЦ') {
        filteredData = filteredData.filter(dept => dept.callCenter === selectedCallCenter);
    }
    
    if (selectedDepartments.length > 0) {
        filteredData = filteredData.filter(dept => selectedDepartments.includes(dept.name));
    }
    
    // Определяем заголовки таблицы
    const headers = [
        { key: 'name', text: 'ПОДРАЗДЕЛЕНИЕ', class: 'py-3 px-6 text-left' },
        { key: 'callCenter', text: 'КОНТАКТ-ЦЕНТР', class: 'py-3 px-6 text-center' },
        { key: 'calls', text: 'ОЦЕНЕНО ЗВОНКОВ', class: 'py-3 px-6 text-center', render: value => formatNumber(value) },
        { key: 'deviations', text: 'ОТКЛОНЕНИЙ', class: 'py-3 px-6 text-center', render: value => formatNumber(value) },
        { key: 'percentage', text: '% ОТКЛОНЕНИЙ', class: 'py-3 px-6 text-center', render: value => {
            const percentageClass = getDeviationPercentageClass(value);
            return `<span class="${percentageClass}">${formatPercentage(value)}</span>`;
        }}
    ];
    
    // Создаем или обновляем таблицу
    const tableContainer = document.getElementById('departmentsTable');
    if (tableContainer) {
        // Если контейнер существует, но таблица еще не создана
        if (!tableContainer.querySelector('table')) {
            createDataTable('departmentsTable', headers, filteredData, {
                tbodyId: 'departmentsTableBody',
                rowClass: 'border-b border-gray-200'
            });
        } else {
            // Если таблица уже существует, обновляем данные
            const tbody = document.getElementById('departmentsTableBody');
            if (tbody) {
                tbody.innerHTML = '';
                
                filteredData.forEach(rowData => {
                    const row = document.createElement('tr');
                    row.className = 'border-b border-gray-200';
                    
                    // Добавляем ячейки данных
                    headers.forEach(header => {
                        const td = document.createElement('td');
                        td.className = header.key === 'name' ? 'py-4 px-6 text-left font-medium' : 'py-4 px-6 text-center';
                        
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
    // Добавляем обработчик для вкладки "Подразделения"
    document.querySelector('.tab-button[data-tab="departments"]').addEventListener('click', function() {
        // Инициализируем вкладку "Подразделения" при первом переключении на нее
        if (!window.departmentsTabInitialized) {
            initDepartmentsTab();
            window.departmentsTabInitialized = true;
        }
    });
});