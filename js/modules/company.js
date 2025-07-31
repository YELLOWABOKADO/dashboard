/**
 * Модуль управления данными компании
 */

// Состояние сортировки для компании
let companySortState = {
    column: 'percentage', // по умолчанию сортируем по % отклонений
    direction: 'desc' // по убыванию (сначала худшие показатели)
};

// Сохраняем данные для повторного использования при сортировке
let cachedCompanyData = null;

// Функция для получения индикатора сортировки
function getSortIndicator(column) {
    if (companySortState.column !== column) {
        return '<span class="sort-indicator">↕</span>';
    }
    return companySortState.direction === 'asc' 
        ? '<span class="sort-indicator active">↑</span>' 
        : '<span class="sort-indicator active">↓</span>';
}

// Обновление данных компании
async function updateCompanyData() {
    console.log('=== updateCompanyData вызвана ===');
    
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const granularity = document.getElementById('timeGranularity').value;
    const callCenter = document.getElementById('callCenter').value;
    
    console.log('Параметры компании:', { startDate, endDate, granularity, callCenter });
    
    if (!validateDateRange(startDate, endDate, granularity)) {
        console.log('Валидация дат не прошла');
        return;
    }
    
    showLoading('companySummaryTable');
    
    try {
        // Проверяем, что функция getCompanyData загружена
        if (typeof getCompanyData !== 'function') {
            throw new Error('getCompanyData не загружена. Проверьте подключение real-data-processor.js');
        }
        
        const companyData = await getCompanyData(startDate, endDate, granularity, callCenter);
        console.log('Получены данные компании:', companyData);
        
        if (companyData) {
            renderCompanyTable(companyData);
        } else {
            console.log('companyData пустые, показываем заглушку');
            showError('companySummaryTable', 'Нет данных для выбранных фильтров');
        }
    } catch (error) {
        console.error('Ошибка загрузки данных компании:', error);
        showError('companySummaryTable', error.message);
    }
}

