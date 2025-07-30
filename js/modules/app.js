/**
 * Главный модуль приложения
 */

// Функция для обновления активной вкладки
async function updateActiveTab() {
    console.log('=== updateActiveTab вызвана ===');
    const currentTab = getCurrentTab();
    console.log('currentTab:', currentTab);
    
    // Проверяем, что все необходимые функции загружены
    if (typeof getDepartmentsData !== 'function' || typeof getEmployeesData !== 'function' || typeof getCompanyData !== 'function' || typeof updateCompanyData !== 'function') {
        console.error('Не все функции загружены:', {
            getDepartmentsData: typeof getDepartmentsData,
            getEmployeesData: typeof getEmployeesData,
            getCompanyData: typeof getCompanyData,
            updateCompanyData: typeof updateCompanyData
        });
        return;
    }

    switch (currentTab) {
        case 'company':
            console.log('Обновляем данные компании...');
            await updateCompanyData();
            break;
        case 'departments':
            console.log('Обновляем данные подразделений...');
            await updateDepartmentsData();
            break;
        case 'employees':
            console.log('Обновляем данные команды...');
            await updateEmployeesData();
            break;
    }
}

// Инициализация приложения
function initApp() {
    console.log('=== Инициализация приложения ===');
    
    // Инициализируем вкладки
    initTabs();
    
    // Инициализируем функциональность сворачивания таблиц
    if (typeof initTableCollapse === 'function') {
        initTableCollapse();
    }
    
    // Обработчик кнопки "Обновить" на главной вкладке
    const updateButton = document.getElementById('updateButton');
    if (updateButton) {
        updateButton.addEventListener('click', async function () {
            console.log('=== Кнопка "Обновить" нажата ===');
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            const granularity = document.getElementById('timeGranularity').value;

            console.log('Значения фильтров:', { startDate, endDate, granularity });

            // Проверяем валидность диапазона дат
            if (!validateDateRange(startDate, endDate, granularity)) {
                return;
            }

            await updateActiveTab();
        });
    }
    
    // Настраиваем фильтры с задержкой
    setTimeout(() => {
        console.log('Инициализируем фильтры с задержкой...');
        setupDepartmentFilters();
        setupEmployeeFilters();
    }, 300);
    
    // Загружаем данные для начальной вкладки с проверкой готовности функций
    setTimeout(() => {
        console.log('Проверяем готовность функций...');
        console.log('Функции:', {
            getDepartmentsData: typeof getDepartmentsData,
            getEmployeesData: typeof getEmployeesData,
            getCompanyData: typeof getCompanyData,
            updateCompanyData: typeof updateCompanyData
        });
        
        if (typeof getDepartmentsData === 'function' && typeof getEmployeesData === 'function' && typeof getCompanyData === 'function' && typeof updateCompanyData === 'function') {
            console.log('Все функции загружены, вызываем updateActiveTab');
            updateActiveTab();
        } else {
            console.log('Функции еще не загружены, повторяем через 1 секунду...');
            setTimeout(() => {
                console.log('Повторная проверка функций:', {
                    getDepartmentsData: typeof getDepartmentsData,
                    getEmployeesData: typeof getEmployeesData,
                    getCompanyData: typeof getCompanyData,
                    updateCompanyData: typeof updateCompanyData
                });
                
                if (typeof getDepartmentsData === 'function' && typeof getEmployeesData === 'function' && typeof getCompanyData === 'function' && typeof updateCompanyData === 'function') {
                    console.log('Все функции загружены при повторной проверке, вызываем updateActiveTab');
                    updateActiveTab();
                } else {
                    console.error('Функции так и не загрузились. Проверьте порядок загрузки скриптов');
                }
            }, 1000);
        }
    }, 1000);
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.updateActiveTab = updateActiveTab;
    window.initApp = initApp;
}