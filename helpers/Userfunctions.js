const {pick} = require('lodash');

const {sign,} = require('jsonwebtoken');

const {SECRET} = require('../config/index.js');

const issueAuthToken = async (jwtPayload) => {
    let token = await sign(jwtPayload, SECRET, {
        expiresIn: 3600*24
    });
    return `Bearer ${token}`;
};

const serializeUser = user => pick(user, [
    'id',
    'email',
    'userName',
    'fullName',
    'type'
]);

module.exports = {issueAuthToken,serializeUser};