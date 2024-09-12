"use strict";

module.exports = function preparedata(data, code, message) {
  return {
    status: {
      code: code,
      description: message
    },
    message: message,
    data: data
  };
};