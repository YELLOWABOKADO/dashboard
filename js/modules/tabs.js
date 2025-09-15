/**
 * Модуль управления вкладками
 */

let currentTab = 'company';

// Инициализация вкладок
function initTabs() {
    console.log('=== Инициализация вкладок ===');

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

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

                // Специальная обработка для вкладки "Детализация по блокам"
                if (tabId === 'blockDetails') {
                    console.log('Инициализируем модуль детализации по блокам');
                    if (typeof initBlockDetailsModule === 'function') {
                        try {
                            initBlockDetailsModule();
                            console.log('Модуль детализации по блокам инициализирован успешно');
                        } catch (error) {
                            console.error('Ошибка инициализации модуля детализации по блокам:', error);
                        }
                    } else {
                        console.error('Функция initBlockDetailsModule не найдена');
                    }
                } else {
                    if (typeof updateActiveTab === 'function') {
                        updateActiveTab();
                    } else {
                        console.log('updateActiveTab не готова');
                    }
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