/**
 * Модуль управления подразделениями
 */

// Состояние сортировки для подразделений
let departmentsSortState = {
    column: 'percentage', // по умолчанию сортируем по % отклонений
    direction: 'desc' // по убыванию (сначала худшие показатели)
};

// Сохраняем данные для повторного использования при сортировке
let cachedDepartmentsData = null;

// Функция для получения индикатора сортировки
function getSortIndicator(column) {
    if (departmentsSortState.column !== column) {
        return '<span class="sort-indicator">↕</span>';
    }
    return departmentsSortState.direction === 'asc' 
        ? '<span class="sort-indicator active">↑</span>' 
        : '<span class="sort-indicator active">↓</span>';
}

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
    
    // Сохраняем данные для повторного использования при сортировке
    cachedDepartmentsData = departmentsData;

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
                    <th class="sortable-header" data-column="name">ПОДРАЗДЕЛЕНИЕ ${getSortIndicator('name')}</th>
                    <th class="text-right sortable-header" data-column="callCenter">КОНТАКТ-ЦЕНТР ${getSortIndicator('callCenter')}</th>
                    <th class="text-right sortable-header" data-column="calls">ОЦЕНЕНО ЗВОНКОВ ${getSortIndicator('calls')}</th>
                    <th class="text-right sortable-header" data-column="deviations">ОТКЛОНЕНИЙ ${getSortIndicator('deviations')}</th>
                    <th class="text-right sortable-header" data-column="percentage">% ОТКЛОНЕНИЙ ${getSortIndicator('percentage')}</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Преобразуем данные в массив для сортировки
    const departmentsArray = Object.keys(departmentsData).map(deptKey => {
        const dept = departmentsData[deptKey];
        return {
            key: deptKey,
            name: dept.name,
            callCenter: dept.callCenter,
            current: dept.current,
            previous: dept.previous
        };
    });

    // Сортируем данные
    departmentsArray.sort((a, b) => {
        let valueA, valueB;
        
        switch (departmentsSortState.column) {
            case 'name':
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 'callCenter':
                valueA = a.callCenter;
                valueB = b.callCenter;
                break;
            case 'calls':
                valueA = a.current.calls;
                valueB = b.current.calls;
                break;
            case 'deviations':
                valueA = a.current.deviations;
                valueB = b.current.deviations;
                break;
            case 'percentage':
                valueA = a.current.percentage;
                valueB = b.current.percentage;
                break;
            default:
                return 0;
        }
        
        if (valueA < valueB) {
            return departmentsSortState.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return departmentsSortState.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Обрабатываем отсортированные данные
    departmentsArray.forEach(dept => {
        console.log('Обрабатываем департамент:', dept.key, dept);
        
        if (!dept.current || !dept.previous) {
            console.error('Отсутствуют данные для департамента:', dept.key);
            return;
        }

        // Вычисляем процентные изменения
        const callsChangePercent = dept.previous.calls > 0 ? ((dept.current.calls - dept.previous.calls) / dept.previous.calls * 100) : 0;
        const deviationsChangePercent = dept.previous.deviations > 0 ? ((dept.current.deviations - dept.previous.deviations) / dept.previous.deviations * 100) : 0;
        const percentageChange = dept.current.percentage - dept.previous.percentage;

        tableHTML += `
            <tr>
                <td>${dept.name}</td>
                <td class="text-right">${dept.callCenter}</td>
                <td class="text-right">${dept.current.calls.toLocaleString()} ${createChangeBadge(callsChangePercent, 'percentage')}</td>
                <td class="text-right">${dept.current.deviations.toLocaleString()} ${createChangeBadge(deviationsChangePercent, 'percentage')}</td>
                <td class="text-right"><span class="${getPercentageClass(dept.current.percentage)}">${dept.current.percentage}%</span> ${createChangeBadge(percentageChange, 'percentage')}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
    
    // Показываем графики и инициализируем их
    const chartsContainer = document.getElementById('departmentsCharts');
    const chartsContent = document.getElementById('departmentsChartsContent');
    if (chartsContainer && typeof initDepartmentCharts === 'function') {
        chartsContainer.style.display = 'grid';
        // Проверяем, не свернут ли блок графиков
        const isChartsCollapsed = chartsContent && chartsContent.classList.contains('collapsed');
        if (!isChartsCollapsed) {
            // Небольшая задержка для корректной отрисовки canvas элементов
            setTimeout(() => {
                initDepartmentCharts(cachedDepartmentsData);
            }, 200);
        }
    }
    
    // Добавляем обработчики кликов для сортировки
    setTimeout(() => {
        const sortableHeaders = document.querySelectorAll('#departmentsTable .sortable-header');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const column = this.getAttribute('data-column');
                console.log('Клик по заголовку:', column);
                
                // Если кликнули по той же колонке, меняем направление
                if (departmentsSortState.column === column) {
                    departmentsSortState.direction = departmentsSortState.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    // Если новая колонка, устанавливаем направление по умолчанию
                    departmentsSortState.column = column;
                    departmentsSortState.direction = column === 'percentage' ? 'desc' : 'asc';
                }
                
                console.log('Новое состояние сортировки:', departmentsSortState);
                
                // Перерисовываем таблицу с новой сортировкой
                renderDepartmentsTable(cachedDepartmentsData);
            });
        });
        
        // Обновляем высоту сворачивающегося блока после отрисовки
        const content = document.getElementById('departmentsTableContent');
        if (content && !content.classList.contains('collapsed')) {
            setTimeout(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
            }, 50);
        }
    }, 100);
}

// Настройка фильтров подразделений
function setupDepartmentFilters() {
    console.log('=== setupDepartmentFilters вызвана ===');
    
    // Настройка выпадающих списков
    setupDepartmentDropdowns();
    
    // Сворачивающиеся блоки настраиваются через общую систему initCollapsibleSections
    
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

// Сворачивающиеся блоки теперь управляются через общую систему initCollapsibleSections

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
    // setupCollapsibleTable и setupCollapsibleCharts удалены - используется общая система
}