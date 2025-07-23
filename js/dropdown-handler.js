/**
 * Обработчик выпадающих списков
 */

// Функция для инициализации выпадающих списков
function initDropdowns() {
    console.log('Initializing dropdowns...');
    const dropdowns = document.querySelectorAll('.dropdown');
    console.log('Found dropdowns:', dropdowns.length);
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-button');
        console.log('Dropdown button:', button);
        
        if (button) {
            // Обработчик клика по кнопке
            button.addEventListener('click', function(e) {
                console.log('Button clicked for dropdown:', dropdown.id);
                e.stopPropagation();
                
                // Закрываем все открытые выпадающие списки
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
                
                // Открываем/закрываем текущий выпадающий список
                dropdown.classList.toggle('active');
            });
        }
        
        // Обработчик клика по элементам выпадающего списка
        const items = dropdown.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            item.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const selectedText = dropdown.querySelector('span[id^="selected"]');
                
                if (selectedText) {
                    selectedText.textContent = value;
                }
                
                dropdown.classList.remove('active');
                
                // Если это выпадающий список с гранулярностью времени, корректируем диапазон дат
                if (dropdown.id === 'timeGranularityDropdown' && typeof adjustDateRangeForGranularity === 'function') {
                    adjustDateRangeForGranularity(value);
                }
            });
        });
    });
    
    // Закрытие выпадающих списков при клике вне них
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initDropdowns();
});