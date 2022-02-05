var Accounts = require('web3-eth-accounts');
const Web3 = require('web3')
var web3 = new Web3('http://localhost:8545'); // your geth

for(var i = 0; i <= 9; i ++) {
  var account = web3.eth.accounts.create();
  console.log(account)
}