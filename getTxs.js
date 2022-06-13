async function checkTransactionCount(startBlockNumber, endBlockNumber) {
  console.log(
    "Searching for non-zero transaction counts between blocks " +
      startBlockNumber +
      " and " +
      endBlockNumber
  );

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    let block = await web3.eth.getBlock(i);
    if (block != null) {
      if (block.transactions != null && block.transactions.length != 0) {
        console.log(
          "\n\nBlock #" + i + " has " + block.transactions + " transactions"
        );
      }
    }
  }
}


checkTransactionCount();