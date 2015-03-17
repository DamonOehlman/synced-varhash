var cuid = require('cuid');
var syncedHash = require('..');
var test = require('tape');
var createMesh = require('./helpers/create-mesh');
var monitor = require('./helpers/monitor');
var times = require('whisk/times');
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

test('populate hash:0 with 5 entries and look for the rest to catch up', function(t) {
  var testItems = times(5).map(function() {
    return {
      value: Math.floor(Math.random() * 1000)
    };
  });

  var stoppers = hashes.map(function(hash, idx) {
    return hash(function(data) {
      if (Object.keys(data).length === testItems.length) {
        t.deepEqual(data, hashes[0](), 'hash ' + idx + ' data matches expected');
        stoppers[idx]();
      }
    });
  });

  // set the values of hash:0
  t.plan(hashes.length);
  testItems.forEach(function(data) {
    hashes[0].put(cuid(), data);
  });
});

test('empty hash:0 and look for the rest to also empty', function(t) {
  var stoppers = hashes.map(function(hash, idx) {
    return hash(function(data) {
      if (Object.keys(data).length === 0) {
        t.deepEqual(data, hashes[0](), 'hash ' + idx + ' empty');
        stoppers[idx]();
      }
    });
  });

  // set the values of hash:0
  t.plan(hashes.length);
  Object.keys(hashes[0]).forEach(function(key) {
    hashes[0].delete(key);
  });
});
