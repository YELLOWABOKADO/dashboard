/**
 * Функции для работы с данными компании и их отображением
 */

// Примеры данных для разных режимов отображения
const companyMockDataByGranularity = {
    'День': {
        // Данные по RPC
        rpc: {
            total: {
                calls: 1500,
                deviations: 190,
                percentage: 13
            },
            details: {
                d: { calls: 600, deviations: 65, percentage: 11 },
                p: { calls: 1, deviations: 0, percentage: 0 },
                r: { calls: 130, deviations: 35, percentage: 27 },
                tl: { calls: 769, deviations: 90, percentage: 12 }
            }
        },
        // Данные по не-RPC
        nonRpc: {
            total: {
                calls: 4000,
                deviations: 200,
                percentage: 5
            }
        },
        // Общие данные
        total: {
            calls: 5500,
            deviations: 390,
            percentage: 7
        },
        // Данные по контакт-центрам
        callCenters: [
            {
                name: 'КЦ1',
                total: 2799,
                rpc: 196,
                percentage: 7,
                dynamics: -9
            },
            {
                name: 'КЦ2',
                total: 2201,
                rpc: 104,
                percentage: 5,
                dynamics: 3
            }
        ]
    },
    'Неделя': {
        // Данные по RPC
        rpc: {
            total: {
                calls: 7500,
                deviations: 950,
                percentage: 13
            },
            details: {
                d: { calls: 3000, deviations: 325, percentage: 11 },
                p: { calls: 4, deviations: 1, percentage: 25 },
                r: { calls: 650, deviations: 175, percentage: 27 },
                tl: { calls: 3846, deviations: 450, percentage: 12 }
            }
        },
        // Данные по не-RPC
        nonRpc: {
            total: {
                calls: 20000,
                deviations: 1000,
                percentage: 5
            }
        },
        // Общие данные
        total: {
            calls: 27500,
            deviations: 1950,
            percentage: 7
        },
        // Данные по контакт-центрам
        callCenters: [
            {
                name: 'КЦ1',
                total: 13995,
                rpc: 980,
                percentage: 7,
                dynamics: -7
            },
            {
                name: 'КЦ2',
                total: 11005,
                rpc: 520,
                percentage: 5,
                dynamics: 4
            }
        ]
    },
    'Месяц': {
        // Данные по RPC
        rpc: {
            total: {
                calls: 15000,
                deviations: 1900,
                percentage: 13
            },
            details: {
                d: { calls: 6000, deviations: 649, percentage: 11 },
                p: { calls: 7, deviations: 1, percentage: 14 },
                r: { calls: 1300, deviations: 350, percentage: 27 },
                tl: { calls: 7693, deviations: 900, percentage: 12 }
            }
        },
        // Данные по не-RPC
        nonRpc: {
            total: {
                calls: 40000,
                deviations: 2000,
                percentage: 5
            }
        },
        // Общие данные
        total: {
            calls: 55000,
            deviations: 3900,
            percentage: 7
        },
        // Данные по контакт-центрам
        callCenters: [
            {
                name: 'КЦ1',
                total: 27990,
                rpc: 1961,
                percentage: 7,
                dynamics: -9
            },
            {
                name: 'КЦ2',
                total: 22010,
                rpc: 1039,
                percentage: 5,
                dynamics: 3
            }
        ]
    }
};

// Текущие данные (по умолчанию - месяц)
let companyMockData = companyMockDataByGranularity['Месяц'];

// Функция для генерации динамики в зависимости от режима отображения
function generateDynamics(granularity) {
    // Случайное значение от -10 до +10
    const value = Math.floor(Math.random() * 21) - 10;
    const isPositive = value >= 0;
    
    // Определяем класс и текст для отображения
    let displayText = isPositive ? `+${value}%` : `${value}%`;
    let cssClass = isPositive ? 'mtm-positive' : 'mtm-negative';
    
    // Если значение близко к нулю, используем нейтральный стиль
    if (value > -2 && value < 2) {
        displayText = '0%';
        cssClass = 'mtm-neutral';
    }
    
    return {
        value: value, // Сохраняем числовое значение для возможного использования
        symbol: displayText, // Текст для отображения (процентное значение)
        class: cssClass // CSS класс для стилизации
    };
}

