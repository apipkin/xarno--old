/**
 @author Anthony Pipkin
 @class Y.Xarno.Plugin.DTResize
 @module gallery-xarno-plugin-datatable-resize
 @version 1.0.0
 */
Y.namepsace('Xarno.Plugin').DTResize= Y.Base.create('datatable-resize', Y.Plugin.Base, [], {

    /**
    @protected
    @property {Y.PluginHost} _host
    @default null
    */
    _host : null,

    /**
    @protected
    @propety {Y.Node} _tHead
    @default null
    */
    _tHead : null,

    /**
    @method initializer
    */
    initializer : function() {
        Y.log('initializer', 'info', 'plugin-resize');
        this._host = this.get('host');
        this._host.get('boundingBox').addClass(this._host.getClassName('resize'));
        this.afterHostMethod('setHeaders', this._afterHostSetHeaders);
        if(this._host.headersSet) {
            this._afterHostSetHeaders();
        }
    },

    /**
     @method destructor
     */
    destructor : function() {
        Y.log('destructor', 'info', 'plugin-resize');
        this._host.get('boundingBox').removeClass(this._host.getClassName('resize'));
        this._removeGrips();
    },

    //  P R O T E C T E D  //

    /**
     @protected
     @method _afterHostSetHeaders
     */
    _afterHostSetHeaders : function() {
        Y.log('_afterHostSetHeaders', 'info', 'plugin-resize');

        this.publish('sort', {defaultFn: this._defSortFn});

        this._removeGrips();
        this._tHead = this._host.get('contentBox').one('thead');

        this._tHead.all('th:not([resizable="false"]) .yui3-sdt-liner').each(function(header){
            var grip = Y.Node.create('<div class="' + this.get('gripClass') + '"><span class="yui3-icon"></span></div>');

            grip.plug(Y.Plugin.Drag);

            grip.dd.on('drag:drag', this._handleDrag, this);

            grip.setData('target', header);

            grip.setStyle('opacity', (this.get('visible')) ? 1 : 0 );

            header.append(grip);

        }, this);
    },

    /**
    @protected
    @method _handleDrag
    */
    _handleDrag : function(e) {
        var handle = e.target.get('node'),
                target = handle.getData('target'),
                th = target.ancestor('th');

        handle.setStyle('left', 'auto');

        th.setStyle('width', e.target.lastXY[0] + parseInt(handle.getStyle('width'),10) - th.getX());

        // dont update the handle position
        e.preventDefault();
    },

    /**
    @protected
    @method _removeGrips
    */
    _removeGrips : function() {
        this._host.get('boundingBox').all('.' + this.get('gripClass')).remove(true);
    }


}, {

    NS : 'resize',

    ATTRS : {
        /**
        Ability to customize the class used to display the grip
        @attribute {String} gripClass
        @default 'yui3-icon-vgrip'
        */
        gripClass : {
            value : 'yui3-icon-vgrip'
        },

        /**
        Sets the min size of all columns
        @attribute {Number} minWidth
        @default 50
        */
        minWidth : {
            value : 50
        },

        /**
        Specifies a 1 (true) or 0 (false) opacity
        @attribute {Boolean} visible
        @default true
        */
        visible: {
            value : true
        }
    }
});
