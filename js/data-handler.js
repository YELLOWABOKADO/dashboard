/**
 * Функции для работы с данными и их отображением
 */

// Пример данных для демонстрации
const mockData = {
    company: [
        { date: '2025-07-01', callCenter: 'КЦ1', calls: 900, deviations: 63 },
        { date: '2025-07-02', callCenter: 'КЦ1', calls: 880, deviations: 62 },
        { date: '2025-07-03', callCenter: 'КЦ1', calls: 920, deviations: 64 },
        { date: '2025-07-04', callCenter: 'КЦ1', calls: 890, deviations: 62 },
        { date: '2025-07-05', callCenter: 'КЦ1', calls: 850, deviations: 60 },
        { date: '2025-07-06', callCenter: 'КЦ1', calls: 830, deviations: 58 },
        { date: '2025-07-07', callCenter: 'КЦ1', calls: 910, deviations: 64 },
        { date: '2025-07-08', callCenter: 'КЦ1', calls: 930, deviations: 65 },
        { date: '2025-07-09', callCenter: 'КЦ1', calls: 940, deviations: 66 },
        { date: '2025-07-10', callCenter: 'КЦ1', calls: 920, deviations: 64 },
        { date: '2025-07-11', callCenter: 'КЦ1', calls: 900, deviations: 63 },
        { date: '2025-07-12', callCenter: 'КЦ1', calls: 880, deviations: 62 },
        { date: '2025-07-13', callCenter: 'КЦ1', calls: 860, deviations: 60 },
        { date: '2025-07-14', callCenter: 'КЦ1', calls: 890, deviations: 62 },
        { date: '2025-07-15', callCenter: 'КЦ1', calls: 910, deviations: 64 },
        { date: '2025-07-16', callCenter: 'КЦ1', calls: 930, deviations: 65 },
        { date: '2025-07-17', callCenter: 'КЦ1', calls: 950, deviations: 67 },
        { date: '2025-07-18', callCenter: 'КЦ1', calls: 940, deviations: 66 },
        { date: '2025-07-19', callCenter: 'КЦ1', calls: 920, deviations: 64 },
        { date: '2025-07-20', callCenter: 'КЦ1', calls: 900, deviations: 63 },
        { date: '2025-07-21', callCenter: 'КЦ1', calls: 880, deviations: 62 },
        { date: '2025-07-22', callCenter: 'КЦ1', calls: 870, deviations: 61 },
        { date: '2025-07-23', callCenter: 'КЦ1', calls: 890, deviations: 62 },
        { date: '2025-07-24', callCenter: 'КЦ1', calls: 910, deviations: 64 },
        { date: '2025-07-25', callCenter: 'КЦ1', calls: 930, deviations: 65 },
        { date: '2025-07-26', callCenter: 'КЦ1', calls: 950, deviations: 67 },
        { date: '2025-07-27', callCenter: 'КЦ1', calls: 940, deviations: 66 },
        { date: '2025-07-28', callCenter: 'КЦ1', calls: 920, deviations: 64 },
        { date: '2025-07-29', callCenter: 'КЦ1', calls: 900, deviations: 63 },
        { date: '2025-07-30', callCenter: 'КЦ1', calls: 880, deviations: 62 },
        { date: '2025-07-31', callCenter: 'КЦ1', calls: 870, deviations: 61 },

        { date: '2025-07-01', callCenter: 'КЦ2', calls: 700, deviations: 35 },
        { date: '2025-07-02', callCenter: 'КЦ2', calls: 680, deviations: 34 },
        { date: '2025-07-03', callCenter: 'КЦ2', calls: 720, deviations: 36 },
        { date: '2025-07-04', callCenter: 'КЦ2', calls: 690, deviations: 35 },
        { date: '2025-07-05', callCenter: 'КЦ2', calls: 650, deviations: 33 },
        { date: '2025-07-06', callCenter: 'КЦ2', calls: 630, deviations: 32 },
        { date: '2025-07-07', callCenter: 'КЦ2', calls: 710, deviations: 36 },
        { date: '2025-07-08', callCenter: 'КЦ2', calls: 730, deviations: 37 },
        { date: '2025-07-09', callCenter: 'КЦ2', calls: 740, deviations: 37 },
        { date: '2025-07-10', callCenter: 'КЦ2', calls: 720, deviations: 36 },
        { date: '2025-07-11', callCenter: 'КЦ2', calls: 700, deviations: 35 },
        { date: '2025-07-12', callCenter: 'КЦ2', calls: 680, deviations: 34 },
        { date: '2025-07-13', callCenter: 'КЦ2', calls: 660, deviations: 33 },
        { date: '2025-07-14', callCenter: 'КЦ2', calls: 690, deviations: 35 },
        { date: '2025-07-15', callCenter: 'КЦ2', calls: 710, deviations: 36 },
        { date: '2025-07-16', callCenter: 'КЦ2', calls: 730, deviations: 37 },
        { date: '2025-07-17', callCenter: 'КЦ2', calls: 750, deviations: 38 },
        { date: '2025-07-18', callCenter: 'КЦ2', calls: 740, deviations: 37 },
        { date: '2025-07-19', callCenter: 'КЦ2', calls: 720, deviations: 36 },
        { date: '2025-07-20', callCenter: 'КЦ2', calls: 700, deviations: 35 },
        { date: '2025-07-21', callCenter: 'КЦ2', calls: 680, deviations: 34 },
        { date: '2025-07-22', callCenter: 'КЦ2', calls: 670, deviations: 34 },
        { date: '2025-07-23', callCenter: 'КЦ2', calls: 690, deviations: 35 },
        { date: '2025-07-24', callCenter: 'КЦ2', calls: 710, deviations: 36 },
        { date: '2025-07-25', callCenter: 'КЦ2', calls: 730, deviations: 37 },
        { date: '2025-07-26', callCenter: 'КЦ2', calls: 750, deviations: 38 },
        { date: '2025-07-27', callCenter: 'КЦ2', calls: 740, deviations: 37 },
        { date: '2025-07-28', callCenter: 'КЦ2', calls: 720, deviations: 36 },
        { date: '2025-07-29', callCenter: 'КЦ2', calls: 700, deviations: 35 },
        { date: '2025-07-30', callCenter: 'КЦ2', calls: 680, deviations: 34 },
        { date: '2025-07-31', callCenter: 'КЦ2', calls: 670, deviations: 34 }
    ],
    departments: [
        // Данные для подразделений КЦ1
        { date: '2025-07-01', department: 'Гридчина - группа', callCenter: 'КЦ1', calls: 300, deviations: 21 },
        { date: '2025-07-02', department: 'Гридчина - группа', callCenter: 'КЦ1', calls: 290, deviations: 20 },
        { date: '2025-07-03', department: 'Гридчина - группа', callCenter: 'КЦ1', calls: 310, deviations: 22 },

        { date: '2025-07-01', department: 'Сычева - группа', callCenter: 'КЦ1', calls: 280, deviations: 14 },
        { date: '2025-07-02', department: 'Сычева - группа', callCenter: 'КЦ1', calls: 270, deviations: 14 },
        { date: '2025-07-03', department: 'Сычева - группа', callCenter: 'КЦ1', calls: 290, deviations: 15 },

        // Данные для подразделений КЦ2
        { date: '2025-07-01', department: 'Мельникова - группа', callCenter: 'КЦ2', calls: 320, deviations: 16 },
        { date: '2025-07-02', department: 'Мельникова - группа', callCenter: 'КЦ2', calls: 310, deviations: 16 },
        { date: '2025-07-03', department: 'Мельникова - группа', callCenter: 'КЦ2', calls: 330, deviations: 17 },

        { date: '2025-07-01', department: 'Коровина - группа', callCenter: 'КЦ2', calls: 290, deviations: 15 },
        { date: '2025-07-02', department: 'Коровина - группа', callCenter: 'КЦ2', calls: 280, deviations: 14 },
        { date: '2025-07-03', department: 'Коровина - группа', callCenter: 'КЦ2', calls: 300, deviations: 15 }
        // ... и так далее для всех дней
    ],
    employees: [
        // Данные для сотрудников КЦ1
        { date: '2025-07-01', employee: 'Иванов И.И.', department: 'Гридчина - группа', callCenter: 'КЦ1', calls: 50, deviations: 3 },
        { date: '2025-07-02', employee: 'Иванов И.И.', department: 'Гридчина - группа', callCenter: 'КЦ1', calls: 48, deviations: 3 },
        { date: '2025-07-03', employee: 'Иванов И.И.', department: 'Гридчина - группа', callCenter: 'КЦ1', calls: 52, deviations: 4 },

        { date: '2025-07-01', employee: 'Петров П.П.', department: 'Гридчина - группа', callCenter: 'КЦ1', calls: 45, deviations: 2 },
        { date: '2025-07-02', employee: 'Петров П.П.', department: 'Гридчина - группа', callCenter: 'КЦ1', calls: 43, deviations: 2 },
        { date: '2025-07-03', employee: 'Петров П.П.', department: 'Гридчина - группа', callCenter: 'КЦ1', calls: 47, deviations: 2 },

        { date: '2025-07-01', employee: 'Сидоров С.С.', department: 'Сычева - группа', callCenter: 'КЦ1', calls: 55, deviations: 3 },
        { date: '2025-07-02', employee: 'Сидоров С.С.', department: 'Сычева - группа', callCenter: 'КЦ1', calls: 53, deviations: 3 },
        { date: '2025-07-03', employee: 'Сидоров С.С.', department: 'Сычева - группа', callCenter: 'КЦ1', calls: 57, deviations: 3 },

        // Данные для сотрудников КЦ2
        { date: '2025-07-01', employee: 'Смирнова А.А.', department: 'Мельникова - группа', callCenter: 'КЦ2', calls: 60, deviations: 3 },
        { date: '2025-07-02', employee: 'Смирнова А.А.', department: 'Мельникова - группа', callCenter: 'КЦ2', calls: 58, deviations: 3 },
        { date: '2025-07-03', employee: 'Смирнова А.А.', department: 'Мельникова - группа', callCenter: 'КЦ2', calls: 62, deviations: 3 }
        // ... и так далее для всех дней и сотрудников
    ]
};

