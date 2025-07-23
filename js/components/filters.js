/**
 * Компоненты для фильтров
 */

// Функция для создания фильтра дат
function createDateRangeFilter(startDateId, endDateId, onDateChange) {
    const startDateInput = document.getElementById(startDateId);
    const endDateInput = document.getElementById(endDateId);
    
    if (!startDateInput || !endDateInput) return;
    
    // Устанавливаем обработчики событий
    startDateInput.addEventListener('change', function() {
        if (typeof onDateChange === 'function') {
            onDateChange(startDateInput.value, endDateInput.value);
        }
    });
    
    endDateInput.addEventListener('change', function() {
        if (typeof onDateChange === 'function') {
            onDateChange(startDateInput.value, endDateInput.value);
        }
    });
    
    return {
        getStartDate: () => startDateInput.value,
        getEndDate: () => endDateInput.value,
        setStartDate: (date) => { startDateInput.value = date; },
        setEndDate: (date) => { endDateInput.value = date; }
    };
}

// Функция для создания выпадающего списка с одиночным выбором
function createSingleSelectDropdown(dropdownId, options, onSelectionChange) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    const dropdownButton = dropdown.querySelector('.dropdown-button');
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    const selectedText = dropdown.querySelector('span[id^="selected"]');
    
    if (!dropdownButton || !dropdownContent || !selectedText) return;
    
    // Добавляем обработчик клика на кнопку
    dropdownButton.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    
    // Добавляем обработчики для радио-кнопок
    const radioButtons = dropdownContent.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                selectedText.textContent = this.value;
                dropdown.classList.remove('active');
                
                if (typeof onSelectionChange === 'function') {
                    onSelectionChange(this.value);
                }
            }
        });
    });
    
    // Закрываем выпадающий список при клике вне него
    document.addEventListener('click', function() {
        dropdown.classList.remove('active');
    });
    
    return {
        getSelectedValue: () => selectedText.textContent,
        setSelectedValue: (value) => {
            const radio = Array.from(radioButtons).find(r => r.value === value);
            if (radio) {
                radio.checked = true;
                selectedText.textContent = value;
                
                if (typeof onSelectionChange === 'function') {
                    onSelectionChange(value);
                }
            }
        }
    };
}

// Функция для создания выпадающего списка с множественным выбором
function createMultiSelectDropdown(dropdownId, options, onSelectionChange) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    const dropdownButton = dropdown.querySelector('.dropdown-button');
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    const selectedText = dropdown.querySelector('span[id^="selected"]');
    
    if (!dropdownButton || !dropdownContent || !selectedText) return;
    
    // Добавляем обработчик клика на кнопку
    dropdownButton.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    
    // Добавляем обработчики для чекбоксов
    const checkboxes = dropdownContent.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Получаем все выбранные значения
            const selectedValues = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            // Обновляем текст в кнопке
            if (selectedValues.length === 0) {
                selectedText.textContent = options.allText || 'Все';
            } else if (selectedValues.length === checkboxes.length) {
                selectedText.textContent = options.allText || 'Все';
            } else if (selectedValues.length <= 2) {
                selectedText.textContent = selectedValues.join(', ');
            } else {
                selectedText.textContent = `Выбрано ${selectedValues.length}`;
            }
            
            if (typeof onSelectionChange === 'function') {
                onSelectionChange(selectedValues);
            }
        });
    });
    
    // Закрываем выпадающий список при клике вне него
    document.addEventListener('click', function() {
        dropdown.classList.remove('active');
    });
    
    return {
        getSelectedValues: () => {
            return Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
        },
        setSelectedValues: (values) => {
            checkboxes.forEach(cb => {
                cb.checked = values.includes(cb.value);
            });
            
            // Обновляем текст в кнопке
            if (values.length === 0) {
                selectedText.textContent = options.allText || 'Все';
            } else if (values.length === checkboxes.length) {
                selectedText.textContent = options.allText || 'Все';
            } else if (values.length <= 2) {
                selectedText.textContent = values.join(', ');
            } else {
                selectedText.textContent = `Выбрано ${values.length}`;
            }
            
            if (typeof onSelectionChange === 'function') {
                onSelectionChange(values);
            }
        },
        selectAll: () => {
            checkboxes.forEach(cb => {
                cb.checked = true;
            });
            
            selectedText.textContent = options.allText || 'Все';
            
            if (typeof onSelectionChange === 'function') {
                onSelectionChange(Array.from(checkboxes).map(cb => cb.value));
            }
        },
        deselectAll: () => {
            checkboxes.forEach(cb => {
                cb.checked = false;
            });
            
            selectedText.textContent = options.allText || 'Все';
            
            if (typeof onSelectionChange === 'function') {
                onSelectionChange([]);
            }
        }
    };
}