// Отрисовка таблицы компании (простая версия без сворачивания)
function renderCompanyTable(companyData) {
    const tableContainer = document.getElementById('companySummaryTable');
    if (!tableContainer) return;

    console.log('=== renderCompanyTable вызвана ===', companyData);
    
    // Сохраняем данные для повторного использования при сортировке
    cachedCompanyData = companyData;

    if (!companyData) {
        tableContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
                <h4>⚠️ Нет данных</h4>
                <p>Данные для выбранных фильтров не найдены</p>
            </div>
        `;
        return;
    }

    // Простая таблица компании без сворачивания
    let tableHTML = `
        <h4>Сводная информация по компании</h4>
        <table>
            <thead>
                <tr>
                    <th class="sortable-header" data-column="name">КОЛЛ-ЦЕНТР ${getSortIndicator('name')}</th>
                    <th class="text-right sortable-header" data-column="calls">ВСЕГО ЗВОНКОВ ${getSortIndicator('calls')}</th>
                    <th class="text-right sortable-header" data-column="deviations">ОТКЛОНЕНИЙ ${getSortIndicator('deviations')}</th>
                    <th class="text-right sortable-header" data-column="percentage">% ОТКЛОНЕНИЙ ${getSortIndicator('percentage')}</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Общие данные - Всего
    const totalCurrent = companyData.current.total;
    const totalPrevious = companyData.previous.total;
    
    // Получаем значение выбранного КЦ из фильтра
    const selectedCallCenter = document.getElementById('callCenter').value;
    
    // Показываем блок "Всего" только если выбраны "Все КЦ"
    if (selectedCallCenter === 'Все КЦ') {
        // Вычисляем процентные изменения
        const totalCallsChangePercent = totalPrevious.calls > 0 ? ((totalCurrent.calls - totalPrevious.calls) / totalPrevious.calls * 100) : 0;
        const totalDeviationsChangePercent = totalPrevious.deviations > 0 ? ((totalCurrent.deviations - totalPrevious.deviations) / totalPrevious.deviations * 100) : 0;
        const totalPercentageChange = totalCurrent.percentage - totalPrevious.percentage;

        // Главная строка "Всего"
        tableHTML += `
            <tr>
                <td><strong>Всего</strong></td>
                <td class="text-right"><strong>${totalCurrent.calls.toLocaleString()}</strong> ${createChangeBadge(totalCallsChangePercent, 'percentage')}</td>
                <td class="text-right"><strong>${totalCurrent.deviations.toLocaleString()}</strong> ${createChangeBadge(totalDeviationsChangePercent, 'percentage')}</td>
                <td class="text-right"><strong><span class="${getPercentageClass(totalCurrent.percentage)}">${totalCurrent.percentage}%</span></strong> ${createChangeBadge(totalPercentageChange, 'percentage')}</td>
            </tr>
        `;

        // RPC и не-RPC данные (всегда видимы)
        if (companyData.current.rpc && companyData.current.nonRpc) {
            // RPC данные
            const rpcCurrent = companyData.current.rpc.total;
            const rpcPrevious = companyData.previous.rpc.total;
            
            const rpcCallsChangePercent = rpcPrevious.calls > 0 ? ((rpcCurrent.calls - rpcPrevious.calls) / rpcPrevious.calls * 100) : 0;
            const rpcDeviationsChangePercent = rpcPrevious.deviations > 0 ? ((rpcCurrent.deviations - rpcPrevious.deviations) / rpcPrevious.deviations * 100) : 0;
            const rpcPercentageChange = rpcCurrent.percentage - rpcPrevious.percentage;

            tableHTML += `
                <tr style="background-color: #f8f9fa;">
                    <td style="padding-left: 20px;">├─ RPC</td>
                    <td class="text-right">${rpcCurrent.calls.toLocaleString()} ${createChangeBadge(rpcCallsChangePercent, 'percentage')}</td>
                    <td class="text-right">${rpcCurrent.deviations.toLocaleString()} ${createChangeBadge(rpcDeviationsChangePercent, 'percentage')}</td>
                    <td class="text-right"><span class="${getPercentageClass(rpcCurrent.percentage)}">${rpcCurrent.percentage}%</span> ${createChangeBadge(rpcPercentageChange, 'percentage')}</td>
                </tr>
            `;

            // Не-RPC данные
            const nonRpcCurrent = companyData.current.nonRpc.total;
            const nonRpcPrevious = companyData.previous.nonRpc.total;
            
            const nonRpcCallsChangePercent = nonRpcPrevious.calls > 0 ? ((nonRpcCurrent.calls - nonRpcPrevious.calls) / nonRpcPrevious.calls * 100) : 0;
            const nonRpcDeviationsChangePercent = nonRpcPrevious.deviations > 0 ? ((nonRpcCurrent.deviations - nonRpcPrevious.deviations) / nonRpcPrevious.deviations * 100) : 0;
            const nonRpcPercentageChange = nonRpcCurrent.percentage - nonRpcPrevious.percentage;

            tableHTML += `
                <tr style="background-color: #f8f9fa;">
                    <td style="padding-left: 20px;">└─ Не RPC</td>
                    <td class="text-right">${nonRpcCurrent.calls.toLocaleString()} ${createChangeBadge(nonRpcCallsChangePercent, 'percentage')}</td>
                    <td class="text-right">${nonRpcCurrent.deviations.toLocaleString()} ${createChangeBadge(nonRpcDeviationsChangePercent, 'percentage')}</td>
                    <td class="text-right"><span class="${getPercentageClass(nonRpcCurrent.percentage)}">${nonRpcCurrent.percentage}%</span> ${createChangeBadge(nonRpcPercentageChange, 'percentage')}</td>
                </tr>
            `;
        }
    }

    // Показываем КЦ если есть данные
    if (companyData.activeKCs && companyData.activeKCs.has('kc1')) {
        const kc1TotalCurrent = companyData.current.kc1;
        const kc1TotalPrevious = companyData.previous.kc1;
        
        // Вычисляем процентные изменения для КЦ1
        const kc1CallsChangePercent = kc1TotalPrevious.calls > 0 ? ((kc1TotalCurrent.calls - kc1TotalPrevious.calls) / kc1TotalPrevious.calls * 100) : 0;
        const kc1DeviationsChangePercent = kc1TotalPrevious.deviations > 0 ? ((kc1TotalCurrent.deviations - kc1TotalPrevious.deviations) / kc1TotalPrevious.deviations * 100) : 0;
        const kc1TotalPercentageChange = kc1TotalCurrent.percentage - kc1TotalPrevious.percentage;

        // Главная строка КЦ1
        tableHTML += `
            <tr>
                <td><strong>КЦ1</strong></td>
                <td class="text-right"><strong>${kc1TotalCurrent.calls.toLocaleString()}</strong> ${createChangeBadge(kc1CallsChangePercent, 'percentage')}</td>
                <td class="text-right"><strong>${kc1TotalCurrent.deviations.toLocaleString()}</strong> ${createChangeBadge(kc1DeviationsChangePercent, 'percentage')}</td>
                <td class="text-right"><strong><span class="${getPercentageClass(kc1TotalCurrent.percentage)}">${kc1TotalCurrent.percentage}%</span></strong> ${createChangeBadge(kc1TotalPercentageChange, 'percentage')}</td>
            </tr>
        `;

        // КЦ1 RPC и не-RPC данные (всегда видимы)
        if (companyData.current.rpc.kc1 && companyData.current.nonRpc.kc1) {
            // КЦ1 RPC данные
            const kc1RpcCurrent = companyData.current.rpc.kc1;
            const kc1RpcPrevious = companyData.previous.rpc.kc1;
            
            const kc1RpcCallsChangePercent = kc1RpcPrevious.calls > 0 ? ((kc1RpcCurrent.calls - kc1RpcPrevious.calls) / kc1RpcPrevious.calls * 100) : 0;
            const kc1RpcDeviationsChangePercent = kc1RpcPrevious.deviations > 0 ? ((kc1RpcCurrent.deviations - kc1RpcPrevious.deviations) / kc1RpcPrevious.deviations * 100) : 0;
            const kc1RpcPercentageChange = kc1RpcCurrent.percentage - kc1RpcPrevious.percentage;

            tableHTML += `
                <tr style="background-color: #f8f9fa;">
                    <td style="padding-left: 20px;">├─ RPC</td>
                    <td class="text-right">${kc1RpcCurrent.calls.toLocaleString()} ${createChangeBadge(kc1RpcCallsChangePercent, 'percentage')}</td>
                    <td class="text-right">${kc1RpcCurrent.deviations.toLocaleString()} ${createChangeBadge(kc1RpcDeviationsChangePercent, 'percentage')}</td>
                    <td class="text-right"><span class="${getPercentageClass(kc1RpcCurrent.percentage)}">${kc1RpcCurrent.percentage}%</span> ${createChangeBadge(kc1RpcPercentageChange, 'percentage')}</td>
                </tr>
            `;

            // КЦ1 Не-RPC данные
            const kc1NonRpcCurrent = companyData.current.nonRpc.kc1;
            const kc1NonRpcPrevious = companyData.previous.nonRpc.kc1;
            
            const kc1NonRpcCallsChangePercent = kc1NonRpcPrevious.calls > 0 ? ((kc1NonRpcCurrent.calls - kc1NonRpcPrevious.calls) / kc1NonRpcPrevious.calls * 100) : 0;
            const kc1NonRpcDeviationsChangePercent = kc1NonRpcPrevious.deviations > 0 ? ((kc1NonRpcCurrent.deviations - kc1NonRpcPrevious.deviations) / kc1NonRpcPrevious.deviations * 100) : 0;
            const kc1NonRpcPercentageChange = kc1NonRpcCurrent.percentage - kc1NonRpcPrevious.percentage;

            tableHTML += `
                <tr style="background-color: #f8f9fa;">
                    <td style="padding-left: 20px;">└─ Не RPC</td>
                    <td class="text-right">${kc1NonRpcCurrent.calls.toLocaleString()} ${createChangeBadge(kc1NonRpcCallsChangePercent, 'percentage')}</td>
                    <td class="text-right">${kc1NonRpcCurrent.deviations.toLocaleString()} ${createChangeBadge(kc1NonRpcDeviationsChangePercent, 'percentage')}</td>
                    <td class="text-right"><span class="${getPercentageClass(kc1NonRpcCurrent.percentage)}">${kc1NonRpcCurrent.percentage}%</span> ${createChangeBadge(kc1NonRpcPercentageChange, 'percentage')}</td>
                </tr>
            `;
        }
    }

    if (companyData.activeKCs && companyData.activeKCs.has('kc2')) {
        const kc2TotalCurrent = companyData.current.kc2;
        const kc2TotalPrevious = companyData.previous.kc2;
        
        // Вычисляем процентные изменения для КЦ2
        const kc2CallsChangePercent = kc2TotalPrevious.calls > 0 ? ((kc2TotalCurrent.calls - kc2TotalPrevious.calls) / kc2TotalPrevious.calls * 100) : 0;
        const kc2DeviationsChangePercent = kc2TotalPrevious.deviations > 0 ? ((kc2TotalCurrent.deviations - kc2TotalPrevious.deviations) / kc2TotalPrevious.deviations * 100) : 0;
        const kc2TotalPercentageChange = kc2TotalCurrent.percentage - kc2TotalPrevious.percentage;

        // Главная строка КЦ2
        tableHTML += `
            <tr>
                <td><strong>КЦ2</strong></td>
                <td class="text-right"><strong>${kc2TotalCurrent.calls.toLocaleString()}</strong> ${createChangeBadge(kc2CallsChangePercent, 'percentage')}</td>
                <td class="text-right"><strong>${kc2TotalCurrent.deviations.toLocaleString()}</strong> ${createChangeBadge(kc2DeviationsChangePercent, 'percentage')}</td>
                <td class="text-right"><strong><span class="${getPercentageClass(kc2TotalCurrent.percentage)}">${kc2TotalCurrent.percentage}%</span></strong> ${createChangeBadge(kc2TotalPercentageChange, 'percentage')}</td>
            </tr>
        `;

        // КЦ2 RPC и не-RPC данные (всегда видимы)
        if (companyData.current.rpc.kc2 && companyData.current.nonRpc.kc2) {
            // КЦ2 RPC данные
            const kc2RpcCurrent = companyData.current.rpc.kc2;
            const kc2RpcPrevious = companyData.previous.rpc.kc2;
            
            const kc2RpcCallsChangePercent = kc2RpcPrevious.calls > 0 ? ((kc2RpcCurrent.calls - kc2RpcPrevious.calls) / kc2RpcPrevious.calls * 100) : 0;
            const kc2RpcDeviationsChangePercent = kc2RpcPrevious.deviations > 0 ? ((kc2RpcCurrent.deviations - kc2RpcPrevious.deviations) / kc2RpcPrevious.deviations * 100) : 0;
            const kc2RpcPercentageChange = kc2RpcCurrent.percentage - kc2RpcPrevious.percentage;

            tableHTML += `
                <tr style="background-color: #f8f9fa;">
                    <td style="padding-left: 20px;">├─ RPC</td>
                    <td class="text-right">${kc2RpcCurrent.calls.toLocaleString()} ${createChangeBadge(kc2RpcCallsChangePercent, 'percentage')}</td>
                    <td class="text-right">${kc2RpcCurrent.deviations.toLocaleString()} ${createChangeBadge(kc2RpcDeviationsChangePercent, 'percentage')}</td>
                    <td class="text-right"><span class="${getPercentageClass(kc2RpcCurrent.percentage)}">${kc2RpcCurrent.percentage}%</span> ${createChangeBadge(kc2RpcPercentageChange, 'percentage')}</td>
                </tr>
            `;

            // КЦ2 Не-RPC данные
            const kc2NonRpcCurrent = companyData.current.nonRpc.kc2;
            const kc2NonRpcPrevious = companyData.previous.nonRpc.kc2;
            
            const kc2NonRpcCallsChangePercent = kc2NonRpcPrevious.calls > 0 ? ((kc2NonRpcCurrent.calls - kc2NonRpcPrevious.calls) / kc2NonRpcPrevious.calls * 100) : 0;
            const kc2NonRpcDeviationsChangePercent = kc2NonRpcPrevious.deviations > 0 ? ((kc2NonRpcCurrent.deviations - kc2NonRpcPrevious.deviations) / kc2NonRpcPrevious.deviations * 100) : 0;
            const kc2NonRpcPercentageChange = kc2NonRpcCurrent.percentage - kc2NonRpcPrevious.percentage;

            tableHTML += `
                <tr style="background-color: #f8f9fa;">
                    <td style="padding-left: 20px;">└─ Не RPC</td>
                    <td class="text-right">${kc2NonRpcCurrent.calls.toLocaleString()} ${createChangeBadge(kc2NonRpcCallsChangePercent, 'percentage')}</td>
                    <td class="text-right">${kc2NonRpcCurrent.deviations.toLocaleString()} ${createChangeBadge(kc2NonRpcDeviationsChangePercent, 'percentage')}</td>
                    <td class="text-right"><span class="${getPercentageClass(kc2NonRpcCurrent.percentage)}">${kc2NonRpcCurrent.percentage}%</span> ${createChangeBadge(kc2NonRpcPercentageChange, 'percentage')}</td>
                </tr>
            `;
        }
    }

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
    console.log('=== Таблица с RPC разбивкой отрисована ===');
    
    // Добавляем обработчики кликов для сортировки
    setTimeout(() => {
        const sortableHeaders = document.querySelectorAll('#companySummaryTable .sortable-header');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const column = this.getAttribute('data-column');
                console.log('Клик по заголовку компании:', column);
                
                // Если кликнули по той же колонке, меняем направление
                if (companySortState.column === column) {
                    companySortState.direction = companySortState.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    // Если новая колонка, устанавливаем направление по умолчанию
                    companySortState.column = column;
                    companySortState.direction = column === 'percentage' ? 'desc' : 'asc';
                }
                
                console.log('Новое состояние сортировки компании:', companySortState);
                
                // Перерисовываем таблицу с новой сортировкой
                renderCompanyTableSorted(cachedCompanyData);
            });
        });
    }, 100);
}

