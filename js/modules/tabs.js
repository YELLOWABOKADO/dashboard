/**
 * Модуль управления вкладками
 */

let currentTab = 'company';

// Инициализация вкладок
function initTabs() {
    console.log('=== Инициализация вкладок ===');
    
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // Убираем активный класс у всех кнопок и содержимого вкладок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Добавляем активный класс выбранной кнопке и содержимому
            this.classList.add('active');
            document.getElementById(tabId + 'Tab').classList.add('active');

            // Обновляем текущую вкладку
            currentTab = tabId;
            console.log('Переключились на вкладку:', currentTab);

            // Загружаем данные для новой активной вкладки
            setTimeout(() => {
                if (typeof updateActiveTab === 'function') {
                    updateActiveTab();
                } else {
                    console.log('updateActiveTab не готова');
                }
            }, 200);
        });
    });
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.initTabs = initTabs;
    window.getCurrentTab = () => currentTab;
    window.setCurrentTab = (tab) => { currentTab = tab; };
}