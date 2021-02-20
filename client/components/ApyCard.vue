<template>
  <div class="border bg-white p-4 shadow-lg rounded-lg apy-card hover:shadow-2xl transition duration-200" style="border-color: #eaeaea;">

    <!-- Calculator Modal -->
    <sweet-modal ref="calculatorModal" title="ROI Calculator">
      <div class="flex flex-col md:flex-row">
        <div class="flex-1">
          <p>{{ $t('calcInvestment') }}</p>
          <input v-model="calculatorInvestment" type="number" aria-label="calculatorInvestment" class="p-1 rounded bg-gray-300 text-gray-900 w-full" />
        </div>
        <div class="flex-1 mt-2 md:mt-0 md:ml-3">
          <p>{{ $t('calcDuration') }}</p>
          <input v-model="calculatorDuration" type="number" aria-label="calculatorDuration" class="p-1 rounded bg-gray-300 text-gray-900 w-full" />
        </div>
      </div>
      <p class="mt-3 text-2xl text-right font-bold">{{ $t('calcReturn') }} <span class="text-pink-500">~{{ estReturnCalculator }} {{ apy.earnSymbol }}</span></p>
    </sweet-modal>
    <!-- Calculator Modal END -->

    <div>
      <div class="flex items-start justify-between">
        <div class="flex items-center">
          <div class="flex items-center justify-center border-2 border-gray-500 rounded-full" style="width:3.5rem;height:3.5rem;">
            <img alt="Token Image" :src="`https://bscscan.com/${token1Image}`" style="height:32px;width:32px;">
          </div>
          <repeat-icon class="mx-2" />
          <div class="flex items-center justify-center border-2 border-gray-500 rounded-full" style="width:3.5rem;height:3.5rem;">
            <img alt="Token Image" :src="`https://bscscan.com/${token2Image}`" style="height:32px;width:32px;">
          </div>
        </div>
        <div class="cursor-pointer" @click="favorite()">
          <i v-if="isFavorite" class="fas fa-star fa-lg text-yellow-500"></i>
          <i v-else class="far fa-star fa-lg text-gray-600"></i>
        </div>
      </div>
      <div class="flex items-center mt-2">
        <a class="text-xl ml-1 underline" target="_blank" :href="`https://exchange.pancakeswap.finance/#/add/ETH/${apy.address}`">{{ apy.lpSymbol }}</a>
        <a target="_blank" :href="`https://bscscan.com/address/${apy.address}`" class="ml-2"><img alt="bscscan.com logo" src="/img/bscscan.png" class="h-5"></a>
      </div>
    </div>
    <div class="mt-2">
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

          <i class="fas fa-calculator ml-1 cursor-pointer" @click="$refs.calculatorModal.open()"></i>
        </div>

        <p>{{ $t('earn') }} {{ apy.earnSymbol }}</p>
        <p>{{ $t('total') }} {{ parseInt(apy.tokenAmount).toFixed(2) }} {{ token1 }}</p>
        <p>{{ $t('totalInQuote') }} {{ parseInt(apy.quoteTokenAmount).toFixed(2) }} {{ token1 }}</p>
      </div>

      <!-- Chart -->
      <div class="mt-2">
        <apexchart v-if="localHistory.length > 0" :key="`chart${apy.pid}`" height="80px" :series="series" :options="chartOptions" />
      </div>
      <!-- Chart END -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { RepeatIcon, InfoIcon, StarIcon } from 'vue-feather-icons'

// @ts-ignore
import { SweetModal } from 'sweet-modal-vue'

import { lpSymbolToImage } from '../helpers'
import { calculateEarnedPerThousandDollars, apyModalRoi } from '../apy/helpers'

export default Vue.extend({
  components: {
    RepeatIcon,
    InfoIcon,
    StarIcon,
    SweetModal
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
      apyModalRoi,
      localHistory: [],
      calculatorInvestment: 1000,
      calculatorDuration: 7
    }
  },
  mounted () {
    // Get newest 30 history entries
    this.localHistory = this.history.map((h: any) => { return { ...h, ...{ date: new Date(h.date).getTime() } } }).sort((a: any, b: any) => a.date.toString().localeCompare(b.date.toString())).slice(0, 30)
  },
  computed: {
    price (): number {
      return this.apy.basePrice
    },
    oneThousandDollarsWorth (): number {
      return 1000 / this.price
    },
    token1 (): string { return this.apy.lpSymbol.split('-')[0] },
    token2 (): string { return this.apy.lpSymbol.split('-')[1].split(' ')[0] },
    token1Image (): string {
      return lpSymbolToImage(this.apy.lpSymbol, 0)
    },
    token2Image (): string {
      return lpSymbolToImage(this.apy.lpSymbol, 1)
    },
    selectedProvider (): string {
      return this.$store.state.apy.selectedProvider
    },
    isFavorite (): boolean {
      return this.$store.state.apy.favorites.includes(`${this.selectedProvider}:${this.apy.pid}`)
    },
    estReturnCalculator (): string {
      const calc = calculateEarnedPerThousandDollars({ numberOfDays: this.calculatorDuration, farmApy: this.apy.apy, price: this.price })
      return apyModalRoi({ amountEarned: calc, amountInvested: this.calculatorInvestment / this.price })
    },
    earnedPerThousand1D (): number { return calculateEarnedPerThousandDollars({ numberOfDays: 1, farmApy: this.apy.apy, price: this.price }) },
    earnedPerThousand7D (): number { return calculateEarnedPerThousandDollars({ numberOfDays: 7, farmApy: this.apy.apy, price: this.price }) },
    earnedPerThousand30D (): number { return calculateEarnedPerThousandDollars({ numberOfDays: 30, farmApy: this.apy.apy, price: this.price }) },
    earnedPerThousand365D (): number { return calculateEarnedPerThousandDollars({ numberOfDays: 365, farmApy: this.apy.apy, price: this.price }) },
    series (): any {
      return [{
        name: 'APY',
        data: this.localHistory.map((h: any) => h.apy)
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
          categories: this.localHistory.map((h: any) => new Date(h.date).toLocaleDateString()),
        }
      }
    }
  },
  methods: {
    favorite () {
      this.$store.commit('apy/favorite', `${this.$store.state.apy.selectedProvider}:${this.apy.pid}`)
    }
  }
})
</script>
