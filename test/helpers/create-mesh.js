var times = require('whisk/times');
var not = require('whisk/not');
var Doc = require('crdt').Doc;

module.exports = function(count, t) {
  var mesh;

  t.plan(count);
  mesh = times(count).map(function(val, idx) {
    return new Doc();
  });

  // synchronize the mesh with all other members other than itself
  mesh.forEach(function(source, idx) {
    var targets = mesh.filter(not(source));

    targets.forEach(function(target) {
      var stream = source.createStream();
      stream.pipe(target.createStream()).pipe(stream);
    });

    t.pass('doc ' + idx + ' replication stream created');
  });

  return mesh;
};
