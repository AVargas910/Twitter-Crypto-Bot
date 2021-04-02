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
let ada = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=cardano';
let vet = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=vechain';
let dot = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=polkadot';
let doge = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=dogecoin';

const btcRequest = axios.get(btc);
const ethRequest = axios.get(eth);
const adaRequest = axios.get(ada);
const vetRequest = axios.get(vet);
const dotRequest = axios.get(dot);
const dogeRequest = axios.get(doge);

axios.all([btcRequest, ethRequest, adaRequest, vetRequest, dotRequest, dogeRequest]).then(axios.spread((...responses) => {
  const btcResponse = responses[0];
  const ethResponse = responses[1];
  const adaResponse = responses[2];
  const vetResponse = responses[3];
  const dotResponse = responses[4];
  const dogeResponse = responses[5];


  const btcPrice = btcResponse.data[0].current_price.toLocaleString('en-US', {
    style: 'currency', currency: 'USD'
  });
  const ethPrice = ethResponse.data[0].current_price.toLocaleString('en-US', {
    style: 'currency', currency: 'USD'
  });
  const adaPrice = adaResponse.data[0].current_price.toLocaleString('en-US', {
    style: 'currency', currency: 'USD'
  });
  const vetPrice = vetResponse.data[0].current_price.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 4
  });
  const dotPrice = dotResponse.data[0].current_price.toLocaleString('en-US', {
    style: 'currency', currency: 'USD'
  });
  const dogePrice = dogeResponse.data[0].current_price.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 4
  });

  let btcChange = btcResponse.data[0].price_change_percentage_24h.toFixed(2);
  btcChange <= 0 ? btcChange : btcChange = '+' + btcChange;

  let ethChange = ethResponse.data[0].price_change_percentage_24h.toFixed(2);
  ethChange <= 0 ? ethChange : ethChange = '+' + ethChange;

  let adaChange = adaResponse.data[0].price_change_percentage_24h.toFixed(2);
  adaChange <= 0 ? adaChange : adaChange = '+' + adaChange;

  let dotChange = dotResponse.data[0].price_change_percentage_24h.toFixed(2);
  dotChange <= 0 ? dotChange : dotChange = '+' + dotChange;

  let vetChange = vetResponse.data[0].price_change_percentage_24h.toFixed(2);
  vetChange <= 0 ? vetChange : vetChange = '+' + vetChange;

  let dogeChange = dogeResponse.data[0].price_change_percentage_24h.toFixed(2);
  dogeChange <= 0 ? dogeChange : dogeChange = '+' + dogeChange;

  let tweet;
  tweet = `Current price of some popular coins (24h change)

BTC: ${btcPrice} (${btcChange}%)
ETH: ${ethPrice} (${ethChange}%)
ADA: ${adaPrice} (${adaChange}%)
DOT: ${dotPrice} (${dotChange}%)
VET: ${vetPrice} (${vetChange}%)
DOGE: ${dogePrice} (${dogeChange}%)

Powered by CoinGecko API
#BTC #ETH #ADA #VET #DOGE #DOT`;

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
