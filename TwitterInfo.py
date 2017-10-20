from twython import Twython

f = open('.keys.txt', 'r')

CONSUMER_KEY = f.readline().strip('\n\r')
CONSUMER_SECRET = f.readline().strip('\n\r')
ACCESS_TOKEN = f.readline().strip('\n\r')
ACCESS_SECRET = f.readline().strip('\n\r')
f.close()
twitter = Twython(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET)
auth = twitter.get_authentication_tokens()
user = twitter.show_user(screen_name='@realdonaldtrump', include_entities=False)
print('user: ' + user['screen_name'])
print('location: ' + user['location'])
