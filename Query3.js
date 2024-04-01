import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$group': {
      '_id': '$user.screen_name', 
      'tweet_count': {
        '$sum': 1
      }
    }
  }, {
    '$sort': {
      'tweet_count': -1
    }
  }, {
    '$limit': 1
  }
];

const client = await MongoClient.connect(
  'mongodb://localhost:27017/ieeevisTweets'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();