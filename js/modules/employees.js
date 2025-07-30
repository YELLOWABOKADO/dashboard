/**
 * Модуль управления сотрудниками
 */

// Обновление данных сотрудников
async function updateEmployeesData() {
    console.log('=== updateEmployeesData вызвана ===');
    
    const startDate = document.getElementById('empStartDate').value;
    const endDate = document.getElementById('empEndDate').value;
    const granularity = document.getElementById('empTimeGranularity').value;
    const callCenter = document.getElementById('empCallCenter').value;
    
    // Получаем выбранные группы и сотрудников
    const selectedDepartments = getSelectedMultiSelectValues('empDepartmentsDropdown');
    const selectedEmployees = getSelectedMultiSelectValues('empEmployeesDropdown');
    
    console.log('Параметры команды:', { startDate, endDate, granularity, callCenter, selectedDepartments, selectedEmployees });
    
    if (!validateDateRange(startDate, endDate, granularity)) {
        console.log('Валидация дат не прошла');
        return;
    }
    
    showLoading('employeesTable');
    updatePeriodInfo(granularity, 'employeesPeriodInfo');
    
    try {
        // Проверяем, что функция getEmployeesData загружена
        if (typeof getEmployeesData !== 'function') {
            throw new Error('getEmployeesData не загружена. Проверьте подключение real-data-processor.js');
        }
        
        const employeesData = await getEmployeesData(startDate, endDate, granularity, callCenter, selectedDepartments, selectedEmployees);
        console.log('Получены данные команды:', employeesData);
        
        if (employeesData) {
            renderEmployeesTable(employeesData);
        } else {
            console.log('employeesData пустые, показываем заглушку');
            showError('employeesTable', 'Нет данных для выбранных фильтров');
        }
    } catch (error) {
        console.error('Ошибка загрузки данных команды:', error);
        showError('employeesTable', error.message);
    }
}

// Отрисовка таблицы сотрудников
function renderEmployeesTable(employeesData) {
    const tableContainer = document.getElementById('employeesTable');
    if (!tableContainer) return;

    console.log('=== renderEmployeesTable вызвана ===', employeesData);

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
                    <th>СОТРУДНИК</th>
                    <th>ПОДРАЗДЕЛЕНИЕ</th>
                    <th class="text-right">КЦ</th>
                    <th class="text-right">ОЦЕНЕНО ЗВОНКОВ</th>
                    <th class="text-right">ОТКЛОНЕНИЙ</th>
                    <th class="text-right">% ОТКЛОНЕНИЙ</th>
                </tr>
            </thead>
            <tbody>
    `;

    employeesData.current.forEach((emp, index) => {
        const prevEmp = employeesData.previous[index] || { calls: 0, deviations: 0, percentage: 0 };

        const callsChange = emp.calls - prevEmp.calls;
        const deviationsChange = emp.deviations - prevEmp.deviations;
        const percentageChange = emp.percentage - prevEmp.percentage;

        tableHTML += `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td class="text-right">${emp.callCenter}</td>
                <td class="text-right">${emp.calls.toLocaleString()} ${createChangeBadge(callsChange, 'number')}</td>
                <td class="text-right">${emp.deviations.toLocaleString()} ${createChangeBadge(deviationsChange, 'number')}</td>
                <td class="text-right"><span class="${getPercentageClass(emp.percentage)}">${emp.percentage}%</span> ${createChangeBadge(percentageChange, 'percentage')}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
    
    // Инициализируем функциональность сворачивания после отрисовки таблицы
    setTimeout(() => {
        if (typeof initTableCollapse === 'function') {
            initTableCollapse();
        }
    }, 100);
}

// Настройка фильтров сотрудников
function setupEmployeeFilters() {
    console.log('=== setupEmployeeFilters вызвана ===');
    
    // Настройка выпадающих списков
    setupEmployeeDropdowns();
    
    // Обработчик кнопки обновления для команды
    const empUpdateButton = document.getElementById('empUpdateButton');
    console.log('Кнопка обновления команды:', empUpdateButton);
    
    if (empUpdateButton) {
        console.log('Добавляем обработчик для кнопки команды');
        empUpdateButton.addEventListener('click', function(e) {
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
        empDepartmentsButton.addEventListener('click', function(e) {
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
        empDepartmentsDropdown.addEventListener('click', function(e) {
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
        empEmployeesButton.addEventListener('click', function(e) {
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
        empEmployeesDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            if (e.target.type === 'checkbox') {
                handleEmployeeCheckboxChange(e.target);
            }
        });
    }
    
    // Закрытие выпадающих списков при клике вне их
    document.addEventListener('click', function() {
        document.querySelectorAll('.multi-select-dropdown').forEach(dd => {
            dd.style.display = 'none';
        });
    });
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.updateEmployeesData = updateEmployeesData;
    window.renderEmployeesTable = renderEmployeesTable;
    window.setupEmployeeFilters = setupEmployeeFilters;
    window.setupEmployeeDropdowns = setupEmployeeDropdowns;
    window.handleEmployeeDepartmentCheckboxChange = handleEmployeeDepartmentCheckboxChange;
    window.handleEmployeeCheckboxChange = handleEmployeeCheckboxChange;
}