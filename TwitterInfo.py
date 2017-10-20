from twython import Twython
import requests
import json

f = open('.keys.txt', 'r')
CONSUMER_KEY = f.readline().strip('\n\r')
CONSUMER_SECRET = f.readline().strip('\n\r')
ACCESS_TOKEN = f.readline().strip('\n\r')
ACCESS_SECRET = f.readline().strip('\n\r')
f.close()

twitter = Twython(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET)

user = twitter.show_user(screen_name='@realdonaldtrump', include_entities=False)
print('user     : ' + user['screen_name'])
print('location : ' + user['location'])

r = requests.get("https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyCZBUXlJTya934fLCVMwtZZ_UfyYpyx6_8")

print('latitude : ' + str(json.loads(r.content)['results'][0]['geometry']['location']['lat']))
print('longitude: ' + str(json.loads(r.content)['results'][0]['geometry']['location']['lng']))
