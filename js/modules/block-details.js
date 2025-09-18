/**
 * Модуль для вкладки "Детализация по блокам"
 */

// Глобальные переменные для хранения экземпляров графиков
let blockDetailsChart = null;

// Переменная для хранения режима отображения (count/percent)
let blockDetailsDisplayMode = 'count';

// Функция инициализации модуля детализации по блокам
function initBlockDetailsModule() {
    console.log('=== Инициализация модуля детализации по блокам ===');

    // Настройка фильтров
    setupBlockDetailsFilters();

    // Настройка переключателя режима отображения
    initBlockDetailsToggle();

    // Попытка инициализировать селекты немедленно
    setTimeout(() => {
        initBlockDetailsSelects();
    }, 1000);

    console.log('Модуль детализации по блокам инициализирован');
}

// Настройка фильтров для детализации по блокам
function setupBlockDetailsFilters() {
    console.log('=== Настройка фильтров детализации по блокам ===');

    // Обработчик кнопки "Обновить"
    const updateButton = document.getElementById('blockDetailsUpdateButton');
    if (updateButton) {
        updateButton.addEventListener('click', async function () {
            console.log('=== Кнопка "Обновить" в детализации по блокам нажата ===');
            await updateBlockDetailsData();
        });
    }

    // Обработчик кнопки "Обновить списки"
    const refreshButton = document.getElementById('blockDetailsRefreshSelects');
    if (refreshButton) {
        refreshButton.addEventListener('click', function () {
            console.log('=== Кнопка "Обновить списки" нажата ===');
            initBlockDetailsSelects();
        });
    }

    // Обработчик изменения селекта блока - автоматическое обновление
    const blockSelect = document.getElementById('blockDetailsBlockFilter');
    if (blockSelect) {
        console.log('Добавляем обработчик изменения для селекта блоков');
        blockSelect.addEventListener('change', async function () {
            const selectedBlock = this.value;
            console.log('=== Сработал обработчик изменения блока:', selectedBlock);
            if (selectedBlock && selectedBlock !== '') {
                console.log('=== Выбран блок:', selectedBlock, '- обновляем график ===');
                try {
                    const filters = getBlockDetailsFilters();
                    console.log('Фильтры для графика:', filters);
                    if (filters.block) {
                        await createBlockDetailsChart(filters);
                    } else {
                        console.log('Блок не выбран в фильтрах');
                    }
                } catch (error) {
                    console.error('Ошибка при обновлении графика:', error);
                }
            } else {
                console.log('Блок не выбран или пустой');
            }
        });
    } else {
        console.error('Селект блоков не найден!');
    }

    // Инициализация селектов с данными
    initBlockDetailsSelects();
}

// Инициализация селектов с данными
function initBlockDetailsSelects() {
    console.log('=== Инициализация селектов в детализации по блокам ===');

    // Загружаем данные операторов для заполнения селектов
    if (typeof loadOperatorData === 'function') {
        console.log('Загружаем данные операторов...');
        loadOperatorData().then(data => {
            if (data) {
                console.log('Данные операторов загружены:', Object.keys(data).length, 'операторов');
                populateBlockDetailsSelects(data);
            } else {
                console.log('Данные операторов не загружены');
            }
        }).catch(error => {
            console.error('Ошибка загрузки данных операторов:', error);
        });
    } else {
        console.log('Функция loadOperatorData не найдена, используем тестовые данные');
        // Создаем тестовые данные для демонстрации
        const testData = {
            'Иванов И.И.': { 'КЦ': 'КЦ 1', 'Группа': 'Группа 1' },
            'Петров П.П.': { 'КЦ': 'КЦ 1', 'Группа': 'Группа 2' },
            'Сидоров С.С.': { 'КЦ': 'КЦ 2', 'Группа': 'Группа 1' }
        };
        populateBlockDetailsSelects(testData);
    }

    // Попытка заполнить блоки сразу
    populateBlockDetailsBlocks();
}

