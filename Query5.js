import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const url = 'mongodb://localhost:27017/';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = client.db(dbName);
const tweetsCollection = db.collection(collectionName);


const usersPipeline = [
  {
    $group: {
      _id: '$user.id_str', 
      userDoc: { $first: '$user' }
    }
  },
  {
    $replaceRoot: { newRoot: '$userDoc' }
  }
];

const usersResult = await tweetsCollection.aggregate(usersPipeline).toArray();
const usersCollection = db.collection('Users');
for (const user of usersResult) {
  await usersCollection.updateOne({ _id: user._id }, { $set: user }, { upsert: true });
}
console.log('Users collection created or updated.');


const tweetsPipeline = [
  {
    $project: {
      created_at: 1,
      text: 1,
      entities: 1,
      user_id: '$user.id_str', 
      user: 0 
    }
  }
];

const tweetsResult = await tweetsCollection.aggregate(tweetsPipeline).toArray();
const tweetsOnlyCollection = db.collection('Tweets_Only');
for (const tweet of tweetsResult) {
  await tweetsOnlyCollection.updateOne({ _id: tweet._id }, { $set: tweet }, { upsert: true });
}
console.log('Tweets_Only collection created or updated.');

await client.close();
console.log('Connection closed');
