import { Payin } from './payin'


const options = {
  serverUrl: 'https://steff-public.netlify.app',
  credentials: {
    x_login: process.env.DLOCAL_X_LOGIN,
    x_trans_key: process.env.DLOCAL_X_TRANS_KEY,
    secret_key: process.env.DLOCAL_X_SECRET_KEY
  },
  live: false
}

export const payin = new Payin(options)
