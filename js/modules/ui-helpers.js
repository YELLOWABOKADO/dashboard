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

// Функция для обновления информации о периоде
function updatePeriodInfo(granularity, elementId) {
    const periodInfoElement = document.getElementById(elementId);
    if (!periodInfoElement) return;

    // Получаем выбранные даты
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        periodInfoElement.textContent = '(предыдущий период)';
        return;
    }

    // Используем функцию getPreviousPeriod из real-data-processor.js
    if (typeof getPreviousPeriod !== 'function') {
        console.error('getPreviousPeriod не загружена');
        periodInfoElement.textContent = '(предыдущий период)';
        return;
    }
    
    const previousPeriod = getPreviousPeriod(startDate, endDate, granularity);

    let previousPeriodText = '';

    switch (granularity) {
        case 'День':
            const prevDate = new Date(previousPeriod.startDate);
            previousPeriodText = `(${prevDate.toLocaleDateString('ru-RU')})`;
            break;
        case 'Неделя':
            const prevStartWeek = new Date(previousPeriod.startDate);
            const prevEndWeek = new Date(previousPeriod.endDate);
            previousPeriodText = `(${prevStartWeek.toLocaleDateString('ru-RU')} - ${prevEndWeek.toLocaleDateString('ru-RU')})`;
            break;
        case 'Месяц':
            const prevStartMonth = new Date(previousPeriod.startDate);
            const prevEndMonth = new Date(previousPeriod.endDate);
            previousPeriodText = `(${prevStartMonth.toLocaleDateString('ru-RU')} - ${prevEndMonth.toLocaleDateString('ru-RU')})`;
            break;
    }

    periodInfoElement.textContent = previousPeriodText;
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

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.showLoading = showLoading;
    window.showError = showError;
    window.createChangeBadge = createChangeBadge;
    window.getPercentageClass = getPercentageClass;
    window.updatePeriodInfo = updatePeriodInfo;
    window.initTableCollapse = initTableCollapse;
    window.handleTableRowClick = handleTableRowClick;
    console.log('=== ui-helpers.js загружен, функции экспортированы ===');
}