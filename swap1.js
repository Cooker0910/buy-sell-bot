const ethers = require('ethers');
const Web3 = require('web3');
const wallets = require('./wallets')
const amazonAbi = require('./amazon.json')

const {JsonRpcProvider} = require("@ethersproject/providers");
const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');
const signer = new ethers.Wallet('');
const account = signer.connect(provider);
const pcsRouterV2 = '0x10ED43C718714eb63d5aA57B78B54704E256024E'

const routerV2 = new ethers.Contract(
  pcsRouterV2, 
  [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  ], 
  account 
);

const bnbAddress = Web3.utils.toChecksumAddress('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
const amazonAddress = Web3.utils.toChecksumAddress('0x3c18F6C2aff81a6489327DA5b0d4FB5ed5695801'); 
const to = '0x6acF908B75713d38E7Fabc9DB309721CEF12A603'
const gas = {
  gasPrice: ethers.utils.parseUnits('5', 'gwei'),
  gasLimit: 1000000
}

const buyToken = async () => {
  try {
    const ETHAmount = ethers.utils.parseEther('0.00001').toHexString();
    const tx = await routerV2.swapExactETHForTokens(
      0, // Degen ape don't give a fuxk about slippage
      [bnbAddress, amazonAddress],
      to,
      Math.floor(Date.now() / 1000) + 60 * 20, // 10 minutes from now
      {
        value: ETHAmount,
        ...gas
      }
    );
    console.log(`Swapping WETH for tokens...`);
    const receipt = await tx.wait();
    console.log(`Transaction hash: ${receipt.transactionHash}`);
  } catch (error) {
    console.log('================', error)
  }
}

const getApproval = async (approvalAmount)  => {
  console.log(`getting approval`);
  let contract = new ethers.Contract(amazonAddress, amazonAbi, account);
  console.log(11);
  let approveResponse = await contract.approve(
    pcsRouterV2, 
    ethers.utils.parseUnits(approvalAmount.toString(), 18),
    {
      ...gas
    });
  return approveResponse
}

const sellToken = async() => {
  const provider = 'https://bsc-dataseed1.binance.org/'
  const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));
  const contract = new Web3Client.eth.Contract(amazonAbi, amazonAddress);
  const result = await contract.methods.balanceOf('0x6acF908B75713d38E7Fabc9DB309721CEF12A603').call();
  const format = Web3Client.utils.fromWei(result); 
  let amountIn = ethers.utils.parseUnits(format, 18);
  getApproval(amountIn).then(async(value) => {
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
    console.log(receipt);
  });
}

const main = async() => {
  // await buyToken();
  await sellToken();
}

main();