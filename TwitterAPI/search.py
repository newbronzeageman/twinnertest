import tweepy
import config
import sys

# Takes first name and last name via command
# line arguments and then display them
# print("Output from Python")
client = tweepy.Client(config.BEARER_TOKEN)
user_name = sys.argv[1]
tweet_id = sys.argv[2]


# THIS CODE ONLY DOES AT MOST 100, use Paginator to do more than 100 (beware of rate limits)
# said 5000 max should be good.. but wait for api usage screenshots


# 100 per page
def getLikingUsers():
    users = []
    for liking_user in tweepy.Paginator(
        client.get_liking_users, id=tweet_id, max_results=100
    ).flatten(limit=5000):
        users.append(liking_user.username)
    return users


# 100 per page
def getRetweetingUsers():
    users = []
    for retweeting_user in tweepy.Paginator(
        client.get_retweeters, id=tweet_id, max_results=100
    ).flatten(limit=5000):
        users.append(retweeting_user.username)
    return users


# 1000 per page
def getUserFollowers():
    users = []
    for following_user in tweepy.Paginator(
        client.get_users_followers, id=getUserID(user_name), max_results=1000
    ).flatten(limit=5000):
        users.append(following_user.username)
    return users


userNameIDs = {}


def getUserID(username):
    if username in userNameIDs:
        return userNameIDs[username]
    user = client.get_user(username=username)
    userNameIDs[username] = user.data.id
    return user.data.id


# print(getUserID(user_name))
likingUsers = getLikingUsers()
retweetingUsers = getRetweetingUsers()
followingUsers = getUserFollowers()

print(likingUsers, "\n", retweetingUsers, "\n", followingUsers, "\n")
# query = 'covid -is:retweet'

# file_name = 'tweets.txt'

# with open(file_name, 'a+') as file_handler:
#     for tweet in tweepy.Paginator(client.get_users_follo, query=query, max_results=10).flatten(limit=50):
#         #print(tweet.id)
#         file_handler.write('%s\n' % tweet.id)
