import NodeMediaServer from "node-media-server"; 

const config = {
    rtmp:{
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http:{
        port: 8000,
        allow_origin: "*",
        mediaroot: "./media"
    },
    trans: {
        ffmpeg: '/usr/bin/ffmpeg',
        tasks: [
          {
            app: 'live',
            hls: true,
            dash: true
          }
        ]
    }
};



// 'mediaroot' 속성이 http 설정에 필요하므로 추가합니다.

const nms = new NodeMediaServer(config);

nms.run();

// https://lemonpie313.tistory.com/239 참고
 // https://hippalus.tistory.com/658 참고

 // 참고 : https://github.com/illuspas/Node-Media-Server