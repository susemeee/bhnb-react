# Data format conversion
import csv
import json
import os
import sys

OUT_FILENAME = "hyg-database.json"

# argv check
if not sys.argv[1]:
    print("[-] Usage : python reducer.py {mag}")

# 어차피 파일 열면 GC가 알아서 꺼줄거임 ^^
src = open(
    os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        "..",
        "HYG-Database",
        "hygdata_v3.csv",
    ),
    "r",
)
rows = csv.reader(src)
rows = list(rows)

# Reduction
payload = list()
indexes = [ra, dec, proper, mag] = [
    rows[0].index(attr) for attr in ["ra", "dec", "proper", "mag"]
]
for row in rows[1:]:
    if float(row[mag]) <= float(sys.argv[1]):
        reduced = zip(
            [rows[0][index] for index in indexes], [row[index] for index in indexes]
        )
        payload.append(dict(reduced))

# Remove Sun!!!
payload = payload[1:]

# Write to json
dst = open(os.path.join(os.getcwd(), "src", OUT_FILENAME), "w")
print(f"[*] Reduced -> {len(payload)}")
dst.write(json.dumps(payload))
