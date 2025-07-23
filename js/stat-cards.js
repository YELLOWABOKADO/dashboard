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
    
    return {
        value: displayValue,
        isPositive: isPositive
    };
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
        
        // Генерируем динамику
        let callsDynamics, deviationsDynamics, percentageDynamics;
        
        // Фиксированные значения для демонстрации
        if (granularity === 'День') {
            callsDynamics = { value: '-3%', isPositive: false };
            deviationsDynamics = { value: '-8%', isPositive: false };
            percentageDynamics = { value: '+0.8%', isPositive: true };
        } else if (granularity === 'Неделя') {
            callsDynamics = { value: '-2%', isPositive: false };
            deviationsDynamics = { value: '-5%', isPositive: false };
            percentageDynamics = { value: '+0.5%', isPositive: true };
        } else {
            callsDynamics = { value: '-1%', isPositive: false };
            deviationsDynamics = { value: '-3%', isPositive: false };
            percentageDynamics = { value: '+0.3%', isPositive: true };
        }
        
        document.getElementById('callsDynamics').textContent = callsDynamics.value;
        document.getElementById('callsDynamics').className = `dynamics ${callsDynamics.isPositive ? 'positive' : 'negative'}`;
        
        document.getElementById('deviationsDynamics').textContent = deviationsDynamics.value;
        document.getElementById('deviationsDynamics').className = `dynamics ${deviationsDynamics.isPositive ? 'positive' : 'negative'}`;
        
        document.getElementById('percentageDynamics').textContent = percentageDynamics.value;
        document.getElementById('percentageDynamics').className = `dynamics ${percentageDynamics.isPositive ? 'positive' : 'negative'}`;
    } else {
        // Находим данные для выбранного колл-центра
        const key = selectedCallCenter === 'КЦ1' ? 'kc1' : 'kc2';
        const selectedData = data[key];
        
        if (selectedData) {
            // Обновляем карточки статистики с данными выбранного колл-центра
            document.getElementById('totalCalls').textContent = selectedData.calls.toLocaleString();
            document.getElementById('totalDeviations').textContent = selectedData.deviations.toLocaleString();
            document.getElementById('totalPercentage').textContent = selectedData.percentage.toFixed(1) + '%';
            
            // Генерируем динамику
            let callsDynamics, deviationsDynamics, percentageDynamics;
            
            if (selectedCallCenter === 'КЦ1') {
                callsDynamics = { value: '+3%', isPositive: true };
                deviationsDynamics = { value: '+2%', isPositive: true };
                percentageDynamics = { value: '-0.5%', isPositive: false };
            } else {
                callsDynamics = { value: '-1%', isPositive: false };
                deviationsDynamics = { value: '+4%', isPositive: true };
                percentageDynamics = { value: '+0.3%', isPositive: true };
            }
            
            document.getElementById('callsDynamics').textContent = callsDynamics.value;
            document.getElementById('callsDynamics').className = `dynamics ${callsDynamics.isPositive ? 'positive' : 'negative'}`;
            
            document.getElementById('deviationsDynamics').textContent = deviationsDynamics.value;
            document.getElementById('deviationsDynamics').className = `dynamics ${deviationsDynamics.isPositive ? 'positive' : 'negative'}`;
            
            document.getElementById('percentageDynamics').textContent = percentageDynamics.value;
            document.getElementById('percentageDynamics').className = `dynamics ${percentageDynamics.isPositive ? 'positive' : 'negative'}`;
        }
    }
}

// Функция для обновления данных при изменении дат
function updateDataByDateRange(startDate, endDate, callCenter, granularity) {
    // В реальном приложении здесь был бы запрос к серверу с новыми датами
    // Для демонстрации просто используем существующие данные с небольшими изменениями
    
    // Генерируем случайные изменения для демонстрации
    const randomFactor = 0.8 + Math.random() * 0.4; // от 0.8 до 1.2
    
    // Загружаем данные для выбранного колл-центра и гранулярности
    loadCallCenterData(callCenter, granularity);
    
    // Применяем случайный фактор к отображаемым данным
    const totalCalls = document.getElementById('totalCalls');
    const totalDeviations = document.getElementById('totalDeviations');
    const totalPercentage = document.getElementById('totalPercentage');
    
    if (totalCalls && totalDeviations && totalPercentage) {
        // Получаем текущие значения
        let calls = parseInt(totalCalls.textContent.replace(/\s/g, ''));
        let deviations = parseInt(totalDeviations.textContent.replace(/\s/g, ''));
        
        // Применяем случайный фактор
        calls = Math.round(calls * randomFactor);
        deviations = Math.round(deviations * randomFactor);
        
        // Вычисляем новый процент
        const percentage = (deviations / calls * 100).toFixed(1);
        
        // Обновляем отображение
        totalCalls.textContent = calls.toLocaleString();
        totalDeviations.textContent = deviations.toLocaleString();
        totalPercentage.textContent = percentage + '%';
        
        // Обновляем динамику
        const callsDynamics = document.getElementById('callsDynamics');
        const deviationsDynamics = document.getElementById('deviationsDynamics');
        const percentageDynamics = document.getElementById('percentageDynamics');
        
        // Генерируем новые значения динамики
        const newCallsDynamics = generateRandomDynamics();
        const newDeviationsDynamics = generateRandomDynamics();
        const newPercentageDynamics = generateRandomDynamics(true);
        
        callsDynamics.textContent = newCallsDynamics.value;
        callsDynamics.className = `dynamics ${newCallsDynamics.isPositive ? 'positive' : 'negative'}`;
        
        deviationsDynamics.textContent = newDeviationsDynamics.value;
        deviationsDynamics.className = `dynamics ${newDeviationsDynamics.isPositive ? 'positive' : 'negative'}`;
        
        percentageDynamics.textContent = newPercentageDynamics.value;
        percentageDynamics.className = `dynamics ${newPercentageDynamics.isPositive ? 'positive' : 'negative'}`;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчики событий для выбора колл-центра и гранулярности
    const callCenterSelect = document.getElementById('callCenter');
    const timeGranularitySelect = document.getElementById('timeGranularity');
    const updateButton = document.getElementById('updateButton');
    
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
        
        // Обработчик нажатия на кнопку "Обновить"
        if (updateButton) {
            updateButton.addEventListener('click', function() {
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                
                // Обновляем данные с учетом выбранных дат
                updateDataByDateRange(
                    startDate, 
                    endDate, 
                    callCenterSelect.value, 
                    timeGranularitySelect.value
                );
            });
        }
    }
});