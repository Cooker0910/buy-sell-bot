const Web3 = require('web3')
const ethers = require('ethers');
const {JsonRpcProvider} = require("@ethersproject/providers");

const wallets = require('./wallets')
const amazonAbi = require('./amazon.json')

const pcsRouterV2 = Web3.utils.toChecksumAddress('0x10ED43C718714eb63d5aA57B78B54704E256024E');
const bnbAddress = Web3.utils.toChecksumAddress('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
const amazonAddress = Web3.utils.toChecksumAddress('0x3c18F6C2aff81a6489327DA5b0d4FB5ed5695801'); 

const gas = {
  gasPrice: ethers.utils.parseUnits('5', 'gwei'),
  gasLimit: 1000000
}

const transactions = [];
var n = m = 0 ;
for (var i = 1; i < 4; i ++){
  let transaction = {
    'to': wallets[i].address,
    'privateKey': wallets[i].privateKey,
    'value': 15000000000000000,
    'gasLimit': 21000,
    'gas': 5000000
  };
  transactions.push(transaction)
}
const buyToken = async (routerV2, to) => {
  console.log(111111)
  try {
    const BNBAmount = ethers.utils.parseEther('0.01').toHexString();
    const tx = await routerV2.swapExactETHForTokens(
      0, 
      [bnbAddress, amazonAddress],
      to,
      Math.floor(Date.now() / 1000) + 60 * 20, 
      {
        value: BNBAmount,
        ...gas
      }
    );
    console.log(`Swapping WETH for tokens...`);
    const receipt = await tx.wait();
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    n++;
    main();
  } catch (error) {
    console.log('=======buy error=========', error)
  }
}



const getApproval = async (approvalAmount, account)  => {
  console.log(`getting approval`);
  let contract = new ethers.Contract(amazonAddress, amazonAbi, account);
  let approveResponse = await contract.approve(
    pcsRouterV2, 
    ethers.utils.parseUnits(approvalAmount.toString(), 18),
    {
      ...gas
    });
  console.log('approve done!')
  return approveResponse
}

const sellToken = async(routerV2, to, account) => {
  console.log('start sell')
  const provider = 'https://bsc-dataseed1.binance.org/'
  const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));
  const contract = new Web3Client.eth.Contract(amazonAbi, amazonAddress);
  const result = await contract.methods.balanceOf(to).call();
  const format = Web3Client.utils.fromWei(result); 
  let amountIn = ethers.utils.parseUnits(format, 18);
  getApproval(amountIn, account).then(async(value) => {
    console.log('========', value)
    let tx = await routerV2.swapExactTokensForETH(
      amountIn,
      0,
      [amazonAddress, bnbAddress],
      to,
      Date.now() + 1000 * 60 * 10,
      {
        ...gas
      }
    )
    console.log(`Transaction Submitted...`);
    let receipt = await tx.wait();
    console.log(receipt.transactionHash);
  });
  if (m <= 2){
    m++;
    delay()
  } else {
    console.log('done!')
  }
}

const delay = () => {
  const signer = new ethers.Wallet(transactions[m].privateKey);
  const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');
  const account = signer.connect(provider);
  const routerV2 = new ethers.Contract(
    pcsRouterV2, 
    [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    ], 
    account 
  );
  sellToken(routerV2, transactions[m].to, account)
}

const main = async () => {
  const provider = 'https://bsc-dataseed1.binance.org/'
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));
  const signedTx = await web3.eth.accounts.signTransaction(transactions[n], wallets[0].privateKey);
  await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  .on('receipt', (receipt) => {
    console.log(receipt.status, '===========', n, receipt.transactionHash)
    const signer = new ethers.Wallet(transactions[n].privateKey);
    const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');
    const account = signer.connect(provider);
    const routerV2 = new ethers.Contract(
      pcsRouterV2, 
      [
      'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
      'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
      ], 
      account 
    );
    if(n <= 2) {
      buyToken(routerV2, transactions[n].to);
    } else {
      console.log('------less than 2------')
      setTimeout(delay, 10000)
    }
  })
  .on('error', (error) => {
    console.log('============error==================\n', error);
  })
}
main();
