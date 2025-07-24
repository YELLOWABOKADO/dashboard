/**
 * Логика для вкладки "Компания"
 */

// Данные для разных режимов отображения с предыдущими периодами
const companyMockDataByGranularity = {
    'День': {
        current: {
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
        previous: {
            // Данные по RPC за предыдущий день
            rpc: {
                total: {
                    calls: 485,
                    deviations: 68,
                    percentage: 14
                },
                kc1: {
                    calls: 291,
                    deviations: 42,
                    percentage: 14
                },
                kc2: {
                    calls: 194,
                    deviations: 26,
                    percentage: 13
                }
            },
            // Данные по не-RPC за предыдущий день
            nonRpc: {
                total: {
                    calls: 1268,
                    deviations: 63,
                    percentage: 5
                },
                kc1: {
                    calls: 761,
                    deviations: 38,
                    percentage: 5
                },
                kc2: {
                    calls: 507,
                    deviations: 25,
                    percentage: 5
                }
            },
            // Общие данные за предыдущий день
            total: {
                calls: 1753,
                deviations: 131,
                percentage: 7
            },
            kc1: {
                calls: 1052,
                deviations: 80,
                percentage: 8
            },
            kc2: {
                calls: 701,
                deviations: 51,
                percentage: 7
            }
        }
    },
    'Неделя': {
        current: {
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
        previous: {
            // Данные по RPC за предыдущую неделю
            rpc: {
                total: {
                    calls: 3900,
                    deviations: 507,
                    percentage: 13
                },
                kc1: {
                    calls: 2340,
                    deviations: 320,
                    percentage: 14
                },
                kc2: {
                    calls: 1560,
                    deviations: 187,
                    percentage: 12
                }
            },
            // Данные по не-RPC за предыдущую неделю
            nonRpc: {
                total: {
                    calls: 10400,
                    deviations: 520,
                    percentage: 5
                },
                kc1: {
                    calls: 6240,
                    deviations: 312,
                    percentage: 5
                },
                kc2: {
                    calls: 4160,
                    deviations: 208,
                    percentage: 5
                }
            },
            // Общие данные за предыдущую неделю
            total: {
                calls: 14300,
                deviations: 1027,
                percentage: 7
            },
            kc1: {
                calls: 8580,
                deviations: 632,
                percentage: 7
            },
            kc2: {
                calls: 5720,
                deviations: 395,
                percentage: 7
            }
        }
    },
    'Месяц': {
        current: {
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
        },
        previous: {
            // Данные по RPC за предыдущий месяц
            rpc: {
                total: {
                    calls: 15600,
                    deviations: 2028,
                    percentage: 13
                },
                kc1: {
                    calls: 9360,
                    deviations: 1280,
                    percentage: 14
                },
                kc2: {
                    calls: 6240,
                    deviations: 748,
                    percentage: 12
                }
            },
            // Данные по не-RPC за предыдущий месяц
            nonRpc: {
                total: {
                    calls: 41600,
                    deviations: 2080,
                    percentage: 5
                },
                kc1: {
                    calls: 24960,
                    deviations: 1248,
                    percentage: 5
                },
                kc2: {
                    calls: 16640,
                    deviations: 832,
                    percentage: 5
                }
            },
            // Общие данные за предыдущий месяц
            total: {
                calls: 57200,
                deviations: 4108,
                percentage: 7
            },
            kc1: {
                calls: 34320,
                deviations: 2528,
                percentage: 7
            },
            kc2: {
                calls: 22880,
                deviations: 1580,
                percentage: 7
            }
        }
    }
};

// Текущие данные (по умолчанию - месяц)
let companyData = companyMockDataByGranularity['Месяц'];
let selectedCallCenter = 'total'; // По умолчанию показываем суммарные данные
let currentGranularity = 'Месяц'; // Текущая гранулярность

// Функция для обновления данных компании
function updateCompanyData(granularity, callCenter = 'total') {
    // Обновляем текущие данные в зависимости от выбранного режима отображения
    companyData = companyMockDataByGranularity[granularity];
    selectedCallCenter = callCenter;
    currentGranularity = granularity;
    
    // Обновляем информацию о периоде
    updatePeriodInfo(granularity);
    
    // Обновляем таблицу с данными
    renderCompanyTable();
}

// Функция для обновления информации о периоде сравнения
function updatePeriodInfo(granularity) {
    const periodInfoElement = document.getElementById('periodInfo');
    if (!periodInfoElement) return;
    
    const currentDate = new Date();
    let previousPeriodText = '';
    
    switch (granularity) {
        case 'День':
            const yesterday = new Date(currentDate);
            yesterday.setDate(yesterday.getDate() - 1);
            previousPeriodText = `(${yesterday.toLocaleDateString('ru-RU')})`;
            break;
        case 'Неделя':
            const lastWeekStart = new Date(currentDate);
            lastWeekStart.setDate(lastWeekStart.getDate() - 14);
            const lastWeekEnd = new Date(currentDate);
            lastWeekEnd.setDate(lastWeekEnd.getDate() - 8);
            previousPeriodText = `(${lastWeekStart.toLocaleDateString('ru-RU')} - ${lastWeekEnd.toLocaleDateString('ru-RU')})`;
            break;
        case 'Месяц':
            const lastMonth = new Date(currentDate);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
            const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
            previousPeriodText = `(${lastMonthStart.toLocaleDateString('ru-RU')} - ${lastMonthEnd.toLocaleDateString('ru-RU')})`;
            break;
        default:
            previousPeriodText = '(предыдущий период)';
    }
    
    periodInfoElement.textContent = previousPeriodText;
}

// Функция для расчета процентного изменения
function calculateChange(current, previous) {
    if (!previous || previous === 0) {
        return current > 0 ? 100 : 0;
    }
    
    const change = ((current - previous) / previous) * 100;
    return Math.round(change * 10) / 10; // Округляем до 1 знака после запятой
}

// Функция для создания бейджа с изменением
function createChangeBadge(current, previous) {
    const change = calculateChange(current, previous);
    const sign = change > 0 ? '+' : '';
    const cssClass = change > 0 ? 'badge-success' : (change < 0 ? 'badge-danger' : 'badge-neutral');
    
    return `<span class="badge ${cssClass}">${sign}${change}%</span>`;
}

// Функция для отрисовки таблицы компании
function renderCompanyTable() {
    const tableContainer = document.getElementById('companySummaryTable');
    if (!tableContainer) return;
    
    let tableHTML = '';
    
    // Если выбраны все КЦ, показываем разбивку по КЦ
    if (selectedCallCenter === 'total') {
        const currentData = companyData.current;
        const previousData = companyData.previous;
        
        const totalData = currentData.total;
        const kc1Data = currentData.kc1;
        const kc2Data = currentData.kc2;
        const rpcTotalData = currentData.rpc.total;
        const nonRpcTotalData = currentData.nonRpc.total;
        const rpcKc1Data = currentData.rpc.kc1;
        const nonRpcKc1Data = currentData.nonRpc.kc1;
        const rpcKc2Data = currentData.rpc.kc2;
        const nonRpcKc2Data = currentData.nonRpc.kc2;
        
        // Данные предыдущего периода
        const prevTotalData = previousData.total;
        const prevKc1Data = previousData.kc1;
        const prevKc2Data = previousData.kc2;
        const prevRpcTotalData = previousData.rpc.total;
        const prevNonRpcTotalData = previousData.nonRpc.total;
        const prevRpcKc1Data = previousData.rpc.kc1;
        const prevNonRpcKc1Data = previousData.nonRpc.kc1;
        const prevRpcKc2Data = previousData.rpc.kc2;
        const prevNonRpcKc2Data = previousData.nonRpc.kc2;
        
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
                        <td class="text-right"><strong>${totalData.calls.toLocaleString()}</strong> ${createChangeBadge(totalData.calls, prevTotalData.calls)}</td>
                        <td class="text-right"><strong>${totalData.deviations.toLocaleString()}</strong> ${createChangeBadge(totalData.deviations, prevTotalData.deviations)}</td>
                        <td class="text-right"><strong><span class="percentage-medium">${totalData.percentage}%</span></strong> ${createChangeBadge(totalData.percentage, prevTotalData.percentage)}</td>
                    </tr>
                    <tr class="detail-row" id="total-row" style="display: none;">
                        <td style="padding-left: 30px;">RPC</td>
                        <td class="text-right">${rpcTotalData.calls.toLocaleString()} ${createChangeBadge(rpcTotalData.calls, prevRpcTotalData.calls)}</td>
                        <td class="text-right">${rpcTotalData.deviations.toLocaleString()} ${createChangeBadge(rpcTotalData.deviations, prevRpcTotalData.deviations)}</td>
                        <td class="text-right"><span class="percentage-high">${rpcTotalData.percentage}%</span> ${createChangeBadge(rpcTotalData.percentage, prevRpcTotalData.percentage)}</td>
                    </tr>
                    <tr class="detail-row" id="total-row-2" style="display: none;">
                        <td style="padding-left: 30px;">Не RPC</td>
                        <td class="text-right">${nonRpcTotalData.calls.toLocaleString()} ${createChangeBadge(nonRpcTotalData.calls, prevNonRpcTotalData.calls)}</td>
                        <td class="text-right">${nonRpcTotalData.deviations.toLocaleString()} ${createChangeBadge(nonRpcTotalData.deviations, prevNonRpcTotalData.deviations)}</td>
                        <td class="text-right"><span class="percentage-low">${nonRpcTotalData.percentage}%</span> ${createChangeBadge(nonRpcTotalData.percentage, prevNonRpcTotalData.percentage)}</td>
                    </tr>
                    <tr class="expandable-row" onclick="toggleExpansion('kc1-row')">
                        <td>КЦ 1 <span class="expand-icon" id="kc1-icon">▼</span></td>
                        <td class="text-right">${kc1Data.calls.toLocaleString()} ${createChangeBadge(kc1Data.calls, prevKc1Data.calls)}</td>
                        <td class="text-right">${kc1Data.deviations.toLocaleString()} ${createChangeBadge(kc1Data.deviations, prevKc1Data.deviations)}</td>
                        <td class="text-right"><span class="percentage-medium">${kc1Data.percentage}%</span> ${createChangeBadge(kc1Data.percentage, prevKc1Data.percentage)}</td>
                    </tr>
                    <tr class="detail-row" id="kc1-row" style="display: none;">
                        <td style="padding-left: 30px;">RPC</td>
                        <td class="text-right">${rpcKc1Data.calls.toLocaleString()} ${createChangeBadge(rpcKc1Data.calls, prevRpcKc1Data.calls)}</td>
                        <td class="text-right">${rpcKc1Data.deviations.toLocaleString()} ${createChangeBadge(rpcKc1Data.deviations, prevRpcKc1Data.deviations)}</td>
                        <td class="text-right"><span class="percentage-high">${rpcKc1Data.percentage}%</span> ${createChangeBadge(rpcKc1Data.percentage, prevRpcKc1Data.percentage)}</td>
                    </tr>
                    <tr class="detail-row" id="kc1-row-2" style="display: none;">
                        <td style="padding-left: 30px;">Не RPC</td>
                        <td class="text-right">${nonRpcKc1Data.calls.toLocaleString()} ${createChangeBadge(nonRpcKc1Data.calls, prevNonRpcKc1Data.calls)}</td>
                        <td class="text-right">${nonRpcKc1Data.deviations.toLocaleString()} ${createChangeBadge(nonRpcKc1Data.deviations, prevNonRpcKc1Data.deviations)}</td>
                        <td class="text-right"><span class="percentage-low">${nonRpcKc1Data.percentage}%</span> ${createChangeBadge(nonRpcKc1Data.percentage, prevNonRpcKc1Data.percentage)}</td>
                    </tr>
                    <tr class="expandable-row" onclick="toggleExpansion('kc2-row')">
                        <td>КЦ 2 <span class="expand-icon" id="kc2-icon">▼</span></td>
                        <td class="text-right">${kc2Data.calls.toLocaleString()} ${createChangeBadge(kc2Data.calls, prevKc2Data.calls)}</td>
                        <td class="text-right">${kc2Data.deviations.toLocaleString()} ${createChangeBadge(kc2Data.deviations, prevKc2Data.deviations)}</td>
                        <td class="text-right"><span class="percentage-low">${kc2Data.percentage}%</span> ${createChangeBadge(kc2Data.percentage, prevKc2Data.percentage)}</td>
                    </tr>
                    <tr class="detail-row" id="kc2-row" style="display: none;">
                        <td style="padding-left: 30px;">RPC</td>
                        <td class="text-right">${rpcKc2Data.calls.toLocaleString()} ${createChangeBadge(rpcKc2Data.calls, prevRpcKc2Data.calls)}</td>
                        <td class="text-right">${rpcKc2Data.deviations.toLocaleString()} ${createChangeBadge(rpcKc2Data.deviations, prevRpcKc2Data.deviations)}</td>
                        <td class="text-right"><span class="percentage-high">${rpcKc2Data.percentage}%</span> ${createChangeBadge(rpcKc2Data.percentage, prevRpcKc2Data.percentage)}</td>
                    </tr>
                    <tr class="detail-row" id="kc2-row-2" style="display: none;">
                        <td style="padding-left: 30px;">Не RPC</td>
                        <td class="text-right">${nonRpcKc2Data.calls.toLocaleString()} ${createChangeBadge(nonRpcKc2Data.calls, prevNonRpcKc2Data.calls)}</td>
                        <td class="text-right">${nonRpcKc2Data.deviations.toLocaleString()} ${createChangeBadge(nonRpcKc2Data.deviations, prevNonRpcKc2Data.deviations)}</td>
                        <td class="text-right"><span class="percentage-low">${nonRpcKc2Data.percentage}%</span> ${createChangeBadge(nonRpcKc2Data.percentage, prevNonRpcKc2Data.percentage)}</td>
                    </tr>
                </tbody>
            </table>
        `;
    } else {
        // Если выбран конкретный КЦ, показываем стандартную таблицу
        const currentData = companyData.current;
        const previousData = companyData.previous;
        
        const totalData = currentData[selectedCallCenter];
        const rpcData = currentData.rpc[selectedCallCenter];
        const nonRpcData = currentData.nonRpc[selectedCallCenter];
        
        const prevTotalData = previousData[selectedCallCenter];
        const prevRpcData = previousData.rpc[selectedCallCenter];
        const prevNonRpcData = previousData.nonRpc[selectedCallCenter];
        
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
                        <td class="text-right">${totalData.calls.toLocaleString()} ${createChangeBadge(totalData.calls, prevTotalData.calls)}</td>
                        <td class="text-right">${rpcData.calls.toLocaleString()} ${createChangeBadge(rpcData.calls, prevRpcData.calls)}</td>
                        <td class="text-right">${nonRpcData.calls.toLocaleString()} ${createChangeBadge(nonRpcData.calls, prevNonRpcData.calls)}</td>
                    </tr>
                    <tr>
                        <td>Отклонений выявлено</td>
                        <td class="text-right">${totalData.deviations.toLocaleString()} ${createChangeBadge(totalData.deviations, prevTotalData.deviations)}</td>
                        <td class="text-right">${rpcData.deviations.toLocaleString()} ${createChangeBadge(rpcData.deviations, prevRpcData.deviations)}</td>
                        <td class="text-right">${nonRpcData.deviations.toLocaleString()} ${createChangeBadge(nonRpcData.deviations, prevNonRpcData.deviations)}</td>
                    </tr>
                    <tr>
                        <td>% отклонений</td>
                        <td class="text-right"><span class="percentage-medium">${totalData.percentage}%</span> ${createChangeBadge(totalData.percentage, prevTotalData.percentage)}</td>
                        <td class="text-right"><span class="percentage-high">${rpcData.percentage}%</span> ${createChangeBadge(rpcData.percentage, prevRpcData.percentage)}</td>
                        <td class="text-right"><span class="percentage-low">${nonRpcData.percentage}%</span> ${createChangeBadge(nonRpcData.percentage, prevNonRpcData.percentage)}</td>
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