// Функция для обновления данных компании
function updateCompanyData(granularity) {
    // Обновляем текущие данные в зависимости от выбранного режима отображения
    companyMockData = companyMockDataByGranularity[granularity];
    
    // Обновляем карточки RPC
    updateRpcCards(granularity);
    
    // Обновляем таблицу с данными
    updateCompanySummaryTable(granularity);
    
    // Обновляем таблицу с данными по КЦ
    updateCallCentersTable(granularity);
}

// Функция для обновления карточек RPC
function updateRpcCards(granularityMode) {
    // Получаем данные
    const rpcData = companyMockData.rpc;
    
    // Генерируем динамику в зависимости от режима отображения
    const callsDynamics = generateDynamics(granularityMode);
    const deviationsDynamics = generateDynamics(granularityMode);
    const percentageDynamics = generateDynamics(granularityMode);
    
    // Обновляем основные значения
    document.getElementById('totalRpcCalls').textContent = rpcData.total.calls.toLocaleString();
    document.getElementById('rpcCallsDynamics').textContent = callsDynamics.symbol;
    document.getElementById('rpcCallsDynamics').className = `mtm-badge ${callsDynamics.class} ml-2`;
    
    document.getElementById('totalRpcDeviations').textContent = rpcData.total.deviations.toLocaleString();
    document.getElementById('rpcDeviationsDynamics').textContent = deviationsDynamics.symbol;
    document.getElementById('rpcDeviationsDynamics').className = `mtm-badge ${deviationsDynamics.class} ml-2`;
    
    document.getElementById('totalRpcPercentage').textContent = rpcData.total.percentage + '%';
    document.getElementById('rpcPercentageDynamics').textContent = percentageDynamics.symbol;
    document.getElementById('rpcPercentageDynamics').className = `mtm-badge ${percentageDynamics.class} ml-2`;
    
    // Обновляем детали для каждой карточки
    // Для каждого типа (Д, П, Р, ТЛ) генерируем случайную динамику
    const detailsElements = document.querySelectorAll('.detail-item .mtm-badge');
    detailsElements.forEach(element => {
        const dynamics = generateDynamics(granularityMode);
        element.textContent = dynamics.symbol;
        element.className = `mtm-badge ${dynamics.class} ml-2`;
    });
}

// Функция для обновления таблицы с данными компании
function updateCompanySummaryTable(granularityMode) {
    // Обновляем данные в таблице
    const totalData = companyMockData.total;
    const rpcData = companyMockData.rpc.total;
    const nonRpcData = companyMockData.nonRpc.total;
    
    // Обновляем значения в таблице
    const tableRows = document.querySelectorAll('#companyTab .bg-white.rounded-lg.shadow-md:first-of-type tbody tr');
    
    // Первая строка - "Оценено звонков"
    if (tableRows[0]) {
        const cells = tableRows[0].querySelectorAll('td');
        if (cells.length >= 4) {
            // Всего
            cells[1].querySelector('span:first-child').textContent = totalData.calls.toLocaleString();
            // RPC
            cells[2].querySelector('span:first-child').textContent = rpcData.calls.toLocaleString();
            // Не RPC
            cells[3].querySelector('span:first-child').textContent = nonRpcData.calls.toLocaleString();
        }
    }
    
    // Вторая строка - "Отклонений выявлено"
    if (tableRows[1]) {
        const cells = tableRows[1].querySelectorAll('td');
        if (cells.length >= 4) {
            // Всего
            cells[1].querySelector('span:first-child').textContent = totalData.deviations.toLocaleString();
            // RPC
            cells[2].querySelector('span:first-child').textContent = rpcData.deviations.toLocaleString();
            // Не RPC
            cells[3].querySelector('span:first-child').textContent = nonRpcData.deviations.toLocaleString();
        }
    }
    
    // Третья строка - "% отклонений"
    if (tableRows[2]) {
        const cells = tableRows[2].querySelectorAll('td');
        if (cells.length >= 4) {
            // Всего
            cells[1].querySelector('span:first-child').textContent = totalData.percentage + '%';
            // RPC
            cells[2].querySelector('span:first-child').textContent = rpcData.percentage + '%';
            // Не RPC
            cells[3].querySelector('span:first-child').textContent = nonRpcData.percentage + '%';
        }
    }
    
    // Генерируем динамику для каждой ячейки таблицы
    const dynamicsElements = document.querySelectorAll('#companyTab .bg-white.rounded-lg.shadow-md:first-of-type .mtm-badge');
    dynamicsElements.forEach(element => {
        const dynamics = generateDynamics(granularityMode);
        element.textContent = dynamics.symbol;
        element.className = `mtm-badge ${dynamics.class} ml-2`;
    });
}

