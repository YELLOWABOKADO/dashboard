/**
 * Модуль UI помощников
 */

// Функция для отображения загрузки
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <div style="text-align: center; padding: 40px;">
                    <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 10px; color: #6c757d;">Загрузка данных...</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }
}

// Функция для отображения ошибки
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="error">
                <h4>❌ Ошибка загрузки данных</h4>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 10px;">
                    Перезагрузить страницу
                </button>
            </div>
        `;
    }
}

// Функция для создания бейджа с изменением
function createChangeBadge(change, type = 'percentage') {
    if (change === 0) {
        return `<span class="badge badge-neutral">0${type === 'percentage' ? '%' : ''}</span>`;
    }
    
    const sign = change > 0 ? '+' : '';
    const cssClass = change > 0 ? 'badge-success' : 'badge-danger';
    const suffix = type === 'percentage' ? '%' : '';
    
    const displayValue = type === 'percentage' ? change.toFixed(1) : change.toLocaleString();

    return `<span class="badge ${cssClass}">${sign}${displayValue}${suffix}</span>`;
}

// Функция для получения CSS класса процента
function getPercentageClass(percentage) {
    if (percentage >= 10) {
        return 'percentage-high';
    } else if (percentage >= 5) {
        return 'percentage-medium';
    } else {
        return 'percentage-low';
    }
}



// Функция для инициализации сворачивания строк таблицы
function initTableCollapse() {
    console.log('=== initTableCollapse вызвана ===');
    
    // Удаляем старые обработчики событий
    document.removeEventListener('click', handleTableRowClick);
    
    // Добавляем новый обработчик событий
    document.addEventListener('click', handleTableRowClick);
    
    // Проверяем, есть ли expandable-row элементы на странице
    const expandableRows = document.querySelectorAll('.expandable-row');
    console.log('Найдено expandable-row элементов:', expandableRows.length);
    
    if (expandableRows.length === 0) {
        console.warn('Не найдено элементов с классом expandable-row. Попробуем через 500ms...');
        setTimeout(() => {
            const retryRows = document.querySelectorAll('.expandable-row');
            console.log('Повторная проверка - найдено expandable-row элементов:', retryRows.length);
            if (retryRows.length > 0) {
                initTableCollapse();
            }
        }, 500);
        return;
    }
    
    expandableRows.forEach((row, index) => {
        console.log(`Expandable row ${index}:`, row, 'data-target:', row.getAttribute('data-target'));
        
        // Добавляем прямой обработчик на каждую строку как резерв
        row.style.cursor = 'pointer';
        row.addEventListener('click', function(e) {
            console.log('=== Прямой обработчик на строке сработал ===');
            handleTableRowClick(e);
        });
    });
}

// Обработчик кликов по строкам таблицы
function handleTableRowClick(event) {
    console.log('=== handleTableRowClick вызван ===', event.target);
    
    const expandableRow = event.target.closest('.expandable-row');
    console.log('expandableRow найден:', expandableRow);
    
    if (!expandableRow) return;
    
    const targetClass = expandableRow.getAttribute('data-target');
    console.log('targetClass:', targetClass);
    
    if (!targetClass) return;
    
    // Находим все связанные строки деталей
    const detailRows = document.querySelectorAll(`.detail-row.${targetClass}`);
    console.log('detailRows найдено:', detailRows.length, detailRows);
    
    const arrow = expandableRow.querySelector('.arrow');
    console.log('arrow найден:', arrow);
    
    if (detailRows.length === 0) {
        console.log('Нет строк деталей для сворачивания');
        return;
    }
    
    // Проверяем текущее состояние
    const isCollapsed = expandableRow.classList.contains('collapsed');
    console.log('isCollapsed:', isCollapsed);
    
    if (isCollapsed) {
        // Разворачиваем
        console.log('Разворачиваем строки');
        expandableRow.classList.remove('collapsed');
        detailRows.forEach(row => {
            row.classList.remove('hidden');
        });
        if (arrow) {
            arrow.textContent = '▼';
        }
    } else {
        // Сворачиваем
        console.log('Сворачиваем строки');
        expandableRow.classList.add('collapsed');
        detailRows.forEach(row => {
            row.classList.add('hidden');
        });
        if (arrow) {
            arrow.textContent = '▶';
        }
    }
}

// Функция для переключения состояния сворачивающихся блоков
function toggleCollapsibleSection(headerId, contentId) {
    console.log(`=== toggleCollapsibleSection вызвана для ${headerId} -> ${contentId} ===`);
    
    const header = document.getElementById(headerId);
    const content = document.getElementById(contentId);
    const arrow = header ? header.querySelector('.collapse-arrow') : null;
    
    if (!header || !content) {
        console.error('Не найдены элементы:', { header: !!header, content: !!content });
        return;
    }
    
    // Проверяем текущее состояние
    const isCollapsed = content.classList.contains('collapsed');
    
    if (isCollapsed) {
        // Разворачиваем
        console.log(`Разворачиваем блок ${contentId}`);
        content.classList.remove('collapsed');
        if (arrow) {
            arrow.classList.remove('collapsed');
        }
        
        // Устанавливаем max-height для анимации
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Специальная обработка для блоков с графиками
        if (contentId.includes('Charts')) {
            setTimeout(() => {
                // Перерисовываем графики после разворачивания
                if (contentId === 'departmentsChartsContent' && typeof cachedDepartmentsData !== 'undefined' && typeof initDepartmentCharts === 'function') {
                    initDepartmentCharts(cachedDepartmentsData);
                } else if (contentId === 'employeesChartsContent' && typeof cachedEmployeesData !== 'undefined' && typeof initEmployeeCharts === 'function') {
                    initEmployeeCharts(cachedEmployeesData);
                }
                
                // Обновляем max-height после перерисовки графиков
                setTimeout(() => {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }, 100);
            }, 300);
        }
        
        console.log(`Блок ${contentId} развернут`);
    } else {
        // Сворачиваем
        console.log(`Сворачиваем блок ${contentId}`);
        content.classList.add('collapsed');
        if (arrow) {
            arrow.classList.add('collapsed');
        }
        
        // Устанавливаем max-height в 0 для анимации
        content.style.maxHeight = '0px';
        
        console.log(`Блок ${contentId} свернут`);
    }
}

// Функция для инициализации всех сворачивающихся блоков
function initCollapsibleSections() {
    console.log('=== Инициализация сворачивающихся блоков ===');
    
    // Находим все заголовки сворачивающихся блоков
    const headers = document.querySelectorAll('.collapsible-header');
    console.log(`Найдено ${headers.length} сворачивающихся блоков`);
    
    headers.forEach(header => {
        const headerId = header.id;
        const contentId = headerId.replace('Header', 'Content');
        
        console.log(`Настраиваем блок: ${headerId} -> ${contentId}`);
        
        // Проверяем, не инициализирован ли уже этот блок
        if (header.dataset.collapsibleInitialized === 'true') {
            console.log(`Блок ${headerId} уже инициализирован, пропускаем`);
            return;
        }
        
        // Создаем обработчик
        const clickHandler = function() {
            toggleCollapsibleSection(headerId, contentId);
        };
        
        // Добавляем обработчик
        header.addEventListener('click', clickHandler);
        
        // Помечаем как инициализированный
        header.dataset.collapsibleInitialized = 'true';
        header._clickHandler = clickHandler; // Сохраняем ссылку для возможного удаления
        
        // Проверяем, что контент существует
        const content = document.getElementById(contentId);
        if (!content) {
            console.warn(`Контент ${contentId} не найден для заголовка ${headerId}`);
        } else {
            console.log(`✅ Блок ${headerId} -> ${contentId} успешно инициализирован`);
            
            // Устанавливаем начальную высоту для развернутых блоков
            setTimeout(() => {
                if (!content.classList.contains('collapsed')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    console.log(`Установлена начальная высота для ${contentId}: ${content.scrollHeight}px`);
                } else {
                    content.style.maxHeight = '0px';
                    console.log(`Блок ${contentId} изначально свернут`);
                }
            }, 100);
        }
    });
}

// Функция для сброса инициализации сворачивающихся блоков
function resetCollapsibleSections() {
    console.log('=== Сброс инициализации сворачивающихся блоков ===');
    
    const headers = document.querySelectorAll('.collapsible-header');
    headers.forEach(header => {
        if (header._clickHandler) {
            header.removeEventListener('click', header._clickHandler);
            delete header._clickHandler;
        }
        delete header.dataset.collapsibleInitialized;
    });
    
    console.log('Инициализация сброшена для всех блоков');
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.showLoading = showLoading;
    window.showError = showError;
    window.createChangeBadge = createChangeBadge;
    window.getPercentageClass = getPercentageClass;
    window.initTableCollapse = initTableCollapse;
    window.handleTableRowClick = handleTableRowClick;
    window.toggleCollapsibleSection = toggleCollapsibleSection;
    window.initCollapsibleSections = initCollapsibleSections;
    window.resetCollapsibleSections = resetCollapsibleSections;
    console.log('=== ui-helpers.js загружен, функции экспортированы ===');
}