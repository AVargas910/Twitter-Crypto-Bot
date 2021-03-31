require('dotenv').config();
const {TwitterClient} = require('twitter-api-client');
const axios = require('axios');

const twitterClient = new TwitterClient({
 apiKey: process.env.TWITTER_API_KEY,
 apiSecret: process.env.TWITTER_API_SECRET,
 accessToken: process.env.TWITTER_ACCESS_TOKEN,
 accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(response => {
    const time = response.data.time.updated;
    const price = (response.data.bpi.USD.rate_float).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    let tweet;
    tweet = `The price of one Bitcoin was ${price} USD at the time of this tweet (${time}).
Powered by CoinDesk. https://www.coindesk.com/price/bitcoin`
    twitterClient.tweets.statusesUpdate({
        status: tweet
    }).then (response => {
        console.log("Tweeted!", response)
    }).catch(err => {
        console.error(err)
    })
  }).catch (err => {
      console.error(err)
});
