/**
 * Логика для вкладки "Компания"
 */

// Данные для разных режимов отображения
const companyMockDataByGranularity = {
    'День': {
        // Данные по RPC
        rpc: {
            total: {
                calls: 500,
                deviations: 65,
                percentage: 13
            },
            kc1: {
                calls: 300,
                deviations: 40,
                percentage: 13
            },
            kc2: {
                calls: 200,
                deviations: 25,
                percentage: 12
            }
        },
        // Данные по не-RPC
        nonRpc: {
            total: {
                calls: 1333,
                deviations: 67,
                percentage: 5
            },
            kc1: {
                calls: 800,
                deviations: 40,
                percentage: 5
            },
            kc2: {
                calls: 533,
                deviations: 27,
                percentage: 5
            }
        },
        // Общие данные
        total: {
            calls: 1833,
            deviations: 132,
            percentage: 7
        },
        kc1: {
            calls: 1100,
            deviations: 80,
            percentage: 7
        },
        kc2: {
            calls: 733,
            deviations: 52,
            percentage: 7
        }
    },
    'Неделя': {
        // Данные по RPC
        rpc: {
            total: {
                calls: 3750,
                deviations: 475,
                percentage: 13
            },
            kc1: {
                calls: 2250,
                deviations: 300,
                percentage: 13
            },
            kc2: {
                calls: 1500,
                deviations: 175,
                percentage: 12
            }
        },
        // Данные по не-RPC
        nonRpc: {
            total: {
                calls: 10000,
                deviations: 500,
                percentage: 5
            },
            kc1: {
                calls: 6000,
                deviations: 300,
                percentage: 5
            },
            kc2: {
                calls: 4000,
                deviations: 200,
                percentage: 5
            }
        },
        // Общие данные
        total: {
            calls: 13750,
            deviations: 975,
            percentage: 7
        },
        kc1: {
            calls: 8250,
            deviations: 600,
            percentage: 7
        },
        kc2: {
            calls: 5500,
            deviations: 375,
            percentage: 7
        }
    },
    'Месяц': {
        // Данные по RPC
        rpc: {
            total: {
                calls: 15000,
                deviations: 1900,
                percentage: 13
            },
            kc1: {
                calls: 9000,
                deviations: 1200,
                percentage: 13
            },
            kc2: {
                calls: 6000,
                deviations: 700,
                percentage: 12
            }
        },
        // Данные по не-RPC
        nonRpc: {
            total: {
                calls: 40000,
                deviations: 2000,
                percentage: 5
            },
            kc1: {
                calls: 24000,
                deviations: 1200,
                percentage: 5
            },
            kc2: {
                calls: 16000,
                deviations: 800,
                percentage: 5
            }
        },
        // Общие данные
        total: {
            calls: 55000,
            deviations: 3900,
            percentage: 7
        },
        kc1: {
            calls: 33000,
            deviations: 2400,
            percentage: 7
        },
        kc2: {
            calls: 22000,
            deviations: 1500,
            percentage: 7
        }
    }
};

// Текущие данные (по умолчанию - месяц)
let companyData = companyMockDataByGranularity['Месяц'];
let selectedCallCenter = 'total'; // По умолчанию показываем суммарные данные

// Функция для обновления данных компании
function updateCompanyData(granularity, callCenter = 'total') {
    // Обновляем текущие данные в зависимости от выбранного режима отображения
    companyData = companyMockDataByGranularity[granularity];
    selectedCallCenter = callCenter;
    
    // Обновляем таблицу с данными
    renderCompanyTable();
}

// Функция для отрисовки таблицы компании
function renderCompanyTable() {
    const tableContainer = document.getElementById('companySummaryTable');
    if (!tableContainer) return;
    
    // Получаем данные в зависимости от выбранного колл-центра
    const totalData = companyData[selectedCallCenter];
    const rpcData = companyData.rpc[selectedCallCenter];
    const nonRpcData = companyData.nonRpc[selectedCallCenter];
    
    // Создаем таблицу
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ПАРАМЕТР</th>
                    <th>ВСЕГО</th>
                    <th>RPC</th>
                    <th>НЕ RPC</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Оценено звонков</td>
                    <td>${totalData.calls.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                    <td>${rpcData.calls.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                    <td>${nonRpcData.calls.toLocaleString()} <span class="badge badge-success">+3%</span></td>
                </tr>
                <tr>
                    <td>Отклонений выявлено</td>
                    <td>${totalData.deviations.toLocaleString()} <span class="badge badge-success">+3%</span></td>
                    <td>${rpcData.deviations.toLocaleString()} <span class="badge badge-danger">-1%</span></td>
                    <td>${nonRpcData.deviations.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                </tr>
                <tr>
                    <td>% отклонений</td>
                    <td><span class="percentage-medium">${totalData.percentage}%</span> <span class="badge badge-success">+1%</span></td>
                    <td><span class="percentage-high">${rpcData.percentage}%</span> <span class="badge badge-info">0%</span></td>
                    <td><span class="percentage-low">${nonRpcData.percentage}%</span> <span class="badge badge-danger">-3%</span></td>
                </tr>
            </tbody>
        </table>
    `;
    
    // Обновляем содержимое контейнера
    tableContainer.innerHTML = tableHTML;
    
    // Также обновляем карточки статистики
    if (typeof loadCallCenterData === 'function') {
        const callCenterSelect = document.getElementById('callCenter');
        if (callCenterSelect) {
            loadCallCenterData(callCenterSelect.value, document.getElementById('timeGranularity').value);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Отрисовываем таблицу с данными компании
    renderCompanyTable();
    
    // Добавляем обработчик события для выбора колл-центра
    const callCenterSelect = document.getElementById('callCenter');
    if (callCenterSelect) {
        callCenterSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            let callCenterKey = 'total';
            
            // Определяем ключ для выбранного колл-центра
            if (selectedValue === 'КЦ1') {
                callCenterKey = 'kc1';
            } else if (selectedValue === 'КЦ2') {
                callCenterKey = 'kc2';
            }
            
            // Обновляем данные с учетом выбранного колл-центра
            updateCompanyData(document.getElementById('timeGranularity').value, callCenterKey);
        });
    }
    
    // Добавляем обработчик события для выбора гранулярности времени
    const timeGranularitySelect = document.getElementById('timeGranularity');
    if (timeGranularitySelect) {
        timeGranularitySelect.addEventListener('change', function() {
            // Обновляем данные с учетом выбранной гранулярности
            updateCompanyData(this.value, selectedCallCenter);
            
            // Также обновляем данные в карточках статистики
            if (typeof loadCallCenterData === 'function') {
                loadCallCenterData(callCenterSelect.value, this.value);
            }
        });
    }
    
    // Обновляем данные при загрузке страницы
    if (typeof loadCallCenterData === 'function' && callCenterSelect && timeGranularitySelect) {
        loadCallCenterData(callCenterSelect.value, timeGranularitySelect.value);
    }
});