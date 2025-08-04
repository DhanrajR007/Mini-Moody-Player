const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  audio: String,
  mood: String,
});

const song = mongoose.model("song", songSchema);

module.exports = song;

/*[Object: null prototype] {
  title: 'test_title',
  artist: 'test_artist',
  mood: 'happy'
}
{
  fieldname: 'audio',
  originalname: 'Ik_Kudi(256k).mp3',
  encoding: '7bit',
  mimetype: 'audio/mpeg',
  buffer: <Buffer 49 44 33 04 00 00 00 00 00 22 54 53 53 45 00 00 00 0e 00 00 03 4c 61 76 66 36 30 2e 33 2e 31 30 30 00 00 00 00 00 00 00 00 00 00 00 ff fb 94 00 00 00 ... 3698298 more bytes>,
  size: 3698348
}
{
  fileId: '688f36205c7cd75eb890c1db',
  name: 'Ik_Kudi_256k__SdRhtzMYb7.mp3',
  size: 3698348,
  versionInfo: { id: '688f36205c7cd75eb890c1db', name: 'Version 1' },
  filePath: '/Ik_Kudi_256k__SdRhtzMYb7.mp3',
  url: 'https://ik.imagekit.io/ftquziwxr/Ik_Kudi_256k__SdRhtzMYb7.mp3',
  audioCodec: 'mp3',
  fileType: 'non-image',
  AITags: null,
  description: null
}
 */
