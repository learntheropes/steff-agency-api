import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
import { checkMethod, returnError } from './lib'

const fun = async (body) => {
  const { status, data } = await axios.post('https://api.cloudinary.com/v1_1/abasto/image/upload/', body)
  return { status, data } 
}

exports.handler = async ({ httpMethod, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST')
    if (notAllowed) return notAllowed

    const { status, data } = await fun(body)

    return {
      statusCode : status,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin': process.env.URL || 'http://localhost:3000'
      }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}