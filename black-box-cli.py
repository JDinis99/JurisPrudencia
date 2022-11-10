import click
import pypandoc
import sys
import re
from specific_spacy import nlp

sys.stdin.reconfigure(encoding='utf-8') # might not be needed outside windows world
sys.stdout.reconfigure(encoding='utf-8')

import csv

class EntPool:
	def __init__(self):
		self.pool = dict()
		self.counts = dict()
	
	def add(self, ent):
		if ent.text not in self.pool:
			self.pool[ent.text] = ent
			self.counts[ent.text] = dict();
			self.counts[ent.text][ent.label_] = 1;
			return True
		else:
			if ent.label_ not in self.counts[ent.text]:
				self.counts[ent.text][ent.label_] = 0;
			self.counts[ent.text][ent.label_] += 1;
		
		if self.pool[ent.text].label_ != ent.label_:
			print( f"WARNING: Entities with same text but different labels {ent.text} {ent.label_} {self.pool[ent.text].label_}", file=sys.stderr )

def dynamicspaces(match):
	return " "*(match.end()-match.start())

def process_html(html, entpool: EntPool):
	original = re.sub(r"\n", "", html)
	notags = re.sub(r"<[^>]*>", dynamicspaces, original)
	doc = nlp(notags)
	merge = ""
	lastI = 0
	c=0
	for ent in doc.ents:
		entpool.add(ent)
		merge += original[lastI:ent.start_char]
		merge += f"<mark role={ent.label_}>{original[ent.start_char:ent.end_char]}</mark>"
		lastI = ent.end_char
	merge += original[lastI:]
	return merge

def process_simple_line(line, entpool: EntPool):
	doc = nlp(line)
	lastI = 0
	rline = ""
	for ent in doc.ents:
		rline += line[lastI:ent.start_char]
		rline += f"<mark role={ent.label_}>{ent.text}</mark>"
		lastI = ent.end_char
		entpool.add(ent)
	rline += line[lastI:]
	return rline

@click.command()
@click.argument('filename', type=click.Path(exists=True))
@click.option('--html-only', is_flag=True, default=False)
def black_box(filename, html_only):
	ents = EntPool()
	result = ""
	file_extension = "."+filename.split(".")[-1]
	if not file_extension == ".txt":
		html = pypandoc.convert_file(filename, "html", extra_args=["--wrap","none"])
		if html_only:
			result = f"<div data-from={file_extension}>{html}</div>"
		else:
			result = process_html(f"<div data-from={file_extension}>{html}</div>", ents)
	else:
		with open(file_extension, "r") as uploaded_file:
			result = f"<div data-from={file_extension}>"
			for line in uploaded_file.readlines():
				result += "<p>"
				if html_only:
					result += line.decode("utf-8")
				else:
					result += process_simple_line(line.decode("utf-8"), ents)
				result += "</p>"
			result += "</div>"

	result += f"<table><tr><th>Entity</th><th>Label(s)</th></tr>"
	for ent in ents.pool.values():
		result += f'<tr><td>{ent.text}</td><td>{" ".join(f"{o[0]} ({o[1]})" for o in ents.counts[ent.text].items())}</td></tr>'
	print(result)


if __name__ == "__main__":
	black_box()