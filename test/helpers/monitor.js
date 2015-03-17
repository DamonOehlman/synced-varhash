var xdiff = require('xdiff');

module.exports = function(t, hashes, id, expected) {
  t.plan(hashes.length);

  hashes.forEach(function(hash) {
    var stop = hash(function(data) {
      if (! xdiff.diff(data[id], expected)) {
        t.pass('item ' + id + ' has stabilised with expected data');
        stop();
      }
    });
  });
};
