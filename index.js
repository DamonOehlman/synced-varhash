var VarHash = require('observ-varhash');

module.exports = function(type) {
  function createSet(crdt) {
    var hash = VarHash();
    var set = crdt.createSet('type', type);

    // handle changes in the hash and apply the changes to the crdt correctly
    hash(function(data) {
    });

    // handle crdt set additions
    set.on('add', function(row) {
    });

    // handle crdt set removals
    set.on('remove', function(row) {
    });

    // handle crdt row changes

    return hash;
  }

  return arguments[1] ? createSet(arguments[1]) : createSet;
};
