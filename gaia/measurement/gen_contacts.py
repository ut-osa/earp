#!/usr/bin/env python
#
# Generates Random firefoxOS contacts and dumps the JSON interpretations
# of these to stdout
#
# Author: thunt

import json
import random
import string

#parameters
MAX_FIELD_LENGTH = 50
MAX_LIST_FIELDS = 4
TOTAL_COUNT = 500

SAME_NAME = 100;
NAME = "benchmark name";
SAME_CAT = 100;
CAT = "benchmark cat";

cats = ['work', 'friends', 'highschool', 'family', 'carpool']
idx = 0

# handy lists
CHARACTERS = string.ascii_lowercase + string.digits
STRING_FIELDS = [
  "name", "honorificPrefix", "givenName", "additionalName", "familyName",
  "phoneticGivenName", "phoneticFamilyName",
  "honorificSuffix", "nickname", "org", "jobTitle",
  "note", "sex", "genderIdentity", "key", 
]

STD_FIELDS = ["email", "url", "impp", "tel"];

FIELDS = [
  "name", "honorificPrefix", "givenName", "additionalName", "familyName",
  "phoneticGivenName", "phoneticFamilyName",
  "honorificSuffix", "nickname", "photo", "category", "org", "jobTitle",
  "bday", "note", "anniversary", "sex", "genderIdentity", "key", "adr", "email",
  "url", "impp", "tel"
]

def rand_range(maximum):
    return xrange(random.choice(range(1,maximum+1)))

def flip_coin():
    return random.choice([True,False])

def gen_string():
    return ''.join(random.choice(CHARACTERS) 
                   for _ in xrange(20))

def gen_number():
    return ''.join(random.choice(string.digits) for _ in xrange(8))

def gen_objs():
    return [{"type": [gen_string()], "value": gen_string(),
            "perf": flip_coin()} for _ in xrange(1)]

def gen_addrs():
  return [{'type': [gen_string()], 'streetAddress': gen_string(),
           'locality': gen_string(), 'region': gen_string(),
           'postalCode': gen_string(), 'countryName': gen_string(),
           'perf': flip_coin()}
          for _ in xrange(1)]
def get_category():
    global idx
    global cats
    res =  [cats[idx]]
    idx += 1
    idx %= len(cats)
    return res


def gen_other():
    ret = {x: gen_objs() for x in STD_FIELDS}
    for obj in ret['tel']:
        obj['carrier'] = gen_string()
        obj['value'] = gen_number()

    ret['adr'] = gen_addrs()
    ret['category'] = get_category()
    return ret

def gen_contact():
    ret = {x: [gen_string()] for x in STRING_FIELDS}
    ret.update(gen_other())
    return ret

def gen(count):
    contacts = [gen_contact() for _ in xrange(count)]
    #for i in range(SAME_NAME) * 5:
    #    contacts[i]["name"][0] = NAME
    #for i in range(SAME_CAT) * 5:
    #    contacts[i]["category"][0] = CAT
    return json.dumps(contacts, separators=(',', ':'))

def main():
    print gen(TOTAL_COUNT)
if __name__ == '__main__':
    main()
