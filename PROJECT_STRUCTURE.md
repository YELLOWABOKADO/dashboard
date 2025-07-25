# Структура проекта "Отчет по работе групп"

## 📁 Основные файлы (АКТИВНЫЕ)

### 🌐 HTML файлы
- **`index.html`** - **ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ**
  - **Назначение**: Единственная точка входа в приложение
  - **Содержимое**: 
    - 3 вкладки: Компания, Подразделения, Команда
    - Фильтры: период (с/по), режим отображения (день/неделя/месяц), КЦ, дашборд
    - Встроенный JavaScript код (~1000 строк)
    - CSS стили для интерфейса
  - **Подключения**: Только `js/data/real-data-processor.js`
  - **Статус**: ✅ АКТИВЕН - основной файл

### 📊 Данные
- **`callcenter_operator_data.json`** - **ОСНОВНОЙ ФАЙЛ ДАННЫХ**
  - **Назначение**: Хранение всех данных операторов колл-центров
  - **Размер**: ~169KB, 8633 строки
  - **Структура**:
    ```json
    {
      "Имя оператора": {
        "КЦ": "КЦ 1" | "КЦ 2",
        "Группа": "Название группы",
        "Данные": {
          "YYYY-MM-DD": {
            "Звонков": число,
            "Отклонений": число,
            "%": число
          }
        }
      }
    }
    ```
  - **Период данных**: май 2025 - июль 2025
  - **Операторы**: 21 оператор
  - **КЦ**: КЦ 1 и КЦ 2
  - **Группы**: Гридчина, Сычева, Мельникова, Коровина
  - **Статус**: ✅ АКТИВЕН - источник данных

### 🔧 JavaScript файлы

#### Основной модуль обработки данных
- **`js/data/real-data-processor.js`** - **ЕДИНСТВЕННЫЙ АКТИВНЫЙ JS ФАЙЛ**
  - **Назначение**: Обработка и агрегация данных из JSON
  - **Основные функции**:
    - `loadOperatorData()` - загрузка данных из JSON файла
    - `getCompanyData(startDate, endDate, granularity, callCenter)` - агрегация данных по компании
    - `getDepartmentsData(startDate, endDate, granularity, callCenter)` - данные по подразделениям
    - `getEmployeesData(startDate, endDate, granularity, callCenter)` - данные по сотрудникам
    - `getPreviousPeriod(startDate, endDate, granularity)` - расчет предыдущего периода
    - `aggregateDataForPeriod(data, startDate, endDate)` - агрегация за период
    - `getDateRange(startDate, endDate)` - генерация диапазона дат
  - **Экспорт**: Функции доступны глобально в браузере через `window`
  - **Статус**: ✅ АКТИВЕН - обработка данных

## 📁 Неиспользуемые файлы (LEGACY)

### ❌ JavaScript файлы (НЕ ИСПОЛЬЗУЮТСЯ)
- **`js/main.js`** - Основная логика приложения (УСТАРЕЛ)
- **`js/data-handler.js`** - Обработка данных (ЗАМЕНЕН на real-data-processor.js)
- **`js/time-granularity.js`** - Функции работы с периодами (ВСТРОЕН в index.html)
- **`js/dropdown-handler.js`** - Обработчики выпадающих списков (ВСТРОЕН в index.html)
- **`js/stat-cards.js`** - Карточки статистики (УДАЛЕНЫ из интерфейса)
- **`js/pages/company.js`** - Логика вкладки "Компания" (ВСТРОЕН в index.html)
- **`js/pages/departments.js`** - Логика вкладки "Подразделения" (ВСТРОЕН в index.html)
- **`js/pages/employees.js`** - Логика вкладки "Команда" (ВСТРОЕН в index.html)
- **`js/utils/period-comparison.js`** - Утилиты сравнения периодов (ВСТРОЕН в index.html)

### 🧪 Тестовые файлы (МОЖНО УДАЛИТЬ)
- **`test-minimal.html`** - Минимальный тест загрузки данных
- **`debug-simple.html`** - Простая отладка
- **`test-data-loading.html`** - Тест загрузки данных
- **`debug.html`** - Отладочный файл
- **`simple-test.html`** - Простой тест
- **`test.html`** - Тестовый файл
- **`dropdown-test.html`** - Тест выпадающих списков

### 📦 Архивные файлы (МОЖНО УДАЛИТЬ)
- **`index01.html`** - Старая версия index.html
- **`time_granularity_functions.js`** - Старые функции работы с периодами

