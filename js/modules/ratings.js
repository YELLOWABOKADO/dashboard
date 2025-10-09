/**
 * Модуль управления вкладкой "Рейтинги"
 */

console.log('🚀 МОДУЛЬ RATINGS.JS НАЧАЛ ЗАГРУЖАТЬСЯ');

// Функция инициализации модуля рейтингов
async function initRatingsModule() {
    console.log('=== Инициализация модуля рейтингов ===');

    // Проверяем наличие критически важных элементов
    const criticalElements = [
        'ratDepartmentsDropdown',
        'ratEmployeesDropdown',
        'ratDepartmentsButton',
        'ratEmployeesButton',
        'ratDepartmentsText',
        'ratEmployeesText',
        'ratUpdateButton',
        'ratingsDetails'
    ];

    const missingElements = criticalElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.error('Отсутствуют критически важные элементы:', missingElements);
        return;
    }

    console.log('Все критически важные элементы найдены');

    // Заполняем фильтры данными
    await populateRatingsFilters();

    // Инициализируем фильтры для рейтингов
    setupRatingsFilters();

    // Инициализируем сворачивающиеся блоки
    if (typeof initCollapsibleSections === 'function') {
        initCollapsibleSections();
    }

    // Автоматически загружаем данные при инициализации
    setTimeout(() => {
        console.log('Вызываем loadRatingsDetails после инициализации');
        loadRatingsDetails();
    }, 200);

    console.log('Модуль рейтингов инициализирован');
}

// Функция для заполнения фильтров рейтингов данными
async function populateRatingsFilters() {
    console.log('=== Заполнение фильтров рейтингов ===');

    try {
        // Загружаем данные операторов
        const operatorData = await loadOperatorData();
        if (!operatorData) {
            console.error('Не удалось загрузить данные для фильтров рейтингов');
            return;
        }

        // Собираем уникальные группы и сотрудников
        const groups = new Set();
        const employees = new Set();

        Object.keys(operatorData).forEach(employeeName => {
            const employee = operatorData[employeeName];
            if (employee['Группа']) {
                groups.add(employee['Группа']);
            }
            employees.add(employeeName);
        });

        // Заполняем dropdown групп
        const departmentsDropdown = document.getElementById('ratDepartmentsDropdown');
        if (departmentsDropdown) {
            // Очищаем существующие опции кроме "Все группы"
            const existingOptions = departmentsDropdown.querySelectorAll('input[type="checkbox"]:not([value="all"])');
            existingOptions.forEach(option => option.parentElement.remove());

            // Добавляем новые опции
            Array.from(groups).sort().forEach(group => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'multi-select-option';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `rat_dept_${group.replace(/\s+/g, '_').toLowerCase()}`;
                checkbox.value = group;

                const label = document.createElement('label');
                label.setAttribute('for', checkbox.id);
                label.textContent = `${group} - группа`;

                optionDiv.appendChild(checkbox);
                optionDiv.appendChild(label);
                departmentsDropdown.appendChild(optionDiv);
            });

            console.log('Dropdown групп заполнен:', Array.from(groups).length, 'групп');
        }

        // Заполняем dropdown сотрудников
        const employeesDropdown = document.getElementById('ratEmployeesDropdown');
        if (employeesDropdown) {
            // Очищаем существующие опции кроме "Все сотрудники"
            const existingOptions = employeesDropdown.querySelectorAll('input[type="checkbox"]:not([value="all"])');
            existingOptions.forEach(option => option.parentElement.remove());

            // Добавляем новые опции
            Array.from(employees).sort().forEach(employee => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'multi-select-option';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `rat_emp_${employee.replace(/\s+/g, '_').toLowerCase()}`;
                checkbox.value = employee;

                const label = document.createElement('label');
                label.setAttribute('for', checkbox.id);
                label.textContent = employee;

                optionDiv.appendChild(checkbox);
                optionDiv.appendChild(label);
                employeesDropdown.appendChild(optionDiv);
            });

            console.log('Dropdown сотрудников заполнен:', Array.from(employees).length, 'сотрудников');
        }

        console.log('Фильтры рейтингов заполнены:', {
            groups: Array.from(groups),
            employees: Array.from(employees)
        });

    } catch (error) {
        console.error('Ошибка при заполнении фильтров рейтингов:', error);
    }
}

