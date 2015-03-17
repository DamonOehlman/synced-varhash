var extend = require('cog/extend');
var VarHash = require('observ-varhash');
var xdiff = require('xdiff');

module.exports = function(type) {
  function createSet(doc) {
    var hash = VarHash();
    var set = doc.createSet('itemtype', type);
    var omit = require('omit')(['id', 'itemtype']);

    function toId(key) {
      return type + ':' + key;
    }

    function toKey(id) {
      return id.split(':')[1];
    }

    // handle changes in the hash and apply the changes to the crdt correctly
    hash(function(data) {
      Object.keys(data._diff).forEach(function(key) {
        var id = toId(key);
        var existing = set.get(id);
        var item = existing && existing.state && omit(existing.state);
        var diff = item && xdiff.diff(item, data[key]);

        if (! existing) {
          doc.add(extend({ id: id, itemtype: type }, data[key]));
        }
        else if (diff) {
          console.log('got diff: ', diff);
        }
      });
    });

    // handle crdt set additions
    set.on('add', function(row) {
      var key = toKey(row.id);
      if (! hash.get(key)) {
        hash.put(key, omit(row.state));
      }
    });

    // handle crdt set removals
    set.on('remove', function(row) {
    });

    // handle crdt row changes

    return hash;
  }

  return arguments[1] ? createSet(arguments[1]) : createSet;
};
