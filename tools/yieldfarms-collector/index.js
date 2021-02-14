const fetch = require('node-fetch')

const out = []

fetch('https://spreadsheets.google.com/feeds/list/1LjyKYpILDGv-YCOoBFZNUI184NT1y67khXiqXA3Yhxs/1/public/full?alt=json')
  .then(resp => resp.json())
  .then((resp) => {
    resp.feed.entry.forEach((entry) => {
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

    console.log(out)
  })