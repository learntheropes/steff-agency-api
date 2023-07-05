import { mg } from './mailgun'
import {allowOrigin, checkMethod} from './lib'
import dotenv from 'dotenv'
dotenv.config()

exports.handler = async ({ httpMethod, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'content-type')
    if (notAllowed) return notAllowed

    const { firstName, lastName, slug } = JSON.parse(body)
      
    await mg.messages().send({
      from: process.env.MAILGUN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New staff application request from ${firstName} ${lastName}`,
      text: `${slug}`
    })

    return {
      statusCode: 200,
      body: "Email sent successfully",
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Headers': 'content-type'
      }
    }
  } catch ({ message }) {
    return {
      statusCode: 422,
      body: `Error: ${message}`,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Headers': 'content-type'
      }
    }
  }
}