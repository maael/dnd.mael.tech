const getConfig = require('next/config').default;
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3ImageMinStream = require('./s3ImageMinStream');

const { serverRuntimeConfig } = getConfig();

const BUCKET = 'dnd-user-map-assets';
const PREFIX = 'map-asset';

aws.config.update(serverRuntimeConfig.aws);

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET,
    acl: 'public-read',
    cacheControl: 'max-age=31536000',
    metadata: function(req, file, cb) {
      cb(null, {
        id: req.params.id,
        fieldName: file.fieldname
      });
    },
    key: function(req, _, cb) {
      cb(null, `${PREFIX}-${req.params.id}`);
    },
    contentType: function(req, file, cb) {
      multerS3.AUTO_CONTENT_TYPE(req, file, function(_, mime, stream) {
        replacementStream = s3ImageMinStream(stream);
        cb(null, mime, replacementStream);
      });
    }
  })
});

function get(_, res) {
  return id => {
    s3.getObject({ Bucket: BUCKET, Key: id })
      .on('httpHeaders', function(headers) {
        res.set('Content-Length', headers['content-length']);
        res.set('Content-Type', headers['content-type']);
        this.response.httpResponse.createUnbufferedStream().pipe(res);
      })
      .send();
  };
}

module.exports = {
  upload,
  get,
  BUCKET,
  PREFIX
};
