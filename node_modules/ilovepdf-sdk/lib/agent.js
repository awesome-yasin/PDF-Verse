const jwt = require('jsonwebtoken');
const axios = require('axios');
const constants = require('./constants');

module.exports = {
  getAgent (publicId, secretKey) {
    const agent = axios.create({});

    const jwtToken = jwt.sign({
      aud: constants.DEFAULT_ENDPOINT,
      iss: 'node-ilovepdf-sdk',
      jti: publicId,
    },
    secretKey, {
      algorithm: 'HS256',
      expiresIn: '2h'
    });

    agent.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    return agent;
  },
  setBaseURL(agent, url) {
    agent.defaults.baseURL = url;
  }
};

