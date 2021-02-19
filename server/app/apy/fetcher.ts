import { fetchFarms } from './fetchFarms'

export async function fetchAPYs (): Promise<any[]> {
  const out = await fetchFarms()

  return out.filter(o => o.pid !== 0)
}
