import { Sequelize, Model, DataTypes } from 'sequelize'

import { apyModalRoi, calculateEarnedPerThousandDollars } from './apy/helpers'

const sequelize = new Sequelize('sqlite:./database.db', { logging: false })

class Apy extends Model {}
Apy.init({
  lp: DataTypes.STRING,
  date: DataTypes.DATE,
  apy: DataTypes.NUMBER
}, { sequelize, modelName: 'apys' })

export async function startDatabase () {
  await sequelize.sync()
}

export function saveApy ({ lpSymbol, apy, basePrice }: any, key: string) {
  if (!apy || !lpSymbol) { return }

  const oneThousandDollarsWorth = 1000 / basePrice
  const earnedPerThousand365D = calculateEarnedPerThousandDollars({ numberOfDays: 365, farmApy: apy, price: basePrice })
  apy = apyModalRoi({ amountEarned: earnedPerThousand365D, amountInvested: oneThousandDollarsWorth })

  Apy.create({
    lp: `${key}:${lpSymbol}`,
    date: new Date(),
    apy
  })
}

export async function getApys () {
  return await Apy.findAll()
}
