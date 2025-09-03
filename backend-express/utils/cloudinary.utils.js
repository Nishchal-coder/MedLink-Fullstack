const { v2: cloudinary } = require('cloudinary')
const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const uploadoncloudinary = async function (avatarlocal) {
  try {
    if (!avatarlocal) {
      console.log('avatar not found')
      return 'error at sending upload on clodunary'
    }

    const uploadlink = await cloudinary.uploader.upload(avatarlocal, { transformation: [{ quality: 'auto', fetch_format: 'auto' }], resource_type: 'auto' })
    console.log('upload lin', uploadlink)
    fs.unlinkSync(avatarlocal)
    return uploadlink
  } catch (error) {
    // attempt to remove the local file only if it exists to avoid throwing from unlinkSync
    try {
      if (avatarlocal && fs.existsSync(avatarlocal)) fs.unlinkSync(avatarlocal)
    } catch (e) {
      // swallow
    }
    return null
  }
}

module.exports = { uploadoncloudinary }