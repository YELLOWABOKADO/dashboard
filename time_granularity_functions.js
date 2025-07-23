// Function to get date range based on start and end dates
function getDateRange(startDate, endDate, granularity) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = [];
    
    if (granularity === 'День') {
        // Generate daily dates
        let current = new Date(start);
        while (current <= end) {
            result.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
    } else if (granularity === 'Неделя') {
        // Generate weekly dates (starting from Monday)
        let current = new Date(start);
        // Move to the beginning of the week (Monday)
        const dayOfWeek = current.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Sunday
        current.setDate(current.getDate() - diff);
        
        while (current <= end) {
            result.push(new Date(current));
            current.setDate(current.getDate() + 7);
        }
    } else if (granularity === 'Месяц') {
        // Generate monthly dates (first day of each month)
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        while (current <= end) {
            result.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }
    }
    
    return result;
}

// Function to format date based on granularity
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