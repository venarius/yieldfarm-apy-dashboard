import { fetchFarms, config } from './fetchFarms'

export async function fetchAPYs (provider: keyof typeof config): Promise<any[]> {
  const out = await fetchFarms(provider)

  return out.filter(o => o.pid !== 0)
}
