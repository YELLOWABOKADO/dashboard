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
    
    let tableHTML = '';
    
    // Если выбраны все КЦ, показываем разбивку по КЦ
    if (selectedCallCenter === 'total') {
        const totalData = companyData.total;
        const kc1Data = companyData.kc1;
        const kc2Data = companyData.kc2;
        const rpcTotalData = companyData.rpc.total;
        const nonRpcTotalData = companyData.nonRpc.total;
        const rpcKc1Data = companyData.rpc.kc1;
        const nonRpcKc1Data = companyData.nonRpc.kc1;
        const rpcKc2Data = companyData.rpc.kc2;
        const nonRpcKc2Data = companyData.nonRpc.kc2;
        
        tableHTML = `
            <table class="main-table">
                <thead>
                    <tr>
                        <th>КОЛЛ-ЦЕНТР</th>
                        <th class="text-right">ВСЕГО ЗВОНКОВ</th>
                        <th class="text-right">ОТКЛОНЕНИЯ</th>
                        <th class="text-right">% ОТКЛОНЕНИЙ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="expandable-row" onclick="toggleExpansion('total-row')">
                        <td><strong>Всего</strong> <span class="expand-icon" id="total-icon">▼</span></td>
                        <td class="text-right"><strong>${totalData.calls.toLocaleString()}</strong> <span class="badge badge-success">+1%</span></td>
                        <td class="text-right"><strong>${totalData.deviations.toLocaleString()}</strong> <span class="badge badge-success">+2%</span></td>
                        <td class="text-right"><strong><span class="percentage-medium">${totalData.percentage}%</span></strong> <span class="badge badge-success">+0.5%</span></td>
                    </tr>
                    <tr class="detail-row" id="total-row" style="display: none;">
                        <td style="padding-left: 30px;">RPC</td>
                        <td class="text-right">${rpcTotalData.calls.toLocaleString()} <span class="badge badge-success">+1%</span></td>
                        <td class="text-right">${rpcTotalData.deviations.toLocaleString()} <span class="badge badge-danger">-1%</span></td>
                        <td class="text-right"><span class="percentage-high">${rpcTotalData.percentage}%</span> <span class="badge badge-neutral">0%</span></td>
                    </tr>
                    <tr class="detail-row" id="total-row-2" style="display: none;">
                        <td style="padding-left: 30px;">Не RPC</td>
                        <td class="text-right">${nonRpcTotalData.calls.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                        <td class="text-right">${nonRpcTotalData.deviations.toLocaleString()} <span class="badge badge-success">+3%</span></td>
                        <td class="text-right"><span class="percentage-low">${nonRpcTotalData.percentage}%</span> <span class="badge badge-danger">-2%</span></td>
                    </tr>
                    <tr class="expandable-row" onclick="toggleExpansion('kc1-row')">
                        <td>КЦ 1 <span class="expand-icon" id="kc1-icon">▼</span></td>
                        <td class="text-right">${kc1Data.calls.toLocaleString()} <span class="badge badge-success">+3%</span></td>
                        <td class="text-right">${kc1Data.deviations.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                        <td class="text-right"><span class="percentage-medium">${kc1Data.percentage}%</span> <span class="badge badge-neutral">0%</span></td>
                    </tr>
                    <tr class="detail-row" id="kc1-row" style="display: none;">
                        <td style="padding-left: 30px;">RPC</td>
                        <td class="text-right">${rpcKc1Data.calls.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                        <td class="text-right">${rpcKc1Data.deviations.toLocaleString()} <span class="badge badge-danger">-1%</span></td>
                        <td class="text-right"><span class="percentage-high">${rpcKc1Data.percentage}%</span> <span class="badge badge-neutral">0%</span></td>
                    </tr>
                    <tr class="detail-row" id="kc1-row-2" style="display: none;">
                        <td style="padding-left: 30px;">Не RPC</td>
                        <td class="text-right">${nonRpcKc1Data.calls.toLocaleString()} <span class="badge badge-success">+3%</span></td>
                        <td class="text-right">${nonRpcKc1Data.deviations.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                        <td class="text-right"><span class="percentage-low">${nonRpcKc1Data.percentage}%</span> <span class="badge badge-danger">-2%</span></td>
                    </tr>
                    <tr class="expandable-row" onclick="toggleExpansion('kc2-row')">
                        <td>КЦ 2 <span class="expand-icon" id="kc2-icon">▼</span></td>
                        <td class="text-right">${kc2Data.calls.toLocaleString()} <span class="badge badge-danger">-4%</span></td>
                        <td class="text-right">${kc2Data.deviations.toLocaleString()} <span class="badge badge-success">+1%</span></td>
                        <td class="text-right"><span class="percentage-low">${kc2Data.percentage}%</span> <span class="badge badge-success">+0.3%</span></td>
                    </tr>
                    <tr class="detail-row" id="kc2-row" style="display: none;">
                        <td style="padding-left: 30px;">RPC</td>
                        <td class="text-right">${rpcKc2Data.calls.toLocaleString()} <span class="badge badge-success">+1%</span></td>
                        <td class="text-right">${rpcKc2Data.deviations.toLocaleString()} <span class="badge badge-danger">-2%</span></td>
                        <td class="text-right"><span class="percentage-high">${rpcKc2Data.percentage}%</span> <span class="badge badge-neutral">0%</span></td>
                    </tr>
                    <tr class="detail-row" id="kc2-row-2" style="display: none;">
                        <td style="padding-left: 30px;">Не RPC</td>
                        <td class="text-right">${nonRpcKc2Data.calls.toLocaleString()} <span class="badge badge-danger">-5%</span></td>
                        <td class="text-right">${nonRpcKc2Data.deviations.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                        <td class="text-right"><span class="percentage-low">${nonRpcKc2Data.percentage}%</span> <span class="badge badge-success">+1%</span></td>
                    </tr>
                </tbody>
            </table>
        `;
    } else {
        // Если выбран конкретный КЦ, показываем стандартную таблицу
        const totalData = companyData[selectedCallCenter];
        const rpcData = companyData.rpc[selectedCallCenter];
        const nonRpcData = companyData.nonRpc[selectedCallCenter];
        
        tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ПАРАМЕТР</th>
                        <th class="text-right">ВСЕГО</th>
                        <th class="text-right">RPC</th>
                        <th class="text-right">НЕ RPC</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Оценено звонков</td>
                        <td class="text-right">${totalData.calls.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                        <td class="text-right">${rpcData.calls.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                        <td class="text-right">${nonRpcData.calls.toLocaleString()} <span class="badge badge-success">+3%</span></td>
                    </tr>
                    <tr>
                        <td>Отклонений выявлено</td>
                        <td class="text-right">${totalData.deviations.toLocaleString()} <span class="badge badge-success">+3%</span></td>
                        <td class="text-right">${rpcData.deviations.toLocaleString()} <span class="badge badge-danger">-1%</span></td>
                        <td class="text-right">${nonRpcData.deviations.toLocaleString()} <span class="badge badge-success">+2%</span></td>
                    </tr>
                    <tr>
                        <td>% отклонений</td>
                        <td class="text-right"><span class="percentage-medium">${totalData.percentage}%</span> <span class="badge badge-success">+1%</span></td>
                        <td class="text-right"><span class="percentage-high">${rpcData.percentage}%</span> <span class="badge badge-neutral">0%</span></td>
                        <td class="text-right"><span class="percentage-low">${nonRpcData.percentage}%</span> <span class="badge badge-danger">-3%</span></td>
                    </tr>
                </tbody>
            </table>
        `;
    }
    
    // Обновляем содержимое контейнера
    tableContainer.innerHTML = tableHTML;
}

// Функция для раскрытия/скрытия деталей
function toggleExpansion(rowId) {
    const detailRows = document.querySelectorAll(`[id^="${rowId}"]`);
    const icon = document.getElementById(rowId.replace('-row', '-icon'));
    
    let isExpanded = false;
    detailRows.forEach(row => {
        if (row.style.display === 'none' || row.style.display === '') {
            row.style.display = 'table-row';
            isExpanded = true;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Обновляем иконку
    if (icon) {
        icon.textContent = isExpanded ? '▲' : '▼';
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