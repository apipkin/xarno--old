/**
@author apipkin
@class Y.OrderedHash
@module gallery-ordered-hash
**/
var YArray = Y.Array,
    YObject_owns = Y.Object.owns;


function OrderedHash () {
    /**
    @protected
    @property _arr
    @type {Array}
    **/
    this._arr = [];

    /**
    @protected
    @property _obj
    @type {Object}
    **/
    this._obj = {};

    // constructor
    var objs, i, l, k;

    if (arguments.length > 0) {
        // loop through array of pairs
        if (Y.Lang.isArray(arguments[0])) {
            objs = arguments[0];
        } else {
            objs = arguments;
        }

        // loop through objs
        for (i=0,l=objs.length; i<l; i++) {
            k = null;
            for (k in objs[i]) {
                if (objs[i].hasOwnProperty(k)){
                    this._arr.push(k);
                    this._obj[k] = objs[i][k];
                    break;
                }
            }
        }
    }
    // -- constructor
}

OrderedHash.prototype = {

    /**
    @public
    @method push
    @chainable
    @returns this
    **/
    push : function() {
        var _arr = this._arr,
            _obj = this._obj,
            i = 0,
            l = arguments.length,
            key,
            value;

        for (i = 0; i < l; i++) {
            value = arguments[i];

            key = OrderedHash.getKey(value);
            if (key) {
                if (Y.Object.owns(_obj, key)) {
                    _arr = _arr.splice(_arr.indexOf(key),1);
                }
                _arr.push(key);
                _obj[key] = value[key];
            }
        }

        return this;
    },

    /**
    @public
    @method pop
    @param {Boolean} [asObject] returns a key:value pair if true
    @returns {Mixed} Last element in the stack
    **/
    pop : function(asObject) {
        var _obj = this._obj,
            key = this._arr.pop(),
            val = {};

        if (_obj[key]) {
            val = _obj[key];
            delete _obj[key];
        }

        return (asObject) ? {key: val} : val;
    },

    /**
    @public
    @method shift
    @param {Boolean} [asObject] returns a key:value pair if true
    @returns {Mixed} First element in the stack
    **/
    shift : function(asObject) {
        var _obj = this._obj,
            key = this._arr.shift(),
            val = {};

        if (_obj[key]) {
            val = _obj[key];
            delete _obj[key];
        }

        return (asObject) ? {key: val} : val;
    },

    /**
    @public
    @method push
    @chainable
    @returns this
    **/
    unshift : function() {
        var _arr = this._arr,
            _obj = this._obj,
            i = 0,
            l = arguments.length,
            key,
            value;

        for (i = 0; i < l; i++) {
            value = arguments[i];

            key = OrderedHash.getKey(value);

            if (key) {
                if (Y.Object.owns(_obj, key)) {
                    _arr = _arr.splice(_arr.indexOf(key),1);
                }
                _arr.unshift(key);
                _obj[key] = value[key];
            }
        }

        return this;
    },

    /**
    Reverses the keys' order
    @public
    @method reverse
    @chainable
    @returns this
    **/
    reverse: function() {
        this._arr.reverse();

        return this;
    },

    /**
    **/
    splice: function (index, numToRemove, elementsN) {
        // TODO: complete splice method
    },

    /**
    Returns the position of the key in the stack
    @public
    @method indexOf
    @param {String} key
    @returns {Number}
    **/
    indexOf : function(key) {
        return YArray.indexOf(this._arr, key);
    },

    /**
    Returns the position of the key in the stack from the end to the front
    @public
    @method lastIndexOf
    @param {String} key
    @returns {Number}
    **/
    lastIndexOf: function(key) {
        return YArray.lastIndexOf(this._arr, key);
    },

    /**
    Returns the number of items in the stack
    @public
    @method size
    @returns {Number}
    **/
    size : function() {
        return this._arr.length;
    },

    /**
    Calls the provided function on each item in the stack
    @public
    @method each
    @param {Function} fn
        @param {mixed} fn.value Value of the current property
        @param {String} fn.key Key of the current property
        @param {Number} fn.index Index of the current property in the stack
    @param {Object} [context]
    @chainable
    @returns this
    **/
    each : function(fn, context) {

        var _arr = this._arr,
            i = 0,
            l = _arr.length;

        for (i = 0; i < l; i++) {
            fn.call(context || this, /*value*/this._obj[_arr[i]], /*key*/_arr[i], /*index*/i);
        }

        return this;
    },

    /**
    Sets the item at the given index if provided with a number, or
        with the given key value if a string is provided
    @public
    @method setItem
    @param {String|Number} index
    @param {Mixed} value
    @chainable
    @returns this
    **/
    setItem : function(index, value) {
        var _arr = this._arr,
            _obj = this._obj,
            key;

        if (typeof index === 'string' && Y.Object.owns(_obj, index)) {
            _obj[index] = value;
        } else if (_arr[parseInt(index, 10)]) {
            index = parseInt(index, 10);

            key = OrderedHash.getKey(value);

            if (key) {
                _arr[index] = key;
                _obj[key] = value[key];
            }

        } else {
            throw "Key is not already set. Use `push`, `unshift` or ";
        }

        return this;
    },

    /**
    Returns the item with the given key if a string is provided, or at
        the position if a number is provided
    @public
    @method getItem
    @param {String|Number} index
    @param {Boolean} [asObject]
    @returns {Mixed}
    **/
    getItem : function(index, asObject) {
        var _arr = this._arr,
            _obj = this._obj,
            key;

        if (typeof index === 'string' && Y.Object.owns(_obj, index)) {
            key = index;
        } else if (_arr[parseInt(index, 10)]) {
            key = _arr[parseInt(index, 10)];
        } else {
            throw "Item at index " + index + " is not found.";
        }

        return (asObject) ? {key: _obj[key]} : _obj[key];
    },

    /**
    Truncates the ordered hash
    @public
    @method empty
    @chainable
    @returns this
    **/
    empty: function() {
        this._arr = [];
        this._obj = {};

        return this;
    },

    /**
    Returns an array of keys in the same order of the stack
    @public
    @method keys
    @returns {Array}
    **/
    keys: function() {
        return this._arr.concat();
    },

    /**
    Returns an array of values, or key:value pairs if asObject is true
    @public
    @method values
    @param {Boolean} [asObject]
    @returns {Array}
    **/
    values: function(asObject) {
        var _arr = this._arr,
            _obj = this._obj,
            i,
            key,
            l = _arr.length,
            retArr = [];

        for (i=0; i<l; i++) {
            key = _arr[i];
            retArr.push( (asObject) ? {key: _obj[key]} : key );
        }

        return retArr;
    }

};

OrderedHash.getKey = function (obj) {
    var p;

    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            return p;
        }
    }
};



Y.OrderedHash = OrderedHash;