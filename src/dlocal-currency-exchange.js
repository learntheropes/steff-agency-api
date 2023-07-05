import { allowOrigin, returnError, checkMethod } from './lib'
import { payin } from './dlocal'
import { parse } from 'qs'
import dotenv from 'dotenv'
dotenv.config()

const fun = async (queryStringParameters) => {
  const query = parse(queryStringParameters)
  const { from, to } = query
  let exchangeFrom
  if (from !== 'USD') exchangeFrom = await payin.currencyExchange.get(from)
  const exchangeTo = await payin.currencyExchange.get(to)
  return (exchangeFrom) ? 1 /  exchangeFrom.data.rate *  exchangeTo.data.rate :  exchangeTo.data.rate
}

exports.handler = async ({ httpMethod, queryStringParameters }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET')
    if (notAllowed) return notAllowed

    const rate = await fun(queryStringParameters)

    return {
      statusCode : 200,
      body: JSON.stringify({ rate }),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({message}) {
    return returnError(message)
  }
}
