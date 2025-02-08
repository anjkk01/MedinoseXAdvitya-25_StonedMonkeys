const redisClient = require('../Redis.js');

module.exports.authorizeUser = async (socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
      console.log("Bad request!");
      next(new Error("Not authorized"));
    } else {
        next();
    }
  };

  module.exports.initializeUser = async (socket) => {
    socket.user = {...socket.request.session.user};
  }  