// Заполнение селектов данными
function populateBlockDetailsSelects(operatorData) {
    console.log('Заполнение селектов данными операторов...');

    let kcs = [];
    let groups = [];
    let operators = [];

    if (operatorData && Object.keys(operatorData).length > 0) {
        // Используем реальные данные
        kcs = [...new Set(Object.values(operatorData).map(item => item['КЦ'] || item.KC).filter(Boolean))].sort();
        groups = [...new Set(Object.values(operatorData).map(item => item['Группа'] || item.group).filter(Boolean))].sort();
        operators = Object.keys(operatorData).sort();
        console.log('Используем реальные данные:', { kcs: kcs.length, groups: groups.length, operators: operators.length });
    } else {
        // Используем тестовые данные
        kcs = ['КЦ 1', 'КЦ 2'];
        groups = ['Группа 1', 'Группа 2'];
        operators = ['Иванов И.И.', 'Петров П.П.', 'Сидоров С.С.'];
        console.log('Используем тестовые данные');
    }

    // Заполнение КЦ
    const kcSelect = document.getElementById('blockDetailsKcFilter');
    if (kcSelect) {
        kcSelect.innerHTML = '<option value="">Все КЦ</option>';
        kcs.forEach(kc => {
            kcSelect.innerHTML += `<option value="${kc}">${kc}</option>`;
        });
        console.log('Заполнен селект КЦ:', kcs.length, 'вариантов');
    }

    // Заполнение групп
    const groupSelect = document.getElementById('blockDetailsGroupFilter');
    if (groupSelect) {
        groupSelect.innerHTML = '<option value="">Все группы</option>';
        groups.forEach(group => {
            groupSelect.innerHTML += `<option value="${group}">${group}</option>`;
        });
        console.log('Заполнен селект групп:', groups.length, 'вариантов');
    }

    // Заполнение операторов
    const operatorSelect = document.getElementById('blockDetailsOperatorFilter');
    if (operatorSelect) {
        operatorSelect.innerHTML = '<option value="">Все операторы</option>';
        operators.forEach(operator => {
            operatorSelect.innerHTML += `<option value="${operator}">${operator}</option>`;
        });
        console.log('Заполнен селект операторов:', operators.length, 'вариантов');
    }

    // Заполнение блоков (нужны данные из чек-листов)
    populateBlockDetailsBlocks();
}

// Заполнение селекта блоков
async function populateBlockDetailsBlocks() {
    console.log('=== Заполнение селекта блоков ===');

    const blockSelect = document.getElementById('blockDetailsBlockFilter');
    if (!blockSelect) {
        console.log('Селект блоков не найден');
        return;
    }

    // Сначала пробуем загрузить реальные данные из operator_data_days.json
    let sourceData = await loadChecklistSourceData();
    if (!sourceData || sourceData.length === 0) {
        // Фолбек на уже имеющиеся данные, если они появились из других модулей
        if (Array.isArray(window.checklistFilteredData) && window.checklistFilteredData.length > 0) {
            sourceData = window.checklistFilteredData;
        } else {
            console.log('Не удалось загрузить operator_data_days.json. Показываем тестовые блоки.');
            const testBlocks = [
                'Влияние на бизнес',
                'Влияние на мотивацию сотрудника',
                'Клиентоцентричность',
                'Влияние на бизнес > Качество обслуживания',
                'Влияние на мотивацию сотрудника > Система мотивации'
            ];
            blockSelect.innerHTML = '<option value="">Выберите блок</option>';
            testBlocks.forEach(block => {
                blockSelect.innerHTML += `<option value="${block}">${block}</option>`;
            });
            return;
        }
    }

    // Строим список путей блоков из загруженных данных (до 3 уровня)
    console.log('Найдены данные чек-листов:', sourceData.length, 'записей');
    const blockSet = new Set();
    sourceData.forEach(item => {
        const b0 = item.Block_0_lvl || '';
        const b1 = item.Block_1_lvl || '';
        const b2 = item.Block_2_lvl || '';
        const b3 = item.Block_3_lvl || '';
        if (!b0) return;
        // Добавляем последовательные уровни как отдельные варианты
        blockSet.add(`${b0}`);
        if (b1) blockSet.add(`${b0} > ${b1}`);
        if (b2) blockSet.add(`${b0} > ${b1} > ${b2}`);
        if (b3) blockSet.add(`${b0} > ${b1} > ${b2} > ${b3}`);
    });

    const blocks = Array.from(blockSet).sort();
    console.log('Найдено уникальных путей блоков:', blocks.length);

    blockSelect.innerHTML = '<option value="">Выберите блок</option>';
    blocks.forEach(block => {
        const optionHtml = `<option value="${block}" title="${block}">${block}</option>`;
        blockSelect.innerHTML += optionHtml;
    });
}

