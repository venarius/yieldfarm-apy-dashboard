import Web3 from 'web3'

const web3 = new Web3('https://bsc-dataseed1.binance.org:443')

export async function getBalanceForContract (contractAddress: string): Promise<string> {
  const balance = await web3.eth.getBalance(contractAddress)
  return balance
}
