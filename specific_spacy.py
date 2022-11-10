import spacy
import re
import sys
import csv
spacy_model = "./model-best"

PATTERN_MATRICULA = "[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{2}"
PATTERN_PROCESSO = r"\d+(-|\.|_|\s|\/)\d{1,2}(\.)[A-Z0-9]+(-|\.)[A-Z0-9]+(\.)*[A-Z0-9]*"
PATTERN_DATA = r"\d{1,2}(-|\.|/)\d{1,2}(-|\.|/)\d{4}"
EXCLUDE = ['Tribunal','Réu','Reu','Ré','Supremo Tribunal de Justiça',"STJ","Supremo Tribunal",
            'Requerida','Autora','Instância','Relação','Supremo','Recorrente','Recorrida'
            'Tribual da Relação']
EXCLUDE = [x.lower() for x in EXCLUDE]

class FakeEntity:
    def __init__(self,label,start,end,text):
        self.label_ = label
        self.start_char = start
        self.end_char = end
        self.text = text

class FakeDoc:
    def __init__(self,ents, text):
        self.ents = ents
        self.text = text

def excude_manual(ents):
    new_list = []
    for e in ents:
        label,start,end,text = e.label_,e.start_char,e.end_char,e.text
        if text.lower().strip() in EXCLUDE:
            continue
        elif len(text) <= 2:
            continue
        elif re.match(r"^\d+(º|ª)$",text):
            continue
        elif label == 'DAT' and re.match(PATTERN_DATA,text):
            text = re.match(PATTERN_DATA,text).group()
            end = start+len(text)
            new_list.append(FakeEntity(label,start,end,text))
        else:
            new_list.append(FakeEntity(label,start,end,text))
    return new_list

def correct_ent(ents):
    new_list = []
    for e in ents:
        label,start,end,text = e.label_,e.start_char,e.end_char,e.text
        if text.startswith("Ré ") and len(text) > 3+2:
            new_list.append(FakeEntity(label,start+3,end,text[3:]))
        elif text.startswith("Réu ") and len(text) > 4+2:
            new_list.append(FakeEntity(label,start+4,end,text[4:]))
        elif text.startswith("Autora ") and len(text) > 7+2:
            new_list.append(FakeEntity(label,start+7,end,text[7:]))
        else:
            new_list.append(FakeEntity(label,start,end,text))
    return new_list

def add_ent_by_pattern(ents, text, pattern, label):
    p = re.compile(pattern)
    for m in p.finditer(text):
        go = True
        start_pos,end_pos = m.span()
        for e in ents: 
            if start_pos >= e.start_char and start_pos <= e.end_char or end_pos >= e.start_char and end_pos <= e.end_char:
                go = False
                break
        if go:
            ents.append(FakeEntity(label, start_pos, end_pos, text[start_pos:end_pos]))
    return ents

def remove_pattern(p, ents):
    new_list = []
    for e in ents:
        if not p.match(e.text):
            new_list.append(e)
    return new_list

def nlp(text):
    snlp = spacy.load(spacy_model)
    doc = snlp(text)
    ents = []
    for ent in excude_manual(doc.ents):
        ents.append(ent)

    with open('patterns.csv', 'r') as csvfd:
        reader = csv.DictReader(csvfd, delimiter="\t")
        for r in reader:
            add_ent_by_pattern(ents, text, r['Pattern'], r['Label'])
    
    ents = correct_ent(ents)
    with open('exclude.csv', 'r') as csvfd:
        reader = csv.DictReader(csvfd, delimiter="\t")
        for r in reader:
            p = re.compile(r['Pattern'])
            ents = remove_pattern(p, ents)
    ents = sorted(ents,key=lambda x: x.start_char)
    return FakeDoc(ents, doc.text)

def nlp_pipe(texts):
    snlp = spacy.load(spacy_model)
    for doc in snlp.pipe(texts):
        ents = []
        for ent in excude_manual(doc.ents):
            ents.append(ent)

        with open('patterns.csv', 'r') as csvfd:
            reader = csv.DictReader(csvfd, delimiter="\t")
            for r in reader:
                add_ent_by_pattern(ents, text, r['Pattern'], r['Label'])
        
        ents = correct_ent(ents)
        with open('exclude.csv', 'r') as csvfd:
            reader = csv.DictReader(csvfd, delimiter="\t")
            for r in reader:
                p = re.compile(r['Pattern'])
                ents = remove_pattern(p, ents)
        ents = sorted(ents,key=lambda x: x.start_char)
        yield FakeDoc(ents, doc.text)