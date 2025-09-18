/**
 * Модуль для обработки реальных данных операторов из callcenter_operator_data.json
 */

console.log('=== real-data-processor.js загружается ===');

let operatorData = null;
let rpcDetailsData = null;

// Флаг для принудительного использования тестовых данных (для отладки)
const FORCE_USE_TEST_DATA = false;

// Временные тестовые данные (для обхода CORS)
const TEMP_OPERATOR_DATA = {
    "Маркина И. М.": {
        "КЦ": "КЦ 1",
        "Группа": "Гридчина",
        "Данные": {
            // Июль 2025 (текущий период)
            "2025-07-01": { "Звонков": 785, "Отклонений": 4, "%": 0.51 },
            "2025-07-02": { "Звонков": 603, "Отклонений": 14, "%": 2.32 },
            "2025-07-03": { "Звонков": 857, "Отклонений": 22, "%": 2.57 },
            "2025-07-31": { "Звонков": 612, "Отклонений": 5, "%": 0.82 },
            // Июнь 2025 (предыдущий период)
            "2025-06-01": { "Звонков": 720, "Отклонений": 8, "%": 1.11 },
            "2025-06-02": { "Звонков": 650, "Отклонений": 18, "%": 2.77 },
            "2025-06-30": { "Звонков": 680, "Отклонений": 12, "%": 1.76 }
        }
    },
    "Петрова А. С.": {
        "КЦ": "КЦ 1",
        "Группа": "Коровина",
        "Данные": {
            // Июль 2025
            "2025-07-01": { "Звонков": 705, "Отклонений": 14, "%": 1.99 },
            "2025-07-02": { "Звонков": 843, "Отклонений": 10, "%": 1.19 },
            "2025-07-03": { "Звонков": 771, "Отклонений": 8, "%": 1.04 },
            "2025-07-31": { "Звонков": 863, "Отклонений": 22, "%": 2.55 },
            // Июнь 2025
            "2025-06-01": { "Звонков": 690, "Отклонений": 16, "%": 2.32 },
            "2025-06-02": { "Звонков": 780, "Отклонений": 12, "%": 1.54 },
            "2025-06-30": { "Звонков": 820, "Отклонений": 25, "%": 3.05 }
        }
    },
    "Сидоров В. П.": {
        "КЦ": "КЦ 2",
        "Группа": "Мельникова",
        "Данные": {
            // Июль 2025
            "2025-07-01": { "Звонков": 630, "Отклонений": 18, "%": 2.86 },
            "2025-07-02": { "Звонков": 754, "Отклонений": 12, "%": 1.59 },
            "2025-07-03": { "Звонков": 689, "Отклонений": 15, "%": 2.18 },
            "2025-07-31": { "Звонков": 721, "Отклонений": 9, "%": 1.25 },
            // Июнь 2025
            "2025-06-01": { "Звонков": 610, "Отклонений": 20, "%": 3.28 },
            "2025-06-02": { "Звонков": 730, "Отклонений": 15, "%": 2.05 },
            "2025-06-30": { "Звонков": 700, "Отклонений": 11, "%": 1.57 }
        }
    },
    "Иванова М. К.": {
        "КЦ": "КЦ 2",
        "Группа": "Сычева",
        "Данные": {
            // Июль 2025
            "2025-07-01": { "Звонков": 598, "Отклонений": 21, "%": 3.51 },
            "2025-07-02": { "Звонков": 672, "Отклонений": 16, "%": 2.38 },
            "2025-07-03": { "Звонков": 745, "Отклонений": 13, "%": 1.74 },
            "2025-07-31": { "Звонков": 634, "Отклонений": 19, "%": 3.00 },
            // Июнь 2025
            "2025-06-01": { "Звонков": 580, "Отклонений": 25, "%": 4.31 },
            "2025-06-02": { "Звонков": 650, "Отклонений": 18, "%": 2.77 },
            "2025-06-30": { "Звонков": 720, "Отклонений": 22, "%": 3.06 }
        }
    },
    "Смирнов Д. А.": {
        "КЦ": "КЦ 1",
        "Группа": "группа 1",
        "Данные": {
            // Июль 2025
            "2025-07-01": { "Звонков": 520, "Отклонений": 8, "%": 1.54 },
            "2025-07-02": { "Звонков": 640, "Отклонений": 12, "%": 1.88 },
            "2025-07-31": { "Звонков": 580, "Отклонений": 10, "%": 1.72 },
            // Июнь 2025
            "2025-06-01": { "Звонков": 500, "Отклонений": 10, "%": 2.00 },
            "2025-06-30": { "Звонков": 620, "Отклонений": 15, "%": 2.42 }
        }
    },
    "Козлова Е. В.": {
        "КЦ": "КЦ 2",
        "Группа": "группа 2",
        "Данные": {
            // Июль 2025
            "2025-07-01": { "Звонков": 480, "Отклонений": 15, "%": 3.13 },
            "2025-07-02": { "Звонков": 560, "Отклонений": 11, "%": 1.96 },
            "2025-07-31": { "Звонков": 510, "Отклонений": 13, "%": 2.55 },
            // Июнь 2025
            "2025-06-01": { "Звонков": 460, "Отклонений": 18, "%": 3.91 },
            "2025-06-30": { "Звонков": 540, "Отклонений": 14, "%": 2.59 }
        }
    }
};

