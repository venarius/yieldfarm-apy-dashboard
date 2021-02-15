import Web3 from 'web3'
import { Interface } from '@ethersproject/abi'
import { AbiItem } from 'web3-utils'

import MultiCallAbi from '../config/abi/Multicall'
import { Call } from './models'

const web3 = new Web3('https://bsc-dataseed1.binance.org:443')

export async function getBalanceForContract (contractAddress: string): Promise<string> {
  const balance = await web3.eth.getBalance(contractAddress)
  return balance
}

export async function multicall (abi: any[], calls: Call[]): Promise<any> {
  const multi = new web3.eth.Contract((MultiCallAbi as unknown) as AbiItem, '0x1ee38d535d541c55c9dae27b12edf090c608e6fb')
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData } = await multi.methods.aggregate(calldata).call()
  const res = returnData.map((call: any, i: any) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}
