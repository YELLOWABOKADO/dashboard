/**
 * Утилиты для сравнения данных с предыдущим периодом
 */

// Функция для получения предыдущего периода
function getPreviousPeriod(currentDate, granularity) {
    const date = new Date(currentDate);
    
    switch (granularity) {
        case 'День':
            date.setDate(date.getDate() - 1);
            break;
        case 'Неделя':
            date.setDate(date.getDate() - 7);
            break;
        case 'Месяц':
            date.setMonth(date.getMonth() - 1);
            break;
        default:
            return null;
    }
    
    return date.toISOString().split('T')[0];
}

// Функция для расчета процентного изменения
function calculatePercentageChange(current, previous) {
    if (!previous || previous === 0) {
        return current > 0 ? 100 : 0;
    }
    
    const change = ((current - previous) / previous) * 100;
    return Math.round(change * 10) / 10; // Округляем до 1 знака после запятой
}

// Функция для форматирования процентного изменения
function formatPercentageChange(change) {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change}%`;
}

// Функция для получения CSS класса для процентного изменения
function getChangeClass(change) {
    if (change > 0) return 'badge-success';
    if (change < 0) return 'badge-danger';
    return 'badge-neutral';
}

// Функция для генерации данных предыдущего периода (для демонстрации)
function generatePreviousPeriodData(currentData, granularity) {
    // В реальном приложении эти данные должны приходить с сервера
    // Для демонстрации генерируем случайные изменения от -15% до +15%
    const previousData = {};
    
    Object.keys(currentData).forEach(key => {
        if (typeof currentData[key] === 'object' && currentData[key] !== null) {
            previousData[key] = generatePreviousPeriodData(currentData[key], granularity);
        } else if (typeof currentData[key] === 'number') {
            // Генерируем случайное изменение от -15% до +15%
            const changePercent = (Math.random() - 0.5) * 30; // от -15% до +15%
            const changeFactor = 1 - (changePercent / 100);
            previousData[key] = Math.round(currentData[key] * changeFactor);
        } else {
            previousData[key] = currentData[key];
        }
    });
    
    return previousData;
}

// Функция для расчета изменений для всех метрик
function calculateAllChanges(currentData, previousData) {
    const changes = {};
    
    Object.keys(currentData).forEach(key => {
        if (typeof currentData[key] === 'object' && currentData[key] !== null) {
            changes[key] = calculateAllChanges(currentData[key], previousData[key] || {});
        } else if (typeof currentData[key] === 'number') {
            const previousValue = previousData[key] || 0;
            changes[key] = calculatePercentageChange(currentData[key], previousValue);
        }
    });
    
    return changes;
}

// Функция для создания HTML бейджа с изменением
function createChangeBadge(change) {
    const formattedChange = formatPercentageChange(change);
    const cssClass = getChangeClass(change);
    
    return `<span class="badge ${cssClass}">${formattedChange}</span>`;
}

// Функция для получения текста периода для отображения
function getPeriodText(granularity) {
    switch (granularity) {
        case 'День':
            return 'к прошлому дню';
        case 'Неделя':
            return 'к прошлой неделе';
        case 'Месяц':
            return 'к прошлому месяцу';
        default:
            return 'к предыдущему периоду';
    }
}

// Экспорт функций для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getPreviousPeriod,
        calculatePercentageChange,
        formatPercentageChange,
        getChangeClass,
        generatePreviousPeriodData,
        calculateAllChanges,
        createChangeBadge,
        getPeriodText
    };
}