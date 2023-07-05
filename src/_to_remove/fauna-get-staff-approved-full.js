import { allowOrigin, returnError, checkMethod } from './lib'
import { authorize, unauthorizedResponse } from './lib/auth'
import { q, client } from './fauna'

const fun = async () => {
  const { data } = await client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('approved_staff'), true),
        { size: 1000 }
      ),
      ref => q.Get(ref)
    )
  )
  return data.map(({ data, ref: { value: { id }} }) => {
    data.id = id
    return data
  })
}

exports.handler = async ({ httpMethod, headers }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed
    
    const authorized = await authorize(headers)
    if (!authorized) return unauthorizedResponse

    const response = await fun()

    return {
      statusCode : 200,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}