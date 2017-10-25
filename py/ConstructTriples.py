import sys
import requests
import CreateMonsterQuery
from SPARQLWrapper import SPARQLWrapper, RDF

TTL_DIR = "../TTL_FILES/"

LOCAL_PERSON_TYPES = ["Scientist", "Athlete", "Artist",
	"Musician", "Politician", "Comedian"]
REMOTE_PERSON_TYPES = ["dbo:Scientist", "dbo:Athlete", "dbo:Artist",
	"dbo:MusicalArtist", "dbo:Politician", "dbo:Comedian"]

LOCAL_COMPANY_TYPES = ["BigCompany", "SmallCompany", "AutomotiveCompany", "FinancialCompany",
	"InternetCompany", "RetailCompany"]
REMOTE_COMPANY_PORTIONS = [
	"""
	?s dbo:numberOfEmployees ?x .
	FILTER(?x > 1000) .
	""",
	"""
	?s dbo:numberOfEmployees ?x .
	FILTER(?x <= 1000) .
	""",
	"?s dbo:industry dbr:Automotive_industry .",
	"?s dbo:industry dbr:Financial_services .",
	"?s dbo:industry dbr:Internet .",
	"?s dbo:industry dbr:Retail ."
]

STARDOG_ENDPOINT = 'http://localhost:5820/final_project'
DB_ENDPOINT = "http://dbpedia.org/sparql"

def create_query(local_portion, remote_portion):
	return ("""
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX dby: <http://dbpedia.org/class/yago/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX ns1: <http://www.semanticweb.org/caeleanb/ontologies/twittermap#>

CONSTRUCT{
	%s
}
WHERE {
    ?s rdfs:label ?name .
    %s
""" % (local_portion, remote_portion) + CreateMonsterQuery.get_filter() + "\n" +
		"}")

def write_rdf(local_portion, remote_portion):
	query = create_query(local_portion, remote_portion)
	sparql = SPARQLWrapper(DB_ENDPOINT)
	sparql.setMethod('POST')
	sparql.setQuery(query)
	sparql.setReturnFormat(RDF)
	response = sparql.query().convert()
	with open(TTL_DIR+local_type+".ttl", 'w') as f:
		f.write(response.serialize(format='turtle'))

for (local_type, remote_type) in zip(LOCAL_PERSON_TYPES, REMOTE_PERSON_TYPES):
	print("Writing TTL for: " + local_type)
	local_portion = "?s rdf:type ns1:" + local_type + " .\n?s ns1:label ?name"
	remote_portion = "?s rdf:type " + remote_type
	write_rdf(local_portion, remote_portion)

for (local_type, remote_portion) in zip(LOCAL_COMPANY_TYPES, REMOTE_COMPANY_PORTIONS):
	print("Writing TTL for: " + local_type)
	local_portion = "?s rdf:type ns1:" + local_type + " .\n?s ns1:label ?name"
	remote_portion = "?s rdf:type dbo:Company .\n" + remote_portion
	write_rdf(local_portion, remote_portion)
