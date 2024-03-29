/**
 * @author Anthony Pipkin
 * @class Y.Xarno.Dialog
 * @module gallery-xarno-dialog
 * @extends Y.Overlay
 */

var YL = Y.Lang,
        LABEL_CANCEL = 'Cancel',
        LABEL_OK = 'OK',
        CALLBACK_CANCEL = 'cancel',
        CALLBACK_OK = 'ok',
        EMPTY_FN = function(){},
        ATTR_CALLBACKS = 'callbacks',
        ATTR_DEFAULT_BUTTON = 'defaultButton',
        ATTR_DRAGGABLE = 'draggable',
        ATTR_RETURN_VAL = 'returnVal',
        ATTR_ICON = 'icon';

Y.namespace('Xarno').Dialog = Y.Base.create('dialog', Y.Overlay, [], {

    /**
     * @property {Object} handleEnter
     * @public
     */
    handleEnter : null,

    /**
     * @property {Object} handleEscape
     * @public
     */
    handleEscape : null,

    /**
     * Plugs in Gallery_Overlay_Extras: binds hide to the escape key
     *
     * @method initializer
     * @public
     * @param {Object} config
     */
    initializer : function(config) {
        Y.log('initializer','info','Y.Xarno.Dialog');
        this.plug(Y.Plugin.WidgetAnim);
        this.plug(Y.Plugin.OverlayModal);
        this.plug(Y.Plugin.OverlayKeepaligned);
    },

    /**
     * Override of default hide(). Hides the widget then fires the
     *   provided callback type with the returVal as the param. If
     *   none is provided, the cancel callback is fired.
     *
     * @method hide
     * @public
     * @param String callbackType
     */
    hide : function(callbackType) {
        Y.log('hide','info','Y.Xarno.Dialog');
        Y.one('body').set('tabIndex',-1).focus();

        Y.Xarno.Dialog.superclass.hide.apply(this,arguments);
        var fn = (callbackType) ? this.getCallback(callbackType) : this.getCallback(CALLBACK_CANCEL);
        if(YL.isFunction(fn)) {
            (Y.bind(fn,this,this.get(ATTR_RETURN_VAL)))();
            this.set(ATTR_RETURN_VAL,null);
        }

        this.anim.get('animHide').on('end',Y.bind(function(){
            this.purge();
        },this));
    },

    /**
     * Override of default show(). Calls syncUI() to maintain
     *   centering before showing the dialog box. After showing,
     *   focuses on the default button.
     *
     * @method show
     * @public
     */
    show : function() {
        Y.log('show','info','Y.Xarno.Dialog');
        this.get(ATTR_DRAGGABLE);

        this.handleEscape = Y.once('esc', Y.bind(function(){ this.hide(); }, this), Y.config.doc);
        Y.Xarno.Dialog.superclass.show.apply(this,arguments);
        this.syncUI();

        var dBtn = this.get(ATTR_DEFAULT_BUTTON);

        if(dBtn) {
            dBtn.focus();
        }

        this.get('boundingBox').set('tabIndex', -1);
    },

    /**
     * Adds content to the header container based on the placement
     *
     * @method header
     * @public
     * @param {HTML | Node | String} content
     * @param {Stirng} [placement]
     *
     */
    header : function(content, placement) {
        Y.log('header','info','Y.Xarno.Dialog');
        this._setContent(Y.WidgetStdMod.HEADER, content, placement);
    },

    /**
     * Adds content to the body container based on the placement
     *
     * @method body
     * @public
     * @param {HTML | Node | String} content
     * @param {String} [placement]
     */
    body : function(content, placement) {
        Y.log('body','info','Y.Xarno.Dialog');
        this._setContent(Y.WidgetStdMod.BODY, content, placement);
    },

    /**
     * Adds content to the footer container based on the placement
     *
     * @method footer
     * @public
     * @param {HTML | Node | String} content
     * @param {String} [placement]
     */
    footer : function(content, placement) {
        Y.log('footer','info','Y.Xarno.Dialog');
        this._setContent(Y.WidgetStdMod.FOOTER, content, placement);
    },

    /**
     * Builds the dialog box and populates the content areas.
     *
     * @method build
     * @public
     * @param {HTML | Node | String} header
     * @param {HTML | Node | String} body
     * @param {Array} buttons array of Y.Xarno.Button
     * @chainable
     * @return this
     */
    build : function(header, body, buttons) {
        Y.log('build','info','Y.Xarno.Dialog');

        var i, l, btn;

        this.purge();

        if(header) {
            this.header(header);
        }

        if(body) {
            this.body(body || null);
        }

        if(buttons) {
            for(i=0, l=buttons.length; i<l; i++) {

                btn = buttons[i];
                btn.render();
                if(btn.get('default')) {
                    this.set(ATTR_DEFAULT_BUTTON, btn);
                }

                this.footer(btn.get('boundingBox'), 'after');
            }
        }

        return this;
    },

    /**
     * Returns the callback function based on the type provided
     *
     * @method getCallback
     * @public
     * @param {String} type
     * @returns Function | null
     */
    getCallback : function(type) {
        Y.log('getCallback','info','Y.Xarno.Dialog');
        return (this.get(ATTR_CALLBACKS)[type] || null);
    },

    /**
     * Sets the callback type to the callbacks array if the
     *   provided function is a valid function
     *
     * @method addCallback
     * @public
     * @param {String} type
     * @param {Function} fn
     */
    addCallback : function(type, fn) {
        Y.log('addCallback','info','Y.Xarno.Dialog');
        if(YL.isFunction(fn)) {
            this.get(ATTR_CALLBACKS)[type] = fn;
        }
    },

    /**
     * Sets the callback function type to null if found
     *
     * @method removeCallback
     * @public
     * @param {String} type
     */
    removeCallback : function(type) {
        Y.log('removeCallback','info','Y.Xarno.Dialog');
        if(this.get(ATTR_CALLBACKS)[type]) {
            this.get(ATTR_CALLBACKS)[type] = null;
        }
    },

    /**
     * Adds a close button to the header
     *
     * @method addCloseButton
     * @public
     * @chainable
     * @returns this
     */
    addCloseButton : function() {
        Y.log('addCloseButton', 'info', 'Y.Xarno.Dialog');
        var btn = new Y.Xarno.Button({
            label: "X",
            callback: Y.bind(function(e){
                this.hide();
            },this),
            title: 'Close'
        });
        btn.render();
        this.header(btn.get('boundingBox'),'after');
        return this;
    },

    /**
     * Removes all elements in the widget
     *
     * @method purge
     * @public
     * @chainable
     * @return this
     */
    purge : function() {
        Y.log('purge','info','Y.Xarno.Dialog');
        this.header(null);
        this.body(null);
        this.footer(null);
        return this;
    },

    //  P R E   B U I L T  //
    /**
     * Sugar method to create an alert box
     *
     * @method alert
     * @public
     * @param {String} msg
     * @param {String} [title]
     * @param {Function} [cancelCallback]
     */
    alert: function(msg, title, callback){
        Y.log('alert','info','Y.Xarno.Dialog');
        this.set(ATTR_ICON,'alert');

        this.addCallback(CALLBACK_CANCEL, callback || EMPTY_FN);

        var header = title || this._getDefaultTitle(),
                body = msg || null,
                okBtn = new Y.Xarno.Button({
                    label: LABEL_OK,
                    callback: Y.bind(function(e){
                        this.hide();
                    },this),
                    'default': true
                });

        this.build(header, body, [okBtn]).addCloseButton().show();
    },

    /**
     * Sugar method to create a confirm box
     *
     * @method confirm
     * @public
     * @param {String} msg
     * @param {String} [title]
     * @param {Function} [okCallback]
     * @param {Function} [cancelCallback]
     */
    confirm: function(msg, title, okCallback, cancelCallback){
        Y.log('initializer','info','Y.Xarno.Dialog');
        this.set(ATTR_ICON,'confirm');

        this.addCallback(CALLBACK_OK, okCallback || EMPTY_FN);
        this.addCallback(CALLBACK_CANCEL, cancelCallback || EMPTY_FN);

        var header = title || this._getDefaultTitle(),
                body = msg || null,
                okBtn = new Y.Xarno.Button({
                    label: LABEL_OK,
                    callback: Y.bind(function(e){
                        this.hide(CALLBACK_OK);
                    },this),
                    'default': true
                }),
                cancelBtn = new Y.Xarno.Button({
                    label: LABEL_CANCEL,
                    callback: Y.bind(function(e){
                        this.hide();
                    },this)
                });


        this.build(header, body, [okBtn,cancelBtn]).addCloseButton().show();
    },

    /**
     * Sugar method to create a prompt box. Updates returnVal to
     *   the value of the input box.
     *
     * @method prompt
     * @public
     * @param {String} msg
     * @param {String} [title]
     * @param {Function} [okCallback]
     * @param {Function} [cancelCallback]
     */
    prompt: function(msg, title, okCallback, cancelCallback){
        Y.log('initializer','info','Y.Xarno.Dialog');
        this.set(ATTR_ICON,'prompt');

        this.addCallback(CALLBACK_OK, okCallback || EMPTY_FN);
        this.addCallback(CALLBACK_CANCEL, cancelCallback || EMPTY_FN);

        var header = title || this._getDefaultTitle(),
                body = msg || null, promptInput,
                okBtn = new Y.Xarno.Button({
                    label: LABEL_OK,
                    callback: Y.bind(function(e){
                        this.hide(CALLBACK_OK);
                    },this),
                    'default': true
                }),
                cancelBtn = new Y.Xarno.Button({
                    label: LABEL_CANCEL,
                    callback: Y.bind(function(e){
                        this.hide();
                    },this)
                });

        this.build(header, body, [okBtn,cancelBtn]);

        // need to build the input box and bind the events to it
        //   then append it to the body
        promptInput = Y.Node.create('<input type="text" style="display: block; margin-top: 0.5em;">');
        promptInput.addClass(this.getClassName('prompt'));

        promptInput.on('keyup', Y.bind(function(e){
            this.set(ATTR_RETURN_VAL, promptInput.get('value'));
        },this));

        this.handleEnter = Y.once('enter', Y.bind(function(e){
            var defBtn = this.get(ATTR_DEFAULT_BUTTON);
            if(defBtn) {
                defBtn.fire('press');
            }
        },this),promptInput);

        this.body(promptInput, 'after');

        this.addCloseButton().show();
    },

    //  P R O T E C T E D  //
    /**
     * Generates a generic title similar to system dialog boxes
     *
     * @method _getDefaultTitle
     * @protected
     * @return {String}
     */
    _getDefaultTitle : function() {
        Y.log('_getDefaultTitle','info','Y.Xarno.Dialog');
        return 'The page ' + location.protocol + '//' + location.host  + '/ says:';
    },

    /**
     * Plugs in the Drag and DDConstrained to the boundingBox and
     *   makes the header the handle. Fired automatically when
     *   draggable is updated by the setter.
     *
     * @method _updateDraggable
     * @protected
     * @param {Boolean} drag
     */
    _updateDraggable : function(drag) {
        Y.log('_updateDraggable','info','Y.Xarno.Dialog');
        var bb = this.get('boundingBox'),
                hd = bb.all('.yui3-widget-hd');

        if(drag) {
            bb.plug(Y.Plugin.Drag,{
                handle : hd
            }).dd.plug(Y.Plugin.DDConstrained, {
                constrain2view: true,
                gutter: '20'
            });
        }else{
            bb.unplug(Y.Plugin.Drag)
                .unplug(Y.Plugin.DDContrained);
        }
    },

    /**
     * @method _setContent
     * @protected
     * @param {String} section
     * @param {String} content
     * @param {String} placement
     */
    _setContent : function(section, content, placement) {
        Y.log('_setContent','info','Y.Xarno.Dialog');
        this.setStdModContent(section, content, this._standardizePlacement(placement));
    },

    /**
     * Returns the WidgetStdMod Static values for positions based
     *   off placement given. Accepts prepend, before, append,
     *   after. If not matched will return Y.WidgetStdMod.REPLACE
     *
     * @param {String} placement Desired placement
     * @retrun string
     */
    _standardizePlacement : function(placement) {
        Y.log('_standardizePlacement','info','Y.Xarno.Dialog');
        var p = (YL.isString(placement)) ? placement.toLowerCase() : null;
        switch (p) {
            case 'prepend' :
            case 'before' :
                return Y.WidgetStdMod.BEFORE;
            case 'append' :
            case 'after' :
                return Y.WidgetStdMod.AFTER;
            default:
                return Y.WidgetStdMod.REPLACE;
        }
    }

},{
    ATTRS : {

    /**
     * @attribute {Boolean} centered
     * @default true
     */
        centered : {
        value : true
    },

    /**
     * @attribute {} callbacks
     * @default {}
     */
        callbacks : {
            value : {}
        },

    /**
     * @attribute {Boolean} constrain
     * @default true
     */
        constrain : {
            value : true
        },

    /**
     * @attribute {Y.Xarno.Button} defaultButton
     * @default null
     */
        defaultButton : {
            validator : function(val) {
                return (val instanceof Y.Xarno.Button);
            }
        },

    /**
     * @attribute {Boolean} draggable
     * @default true
     */
        draggable : {
            value : true,
            validator : YL.isBoolean,
            setter : function (val) {
                this._updateDraggable(val);
                return val;
            }
        },

    /**
     * @attribute {Boolean} render
     * @default true
     */
        render : {
            value : true
        },

    /**
     * @attribute {} returnVal
     * @default null
     */
        returnVal : {
            value : null
        },

    /**
     * @attribute {String} icon
     * @default null
     */
        icon : {
            validator : YL.isString,
            setter : function(val) {
                this.get('boundingBox').replaceClass(
                    this.getClassName(ATTR_ICON, this.get(ATTR_ICON) || 'default'),
                    this.getClassName(ATTR_ICON, val || 'default')
                );
                return val;
            }
        },

    /**
     * @attribute {Boolean} visible
     * @default false
     */
        visible : {
            value : false
        },

    /**
     * @attribute {Integer} zIndex
     * @default 20000
     */
        zIndex : {
            value : 20000
        }
    }
});