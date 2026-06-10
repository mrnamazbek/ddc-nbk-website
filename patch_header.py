import json
import os

def update_header(filepath, sub_text, lang_text):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'Header' not in data:
        data['Header'] = {}
    data['Header']['subsidiaryOfNBK'] = sub_text
    data['Header']['language'] = lang_text
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_header('/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/messages/ru.json', 'Дочерняя организация НБК', 'Язык:')
update_header('/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/messages/en.json', 'Subsidiary of NBK', 'Language:')
update_header('/Users/namazbekbekzhanov/AntigravityProjects/ddcnb_site/messages/kz.json', 'ҚҰБ еншілес ұйымы', 'Тіл:')

print('Done patching header.')
