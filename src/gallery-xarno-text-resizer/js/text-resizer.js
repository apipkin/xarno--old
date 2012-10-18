/**
Gives the ability to attach font resizing to any node on a page.

@author Anthony Pipkin
@class Y.Plugin.Text.Resizer
@module gallery-xarno-text-resizer
@version 1.1
*/

Y.namespace('Plugin.Text').Resizer = Y.Base.create('text-resize', Y.Plugin.Base, [], {

    /**
    @method initializer
    */
    initializer : function() {
        Y.log('initializer', 'info', 'Y.Text.Resizer');

        var host = this.get('host');

        this._bindUI();

        this.setSize(this._load() || this.get('baseSize'));
    },

    /**
    @method reset
    @returns this
    @chainable
    */
    reset : function() {
        Y.log('reset', 'info', 'Y.Text.Resizer');
        this.setSize(this.get('baseSize'));
        return this;
    },

    /**
    Sets font size to the smallest size
    @method smallest
    @returns this
    @chainable
    */
    smallest : function() {
        Y.log('smallest', 'info', 'Y.Text.Resizer');
        this.setSize(this.get('smallest'));
        return this;
    },

    /**
    Sets font size to the largest
    @method largest
    @returns this
    @chainable
    */
    largest : function() {
        Y.log('largest', 'info', 'Y.Text.Resizer');
        this.setSize(this.get('largest'));
        return this;
    },

    /**
    Sets font size to the next largest size
    @method up
    @returns this
    @chainable
    */
    up : function() {
        Y.log('up', 'info', 'Y.Text.Resizer');
        var c = this.get('currentSize');

        if(c + 1 <= this.get('largest')) {
            this.setSize(++c);
        }
        return this;
    },

    /**
    Sets font size to the next smallest size
    @method down
    @returns this
    @chainable
    */
    down : function() {
        Y.log('down', 'info', 'Y.Text.Resizer');
        var c = this.get('currentSize');

        if(c - 1 >= this.get('smallest')) {
            this.setSize(--c);
        }
        return this;
    },

    /**
    Updates the current size to the new size
    @method setSize
    @param {Number} size
    */
    setSize : function(size) {
        Y.log('setSize', 'info', 'Y.Text.Resizer');
        this.set('currentSize', parseFloat(size, 10));
        this._save(size);
        this._update();
        return this;
    },

    /**
    @protected
    @method _bindUI
    */
    _bindUI : function(){
        // set font to default
        Y.delegate('click', function(e){
            e.preventDefault();
            this.reset();
        }, host, '.text-resize-default', this);

        // set font to min
        Y.delegate('click', function(e){
            e.preventDefault();
            this.smallest();
        }, host, '.text-resize-smallest', this);

        // set font to max
        Y.delegate('click', function(e){
            e.preventDefault();
            this.largest();
        }, host, '.text-resize-largest', this);

        // increment font size
        Y.delegate('click', function(e){
            e.preventDefault();
            this.up();
        }, host, '.text-resize-up', this);

        /// decrement font size
        Y.delegate('click', function(e){
            e.preventDefault();
            this.down();
        }, host, '.text-resize-down', this);
    },

    /**
    @protected
    @method _update
    */
    _update : function() {
        Y.log('_update', 'info', 'Y.Text.Resizer');
        Y.one(this.get('targetNode')).setStyle('fontSize', this.get('currentSize') + this.get('unit'));
    },

    /**
    @protected
    @method _save
    */
    _save : function(size) {
        Y.log('_save', 'info', 'Y.Text.Resizer');
        Y.Cookie.set(this.get('cookieName'), size + this.get('unit'), {
            'expires' : new Date("January 12, 2025"),
            'path' : '/'
        });
    },

    /**
    @protected
    @method _load
    */
    _load : function() {
        Y.log('_load', 'info', 'Y.Text.Resizer');
        return parseFloat(Y.Cookie.get(this.get('cookieName')), 10);
    }

}, {
    NS : 'textResizer',

    ATTRS : {
        /**
        Stores the current size for retrieval and updates
        @attribute {Number} currentSize
        @default 0
        */
        currentSize : {
            value : 0
        },

        /**
        Initial size font should be when loaded. Used with reset()
        @attribute {Number} baseSize
        @default 12
        */
        baseSize : {
            value : 12
        },

        /**
        Smallest font sized to be displayed. Limit is only checked when using down()
        @attribute {Number} smallest
        @default 9
        */
        smallest : {
            value : 9
        },

        /**
        Largest font sized to be displayed. Limit is only checked when using up()
        @attribute {Number} largest
        @default 18
        */
        largest : {
            value : 18
        },

        /**
        Unit of measurement for font size
        @attribute {String} unit
        @default px
        */
        unit : {
            value : 'px'
        },

        /**
        Used for cookie setting and getting
        @attribute {String} cookieName
        @default YUI_TEXT_RESIZER
        */
        cookieName : {
            value : 'YUI_TEXT_RESIZER'
        },

        /**
        Sets the font-size of the node on updates
        @attribute {String} targetNode
        @default body
        */
        targetNode : {
            value : 'body'
        }
    }
});