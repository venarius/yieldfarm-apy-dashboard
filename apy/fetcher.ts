import { APY } from './models'

export async function fetchAPYs (): Promise<APY[]> {
  const out: APY[] = []

  const res = await fetch('https://spreadsheets.google.com/feeds/list/1LjyKYpILDGv-YCOoBFZNUI184NT1y67khXiqXA3Yhxs/1/public/full?alt=json')
  const dat = await res.json()

  dat.feed.entry.forEach((entry: any) => {
    out.push({
      symbol: entry.gsx$symbol.$t,
      yieldsstart: entry.gsx$yieldsstart.$t,
      datestart: entry.gsx$datestart.$t,
      website: entry.gsx$website.$t,
      tokenaddress: entry.gsx$tokenaddress.$t,
      priceusd: entry.gsx$priceusd.$t,
      marketcapusd: entry.gsx$marketcapusd.$t,
    })
  })

  return out
}
