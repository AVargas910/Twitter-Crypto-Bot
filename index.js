require('dotenv').config();
const {TwitterClient} = require('twitter-api-client');
const axios = require('axios');

const twitterClient = new TwitterClient({
 apiKey: process.env.TWITTER_API_KEY,
 apiSecret: process.env.TWITTER_API_SECRET,
 accessToken: process.env.TWITTER_ACCESS_TOKEN,
 accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let btc = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin';
let eth = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum';

var coins = [
  'polkadot', 'binancecoin', 'cardano',
  'uniswap', 'chainlink', 'ripple',
  'litecoin', 'stellar', 'bittorrent-2',
  'vechain', 'dogecoin', 'theta-token',
  'internet-computer', 'bitcoin-cash', 'matic-network',
  'maker', 'avalanche-2', 'loopring',
  'filecoin', 'tron', 'crypto-com-chain',
  'solana', 'eos', 'holotoken',
  'iota', 'monero', 'tezos',
  'neo', 'ftx-token', 'pancakeswap-token',
  'algorand', 'cosmos', 'hedera-hashgraph'
]

coins = coins.map(coin => `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`);

for (i = coins.length; i >= 6; i--){
  coins.splice(Math.floor(i*Math.random()), 1);
};

const btcRequest = axios.get(btc);
const ethRequest = axios.get(eth);
const thirdRequest = axios.get(coins[0]);
const fourthRequest = axios.get(coins[1]);
const fifthRequest = axios.get(coins[2]);
const sixthRequest = axios.get(coins[3]);
const seventhRequest = axios.get(coins[4]);

axios.all([btcRequest, ethRequest, thirdRequest, fourthRequest, fifthRequest, sixthRequest, seventhRequest])
  .then(axios.spread((...responses) => {

  const btcResponse = responses[0];
  const ethResponse = responses[1];
  const thirdResponse = responses[2];
  const fourthResponse = responses[3];
  const fifthResponse = responses[4];
  const sixthResponse = responses[5];
  const seventhResponse = responses[6];

  const btcPrice = btcResponse.data[0].current_price.toLocaleString('en-US', {
    style: 'currency', currency: 'USD'
  });
  const ethPrice = ethResponse.data[0].current_price.toLocaleString('en-US', {
    style: 'currency', currency: 'USD'
  });

  function coinName(response){
    var name = response.data[0].symbol.toUpperCase();
    return name;
  };

  function displayPrice(response) {
    var coinPrice;
    if (response.data[0].current_price < 1) {
      coinPrice = response.data[0].current_price.toLocaleString('en-US', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 4
      });
    } else {
      coinPrice = response.data[0].current_price.toLocaleString('en-US', {
        style: 'currency', currency: 'USD'
      });
    }
    return coinPrice;
  };

  function percentChange(response) {
    var coinChange;
    coinChange = response.data[0].price_change_percentage_24h.toFixed(2);
    coinChange <= 0 ?
      coinChange = `(${coinChange}%)`:
        coinChange >= 10 ?
        coinChange = `(+${coinChange}%) 🚀`:
        coinChange = `(+${coinChange}%)`;
    return coinChange;
  };

  let tweet;
  tweet =

`Live Crypto Prices (24h change)

BTC: ${btcPrice} ${percentChange(btcResponse)}
ETH: ${ethPrice} ${percentChange(ethResponse)}
${coinName(thirdResponse)}: ${displayPrice(thirdResponse)} ${percentChange(thirdResponse)}
${coinName(fourthResponse)}: ${displayPrice(fourthResponse)} ${percentChange(fourthResponse)}
${coinName(fifthResponse)}: ${displayPrice(fifthResponse)} ${percentChange(fifthResponse)}
${coinName(sixthResponse)}: ${displayPrice(sixthResponse)} ${percentChange(sixthResponse)}
${coinName(seventhResponse)}: ${displayPrice(seventhResponse)} ${percentChange(seventhResponse)}

Powered by CoinGecko API
$BTC $ETH $${coinName(thirdResponse)} $${coinName(fourthResponse)} $${coinName(fifthResponse)} $${coinName(sixthResponse)} $${coinName(seventhResponse)}`;

console.log(tweet);

  twitterClient.tweets.statusesUpdate({
      status: tweet
  }).then (response => {
      console.log("Tweeted!", response)
  }).catch(err => {
      console.error(err)
  })

})).catch(errors => {
  console.error(errors)
})
