const { PassThrough } = require('stream');
const streamifier = require('streamifier');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

module.exports = function attachImageMinToStream(stream) {
  const bufs = [];
  const rs = new PassThrough();
  stream.on('data', chunk => {
    bufs.push(chunk);
  });
  stream.on('end', async () => {
    const buf = Buffer.concat(bufs);
    const minBuf = await imagemin.buffer(buf, {
      plugins: [imageminJpegtran(), imageminPngquant({ quality: [0.6, 0.7] })]
    });
    const bufStream = streamifier.createReadStream(minBuf);
    bufStream.pipe(rs);
  });
  return rs;
};
