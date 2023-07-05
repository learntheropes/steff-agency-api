import { allowOrigin, returnError, checkMethod } from './lib'
import { payin } from './dlocal'
import dotenv from 'dotenv'
dotenv.config()

exports.handler = async ({ httpMethod, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'content-type')
    if (notAllowed) return notAllowed

    const { status, data } = await payin.payments.create(JSON.parse(body))

    return {
      statusCode : status,
      body: JSON.stringify(data),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  
  } catch (error) {
    console.log(error)
  }
}
