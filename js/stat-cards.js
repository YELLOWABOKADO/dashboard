/**
 * Функции для работы с карточками статистики
 */

// Данные для разных режимов отображения
const statCardDataByGranularity = {
    'День': {
        total: {
            calls: 1833,
            deviations: 132,
            percentage: 7.2
        },
        kc1: {
            calls: 1100,
            deviations: 80,
            percentage: 7.3
        },
        kc2: {
            calls: 733,
            deviations: 52,
            percentage: 7.1
        }
    },
    'Неделя': {
        total: {
            calls: 13750,
            deviations: 975,
            percentage: 7.1
        },
        kc1: {
            calls: 8250,
            deviations: 600,
            percentage: 7.3
        },
        kc2: {
            calls: 5500,
            deviations: 375,
            percentage: 6.8
        }
    },
    'Месяц': {
        total: {
            calls: 55000,
            deviations: 3900,
            percentage: 7.1
        },
        kc1: {
            calls: 33000,
            deviations: 2400,
            percentage: 7.3
        },
        kc2: {
            calls: 22000,
            deviations: 1500,
            percentage: 6.8
        }
    }
};

// Функция для обновления карточек статистики с учетом выбранного колл-центра и гранулярности
function updateStatCardsForCallCenter(callCenterData, granularity) {
    // Получаем данные для выбранного колл-центра
    const ccData = callCenterData.granularity[granularity];
    
    // Обновляем карточки статистики
    document.getElementById('totalCalls').textContent = ccData.totalCalls.toLocaleString();
    document.getElementById('totalDeviations').textContent = ccData.deviations.toLocaleString();
    document.getElementById('totalPercentage').textContent = ccData.deviationPercentage.toFixed(1) + '%';
    
    // Обновляем динамику
    document.getElementById('callsDynamics').textContent = (ccData.dynamicsPercentage > 0 ? '+' : '') + ccData.dynamicsPercentage + '%';
    document.getElementById('callsDynamics').className = `mtm-badge ${ccData.dynamicsPercentage > 0 ? 'mtm-positive' : 'mtm-negative'} ml-2`;
    
    // Генерируем случайную динамику для отклонений и процентов
    const deviationsDynamics = generateRandomDynamics();
    const percentageDynamics = generateRandomDynamics(true);
    
    document.getElementById('deviationsDynamics').textContent = deviationsDynamics.value;
    document.getElementById('deviationsDynamics').className = `mtm-badge ${deviationsDynamics.class} ml-2`;
    
    document.getElementById('percentageDynamics').textContent = percentageDynamics.value;
    document.getElementById('percentageDynamics').className = `mtm-badge ${percentageDynamics.class} ml-2`;
}

// Функция для загрузки данных колл-центров и обновления карточек статистики
function loadCallCenterData(selectedCallCenter, granularity) {
    // Используем локальные данные вместо загрузки из JSON
    const data = statCardDataByGranularity[granularity];
    
    if (!data) {
        console.error('Нет данных для режима отображения:', granularity);
        return;
    }
    
    if (selectedCallCenter === 'Все КЦ') {
        // Используем суммарные данные
        const totalData = data.total;
        
        // Обновляем карточки статистики с суммарными данными
        document.getElementById('totalCalls').textContent = totalData.calls.toLocaleString();
        document.getElementById('totalDeviations').textContent = totalData.deviations.toLocaleString();
        document.getElementById('totalPercentage').textContent = totalData.percentage.toFixed(1) + '%';
        
        // Генерируем случайную динамику
        const callsDynamics = generateRandomDynamics();
        const deviationsDynamics = generateRandomDynamics();
        const percentageDynamics = generateRandomDynamics(true);
        
        document.getElementById('callsDynamics').textContent = callsDynamics.value;
        document.getElementById('callsDynamics').className = `mtm-badge ${callsDynamics.class} ml-2`;
        
        document.getElementById('deviationsDynamics').textContent = deviationsDynamics.value;
        document.getElementById('deviationsDynamics').className = `mtm-badge ${deviationsDynamics.class} ml-2`;
        
        document.getElementById('percentageDynamics').textContent = percentageDynamics.value;
        document.getElementById('percentageDynamics').className = `mtm-badge ${percentageDynamics.class} ml-2`;
        
        // Обновляем детали по КЦ в карточках
        updateCardDetails(data);
    } else {
        // Находим данные для выбранного колл-центра
        const key = selectedCallCenter === 'КЦ1' ? 'kc1' : 'kc2';
        const selectedData = data[key];
        
        if (selectedData) {
            // Обновляем карточки статистики с данными выбранного колл-центра
            document.getElementById('totalCalls').textContent = selectedData.calls.toLocaleString();
            document.getElementById('totalDeviations').textContent = selectedData.deviations.toLocaleString();
            document.getElementById('totalPercentage').textContent = selectedData.percentage.toFixed(1) + '%';
            
            // Генерируем случайную динамику
            const callsDynamics = generateRandomDynamics();
            const deviationsDynamics = generateRandomDynamics();
            const percentageDynamics = generateRandomDynamics(true);
            
            document.getElementById('callsDynamics').textContent = callsDynamics.value;
            document.getElementById('callsDynamics').className = `mtm-badge ${callsDynamics.class} ml-2`;
            
            document.getElementById('deviationsDynamics').textContent = deviationsDynamics.value;
            document.getElementById('deviationsDynamics').className = `mtm-badge ${deviationsDynamics.class} ml-2`;
            
            document.getElementById('percentageDynamics').textContent = percentageDynamics.value;
            document.getElementById('percentageDynamics').className = `mtm-badge ${percentageDynamics.class} ml-2`;
            
            // Очищаем детали, так как выбран конкретный КЦ
            clearCardDetails();
        }
    }
}

