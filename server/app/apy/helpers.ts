import BigNumber from 'bignumber.js'

import { BLOCKS_PER_YEAR, POOL_PID, YIELD_PER_BLOCK } from './config'
import { QuoteToken } from '../config/constants/farms'

function roundToTwoDp (number: number): number { return Math.round(number * 100) / 100 }

export function calculateEarnedPerThousandDollars ({ numberOfDays, farmApy, price }: any): number {
  // Everything here is worked out relative to a year, with the asset compounding daily
  const timesCompounded = 365
  //   We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
  const apyAsDecimal = farmApy / 100
  const daysAsDecimalOfYear = numberOfDays / timesCompounded
  //   Calculate the starting balance with a dollar balance of $1000.
  const principal = 1000 / price

  // This is a translation of the typical mathematical compounding APY formula. Details here: https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
  const finalAmount = principal * (1 + apyAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear)

  // To get the earned, deduct the amount after compounding (finalAmount) from the starting balance (principal)
  const interestEarned = finalAmount - principal
  return roundToTwoDp(interestEarned)
}

export function apyModalRoi ({ amountEarned, amountInvested }: any): string {
  const percentage = (amountEarned / amountInvested) * 100
  return percentage.toFixed(2)
}

export function getApyForFarms (farms: any): any[] {
  const PriceVsBNB = new BigNumber(farms.find((fa: any) => fa.pid === POOL_PID)?.tokenPriceVsQuote || 0)

  const price = new BigNumber(farms.find((fa: any) => fa.pid === 1)?.tokenPriceVsQuote || 0)
  const bnbPrice = new BigNumber(farms.find((fa: any) => fa.pid === 2)?.tokenPriceVsQuote || 0)
  const ethPriceUsd = new BigNumber(farms.find((fa: any) => fa.pid === 14)?.tokenPriceVsQuote || 0)

  const basePrice = new BigNumber(1).div(bnbPrice).times(price)

  return farms.map((farm: any) => {
    const rewardPerBlock = YIELD_PER_BLOCK.times(farm.poolWeight)
    const rewardPerYear = rewardPerBlock.times(BLOCKS_PER_YEAR)

    let apy = PriceVsBNB.times(rewardPerYear).div(farm.lpTotalInQuoteToken)

    if (farm.quoteTokenSymbol === QuoteToken.BUSD || farm.quoteTokenSymbol === QuoteToken.UST) {
      apy = PriceVsBNB.times(rewardPerYear).div(farm.lpTotalInQuoteToken).times(bnbPrice)
    } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      apy = price.div(ethPriceUsd).times(rewardPerYear).div(farm.lpTotalInQuoteToken)
    }

    return { ...farm, ...{ apy: apy.times(new BigNumber(100)).toNumber().toLocaleString('en-US').slice(0, -1), basePrice: basePrice } }
  })
}
