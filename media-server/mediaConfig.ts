const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: { port: 1935 },
  http: { port: 8000, allow_origin: '*' },
  trans: { ffmpeg: '/usr/bin/ffmpeg', tasks: [{ app: 'live', hls: true }] }
};

const nms = new NodeMediaServer(config);
nms.run();
