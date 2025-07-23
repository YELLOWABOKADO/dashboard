/**
 * Функции для валидации и корректировки диапазона дат
 */

// Функция для проверки валидности диапазона дат в зависимости от гранулярности
function validateDateRange(startDateStr, endDateStr, granularity) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Проверка, что начальная дата не позже конечной
    if (startDate > endDate) {
        alert('Дата начала не может быть позже даты окончания');
        return false;
    }
    
    // Проверка ограничений в зависимости от гранулярности
    if (granularity === 'День') {
        // Для режима "День" максимальный диапазон - 1 день
        const diffDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
            alert('Для режима "День" максимальный диапазон - 1 день');
            return false;
        }
    } else if (granularity === 'Неделя') {
        // Для режима "Неделя" максимальный диапазон - 1 неделя (7 дней)
        const diffDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 7) {
            alert('Для режима "Неделя" максимальный диапазон - 1 неделя (7 дней)');
            return false;
        }
        
        // Проверка, что начальная дата - понедельник
        const dayOfWeek = startDate.getDay();
        if (dayOfWeek !== 1) { // 1 - понедельник в JavaScript
            alert('Для режима "Неделя" начальная дата должна быть понедельником');
            return false;
        }
    } else if (granularity === 'Месяц') {
        // Для режима "Месяц" максимальный диапазон - 1 месяц
        // Проверяем, что начальная дата - первый день месяца
        if (startDate.getDate() !== 1) {
            alert('Для режима "Месяц" начальная дата должна быть первым днем месяца');
            return false;
        }
        
        // Проверяем, что конечная дата - последний день того же месяца
        const lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        if (endDate.getTime() !== lastDayOfMonth.getTime()) {
            alert('Для режима "Месяц" конечная дата должна быть последним днем того же месяца');
            return false;
        }
    }
    
    return true;
}

// Функция для корректировки диапазона дат в зависимости от гранулярности
function adjustDateRangeForGranularity(granularity) {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    
    if (granularity === 'День') {
        // Для режима "День" устанавливаем конечную дату равной начальной
        endDateInput.value = startDateInput.value;
    } else if (granularity === 'Неделя') {
        // Для режима "Неделя" корректируем начальную дату на понедельник текущей недели
        const dayOfWeek = startDate.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Корректировка для воскресенья
        
        startDate.setDate(startDate.getDate() - diff);
        startDateInput.value = formatDateForInput(startDate);
        
        // Устанавливаем конечную дату на воскресенье той же недели
        const endOfWeek = new Date(startDate);
        endOfWeek.setDate(startDate.getDate() + 6);
        endDateInput.value = formatDateForInput(endOfWeek);
    } else if (granularity === 'Месяц') {
        // Для режима "Месяц" корректируем начальную дату на первый день месяца
        startDate.setDate(1);
        startDateInput.value = formatDateForInput(startDate);
        
        // Устанавливаем конечную дату на последний день месяца
        const lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        endDateInput.value = formatDateForInput(lastDayOfMonth);
    }
}

// Вспомогательная функция для форматирования даты в формат YYYY-MM-DD для input[type="date"]
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}