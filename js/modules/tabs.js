/**
 * Модуль управления вкладками
 */

let currentTab = 'org';

// Инициализация вкладок
function initTabs() {
    console.log('=== Инициализация вкладок ===');

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Выставляем текущую вкладку по активной кнопке разметки
    const activeButton = document.querySelector('.tab-button.active');
    if (activeButton) {
        currentTab = activeButton.getAttribute('data-tab');
    }

    console.log('Найдено кнопок вкладок:', tabButtons.length);
    console.log('Найдено содержимого вкладок:', tabContents.length);

    // Отладка: проверим, что все вкладки существуют
    tabButtons.forEach(button => {
        const tabId = button.getAttribute('data-tab');
        const tabContent = document.getElementById(tabId + 'Tab');
        console.log(`Вкладка ${tabId}: кнопка=${!!button}, содержимое=${!!tabContent}`);
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            console.log('Клик по вкладке:', tabId);

            // Убираем активный класс у всех кнопок и содержимого вкладок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Добавляем активный класс выбранной кнопке и содержимому
            this.classList.add('active');

            const tabContentElement = document.getElementById(tabId + 'Tab');
            console.log('Элемент содержимого вкладки:', tabContentElement);

            if (tabContentElement) {
                tabContentElement.classList.add('active');
                console.log('Класс active добавлен к элементу:', tabId + 'Tab');
            } else {
                console.error('Элемент содержимого вкладки не найден:', tabId + 'Tab');
            }

            // Обновляем текущую вкладку
            currentTab = tabId;
            console.log('Переключились на вкладку:', currentTab);

            // Загружаем данные для новой активной вкладки
            setTimeout(() => {
                console.log('=== Переключаемся на вкладку:', tabId);
                if (typeof updateActiveTab === 'function') {
                    updateActiveTab();
                } else {
                    console.log('updateActiveTab не готова');
                }
            }, 200);
        });
    });
}

// Локальный переключатель внутренних табов детализации
function initDetailsInnerTabs() {
    const buttons = document.querySelectorAll('.details-tab-button');
    const sections = document.querySelectorAll('.details-inner-section');

    if (!buttons.length || !sections.length) {
        return;
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            buttons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            button.classList.add('active');
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            if (target === 'detailsBlocksSection' && typeof initBlockDetailsModule === 'function' && !window.blockDetailsInitialized) {
                initBlockDetailsModule();
                window.blockDetailsInitialized = true;
            }

            if (target === 'detailsChecklistSection' && typeof window.checklistDashboard === 'object' && typeof window.checklistDashboard.applyFilters === 'function') {
                window.checklistDashboard.applyFilters();
            }
        });
    });
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.initTabs = initTabs;
    window.initDetailsInnerTabs = initDetailsInnerTabs;
    window.getCurrentTab = () => currentTab;
    window.setCurrentTab = (tab) => { currentTab = tab; };
}
