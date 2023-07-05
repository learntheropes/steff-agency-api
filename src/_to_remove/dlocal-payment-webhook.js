import { returnError, checkMethod } from './lib'
import { q, client } from './fauna'
import { mg } from './mailgun'

// http://api.teff.agency/.netlify/functions/dlocal-payment-webhook

exports.handler = async ({ httpMethod, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'content-type')
    if (notAllowed) return notAllowed

    if (httpMethod === 'POST') {
      const data = JSON.parse(body)

      await client.query(
        q.Create(
          q.Collection('payments'),
          { data },
        )
      )

      if (data.status === "PAID") {
        await mg.messages().send({
          from: process.env.MAILGUN_EMAIL,
          to: process.env.ADMIN_EMAIL,
          subject: `New payment for offer ${data.order_id.split('_')[0]}`,
          text: `${body}`
        })
      }
  
      return {
        statusCode : 200,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
