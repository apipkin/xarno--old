/**
 @author Anthony Pipkin
 @class Y.Xarno.Plugin.DTFilter
 @module gallery-xarno-datatable-filter
 @version 1.3.0
 */

Y.namespace('Xarno.Plugin').DTFilter = Y.Base.create('dt-filter', Y.Plugin.Base, [], {

	/**
	@protected
	@property {Object} _hostCache
	@default null
	*/
    _hostCache : null,

	/**
	@protected
	@property {Object} _workingCache
	@default null
	*/
	_workingCache : null,

	/**
	@protected
	@property {Object} _searchColumns
	@default {}
	*/
	_searchColumns : {},

	/**
	@protected
	@property {Y.Node} _host
	@default null
	*/
	_host : null,

	/**
	@method initializer
	*/
    initializer : function() {
		Y.log('initializer', 'info', 'Y.Xarno.Plugin.DTFilter');

		this._host = this.get('host');
        this._hostCache = this._host.get('rows');
		this.recache();

        // _updateCache when host changes
		this.beforeHostMethod('setRows', this._updateCacheFromMethod, this);
        this.afterHostEvent('rowsChange', this._updateCacheFromEvent, this);

		// autorun filterby on plug
		if(this.get('filterBy')) {
			this.filter(this.get('filterBy'));
		}
    },

    /**
    Updates the working cache to the host cache
    @method recache
    */
	recache : function() {
		Y.log('recache', 'info', 'Y.Xarno.Plugin.DTFilter');
		this._workingCache = this._hostCache.concat();
	},

	/**
	@method destructor
	*/
	destructor : function() {
		Y.log('destructor', 'info', 'Y.Xarno.Plugin.DTFilter');
		this._host._buildRows(this._hostCache);
	},

	/**
	Returns an array of rows to be added to the datatable. Accepts
		String and RegExp and will use the proper search method based
		on the input type.
	@method search
	@param {String | RegExp} val
	@returns Array
	*/
    search : function(val) {
		Y.log('search', 'info', 'Y.Xarno.Plugin.DTFilter');
        return (val instanceof RegExp) ? this.searchByRegExp(val) : this.searchByString(val);
    },

    /**
    Will search the working cache on each key:value pair. Searching
    	once on the first set, then on the subsequent passes, will
    	search in the returned value set. Sets column to the current
    	column being searched.
    @method multiSearch
    @param {Object} obj
    @returns Object
    */
	multiSearch : function(obj) {
		Y.log('multiSearch', 'info', 'Y.Plugin.SDTPlugin');
		var key;
		for (key in obj) {
			this.set('column', key);
			this.search( obj[key] );
		}
		return this._workingCache;
	},

	/**
	Will match column values in the working cache to the RegExp. If the
		column ATTRS is set, will only search on that column, otherwise,
		it will search all columns.
	@method searchByRegExp
	@param {RegExp} exp
	@returns Array
	*/
    searchByRegExp : function(exp) {
		Y.log('searchByRegExp', 'info', 'Y.Xarno.Plugin.DTFilter');

		var rows = [], i, l, rowObj, item,
		column = this.get('column');

        // indexOf val
		for (i = 0, l = this._workingCache.length; i<l; i++) {

			rowObj = this._workingCache[i];
			if (column) {
				if (rowObj[column]) {
					item = rowObj[column];

					if (exp.test(item)) {
						rows.push(rowObj);
						continue;
					}
				}
			} else {
				for (column in rowObj) {
					if (column.substring(0,2) === '__') {
						continue;
					}
					if (rowObj[column]) {
						item = rowObj[column].toString();
						if (exp.test(item)) {
							rows.push(rowObj);
							break;
						}
					}
				}
				column = null;
			}
		}

        // return array of rows
		this._workingCache = rows;
		return rows;
    },

	/**
	Will match column values in the working cache to the String. If the column ATTRS is set, will only search on that column, otherwise, it will search all columns.
	@method searchByString
	@param {String} val
	@returns Array
	*/
    searchByString : function(val) {
		Y.log('searchByString', 'info', 'Y.Xarno.Plugin.DTFilter');

		var rows = [], i, l, rowObj, item,
		column = this.get('column'),
		strict = this.get('strict');
        // indexOf val
		for (i = 0, l = this._workingCache.length; i<l; i++) {

			rowObj = this._workingCache[i];
			if (column) {
				if (rowObj[column]) {
					item = rowObj[column].toString();

					if (strict) {
						if (item.indexOf(val) >= 0) {
							rows.push(rowObj);
							continue;
						}
					} else {
						if (item.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
							rows.push(rowObj);
							continue;
						}
					}
				}
			} else {
				for (column in rowObj) {
					if (column.substring(0,2) === '__') {
						continue;
					}
					if (rowObj[column]) {
						item = rowObj[column].toString();
						if (strict) {
							if (item.indexOf(val) >= 0) {
								rows.push(rowObj);
								break;
							}
						} else {
							if (item.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
								rows.push(rowObj);
								break;
							}
						}
					}
				}
				column = null;
			}
		}

        // return array of rows
		this._workingCache = rows;
		return rows;
    },

    /**
    Adds the column to the _searchColumns object. If it is a new column,
    	it will search on the current working cache. If it is a column
    	already in use, it will recache and loop through each column.
    	Sets column to the current column being searched.
    @method filterOn
    @param {String} column
    @param {Mixed} value
    */
	filterOn : function(column, value) {
		Y.log('filterOn', 'info', 'Y.Xarno.Plugin.DTFilter');
		if (this._searchColumns[column]) {
			// need to refilter from the original host cache
			this.recache();
			this._searchColumns[column] = value;
			this._updateHost( this.multiSearch(this._searchColumns) );
		} else {
			// new column, continue filter from working cache
			this._searchColumns[column] = value;
			this.set('column', column);
			this._updateHost( this.search(value) );
		}
	},

	/**
	If the value passed is a String or RegExp, the working cache will
		be searched, and the result set will be used. If the valued
		passed is an array, or when a working set is returned from the
		search, the value is then passed to the _updateHost method and
		then updates the datatable.
	@method filter
	@param {Array | String | Number} val
	*/
    filter : function(val) {
		Y.log('filter', 'info', 'Y.Xarno.Plugin.DTFilter');

		this.set('filterBy', val);
		this.recache();

        // if not array, get array from this.search(val)
		if (!Y.Lang.isArray(val)) {
		  val = this.search(val);
		}

        this._updateHost(val);
    },

    /**
    @protected
    @method _updateCacheFromMethod
    @param {Object} rows
    */
	_updateCacheFromMethod : function(rows) {
		Y.log('_updateCacheFromParam', 'info', 'Y.Xarno.Plugin.DTFilter');

		var filterBy = this.get('filterBy');
        this._hostCache = rows;
		this.recache();

		if (this.get('refilterOnUpdate') && filterBy) {
			this.filter(filterBy);
			return new Y.Do.Prevent();
		}
	},

	/**
	@protected
	@method _updateCacheFromEvent
	@param {Event} e
	*/
    _updateCacheFromEvent : function(e) {
		Y.log('_updateCache', 'info', 'Y.Xarno.Plugin.DTFilter');

		var filterBy = this.get('filterBy');
        this._hostCache = e.newVal;
		this.recache();

		if (this.get('refilterOnUpdate') && filterBy) {
			this.filter(filterBy);
		}
    },

    /**
    @protected
    @method _updateHost
    @param {Object} rows
    */
    _updateHost : function(rows) {
		Y.log('_filter', 'info', 'Y.Xarno.Plugin.DTFilter');
		this._host._buildRows(rows);
    }

}, {
	NS : 'filter',
	ATTRS : {
		/**
		Current singular column to search on
		@attribute {String} column
		@default ''
		*/
		column : {
			value : ''
		},

		/**
		Value of most recent filter when using the filter() method
		@attribute {Object} filterBy
		@default {}
		*/
		filterBy : {},

		/**
		@attribute {Array} filteredRows
		@default null
		@readonly
		*/
	    filteredRows : {
			readOnly : true
		},

		/**
		If set to true, when the hooks are triggered, will refilter the
			new datatable rows
		@attribute {Boolean} refilterOnUpdate
		@default true
		*/
		refilterOnUpdate : {
		  value : true
		},

		/**
		If set to true, when performing String searches, will match for
			case. Otherwise, all strings will be converted to lower case
			and will the compared.
		@attribute {Boolean} strict
		@default false
		*/
		strict : {
		  value : false
		}
	}
});
