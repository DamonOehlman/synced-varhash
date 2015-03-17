var xdiff = require('xdiff');
var unwrap = require('observ-unwrap');

module.exports = function(t, hashes, id, expected, timeout) {
  t.plan(hashes.length);

  hashes.forEach(function(hash) {
    var timer = setTimeout(function() {
      console.warn(id + ' data mismatch: ', unwrap(hash.get(id)), unwrap(expected));
      t.fail('item ' + id + ' has not stabilised with expected data');
    }, timeout || 1000);

    var stop = hash(function(data) {
      if (expected === undefined === data[id]) {
        t.pass('item ' + id + ' has been deleted as expected');
        clearTimeout(timer);
        stop();
      }
      else if (! xdiff.diff(unwrap(data[id]), unwrap(expected))) {
        t.pass('item ' + id + ' has stabilised with expected data');
        clearTimeout(timer);
        stop();
      }
    });
  });
};
