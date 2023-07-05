import * as crypto from 'crypto'

const countries = [
  'AR',
  'BR',
  'CL',
  'CO',
  'MX',
  'PE',
  'UY'
]

const currencies = [
  'ARS',
  'BRL',
  'CLP',
  'COP',
  'MXN',
  'PEN',
  'UYU'
]

const getMessage = (config, credentials, nounce) => {
  const stringData = (config.data) ? JSON.stringify(config.data) : ''
  return `${credentials.x_login}${nounce}${stringData}`
}

const getSignature = (credentials, message) => {
  return crypto
    .createHmac('sha256', credentials.secret_key)
    .update(message)
    .digest('hex')
}

const signRequest = (config, credentials) => {
  const nounce = new Date().toISOString()
  config.headers.common['X-Date'] = nounce
  const message = getMessage(config, credentials, nounce)
  const signature = getSignature(credentials, message)
  const authorization = `V2-HMAC-SHA256, Signature: ${signature}`
  config.headers.common.Authorization = authorization
  return config
}

const addUrls = (config, serverUrl) => {
  config.data.callback_url = 'https://steff-public.netlify.app/payments'
  config.data.notification_url = 'https://steff-api.netlify.app/.netlify/functions/dlocal-payment-webhook'
  return config
}

const paymentBuilder = (config) => {
  const index = countries.indexOf(config.data.country)
  config.data.currency = currencies[index]
  config.data.payment_method_flow = 'REDIRECT'
  return config
}

export const interceptors = (config, credentials, serverUrl) => {
  config = (config.method === 'post' && config.url === 'payments')
    ? paymentBuilder(config)
    : config

  config = (config.method === 'post' && config.data.order_id && serverUrl)
    ? addUrls(config, serverUrl)
    : config

  config = signRequest(config, credentials)

  return config
}
