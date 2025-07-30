/**
 * Модуль управления данными компании
 */

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
    updatePeriodInfo(granularity, 'periodInfo');
    
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
                    <th>КОЛЛ-ЦЕНТР</th>
                    <th class="text-right">ВСЕГО ЗВОНКОВ</th>
                    <th class="text-right">ОТКЛОНЕНИЙ</th>
                    <th class="text-right">% ОТКЛОНЕНИЙ</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Общие данные - Всего
    const totalCurrent = companyData.current.total;
    const totalPrevious = companyData.previous.total;
    
    // Вычисляем процентные изменения
    const totalCallsChangePercent = totalPrevious.calls > 0 ? ((totalCurrent.calls - totalPrevious.calls) / totalPrevious.calls * 100) : 0;
    const totalDeviationsChangePercent = totalPrevious.deviations > 0 ? ((totalCurrent.deviations - totalPrevious.deviations) / totalPrevious.deviations * 100) : 0;
    const totalPercentageChange = totalCurrent.percentage - totalPrevious.percentage;

    tableHTML += `
        <tr>
            <td><strong>Всего</strong></td>
            <td class="text-right"><strong>${totalCurrent.calls.toLocaleString()}</strong> ${createChangeBadge(totalCallsChangePercent, 'percentage')}</td>
            <td class="text-right"><strong>${totalCurrent.deviations.toLocaleString()}</strong> ${createChangeBadge(totalDeviationsChangePercent, 'percentage')}</td>
            <td class="text-right"><strong><span class="${getPercentageClass(totalCurrent.percentage)}">${totalCurrent.percentage}%</span></strong> ${createChangeBadge(totalPercentageChange, 'percentage')}</td>
        </tr>
    `;

    // Показываем КЦ если есть данные
    if (companyData.activeKCs && companyData.activeKCs.has('kc1')) {
        const kc1TotalCurrent = companyData.current.kc1;
        const kc1TotalPrevious = companyData.previous.kc1;
        
        // Вычисляем процентные изменения для КЦ1
        const kc1CallsChangePercent = kc1TotalPrevious.calls > 0 ? ((kc1TotalCurrent.calls - kc1TotalPrevious.calls) / kc1TotalPrevious.calls * 100) : 0;
        const kc1DeviationsChangePercent = kc1TotalPrevious.deviations > 0 ? ((kc1TotalCurrent.deviations - kc1TotalPrevious.deviations) / kc1TotalPrevious.deviations * 100) : 0;
        const kc1TotalPercentageChange = kc1TotalCurrent.percentage - kc1TotalPrevious.percentage;

        tableHTML += `
            <tr>
                <td><strong>КЦ1</strong></td>
                <td class="text-right"><strong>${kc1TotalCurrent.calls.toLocaleString()}</strong> ${createChangeBadge(kc1CallsChangePercent, 'percentage')}</td>
                <td class="text-right"><strong>${kc1TotalCurrent.deviations.toLocaleString()}</strong> ${createChangeBadge(kc1DeviationsChangePercent, 'percentage')}</td>
                <td class="text-right"><strong><span class="${getPercentageClass(kc1TotalCurrent.percentage)}">${kc1TotalCurrent.percentage}%</span></strong> ${createChangeBadge(kc1TotalPercentageChange, 'percentage')}</td>
            </tr>
        `;
    }

    if (companyData.activeKCs && companyData.activeKCs.has('kc2')) {
        const kc2TotalCurrent = companyData.current.kc2;
        const kc2TotalPrevious = companyData.previous.kc2;
        
        // Вычисляем процентные изменения для КЦ2
        const kc2CallsChangePercent = kc2TotalPrevious.calls > 0 ? ((kc2TotalCurrent.calls - kc2TotalPrevious.calls) / kc2TotalPrevious.calls * 100) : 0;
        const kc2DeviationsChangePercent = kc2TotalPrevious.deviations > 0 ? ((kc2TotalCurrent.deviations - kc2TotalPrevious.deviations) / kc2TotalPrevious.deviations * 100) : 0;
        const kc2TotalPercentageChange = kc2TotalCurrent.percentage - kc2TotalPrevious.percentage;

        tableHTML += `
            <tr>
                <td><strong>КЦ2</strong></td>
                <td class="text-right"><strong>${kc2TotalCurrent.calls.toLocaleString()}</strong> ${createChangeBadge(kc2CallsChangePercent, 'percentage')}</td>
                <td class="text-right"><strong>${kc2TotalCurrent.deviations.toLocaleString()}</strong> ${createChangeBadge(kc2DeviationsChangePercent, 'percentage')}</td>
                <td class="text-right"><strong><span class="${getPercentageClass(kc2TotalCurrent.percentage)}">${kc2TotalCurrent.percentage}%</span></strong> ${createChangeBadge(kc2TotalPercentageChange, 'percentage')}</td>
            </tr>
        `;
    }

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
    console.log('=== Простая таблица отрисована ===');
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.updateCompanyData = updateCompanyData;
    window.renderCompanyTable = renderCompanyTable;
    console.log('=== company.js загружен, функции экспортированы ===');
}