// Функция для получения данных по компании с учетом гранулярности и фильтров
function getCompanyData(startDate, endDate, granularity, selectedCallCenter = 'Все КЦ') {
    // Группировка данных по периодам и контакт-центрам
    const result = {};

    // Получаем уникальные контакт-центры
    let callCenters = [...new Set(mockData.company.map(item => item.callCenter))];

    // Фильтруем по выбранному контакт-центру, если он указан
    if (selectedCallCenter !== 'Все КЦ') {
        callCenters = callCenters.filter(cc => cc === selectedCallCenter);
    }

    // Загружаем данные из JSON файла для колл-центров
    fetch('js/data/call-centers.json')
        .then(response => response.json())
        .then(callCentersData => {
            // Обрабатываем данные в зависимости от выбранного колл-центра
            if (selectedCallCenter === 'Все КЦ') {
                // Суммируем данные по всем колл-центрам
                const totalData = {
                    totalCalls: 0,
                    rpcCalls: 0,
                    deviations: 0
                };

                callCentersData.forEach(cc => {
                    const ccData = cc.granularity[granularity];
                    totalData.totalCalls += ccData.totalCalls;
                    totalData.rpcCalls += ccData.rpcCalls;
                    totalData.deviations += ccData.deviations;
                });

                // Обновляем карточки статистики с суммарными данными
                updateStatCards({
                    'Все КЦ': {
                        calls: totalData.totalCalls,
                        deviations: totalData.deviations,
                        percentage: Math.round((totalData.deviations / totalData.totalCalls) * 100)
                    }
                }, totalData.totalCalls, totalData.deviations, Math.round((totalData.deviations / totalData.totalCalls) * 100));

            } else {
                // Находим данные для выбранного колл-центра
                const selectedCCData = callCentersData.find(cc => cc.name === selectedCallCenter);
                if (selectedCCData) {
                    const ccData = selectedCCData.granularity[granularity];

                    // Обновляем карточки статистики с данными выбранного колл-центра
                    updateStatCards({
                        [selectedCallCenter]: {
                            calls: ccData.totalCalls,
                            deviations: ccData.deviations,
                            percentage: Math.round((ccData.deviations / ccData.totalCalls) * 100)
                        }
                    }, ccData.totalCalls, ccData.deviations, Math.round((ccData.deviations / ccData.totalCalls) * 100));
                }
            }
        })
        .catch(error => console.error('Ошибка при загрузке данных колл-центров:', error));

    callCenters.forEach(callCenter => {
        // Фильтруем данные по контакт-центру
        const filteredData = mockData.company.filter(item => item.callCenter === callCenter);

        // Группируем данные по периодам
        result[callCenter] = groupDataByPeriod(filteredData, 'date', granularity, startDate, endDate);
    });

    return result;
}

