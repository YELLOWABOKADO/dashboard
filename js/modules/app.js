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
        case 'org':
            console.log('Обновляем данные компании и подразделений...');
            await updateCompanyData();
            await updateDepartmentsData();
            if (typeof updateEmployeesData === 'function') {
                console.log('Обновляем встроенный блок команды...');
                await updateEmployeesData();
            }
            break;
        case 'dynamics':
            console.log('Обновляем данные динамики...');
            await updateDynamicsData();
            if (typeof syncEmployeeDynamicsFilters === 'function') {
                syncEmployeeDynamicsFilters();
            }
            if (typeof window.empDynDataLoaded === 'undefined' && typeof loadEmployeeDynamicsData === 'function') {
                console.log('[Employee Dynamics] Первое открытие, загружаем данные...');
                await loadEmployeeDynamicsData();
                window.empDynDataLoaded = true;
            }
            break;
        case 'ratings':
            console.log('Переключились на вкладку рейтингов...');
            if (typeof initRatingsModule === 'function' && typeof window.ratingsInitialized === 'undefined') {
                console.log('Инициализируем модуль рейтингов...');
                initRatingsModule();
                window.ratingsInitialized = true;
            }
            await updateRatingsData();
            break;
        case 'details':
            console.log('Обновляем вкладку детализации...');
            const activeDetailsTab = document.querySelector('.details-tab-button.active')?.dataset.target || 'detailsChecklistSection';

            if (activeDetailsTab === 'detailsChecklistSection') {
                if (!window.checklistLoadedOnce && typeof window.checklistDashboard === 'object' && typeof window.checklistDashboard.loadData === 'function') {
                    await window.checklistDashboard.loadData();
                    window.checklistLoadedOnce = true;
                    window.checklistRenderedOnce = true;
                } else if (!window.checklistRenderedOnce && typeof window.checklistDashboard === 'object' && typeof window.checklistDashboard.applyFilters === 'function') {
                    window.checklistDashboard.applyFilters();
                    window.checklistRenderedOnce = true;
                }
            }

            if (activeDetailsTab === 'detailsBlocksSection' && typeof initBlockDetailsModule === 'function' && !window.blockDetailsInitialized) {
                initBlockDetailsModule();
                window.blockDetailsInitialized = true;
            }

            if (!window.empDetailsModuleInitialized && typeof initEmployeeDetailsModule === 'function') {
                await initEmployeeDetailsModule();
            }
            if (!window.empDetailsRenderedOnce && typeof applyEmployeeDetailsFilters === 'function') {
                applyEmployeeDetailsFilters();
                window.empDetailsRenderedOnce = true;
            }
            break;
    }
}

function syncEmployeeDynamicsFilters() {
    const dynStart = document.getElementById('dynStartDate');
    const dynEnd = document.getElementById('dynEndDate');
    const dynGranularity = document.getElementById('dynTimeGranularity');

    const empStart = document.getElementById('empDynStartDate');
    const empEnd = document.getElementById('empDynEndDate');
    const empGranularity = document.getElementById('empDynGranularity');

    if (dynStart && empStart) {
        empStart.value = dynStart.value;
    }
    if (dynEnd && empEnd) {
        empEnd.value = dynEnd.value;
    }
    if (dynGranularity && empGranularity) {
        const dynValue = dynGranularity.value;
        if (dynValue === 'Неделя') {
            empGranularity.value = 'week';
        } else if (dynValue === 'Месяц') {
            empGranularity.value = 'month';
        }
    }
}

// Инициализация приложения
function initApp() {
    console.log('=== Инициализация приложения ===');

    // Инициализируем вкладки
    initTabs();
    initDetailsInnerTabs();

    // Инициализируем функциональность сворачивания таблиц
    if (typeof initTableCollapse === 'function') {
        initTableCollapse();
    }

    // Инициализируем сворачивающиеся блоки
    if (typeof initCollapsibleSections === 'function') {
        initCollapsibleSections();
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

        // Инициализируем модуль сотрудников (включая детализацию)
        console.log('Проверяем наличие функции initEmployeesModule:', typeof initEmployeesModule);
        if (typeof initEmployeesModule === 'function') {
            console.log('Вызываем initEmployeesModule...');
            initEmployeesModule();
        } else {
            console.error('Функция initEmployeesModule не найдена!');
        }

        // Инициализируем модуль динамики
        console.log('Проверяем наличие функции initDynamicsModule:', typeof initDynamicsModule);
        if (typeof initDynamicsModule === 'function') {
            console.log('Вызываем initDynamicsModule...');
            initDynamicsModule();
        } else {
            console.error('Функция initDynamicsModule не найдена!');
        }

        // Модуль рейтингов инициализируется при переключении на вкладку

        // Инициализируем динамику компании
        console.log('Проверяем наличие функции initCompanyDynamics:', typeof initCompanyDynamics);
        if (typeof initCompanyDynamics === 'function') {
            console.log('Вызываем initCompanyDynamics...');
            initCompanyDynamics();
        } else {
            console.error('Функция initCompanyDynamics не найдена!');
        }

        // Инициализируем дашборд чек-листов
        console.log('Проверяем наличие дашборда чек-листов:', typeof window.checklistDashboard);
        if (typeof window.checklistDashboard === 'object' && typeof window.checklistDashboard.init === 'function') {
            console.log('Вызываем инициализацию дашборда чек-листов...');
            window.checklistDashboard.init();
        } else {
            console.error('Дашборд чек-листов не найден!');
        }

        // Инициализируем модуль детализации по сотруднику (только обработчики, без загрузки данных)
        if (typeof initEmployeeDetailsEventListeners === 'function') {
            console.log('Инициализируем обработчики детализации по сотруднику...');
            initEmployeeDetailsEventListeners();
        }

        // Инициализируем модуль динамики сотрудника (только обработчики)
        if (typeof initEmployeeDynamicsEventListeners === 'function') {
            console.log('Инициализируем обработчики динамики сотрудника...');
            initEmployeeDynamicsEventListeners();
        }
        // Данные будут загружены при первом открытии вкладки

        // Повторно инициализируем сворачивающиеся блоки после загрузки всех модулей
        if (typeof initCollapsibleSections === 'function') {
            console.log('Повторная инициализация сворачивающихся блоков...');
            initCollapsibleSections();
        }
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
    window.syncEmployeeDynamicsFilters = syncEmployeeDynamicsFilters;
}
