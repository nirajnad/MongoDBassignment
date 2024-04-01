import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'retweeted_status': {
        '$exists': false
      }, 
      'in_reply_to_status_id': null
    }
  }, {
    '$count': 'not_retweets_or_replies'
  }
];

const client = await MongoClient.connect(
  'mongodb://localhost:27017/ieeevisTweets'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();