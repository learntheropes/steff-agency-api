import { parse } from 'qs'
import { allowOrigin, returnError, checkMethod } from './lib'
import { q, client, filterStaff } from './fauna'

const fun = async (queryStringParameters) => {
  const params = parse(queryStringParameters)
  const { slug } = params
  const { data } = await client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('staff_by_slug'), slug),
        { size: 1000 }
      ),
      ref => q.Get(ref)
    )
  )
  return filterStaff(data)
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
  } catch ({ message }) {
    return returnError(message)
  }
}