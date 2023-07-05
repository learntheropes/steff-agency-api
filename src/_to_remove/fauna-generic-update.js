import { allowOrigin, returnError, checkMethod } from './lib'
import { authorize, unauthorizedResponse } from './lib/auth'
import { q, client } from './fauna'

const fun = async (body) => {
  const data = JSON.parse(body)
  return client.query(
    q.Update(
      q.Ref(q.Collection('staff'), data.id),
      { data },
    )
  )
}

exports.handler = async ({ httpMethod, headers, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'content-type, authorization')
    if (notAllowed) return notAllowed
    
    const authorized = await authorize(headers)
    if (!authorized) return unauthorizedResponse

    const { ref, collection, props } = JSON.parse(body)
    const response = await client.query(
      q.Update(
        q.Ref(q.Collection(collection), ref),
        { data: props },
      )
    )

    return {
      statusCode : 201,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