// Настройка фильтров для вкладки рейтингов
function setupRatingsFilters() {
    console.log('=== Настройка фильтров рейтингов ===');

    // Обработчик кнопки "Обновить"
    const updateButton = document.getElementById('ratUpdateButton');
    if (updateButton) {
        updateButton.addEventListener('click', async function (e) {
            console.log('=== Кнопка "Обновить" рейтингов нажата ===');
            e.preventDefault();
            e.stopPropagation();

            console.log('Вызываем updateRatingsData...');
            await updateRatingsData();
            console.log('updateRatingsData завершен');
        });
        console.log('Обработчик кнопки "Обновить" добавлен');
    } else {
        console.error('Кнопка ratUpdateButton не найдена!');
    }

    // Настройка мультиселекта для групп
    setupRatingsMultiSelect('ratDepartments', 'Все группы');

    // Настройка мультиселекта для сотрудников
    setupRatingsMultiSelect('ratEmployees', 'Все сотрудники');

    // Устанавливаем начальный текст для кнопок
    updateRatingsMultiSelectText('ratDepartments', 'Все группы');
    updateRatingsMultiSelectText('ratEmployees', 'Все сотрудники');
}

// Настройка мультиселекта для рейтингов
function setupRatingsMultiSelect(prefix, defaultText) {
    const button = document.getElementById(prefix + 'Button');
    const dropdown = document.getElementById(prefix + 'Dropdown');
    const textSpan = document.getElementById(prefix + 'Text');

    if (!button || !dropdown || !textSpan) {
        console.error(`Элементы мультиселекта ${prefix} не найдены`, {
            button: !!button,
            dropdown: !!dropdown,
            textSpan: !!textSpan
        });
        return;
    }

    console.log(`Настраиваем мультиселект ${prefix}`);

    // Обработчик клика по кнопке
    button.addEventListener('click', function (e) {
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        const isVisible = window.getComputedStyle(dropdown).display !== 'none';
        const nextDisplay = isVisible ? 'none' : 'block';
        dropdown.style.display = nextDisplay;
        dropdown.classList.toggle('show', nextDisplay === 'block');
        // Дублируем в следующий тик на случай внешних обработчиков
        setTimeout(() => {
            dropdown.style.display = nextDisplay;
            dropdown.classList.toggle('show', nextDisplay === 'block');
        }, 0);
        console.log(`Клик по кнопке ${prefix}, dropdown теперь: ${dropdown.style.display}`);
    });

    // Закрытие при клике вне элемента
    document.addEventListener('click', function (e) {
        console.log(`Document click: target=${e.target.id || e.target.tagName}, button.contains=${button.contains(e.target)}, dropdown.contains=${dropdown.contains(e.target)}`);
        if (!button.contains(e.target) && !dropdown.contains(e.target)) {
            console.log(`Закрываем dropdown ${prefix} при клике вне элемента`);
            dropdown.style.display = 'none';
            dropdown.classList.remove('show');
        }
    });

    // Останавливаем всплытие кликов внутри дропдауна, чтобы внешние хендлеры не закрывали его
    dropdown.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Обработчик изменения чекбоксов через event delegation
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
    console.log(`Найдено чекбоксов для ${prefix}: ${checkboxes.length}`);

    // Используем event delegation для более надежной работы
    dropdown.addEventListener('change', function (e) {
        if (e.target.type === 'checkbox') {
            const checkbox = e.target;
            console.log(`Чекбокс ${prefix} изменен: ${checkbox.value}, checked: ${checkbox.checked}`);

            if (checkbox.value === 'all') {
                // Если выбран "Все", снимаем остальные
                checkboxes.forEach(cb => {
                    if (cb !== checkbox) cb.checked = false;
                });
            } else {
                // Если выбран конкретный элемент, снимаем "Все"
                const allCheckbox = dropdown.querySelector('input[value="all"]');
                if (allCheckbox) allCheckbox.checked = false;
            }

            updateRatingsMultiSelectText(prefix, defaultText);
            console.log(`Текст кнопки обновлен для ${prefix}`);
        }
    });

    // Также добавим индивидуальные обработчики для надежности
    checkboxes.forEach((checkbox, index) => {
        console.log(`Чекбокс ${index}: ${checkbox.value}, label: ${checkbox.nextElementSibling?.textContent}`);
    });
}

// Обновление текста мультиселекта для рейтингов
function updateRatingsMultiSelectText(prefix, defaultText) {
    const dropdown = document.getElementById(prefix + 'Dropdown');
    const textSpan = document.getElementById(prefix + 'Text');

    if (!dropdown || !textSpan) return;

    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
    const allCheckbox = dropdown.querySelector('input[value="all"]:checked');

    if (allCheckbox || checkboxes.length === 0) {
        textSpan.textContent = defaultText;
    } else if (checkboxes.length === 1) {
        const labelText = checkboxes[0].nextElementSibling.textContent;
        // Для групп убираем " - группа" из текста кнопки
        if (prefix === 'ratDepartments') {
            textSpan.textContent = labelText.replace(/\s*-\s*группа\s*$/i, '').trim();
        } else {
            textSpan.textContent = labelText;
        }
    } else {
        textSpan.textContent = `Выбрано: ${checkboxes.length}`;
    }
}

