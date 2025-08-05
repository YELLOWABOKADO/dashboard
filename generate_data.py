import json
import random
from datetime import datetime, timedelta

# Define operators, groups, and call centers
operators = [
    {"name": "Маркина И. М.", "group": "Гридчина - группа", "kc": "КЦ 1"},
    {"name": "Ермошина С. В.", "group": "Гридчина - группа", "kc": "КЦ 1"},
    {"name": "Кузнецова В. Ю.", "group": "Гридчина - группа", "kc": "КЦ 1"},
    {"name": "Анпилогов Е. А.", "group": "Коровина - группа", "kc": "КЦ 1"},
    {"name": "Тарасова К. И.", "group": "Коровина - группа", "kc": "КЦ 1"},
    {"name": "Борисова В. А.", "group": "Коровина - группа", "kc": "КЦ 1"},
    {"name": "Ладыгина Д. В.", "group": "Мельникова - группа", "kc": "КЦ 1"},
    {"name": "Моисеенко А. А.", "group": "Мельникова - группа", "kc": "КЦ 1"},
    {"name": "Забровская А. В.", "group": "Мельникова - группа", "kc": "КЦ 1"},
    {"name": "Бакина В. О.", "group": "Сычева - группа", "kc": "КЦ 1"},
    {"name": "Коротенко П. Р.", "group": "Сычева - группа", "kc": "КЦ 1"},
    {"name": "Сухорукова И. В.", "group": "Сычева - группа", "kc": "КЦ 1"},
    {"name": "Оператор 1", "group": "группа 1 - группа", "kc": "КЦ 2"},
    {"name": "Оператор 2", "group": "группа 1 - группа", "kc": "КЦ 2"},
    {"name": "Оператор 3", "group": "группа 1 - группа", "kc": "КЦ 2"},
    {"name": "Оператор 23", "group": "группа 2 - группа", "kc": "КЦ 2"},
    {"name": "Оператор 21", "group": "группа 2 - группа", "kc": "КЦ 2"},
    {"name": "Оператор 22", "group": "группа 2 - группа", "kc": "КЦ 2"},
    {"name": "Оператор 33", "group": "группа 3 - группа", "kc": "КЦ 2"},
    {"name": "Оператор 32", "group": "группа 3 - группа", "kc": "КЦ 2"},
    {"name": "Оператор 31", "group": "группа 3 - группа", "kc": "КЦ 2"}
]

# Define issue hierarchy
issues = [
    {
        "Block_0_lvl": "Влияние на мотивацию сотрудника",
        "Block_1_lvl": "Непродуктивные диалоги",
        "Block_2_lvl": [
            "Короткие диалоги с Отказом от оплаты",
            "Использование фраз конфликтогенов"
        ],
        "Block_3_lvl": [
            "Короткие диалоги с Отказом от оплаты до 2 минут: отсутствуют инструменты / слабая РВ или М (УАВ), балл",
            "Конфликтоген_Вы не в состоянии общаться (УАВ), балл",
            "Конфликтоген_В себя придите (УАВ), балл",
            "Конфликтоген_себя оцените (УАВ), балл",
            "Конфликтоген_На ты не переходили (УАВ), балл",
            "Конфликтоген_Вы мне ещё штраф заплатите (УАВ), балл",
            "Конфликтоген_Думайте, что говорите (УАВ), балл",
            "Конфликтоген_Не придумывайте/Не выдумывайте (УАВ), балл",
            "Конфликтоген_Жалуйтесь куда хотите/На себя напишите/Никуда вы не напишите/Ваше право/Любым законным способом (УАВ), балл",
            "Конфликтоген_Гражданин/Гражданка (УАВ), балл"
        ]
    },
    {
        "Block_0_lvl": "Влияние на бизнес",
        "Block_1_lvl": "ФЗ 230",
        "Block_2_lvl": [
            "Некорректная активность в программе 2С",
            "Не проставлена активность в программе 2С",
            "Не информирует о записи разговора",
            "Работа и предоставление информации без влияния на ФЗ 230"
        ],
        "Block_3_lvl": [
            "Некорректная активность в программе 2С: смерть Д, не проставлен результат Информация о смерти Должника (УАВ), балл",
            "Некорректная активность в программе 2С: СВО, не проставлен результат Мобилизация гражданина (УАВ), балл",
            "Некорректная активность в программе 2С: жалоба, не проставлен результат Будет жаловаться (УАВ), балл",
            "Некорректная активность в программе 2С: Связь прервалась при длительном звонке (УАВ), балл",
            "Некорректно проставляет тип КЛ Д вместо ТЛ/Р или без типа КЛ (УАВ), балл",
            "Не информирует о записи разговора Д и П (УАВ), балл",
            "Не информирует о записи разговора ТЛ и Р (УАВ), балл"
        ]
    },
    {
        "Block_0_lvl": "Клиентоцентричность",
        "Block_1_lvl": "Нацеленность на результат",
        "Block_2_lvl": [
            "Отсутствие идентификации конфликтного клиента",
            "Сброс без оснований",
            "Нет предложения частичной оплаты"
        ],
        "Block_3_lvl": [
            "Отсутствие идентификации конфликтного клиента, балл",
            "Сброс без оснований, балл",
            "Отказ от оплаты без предложения частички (УАВ), балл"
        ]
    },
    {
        "Block_0_lvl": "Клиентоцентричность",
        "Block_1_lvl": "Информирование о задолженности",
        "Block_2_lvl": [
            "Не озвучил / некорректно озвучил структуру долга",
            "Разгласил информацию о ПЗ"
        ],
        "Block_3_lvl": [
            "Не озвучил / некорректно озвучил структуру долга (УАВ), балл",
            "Разгласил информацию о ПЗ и проставил результат Недозвон, Тишина или Обнаружен автоответчик (УАВ), балл",
            "Разгласил информацию о ПЗ и проставил результат Связь прервалась БЕЗ типа КЛ (УАВ), балл",
            "Разгласил информацию о ПЗ и проставил тип КЛ ТЛ или Р (УАВ), балл"
        ]
    }
]

