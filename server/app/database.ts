import { Sequelize, Model, DataTypes } from 'sequelize'

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

export function saveApy ({ lpSymbol, apy }: any) {
  if (!apy || !lpSymbol) { return }

  Apy.create({
    lp: lpSymbol,
    date: new Date(),
    apy
  })
}

export async function getApys () {
  return await Apy.findAll()
}
