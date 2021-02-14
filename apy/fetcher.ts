import { APY } from './models'
import { getBalanceForContract } from './web3'

export async function fetchAPYs (): Promise<APY[]> {
  const out: APY[] = []

  const res = await fetch('https://spreadsheets.google.com/feeds/list/1LjyKYpILDGv-YCOoBFZNUI184NT1y67khXiqXA3Yhxs/1/public/full?alt=json')
  const dat = await res.json()

  dat.feed.entry.forEach(async (entry: any) => {
    out.push({
      symbol: entry.gsx$symbol.$t,
      yieldsstart: entry.gsx$yieldsstart.$t,
      datestart: entry.gsx$datestart.$t,
      website: entry.gsx$website.$t,
      tokenaddress: entry.gsx$tokenaddress.$t,
      priceusd: entry.gsx$priceusd.$t,
      marketcapusd: entry.gsx$marketcapusd.$t,
      title: entry.title.$t,
      imagelink: entry.gsx$imagelink.$t,
      balance: await getBalanceForContract(entry.gsx$tokenaddress.$t)
    })
  })

  return out
}