// Функция для обновления таблицы с данными по КЦ
function updateCallCentersTable(granularityMode) {
    // Получаем выбранный контакт-центр
    const selectedCallCenter = document.getElementById('selectedCallCenter').textContent;
    
    // Получаем данные по контакт-центрам
    let callCenters = companyMockData.callCenters;
    
    // Фильтруем данные по выбранному контакт-центру
    if (selectedCallCenter !== 'Все КЦ') {
        callCenters = callCenters.filter(cc => cc.name === selectedCallCenter);
    }
    
    // Обновляем таблицу с данными по КЦ
    const callCentersTableBody = document.getElementById('callCentersTableBody');
    if (callCentersTableBody) {
        // Очищаем таблицу
        callCentersTableBody.innerHTML = '';
        
        // Добавляем строки для каждого контакт-центра
        callCenters.forEach(cc => {
            // Создаем строку таблицы
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200';
            
            // Определяем класс и текст для динамики
            const isPositive = cc.dynamics >= 0;
            const displayText = isPositive ? `+${cc.dynamics}%` : `${cc.dynamics}%`;
            const cssClass = isPositive ? 'mtm-positive' : 'mtm-negative';
            
            // Добавляем ячейки
            row.innerHTML = `
                <td class="py-4 px-6 text-left font-medium">${cc.name}</td>
                <td class="py-4 px-6 text-center">${cc.total.toLocaleString()}</td>
                <td class="py-4 px-6 text-center">${cc.rpc.toLocaleString()}</td>
                <td class="py-4 px-6 text-center">
                    <span class="text-yellow-500 font-semibold">${cc.percentage}%</span>
                </td>
                <td class="py-4 px-6 text-center">
                    <span class="mtm-badge ${cssClass} ml-2">${displayText}</span>
                </td>
            `;
            
            callCentersTableBody.appendChild(row);
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Получаем текущий режим отображения
    const granularity = document.getElementById('selectedTimeGranularity').textContent;
    
    // Обновляем данные компании
    updateCompanyData(granularity);
    
    // Добавляем обработчик изменения режима отображения
    document.querySelectorAll('input[name="timeGranularity"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const granularity = this.value;
                // Обновляем текст в span
                document.getElementById('selectedTimeGranularity').textContent = granularity;
                // Обновляем данные
                updateCompanyData(granularity);
            }
        });
    });
    
    // Добавляем обработчик кнопки обновления
    document.getElementById('updateButton').addEventListener('click', function() {
        const granularity = document.getElementById('selectedTimeGranularity').textContent;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        // Проверяем ограничения на выбор дат
        if (validateDateRange(startDate, endDate, granularity)) {
            updateCompanyData(granularity);
        } else {
            // Если даты не соответствуют ограничениям, корректируем их
            adjustDateRangeForGranularity(granularity);
            // И обновляем данные
            updateCompanyData(granularity);
        }
    });
    
    // Добавляем обработчик выбора контакт-центра
    document.querySelectorAll('input[name="callCenter"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const selectedCallCenter = this.value;
                document.getElementById('selectedCallCenter').textContent = selectedCallCenter;
                
                // Фильтруем данные по выбранному КЦ
                updateCompanyData(document.getElementById('selectedTimeGranularity').textContent);
            }
        });
    });
});