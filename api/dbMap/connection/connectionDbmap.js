const ConnectionModel = require("../../models/connectionModel")
const saveConnection = (geo, ip, userAgent, deviceType, appType, sessionid, token, userid) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new ConnectionModel();
        doc.sessionid = sessionid;
        doc.token = token;
        doc.ipAddress = ip;
        doc.userId = userid;
        doc.userAgent = userAgent;
        doc.deviceType = deviceType;
        doc.appType = appType;
        doc.geo = geo
        doc.save(
          function (err, result) {
            if (err) {
              resolve(null)
            }
            else {
              resolve(result)
            }
          }
        );
      } catch (error) {
        reject(error)
      }
    })
  };
module.exports = {
    saveConnection
};