// Функция для получения данных по подразделениям с учетом гранулярности и фильтров
function getDepartmentsData(startDate, endDate, granularity, selectedDepartments = [], selectedCallCenter = 'Все КЦ') {
    // Группировка данных по периодам и подразделениям
    const result = {};

    // Получаем уникальные подразделения
    let departments = [...new Set(mockData.departments.map(item => item.department))];

    // Если выбраны конкретные подразделения, фильтруем по ним
    if (selectedDepartments.length > 0) {
        departments = departments.filter(dept => selectedDepartments.includes(dept));
    }

    // Фильтруем данные по выбранному контакт-центру
    let filteredDepartmentsData = mockData.departments;
    if (selectedCallCenter !== 'Все КЦ') {
        // Предполагаем, что у нас есть информация о том, к какому КЦ относится подразделение
        // Если такой информации нет, нужно добавить поле callCenter в данные подразделений
        filteredDepartmentsData = filteredDepartmentsData.filter(item => {
            // Здесь должна быть логика фильтрации по КЦ
            // Для примера предположим, что у нас есть поле callCenter
            return item.callCenter === selectedCallCenter;
        });
    }

    departments.forEach(department => {
        // Фильтруем данные по подразделению
        const filteredData = filteredDepartmentsData.filter(item => item.department === department);

        // Если после фильтрации данных нет, пропускаем это подразделение
        if (filteredData.length === 0) return;

        // Группируем данные по периодам
        result[department] = groupDataByPeriod(filteredData, 'date', granularity, startDate, endDate);
    });

    return result;
}

