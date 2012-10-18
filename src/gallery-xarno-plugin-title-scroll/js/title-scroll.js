/**
 @author Anthony Pipkin
 @class Y.Plugin.TitleScroll
 @module gallery-xarno-plugin-title-scroll
 @version 1.0.0
 */

Y.namespace('Plugin').TitleScroll = Y.Base.create('title-scroll', Y.Plugin.Base, [], {

    /**
    @protected
    @property {Y.Xarno.Timer} _timer
    */
    _timer : new Y.Xarno.Timer(),

    /**
    @protected
    @property {String} _originalTitle
    @default ''
    */
    _originalTitle : '',

    /**
    @protected
    @property {String} _newTitle
    @default ''
    */
    _newTitle : '',

    /**
    @method _setTitle
    */
    initializer : function() {
        this._captureOriginal();
        this._timer.set('callback', Y.bind(this._scrollTitle, this));
    },

    /**
    @method _setTitle
    @returns this
    @chainable
    */
    start : function(){
        this._captureOriginal();
        this._newTitle = this._normalize(this._originalTitle + this._getWhiteSpace());
        this._timer.set('length', this.get('speed'));
        if(this.get('scrollOnce')) {
            this._timer.set('repeatCount', this._newTitle.length);
        }
        this._timer.start();
        return this;
    },

    /**
    @method _setTitle
    @param {Boolean} [original] Sets the title to the original title
        after stoped
    @returns this
    @chainable
    */
    stop : function(original) {
        this._timer.stop();
        if(original) {
            this._setTitle(this._originalTitle);
        }
        return this;
    },

    /**
    @protected
    @method _setTitle
    */
    _normalize : function(val) {
        return val.replace(/ /gi, String.fromCharCode(160));
    },

    /**
    @protected
    @method _setTitle
    */
    _getWhiteSpace : function() {
        var i, count = this.get('whiteSpace') || 1, space = '';
        for(i = 0; i < count; i++ ) {
            space += ' ';
        }
        return space;
    },

    /**
    @protected
    @method _setTitle
    */
    _captureOriginal : function() {
        this._originalTitle = this.get('host').get('title');
    },

    /**
    @protected
    @method _setTitle
    */
    _scrollTitle : function(e) {
        var n = this.get('direction') == 'right' ?
                        this._newTitle.slice(this._newTitle.length - 1) + this._newTitle.slice(0,this._newTitle.length - 1) :
                        this._newTitle.slice(1) + this._newTitle.slice(0,1);

        this._newTitle = n;
        this._setTitle(n);
    },

    /**
    @protected
    @method _setTitle
    */
    _setTitle : function(val) {
        this.get('host').set('title', val);
    }

}, {
    NS : 'scroll',
    ATTRS : {
        /**
        Adds X number of non breaking spaces after the title to
            provide space during scroll (Note: This has various
            effects on different browser versions on different
            operating systems)
        @attribute {Number} whiteSpace
        @default 1
        */
        whiteSpace : {
            value : 1
        },

        /**
        Gives the ability to say what direction the scroll takes place.
            Optional 'right'
        @attribute {String} direction
        @default 'left'
        */
        direction: {
            value : 'left', // optional 'right'
            validator : function(val) {
                val = val.toString().toLowerCase();
                if(val === 'left' || val === 'right') {
                    return true;
                }
                return false;
            }
        },

        /**
        Determines the speed of the scroll
        @attribute {Number} speed
        @default 200
        */
        speed : {
            value : 200
        },

        /**
        Decides if the title should scroll once or scroll forever
        @attribute {Boolean} scrollOnce
        @default false
        */
        scrollOnce : {
            value : false
        }
    }
});