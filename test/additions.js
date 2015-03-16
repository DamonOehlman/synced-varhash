var syncedHash = require('..');
var test = require('tape');
var createMesh = require('./helpers/create-mesh');
var mesh;
var hashes;

test('create a 4 way synced mesh', function(t) {
  mesh = createMesh(4, t);
});

test('create the hashes', function(t) {
  t.plan(mesh.length);
  hashes = mesh.map(syncedHash('test'));
  hashes.forEach(function(hash) {
    t.ok(hash);
  });
});