# Date range
start_date = datetime(2025, 5, 1)
end_date = datetime(2025, 7, 30)
date_range = [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]

# Probability range for score=1 (0.5% to 1.5%)
prob_min, prob_max = 0.005, 0.015

# Generate JSON data
data = []
for operator in operators:
    for date in date_range:
        # Randomly select an issue
        issue = random.choice(issues)
        block_2 = random.choice(issue["Block_2_lvl"])
        
        # Find matching Block_3_lvl items
        matching_block_3 = []
        for b3 in issue["Block_3_lvl"]:
            if block_2 in b3 or (block_2 == "Использование фраз конфликтогенов" and "Конфликтоген" in b3):
                matching_block_3.append(b3)
        
        # If no matches found, use any Block_3_lvl from this issue
        if not matching_block_3:
            matching_block_3 = issue["Block_3_lvl"]
        
        block_3 = random.choice(matching_block_3)
        
        # Assign score with probability
        score_prob = random.uniform(prob_min, prob_max)
        score = 1 if random.random() < score_prob else 0
        
        # Create entry
        entry = {
            "operator": operator["name"],
            "group": operator["group"],
            "kc": operator["kc"],
            "date": date.strftime("%Y-%m-%d"),
            "Block_0_lvl": issue["Block_0_lvl"],
            "Block_1_lvl": issue["Block_1_lvl"],
            "Block_2_lvl": block_2,
            "Block_3_lvl": block_3,
            "score": score
        }
        data.append(entry)

# Ensure weekly limit constraint (average issues per week within 25%)
def check_weekly_limit(data):
    weekly_counts = {}
    for entry in data:
        date = datetime.strptime(entry["date"], "%Y-%m-%d")
        week_start = date - timedelta(days=date.weekday())
        week_key = (entry["operator"], week_start.strftime("%Y-%m-%d"))
        if week_key not in weekly_counts:
            weekly_counts[week_key] = 0
        if entry["score"] == 1:
            weekly_counts[week_key] += 1
    
    # Average weekly limit (assuming 1 issue per day as base, adjust within 25%)
    avg_weekly_limit = 7  # 1 issue per day * 7 days
    for week_key, count in weekly_counts.items():
        if count > avg_weekly_limit * 1.25 or count < avg_weekly_limit * 0.75:
            return False
    return True

# Adjust scores if weekly limits are violated
while not check_weekly_limit(data):
    for entry in data:
        if entry["score"] == 1:
            date = datetime.strptime(entry["date"], "%Y-%m-%d")
            week_start = date - timedelta(days=date.weekday())
            week_key = (entry["operator"], week_start.strftime("%Y-%m-%d"))
            weekly_counts = sum(1 for e in data if e["operator"] == entry["operator"] and e["score"] == 1 and (datetime.strptime(e["date"], "%Y-%m-%d") - timedelta(days=date.weekday())).strftime("%Y-%m-%d") == week_start.strftime("%Y-%m-%d"))
            if weekly_counts > 7 * 1.25:
                entry["score"] = 0

# Save to JSON file
with open("operator_issues_by_day.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("JSON file generated: operator_data_by_day.json")