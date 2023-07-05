import { allowOrigin, returnError, checkMethod } from './lib'
import { authorize, unauthorizedResponse } from './lib/auth'
import { q, client } from './fauna'

const fun = async (body) => {
  const data = JSON.parse(body)
  const { id } = data
  const res = await client.query(
    q.Delete(
      q.Ref(q.Collection('staff'), id)
    )
  )
}

exports.handler = async ({ httpMethod, headers, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'authorization')
    if (notAllowed) return notAllowed
    
    const authorized = await authorize(headers)
    if (!authorized) return unauthorizedResponse

    const response = await fun(body)

    return {
      statusCode : 200,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}