// Основная функция обновления данных рейтингов
async function updateRatingsData() {
    console.log('=== Обновление данных рейтингов ===');

    // Получаем параметры фильтров
    const filters = getRatingsFilters();
    console.log('Фильтры рейтингов:', filters);

    // Проверяем валидность диапазона дат
    if (!validateDateRange(filters.startDate, filters.endDate, null)) {
        return;
    }

    // Загружаем рейтинги
    await loadRatingsDetails();
}

// Получение значений фильтров рейтингов
function getRatingsFilters() {
    const filters = {
        startDate: document.getElementById('ratStartDate')?.value || '2025-07-01',
        endDate: document.getElementById('ratEndDate')?.value || '2025-07-31',
        callCenter: document.getElementById('ratCallCenter')?.value || 'Все КЦ',
        dashboard: document.getElementById('ratDashboard')?.value || 'Автооценка',
        departments: getSelectedRatingsValues('ratDepartments'),
        employees: getSelectedRatingsValues('ratEmployees')
    };

    console.log('Получены фильтры рейтингов:', filters);
    console.log('Элементы фильтров найдены:', {
        ratStartDate: !!document.getElementById('ratStartDate'),
        ratEndDate: !!document.getElementById('ratEndDate'),
        ratCallCenter: !!document.getElementById('ratCallCenter'),
        ratDashboard: !!document.getElementById('ratDashboard')
    });

    return filters;
}

// Получение выбранных значений мультиселекта рейтингов
function getSelectedRatingsValues(prefix) {
    const dropdown = document.getElementById(prefix + 'Dropdown');
    if (!dropdown) {
        console.log(`Dropdown ${prefix} не найден`);
        return [];
    }

    const allCheckbox = dropdown.querySelector('input[value="all"]:checked');
    if (allCheckbox) {
        console.log(`Для ${prefix} выбран "all"`);
        return ['all'];
    }

    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked:not([value="all"])');
    const values = Array.from(checkboxes).map(cb => cb.value);
    console.log(`Для ${prefix} выбраны значения:`, values);
    return values;
}

// Функция загрузки рейтингов
async function loadRatingsDetails() {
    console.log('=== Загрузка рейтингов ===');

    const container = document.getElementById('ratingsDetails');
    if (!container) {
        console.error('Контейнер рейтингов не найден');
        return;
    }

    console.log('Контейнер найден, показываем загрузку');
    // Показываем индикатор загрузки
    container.innerHTML = '<div class="loading">Загрузка рейтингов...</div>';

    try {
        // Получаем фильтры
        const filters = getRatingsFilters();
        console.log('Текущие фильтры рейтингов:', filters);

        // Загружаем данные операторов
        console.log('Загружаем данные операторов...');
        const operatorData = await loadOperatorData();
        if (!operatorData) {
            console.error('Не удалось загрузить данные операторов');
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки данных</div>';
            return;
        }

        console.log('Данные операторов загружены, количество:', Object.keys(operatorData).length);

        // Проверим, реальные ли данные или тестовые
        const isTestData = operatorData === window.TEMP_OPERATOR_DATA || (operatorData && Object.keys(operatorData).length === 6 && operatorData['Маркина И. М.']);
        console.log('🔍 Тип данных:', isTestData ? 'ВЫДУМАННЫЕ (тестовые)' : 'РЕАЛЬНЫЕ (из JSON)');
        if (isTestData) {
            console.warn('⚠️ ВНИМАНИЕ: Используются выдуманные тестовые данные! Проверьте загрузку callcenter_operator_data.json');
        }

        // Фильтруем сотрудников
        const filteredEmployees = filterEmployeesForRatings(operatorData, filters);
        console.log('Отфильтрованные сотрудники для рейтингов:', filteredEmployees.length, 'сотрудников');

        if (filteredEmployees.length === 0) {
            console.log('Нет данных для выбранных фильтров, показываем сообщение');
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Нет данных для выбранных фильтров</div>';
            return;
        }

        // Вычисляем рейтинги
        const ratingsData = calculateRatings(operatorData, filteredEmployees, filters);
        console.log('Вычислены рейтинги для', ratingsData.length, 'сотрудников');

        // Генерируем HTML таблицы рейтингов
        const tableHTML = generateRatingsTable(ratingsData, filters);
        container.innerHTML = tableHTML;

        console.log(`Рейтинги загружены успешно (${filteredEmployees.length} сотрудников)`);

    } catch (error) {
        console.error('Ошибка при загрузке рейтингов:', error);
        container.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки рейтингов</div>';
    }
}

