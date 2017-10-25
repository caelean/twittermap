FILENAME = "../TTL_FILES/twitterTriples.ttl"
# DEST_FILE = "filter.txt"

lines = []
with open(FILENAME, 'r') as f:
	lines = f.readlines()

display_names = []
for line in lines:
	if line.find('ns2:displayName') != -1:
		display_names.append(line[line.index('\"'):line.index('@en')+3])

query = "FILTER(?name IN ("
for display_name in display_names[:-1]:
	if display_name.find('\\u') == -1:
	  query += display_name + ", "
query += display_names[-1] + "))"

# with open(DEST_FILE, 'w') as g:
# 	g.write(query)

def get_filter():
	return query
