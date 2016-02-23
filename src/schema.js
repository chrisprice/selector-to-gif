"use strict";

module.exports = {
  url: {
    notEmpty: true,
    isURL: {
      options: [{
        protocols: ['http', 'https']
      }]
    }
  },
  selector: {
    notEmpty: true
  },
  width: {
    notEmpty: true,
    isInt: {
      options: [{
        min: 1
      }]
    }
  },
  height: {
    notEmpty: true,
    isInt: {
      options: [{
        min: 1
      }]
    }
  },
  delay: {
    notEmpty: true,
    isInt: {
      options: [{
        min: 0
      }]
    }
  },
  interval: {
    notEmpty: true,
    isInt: {
      options: [{
        min: 1
      }]
    }
  },
  count: {
    notEmpty: true,
    isInt: {
      options: [{
        min: 1
      }]
    }
  },
  repeat: {
    notEmpty: true,
    isInt: {
      options: [{
        min: -1
      }]
    }
  }
};
