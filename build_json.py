import sys
import json
from SPARQLWrapper import SPARQLWrapper, JSON
from collections import defaultdict

STARDOG_ENDPOINT = 'http://localhost:5820/final_project/query'

QUERY = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX dby: <http://dbpedia.org/class/yago/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ns1: <http://www.semanticweb.org/caeleanb/ontologies/twittermap#>

SELECT ?handle ?name ?type ?influence ?followers ?retweets ?lat ?long
WHERE {
	?x rdf:type ?type .
	?x ns1:hasHandle ?h .
	?h ns1:realHandle ?handle .
	?h ns1:displayName ?name .
	?h ns1:hasLocation ?l .
	?l ns1:hasLatitude ?lat .
	?l ns1:hasLongitude ?long .
	?h ns1:influenceMetric ?influence .
	?h ns1:numFollowers ?followers .
	?h ns1:numRetweets ?retweets .
}
"""

QUERY_2 = """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX dby: <http://dbpedia.org/class/yago/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ns1: <http://www.semanticweb.org/caeleanb/ontologies/twittermap#>

SELECT ?handle ?name ?influence ?followers ?retweets ?lat ?long
WHERE {
	?h ns1:realHandle ?handle .
	?h ns1:displayName ?name .
	?h ns1:hasLocation ?l .
	?l ns1:hasLatitude ?lat .
	?l ns1:hasLongitude ?long .
	?h ns1:influenceMetric ?influence .
	?h ns1:numFollowers ?followers .
	?h ns1:numRetweets ?retweets .
	FILTER NOT EXISTS {
		?x ns1:hasHandle ?h .
	}
}
"""

def dump_query(query):
	sparql = SPARQLWrapper(STARDOG_ENDPOINT)
	sparql.setQuery(QUERY)
	sparql.setReturnFormat(JSON)
	return sparql.query().convert()['results']['bindings']

response = dump_query(QUERY_2) + dump_query(QUERY) # Combine both queries
results = {}
for user in response:
	handle = user['handle']['value']
	if handle in results and 'type' in user:
			results[handle]['categories'].append(user['type']['value'].rsplit('#')[-1])
	else:
		entry = {}
		entry['name'] = user['name']['value']
		entry['influence'] = float(user['influence']['value'])
		entry['retweets'] = int(user['retweets']['value'])
		entry['followers'] = int(user['followers']['value'])
		entry['lat'] = float(user['lat']['value'])
		entry['long'] = float(user['long']['value'])
		if 'type' in user:
			entry['categories'] = [user['type']['value'].rsplit('#')[-1]]
		results[handle] = entry
data = 'var data = ' + json.dumps(results) + ';\n'
with open("./static/js/data.js", 'w') as f:
	f.write(data)
	f.close()
