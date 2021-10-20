const dbserver = require('../dao/dbserver')

exports.tokenDelete = function (req, res) {
  const user_id = req.id;
  
  dbserver.deleteToken(user_id, res);
};