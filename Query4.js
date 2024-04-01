import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$group': {
      '_id': '$user.screen_name', 
      'average_retweets': {
        '$avg': '$retweet_count'
      }, 
      'tweet_count': {
        '$sum': 1
      }
    }
  }, {
    '$match': {
      'tweet_count': {
        '$gt': 3
      }
    }
  }, {
    '$sort': {
      'average_retweets': -1
    }
  }, {
    '$limit': 10
  }
];

const client = await MongoClient.connect(
  'mongodb://localhost:27017/ieeevisTweets'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();