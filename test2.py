import sqlite3

conn = sqlite3.connect("bands_with_coords.db")
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("""
    SELECT country_of_origin, COUNT(*) as count
    FROM bands_with_coords
    WHERE LOWER(band_name) LIKE '%goat%'
    GROUP BY country_of_origin
    ORDER BY count DESC
""")

for row in cursor.fetchall():
    print(f"{row['country_of_origin']}: {row['count']}")

conn.close()