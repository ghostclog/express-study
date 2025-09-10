const  NodeMediaServer = require ( "node-media-server" ); 

// Node Media Server에는 구성 매개변수가 필요합니다. 
const config = {}; 

const nms = new  NodeMediaServer (config); 

// run 메서드를 사용하여 미디어 서버를 시작합니다.
 nms.run();

 // https://lemonpie313.tistory.com/239 참고
 // 