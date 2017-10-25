from twython import Twython
import requests
import json
import sys
import string
from urllib import quote
from SPARQLWrapper import SPARQLWrapper, JSON, RDF

STARDOG_ENDPOINT = 'http://localhost:5820/final_project/query'
LOCATION_DIR = "../LOC_TTL/"
PRINTABLE = set(string.printable)

SCREEN_NAME_QUERY= """
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX dbo: <http://dbpedia.org/ontology/>
	PREFIX dbr: <http://dbpedia.org/resource/>
	PREFIX dby: <http://dbpedia.org/class/yago/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX ns2: <http://www.semanticweb.org/caeleanb/ontologies/twittermap#>

	SELECT ?screen_name
	WHERE {
		?h ns2:realHandle ?screen_name .
	}
	"""

def construct_query(handle, location, lat, lng):
	location = quote(location, safe="%:=?~#+!$;'@*[]").replace('.', '')
	return """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX dby: <http://dbpedia.org/class/yago/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ns2: <http://www.semanticweb.org/caeleanb/ontologies/twittermap#>

CONSTRUCT {
	ns2:%s rdf:type ns2:Location .
	?x ns2:hasLocation ns2:%s .
	ns2:%s ns2:hasLatitude \"%s\"^^xsd:float .
	ns2:%s ns2:hasLongitude \"%s\"^^xsd:float .
}
WHERE {
	?x ns2:realHandle \"%s\" .
}

""" % (location, location, location, lat, location, lng, handle)

sparql = SPARQLWrapper(STARDOG_ENDPOINT)
sparql.setQuery(SCREEN_NAME_QUERY)
sparql.setReturnFormat(JSON)
response = sparql.query().convert()
screen_names = [item['screen_name']['value'] for item in response['results']['bindings']]

f = open('.keys.txt', 'r')
CONSUMER_KEY = f.readline().strip('\n\r')
CONSUMER_SECRET = f.readline().strip('\n\r')
ACCESS_TOKEN = f.readline().strip('\n\r')
ACCESS_SECRET = f.readline().strip('\n\r')
f.close()

twitter = Twython(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET)


def getLoc(user):
	query = user['location']
	if query.find('\\u') != -1:
		return (-1,-1,-1)
	key = "&key=AIzaSyCZBUXlJTya934fLCVMwtZZ_UfyYpyx6_8"
	url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + key
	r = requests.get(url)
	if len(json.loads(r.content)['results']) == 0:
		return (-1,-1,-1)
	lat = json.loads(r.content)['results'][0]['geometry']['location']['lat']
	lng = json.loads(r.content)['results'][0]['geometry']['location']['lng']
	return (query, lat, lng)

counter = 0
for name in screen_names:
	print("Writing TTL for: " + name)
	try:
		user = twitter.show_user(screen_name=name, include_entities=False)
		location, lat, lng = getLoc(user)
		if location != -1:
			sparql = SPARQLWrapper(STARDOG_ENDPOINT)
			location = filter(lambda x: x in PRINTABLE, location)
			query = construct_query(name, location, lat, lng)
			sparql.setQuery(query)
			sparql.setReturnFormat(RDF)
			response = sparql.query().convert()
			with open(LOCATION_DIR+name+".ttl", 'w') as f:
				f.write(response)
				counter = 0
	except:
		counter += 1
		if counter == 5:
			sys.exit()
		print("Twitter user not found.")
