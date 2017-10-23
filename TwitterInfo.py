from twython import Twython
import requests
import json
import sys

f = open('.keys.txt', 'r')
CONSUMER_KEY = f.readline().strip('\n\r')
CONSUMER_SECRET = f.readline().strip('\n\r')
ACCESS_TOKEN = f.readline().strip('\n\r')
ACCESS_SECRET = f.readline().strip('\n\r')
f.close()

twitter = Twython(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET)

user = twitter.show_user(screen_name=sys.argv[1], include_entities=False)
print('user     : ' + user['screen_name'])
print('location : ' + user['location'])
query = user['location']
key = "&key=AIzaSyCZBUXlJTya934fLCVMwtZZ_UfyYpyx6_8"
url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + key
r = requests.get(url)

print('latitude : ' + str(json.loads(r.content)['results'][0]['geometry']['location']['lat']))
print('longitude: ' + str(json.loads(r.content)['results'][0]['geometry']['location']['lng']))
