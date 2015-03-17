var extend = require('cog/extend');
var unwrap = require('observ-unwrap');
var VarHash = require('observ-varhash');
var xdiff = require('xdiff');

/**
  # synced-varhash

  This is a package that keeps a local
  [`observ-varhash`](https://github.com/nrw/observ-varhash) in sync with a
  [CRDT Set](https://github.com/dominictarr/crdt#set).

  ## Why?

  This is useful in the case that you have a front-end application written
  using [`mercury`](https://github.com/Raynos/mercury) (or similar) and you
  want to keep a varhash in sync between a number of entities. The case that
  I've used this with is WebRTC and it's pretty awesome :)

  ## Known Limitations

  While `synced-varhash` is capable of serializing nested observables (such
  as [`observ-struct`](https://github.com/Raynos/observ-struct)) over a
  CRDT, at this stage the deserialized data will be simple JS types on the
  receiver ends.  For this reason, it is recommended that only simple
  data is serialized at this time.

**/
module.exports = function(opts) {
  var type = (opts || {}).type || 'syncedset'

  // if we have been passed a string value for opts, use that as type
  if (typeof opts == 'string' || (opts instanceof String)) {
    type = opts;
  }

  function createSet(doc) {
    var hash = VarHash();
    var set = doc.createSet('__itemtype', type);
    var omit = require('omit')(['id', '__itemtype']);

    function toId(key) {
      return type + '__:' + key;
    }

    function toKey(id) {
      return id && id.split(':')[1];
    }

    // handle changes in the hash and apply the changes to the crdt correctly
    hash(function(data) {
      Object.keys(data._diff).forEach(function(key) {
        var id = toId(key);
        var existing = set.get(id);
        var removed = !data._diff[key];
        var item = (!removed) && existing && existing.state && omit(existing.state);
        var currentData = unwrap(data[key]);
        var diff = item && currentData && xdiff.diff(item, currentData);

        // handle adds
        if (! (removed || existing)) {
          return doc.add(extend({ id: id, __itemtype: type }, currentData));
        }

        if (diff) {
          return existing.set(xdiff.patch(existing.state, diff));
        }

        if (removed) {
          return doc.rm(id);
        }
      });
    });

    set.on('add', function(row) {
      hash.put(toKey(row.id), omit(row.state));
    });

    // handle crdt set removals
    set.on('remove', function(row) {
      hash.delete(toKey(row.id));
    });

    // handle crdt row changes
    set.on('changes', function(row, changed) {
      var key = toKey(changed.id);
      var data = key && hash.get(key);
      var diff = data && xdiff.diff(unwrap(data), omit(changed));

      if (diff) {
        hash.put(key, xdiff.patch(data, diff));
      }
    });

    return hash;
  }

  return arguments[1] ? createSet(arguments[1]) : createSet;
};
