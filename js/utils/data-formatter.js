/**
 * Утилиты для форматирования данных
 */

// Функция для форматирования числа с разделителями разрядов
function formatNumber(number, options = {}) {
    if (number === null || number === undefined) return '';
    
    const defaultOptions = {
        locale: 'ru-RU',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    };
    
    const formatterOptions = { ...defaultOptions, ...options };
    
    return Number(number).toLocaleString(
        formatterOptions.locale, 
        {
            minimumFractionDigits: formatterOptions.minimumFractionDigits,
            maximumFractionDigits: formatterOptions.maximumFractionDigits
        }
    );
}

// Функция для форматирования процентов
function formatPercentage(number, options = {}) {
    if (number === null || number === undefined) return '';
    
    const defaultOptions = {
        locale: 'ru-RU',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        addSymbol: true
    };
    
    const formatterOptions = { ...defaultOptions, ...options };
    
    const formattedNumber = Number(number).toLocaleString(
        formatterOptions.locale, 
        {
            minimumFractionDigits: formatterOptions.minimumFractionDigits,
            maximumFractionDigits: formatterOptions.maximumFractionDigits
        }
    );
    
    return formatterOptions.addSymbol ? `${formattedNumber}%` : formattedNumber;
}

// Функция для форматирования даты
function formatDate(date, format = 'dd.MM.yyyy') {
    if (!date) return '';
    
    const d = new Date(date);
    
    // Проверяем, является ли дата валидной
    if (isNaN(d.getTime())) return '';
    
    // Форматируем дату в соответствии с указанным форматом
    return format
        .replace('yyyy', d.getFullYear())
        .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
        .replace('dd', String(d.getDate()).padStart(2, '0'))
        .replace('HH', String(d.getHours()).padStart(2, '0'))
        .replace('mm', String(d.getMinutes()).padStart(2, '0'))
        .replace('ss', String(d.getSeconds()).padStart(2, '0'));
}

// Функция для форматирования динамики (с плюсом или минусом)
function formatDynamics(value, options = {}) {
    if (value === null || value === undefined) return '';
    
    const defaultOptions = {
        locale: 'ru-RU',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        addSymbol: true,
        addPlusSign: true
    };
    
    const formatterOptions = { ...defaultOptions, ...options };
    
    const formattedNumber = Number(Math.abs(value)).toLocaleString(
        formatterOptions.locale, 
        {
            minimumFractionDigits: formatterOptions.minimumFractionDigits,
            maximumFractionDigits: formatterOptions.maximumFractionDigits
        }
    );
    
    let result = formattedNumber;
    
    // Добавляем знак плюс или минус
    if (value > 0 && formatterOptions.addPlusSign) {
        result = `+${result}`;
    } else if (value < 0) {
        result = `-${result}`;
    }
    
    // Добавляем символ процента, если нужно
    if (formatterOptions.addSymbol) {
        result = `${result}%`;
    }
    
    return result;
}

// Функция для определения класса CSS в зависимости от значения
function getDynamicsClass(value) {
    if (value > 0) {
        return 'mtm-positive';
    } else if (value < 0) {
        return 'mtm-negative';
    } else {
        return 'mtm-neutral';
    }
}

// Функция для определения класса CSS для процентов отклонений
function getDeviationPercentageClass(percentage) {
    if (percentage >= 10) {
        return 'percentage-high';
    } else if (percentage >= 5) {
        return 'percentage-medium';
    } else {
        return 'percentage-low';
    }
}

// Функция для группировки данных по периодам
function groupDataByPeriod(data, dateField, granularity, startDate, endDate) {
    // Получаем диапазон дат
    const dateRange = getDateRange(startDate, endDate, granularity);
    const result = {};
    
    // Инициализация результата с пустыми значениями для всех периодов
    dateRange.forEach(date => {
        result[formatDate(date, granularity)] = {
            calls: 0,
            deviations: 0,
            percentage: 0
        };
    });
    
    // Группировка данных по периодам
    data.forEach(item => {
        const itemDate = new Date(item[dateField]);
        let periodKey = '';
        
        if (granularity === 'День') {
            periodKey = formatDate(itemDate, 'dd.MM');
        } else if (granularity === 'Неделя') {
            // Найти начало недели для даты элемента
            const dayOfWeek = itemDate.getDay();
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const weekStart = new Date(itemDate);
            weekStart.setDate(itemDate.getDate() - diff);
            
            // Форматируем ключ для недели
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            periodKey = `${formatDate(weekStart, 'dd.MM')}-${formatDate(weekEnd, 'dd.MM')}`;
        } else if (granularity === 'Месяц') {
            // Форматируем ключ для месяца
            const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
            periodKey = monthNames[itemDate.getMonth()];
        }
        
        if (result[periodKey]) {
            result[periodKey].calls += item.calls || 0;
            result[periodKey].deviations += item.deviations || 0;
        }
    });
    
    // Вычисление процентов отклонений
    Object.keys(result).forEach(key => {
        if (result[key].calls > 0) {
            result[key].percentage = Math.round((result[key].deviations / result[key].calls) * 100 * 10) / 10;
        }
    });
    
    return result;
}

// Функция для получения диапазона дат
function getDateRange(startDate, endDate, granularity) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = [];
    
    if (granularity === 'День') {
        // Генерация ежедневных дат
        let current = new Date(start);
        while (current <= end) {
            result.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
    } else if (granularity === 'Неделя') {
        // Генерация еженедельных дат (начиная с понедельника)
        let current = new Date(start);
        // Перемещение к началу недели (понедельник)
        const dayOfWeek = current.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Корректировка для воскресенья
        current.setDate(current.getDate() - diff);
        
        while (current <= end) {
            result.push(new Date(current));
            current.setDate(current.getDate() + 7);
        }
    } else if (granularity === 'Месяц') {
        // Генерация ежемесячных дат (первый день каждого месяца)
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        while (current <= end) {
            result.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }
    }
    
    return result;
}