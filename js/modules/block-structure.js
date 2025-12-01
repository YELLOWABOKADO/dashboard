/**
 * Модуль для загрузки и проверки базовой структуры блоков (0/1/2 уровни)
 */

let blockStructureCache = null;
let blockStructureValidationCache = null;

async function fetchChecklistRawData() {
    const possiblePaths = [
        'operator_data_days.json',
        './operator_data_days.json',
        'tests/operator_data_days.json'
    ];

    for (const path of possiblePaths) {
        try {
            const response = await fetch(path);
            if (!response.ok) continue;
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        } catch (e) {
            console.warn('[block-structure] Ошибка загрузки данных по пути', path, e.message);
        }
    }
    return [];
}

function buildStructureFromData(data) {
    const structure = {};
    data.forEach(item => {
        const b0 = (item.Block_0_lvl || '').trim();
        const b1 = (item.Block_1_lvl || '').trim();
        const b2 = (item.Block_2_lvl || '').trim();
        if (!b0) return;
        if (!structure[b0]) {
            structure[b0] = { block1: {} };
        }
        if (b1) {
            if (!structure[b0].block1[b1]) {
                structure[b0].block1[b1] = [];
            }
            if (b2 && !structure[b0].block1[b1].includes(b2)) {
                structure[b0].block1[b1].push(b2);
            }
        }
    });
    return structure;
}

async function loadBaseBlockStructure() {
    if (blockStructureCache) return blockStructureCache;

    const structurePaths = ['block_structure.json', './block_structure.json'];
    for (const path of structurePaths) {
        try {
            const response = await fetch(path);
            if (!response.ok) continue;
            const data = await response.json();
            if (data && Object.keys(data).length > 0) {
                blockStructureCache = data;
                break;
            }
        } catch (e) {
            console.warn('[block-structure] Не удалось загрузить базовую структуру из', path, e.message);
        }
    }

    // Фолбек: строим структуру на лету из данных чек-листов
    if (!blockStructureCache) {
        const rawData = await fetchChecklistRawData();
        if (rawData.length > 0) {
            blockStructureCache = buildStructureFromData(rawData);
        }
    }

    if (typeof window !== 'undefined') {
        window.baseBlockStructure = blockStructureCache;
    }

    return blockStructureCache;
}

function getBlockPathsFromStructure(structure) {
    if (!structure) return [];
    const paths = [];
    Object.keys(structure).forEach(b0 => {
        const block1 = structure[b0]?.block1 || {};
        const block1Keys = Object.keys(block1);
        if (block1Keys.length === 0) {
            paths.push(b0);
            return;
        }
        block1Keys.forEach(b1 => {
            const block2 = block1[b1] || [];
            if (!block2 || block2.length === 0) {
                paths.push(`${b0} > ${b1}`);
            } else {
                block2.forEach(b2 => paths.push(`${b0} > ${b1} > ${b2}`));
            }
        });
    });
    return paths.sort();
}

function getBlock1List(structure) {
    if (!structure) return [];
    const blocks = new Set();
    Object.values(structure).forEach(level0 => {
        Object.keys(level0.block1 || {}).forEach(b1 => blocks.add(b1));
    });
    return Array.from(blocks).sort();
}

function validateBlockStructure(records, structure) {
    const summary = {
        total: records?.length || 0,
        missingBlock0: 0,
        missingBlock1: 0,
        missingBlock2: 0,
        samples: []
    };

    if (!Array.isArray(records) || !structure) {
        return summary;
    }

    records.forEach(item => {
        const b0 = (item.Block_0_lvl || '').trim();
        const b1 = (item.Block_1_lvl || '').trim();
        const b2 = (item.Block_2_lvl || '').trim();

        if (!b0 || !structure[b0]) {
            summary.missingBlock0++;
            if (summary.samples.length < 5) summary.samples.push({ b0, b1, b2 });
            return;
        }

        const block1 = structure[b0].block1 || {};
        if (b1 && !block1[b1]) {
            summary.missingBlock1++;
            if (summary.samples.length < 5) summary.samples.push({ b0, b1, b2 });
            return;
        }

        if (b2 && block1[b1] && !block1[b1].includes(b2)) {
            summary.missingBlock2++;
            if (summary.samples.length < 5) summary.samples.push({ b0, b1, b2 });
        }
    });

    blockStructureValidationCache = summary;
    if (typeof window !== 'undefined') {
        window.blockStructureValidation = summary;
    }
    return summary;
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.loadBaseBlockStructure = loadBaseBlockStructure;
    window.validateBlockStructure = validateBlockStructure;
    window.getBlockPathsFromStructure = getBlockPathsFromStructure;
    window.getBlock1List = getBlock1List;
}
