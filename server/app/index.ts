import Koa from 'koa'
import Router from 'koa-router'
import cors from '@koa/cors'

import  { startDatabase, getApys, saveApy } from './database'
import { fetchAPYs } from './apy/fetcher'

async function start () {
  await startDatabase()

  // do fetching
  setInterval(async () => {
    const apys = await fetchAPYs()

    apys.forEach((apy) => {
      saveApy(apy)
    })
  }, 60_000)

  const app = new Koa()
  const router = new Router()

  router.get('/history', async (ctx) => {
    ctx.body = { history: await getApys() }
  })

  app
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8080)

  console.log('server listening on ::8080')
}

start()