// Функция для получения данных по сотрудникам с учетом гранулярности и фильтров
function getEmployeesData(startDate, endDate, granularity, selectedDepartments = [], selectedEmployees = [], selectedCallCenter = 'Все КЦ') {
    // Группировка данных по периодам и сотрудникам
    const result = {};

    // Фильтруем сотрудников по выбранным подразделениям, если они указаны
    let filteredEmployees = mockData.employees;

    // Фильтрация по КЦ
    if (selectedCallCenter !== 'Все КЦ') {
        // Предполагаем, что у нас есть информация о том, к какому КЦ относится сотрудник
        // Если такой информации нет, нужно добавить поле callCenter в данные сотрудников
        filteredEmployees = filteredEmployees.filter(item => {
            // Здесь должна быть логика фильтрации по КЦ
            // Для примера предположим, что у нас есть поле callCenter
            return item.callCenter === selectedCallCenter;
        });
    }

    // Фильтрация по подразделениям
    if (selectedDepartments.length > 0) {
        filteredEmployees = filteredEmployees.filter(item => selectedDepartments.includes(item.department));
    }

    // Фильтрация по конкретным сотрудникам
    if (selectedEmployees.length > 0) {
        filteredEmployees = filteredEmployees.filter(item => selectedEmployees.includes(item.employee));
    }

    // Получаем уникальных сотрудников
    const employees = [...new Set(filteredEmployees.map(item => item.employee))];

    employees.forEach(employee => {
        // Фильтруем данные по сотруднику
        const employeeData = filteredEmployees.filter(item => item.employee === employee);

        // Получаем подразделение сотрудника
        const department = employeeData[0]?.department || '';

        // Группируем данные по периодам
        result[employee] = {
            department: department,
            data: groupDataByPeriod(employeeData, 'date', granularity, startDate, endDate)
        };
    });

    return result;
}

