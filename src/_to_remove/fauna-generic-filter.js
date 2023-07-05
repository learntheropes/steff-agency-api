import { allowOrigin, returnError, checkMethod } from './lib'
import { authorize, unauthorizedResponse } from './lib/auth'
import { q, client } from './fauna'
import { parse } from 'qs'

exports.handler = async ({ httpMethod, headers, queryStringParameters }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed
    
    const authorized = await authorize(headers)
    if (!authorized) return unauthorizedResponse

    let { index, value } = parse(queryStringParameters)

    if (value === 'true') value = true
    if (value === 'false') value = false

    const { data } = await client.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index(index), value),
          { size: 1000 }
        ),
        ref => q.Get(ref)
      )
    )
    const response = data.map(({ data, ref: { value: { id }} }) => {
      data.id = id
      return data
    })

    return {
      statusCode : 200,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}