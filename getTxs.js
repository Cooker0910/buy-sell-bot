const Web3 = require("Web3");
// const ENDPOINT = "https://mainnet.infura.io/v3/0e42c582d71b4ba5a8750f688fce07da";
const ENDPOINT = "https://data-seed-prebsc-1-s1.binance.org:8545/";

let zyme = '0xEded14271227967cD24970dbF43CBc580D21A8e7';
let zyme1 = '0x4476B96c00470CB39734187cB0675d995e5a1c8c';
async function getERC20Transfers() {
  let web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/0e42c582d71b4ba5a8750f688fce07da"));
  let block = await web3.eth.getBlock(14926374);
  for(var j = 14926378; j < 14926400; j ++){
    let i = 0
    console.log('Block Number', j)
    for (var transactionIndex in block.transactions) {
      let transactionHash = block.transactions[transactionIndex];
      let transaction = await web3.eth.getTransaction(transactionHash);
      if (transaction.input.substr(0,10) == "0x095ea7b3") {
        i++;
        let length = transaction.input;
        let address = length.substr(35, 40).toLowerCase();
        console.log(transaction.hash, address);
        console.log(i)
        if(address == zyme.toLowerCase()) {
          console.log(transaction.hash)
        }
      }
    }
  }
}

// main();
getERC20Transfers();