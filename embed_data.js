const fs = require('fs');

// Читаем JSON файл
const jsonData = JSON.parse(fs.readFileSync('operator_data_days.json', 'utf8'));

// Читаем HTML файл
let htmlContent = fs.readFileSync('tests/test-issues-dashboard.html', 'utf8');

// Создаем строку с данными для встраивания
const dataString = `const EMBEDDED_DATA = ${JSON.stringify(jsonData, null, 2)};`;

// Находим место для вставки данных (перед функцией loadEmbeddedData)
const insertPoint = htmlContent.indexOf('// Загрузка встроенных реальных данных');
if (insertPoint !== -1) {
    htmlContent = htmlContent.slice(0, insertPoint) + 
                  dataString + '\n\n        ' + 
                  htmlContent.slice(insertPoint);
} else {
    // Если не найдено, вставляем после начала script тега
    const scriptStart = htmlContent.indexOf('<script>');
    if (scriptStart !== -1) {
        const insertPos = htmlContent.indexOf('\n', scriptStart) + 1;
        htmlContent = htmlContent.slice(0, insertPos) + 
                      '        ' + dataString + '\n\n' + 
                      htmlContent.slice(insertPos);
    }
}

// Записываем обновленный HTML файл
fs.writeFileSync('tests/test-issues-dashboard-with-data.html', htmlContent);

console.log('✅ Данные встроены в файл tests/test-issues-dashboard-with-data.html');
console.log(`📊 Встроено ${jsonData.length} записей`);

// Проверяем данные для Коротенко П. Р.
const korotenkoRecords = jsonData.filter(item => item.operator === 'Коротенко П. Р.');
console.log(`🔍 Найдено записей для Коротенко П. Р.: ${korotenkoRecords.length}`);