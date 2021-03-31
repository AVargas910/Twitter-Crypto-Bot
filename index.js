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
//
//
//     .then(response => {
//     const data = response.data.data ? response.data.data : {}
//     let tweet
//     if (data.Events && data.Events.length) {
//         //tweet the first event in the array
//         tweet = 'Year ' + data.Events[0].year + ' - ' + data.Events[0].text
//     } else {
//         tweet = 'Nothing happened today :)'
//     }
//
//     twitterClient.tweets.statusesUpdate({
//         status: tweet
//     }).then (response => {
//         console.log("Tweeted!", response)
//     }).catch(err => {
//         console.error(err)
//     })
// }).catch (err => {
//     console.error(err)
// });
//
// {
//   "time":{
//     "updated":"Sep 18, 2013 17:27:00 UTC",
//     "updatedISO":"2013-09-18T17:27:00+00:00"
//   },
//   "disclaimer":"This data was produced from the CoinDesk Bitcoin Price Index. Non-USD currency data converted using hourly conversion rate from openexchangerates.org",
//   "bpi":{
//     "USD":{"code":"USD","symbol":"$","rate":"126.5235","description":"United States Dollar","rate_float":126.5235},
//     "GBP":{"code":"GBP","symbol":"£","rate":"79.2495","description":"British Pound Sterling","rate_float":79.2495},
//     "EUR":{"code":"EUR","symbol":"€","rate":"94.7398","description":"Euro","rate_float":94.7398}
//   }
// }
