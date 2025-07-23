/**
 * Функции для работы с периодами времени (день, неделя, месяц)
 */

// Функция для получения диапазона дат на основе начальной и конечной даты
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

// Функция для форматирования даты в зависимости от гранулярности
function formatDate(date, granularity) {
    if (granularity === 'День') {
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    } else if (granularity === 'Неделя') {
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + 6);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')} - ${endOfWeek.getDate().toString().padStart(2, '0')}.${(endOfWeek.getMonth() + 1).toString().padStart(2, '0')}`;
    } else if (granularity === 'Месяц') {
        const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        return monthNames[date.getMonth()];
    }
    return '';
}

// Функция для группировки данных по периодам
function groupDataByPeriod(data, dateField, granularity, startDate, endDate) {
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
            periodKey = formatDate(itemDate, 'День');
        } else if (granularity === 'Неделя') {
            // Найти начало недели для даты элемента
            const dayOfWeek = itemDate.getDay();
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const weekStart = new Date(itemDate);
            weekStart.setDate(itemDate.getDate() - diff);
            periodKey = formatDate(weekStart, 'Неделя');
        } else if (granularity === 'Месяц') {
            const monthStart = new Date(itemDate.getFullYear(), itemDate.getMonth(), 1);
            periodKey = formatDate(monthStart, 'Месяц');
        }
        
        if (result[periodKey]) {
            result[periodKey].calls += item.calls || 0;
            result[periodKey].deviations += item.deviations || 0;
        }
    });
    
    // Вычисление процентов отклонений
    Object.keys(result).forEach(key => {
        if (result[key].calls > 0) {
            result[key].percentage = Math.round((result[key].deviations / result[key].calls) * 100);
        }
    });
    
    return result;
}