// Отрисовка таблицы компании с сортировкой
function renderCompanyTableSorted(companyData) {
    const tableContainer = document.getElementById('companySummaryTable');
    if (!tableContainer) return;

    console.log('=== renderCompanyTableSorted вызвана ===', companyData);

    if (!companyData) {
        tableContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
                <h4>⚠️ Нет данных</h4>
                <p>Данные для выбранных фильтров не найдены</p>
            </div>
        `;
        return;
    }

    // Создаем массив строк для сортировки
    let rowsArray = [];
    
    // Получаем значение выбранного КЦ из фильтра
    const selectedCallCenter = document.getElementById('callCenter').value;
    
    // Добавляем строку "Всего" если выбраны "Все КЦ"
    if (selectedCallCenter === 'Все КЦ') {
        const totalCurrent = companyData.current.total;
        const totalPrevious = companyData.previous.total;
        
        rowsArray.push({
            name: 'Всего',
            calls: totalCurrent.calls,
            deviations: totalCurrent.deviations,
            percentage: totalCurrent.percentage,
            type: 'main',
            html: generateRowHTML('Всего', totalCurrent, totalPrevious, 'main')
        });

        // Добавляем RPC и не-RPC подстроки
        if (companyData.current.rpc && companyData.current.nonRpc) {
            const rpcCurrent = companyData.current.rpc.total;
            const rpcPrevious = companyData.previous.rpc.total;
            
            rowsArray.push({
                name: 'RPC',
                calls: rpcCurrent.calls,
                deviations: rpcCurrent.deviations,
                percentage: rpcCurrent.percentage,
                type: 'sub',
                html: generateRowHTML('├─ RPC', rpcCurrent, rpcPrevious, 'sub')
            });

            const nonRpcCurrent = companyData.current.nonRpc.total;
            const nonRpcPrevious = companyData.previous.nonRpc.total;
            
            rowsArray.push({
                name: 'Не RPC',
                calls: nonRpcCurrent.calls,
                deviations: nonRpcCurrent.deviations,
                percentage: nonRpcCurrent.percentage,
                type: 'sub',
                html: generateRowHTML('└─ Не RPC', nonRpcCurrent, nonRpcPrevious, 'sub')
            });
        }
    }

    // Добавляем КЦ1 если есть данные
    if (companyData.activeKCs && companyData.activeKCs.has('kc1')) {
        const kc1TotalCurrent = companyData.current.kc1;
        const kc1TotalPrevious = companyData.previous.kc1;
        
        rowsArray.push({
            name: 'КЦ1',
            calls: kc1TotalCurrent.calls,
            deviations: kc1TotalCurrent.deviations,
            percentage: kc1TotalCurrent.percentage,
            type: 'main',
            html: generateRowHTML('КЦ1', kc1TotalCurrent, kc1TotalPrevious, 'main')
        });

        // КЦ1 RPC и не-RPC подстроки
        if (companyData.current.rpc.kc1 && companyData.current.nonRpc.kc1) {
            const kc1RpcCurrent = companyData.current.rpc.kc1;
            const kc1RpcPrevious = companyData.previous.rpc.kc1;
            
            rowsArray.push({
                name: 'КЦ1 RPC',
                calls: kc1RpcCurrent.calls,
                deviations: kc1RpcCurrent.deviations,
                percentage: kc1RpcCurrent.percentage,
                type: 'sub',
                html: generateRowHTML('├─ RPC', kc1RpcCurrent, kc1RpcPrevious, 'sub')
            });

            const kc1NonRpcCurrent = companyData.current.nonRpc.kc1;
            const kc1NonRpcPrevious = companyData.previous.nonRpc.kc1;
            
            rowsArray.push({
                name: 'КЦ1 Не RPC',
                calls: kc1NonRpcCurrent.calls,
                deviations: kc1NonRpcCurrent.deviations,
                percentage: kc1NonRpcCurrent.percentage,
                type: 'sub',
                html: generateRowHTML('└─ Не RPC', kc1NonRpcCurrent, kc1NonRpcPrevious, 'sub')
            });
        }
    }

    // Добавляем КЦ2 если есть данные
    if (companyData.activeKCs && companyData.activeKCs.has('kc2')) {
        const kc2TotalCurrent = companyData.current.kc2;
        const kc2TotalPrevious = companyData.previous.kc2;
        
        rowsArray.push({
            name: 'КЦ2',
            calls: kc2TotalCurrent.calls,
            deviations: kc2TotalCurrent.deviations,
            percentage: kc2TotalCurrent.percentage,
            type: 'main',
            html: generateRowHTML('КЦ2', kc2TotalCurrent, kc2TotalPrevious, 'main')
        });

        // КЦ2 RPC и не-RPC подстроки
        if (companyData.current.rpc.kc2 && companyData.current.nonRpc.kc2) {
            const kc2RpcCurrent = companyData.current.rpc.kc2;
            const kc2RpcPrevious = companyData.previous.rpc.kc2;
            
            rowsArray.push({
                name: 'КЦ2 RPC',
                calls: kc2RpcCurrent.calls,
                deviations: kc2RpcCurrent.deviations,
                percentage: kc2RpcCurrent.percentage,
                type: 'sub',
                html: generateRowHTML('├─ RPC', kc2RpcCurrent, kc2RpcPrevious, 'sub')
            });

            const kc2NonRpcCurrent = companyData.current.nonRpc.kc2;
            const kc2NonRpcPrevious = companyData.previous.nonRpc.kc2;
            
            rowsArray.push({
                name: 'КЦ2 Не RPC',
                calls: kc2NonRpcCurrent.calls,
                deviations: kc2NonRpcCurrent.deviations,
                percentage: kc2NonRpcCurrent.percentage,
                type: 'sub',
                html: generateRowHTML('└─ Не RPC', kc2NonRpcCurrent, kc2NonRpcPrevious, 'sub')
            });
        }
    }

    // Сортируем массив
    rowsArray.sort((a, b) => {
        let valueA, valueB;
        
        switch (companySortState.column) {
            case 'name':
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 'calls':
                valueA = a.calls;
                valueB = b.calls;
                break;
            case 'deviations':
                valueA = a.deviations;
                valueB = b.deviations;
                break;
            case 'percentage':
                valueA = a.percentage;
                valueB = b.percentage;
                break;
            default:
                return 0;
        }
        
        if (valueA < valueB) {
            return companySortState.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return companySortState.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Формируем HTML таблицы
    let tableHTML = `
        <h4>Сводная информация по компании</h4>
        <table>
            <thead>
                <tr>
                    <th class="sortable-header" data-column="name">КОЛЛ-ЦЕНТР ${getSortIndicator('name')}</th>
                    <th class="text-right sortable-header" data-column="calls">ВСЕГО ЗВОНКОВ ${getSortIndicator('calls')}</th>
                    <th class="text-right sortable-header" data-column="deviations">ОТКЛОНЕНИЙ ${getSortIndicator('deviations')}</th>
                    <th class="text-right sortable-header" data-column="percentage">% ОТКЛОНЕНИЙ ${getSortIndicator('percentage')}</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Добавляем отсортированные строки
    rowsArray.forEach(row => {
        tableHTML += row.html;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
    console.log('=== Отсортированная таблица компании отрисована ===');
    
    // Добавляем обработчики кликов для сортировки
    setTimeout(() => {
        const sortableHeaders = document.querySelectorAll('#companySummaryTable .sortable-header');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const column = this.getAttribute('data-column');
                console.log('Клик по заголовку компании:', column);
                
                // Если кликнули по той же колонке, меняем направление
                if (companySortState.column === column) {
                    companySortState.direction = companySortState.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    // Если новая колонка, устанавливаем направление по умолчанию
                    companySortState.column = column;
                    companySortState.direction = column === 'percentage' ? 'desc' : 'asc';
                }
                
                console.log('Новое состояние сортировки компании:', companySortState);
                
                // Перерисовываем таблицу с новой сортировкой
                renderCompanyTableSorted(cachedCompanyData);
            });
        });
    }, 100);
}

