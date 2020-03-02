const { post } = require('request');
const { MERCHANT_ACCOUNT } = require('../utils/config');
const getPostParameters = require('../utils/getPostParameters');
const handleCallback = require('../utils/handleCallback');

module.exports = (res, request) => {
    
    let originDomains
    // WARNING: Have better logic here @Gaurav
    if (request.headers.host.includes('localhost')) {
    	originDomains = [`${request.protocol}://${request.headers.host}`];
    } else {
    	originDomains = [`https://${request.headers.host}`];
    }

    const params = getPostParameters('originKeys', { originDomains });

    post(params, (err, response, body) => handleCallback({ err, response, body }, res));
};
