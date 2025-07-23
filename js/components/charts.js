/**
 * Компоненты для графиков
 */

// Функция для создания столбчатой диаграммы
function createBarChart(canvasId, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // Проверяем, существует ли уже график на этом canvas
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Настройки по умолчанию
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            }
        }
    };
    
    // Объединяем настройки по умолчанию с пользовательскими
    const chartOptions = { ...defaultOptions, ...options };
    
    // Создаем график
    canvas.chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: chartOptions
    });
    
    return canvas.chart;
}

// Функция для создания линейного графика
function createLineChart(canvasId, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // Проверяем, существует ли уже график на этом canvas
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Настройки по умолчанию
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            }
        }
    };
    
    // Объединяем настройки по умолчанию с пользовательскими
    const chartOptions = { ...defaultOptions, ...options };
    
    // Создаем график
    canvas.chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: chartOptions
    });
    
    return canvas.chart;
}

// Функция для создания круговой диаграммы
function createPieChart(canvasId, labels, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // Проверяем, существует ли уже график на этом canvas
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Настройки по умолчанию
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };
    
    // Объединяем настройки по умолчанию с пользовательскими
    const chartOptions = { ...defaultOptions, ...options };
    
    // Генерируем цвета, если они не предоставлены
    const backgroundColors = options.backgroundColors || [
        '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56', '#9966FF',
        '#FF9F40', '#8AC249', '#EA526F', '#00A8E8', '#FF5A5F'
    ];
    
    // Создаем график
    canvas.chart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, data.length)
            }]
        },
        options: chartOptions
    });
    
    return canvas.chart;
}

// Функция для создания комбинированного графика (линия + столбцы)
function createComboChart(canvasId, labels, barDatasets, lineDatasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // Проверяем, существует ли уже график на этом canvas
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Настройки по умолчанию
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            }
        }
    };
    
    // Объединяем настройки по умолчанию с пользовательскими
    const chartOptions = { ...defaultOptions, ...options };
    
    // Подготавливаем наборы данных
    const datasets = [
        ...barDatasets.map(dataset => ({
            ...dataset,
            type: 'bar'
        })),
        ...lineDatasets.map(dataset => ({
            ...dataset,
            type: 'line'
        }))
    ];
    
    // Создаем график
    canvas.chart = new Chart(canvas, {
        type: 'bar', // Тип не имеет значения, так как мы указываем тип для каждого набора данных
        data: {
            labels: labels,
            datasets: datasets
        },
        options: chartOptions
    });
    
    return canvas.chart;
}