// Вспомогательная функция для генерации HTML строки
function generateRowHTML(name, current, previous, type) {
    const callsChangePercent = previous.calls > 0 ? ((current.calls - previous.calls) / previous.calls * 100) : 0;
    const deviationsChangePercent = previous.deviations > 0 ? ((current.deviations - previous.deviations) / previous.deviations * 100) : 0;
    const percentageChange = current.percentage - previous.percentage;

    const isMain = type === 'main';
    const isSub = type === 'sub';
    
    const rowStyle = isSub ? 'style="background-color: #f8f9fa;"' : '';
    const nameStyle = isSub ? 'style="padding-left: 20px;"' : '';
    const nameContent = isMain ? `<strong>${name}</strong>` : name;
    const callsContent = isMain ? `<strong>${current.calls.toLocaleString()}</strong>` : current.calls.toLocaleString();
    const deviationsContent = isMain ? `<strong>${current.deviations.toLocaleString()}</strong>` : current.deviations.toLocaleString();
    const percentageContent = isMain ? 
        `<strong><span class="${getPercentageClass(current.percentage)}">${current.percentage}%</span></strong>` :
        `<span class="${getPercentageClass(current.percentage)}">${current.percentage}%</span>`;

    return `
        <tr ${rowStyle}>
            <td ${nameStyle}>${nameContent}</td>
            <td class="text-right">${callsContent} ${createChangeBadge(callsChangePercent, 'percentage')}</td>
            <td class="text-right">${deviationsContent} ${createChangeBadge(deviationsChangePercent, 'percentage')}</td>
            <td class="text-right">${percentageContent} ${createChangeBadge(percentageChange, 'percentage')}</td>
        </tr>
    `;
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.updateCompanyData = updateCompanyData;
    window.renderCompanyTable = renderCompanyTable;
    window.renderCompanyTableSorted = renderCompanyTableSorted;
    window.generateRowHTML = generateRowHTML;
    console.log('=== company.js загружен, функции экспортированы ===');
}