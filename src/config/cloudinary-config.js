const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dsgsdgpv2',
  api_key: '288961968355156',
  api_secret: 'gzWNK_iF_lcRUQXciTo8EHw32cI',
  timeout: 120000
});

module.exports = cloudinary;
