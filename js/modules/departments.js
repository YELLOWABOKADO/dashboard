/**
 * Модуль управления подразделениями
 */

// Обновление данных подразделений
async function updateDepartmentsData() {
    console.log('=== updateDepartmentsData вызвана ===');
    
    const startDate = document.getElementById('deptStartDate').value;
    const endDate = document.getElementById('deptEndDate').value;
    const granularity = document.getElementById('deptTimeGranularity').value;
    const callCenter = document.getElementById('deptCallCenter').value;
    
    // Получаем выбранные группы (подразделения)
    const selectedDepartments = getSelectedMultiSelectValues('deptDepartmentsDropdown');
    
    console.log('Параметры групп:', { startDate, endDate, granularity, callCenter, selectedDepartments });
    
    if (!validateDateRange(startDate, endDate, granularity)) {
        console.log('Валидация дат не прошла');
        return;
    }
    
    showLoading('departmentsTable');
    updatePeriodInfo(granularity, 'departmentsPeriodInfo');
    
    try {
        // Проверяем, что функция getDepartmentsData загружена
        if (typeof getDepartmentsData !== 'function') {
            throw new Error('getDepartmentsData не загружена. Проверьте подключение real-data-processor.js');
        }
        
        // Пока используем функцию getDepartmentsData, но передаем правильные параметры
        const departmentsData = await getDepartmentsData(startDate, endDate, granularity, callCenter, selectedDepartments);
        console.log('Получены данные групп:', departmentsData);
        
        if (departmentsData) {
            renderDepartmentsTable(departmentsData);
        } else {
            console.log('departmentsData пустые, показываем заглушку');
            showError('departmentsTable', 'Нет данных для выбранных фильтров');
        }
    } catch (error) {
        console.error('Ошибка загрузки данных групп:', error);
        showError('departmentsTable', error.message);
    }
}

// Отрисовка таблицы подразделений
function renderDepartmentsTable(departmentsData) {
    const tableContainer = document.getElementById('departmentsTable');
    if (!tableContainer) return;

    console.log('=== renderDepartmentsTable вызвана ===', departmentsData);

    if (!departmentsData || Object.keys(departmentsData).length === 0) {
        tableContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
                <h4>⚠️ Нет данных</h4>
                <p>Данные для выбранных фильтров не найдены</p>
            </div>
        `;
        return;
    }

    let tableHTML = `
        <h4>Подразделения</h4>
        <table>
            <thead>
                <tr>
                    <th>ПОДРАЗДЕЛЕНИЕ</th>
                    <th class="text-right">КОНТАКТ-ЦЕНТР</th>
                    <th class="text-right">ОЦЕНЕНО ЗВОНКОВ</th>
                    <th class="text-right">ОТКЛОНЕНИЙ</th>
                    <th class="text-right">% ОТКЛОНЕНИЙ</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Обрабатываем данные как объект с ключами департаментов
    Object.keys(departmentsData).forEach(deptKey => {
        const dept = departmentsData[deptKey];
        
        console.log('Обрабатываем департамент:', deptKey, dept);
        
        if (!dept) {
            console.error('Департамент undefined:', deptKey);
            return;
        }
        
        if (!dept.current) {
            console.error('dept.current undefined для:', deptKey, dept);
            return;
        }
        
        if (!dept.previous) {
            console.error('dept.previous undefined для:', deptKey, dept);
            return;
        }

        const callsChange = dept.current.calls - dept.previous.calls;
        const deviationsChange = dept.current.deviations - dept.previous.deviations;
        const percentageChange = dept.current.percentage - dept.previous.percentage;

        tableHTML += `
            <tr>
                <td>${dept.name}</td>
                <td class="text-right">${dept.callCenter}</td>
                <td class="text-right">${dept.current.calls.toLocaleString()} ${createChangeBadge(callsChange, 'number')}</td>
                <td class="text-right">${dept.current.deviations.toLocaleString()} ${createChangeBadge(deviationsChange, 'number')}</td>
                <td class="text-right"><span class="${getPercentageClass(dept.current.percentage)}">${dept.current.percentage}%</span> ${createChangeBadge(percentageChange, 'percentage')}</td>
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

// Настройка фильтров подразделений
function setupDepartmentFilters() {
    console.log('=== setupDepartmentFilters вызвана ===');
    
    // Настройка выпадающих списков
    setupDepartmentDropdowns();
    
    // Обработчик кнопки обновления для подразделений
    const deptUpdateButton = document.getElementById('deptUpdateButton');
    console.log('Кнопка обновления подразделений:', deptUpdateButton);
    
    if (deptUpdateButton) {
        console.log('Добавляем обработчик для кнопки подразделений');
        deptUpdateButton.addEventListener('click', function(e) {
            console.log('=== Клик по кнопке обновления подразделений ===');
            e.preventDefault();
            updateDepartmentsData();
        });
        
        // Убираем возможные блокировки
        deptUpdateButton.style.pointerEvents = 'auto';
        deptUpdateButton.disabled = false;
    } else {
        console.error('Кнопка deptUpdateButton не найдена!');
    }
}

// Обработка изменений чекбоксов подразделений
function handleDepartmentCheckboxChange(checkbox) {
    const dropdown = document.getElementById('deptDepartmentsDropdown');
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
    
    updateMultiSelectButtonText('deptDepartmentsDropdown', 'deptDepartmentsText');
}

// Настройка выпадающих списков для подразделений
function setupDepartmentDropdowns() {
    // Настройка выпадающего списка групп
    const deptDepartmentsButton = document.getElementById('deptDepartmentsButton');
    const deptDepartmentsDropdown = document.getElementById('deptDepartmentsDropdown');
    
    if (deptDepartmentsButton && deptDepartmentsDropdown) {
        deptDepartmentsButton.addEventListener('click', function(e) {
            e.stopPropagation();
            // Закрываем другие выпадающие списки
            document.querySelectorAll('.multi-select-dropdown').forEach(dd => {
                if (dd.id !== 'deptDepartmentsDropdown') {
                    dd.style.display = 'none';
                }
            });
            // Переключаем текущий
            if (deptDepartmentsDropdown.style.display === 'block') {
                deptDepartmentsDropdown.style.display = 'none';
            } else {
                deptDepartmentsDropdown.style.display = 'block';
            }
        });
        
        // Обработчики чекбоксов групп
        deptDepartmentsDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            if (e.target.type === 'checkbox') {
                handleDepartmentCheckboxChange(e.target);
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
    window.updateDepartmentsData = updateDepartmentsData;
    window.renderDepartmentsTable = renderDepartmentsTable;
    window.setupDepartmentFilters = setupDepartmentFilters;
    window.setupDepartmentDropdowns = setupDepartmentDropdowns;
}