// Функция для очистки деталей в карточках
function clearCardDetails() {
    const callsDetails = document.getElementById('callsDetails');
    const deviationsDetails = document.getElementById('deviationsDetails');
    const percentageDetails = document.getElementById('percentageDetails');
    
    if (callsDetails) callsDetails.innerHTML = '';
    if (deviationsDetails) deviationsDetails.innerHTML = '';
    if (percentageDetails) percentageDetails.innerHTML = '';
}

// Функция для обновления деталей в карточках
function updateCardDetails(data) {
    const callsDetails = document.getElementById('callsDetails');
    const deviationsDetails = document.getElementById('deviationsDetails');
    const percentageDetails = document.getElementById('percentageDetails');
    
    if (!callsDetails || !deviationsDetails || !percentageDetails) return;
    
    callsDetails.innerHTML = '';
    deviationsDetails.innerHTML = '';
    percentageDetails.innerHTML = '';
    
    // Добавляем детали для КЦ1
    if (data.kc1) {
        // Детали для карточки "Количество звонков"
        const callsDetailItem = document.createElement('div');
        callsDetailItem.className = 'detail-item';
        callsDetailItem.innerHTML = `
            <span class="label">КЦ1:</span>
            <div class="flex items-center">
                <span class="value">${data.kc1.calls.toLocaleString()}</span>
                <span class="mtm-badge mtm-positive ml-2">+3%</span>
            </div>
        `;
        callsDetails.appendChild(callsDetailItem);
        
        // Детали для карточки "Отклонения"
        const deviationsDetailItem = document.createElement('div');
        deviationsDetailItem.className = 'detail-item';
        deviationsDetailItem.innerHTML = `
            <span class="label">КЦ1:</span>
            <div class="flex items-center">
                <span class="value">${data.kc1.deviations.toLocaleString()}</span>
                <span class="mtm-badge mtm-positive ml-2">+2%</span>
            </div>
        `;
        deviationsDetails.appendChild(deviationsDetailItem);
        
        // Детали для карточки "% отклонений"
        const percentageDetailItem = document.createElement('div');
        percentageDetailItem.className = 'detail-item';
        percentageDetailItem.innerHTML = `
            <span class="label">КЦ1:</span>
            <div class="flex items-center">
                <span class="value">${data.kc1.percentage.toFixed(1)}%</span>
                <span class="mtm-badge mtm-negative ml-2">-0.5%</span>
            </div>
        `;
        percentageDetails.appendChild(percentageDetailItem);
    }
    
    // Добавляем детали для КЦ2
    if (data.kc2) {
        // Детали для карточки "Количество звонков"
        const callsDetailItem = document.createElement('div');
        callsDetailItem.className = 'detail-item';
        callsDetailItem.innerHTML = `
            <span class="label">КЦ2:</span>
            <div class="flex items-center">
                <span class="value">${data.kc2.calls.toLocaleString()}</span>
                <span class="mtm-badge mtm-negative ml-2">-1%</span>
            </div>
        `;
        callsDetails.appendChild(callsDetailItem);
        
        // Детали для карточки "Отклонения"
        const deviationsDetailItem = document.createElement('div');
        deviationsDetailItem.className = 'detail-item';
        deviationsDetailItem.innerHTML = `
            <span class="label">КЦ2:</span>
            <div class="flex items-center">
                <span class="value">${data.kc2.deviations.toLocaleString()}</span>
                <span class="mtm-badge mtm-positive ml-2">+4%</span>
            </div>
        `;
        deviationsDetails.appendChild(deviationsDetailItem);
        
        // Детали для карточки "% отклонений"
        const percentageDetailItem = document.createElement('div');
        percentageDetailItem.className = 'detail-item';
        percentageDetailItem.innerHTML = `
            <span class="label">КЦ2:</span>
            <div class="flex items-center">
                <span class="value">${data.kc2.percentage.toFixed(1)}%</span>
                <span class="mtm-badge mtm-positive ml-2">+0.3%</span>
            </div>
        `;
        percentageDetails.appendChild(percentageDetailItem);
    }
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчики событий для выбора колл-центра и гранулярности
    const callCenterSelect = document.getElementById('callCenter');
    const timeGranularitySelect = document.getElementById('timeGranularity');
    
    if (callCenterSelect && timeGranularitySelect) {
        // Загружаем начальные данные
        loadCallCenterData(callCenterSelect.value, timeGranularitySelect.value);
        
        // Обработчик изменения колл-центра
        callCenterSelect.addEventListener('change', function() {
            loadCallCenterData(this.value, timeGranularitySelect.value);
        });
        
        // Обработчик изменения гранулярности
        timeGranularitySelect.addEventListener('change', function() {
            loadCallCenterData(callCenterSelect.value, this.value);
        });
    }
});