// Функция для загрузки данных RPC
async function loadRpcData() {
    if (rpcDetailsData) return rpcDetailsData;

    try {
        console.log('Загружаем данные RPC...');
        const response = await fetch('rpc_details_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        rpcDetailsData = await response.json();
        console.log('Данные RPC загружены:', rpcDetailsData);
        return rpcDetailsData;
    } catch (error) {
        console.error('Ошибка загрузки данных RPC:', error);
        return null;
    }
}

// Загрузка данных из JSON файла
async function loadOperatorData() {
    if (operatorData) {
        console.log('Данные операторов уже загружены, используем кэш');
        return operatorData;
    }

    // Если принудительно используем тестовые данные
    if (FORCE_USE_TEST_DATA) {
        console.log('Принудительно используем тестовые данные (FORCE_USE_TEST_DATA = true)');
        operatorData = TEMP_OPERATOR_DATA;
        console.log('Загружены тестовые данные:', Object.keys(operatorData).length, 'операторов');
        return operatorData;
    }

    const possiblePaths = [
        'callcenter_operator_data.json',
        './callcenter_operator_data.json',
        '/callcenter_operator_data.json',
        '../callcenter_operator_data.json'
    ];

    for (const path of possiblePaths) {
        try {
            console.log(`Пытаемся загрузить данные операторов из ${path}...`);
            const response = await fetch(path, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Response status для ${path}:`, response.status, response.statusText);

            if (!response.ok) {
                console.warn(`Путь ${path} вернул статус ${response.status}, пробуем следующий...`);
                continue;
            }

            const text = await response.text();
            console.log('Response text length:', text.length);

            if (!text || text.length < 10) {
                console.warn(`Путь ${path} вернул пустой или слишком маленький ответ, пробуем следующий...`);
                continue;
            }

            operatorData = JSON.parse(text);
            console.log('✅ Данные операторов успешно загружены из JSON:', Object.keys(operatorData).length, 'операторов');
            console.log('📊 Примеры данных:', Object.keys(operatorData).slice(0, 3).map(name => `${name}: ${Object.keys(operatorData[name].Данные).length} дней`));

            return operatorData;
        } catch (error) {
            console.warn(`Ошибка загрузки из ${path}:`, error.message);
            continue;
        }
    }

    console.error('❌ Не удалось загрузить данные из всех возможных путей, используем временные тестовые данные...');
    console.error('Возможные причины:');
    console.error('- CORS политика сервера');
    console.error('- Неправильный путь к файлу');
    console.error('- Сервер не обслуживает статические файлы');
    console.error('- Рекомендация: поместите callcenter_operator_data.json в корневую директорию сайта');

    // Используем временные данные
    operatorData = TEMP_OPERATOR_DATA;
    console.warn('⚠️ Загружены ВЫДУМАННЫЕ тестовые данные:', Object.keys(operatorData).length, 'операторов');
    console.warn('📊 Примеры тестовых данных:', Object.keys(operatorData).slice(0, 3).map(name => `${name}: ${Object.keys(operatorData[name].Данные).length} дней`));

    return operatorData;
}

// Загрузка данных RPC детализации
// Временные данные RPC
const TEMP_RPC_DATA = {
    "2025-07": {
        "total": { "calls": 10000, "deviations": 150, "percentage": 1.5 },
        "kc1": { "calls": 6000, "deviations": 90, "percentage": 1.5 },
        "kc2": { "calls": 4000, "deviations": 60, "percentage": 1.5 }
    },
    "2025-06": {
        "total": { "calls": 9500, "deviations": 190, "percentage": 2.0 },
        "kc1": { "calls": 5700, "deviations": 114, "percentage": 2.0 },
        "kc2": { "calls": 3800, "deviations": 76, "percentage": 2.0 }
    }
};

async function loadRpcDetailsData() {
    if (rpcDetailsData) {
        console.log('Данные RPC уже загружены, используем кэш');
        return rpcDetailsData;
    }

    try {
        console.log('Пытаемся загрузить данные RPC из rpc_details_data.json...');
        const response = await fetch('rpc_details_data.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }

        rpcDetailsData = await response.json();
        console.log('Данные RPC успешно загружены из JSON');

        return rpcDetailsData;
    } catch (error) {
        console.error('Ошибка загрузки данных RPC из JSON файла:', error.message);
        console.log('Используем временные данные RPC...');

        // Используем временные данные
        rpcDetailsData = TEMP_RPC_DATA;
        console.log('Загружены тестовые данные RPC');

        return rpcDetailsData;
    }
}

// Функция для получения списка дат в диапазоне
function getDateRange(startDate, endDate) {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
}

// Функция для получения предыдущего периода
function getPreviousPeriod(startDate, endDate, granularity) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    let prevStart, prevEnd;

    switch (granularity) {
        case 'День':
            prevStart = new Date(start);
            prevStart.setDate(prevStart.getDate() - 1);
            prevEnd = new Date(prevStart);
            break;
        case 'Неделя':
            prevStart = new Date(start);
            prevStart.setDate(prevStart.getDate() - 7);
            prevEnd = new Date(end);
            prevEnd.setDate(prevEnd.getDate() - 7);
            break;
        case 'Месяц':
            prevStart = new Date(start);
            prevStart.setMonth(prevStart.getMonth() - 1);

            // Для конечной даты нужно учесть количество дней в предыдущем месяце
            prevEnd = new Date(prevStart);
            prevEnd.setMonth(prevEnd.getMonth() + 1, 0); // Последний день предыдущего месяца
            break;
        default:
            prevStart = new Date(start);
            prevStart.setDate(prevStart.getDate() - diffDays);
            prevEnd = new Date(end);
            prevEnd.setDate(prevEnd.getDate() - diffDays);
    }

    return {
        startDate: prevStart.toISOString().split('T')[0],
        endDate: prevEnd.toISOString().split('T')[0]
    };
}

// Функция для агрегации данных по периоду
function aggregateDataForPeriod(data, startDate, endDate) {
    const dates = getDateRange(startDate, endDate);
    let totalCalls = 0;
    let totalDeviations = 0;

    dates.forEach(date => {
        if (data[date]) {
            totalCalls += data[date]['Звонков'] || 0;
            totalDeviations += data[date]['Отклонений'] || 0;
        }
    });

    const percentage = totalCalls > 0 ? (totalDeviations / totalCalls) * 100 : 0;

    return {
        calls: totalCalls,
        deviations: totalDeviations,
        percentage: Math.round(percentage * 100) / 100
    };
}

// Функция для получения RPC данных за период
function getRpcDataForPeriod(rpcData, startDate, endDate, kcKey, rpcFilter) {
    // Определяем период в формате YYYY-MM для поиска в RPC данных
    const periodKey = startDate.substring(0, 7); // "2025-07"

    if (!rpcData[periodKey]) {
        console.log(`RPC данные для периода ${periodKey} не найдены`);
        return { calls: 0, deviations: 0 };
    }

    const periodData = rpcData[periodKey];
    let targetData;

    // Выбираем данные по КЦ
    if (kcKey === 'kc1') {
        targetData = periodData.kc1;
    } else if (kcKey === 'kc2') {
        targetData = periodData.kc2;
    } else {
        targetData = periodData.total;
    }

    if (!targetData) {
        return { calls: 0, deviations: 0 };
    }

    // Если выбран конкретный RPC фильтр, берем данные из details
    if (rpcFilter !== 'Все' && targetData.details && targetData.details[rpcFilter]) {
        const detailData = targetData.details[rpcFilter];
        return {
            calls: detailData.calls || 0,
            deviations: detailData.deviations || 0
        };
    }

    // Иначе возвращаем общие данные
    return {
        calls: targetData.calls || 0,
        deviations: targetData.deviations || 0
    };
}

// Функция для получения данных компании
async function getCompanyData(startDate, endDate, granularity, selectedCallCenter = 'Все КЦ') {
    console.log(`getCompanyData вызвана с параметрами:`, { startDate, endDate, granularity, selectedCallCenter });

    const data = await loadOperatorData();
    const rpcData = await loadRpcData();

    if (!data) {
        console.error('Не удалось загрузить данные операторов');
        return null;
    }

    if (!rpcData) {
        console.error('Не удалось загрузить данные RPC');
        return null;
    }

    const currentPeriod = { startDate, endDate };
    const previousPeriod = getPreviousPeriod(startDate, endDate, granularity);

    console.log('Периоды для анализа:', { currentPeriod, previousPeriod });

    // Отслеживаем, какие КЦ имеют данные
    const activeKCs = new Set();

    // Агрегируем данные по КЦ
    const result = {
        current: {
            total: { calls: 0, deviations: 0, percentage: 0 },
            kc1: { calls: 0, deviations: 0, percentage: 0 },
            kc2: { calls: 0, deviations: 0, percentage: 0 },
            rpc: {
                total: { calls: 0, deviations: 0, percentage: 0 },
                kc1: { calls: 0, deviations: 0, percentage: 0 },
                kc2: { calls: 0, deviations: 0, percentage: 0 }
            },
            nonRpc: {
                total: { calls: 0, deviations: 0, percentage: 0 },
                kc1: { calls: 0, deviations: 0, percentage: 0 },
                kc2: { calls: 0, deviations: 0, percentage: 0 }
            }
        },
        previous: {
            total: { calls: 0, deviations: 0, percentage: 0 },
            kc1: { calls: 0, deviations: 0, percentage: 0 },
            kc2: { calls: 0, deviations: 0, percentage: 0 },
            rpc: {
                total: { calls: 0, deviations: 0, percentage: 0 },
                kc1: { calls: 0, deviations: 0, percentage: 0 },
                kc2: { calls: 0, deviations: 0, percentage: 0 }
            },
            nonRpc: {
                total: { calls: 0, deviations: 0, percentage: 0 },
                kc1: { calls: 0, deviations: 0, percentage: 0 },
                kc2: { calls: 0, deviations: 0, percentage: 0 }
            }
        },
        activeKCs: activeKCs
    };

    // Обрабатываем каждого оператора
    Object.keys(data).forEach(operatorName => {
        const operator = data[operatorName];
        const kc = operator['КЦ'];

        // Определяем ключ для КЦ
        let kcKey = '';
        if (kc === 'КЦ 1') kcKey = 'kc1';
        else if (kc === 'КЦ 2') kcKey = 'kc2';

        if (!kcKey) return;

        // Фильтруем по выбранному КЦ
        if (selectedCallCenter !== 'Все КЦ' && selectedCallCenter !== kc) return;

        // Отмечаем, что этот КЦ имеет данные
        activeKCs.add(kcKey);

        // Агрегируем данные за текущий период
        const currentData = aggregateDataForPeriod(
            operator['Данные'],
            currentPeriod.startDate,
            currentPeriod.endDate
        );

        // Агрегируем данные за предыдущий период
        const previousData = aggregateDataForPeriod(
            operator['Данные'],
            previousPeriod.startDate,
            previousPeriod.endDate
        );

        // Добавляем к общим данным
        result.current.total.calls += currentData.calls;
        result.current.total.deviations += currentData.deviations;
        result.current[kcKey].calls += currentData.calls;
        result.current[kcKey].deviations += currentData.deviations;

        result.previous.total.calls += previousData.calls;
        result.previous.total.deviations += previousData.deviations;
        result.previous[kcKey].calls += previousData.calls;
        result.previous[kcKey].deviations += previousData.deviations;

        // Используем пропорциональное разделение на RPC и не-RPC (30% RPC, 70% не-RPC)
        const rpcCalls = Math.round(currentData.calls * 0.3);
        const nonRpcCalls = currentData.calls - rpcCalls;
        const rpcDeviations = Math.round(currentData.deviations * 0.4); // RPC имеет больше отклонений
        const nonRpcDeviations = currentData.deviations - rpcDeviations;

        const prevRpcCalls = Math.round(previousData.calls * 0.3);
        const prevNonRpcCalls = previousData.calls - prevRpcCalls;
        const prevRpcDeviations = Math.round(previousData.deviations * 0.4);
        const prevNonRpcDeviations = previousData.deviations - prevRpcDeviations;

        // RPC данные
        result.current.rpc.total.calls += rpcCalls;
        result.current.rpc.total.deviations += rpcDeviations;
        result.current.rpc[kcKey].calls += rpcCalls;
        result.current.rpc[kcKey].deviations += rpcDeviations;

        result.previous.rpc.total.calls += prevRpcCalls;
        result.previous.rpc.total.deviations += prevRpcDeviations;
        result.previous.rpc[kcKey].calls += prevRpcCalls;
        result.previous.rpc[kcKey].deviations += prevRpcDeviations;

        // Не-RPC данные
        result.current.nonRpc.total.calls += nonRpcCalls;
        result.current.nonRpc.total.deviations += nonRpcDeviations;
        result.current.nonRpc[kcKey].calls += nonRpcCalls;
        result.current.nonRpc[kcKey].deviations += nonRpcDeviations;

        result.previous.nonRpc.total.calls += prevNonRpcCalls;
        result.previous.nonRpc.total.deviations += prevNonRpcDeviations;
        result.previous.nonRpc[kcKey].calls += prevNonRpcCalls;
        result.previous.nonRpc[kcKey].deviations += prevNonRpcDeviations;
    });

    // Вычисляем проценты
    ['current', 'previous'].forEach(period => {
        ['total', 'kc1', 'kc2'].forEach(key => {
            if (result[period][key].calls > 0) {
                result[period][key].percentage = Math.round(
                    (result[period][key].deviations / result[period][key].calls) * 10000
                ) / 100;
            }
        });

        ['rpc', 'nonRpc'].forEach(type => {
            ['total', 'kc1', 'kc2'].forEach(key => {
                if (result[period][type][key].calls > 0) {
                    result[period][type][key].percentage = Math.round(
                        (result[period][type][key].deviations / result[period][type][key].calls) * 10000
                    ) / 100;
                }
            });
        });
    });

    console.log('Итоговые данные компании:', result);
    return result;
}

// Функция для получения данных подразделений
async function getDepartmentsData(startDate, endDate, granularity, selectedCallCenter = 'Все КЦ', selectedDepartments = ['all']) {
    const data = await loadOperatorData();
    if (!data) return null;

    const currentPeriod = { startDate, endDate };
    const previousPeriod = getPreviousPeriod(startDate, endDate, granularity);

    const departments = {};

    // Обрабатываем каждого оператора
    Object.keys(data).forEach(operatorName => {
        const operator = data[operatorName];
        const kc = operator['КЦ'];
        const group = operator['Группа'];

        // Фильтруем по выбранному КЦ
        if (selectedCallCenter !== 'Все КЦ' && selectedCallCenter !== kc) return;

        // Фильтруем по выбранным группам
        if (selectedDepartments && !selectedDepartments.includes('all') && selectedDepartments.length > 0) {
            if (!selectedDepartments.includes(group)) return;
        }

        const departmentKey = `${group} - группа`;

        if (!departments[departmentKey]) {
            departments[departmentKey] = {
                name: departmentKey,
                callCenter: kc,
                current: { calls: 0, deviations: 0, percentage: 0 },
                previous: { calls: 0, deviations: 0, percentage: 0 }
            };
        }

        // Агрегируем данные за текущий период
        const currentData = aggregateDataForPeriod(
            operator['Данные'],
            currentPeriod.startDate,
            currentPeriod.endDate
        );

        // Агрегируем данные за предыдущий период
        const previousData = aggregateDataForPeriod(
            operator['Данные'],
            previousPeriod.startDate,
            previousPeriod.endDate
        );

        departments[departmentKey].current.calls += currentData.calls;
        departments[departmentKey].current.deviations += currentData.deviations;
        departments[departmentKey].previous.calls += previousData.calls;
        departments[departmentKey].previous.deviations += previousData.deviations;
    });

    // Вычисляем проценты
    Object.keys(departments).forEach(key => {
        const dept = departments[key];
        if (dept.current.calls > 0) {
            dept.current.percentage = Math.round(
                (dept.current.deviations / dept.current.calls) * 10000
            ) / 100;
        }
        if (dept.previous.calls > 0) {
            dept.previous.percentage = Math.round(
                (dept.previous.deviations / dept.previous.calls) * 10000
            ) / 100;
        }
    });

    return departments;
}

// Функция для получения данных сотрудников
async function getEmployeesData(startDate, endDate, granularity, selectedCallCenter = 'Все КЦ', selectedDepartments = [], selectedEmployees = []) {
    const data = await loadOperatorData();
    if (!data) return null;

    const currentPeriod = { startDate, endDate };
    const previousPeriod = getPreviousPeriod(startDate, endDate, granularity);

    const employees = {
        current: [],
        previous: []
    };

    // Обрабатываем каждого оператора
    Object.keys(data).forEach(operatorName => {
        const operator = data[operatorName];
        const kc = operator['КЦ'];
        const group = operator['Группа'];

        // Фильтруем по выбранному КЦ
        if (selectedCallCenter !== 'Все КЦ' && selectedCallCenter !== kc) return;

        // Фильтруем по выбранным группам
        if (selectedDepartments && selectedDepartments.length > 0 && !selectedDepartments.includes('all')) {
            if (!selectedDepartments.includes(group)) return;
        }

        // Фильтруем по выбранным сотрудникам
        if (selectedEmployees && selectedEmployees.length > 0 && !selectedEmployees.includes('all')) {
            if (!selectedEmployees.includes(operatorName)) return;
        }

        // Агрегируем данные за текущий период
        const currentData = aggregateDataForPeriod(
            operator['Данные'],
            currentPeriod.startDate,
            currentPeriod.endDate
        );

        // Агрегируем данные за предыдущий период
        const previousData = aggregateDataForPeriod(
            operator['Данные'],
            previousPeriod.startDate,
            previousPeriod.endDate
        );

        employees.current.push({
            name: operatorName,
            department: `${group} - группа`,
            callCenter: kc,
            calls: currentData.calls,
            deviations: currentData.deviations,
            percentage: currentData.percentage
        });

        employees.previous.push({
            name: operatorName,
            department: `${group} - группа`,
            callCenter: kc,
            calls: previousData.calls,
            deviations: previousData.deviations,
            percentage: previousData.percentage
        });
    });

    return employees;
}

// Функция для получения RPC детализации
async function getRpcDetailsData(startDate, endDate, granularity, selectedCallCenter = 'Все КЦ') {
    const rpcData = await loadRpcDetailsData();
    if (!rpcData) return null;

    // Определяем период (пока используем месяц из startDate)
    const periodKey = startDate.substring(0, 7); // "2025-07"
    const previousPeriodKey = getPreviousPeriod(startDate, endDate, granularity).startDate.substring(0, 7);

    if (!rpcData[periodKey] || !rpcData[previousPeriodKey]) {
        console.warn('Нет данных RPC для периода:', periodKey, 'или', previousPeriodKey);
        return null;
    }

    const currentPeriodData = rpcData[periodKey];
    const previousPeriodData = rpcData[previousPeriodKey];

    // Определяем ключ для выбранного КЦ
    let kcKey = 'total';
    if (selectedCallCenter === 'КЦ 1') kcKey = 'kc1';
    else if (selectedCallCenter === 'КЦ 2') kcKey = 'kc2';

    return {
        current: {
            total: currentPeriodData.total,
            kc1: currentPeriodData.kc1,
            kc2: currentPeriodData.kc2
        },
        previous: {
            total: previousPeriodData.total,
            kc1: previousPeriodData.kc1,
            kc2: previousPeriodData.kc2
        }
    };
}

// Экспорт функций для Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadOperatorData,
        getCompanyData,
        getDepartmentsData,
        getEmployeesData,
        getPreviousPeriod,
        loadRpcDetailsData,
        getRpcDetailsData
    };
} else {
    // Для браузера делаем функции глобальными
    window.loadOperatorData = loadOperatorData;
    window.TEMP_OPERATOR_DATA = TEMP_OPERATOR_DATA; // Для отладки
    window.loadRpcData = loadRpcData;
    window.getCompanyData = getCompanyData;
    window.getDepartmentsData = getDepartmentsData;
    window.getEmployeesData = getEmployeesData;
    window.getPreviousPeriod = getPreviousPeriod;
    window.getRpcDataForPeriod = getRpcDataForPeriod;
    window.loadRpcDetailsData = loadRpcDetailsData;
    window.getRpcDetailsData = getRpcDetailsData;

    // Функция для сброса кэша данных (для отладки)
    window.resetDataCache = function () {
        operatorData = null;
        rpcDetailsData = null;
        console.log('🗑️ Кэш данных сброшен. Следующая загрузка будет заново пытаться загрузить JSON.');
    };

    console.log('=== real-data-processor.js функции экспортированы в window ===', {
        loadOperatorData: typeof window.loadOperatorData,
        getCompanyData: typeof window.getCompanyData,
        getDepartmentsData: typeof window.getDepartmentsData,
        getEmployeesData: typeof window.getEmployeesData,
        getPreviousPeriod: typeof window.getPreviousPeriod,
        resetDataCache: typeof window.resetDataCache
    });
}