// Фильтрация сотрудников для рейтингов
function filterEmployeesForRatings(operatorData, filters) {
    return Object.keys(operatorData).filter(employeeName => {
        const employee = operatorData[employeeName];

        // Фильтр по КЦ
        if (filters.callCenter !== 'Все КЦ' && employee['КЦ'] !== filters.callCenter) {
            return false;
        }

        // Фильтр по группам
        if (filters.departments.length > 0 && !filters.departments.includes('all')) {
            const employeeDepartment = employee['Группа'];
            // Проверяем, совпадает ли группа с любой из выбранных (учитываем формат "Группа - группа")
            const matchesDepartment = filters.departments.some(dept => {
                // Убираем " - группа" из фильтра для сравнения
                const cleanDept = dept.replace(/\s*-\s*группа\s*$/i, '').trim();
                return employeeDepartment === cleanDept;
            });
            if (!matchesDepartment) {
                return false;
            }
        }

        // Фильтр по сотрудникам
        if (filters.employees.length > 0 && !filters.employees.includes('all')) {
            if (!filters.employees.includes(employeeName)) {
                return false;
            }
        }

        return true;
    });
}

// Вычисление рейтингов операторов
function calculateRatings(operatorData, filteredEmployees, filters) {
    console.log('🎯 calculateRatings вызвана с параметрами:', {
        operatorDataKeys: Object.keys(operatorData || {}),
        filteredEmployeesCount: filteredEmployees?.length || 0,
        filteredEmployees: filteredEmployees,
        filters
    });

    const ratings = [];

    filteredEmployees.forEach(employeeName => {
        const employee = operatorData[employeeName];
        console.log(`👤 Обрабатываем сотрудника: ${employeeName}`, {
            employeeExists: !!employee,
            employeeGroup: employee?.['Группа'],
            employeeCallCenter: employee?.['КЦ']
        });

        if (!employee) {
            console.error(`❌ Сотрудник ${employeeName} не найден в данных!`);
            return;
        }

        const employeeData = employee['Данные'];
        if (!employeeData) {
            console.error(`❌ У сотрудника ${employeeName} нет данных!`);
            return;
        }

        // Вычисляем суммарные показатели за период
        let totalCalls = 0;
        let totalDeviations = 0;
        let daysCount = 0;

        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        console.log(`📅 Период анализа: ${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`);

        Object.keys(employeeData).forEach(dateStr => {
            const date = new Date(dateStr);
            if (date >= startDate && date <= endDate) {
                const dayData = employeeData[dateStr];
                const calls = dayData['Звонков'] || 0;
                const deviations = dayData['Отклонений'] || 0;

                totalCalls += calls;
                totalDeviations += deviations;
                daysCount++;

                console.log(`📊 День ${dateStr}: звонков=${calls}, отклонений=${deviations}`);
            }
        });

        const percentage = totalCalls > 0 ? (totalDeviations / totalCalls) * 100 : 0;

        const rating = {
            name: employeeName,
            group: employee['Группа'] || 'Без группы',
            callCenter: employee['КЦ'] || 'Не указан',
            totalCalls: totalCalls,
            totalDeviations: totalDeviations,
            daysCount: daysCount,
            percentage: Math.round(percentage * 100) / 100
        };

        console.log(`✅ Рейтинг для ${employeeName}:`, rating);
        ratings.push(rating);
    });

    // Сортируем по проценту отклонений (возрастание - лучший рейтинг)
    ratings.sort((a, b) => a.percentage - b.percentage);

    // Добавляем общее место в рейтинге
    ratings.forEach((rating, index) => {
        rating.overallPosition = index + 1;
    });

    // Вычисляем место в КЦ для каждого оператора
    const callCenters = [...new Set(ratings.map(r => r.callCenter))];
    
    callCenters.forEach(callCenter => {
        const ccRatings = ratings.filter(r => r.callCenter === callCenter);
        ccRatings.forEach((rating, index) => {
            rating.callCenterPosition = index + 1;
        });
    });

    console.log('🏆 Финальные рейтинги:', ratings.map(r => ({
        name: r.name,
        percentage: r.percentage,
        calls: r.totalCalls,
        deviations: r.totalDeviations,
        overallPosition: r.overallPosition,
        callCenterPosition: r.callCenterPosition,
        callCenter: r.callCenter
    })));

    console.log('📊 Места в КЦ по операторам:');
    callCenters.forEach(cc => {
        const ccOperators = ratings.filter(r => r.callCenter === cc);
        console.log(`КЦ ${cc}:`, ccOperators.map(r => `${r.name} - место ${r.callCenterPosition}`));
    });

    return ratings;
}

