import NodeCache from "node-cache";

// stdTTL: 30분(1800초), checkperiod: 2시간(7200초)으로 변경
const chatCache = new NodeCache({ stdTTL: 1800, checkperiod: 7200 });

export default chatCache;