// Загрузка исходных данных чек-листов из operator_data_days.json
let cachedChecklistSourceData = null;
async function loadChecklistSourceData() {
    if (cachedChecklistSourceData && Array.isArray(cachedChecklistSourceData) && cachedChecklistSourceData.length > 0) {
        return cachedChecklistSourceData;
    }

    const possiblePaths = [
        'operator_data_days.json',
        './operator_data_days.json',
        '/operator_data_days.json',
        'tests/operator_data_days.json',
        './tests/operator_data_days.json'
    ];

    for (const path of possiblePaths) {
        try {
            console.log(`Пробуем загрузить operator_data_days.json из ${path}...`);
            const response = await fetch(path);
            if (!response.ok) {
                console.warn(`Статус ${response.status} при загрузке ${path}`);
                continue;
            }
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                cachedChecklistSourceData = data;
                // Делаем доступным для других модулей
                if (!window.checklistFilteredData || window.checklistFilteredData.length === 0) {
                    window.checklistFilteredData = data;
                }
                console.log('✅ operator_data_days.json загружен. Записей:', data.length);
                return data;
            }
        } catch (e) {
            console.warn('Ошибка загрузки', path, e.message);
        }
    }

    console.error('Не удалось загрузить operator_data_days.json ни по одному пути');
    return [];
}

// Получение значений фильтров
function getBlockDetailsFilters() {
    return {
        block: document.getElementById('blockDetailsBlockFilter')?.value || '',
        dateFrom: document.getElementById('blockDetailsDateFrom')?.value || '2025-05-01',
        dateTo: document.getElementById('blockDetailsDateTo')?.value || '2025-07-30',
        timeGranularity: document.getElementById('blockDetailsTimeGranularity')?.value || 'Месяц',
        kc: document.getElementById('blockDetailsKcFilter')?.value || '',
        group: document.getElementById('blockDetailsGroupFilter')?.value || '',
        operator: document.getElementById('blockDetailsOperatorFilter')?.value || ''
    };
}

// Основная функция обновления данных
async function updateBlockDetailsData() {
    console.log('=== Обновление данных детализации по блокам ===');

    try {
        // Получаем значения фильтров
        const filters = getBlockDetailsFilters();
        console.log('Фильтры детализации по блокам:', filters);

        // Проверяем валидность периода
        if (typeof validateDateRange === 'function') {
            if (!validateDateRange(filters.dateFrom, filters.dateTo)) {
                console.log('Невалидный диапазон дат');
                return;
            }
        } else {
            console.log('Функция validateDateRange не найдена, пропускаем валидацию');
        }

        // Проверяем, выбран ли блок
        if (!filters.block || filters.block === '') {
            console.log('Блок не выбран');
            alert('Пожалуйста, выберите блок для детализации');
            return;
        }

        console.log('Создаем график с фильтрами:', filters);
        // Создаем график
        await createBlockDetailsChart(filters);
    } catch (error) {
        console.error('Ошибка обновления данных:', error);
    }
}

