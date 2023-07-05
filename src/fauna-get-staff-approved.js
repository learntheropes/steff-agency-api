import { allowOrigin, returnError, checkMethod } from './lib'
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
  return data.map(({ data: { firstName, slug, cover }}) => {
    return { firstName, slug, cover }
  })
}

exports.handler = async ({ httpMethod }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET')
    if (notAllowed) return notAllowed

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