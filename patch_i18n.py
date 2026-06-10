import json
import os

def update_json(filepath, new_data):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data['FinancialInform'] = new_data
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# RU
ru_data = {
  "title": "Макроэкономический монитор",
  "subtitle": "Финансовые индикаторы РК",
  "refreshBtn": "Обновить показатели",
  "baseRate": "Базовая ставка НБК",
  "baseRateTrend": "Тренд за 5 заседаний",
  "inflation": "Годовая инфляция",
  "inflationTrend": "Снижение темпов",
  "exchangeRates": "Официальные курсы валют (KZT)",
  "usd": "Доллар США",
  "eur": "Евро",
  "rub": "Российский Рубль",
  "updated": "Обновлено",
  "loading": "загрузка...",
  "liveFeed": "Live feed Нацбанка"
}
update_json('/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/messages/ru.json', ru_data)

# EN
en_data = {
  "title": "Macroeconomic Monitor",
  "subtitle": "Financial Indicators of RK",
  "refreshBtn": "Refresh Indicators",
  "baseRate": "NBK Base Rate",
  "baseRateTrend": "Trend over 5 meetings",
  "inflation": "Annual Inflation",
  "inflationTrend": "Rate reduction",
  "exchangeRates": "Official Exchange Rates (KZT)",
  "usd": "US Dollar",
  "eur": "Euro",
  "rub": "Russian Ruble",
  "updated": "Updated",
  "loading": "loading...",
  "liveFeed": "NBK Live feed"
}
update_json('/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/messages/en.json', en_data)

# KZ
kz_data = {
  "title": "Макроэкономикалық монитор",
  "subtitle": "ҚР қаржы индикаторлары",
  "refreshBtn": "Көрсеткіштерді жаңарту",
  "baseRate": "ҚҰБ базалық мөлшерлемесі",
  "baseRateTrend": "5 отырыстағы тренд",
  "inflation": "Жылдық инфляция",
  "inflationTrend": "Қарқынның төмендеуі",
  "exchangeRates": "Ресми валюта бағамдары (KZT)",
  "usd": "АҚШ доллары",
  "eur": "Еуро",
  "rub": "Ресей рублі",
  "updated": "Жаңартылды",
  "loading": "жүктелуде...",
  "liveFeed": "ҚҰБ Live feed"
}
update_json('/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/messages/kz.json', kz_data)

print('Done patching messages.')