// Генерация HTML таблицы рейтингов
function generateRatingsTable(ratingsData, filters) {
    let tableHTML = `
        <div class="ratings-container">
            <div class="ratings-header">
                <h3>🏆 Рейтинг операторов по проценту отклонений</h3>
                <div class="ratings-period-info">
                    Период: ${filters.startDate} - ${filters.endDate}
                </div>
            </div>
            <div class="ratings-table-container">
                <table class="ratings-table">
                    <thead>
                        <tr>
                            <th>Место</th>
                            <th>Место в КЦ</th>
                            <th>ФИО</th>
                            <th>Группа</th>
                            <th>КЦ</th>
                            <th>Всего звонков</th>
                            <th>Отклонений</th>
                            <th>% отклонений</th>
                            <th>Дней</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    ratingsData.forEach((rating, index) => {
        const position = index + 1;
        let rankIcon = '';

        // Отмечаем первые три места звездочками
        if (position === 1) {
            rankIcon = '⭐';
        } else if (position === 2) {
            rankIcon = '⭐⭐';
        } else if (position === 3) {
            rankIcon = '⭐⭐⭐';
        }

        const rowClass = position <= 3 ? 'top-rating' : '';

        // Иконки для места в КЦ
        let ccRankIcon = '';
        if (rating.callCenterPosition === 1) {
            ccRankIcon = '🥇';
        } else if (rating.callCenterPosition === 2) {
            ccRankIcon = '🥈';
        } else if (rating.callCenterPosition === 3) {
            ccRankIcon = '🥉';
        }

        tableHTML += `
            <tr class="${rowClass}">
                <td class="position-cell">
                    ${rankIcon ? `<span class="rank-icon">${rankIcon}</span>` : ''}
                    ${position}
                </td>
                <td class="cc-position-cell">
                    ${ccRankIcon ? `<span class="cc-rank-icon">${ccRankIcon}</span>` : ''}
                    ${rating.callCenterPosition}
                </td>
                <td class="name-cell">${rating.name}</td>
                <td class="group-cell">${rating.group}</td>
                <td class="callcenter-cell">${rating.callCenter}</td>
                <td class="calls-cell">${rating.totalCalls.toLocaleString()}</td>
                <td class="deviations-cell">${rating.totalDeviations.toLocaleString()}</td>
                <td class="percentage-cell">${rating.percentage.toFixed(2)}%</td>
                <td class="days-cell">${rating.daysCount}</td>
            </tr>
        `;
    });

    tableHTML += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return tableHTML;
}

// Экспорт функций для браузера
if (typeof window !== 'undefined') {
    window.initRatingsModule = initRatingsModule;
    window.updateRatingsData = updateRatingsData;
    window.loadRatingsDetails = loadRatingsDetails;
    window.getRatingsFilters = getRatingsFilters;
    window.setupRatingsFilters = setupRatingsFilters;
    window.populateRatingsFilters = populateRatingsFilters;

    console.log('=== ratings.js загружен ===');
    console.log('Функции экспортированы:', {
        initRatingsModule: typeof window.initRatingsModule,
        updateRatingsData: typeof window.updateRatingsData,
        loadRatingsDetails: typeof window.loadRatingsDetails,
        getRatingsFilters: typeof window.getRatingsFilters,
        setupRatingsFilters: typeof window.setupRatingsFilters,
        populateRatingsFilters: typeof window.populateRatingsFilters
    });

    // Автоматическая инициализация при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            console.log('=== Автоматическая инициализация модуля рейтингов ===');
            setTimeout(() => {
                if (typeof initRatingsModule === 'function') {
                    initRatingsModule();
                    console.log('Модуль рейтингов инициализирован автоматически');
                } else {
                    console.error('Функция initRatingsModule не найдена при автоматической инициализации');
                }
            }, 100);
        });
    } else {
        // Если DOM уже загружен
        setTimeout(() => {
            if (typeof initRatingsModule === 'function') {
                initRatingsModule();
                console.log('Модуль рейтингов инициализирован автоматически (DOM уже загружен)');
            } else {
                console.error('Функция initRatingsModule не найдена при автоматической инициализации');
            }
        }, 100);
    }
}

console.log('🏁 МОДУЛЬ RATINGS.JS ПОЛНОСТЬЮ ЗАГРУЖЕН');