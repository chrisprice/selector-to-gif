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
        min: process.env.MIN_WIDTH || 1,
        max: process.env.MAX_WIDTH || 1024
      }]
    }
  },
  height: {
    notEmpty: true,
    isInt: {
      options: [{
        min: process.env.MIN_HEIGHT || 1,
        max: process.env.MAX_HEIGHT || 768
      }]
    }
  },
  interval: {
    notEmpty: true,
    isInt: {
      options: [{
        min: process.env.MIN_INTERVAL || 16,
        max: process.env.MAX_INTERVAL || 1000
      }]
    }
  },
  count: {
    notEmpty: true,
    isInt: {
      options: [{
        min: process.env.MIN_COUNT || 1,
        max: process.env.MAX_COUNT || 50
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
