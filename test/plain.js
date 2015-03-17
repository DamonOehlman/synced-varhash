var cuid = require('cuid');
var syncedHash = require('..');
var test = require('tape');
var createMesh = require('./helpers/create-mesh');
var monitor = require('./helpers/monitor');
var mesh;
var hashes;

test('create a 4 way synced mesh', function(t) {
  mesh = createMesh(4, t);
});

test('create the hashes', function(t) {
  t.plan(mesh.length);
  hashes = mesh.map(syncedHash());
  hashes.forEach(function(hash) {
    t.ok(hash);
  });
});

test('add to hash:0 and look for changes in the other hashes', function(t) {
  var id = cuid();
  var data = {
    foo: 'bar',
    items: [1, 2, 3],
    sub: {
      text: 'hello'
    }
  };

  monitor(t, hashes, id, data);
  hashes[0].put(id, data);
});

test('modify the data in hash:1 and look for changes in the other hashes', function(t) {
  var id = Object.keys(hashes[1])[0];
  var data = hashes[1].get(id);

  // update the data
  data.foo = 'baz';

  monitor(t, hashes, id, data);
  hashes[1].put(id, data);
});

test('remove an item from the hash:0 and have the other hashes fall into line', function(t) {
  var id = Object.keys(hashes[0])[0];

  monitor(t, hashes, id);
  hashes[0].delete(id);
});