// Создание графика детализации по блоку
async function createBlockDetailsChart(filters) {
    console.log('=== Создание графика детализации по блоку ===');
    console.log('Фильтры:', filters);

    const ctx = document.getElementById('blockDetailsChart');
    if (!ctx) {
        console.error('Canvas blockDetailsChart не найден!');
        return;
    }

    try {
        // Уничтожаем предыдущий график
        if (blockDetailsChart) {
            console.log('Уничтожаем предыдущий график');
            blockDetailsChart.destroy();
        }

        // Показываем индикатор загрузки
        const container = ctx.parentElement;
        container.innerHTML = '<div class="loading">Загрузка графика...</div>';

        // Небольшая задержка для отображения индикатора загрузки
        setTimeout(() => {
            try {
                container.innerHTML = '';
                container.appendChild(ctx);
                console.log('Вызываем renderBlockDetailsChart');
                renderBlockDetailsChart(filters);
            } catch (error) {
                console.error('Ошибка рендеринга графика:', error);
                container.innerHTML = '<div style="color: red; padding: 20px;">Ошибка загрузки графика</div>';
            }
        }, 100);
    } catch (error) {
        console.error('Ошибка создания графика:', error);
    }
}

// Рендеринг графика детализации по блоку
function renderBlockDetailsChart(filters) {
    const ctx = document.getElementById('blockDetailsChart');
    if (!ctx) {
        console.log('Canvas для графика не найден');
        return;
    }

    // Получаем данные чек-листов
    let checklistData = [];
    if (typeof window.checklistFilteredData !== 'undefined' && window.checklistFilteredData && window.checklistFilteredData.length > 0) {
        checklistData = window.checklistFilteredData;
        console.log('Используем данные чек-листов:', checklistData.length, 'записей');
    } else {
        console.log('Данные чек-листов не найдены, создаем тестовые данные');
        // Создаем тестовые данные для демонстрации
        checklistData = generateTestChecklistData();
    }

    // Фильтруем данные по выбранным критериям
    const filteredData = checklistData.filter(item => {
        // Фильтр по блоку
        const compose = (it) => {
            const p = [it.Block_0_lvl, it.Block_1_lvl, it.Block_2_lvl, it.Block_3_lvl].filter(Boolean);
            // Создаем все префиксы для сопоставления
            const prefixes = [];
            for (let i = 1; i <= p.length; i++) prefixes.push(p.slice(0, i).join(' > '));
            return prefixes;
        };
        const itemPrefixes = compose(item);
        if (!itemPrefixes.includes(filters.block)) return false;

        // Фильтр по КЦ (проверяем разные возможные названия полей)
        if (filters.kc && filters.kc !== '') {
            const itemKc = item.kc || item['КЦ'] || item.KC;
            if (itemKc !== filters.kc) return false;
        }

        // Фильтр по группе (нормализуем суффикс " - группа")
        if (filters.group && filters.group !== '') {
            const itemGroupRaw = item.group || item['Группа'] || '';
            const normalizeGroup = (g) => (g || '').replace(/\s*-\s*группа$/i, '').trim();
            const itemGroupNorm = normalizeGroup(itemGroupRaw);
            const filterGroupNorm = normalizeGroup(filters.group);
            if (itemGroupNorm !== filterGroupNorm) return false;
        }

        // Фильтр по оператору
        if (filters.operator && filters.operator !== '') {
            const itemOperator = item.operator || item['Оператор'];
            if (itemOperator !== filters.operator) return false;
        }

        // Фильтр по дате
        const itemDate = new Date(item.date);
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        if (itemDate < fromDate || itemDate > toDate) return false;

        return true;
    });

    console.log('Отфильтрованные данные для графика:', filteredData.length, 'записей');

    // Если нет данных, показываем сообщение
    if (filteredData.length === 0) {
        console.log('Нет данных для выбранных фильтров');
        ctx.parentElement.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h3>Нет данных</h3>
                <p>Для выбранного блока и фильтров нет доступных данных.</p>
                <p>Попробуйте изменить фильтры или выбрать другой блок.</p>
            </div>
        `;
        return;
    }

    // Группируем данные по периодам
    const periodData = {};
    const dateFrom = new Date(filters.dateFrom);
    const dateTo = new Date(filters.dateTo);

    filteredData.forEach(item => {
        const date = new Date(item.date);
        let periodKey;

        if (filters.timeGranularity === 'Неделя') {
            // Получаем начало недели (понедельник)
            const dayOfWeek = date.getDay();
            const monday = new Date(date);
            monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            periodKey = monday.toISOString().split('T')[0];
        } else {
            // Месяц
            periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }

        if (!periodData[periodKey]) {
            periodData[periodKey] = {
                total: 0,
                issues: 0,
                label: filters.timeGranularity === 'Неделя'
                    ? `${monday.getDate().toString().padStart(2, '0')}.${(monday.getMonth() + 1).toString().padStart(2, '0')}.${monday.getFullYear()}`
                    : date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
            };
        }

        periodData[periodKey].total++;
        if (item.score === 1) {
            periodData[periodKey].issues++;
        }
    });

    // Сортируем периоды
    const sortedPeriods = Object.keys(periodData).sort();

    // Создаем данные для графика
    const labels = sortedPeriods.map(period => periodData[period].label);
    const data = sortedPeriods.map(period => {
        const periodInfo = periodData[period];
        if (blockDetailsDisplayMode === 'percent') {
            return periodInfo.total > 0 ? ((periodInfo.issues / periodInfo.total) * 100) : 0;
        } else {
            return periodInfo.issues;
        }
    });

    // Получаем цвета для графика
    const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6'];

    // Создаем график
    blockDetailsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: filters.block,
                data: data,
                backgroundColor: colors[0] + '70',
                borderColor: colors[0],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            const periodKey = sortedPeriods[context.dataIndex];
                            const periodInfo = periodData[periodKey];
                            if (blockDetailsDisplayMode === 'percent') {
                                return `Процент ошибок: ${context.parsed.y.toFixed(1)}% (${periodInfo.issues} из ${periodInfo.total})`;
                            } else {
                                return `Количество проблем: ${context.parsed.y} из ${periodInfo.total}`;
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: filters.timeGranularity === 'Неделя' ? 'Неделя' : 'Месяц',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: blockDetailsDisplayMode === 'percent' ? 'Процент ошибок (%)' : 'Количество проблем',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function (value) {
                            return blockDetailsDisplayMode === 'percent' ? value + '%' : value;
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });

    // Обновляем заголовок графика
    const chartTitle = document.getElementById('blockDetailsChartTitle');
    if (chartTitle) {
        chartTitle.textContent = `Детализация по блоку: ${filters.block}`;
    }

    console.log(`График детализации по блоку создан: ${filters.block}, ${sortedPeriods.length} периодов`);
}

// Переключение режима отображения
function toggleBlockDetailsMode(mode) {
    if (mode) {
        blockDetailsDisplayMode = mode;
    } else {
        blockDetailsDisplayMode = blockDetailsDisplayMode === 'count' ? 'percent' : 'count';
    }

    console.log('Переключен режим отображения на:', blockDetailsDisplayMode);

    // Обновляем переключатель
    updateBlockDetailsToggleSwitch();

    // Перерисовываем график
    const filters = getBlockDetailsFilters();
    if (filters.block) {
        createBlockDetailsChart(filters);
    }
}

// Обновление внешнего вида переключателя
function updateBlockDetailsToggleSwitch() {
    const toggleSwitch = document.getElementById('blockDetailsChartsToggle');
    if (!toggleSwitch) return;

    const options = toggleSwitch.querySelectorAll('.toggle-option');

    // Убираем активный класс со всех опций
    options.forEach(option => option.classList.remove('active'));

    // Добавляем активный класс к текущей опции
    const activeOption = toggleSwitch.querySelector(`[data-mode="${blockDetailsDisplayMode}"]`);
    if (activeOption) {
        activeOption.classList.add('active');
    }

    // Обновляем позицию слайдера
    toggleSwitch.setAttribute('data-active', blockDetailsDisplayMode);
}

// Генерация тестовых данных чек-листов
function generateTestChecklistData() {
    const data = [];
    const operators = ['Иванов И.И.', 'Петров П.П.', 'Сидоров С.С.'];
    const groups = ['Группа 1', 'Группа 2'];
    const kcs = ['КЦ 1', 'КЦ 2'];
    const blocks = [
        { block0: 'Влияние на бизнес', block1: '', score: 0 },
        { block0: 'Влияние на бизнес', block1: 'Качество обслуживания', score: 1 },
        { block0: 'Влияние на мотивацию сотрудника', block1: '', score: 0 },
        { block0: 'Влияние на мотивацию сотрудника', block1: 'Система мотивации', score: 1 },
        { block0: 'Клиентоцентричность', block1: '', score: 1 }
    ];

    // Генерируем данные за последние 3 месяца
    const startDate = new Date('2025-05-01');
    const endDate = new Date('2025-07-30');

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        for (let i = 0; i < 5; i++) { // 5 записей в день
            const operator = operators[Math.floor(Math.random() * operators.length)];
            const group = groups[Math.floor(Math.random() * groups.length)];
            const kc = kcs[Math.floor(Math.random() * kcs.length)];
            const block = blocks[Math.floor(Math.random() * blocks.length)];

            data.push({
                date: date.toISOString().split('T')[0],
                operator: operator,
                group: group,
                kc: kc,
                Block_0_lvl: block.block0,
                Block_1_lvl: block.block1,
                Block_2_lvl: '',
                Block_3_lvl: '',
                Block_4_lvl: '',
                score: block.score
            });
        }
    }

    console.log('Сгенерировано тестовых данных:', data.length, 'записей');
    return data;
}

// Инициализация переключателя
function initBlockDetailsToggle() {
    const toggleSwitch = document.getElementById('blockDetailsChartsToggle');
    if (!toggleSwitch) {
        console.log('Переключатель не найден');
        return;
    }

    console.log('Инициализируем переключатель режима в детализации по блокам...');

    // Добавляем обработчики кликов на опции
    const options = toggleSwitch.querySelectorAll('.toggle-option');
    console.log('Найдено опций переключателя:', options.length);

    options.forEach(option => {
        option.addEventListener('click', function (e) {
            e.stopPropagation();
            const mode = this.getAttribute('data-mode');
            console.log('Выбран режим:', mode);
            toggleBlockDetailsMode(mode);
        });
    });

    // Устанавливаем начальное состояние
    updateBlockDetailsToggleSwitch();
}

// Экспорт функций для браузера
if (typeof window !== 'undefined') {
    window.initBlockDetailsModule = initBlockDetailsModule;
    window.updateBlockDetailsData = updateBlockDetailsData;
    window.toggleBlockDetailsMode = toggleBlockDetailsMode;
    window.initBlockDetailsToggle = initBlockDetailsToggle;
    window.updateBlockDetailsToggleSwitch = updateBlockDetailsToggleSwitch;
    window.initBlockDetailsSelects = initBlockDetailsSelects; // Для отладки через консоль

    console.log('=== block-details.js загружен ===');
    console.log('Функции экспортированы:', {
        initBlockDetailsModule: typeof window.initBlockDetailsModule,
        updateBlockDetailsData: typeof window.updateBlockDetailsData,
        toggleBlockDetailsMode: typeof window.toggleBlockDetailsMode,
        initBlockDetailsToggle: typeof window.initBlockDetailsToggle,
        updateBlockDetailsToggleSwitch: typeof window.updateBlockDetailsToggleSwitch,
        initBlockDetailsSelects: typeof window.initBlockDetailsSelects
    });

    // Для отладки: добавляем возможность вызвать инициализацию из консоли
    console.log('Для отладки можно вызвать: window.initBlockDetailsSelects()');
}

// Тестовая функция для проверки работы вкладки
window.testBlockDetails = function () {
    console.log('=== Тестирование вкладки Детализация по блокам ===');

    // Проверяем наличие элементов
    const elements = [
        'blockDetailsBlockFilter',
        'blockDetailsKcFilter',
        'blockDetailsGroupFilter',
        'blockDetailsOperatorFilter',
        'blockDetailsChartsToggle',
        'blockDetailsChart'
    ];

    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`${id}: ${element ? 'найден' : 'НЕ НАЙДЕН'}`);
    });

    // Инициализируем селекты
    console.log('Инициализация селектов...');
    initBlockDetailsSelects();

    console.log('Тест завершен. Проверьте консоль браузера.');
};

console.log('🏁 МОДУЛЬ BLOCK-DETAILS.JS ПОЛНОСТЬЮ ЗАГРУЖЕН');
console.log('Для тестирования вызовите: window.testBlockDetails()');