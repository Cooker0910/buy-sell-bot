const Web3 = require("Web3");
// const ENDPOINT = "https://mainnet.infura.io/v3/0e42c582d71b4ba5a8750f688fce07da";
const ENDPOINT = "https://data-seed-prebsc-1-s1.binance.org:8545/";

let zyme = '0xEded14271227967cD24970dbF43CBc580D21A8e7';
async function getERC20Transfers() {
  let web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/0e42c582d71b4ba5a8750f688fce07da"));
  let block = await web3.eth.getBlock(14925000);
  for (var transactionIndex in block.transactions) {
    let transactionHash = block.transactions[transactionIndex];
    let transaction = await web3.eth.getTransaction(transactionHash);
    console.log(1)
    if (transaction.input.substr(0,10) == "0x095ea7b3") {
      let length = transaction.input;
      let address = length.substr(34, 74).toLowerCase();
      if(address == '')
      console.log(transaction)
    }
  }
}

// main();
getERC20Transfers();