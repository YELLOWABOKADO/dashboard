/**
 * Компоненты для таблиц
 */

// Функция для создания таблицы с данными
function createDataTable(containerId, headers, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Создаем таблицу
    const table = document.createElement('table');
    table.className = options.tableClass || 'min-w-full bg-white rounded-lg shadow-md';
    
    // Создаем заголовок таблицы
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.className = options.headerRowClass || 'bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal';
    
    // Добавляем ячейки заголовка
    headers.forEach(header => {
        const th = document.createElement('th');
        th.className = header.class || 'py-3 px-6 text-left';
        th.textContent = header.text;
        
        if (header.sortable) {
            th.classList.add('sortable');
            th.addEventListener('click', () => {
                sortTable(table, headers.indexOf(header));
            });
        }
        
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Создаем тело таблицы
    const tbody = document.createElement('tbody');
    tbody.id = options.tbodyId || '';
    
    // Добавляем строки данных
    data.forEach(rowData => {
        const row = document.createElement('tr');
        row.className = options.rowClass || 'border-b border-gray-200';
        
        // Добавляем ячейки данных
        headers.forEach(header => {
            const td = document.createElement('td');
            td.className = header.cellClass || 'py-4 px-6';
            
            // Если есть функция рендеринга для этого столбца, используем ее
            if (header.render && typeof header.render === 'function') {
                td.innerHTML = header.render(rowData[header.key], rowData);
            } else {
                td.textContent = rowData[header.key] || '';
            }
            
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    
    // Очищаем контейнер и добавляем таблицу
    container.innerHTML = '';
    container.appendChild(table);
    
    return {
        getTable: () => table,
        getTbody: () => tbody,
        updateData: (newData) => {
            // Очищаем тело таблицы
            tbody.innerHTML = '';
            
            // Добавляем новые строки данных
            newData.forEach(rowData => {
                const row = document.createElement('tr');
                row.className = options.rowClass || 'border-b border-gray-200';
                
                // Добавляем ячейки данных
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.className = header.cellClass || 'py-4 px-6';
                    
                    // Если есть функция рендеринга для этого столбца, используем ее
                    if (header.render && typeof header.render === 'function') {
                        td.innerHTML = header.render(rowData[header.key], rowData);
                    } else {
                        td.textContent = rowData[header.key] || '';
                    }
                    
                    row.appendChild(td);
                });
                
                tbody.appendChild(row);
            });
        }
    };
}

// Функция для сортировки таблицы
function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Определяем направление сортировки
    const currentSortDirection = table.getAttribute('data-sort-direction') === 'asc' ? 'desc' : 'asc';
    table.setAttribute('data-sort-direction', currentSortDirection);
    
    // Сортируем строки
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Проверяем, являются ли значения числами
        const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return currentSortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        } else {
            return currentSortDirection === 'asc' 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
        }
    });
    
    // Обновляем таблицу
    rows.forEach(row => tbody.appendChild(row));
}

// Функция для создания таблицы с фиксированным заголовком
function createFixedHeaderTable(containerId, headers, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Создаем обертку для таблицы с прокруткой
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'overflow-x-auto';
    
    // Создаем таблицу
    const table = document.createElement('table');
    table.className = options.tableClass || 'min-w-full bg-white rounded-lg shadow-md';
    
    // Создаем заголовок таблицы
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.className = options.headerRowClass || 'bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal';
    
    // Добавляем ячейки заголовка
    headers.forEach(header => {
        const th = document.createElement('th');
        th.className = header.class || 'py-3 px-6 text-left';
        th.textContent = header.text;
        
        if (header.sortable) {
            th.classList.add('sortable');
            th.addEventListener('click', () => {
                sortTable(table, headers.indexOf(header));
            });
        }
        
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Создаем тело таблицы
    const tbody = document.createElement('tbody');
    tbody.id = options.tbodyId || '';
    
    // Добавляем строки данных
    data.forEach(rowData => {
        const row = document.createElement('tr');
        row.className = options.rowClass || 'border-b border-gray-200';
        
        // Добавляем ячейки данных
        headers.forEach(header => {
            const td = document.createElement('td');
            td.className = header.cellClass || 'py-4 px-6';
            
            // Если есть функция рендеринга для этого столбца, используем ее
            if (header.render && typeof header.render === 'function') {
                td.innerHTML = header.render(rowData[header.key], rowData);
            } else {
                td.textContent = rowData[header.key] || '';
            }
            
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    
    // Очищаем контейнер и добавляем обертку с таблицей
    container.innerHTML = '';
    container.appendChild(tableWrapper);
    
    // Добавляем стили для фиксированного заголовка
    if (options.fixedHeader) {
        const style = document.createElement('style');
        style.textContent = `
            #${containerId} .overflow-x-auto {
                max-height: ${options.maxHeight || '500px'};
                overflow-y: auto;
            }
            #${containerId} thead {
                position: sticky;
                top: 0;
                z-index: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    return {
        getTable: () => table,
        getTbody: () => tbody,
        updateData: (newData) => {
            // Очищаем тело таблицы
            tbody.innerHTML = '';
            
            // Добавляем новые строки данных
            newData.forEach(rowData => {
                const row = document.createElement('tr');
                row.className = options.rowClass || 'border-b border-gray-200';
                
                // Добавляем ячейки данных
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.className = header.cellClass || 'py-4 px-6';
                    
                    // Если есть функция рендеринга для этого столбца, используем ее
                    if (header.render && typeof header.render === 'function') {
                        td.innerHTML = header.render(rowData[header.key], rowData);
                    } else {
                        td.textContent = rowData[header.key] || '';
                    }
                    
                    row.appendChild(td);
                });
                
                tbody.appendChild(row);
            });
        }
    };
}