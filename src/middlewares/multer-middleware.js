import multer from "multer";
import crypto from "crypto"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const rawString = file.fieldname + '-' + Date.now()
    const uniqueSuffix = crypto.createHash('md5').update(rawstring).digest('hex')
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })