import { parse } from 'qs'
import { allowOrigin, returnError, checkMethod } from './lib'
import { q, client } from './fauna'

const fun = async (queryStringParameters) => {
  const query = parse(queryStringParameters)
  const { ref } = query
  return client.query(
    q.Get(q.Ref(q.Collection('offers'), ref))
  )
}

exports.handler = async ({ httpMethod, queryStringParameters }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed
        
    const { data } = await fun(queryStringParameters)

    return {
      statusCode : 200,
      body: JSON.stringify({offer: data}),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}