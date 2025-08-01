/**
 * Модуль управления сотрудниками
 */

// Состояние сортировки для сотрудников
let employeesSortState = {
    column: 'percentage', // по умолчанию сортируем по % отклонений
    direction: 'desc' // по убыванию (сначала худшие показатели)
};

// Сохраняем данные для повторного использования при сортировке
let cachedEmployeesData = null;

// Функция для получения индикатора сортировки
function getEmployeesSortIndicator(column) {
    if (employeesSortState.column !== column) {
        return '<span class="sort-indicator">↕</span>';
    }
    return employeesSortState.direction === 'asc'
        ? '<span class="sort-indicator active">↑</span>'
        : '<span class="sort-indicator active">↓</span>';
}

// Обновление данных сотрудников
async function updateEmployeesData() {
    console.log('=== updateEmployeesData вызвана ===');

    // Проверяем критически важные элементы
    if (!document.getElementById('employeesTable')) {
        console.error('Элемент employeesTable не найден!');
        return;
    }

    const startDate = document.getElementById('empStartDate').value;
    const endDate = document.getElementById('empEndDate').value;
    const callCenter = document.getElementById('empCallCenter').value;

    // Получаем выбранные группы и сотрудников
    const selectedDepartments = getSelectedMultiSelectValues('empDepartmentsDropdown');
    const selectedEmployees = getSelectedMultiSelectValues('empEmployeesDropdown');

    console.log('Параметры команды:', { startDate, endDate, callCenter, selectedDepartments, selectedEmployees });

    if (!validateDateRange(startDate, endDate, 'Месяц')) {
        console.log('Валидация дат не прошла');
        return;
    }

    showLoading('employeesTable');

    try {
        // Проверяем, что функция getEmployeesData загружена
        if (typeof getEmployeesData !== 'function') {
            console.warn('getEmployeesData не загружена. Используем тестовые данные.');
            // Загружаем тестовые данные для демонстрации сортировки
            loadTestEmployeesData();
            return;
        }

        const employeesData = await getEmployeesData(startDate, endDate, 'Месяц', callCenter, selectedDepartments, selectedEmployees);
        console.log('Получены данные команды:', employeesData);

        if (employeesData && employeesData.current && employeesData.current.length > 0) {
            renderEmployeesTable(employeesData);

            // Загружаем детализацию
            if (typeof loadRealEmployeeDetails === 'function') {
                console.log('Загружаем реальную детализацию...');
                setTimeout(loadRealEmployeeDetails, 200);
            } else if (typeof loadEmployeeDetails === 'function') {
                const filters = {
                    startDate,
                    endDate,
                    timeGranularity: 'Месяц',
                    callCenter,
                    departments: selectedDepartments,
                    employees: selectedEmployees
                };
                loadEmployeeDetails(filters);
            }
        } else {
            console.log('employeesData пустые, загружаем тестовые данные');
            loadTestEmployeesData();
        }
    } catch (error) {
        console.error('Ошибка загрузки данных команды:', error);
        console.log('Загружаем тестовые данные из-за ошибки');
        loadTestEmployeesData();
    }
}

