import faunadb from 'faunadb'
import dotenv from 'dotenv'
dotenv.config()

const secret = process.env.FAUNADB_SECRETKEY
export const q = faunadb.query
export const client = new faunadb.Client({ secret })

export const filterStaff = (data) => {
  return data
  .map(({ data }) => { // , ref: { value: { id }}
    const {
      slug, gender, firstName, birthDate, nationality, height, measureOne, measureTwo, measureThree, shirt, pants, shoes,
      en, es, pt, it, fr, ru, cn, de, jp, officeWord, officeExcel, gsuiteDocs, gsuiteSheets, sectors, cover, media
    } = data

    return {
      slug, gender, firstName, birthDate, nationality, height, measureOne, measureTwo, measureThree, shirt, pants, shoes,
      en, es, pt, it, fr, ru, cn, de, jp, officeWord, officeExcel, gsuiteDocs, gsuiteSheets, sectors: sectors || [], cover, media: media || []
    }
  })
}