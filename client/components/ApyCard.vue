<template>
  <div class="border bg-white p-4 shadow-lg rounded-lg apy-card" style="border-color: #eaeaea;">
    <div class="flex items-start justify-between">
      <div class="flex items-center">
        <div class="flex items-center justify-center border-2 border-gray-500 rounded-full" style="width:3.5rem;height:3.5rem;">
          <img :src="`https://bscscan.com/${token1Image}`" style="height:32px;width:32px;">
        </div>
        <repeat-icon class="mx-2" />
        <div class="flex items-center justify-center border-2 border-gray-500 rounded-full" style="width:3.5rem;height:3.5rem;">
          <img :src="`https://bscscan.com/${token2Image}`" style="height:32px;width:32px;">
        </div>
      </div>
      <div class="flex items-center">
        <a class="text-lg ml-1 underline" target="_blank" :href="`https://exchange.pancakeswap.finance/#/add/ETH/${apy.address}`">{{ apy.lpSymbol }}</a>
        <a target="_blank" :href="`https://bscscan.com/address/${apy.address}`" class="ml-2"><img src="/img/bscscan.png" class="h-5"></a>
      </div>
    </div>
    <div class="mt-3 flex justify-between">
      <div>
        <div class="flex items-center text-pink-500">
          <p class="font-semibold text-xl">{{ $t('apy') }} {{ apy.apy ? apy.apy : '--' }}%</p>

          <!-- ROI Tippy -->
          <tippy>
            <template v-slot:trigger>
              <info-icon name="myTrigger" size="17" class="ml-1" />
            </template>

            <div class="text-left">
              <p class="underline mb-1">{{ $t('tokenROI') }}</p>
              <table>
                <tbody>
                  <tr>
                    <td>{{ $t('oneDay') }}</td>
                    <td class="px-2">{{ earnedPerThousand1D }}</td>
                    <td>{{ apyModalRoi({ amountEarned: this.earnedPerThousand1D, amountInvested: oneThousandDollarsWorth }) }}%</td>
                  </tr>
                  <tr>
                    <td>{{ $t('sevenDays') }}</td>
                    <td class="px-2">{{ earnedPerThousand7D }}</td>
                    <td>{{ apyModalRoi({ amountEarned: this.earnedPerThousand7D, amountInvested: oneThousandDollarsWorth }) }}%</td>
                  </tr>
                  <tr>
                    <td>{{ $t('thirtyDays') }}</td>
                    <td class="px-2">{{ earnedPerThousand30D }}</td>
                    <td>{{ apyModalRoi({ amountEarned: this.earnedPerThousand30D, amountInvested: oneThousandDollarsWorth }) }}%</td>
                  </tr>
                  <tr>
                    <td>{{ $t('yearDays') }}</td>
                    <td class="px-2">{{ earnedPerThousand365D }}</td>
                    <td>{{ apyModalRoi({ amountEarned: this.earnedPerThousand365D, amountInvested: oneThousandDollarsWorth }) }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </tippy>
          <!-- ROI Tippy END -->
        </div>

        <p>{{ $t('total') }} {{ parseInt(apy.tokenAmount).toFixed(2) }}</p>
        <p>{{ $t('totalInQuote') }} {{ parseInt(apy.quoteTokenAmount).toFixed(2) }}</p>
      </div>

      <!-- Chart -->
      <div>
        <apexchart :key="`chart${apy.pid}`" height="80px" :series="series" :options="chartOptions" />
      </div>
      <!-- Chart END -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { RepeatIcon, InfoIcon } from 'vue-feather-icons'

import { lpSymbolToImage } from '../helpers'
import { calculateEarnedPerThousandDollars, apyModalRoi } from '../apy/helpers'

export default Vue.extend({
  components: {
    RepeatIcon,
    InfoIcon
  },
  props: {
    apy: {
      type: Object,
      required: true,
    } as PropOptions<any>,
    history: {
      type: Array,
      required: true,
    } as PropOptions<any>
  },
  data () {
    return {
      apyModalRoi
    }
  },
  computed: {
    price (): number {
      return this.apy.basePrice
    },
    oneThousandDollarsWorth (): number {
      return 1000 / this.price
    },
    token1Image (): string {
      return lpSymbolToImage(this.apy.lpSymbol, 0)
    },
    token2Image (): string {
      return lpSymbolToImage(this.apy.lpSymbol, 1)
    },
    earnedPerThousand1D (): number { return calculateEarnedPerThousandDollars({ numberOfDays: 1, farmApy: this.apy.apy, price: this.price }) },
    earnedPerThousand7D (): number { return calculateEarnedPerThousandDollars({ numberOfDays: 7, farmApy: this.apy.apy, price: this.price }) },
    earnedPerThousand30D (): number { return calculateEarnedPerThousandDollars({ numberOfDays: 30, farmApy: this.apy.apy, price: this.price }) },
    earnedPerThousand365D (): number { return calculateEarnedPerThousandDollars({ numberOfDays: 365, farmApy: this.apy.apy, price: this.price }) },
    series (): any {
      return [{
        name: 'APY',
        data: this.history.filter((h: any) => h.lp === this.apy.lpSymbol).map((h: any) => h.apy)
      }]
    },
    chartOptions (): any {
      return {
        chart: {
          type: 'area',
          sparkline: {
            enabled: true
          },
        },
        stroke: {
          curve: 'straight'
        },
        fill: {
          opacity: 0.3,
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + "%"
            }
          }
        },
        colors: ['#ed64a6'],
        xaxis: {
          categories: this.history.filter((h: any) => h.lp === this.apy.lpSymbol).map((h: any) => new Date(h.date).toLocaleDateString()),
        }
      }
    }
  }
})
</script>
