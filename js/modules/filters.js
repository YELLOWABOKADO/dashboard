/**
 * Модуль управления фильтрами
 */

// Валидация диапазона дат
function validateDateRange(startDate, endDate, granularity) {
    if (!startDate || !endDate) {
        alert('Пожалуйста, выберите начальную и конечную даты');
        return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Проверяем, что конечная дата не раньше начальной
    if (end < start) {
        alert('Конечная дата не может быть раньше начальной даты');
        return false;
    }

    // Проверяем ограничения по гранулярности (если указана)
    if (granularity) {
        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (granularity === 'День' && daysDiff > 31) {
            alert('Для просмотра по дням максимальный период - 31 день');
            return false;
        }

        if (granularity === 'Неделя' && daysDiff > 183) {
            alert('Для просмотра по неделям максимальный период - 6 месяцев');
            return false;
        }

        if (granularity === 'Месяц' && daysDiff > 730) {
            alert('Для просмотра по месяцам максимальный период - 2 года');
            return false;
        }
    }

    return true;
}

// Функция для получения выбранных значений из множественного выбора
function getSelectedMultiSelectValues(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return [];

    const allCheckbox = dropdown.querySelector('input[value="all"]');
    if (allCheckbox && allCheckbox.checked) {
        return ['all'];
    }

    const selectedCheckboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked:not([value="all"])');
    return Array.from(selectedCheckboxes).map(cb => cb.value);
}

// Функция для обновления текста кнопки множественного выбора
function updateMultiSelectButtonText(dropdownId, buttonTextId) {
    const dropdown = document.getElementById(dropdownId);
    const buttonText = document.getElementById(buttonTextId);
    if (!dropdown) {
        console.error('Dropdown не найден:', dropdownId);
        return;
    }
    if (!buttonText) {
        console.error('ButtonText не найден:', buttonTextId);
        return;
    }

    const allCheckbox = dropdown.querySelector('input[value="all"]');
    if (allCheckbox && allCheckbox.checked) {
        // Определяем тип выпадающего списка по ID
        if (dropdownId.includes('Employees')) {
            buttonText.textContent = 'Все сотрудники';
        } else {
            buttonText.textContent = 'Все группы';
        }
        return;
    }

    const selectedCheckboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked:not([value="all"])');
    const selectedCount = selectedCheckboxes.length;

    if (selectedCount === 0) {
        allCheckbox.checked = true;
        if (dropdownId.includes('Employees')) {
            buttonText.textContent = 'Все сотрудники';
        } else {
            buttonText.textContent = 'Все группы';
        }
    } else if (selectedCount === 1) {
        const selectedValue = selectedCheckboxes[0].value;
        if (dropdownId.includes('Employees')) {
            buttonText.textContent = selectedValue;
        } else {
            buttonText.textContent = selectedValue + ' - группа';
        }
    } else {
        buttonText.textContent = `Выбрано: ${selectedCount}`;
    }
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.validateDateRange = validateDateRange;
    window.getSelectedMultiSelectValues = getSelectedMultiSelectValues;
    window.updateMultiSelectButtonText = updateMultiSelectButtonText;
}