# synced-varhash

This is a package that keeps a local
[`observ-varhash`](https://github.com/nrw/observ-varhash) in sync with a
[CRDT Set](https://github.com/dominictarr/crdt#set).


[![NPM](https://nodei.co/npm/synced-varhash.png)](https://nodei.co/npm/synced-varhash/)

[![Build Status](https://img.shields.io/travis/DamonOehlman/synced-varhash.svg?branch=master)](https://travis-ci.org/DamonOehlman/synced-varhash) 

## Why?

This is useful in the case that you have a front-end application written
using [`mercury`](https://github.com/Raynos/mercury) (or similar) and you
want to keep a varhash in sync between a number of entities. The case that
I've used this with is WebRTC and it's pretty awesome :)

## Example Usage

```js
var Doc = require('crdt').Doc;
var SyncedHash = require('synced-varhash');
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

```

## Known Limitations

While `synced-varhash` is capable of serializing nested observables (such
as [`observ-struct`](https://github.com/Raynos/observ-struct)) over a
CRDT, at this stage the deserialized data will be simple JS types on the
receiver ends.  For this reason, it is recommended that only simple
data is serialized at this time.

## License(s)

### ISC

Copyright (c) 2015, Damon Oehlman <damon.oehlman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
