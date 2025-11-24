import NodeCache from "node-cache";

// stdTTL: a new key will be deleted after 10 minutes (600 seconds)
// checkperiod: checks for expired keys are performed every 2 minutes (120 seconds)
const chatCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export default chatCache;
