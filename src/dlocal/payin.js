import { Dlocal } from './dlocal'
import { interceptors } from './interceptors'

export class Payin extends Dlocal {
  constructor ({ serverUrl, credentials, live }) {
    super({ serverUrl, credentials, live })
    this._instance = this._axios.create()
    this._instance.defaults.headers.common['X-Version'] = '2.1'
    this._instance.interceptors.request.use((config) => {
      return interceptors(config, credentials, serverUrl)
    })

    this.currencyExchange = {

      get: async (to) => {
        return this._instance.get('currency-exchanges', {
          params: { from: 'USD', to }
        })
      }
    }

    this.paymentsMethods = {

      get: async (country) => {
        return this._instance.get('payments-methods', {
          params: { country }
        })
      }
    }

    this.refunds = {

      get: async (id) => {
        return this._instance.get(`refunds/${id}`)
      },

      status: async (id) => {
        return this._instance.get(`refunds/${id}/status`)
      },

      create: async (data) => {
        return this._instance.post('refunds', data)
      }
    }

    this.chargebacks = {

      get: async (id) => {
        return this._instance.get(`chargebacks/${id}`)
      },

      status: async (id) => {
        return this._instance.get(`chargebacks/${id}/status`)
      },

      simulate: async (data) => {
        return (!this.live)
          ? this._instance.post('sandbox-tools/chargebacks', data)
          : undefined
      }
    }

    this.payments = {

      get: async (id) => {
        return this._instance.get(`payments/${id}`)
      },

      status: async (id) => {
        return this._instance.get(`payments/${id}/status`)
      },

      create: async (data) => {
        return this._instance.post('payments', data)
      }
    }
  }
}