// Функция для обновления таблицы компании и карточек статистики
function updateCompanyTable(data, metric) {
    const tableBody = document.querySelector('#companyTab table tbody');
    if (!tableBody) return;

    // Очищаем таблицу
    tableBody.innerHTML = '';

    // Получаем контакт-центры
    const callCenters = Object.keys(data);

    // Суммарные данные для всех КЦ
    let grandTotalCalls = 0;
    let grandTotalDeviations = 0;

    // Данные по каждому КЦ
    const callCenterData = {};

    callCenters.forEach(callCenter => {
        // Суммируем данные по всем периодам
        let totalCalls = 0;
        let totalDeviations = 0;

        Object.values(data[callCenter]).forEach(periodData => {
            totalCalls += periodData.calls;
            totalDeviations += periodData.deviations;
        });

        // Вычисляем процент отклонений
        const percentage = totalCalls > 0 ? Math.round((totalDeviations / totalCalls) * 100) : 0;

        // Сохраняем данные по КЦ
        callCenterData[callCenter] = {
            calls: totalCalls,
            deviations: totalDeviations,
            percentage: percentage
        };

        // Добавляем к общей сумме
        grandTotalCalls += totalCalls;
        grandTotalDeviations += totalDeviations;

        // Генерируем случайную динамику для демонстрации
        const callsDynamics = generateRandomDynamics();
        const deviationsDynamics = generateRandomDynamics();
        const percentageDynamics = generateRandomDynamics(true); // для процентов меньшие значения

        // Создаем строку таблицы
        const row = document.createElement('tr');

        // Добавляем ячейки
        row.innerHTML = `
            <td class="py-4 px-6 font-medium">${callCenter}</td>
            <td class="py-4 px-6 text-center">${totalCalls.toLocaleString()}</td>
            <td class="py-4 px-6 text-center">${totalDeviations.toLocaleString()}</td>
            <td class="py-4 px-6 text-center"><span class="${getPercentageClass(percentage)}">${percentage}%</span></td>
            <td class="py-4 px-6 text-center">
                <span class="mtm-badge ${callsDynamics.class}">${callsDynamics.value}</span>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Вычисляем общий процент отклонений
    const grandTotalPercentage = grandTotalCalls > 0 ? Math.round((grandTotalDeviations / grandTotalCalls) * 100) : 0;

    // Обновляем карточки статистики
    updateStatCards(callCenterData, grandTotalCalls, grandTotalDeviations, grandTotalPercentage);
}

// Функция для обновления карточек статистики
function updateStatCards(callCenterData, totalCalls, totalDeviations, totalPercentage) {
    // Обновляем карточку "Количество звонков"
    document.getElementById('totalCalls').textContent = totalCalls.toLocaleString();

    // Обновляем карточку "Отклонения"
    document.getElementById('totalDeviations').textContent = totalDeviations.toLocaleString();

    // Обновляем карточку "% отклонений"
    document.getElementById('totalPercentage').textContent = totalPercentage.toFixed(1) + '%';

    // Генерируем динамику в зависимости от выбранного режима отображения
    const granularity = document.getElementById('selectedTimeGranularity').textContent;
    let dynamicsLabel;

    if (granularity === 'День') {
        dynamicsLabel = 'к прошлому дню';
    } else if (granularity === 'Неделя') {
        dynamicsLabel = 'WTW';
    } else {
        dynamicsLabel = 'MTM';
    }

    // Обновляем динамику для карточек
    const callsDynamics = generateRandomDynamics();
    const deviationsDynamics = generateRandomDynamics();
    const percentageDynamics = generateRandomDynamics(true); // для процентов меньшие значения

    document.getElementById('callsDynamics').textContent = callsDynamics.value;
    document.getElementById('callsDynamics').className = `mtm-badge ${callsDynamics.class} ml-2`;

    document.getElementById('deviationsDynamics').textContent = deviationsDynamics.value;
    document.getElementById('deviationsDynamics').className = `mtm-badge ${deviationsDynamics.class} ml-2`;

    document.getElementById('percentageDynamics').textContent = percentageDynamics.value;
    document.getElementById('percentageDynamics').className = `mtm-badge ${percentageDynamics.class} ml-2`;

    // Обновляем детали по КЦ в карточках
    const callsDetails = document.getElementById('callsDetails');
    const deviationsDetails = document.getElementById('deviationsDetails');
    const percentageDetails = document.getElementById('percentageDetails');

    callsDetails.innerHTML = '';
    deviationsDetails.innerHTML = '';
    percentageDetails.innerHTML = '';

    Object.keys(callCenterData).forEach(callCenter => {
        const data = callCenterData[callCenter];
        const callsDynamics = generateRandomDynamics();
        const deviationsDynamics = generateRandomDynamics();
        const percentageDynamics = generateRandomDynamics(true);

        // Детали для карточки "Количество звонков"
        const callsDetailItem = document.createElement('div');
        callsDetailItem.className = 'detail-item';
        callsDetailItem.innerHTML = `
            <span class="label">${callCenter}:</span>
            <div class="flex items-center">
                <span class="value">${data.calls.toLocaleString()}</span>
                <span class="mtm-badge ${callsDynamics.class} ml-2">${callsDynamics.value}</span>
            </div>
        `;
        callsDetails.appendChild(callsDetailItem);

        // Детали для карточки "Отклонения"
        const deviationsDetailItem = document.createElement('div');
        deviationsDetailItem.className = 'detail-item';
        deviationsDetailItem.innerHTML = `
            <span class="label">${callCenter}:</span>
            <div class="flex items-center">
                <span class="value">${data.deviations.toLocaleString()}</span>
                <span class="mtm-badge ${deviationsDynamics.class} ml-2">${deviationsDynamics.value}</span>
            </div>
        `;
        deviationsDetails.appendChild(deviationsDetailItem);

        // Детали для карточки "% отклонений"
        const percentageDetailItem = document.createElement('div');
        percentageDetailItem.className = 'detail-item';
        percentageDetailItem.innerHTML = `
            <span class="label">${callCenter}:</span>
            <div class="flex items-center">
                <span class="value">${data.percentage.toFixed(1)}%</span>
                <span class="mtm-badge ${percentageDynamics.class} ml-2">${percentageDynamics.value}</span>
            </div>
        `;
        percentageDetails.appendChild(percentageDetailItem);
    });
}

// Функция для генерации случайной динамики (для демонстрации)
function generateRandomDynamics(isPercentage = false) {
    const isPositive = Math.random() > 0.5;
    let value;

    if (isPercentage) {
        // Для процентов генерируем меньшие значения
        value = (Math.random() * 1.5).toFixed(1);
    } else {
        // Для обычных значений генерируем значения от 1 до 10
        value = Math.floor(Math.random() * 10) + 1;
    }

    const sign = isPositive ? '+' : '-';
    const displayValue = `${sign}${value}%`;
    const className = isPositive ? 'mtm-positive' : 'mtm-negative';

    return {
        value: displayValue,
        class: className
    };
}

// Функция для обновления таблицы подразделений
function updateDepartmentsTable(data, metric) {
    const tableBody = document.querySelector('#departmentsTableBody');
    if (!tableBody) return;

    // Очищаем таблицу
    tableBody.innerHTML = '';

    // Получаем подразделения
    const departments = Object.keys(data);

    departments.forEach(department => {
        // Суммируем данные по всем периодам
        let totalCalls = 0;
        let totalDeviations = 0;

        Object.values(data[department]).forEach(periodData => {
            totalCalls += periodData.calls;
            totalDeviations += periodData.deviations;
        });

        // Вычисляем процент отклонений
        const percentage = totalCalls > 0 ? Math.round((totalDeviations / totalCalls) * 100) : 0;

        // Создаем строку таблицы
        const row = document.createElement('tr');

        // Добавляем ячейки
        row.innerHTML = `
            <td class="py-4 px-6 font-medium">${department}</td>
            <td class="py-4 px-6 text-center">${totalCalls.toLocaleString()}</td>
            <td class="py-4 px-6 text-center">${totalDeviations.toLocaleString()}</td>
            <td class="py-4 px-6 text-center"><span class="${getPercentageClass(percentage)}">${percentage}%</span></td>
        `;

        tableBody.appendChild(row);
    });

    // Метрика обработана
}

// Функция для обновления таблицы сотрудников
function updateEmployeesTable(data, metric) {
    const tableBody = document.querySelector('#employeesTableBody');
    if (!tableBody) return;

    // Очищаем таблицу
    tableBody.innerHTML = '';

    // Получаем сотрудников
    const employees = Object.keys(data);

    employees.forEach(employee => {
        // Получаем подразделение сотрудника
        const department = data[employee].department;

        // Суммируем данные по всем периодам
        let totalCalls = 0;
        let totalDeviations = 0;

        Object.values(data[employee].data).forEach(periodData => {
            totalCalls += periodData.calls;
            totalDeviations += periodData.deviations;
        });

        // Вычисляем процент отклонений
        const percentage = totalCalls > 0 ? Math.round((totalDeviations / totalCalls) * 100) : 0;

        // Создаем строку таблицы
        const row = document.createElement('tr');

        // Добавляем ячейки
        row.innerHTML = `
            <td class="py-4 px-6 font-medium">${employee}</td>
            <td class="py-4 px-6">${department}</td>
            <td class="py-4 px-6 text-center">${totalCalls.toLocaleString()}</td>
            <td class="py-4 px-6 text-center">${totalDeviations.toLocaleString()}</td>
            <td class="py-4 px-6 text-center"><span class="${getPercentageClass(percentage)}">${percentage}%</span></td>
        `;

        tableBody.appendChild(row);
    });

    // Метрика обработана
}

// Вспомогательная функция для определения класса процента отклонений
function getPercentageClass(percentage) {
    if (percentage >= 10) {
        return 'percentage-high';
    } else if (percentage >= 5) {
        return 'percentage-medium';
    } else {
        return 'percentage-low';
    }
}