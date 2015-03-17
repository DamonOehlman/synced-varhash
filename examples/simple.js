var Doc = require('crdt').Doc;
var SyncedHash = require('..');
var cuid = require('cuid');

// create two documents
var docs = [new Doc(), new Doc()];

// create the hashes
var hashes = docs.map(SyncedHash());

// create the replication streams
var streams = docs.map(function(doc) {
  return doc.createStream();
});

// replicate between doc:0 and doc:1
streams[0].pipe(streams[1]).pipe(streams[0]);

// watch hash:1 for changes
hashes[1](function(data) {
  console.log('hash:1 changed: ', data);
});

// add some docs to hash:0
setInterval(function() {
  hashes[0].put(cuid(), { tick: Date.now() });
}, 1000);
