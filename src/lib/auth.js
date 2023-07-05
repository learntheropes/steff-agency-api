import axios from 'axios'
require('dotenv').config()
import { allowOrigin } from './index'

export const authorize = async (headers) => {
  try {
    if (!headers) return false
    const { authorization } = headers
    if (!authorization) return false
    const access_token = authorization.split(' ')[1]
    if (!access_token) return false
    const { data } = await axios.get('https://oauth2.googleapis.com/tokeninfo', {
      params: { access_token }
    })
    const { azp, aud, email, email_verified } = data 
    return azp === process.env.GOOGLE_CLIENTID
    && aud === process.env.GOOGLE_CLIENTID
    && process.env.AUTHORIZED_EMAILS.split(',').indexOf(email) > -1
    && email_verified === 'true'
  } catch (error) {
    return false
  }
}

export const unauthorizedResponse = {
  statusCode: 401,
  body: 'Unauthorized',
  headers: {
    'Access-Control-Allow-Origin': allowOrigin,
  }
}
