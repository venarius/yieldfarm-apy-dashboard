import BigNumber from 'bignumber.js'

import erc20 from '../config/abi/erc20'
import masterchefABI from '../config/abi/masterchef'
import { multicall } from './web3'
import { pancake, dankswap, kiwifinance } from '../config/constants/farms'
import { getApyForFarms } from './helpers'

function getAddress(address: any) {
  return address[56]
}

export const config = {
  'pancake': {
    farms: pancake,
    masterChef: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    yieldPerBlock: new BigNumber(40)
  },
  'dankswap': {
    farms: dankswap,
    masterChef: '0x4923de3EE2c525F3A6086B90d78630F8D9634223',
    yieldPerBlock: new BigNumber(2.1)
  },
  'kiwifinance': {
    farms: kiwifinance,
    masterChef: '0x2fE9263BF105095e16167C093C4d28140e936E1b',
    yieldPerBlock: new BigNumber(0.020)
  }
}

export async function fetchFarms (provider: keyof typeof config) {
  const data = await Promise.all(
    // @ts-ignore
    config[provider].farms.map(async (farmConfig: any) => {
      const lpAdress = getAddress(farmConfig.lpAddresses)
      const calls = [
        // Balance of token in the LP contract
        {
          address: getAddress(farmConfig.tokenAddresses),
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteTokenAdresses),
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAdress,
          name: 'balanceOf',
          params: [config[provider].masterChef],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: getAddress(farmConfig.tokenAddresses),
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteTokenAdresses),
          name: 'decimals',
        },
      ]

      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls)

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(18))
        .times(new BigNumber(2))
        .times(lpTokenRatio)

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
      const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(lpTokenRatio)

      const [info, totalAllocPoint] = await multicall(masterchefABI, [
        {
          address: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
          name: 'totalAllocPoint',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        address: getAddress(farmConfig.tokenAddresses)
      }
    }),
  )

  return getApyForFarms(data, config[provider].yieldPerBlock)
}