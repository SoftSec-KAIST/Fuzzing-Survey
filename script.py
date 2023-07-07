import json
import sys
import readline

DATA_FILE = 'data/fuzzers.json'


class RefCompleter(object):
    def __init__(self, options):
        self.options = sorted(options)

    def complete(self, text, state):
        if state == 0:
            if text:
                self.matches = [
                    s for s in self.options if s and s.startswith(text)
                ]
            else:
                self.matches = self.options[:]

        try:
            return self.matches[state]
        except IndexError:
            return None


def is_empty_field(field):
    return field == '' or field == ['']


def is_valid_color(color):
    return color in ['whitebox', 'blackbox', 'greybox']


def is_valid_references(db, refs):
    if refs == ['']:
        return '\nNo reference.'

    if len(refs) > 2:
        return '\nToo many references.'

    names = [e['name'] for e in db]
    for ref in refs:
        if ref not in names:
            return '\nInvalid reference {}.'.format(ref)

    return None


# Load data/fuzzers.json
with open(DATA_FILE, 'r') as f:
    db = json.load(f)

# Initialize readline completer
if 'libedit' in readline.__doc__:
    readline.parse_and_bind("bind ^I rl_complete")
else:
    readline.parse_and_bind("tab: complete")

# Required fields
entry = {}
entry['name'] = input('name: ')
if is_empty_field(entry['name']):
    err = '\nNo name.'
    sys.exit(err)

entry['year'] = input('year: ')
if is_empty_field(entry['year']):
    err = '\nNo year.'
    sys.exit(err)

entry['targets'] = input('targets: ').split(', ')
if is_empty_field(entry['targets']):
    err = '\nNo targets.'
    sys.exit(err)

entry['color'] = input('color: ')
if not is_valid_color(entry['color']):
    sys.exit('\nInvalid color {}'.format(entry['color']))

readline.set_completer(RefCompleter([e['name'] for e in db]).complete)

entry['references'] = input('references: ').split(', ')
err = is_valid_references(db, entry['references'])
if err:
    sys.exit(err)

readline.set_completer(None)

# Optional fields
entry['author'] = input('\nauthor: ').split(', ')
entry['toolurl'] = input('toolurl: ')
entry['title'] = input('title: ')
entry['booktitle'] = input('booktitle: ')
entry['journal'] = input('journal: ')
entry['volume'] = input('volumn: ')
entry['number'] = input('number: ')

entry['miscurl'] = input('miscurl: ').split(', ')
entry['keywords'] = input('keywords: ').split(', ')

# Clear empty fields and store the result
entry = {k: v for k, v in entry.items() if not is_empty_field(v)}
db.append(entry)
db = sorted(db, key=lambda e: e['name'])
with open(DATA_FILE, 'w') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)
    f.write('\n')

