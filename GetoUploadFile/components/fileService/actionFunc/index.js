// const moudlesContext = require.context('./func', false, /\.js$/)
// const moudlesObject = Array.prototype.reduce.call(moudlesContext.keys() || [], function(source, key) {
//   const keyName = String.prototype.match.call(key, /\.\/(.*)\.js$/)
//   const moudle = moudlesContext(key).default || moudlesContext(key)
//   return {...source, [keyName[1]]: moudle}
// }, {})
// export default moudlesObject
import HuaweiCloud from "./func/huaweicloud.js";
export default {
  huaweicloud: HuaweiCloud
};
