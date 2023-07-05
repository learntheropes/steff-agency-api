import { allowOrigin, returnError, checkMethod } from './lib'
import { payin } from './dlocal'
import { parse } from 'qs'
import filter from 'lodash.filter'
import dotenv from 'dotenv'
dotenv.config()

const fun = async (queryStringParameters) => {
  const query = parse(queryStringParameters)
  const { country } = query
  const { data } = await payin.paymentsMethods.get(country)
  const CARD = filter(data, { type: 'CARD'})
  const TICKET = filter(data, { type: 'TICKET'})
  const BANK_TRANSFER = filter(data, { type: 'BANK_TRANSFER'})
  const response = {}
  if (CARD.length > 0) response['CARD'] =  {ids: CARD, slug: 'CARD'}
  if (TICKET.length > 0) response['TICKET'] = {ids: TICKET, slug: 'TICKET'}
  if (BANK_TRANSFER.length > 0) response['BANK_TRANSFER'] = {ids: BANK_TRANSFER,  slug: 'BANK_TRANSFER'}
  return response
}

exports.handler = async ({ httpMethod, queryStringParameters }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET')
    if (notAllowed) return notAllowed

    const response = await fun(queryStringParameters)
    return {
      statusCode : 200,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({message}) {
    return returnError(message)
  }
}
