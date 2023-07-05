import { parse } from 'qs'
import { allowOrigin, returnError, checkMethod } from './lib'
import { q, client } from './fauna'

const fun = async (body) => {
  const ret = await client.query(
    q.Create(
      q.Collection('works'),
      { data: JSON.parse(body) },
    )
  )
  return ret
}

exports.handler = async ({ httpMethod, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'content-type')
    if (notAllowed) return notAllowed
    
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
