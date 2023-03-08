const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|svg|webbp)$/)) {
      return cb(new Error(req.t('upload_error')));
    }

    cb(undefined, true);
  },
});

module.exports = upload;
