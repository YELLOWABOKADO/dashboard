import json
from datetime import datetime, timedelta
import random

# Список операторов
operators = [
    {"operator": "Маркина И. М.", "group": "Гридчина - группа", "kc": "КЦ 1"},
    {"operator": "Ермошина С. В.", "group": "Гридчина - группа", "kc": "КЦ 1"},
    {"operator": "Кузнецова В. Ю.", "group": "Гридчина - группа", "kc": "КЦ 1"},
    {"operator": "Анпилогов Е. А.", "group": "Коровина - группа", "kc": "КЦ 1"},
    {"operator": "Тарасова К. И.", "group": "Коровина - группа", "kc": "КЦ 1"},
    {"operator": "Борисова В. А.", "group": "Коровина - группа", "kc": "КЦ 1"},
    {"operator": "Ладыгина Д. В.", "group": "Мельникова - группа", "kc": "КЦ 1"},
    {"operator": "Моисеенко А. А.", "group": "Мельникова - группа", "kc": "КЦ 1"},
    {"operator": "Забровская А. В.", "group": "Мельникова - группа", "kc": "КЦ 1"},
    {"operator": "Бакина В. О.", "group": "Сычева - группа", "kc": "КЦ 1"},
    {"operator": "Коротенко П. Р.", "group": "Сычева - группа", "kc": "КЦ 1"},
    {"operator": "Сухорукова И. В.", "group": "Сычева - группа", "kc": "КЦ 1"},
    {"operator": "Оператор 1", "group": "группа 1 - группа", "kc": "КЦ 2"},
    {"operator": "Оператор 2", "group": "группа 1 - группа", "kc": "КЦ 2"},
    {"operator": "Оператор 3", "group": "группа 1 - группа", "kc": "КЦ 2"},
    {"operator": "Оператор 23", "group": "группа 2 - группа", "kc": "КЦ 2"},
    {"operator": "Оператор 21", "group": "группа 2 - группа", "kc": "КЦ 2"},
    {"operator": "Оператор 22", "group": "группа 2 - группа", "kc": "КЦ 2"},
    {"operator": "Оператор 33", "group": "группа 3 - группа", "kc": "КЦ 2"},
    {"operator": "Оператор 32", "group": "группа 3 - группа", "kc": "КЦ 2"},
    {"operator": "Оператор 31", "group": "группа 3 - группа", "kc": "КЦ 2"}
]

# Иерархия блоков
block_hierarchy = {
    "Влияние на мотивацию сотрудника": {
        "Непродуктивные диалоги": [
            "Некорректная активность в программе 2С",
            "Не проставлена активность в программе 2С",
            "Длительное нахождение в автоответчике",
            "Длительное нахождение оператора в тишине",
            "Превышение времени ожидания ответа от абонента"
        ],
        "ФЗ 230": [
            "Работа и предоставление информации без влияния на ФЗ 230"
        ],
        "Провоцирование конфликта": [
            "Использование фраз конфликтогенов"
        ]
    },
    "Влияние на бизнес": {
        "ФРОД-мониторинг": [
            "ФРОД"
        ],
        "Нацеленность на результат": [
            "Сброс без оснований",
            "Нет предложения частичной оплаты"
        ]
    },
    "Клиентоцентричность": {
        "Мотивация": [
            "Отсутствие мотиватора ГП",
            "Отсутствие напоминания о ЕП",
            "Отсутствуют/слабые инструменты"
        ],
        "Процедуры по процессу": [
            "Правильное проставление результата звонка/корректная фиксация информации в 2С",
            "Работа с контактными данными (ТЛ и Р)",
            "Сбор и работа с информацией по инструкции"
        ]
    }
}

# Функция для получения случайного пути в иерархии
def get_random_block_path():
    block_0_lvl = random.choice(list(block_hierarchy.keys()))
    block_1_lvl = random.choice(list(block_hierarchy[block_0_lvl].keys()))
    block_2_lvl = random.choice(block_hierarchy[block_0_lvl][block_1_lvl])
    block_3_lvl = f"{block_2_lvl}, балл"
    return block_0_lvl, block_1_lvl, block_2_lvl, block_3_lvl

# Функция для генерации оценки с вероятностью 0.5-1.5%
def generate_score():
    # Вероятность получения 1: от 0.5% до 1.5%
    probability = random.uniform(0.005, 0.015)
    return 1 if random.random() < probability else 0

# Генерация дат
start_date = datetime(2025, 5, 1)
end_date = datetime(2025, 7, 30)
delta = end_date - start_date
dates = [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(delta.days + 1)]

# Создание JSON
data = []
for date in dates:
    for operator in operators:
        block_0_lvl, block_1_lvl, block_2_lvl, block_3_lvl = get_random_block_path()
        entry = {
            "operator": operator["operator"],
            "group": operator["group"],
            "kc": operator["kc"],
            "date": date,
            "Block_0_lvl": block_0_lvl,
            "Block_1_lvl": block_1_lvl,
            "Block_2_lvl": block_2_lvl,
            "Block_3_lvl": block_3_lvl,
            "score": generate_score()
        }
        data.append(entry)

# Сохранение в файл
with open("operator_data_days.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"JSON файл успешно создан. Всего записей: {len(data)}")
print(f"Период: с {dates[0]} по {dates[-1]}")
print(f"Количество операторов: {len(operators)}")
print(f"Количество дней: {len(dates)}")

# Подсчет статистики
scores_1 = sum(1 for entry in data if entry["score"] == 1)
scores_0 = len(data) - scores_1
actual_percentage = (scores_1 / len(data)) * 100

print(f"\nСтатистика:")
print(f"Оценок 1: {scores_1} ({actual_percentage:.2f}%)")
print(f"Оценок 0: {scores_0} ({100 - actual_percentage:.2f}%)")