// Отрисовка таблицы сотрудников
function renderEmployeesTable(employeesData) {
    const tableContainer = document.getElementById('employeesTable');
    if (!tableContainer) return;

    console.log('=== renderEmployeesTable вызвана ===', employeesData);

    // Сохраняем данные для повторного использования при сортировке
    cachedEmployeesData = employeesData;

    if (!employeesData || !employeesData.current || employeesData.current.length === 0) {
        tableContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
                <h4>⚠️ Нет данных</h4>
                <p>Данные для выбранных фильтров не найдены</p>
            </div>
        `;
        return;
    }

    let tableHTML = `
        <h4>Сотрудники</h4>
        <table>
            <thead>
                <tr>
                    <th class="sortable-header" data-column="name">СОТРУДНИК ${getEmployeesSortIndicator('name')}</th>
                    <th class="sortable-header" data-column="department">ПОДРАЗДЕЛЕНИЕ ${getEmployeesSortIndicator('department')}</th>
                    <th class="text-right sortable-header" data-column="callCenter">КЦ ${getEmployeesSortIndicator('callCenter')}</th>
                    <th class="text-right sortable-header" data-column="calls">ОЦЕНЕНО ЗВОНКОВ ${getEmployeesSortIndicator('calls')}</th>
                    <th class="text-right sortable-header" data-column="deviations">ОТКЛОНЕНИЙ ${getEmployeesSortIndicator('deviations')}</th>
                    <th class="text-right sortable-header" data-column="percentage">% ОТКЛОНЕНИЙ ${getEmployeesSortIndicator('percentage')}</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Создаем массив сотрудников с предыдущими данными для сортировки
    const employeesArray = employeesData.current.map((emp, index) => {
        const prevEmp = employeesData.previous[index] || { calls: 0, deviations: 0, percentage: 0 };
        return {
            ...emp,
            previous: prevEmp
        };
    });

    // Сортируем данные
    employeesArray.sort((a, b) => {
        let valueA, valueB;

        switch (employeesSortState.column) {
            case 'name':
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 'department':
                valueA = a.department.toLowerCase();
                valueB = b.department.toLowerCase();
                break;
            case 'callCenter':
                valueA = a.callCenter;
                valueB = b.callCenter;
                break;
            case 'calls':
                valueA = a.calls;
                valueB = b.calls;
                break;
            case 'deviations':
                valueA = a.deviations;
                valueB = b.deviations;
                break;
            case 'percentage':
                valueA = a.percentage;
                valueB = b.percentage;
                break;
            default:
                return 0;
        }

        if (valueA < valueB) {
            return employeesSortState.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return employeesSortState.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Обрабатываем отсортированные данные
    employeesArray.forEach(emp => {
        // Вычисляем процентные изменения
        const callsChangePercent = emp.previous.calls > 0 ? ((emp.calls - emp.previous.calls) / emp.previous.calls * 100) : 0;
        const deviationsChangePercent = emp.previous.deviations > 0 ? ((emp.deviations - emp.previous.deviations) / emp.previous.deviations * 100) : 0;
        const percentageChange = emp.percentage - emp.previous.percentage;

        tableHTML += `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td class="text-right">${emp.callCenter}</td>
                <td class="text-right">${emp.calls.toLocaleString()} ${createChangeBadge(callsChangePercent, 'percentage')}</td>
                <td class="text-right">${emp.deviations.toLocaleString()} ${createChangeBadge(deviationsChangePercent, 'percentage')}</td>
                <td class="text-right"><span class="${getPercentageClass(emp.percentage)}">${emp.percentage}%</span> ${createChangeBadge(percentageChange, 'percentage')}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;

    // Показываем графики и инициализируем их
    const chartsContainer = document.getElementById('employeesCharts');
    const chartsContent = document.getElementById('employeesChartsContent');
    if (chartsContainer && typeof initEmployeeCharts === 'function') {
        chartsContainer.style.display = 'grid';
        // Проверяем, не свернут ли блок графиков
        const isChartsCollapsed = chartsContent && chartsContent.classList.contains('collapsed');
        if (!isChartsCollapsed) {
            // Небольшая задержка для корректной отрисовки canvas элементов
            setTimeout(() => {
                initEmployeeCharts(cachedEmployeesData);
            }, 200);
        }
    }

    // Добавляем обработчики кликов для сортировки
    setTimeout(() => {
        const sortableHeaders = document.querySelectorAll('#employeesTable .sortable-header');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', function () {
                const column = this.getAttribute('data-column');
                console.log('Клик по заголовку сотрудников:', column);

                // Если кликнули по той же колонке, меняем направление
                if (employeesSortState.column === column) {
                    employeesSortState.direction = employeesSortState.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    // Если новая колонка, устанавливаем направление по умолчанию
                    employeesSortState.column = column;
                    employeesSortState.direction = column === 'percentage' ? 'desc' : 'asc';
                }

                console.log('Новое состояние сортировки сотрудников:', employeesSortState);

                // Перерисовываем таблицу с новой сортировкой
                renderEmployeesTable(cachedEmployeesData);
            });
        });

        // Обновляем высоту сворачивающегося блока после отрисовки
        const content = document.getElementById('employeesTableContent');
        if (content && !content.classList.contains('collapsed')) {
            setTimeout(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
            }, 50);
        }
    }, 100);
}

// Настройка фильтров сотрудников
function setupEmployeeFilters() {
    console.log('=== setupEmployeeFilters вызвана ===');

    // Настройка выпадающих списков
    setupEmployeeDropdowns();

    // Сворачивающиеся блоки настраиваются через общую систему initCollapsibleSections

    // Обработчик кнопки обновления для команды
    const empUpdateButton = document.getElementById('empUpdateButton');
    console.log('Кнопка обновления команды:', empUpdateButton);

    if (empUpdateButton) {
        console.log('Добавляем обработчик для кнопки команды');
        empUpdateButton.addEventListener('click', function (e) {
            console.log('=== Клик по кнопке обновления команды ===');
            e.preventDefault();
            updateEmployeesData();
        });

        // Убираем возможные блокировки
        empUpdateButton.style.pointerEvents = 'auto';
        empUpdateButton.disabled = false;
    } else {
        console.error('Кнопка empUpdateButton не найдена!');
    }
}

// Обработка изменений чекбоксов групп сотрудников
function handleEmployeeDepartmentCheckboxChange(checkbox) {
    const dropdown = document.getElementById('empDepartmentsDropdown');
    const allCheckbox = dropdown.querySelector('input[value="all"]');

    if (checkbox.value === 'all') {
        // Если выбран "Все", снимаем остальные
        if (checkbox.checked) {
            dropdown.querySelectorAll('input[type="checkbox"]:not([value="all"])').forEach(cb => {
                cb.checked = false;
            });
        }
    } else {
        // Если выбран конкретный пункт, снимаем "Все"
        if (checkbox.checked) {
            allCheckbox.checked = false;
        } else {
            // Если ни один пункт не выбран, ставим "Все"
            const anyChecked = dropdown.querySelectorAll('input[type="checkbox"]:not([value="all"]):checked').length > 0;
            if (!anyChecked) {
                allCheckbox.checked = true;
            }
        }
    }

    updateMultiSelectButtonText('empDepartmentsDropdown', 'empDepartmentsText');
}

// Обработка изменений чекбоксов сотрудников
function handleEmployeeCheckboxChange(checkbox) {
    const dropdown = document.getElementById('empEmployeesDropdown');
    const allCheckbox = dropdown.querySelector('input[value="all"]');

    if (checkbox.value === 'all') {
        // Если выбран "Все", снимаем остальные
        if (checkbox.checked) {
            dropdown.querySelectorAll('input[type="checkbox"]:not([value="all"])').forEach(cb => {
                cb.checked = false;
            });
        }
    } else {
        // Если выбран конкретный пункт, снимаем "Все"
        if (checkbox.checked) {
            allCheckbox.checked = false;
        } else {
            // Если ни один пункт не выбран, ставим "Все"
            const anyChecked = dropdown.querySelectorAll('input[type="checkbox"]:not([value="all"]):checked').length > 0;
            if (!anyChecked) {
                allCheckbox.checked = true;
            }
        }
    }

    updateMultiSelectButtonText('empEmployeesDropdown', 'empEmployeesText');
}

// Настройка выпадающих списков для сотрудников
function setupEmployeeDropdowns() {
    // Настройка выпадающего списка групп
    const empDepartmentsButton = document.getElementById('empDepartmentsButton');
    const empDepartmentsDropdown = document.getElementById('empDepartmentsDropdown');

    if (empDepartmentsButton && empDepartmentsDropdown) {
        empDepartmentsButton.addEventListener('click', function (e) {
            e.stopPropagation();
            // Закрываем другие выпадающие списки
            document.querySelectorAll('.multi-select-dropdown').forEach(dd => {
                if (dd.id !== 'empDepartmentsDropdown') {
                    dd.style.display = 'none';
                }
            });
            // Переключаем текущий
            if (empDepartmentsDropdown.style.display === 'block') {
                empDepartmentsDropdown.style.display = 'none';
            } else {
                empDepartmentsDropdown.style.display = 'block';
            }
        });

        // Обработчики чекбоксов групп
        empDepartmentsDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
            if (e.target.type === 'checkbox') {
                handleEmployeeDepartmentCheckboxChange(e.target);
            }
        });
    }

    // Настройка выпадающего списка сотрудников
    const empEmployeesButton = document.getElementById('empEmployeesButton');
    const empEmployeesDropdown = document.getElementById('empEmployeesDropdown');

    if (empEmployeesButton && empEmployeesDropdown) {
        empEmployeesButton.addEventListener('click', function (e) {
            e.stopPropagation();
            // Закрываем другие выпадающие списки
            document.querySelectorAll('.multi-select-dropdown').forEach(dd => {
                if (dd.id !== 'empEmployeesDropdown') {
                    dd.style.display = 'none';
                }
            });
            // Переключаем текущий
            if (empEmployeesDropdown.style.display === 'block') {
                empEmployeesDropdown.style.display = 'none';
            } else {
                empEmployeesDropdown.style.display = 'block';
            }
        });

        // Обработчики чекбоксов сотрудников
        empEmployeesDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
            if (e.target.type === 'checkbox') {
                handleEmployeeCheckboxChange(e.target);
            }
        });
    }

    // Закрытие выпадающих списков при клике вне их
    document.addEventListener('click', function () {
        document.querySelectorAll('.multi-select-dropdown').forEach(dd => {
            dd.style.display = 'none';
        });
    });
}

// Функция для загрузки тестовых данных (для отладки)
function loadTestEmployeesData() {
    console.log('Загружаем тестовые данные для вкладки "Команда"');

    const testEmployeesData = {
        current: [
            {
                name: "Маркина И. М.",
                department: "Гридчина - группа",
                callCenter: "КЦ1",
                calls: 329,
                deviations: 292,
                percentage: 1.9
            },
            {
                name: "Ермошина С. В.",
                department: "Гридчина - группа",
                callCenter: "КЦ1",
                calls: 993,
                deviations: 298,
                percentage: 1.86
            },
            {
                name: "Кузнецова В. Ю.",
                department: "Гридчина - группа",
                callCenter: "КЦ1",
                calls: 1022,
                deviations: 247,
                percentage: 1.64
            },
            {
                name: "Анпилогов Е. А.",
                department: "Коровина - группа",
                callCenter: "КЦ1",
                calls: 1125,
                deviations: 293,
                percentage: 1.94
            },
            {
                name: "Тарасова К. И.",
                department: "Коровина - группа",
                callCenter: "КЦ1",
                calls: 1362,
                deviations: 251,
                percentage: 1.63
            },
            {
                name: "Борисова В. А.",
                department: "Коровина - группа",
                callCenter: "КЦ1",
                calls: 1195,
                deviations: 218,
                percentage: 1.43
            }
        ],
        previous: [
            { calls: 300, deviations: 280, percentage: 2.1 },
            { calls: 950, deviations: 290, percentage: 1.9 },
            { calls: 1000, deviations: 240, percentage: 1.7 },
            { calls: 1100, deviations: 285, percentage: 2.0 },
            { calls: 1300, deviations: 245, percentage: 1.7 },
            { calls: 1150, deviations: 210, percentage: 1.5 }
        ]
    };

    renderEmployeesTable(testEmployeesData);

    // Загружаем детализацию с тестовыми фильтрами
    console.log('Пробуем загрузить детализацию из loadTestEmployeesData...');
    if (typeof loadRealEmployeeDetails === 'function') {
        console.log('Загружаем реальную детализацию...');
        setTimeout(loadRealEmployeeDetails, 200);
    } else if (typeof loadSimpleEmployeeDetails === 'function') {
        console.log('Загружаем простую детализацию...');
        setTimeout(loadSimpleEmployeeDetails, 200);
    } else if (typeof loadEmployeeDetails === 'function') {
        console.log('Загружаем полную детализацию...');
        const filters = {
            startDate: document.getElementById('empStartDate')?.value || '2025-07-01',
            endDate: document.getElementById('empEndDate')?.value || '2025-07-31',
            timeGranularity: 'Месяц',
            callCenter: 'Все КЦ',
            departments: ['all'],
            employees: ['all']
        };
        setTimeout(() => loadEmployeeDetails(filters), 200);
    } else {
        console.error('Функции детализации не найдены в loadTestEmployeesData');
    }
}

// Сворачивающиеся блоки теперь управляются через общую систему initCollapsibleSections

// Инициализация модуля сотрудников
function initEmployeesModule() {
    console.log('=== Инициализация модуля сотрудников ===');

    // Инициализируем детализацию
    console.log('Проверяем наличие функции initEmployeeDetails:', typeof initEmployeeDetails);
    if (typeof initEmployeeDetails === 'function') {
        console.log('Вызываем initEmployeeDetails...');
        initEmployeeDetails();
    } else {
        console.error('Функция initEmployeeDetails не найдена!');
    }

    // Настраиваем обработчики для обновления детализации
    const empUpdateButton = document.getElementById('empUpdateButton');
    if (empUpdateButton) {
        console.log('Кнопка обновления найдена, добавляем обработчик');
        empUpdateButton.addEventListener('click', function () {
            console.log('Кнопка обновления нажата');
            updateEmployeesData();
            // Обновляем детализацию при обновлении данных
            if (typeof loadRealEmployeeDetails === 'function') {
                console.log('Загружаем реальную детализацию...');
                setTimeout(loadRealEmployeeDetails, 100);
            } else if (typeof updateEmployeeDetails === 'function') {
                console.log('Обновляем детализацию...');
                setTimeout(updateEmployeeDetails, 100);
            } else if (typeof loadSimpleEmployeeDetails === 'function') {
                console.log('Загружаем простую детализацию...');
                setTimeout(loadSimpleEmployeeDetails, 100);
            } else {
                console.error('Функции детализации не найдены');
            }
        });
    } else {
        console.error('Кнопка обновления не найдена');
    }
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.updateEmployeesData = updateEmployeesData;
    window.renderEmployeesTable = renderEmployeesTable;
    window.setupEmployeeFilters = setupEmployeeFilters;
    window.setupEmployeeDropdowns = setupEmployeeDropdowns;
    window.handleEmployeeDepartmentCheckboxChange = handleEmployeeDepartmentCheckboxChange;
    window.handleEmployeeCheckboxChange = handleEmployeeCheckboxChange;
    window.loadTestEmployeesData = loadTestEmployeesData;
    // setupEmployeeCollapsibleTable и setupEmployeeCollapsibleCharts удалены - используется общая система
    window.initEmployeesModule = initEmployeesModule;
    console.log('=== employees.js загружен ===');
}