import { allowOrigin, returnError, checkMethod } from './lib'
import { authorize, unauthorizedResponse } from './lib/auth'
import { q, client } from './fauna'

const fun = async (body) => {
  const ret = await client.query(
    q.Create(
      q.Collection('offers'),
      { data: JSON.parse(body) },
    )
  )
  return ret
}

exports.handler = async ({ httpMethod, headers, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'content-type, authorization')
    if (notAllowed) return notAllowed
    
    const authorized = await authorize(headers)
    if (!authorized) return unauthorizedResponse

    const ret = await fun(body)

    return {
      statusCode : 201,
      body: JSON.stringify({ ret }),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}