const Web3 = require('web3')
const XDCAbi = require('./dc.json')
const XDCAddress = '0x20B59E6C5DEB7D7CED2CA823C6CA81DD3F7E9A3A'
const ERCDCAbi = require('./ercdc.json')
const ERCDCAddress = '0x242BbeD96E456A81a291B4009BBD800cd42651E5'

const getXDC = async() => {
	const provider = 'https://rpc.apothem.network'
  const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));
  const contract = new Web3Client.eth.Contract(XDCAbi, XDCAddress);
  const result = await contract.methods.balanceOf('0x6acF908B75713d38E7Fabc9DB309721CEF12A603').call();
	console.log(result, 'XDC')
}
const getERC = async() => {
	const provider = 'https://ropsten.infura.io/v3/0e42c582d71b4ba5a8750f688fce07da'
  const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));
  const contract = new Web3Client.eth.Contract(ERCDCAbi, ERCDCAddress);
  const result = await contract.methods.balanceOf('0x6acF908B75713d38E7Fabc9DB309721CEF12A603').call();
	console.log(result, 'ERC')
}

