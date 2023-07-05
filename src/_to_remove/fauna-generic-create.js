import { allowOrigin, returnError, checkMethod } from './lib'
import { authorize, unauthorizedResponse } from './lib/auth'
import { q, client } from './fauna'

exports.handler = async ({ httpMethod, headers, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'content-type, authorization')
    if (notAllowed) return notAllowed
    
    const authorized = await authorize(headers)
    if (!authorized) return unauthorizedResponse

    const { ref, collection, props } = JSON.parse(body)
    let response

    if (ref) {
      response = await client.query(
        q.Create(
          q.Ref(q.Collection(collection), ref),
          { data: props },
        )
      )
    } else {
      response = await client.query(
        q.Create(
          q.Collection(collection),
          { data: props },
        )
      )
      response.data.ref = response.ref.value.id
    }
    return {
      statusCode : 201,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