## 🏗️ Архитектура приложения

### Поток данных
```
1. index.html загружается в браузере
2. Подключается js/data/real-data-processor.js
3. Вызывается loadOperatorData() → загружает callcenter_operator_data.json
4. При смене фильтров вызываются:
   - getCompanyData() для вкладки "Компания"
   - getDepartmentsData() для вкладки "Подразделения"  
   - getEmployeesData() для вкладки "Команда"
5. Данные отображаются в таблицах с процентными изменениями
```

### Структура обработанных данных

#### Данные компании
```javascript
{
  current: {
    total: { calls: число, deviations: число, percentage: число },
    kc1: { calls: число, deviations: число, percentage: число },
    kc2: { calls: число, deviations: число, percentage: число },
    rpc: {
      total: { calls: число, deviations: число, percentage: число },
      kc1: { calls: число, deviations: число, percentage: число },
      kc2: { calls: число, deviations: число, percentage: число }
    },
    nonRpc: { /* аналогично rpc */ }
  },
  previous: { /* аналогично current для предыдущего периода */ }
}
```

#### Данные подразделений
```javascript
{
  current: [
    {
      name: "Название - группа",
      callCenter: "КЦ 1" | "КЦ 2", 
      calls: число,
      deviations: число,
      percentage: число
    }
  ],
  previous: [ /* аналогично current */ ]
}
```

#### Данные сотрудников
```javascript
{
  current: [
    {
      name: "Имя сотрудника",
      department: "Название - группа",
      callCenter: "КЦ 1" | "КЦ 2",
      calls: число,
      deviations: число,
      percentage: число
    }
  ],
  previous: [ /* аналогично current */ ]
}
```

## 🚀 Развертывание

### Локальная разработка
```bash
# Запуск локального сервера (обязательно для разработки)
python3 -m http.server 8000
# Открыть http://localhost:8000
```

### GitHub Pages
```bash
# Очистка проекта (опционально)
rm test-*.html debug*.html simple-test.html dropdown-test.html
rm index01.html time_granularity_functions.js
rm -rf js/main.js js/data-handler.js js/time-granularity.js js/dropdown-handler.js js/stat-cards.js
rm -rf js/pages/ js/utils/

# Деплой
git add .
git commit -m "Deploy dashboard"
git push origin main
```

**URL**: https://yellowabokado.github.io/dashboard/

## 🔧 Функциональность

### Фильтры
- **Период**: Выбор начальной и конечной даты
- **Режим отображения**: День (макс 1 день), Неделя (макс 7 дней), Месяц (макс 31 день)
- **КЦ**: Все КЦ, КЦ 1, КЦ 2
- **Дашборд**: Автооценка, Автооценка УАВ/ПреХард (пока не влияет на данные)

### Вкладки
1. **Компания** - сводные данные по всем КЦ с разбивкой на RPC/не-RPC
2. **Подразделения** - данные по группам операторов
3. **Команда** - данные по отдельным операторам

### Метрики
- **Оценено звонков** - общее количество обработанных звонков
- **Отклонений выявлено** - количество найденных нарушений
- **% отклонений** - процент нарушений от общего количества звонков
- **Изменения** - процентное изменение относительно предыдущего периода

## 🐛 Отладка

### Проверка в браузере
1. F12 → Console - проверить ошибки JavaScript
2. F12 → Network - проверить загрузку файлов (callcenter_operator_data.json должен быть 200 OK)
3. F12 → Elements - проверить DOM структуру

### Типичные проблемы
- **CORS ошибки** - нужен HTTP сервер, не file://
- **404 на JSON** - проверить путь к callcenter_operator_data.json
- **SyntaxError** - проверить дублирование переменных
- **Пустые таблицы** - проверить вызов updateActiveTab()

### Команды проверки
```bash
# Проверка JSON
python -m json.tool callcenter_operator_data.json

# Проверка размера файлов
ls -lah *.json *.html js/data/*.js

# Поиск ошибок в коде
grep -r "console.error" .
```

## 📈 Статус проекта

**Текущее состояние**: ✅ РАБОТАЕТ
- Данные загружаются корректно
- Все вкладки функционируют
- Фильтры работают
- Расчет предыдущих периодов исправлен
- Готов к деплою на GitHub Pages

**Минимальная рабочая конфигурация**:
- `index.html` (основной файл)
- `callcenter_operator_data.json` (данные)
- `js/data/real-data-processor.js` (обработка)

Все остальные файлы можно удалить без потери функциональности.