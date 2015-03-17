var xdiff = require('xdiff');

module.exports = function(t, hashes, id, expected, timeout) {
  t.plan(hashes.length);

  hashes.forEach(function(hash) {
    var timer = setTimeout(function() {
      console.warn(id + ' data mismatch: ', hash.get(id), expected);
      t.fail('item ' + id + ' has not stabilised with expected data');
    }, timeout || 1000);

    var stop = hash(function(data) {
      if (! xdiff.diff(data[id], expected)) {
        t.pass('item ' + id + ' has stabilised with expected data');
        clearTimeout(timer);
        stop();
      }
    });
  });
};
