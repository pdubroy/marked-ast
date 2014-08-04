// The presence of this file allows us to seamlessly use the modified version
// of marked in the original marked test suite (chjj-marked-tests/).
// It should simply export the modified version of marked.
module.exports = require('../../')._marked;
