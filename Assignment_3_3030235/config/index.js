const { JWT_SECRET = 'some-secret-key' } = process.env;

const SALT_ROUND = 8;

const sampleUrl = /^https?:\/\/(www.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\da-z\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*)*\#?/;

module.exports = { JWT_SECRET, sampleUrl, SALT_ROUND };
