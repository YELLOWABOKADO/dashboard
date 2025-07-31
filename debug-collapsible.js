// Скрипт для отладки сворачивающихся блоков

function debugCollapsibleSections() {
    console.log('=== ОТЛАДКА СВОРАЧИВАЮЩИХСЯ БЛОКОВ ===');
    
    // Находим все заголовки
    const headers = document.querySelectorAll('.collapsible-header');
    console.log(`Найдено заголовков: ${headers.length}`);
    
    headers.forEach((header, index) => {
        const headerId = header.id;
        const contentId = headerId.replace('Header', 'Content');
        const content = document.getElementById(contentId);
        const arrow = header.querySelector('.collapse-arrow');
        
        console.log(`\n--- Блок ${index + 1} ---`);
        console.log(`Заголовок ID: ${headerId}`);
        console.log(`Контент ID: ${contentId}`);
        console.log(`Заголовок найден: ${!!header}`);
        console.log(`Контент найден: ${!!content}`);
        console.log(`Стрелка найдена: ${!!arrow}`);
        console.log(`Инициализирован: ${header.dataset.collapsibleInitialized}`);
        
        if (content) {
            console.log(`Контент свернут: ${content.classList.contains('collapsed')}`);
            console.log(`Max-height: ${content.style.maxHeight}`);
            console.log(`Scroll height: ${content.scrollHeight}px`);
        }
    });
}

function testToggleBlock(headerId) {
    console.log(`\n=== ТЕСТ ПЕРЕКЛЮЧЕНИЯ БЛОКА ${headerId} ===`);
    
    const contentId = headerId.replace('Header', 'Content');
    
    if (typeof toggleCollapsibleSection === 'function') {
        toggleCollapsibleSection(headerId, contentId);
        console.log('Функция toggleCollapsibleSection вызвана');
    } else {
        console.error('Функция toggleCollapsibleSection не найдена');
    }
}

function forceInitCollapsible() {
    console.log('\n=== ПРИНУДИТЕЛЬНАЯ ИНИЦИАЛИЗАЦИЯ ===');
    
    if (typeof resetCollapsibleSections === 'function') {
        resetCollapsibleSections();
        console.log('Сброс выполнен');
    }
    
    if (typeof initCollapsibleSections === 'function') {
        initCollapsibleSections();
        console.log('Инициализация выполнена');
    } else {
        console.error('Функция initCollapsibleSections не найдена');
    }
    
    setTimeout(() => {
        debugCollapsibleSections();
    }, 500);
}

// Экспорт функций в глобальную область
if (typeof window !== 'undefined') {
    window.debugCollapsibleSections = debugCollapsibleSections;
    window.testToggleBlock = testToggleBlock;
    window.forceInitCollapsible = forceInitCollapsible;
    
    console.log('🔧 Функции отладки загружены:');
    console.log('   debugCollapsibleSections() - показать состояние всех блоков');
    console.log('   testToggleBlock("employeesTableHeader") - протестировать конкретный блок');
    console.log('   forceInitCollapsible() - принудительная переинициализация');
}