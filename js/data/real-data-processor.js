/**
 * Модуль для обработки реальных данных операторов из callcenter_operator_data.json
 */

let operatorData = null;

// Загрузка данных из JSON файла
async function loadOperatorData() {
    if (operatorData) {
        console.log('Данные операторов уже загружены, используем кэш');
        return operatorData;
    }

    try {
        console.log('Загружаем данные операторов из callcenter_operator_data.json...');
        const response = await fetch('callcenter_operator_data.json');
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        console.log('Response text length:', text.length);
        
        operatorData = JSON.parse(text);
        console.log('Данные операторов успешно загружены:', Object.keys(operatorData).length, 'операторов');
        
        // Проверяем структуру первого оператора
        const firstOperator = Object.keys(operatorData)[0];
        console.log('Первый оператор:', firstOperator, operatorData[firstOperator]);
        
        return operatorData;
    } catch (error) {
        console.error('Ошибка загрузки данных операторов:', error);
        console.error('Error details:', error.message, error.stack);
        return null;
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

// Функция для получения данных компании
async function getCompanyData(startDate, endDate, granularity, selectedCallCenter = 'Все КЦ') {
    console.log(`getCompanyData вызвана с параметрами:`, { startDate, endDate, granularity, selectedCallCenter });
    
    const data = await loadOperatorData();
    if (!data) {
        console.error('Не удалось загрузить данные операторов');
        return null;
    }

    const currentPeriod = { startDate, endDate };
    const previousPeriod = getPreviousPeriod(startDate, endDate, granularity);
    
    console.log('Периоды для анализа:', { currentPeriod, previousPeriod });

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
        }
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

        // Для демонстрации разделим на RPC и не-RPC (примерно 30% и 70%)
        const rpcCalls = Math.round(currentData.calls * 0.3);
        const nonRpcCalls = currentData.calls - rpcCalls;
        const rpcDeviations = Math.round(currentData.deviations * 0.6); // RPC имеет больше отклонений
        const nonRpcDeviations = currentData.deviations - rpcDeviations;

        const prevRpcCalls = Math.round(previousData.calls * 0.3);
        const prevNonRpcCalls = previousData.calls - prevRpcCalls;
        const prevRpcDeviations = Math.round(previousData.deviations * 0.6);
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
async function getDepartmentsData(startDate, endDate, granularity, selectedCallCenter = 'Все КЦ') {
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

    return {
        current: Object.values(departments).map(d => ({
            name: d.name,
            callCenter: d.callCenter,
            calls: d.current.calls,
            deviations: d.current.deviations,
            percentage: d.current.percentage
        })),
        previous: Object.values(departments).map(d => ({
            name: d.name,
            callCenter: d.callCenter,
            calls: d.previous.calls,
            deviations: d.previous.deviations,
            percentage: d.previous.percentage
        }))
    };
}

// Функция для получения данных сотрудников
async function getEmployeesData(startDate, endDate, granularity, selectedCallCenter = 'Все КЦ') {
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

// Экспорт функций для Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadOperatorData,
        getCompanyData,
        getDepartmentsData,
        getEmployeesData,
        getPreviousPeriod
    };
} else {
    // Для браузера делаем функции глобальными
    window.loadOperatorData = loadOperatorData;
    window.getCompanyData = getCompanyData;
    window.getDepartmentsData = getDepartmentsData;
    window.getEmployeesData = getEmployeesData;
    window.getPreviousPeriod = getPreviousPeriod;
}