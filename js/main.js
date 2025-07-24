/**
 * Основной JavaScript файл для инициализации приложения
 */

// Глобальные переменные для хранения состояния приложения
let currentTab = 'company'; // Текущая активная вкладка

// Функция для инициализации приложения
function initApp() {
    // Инициализация выпадающих списков
    initDropdowns();
    
    // Инициализация вкладок
    initTabs();
    
    // Инициализация кнопки обновления
    initUpdateButton();
    
    // Загружаем данные для начальной вкладки
    loadTabData(currentTab);
}

// Функция для инициализации выпадающих списков
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-button');
        const content = dropdown.querySelector('.dropdown-content');
        const selectedText = dropdown.querySelector('span[id^="selected"]');
        const items = dropdown.querySelectorAll('.dropdown-item');
        
        // Обработчик клика по кнопке
        button.addEventListener('click', function(e) {
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
        
        // Обработчик клика по элементам выпадающего списка
        items.forEach(item => {
            item.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                if (selectedText) {
                    selectedText.textContent = value;
                }
                dropdown.classList.remove('active');
                
                // Если это выпадающий список с гранулярностью времени, корректируем диапазон дат
                if (dropdown.id === 'timeGranularityDropdown') {
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

// Функция для инициализации вкладок
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Скрываем все вкладки и убираем активный класс у кнопок
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Показываем выбранную вкладку и делаем кнопку активной
            document.getElementById(tabId + 'Tab').classList.add('active');
            button.classList.add('active');
            
            // Обновляем текущую вкладку
            currentTab = tabId;
            
            // Загружаем данные для активной вкладки
            loadTabData(tabId);
        });
    });
}

// Функция для инициализации кнопки обновления
function initUpdateButton() {
    document.getElementById('updateButton').addEventListener('click', function() {
        // Получаем текущие значения фильтров
        const granularity = document.getElementById('timeGranularity').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        // Обновляем данные для текущей вкладки
        loadTabData(currentTab);
    });
}

// Функция для загрузки данных для активной вкладки
function loadTabData(tabId) {
    // Получаем выбранный режим отображения
    const granularity = document.getElementById('timeGranularity').value;
    
    // Получаем выбранный колл-центр
    const callCenter = document.getElementById('callCenter').value;
    
    // Определяем ключ для выбранного колл-центра
    let callCenterKey = 'total';
    if (callCenter === 'КЦ1') {
        callCenterKey = 'kc1';
    } else if (callCenter === 'КЦ2') {
        callCenterKey = 'kc2';
    }
    
    switch(tabId) {
        case 'company':
            // Загрузка данных для вкладки "Компания"
            if (typeof updateCompanyData === 'function') {
                updateCompanyData(granularity, callCenterKey);
            }
            // Обновляем карточки статистики
            if (typeof loadCallCenterData === 'function') {
                loadCallCenterData(callCenter, granularity);
            }
            break;
        case 'departments':
            // Загрузка данных для вкладки "Подразделения"
            if (typeof updateDepartmentsData === 'function') {
                updateDepartmentsData(granularity);
            }
            break;
        case 'employees':
            // Загрузка данных для вкладки "Команда"
            if (typeof updateEmployeesData === 'function') {
                updateEmployeesData(granularity);
            }
            break;
        // Добавьте обработку других вкладок по мере необходимости
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем приложение
    initApp();
});