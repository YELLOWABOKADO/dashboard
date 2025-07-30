# Исправление функциональности сворачивания RPC/не RPC данных

## Проблема
Не работало сворачивание выпадающих данных RPC/не RPC в таблице компании.

## Решение

### 1. Добавлены CSS стили для сворачивания (css/styles.css)
```css
/* Стили для сворачивания строк таблицы */
.expandable-row {
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.expandable-row:hover {
    background-color: #f1f3f4 !important;
}

.expandable-row .arrow {
    font-size: 12px;
    margin-left: 5px;
    transition: transform 0.2s ease;
    display: inline-block;
}

.expandable-row.collapsed .arrow {
    transform: rotate(-90deg);
}

.detail-row {
    transition: all 0.3s ease;
}

.detail-row.hidden {
    display: none;
}
```

### 2. Добавлена JavaScript функциональность (js/modules/ui-helpers.js)
- `initTableCollapse()` - инициализация обработчиков событий
- `handleTableRowClick()` - обработчик кликов по строкам таблицы

### 3. Обновлены модули отрисовки таблиц
- `js/modules/company.js` - добавлен вызов `initTableCollapse()` после отрисовки
- `js/modules/departments.js` - добавлен вызов `initTableCollapse()` после отрисовки  
- `js/modules/employees.js` - добавлен вызов `initTableCollapse()` после отрисовки

### 4. Обновлена инициализация приложения (js/modules/app.js)
- Добавлен вызов `initTableCollapse()` при инициализации приложения

## Как работает
1. При клике на строку с классом `expandable-row` срабатывает обработчик
2. Находятся все связанные строки деталей по атрибуту `data-target`
3. Переключается состояние сворачивания (добавляется/убирается класс `collapsed`)
4. Строки деталей скрываются/показываются (класс `hidden`)
5. Стрелка поворачивается (▼ → ▶)

## Тестирование
Создан файл `test-collapse.html` для проверки функциональности.