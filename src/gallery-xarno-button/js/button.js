/**
 @author Anthony Pipkin
 @class Y.Xarno.Button
 @module gallery-xarno-button
 @version 1.3.0
 */
var YL = Y.Lang,
    YCM = Y.ClassNameManager,
    EVENT_PRESS = 'press',
    CLASS_PRESSED = '-pressed',
    CLASS_DEFAULT = '-default',
    CLASS_DISABLED = '-disabled',
    CLASS_NO_LABEL = 'no-label',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    DEFAULT = 'default',
    ENABLED = 'enabled',
    DISABLED = 'disabled',
    HREF = 'href',
    TAB_INDEX = 'tabindex',
    ICON = 'icon',
    BEFORE = 'before',
    AFTER = 'after',
    CHANGE = 'Change',
    TITLE = 'title',
    INNER_HTML = 'innerHTML';

Y.namespace('Xarno'). = Y.Base.create('button', Y.Widget, [Y.WidgetChild], {

    /**
    @property String BOUNDING_TEMPLATE
    @public
    */
    BOUNDING_TEMPLATE: '<a />',

    /**
    @property String CONTENT_TEMPLATE
    @public
    */
    CONTENT_TEMPLATE: '<span />',

    /**
    @property String _className
    @protected
    */
    _className: '',

    /**
    @property String _mouseIsDown
    @protected
    */
    _mouseIsDown: false,

    /**
    @property String _mouseListener
    @protected
    */
    _mouseListener: null,

    /**
    Override of superclass _defaultCB to allow for srcNode and contentBox
    @method _defaultCB
    @protected
    */
    _defaultCB: function () {
        return null;
    },

    /**
    @method initializer
    @public
    */
    initializer: function (config) {
        Y.log('initializer', 'info', 'Y.Xarno.Button');

        this._className = this.getClassName();
        this.publish(EVENT_PRESS, {
            defaultFn: this._defPressFn
        });
        this.after('defaultChange', this._afterDefaultChanged, this);
        this.after('enabledChange', this._afterEnabledChanged, this);
    },

    /**
    Sets content to the content box
    @method renderUI
    @public
    @since 1.0.0
    */
    renderUI: function () {
        Y.log('renderUI', 'info', 'Y.Xarno.Button');
        var href = this.get(HREF);

        this.get(CONTENT_BOX).setContent(this.get('label'));

        if (href) {
            this.get(BOUNDING_BOX).setAttribute(HREF, href);
        } else {
            this.get(BOUNDING_BOX).set('tabIndex', 0);
        }

        this._updateIcon();
    },

    /**
    Binds internal `press` to default click event and mouse events for
        class changes
    @method bindUI
    @public
    @since 1.0.0
    */
    bindUI: function () {
        Y.log('bindUI', 'info', 'Y.Xarno.Button');
        var bb = this.get(BOUNDING_BOX);

        bb.on('click', this._defClickFn, this);
        bb.on('mouseup', this._mouseUp, this);
        bb.on('mousedown', this._mouseDown, this);
        bb.after('tabindexChange', this._afterTabindexChange, this);
        this.after('iconPosition' + CHANGE, this._afterIconPositionChanged, this);
        this.after(ICON + 'Template' + CHANGE, this._afterIconTemplateChanged, this);
    },

    /**
    Updates default class and sets enabled
    @method syncUI
    @public
    @since 1.0.0
    */
    syncUI: function () {
        Y.log('syncUI', 'info', 'Y.Xarno.Button');
        this._updateDefault(this.get(DEFAULT));
        this._updateEnabled(this.get(ENABLED));
        this._updateTabindex(this.get(TAB_INDEX));
    },

    /**
    Makes button diabled
    @method disable
    @public
    @since 1.1.0
    @chainable
    */
    disable: function () {
        Y.log('disable', 'info', 'Y.Xarno.Button');
        this.set(ENABLED, false);
        return this;
    },

    /**
    Makes button enabled
    @method enable
    @public
    @since 1.1.0
    @chainable
    */
    enable: function () {
        Y.log('enable', 'info', 'Y.Xarno.Button');
        this.set(ENABLED, true);
        return this;
    },

    /**
    Sets the title attribute to the bounding box
    @method setTitle
    @param title String
    @public
    @since 1.1.0
    @chainable
    */
    setTitle: function (title) {
        Y.log('setTitle', 'info', 'Y.Xarno.Button');
        this.get(BOUNDING_BOX).set(TITLE, title);
        return this;
    },


    //  P R O T E C T E D  //

    /**
    Prevents the default click event if button is `disabled` or if `href` is falsey or '#'
    @protected
    @method _defClickFn
    */
    _defClickFn: function (e) {
        Y.log('_defClickFn', 'info', 'Y.Xarno.Button');
        var href = this.get(HREF);

        if (!this.get(ENABLED)) {
            e.preventDefault();
            return;
        }

        if (!href || href === '#') {
            e.preventDefault();
        }
        this.fire(EVENT_PRESS, {
            click: e
        });
    },

    /**
    Default press callback function
    @protected
    @method _defPressFn
    @param e Event
    @since 1.2.0
    */
    _defPressFn: function (e) {
        Y.log('_defPressFn', 'info', 'Y.Xarno.Button');
        this._executeCallback(e);
    },

    /**
    Removes the pressed class
    @protected
    @method _mouseUp
    @since 1.0.0
    */
    _mouseUp: function () {
        Y.log('_mouseUp', 'info', 'Y.Xarno.Button');
        this.get(BOUNDING_BOX).removeClass(this._className + CLASS_PRESSED);
        this._mouseIsDown = false;
        if (this._mouseListener !== null) {
            this._mouseListener.detach();
            this._mouseListener = null;
        }
    },

    /**
    Adds the pressed class to bounding box
    @protected
    @method _mouseDown
    @since 1.0.0
    */
    _mouseDown: function () {
        Y.log('_mouseDown', 'info', 'Y.Xarno.Button');
        if (this.get(ENABLED)) {
            this.get(BOUNDING_BOX).addClass(this._className + CLASS_PRESSED);
            this._mouseIsDown = true;
            if (this._mouseListener === null) {
                this._mouseListener = Y.on('mouseup', Y.bind(this._listenForMouseUp, this));
            }
        }
    },

    /**
    Callback for drag out mouse event
    @protected
    @method _listenForMouseUp
    @since 1.0.0
    */
    _listenForMouseUp: function () {
        this._mouseUp();
    },

    /**
    Updates the enabled state
    @protected
    @method _afterEnabledChanged
    @since 1.0.0
    */
    _afterEnabledChanged: function (e) {
        Y.log('_afterEnabledChanged', 'info', 'Y.Xarno.Button');
        this._updateEnabled(e.newVal);
    },

    /**
    Updates the button icon with a new position
    @protected
    @method _updateIcon
    */
    _updateIcon: function () {
        Y.log('_updateIcon', 'info', 'Y.Xarno.Button');
        var position = this.get('iconPosition'),
            bb = this.get('boundingBox'),
            iconNode = this._iconNode || Y.Node.create(this.get('iconTemplate'));

        if (position === AFTER) {
            bb.append(iconNode);
        } else {
            bb.prepend(iconNode);
        }

        this._iconNode = iconNode;
    },

    /**
    Adds or removes the disabled attribute to for the button and
        updates disabled class on bounding box
    @protected
    @method _updateEnabled
    @since 1.0.0
    */
    _updateEnabled: function (status) {
        Y.log('_updateEnabled', 'info', 'Y.Xarno.Button');
        var bb = this.get(BOUNDING_BOX),
            disableClass = this._className + CLASS_DISABLED;

        if (status) {
            bb.removeClass(disableClass);
            bb.removeAttribute(DISABLED);
        } else {
            bb.addClass(disableClass);
            bb.removeClass(this._className + CLASS_PRESSED);
            bb.setAttribute(DISABLED, DISABLED);
        }

    },

    /**
    Calls `_updateIcon` if the new position is not the old position
    @protected
    @method _afterIconPositionChanged
    */
    _afterIconPositionChanged: function (e) {
        Y.log('_afterIconPositionChanged', 'info', 'Y.Xarno.Button');
        this._updateIcon();
    },

    /**
    Removes the current _iconNode and creates a new one with `_updateIcon`
    @protected
    @method _afterIconTemplateChanged
    */
    _afterIconTemplateChanged: function (e) {
        Y.log('_afterIconTemplateChanged', 'info', 'Y.Xarno.Button');
        if (this._iconNode) {
            this._iconNode.remove(true);
        }
        this._iconNode = undefined;
        this._updateIcon();
    },

    /**
    Updates the default state
    @protected
    @method _afterDefaultChanged
    @since 1.0.0
    */
    _afterDefaultChanged: function (e) {
        Y.log('_afterDefaultChanged', 'info', 'Y.Xarno.Button');
        this._updateDefault(e.newVal);
    },

    /**
    Updates the default class on the bounding box
    @protected
    @method _updateDefault
    @param state boolean
    @since 1.2.0
    @return void
    */
    _updateDefault: function (state) {
        Y.log('_updateDefault', 'info', 'Y.Xarno.Button');
        var bb = this.get(BOUNDING_BOX),
            defaultClass = this._className + CLASS_DEFAULT;
        if (state) {
            bb.addClass(defaultClass);
            bb.setAttribute(DEFAULT, DEFAULT);
        } else {
            bb.removeClass(defaultClass);
            bb.set(DEFAULT, '');
        }
    },

    /**
    Used to fire the internal callback
    @protected
    @method _executeCallback
    @since 1.1.0
    */
    _executeCallback: function (e) {
        Y.log('_executeCallback', 'info', 'Y.Xarno.Button');
        if (this.get('callback')) {
            (this.get('callback'))(e);
        } else {
            (this._callbackFromType())(e);
        }
    },

    /**
    Sets the icon class for the bounding box
    @protected
    @method _iconSetterFn
    @since 1.3.0
    */
    _iconSetterFn: function (val) {
        this.get(BOUNDING_BOX).replaceClass(
        YCM.getClassName(ICON, this.get(ICON) || DEFAULT),
        YCM.getClassName(ICON, val || DEFAULT));
        return val;
    },

    /**
    Sets the icon class for the bounding box
    @protected
    @method _labelSetterFn
    @since 1.3.0
    */
    _labelSetterFn: function (val) {
        Y.log('_labelSetterFn', 'info', 'Y.Xarno.Button');
        if (!val || val === '') {
            this.get(BOUNDING_BOX).addClass(this.getClassName(CLASS_NO_LABEL));
        } else {
            this.get(BOUNDING_BOX).removeClass(this.getClassName(CLASS_NO_LABEL));
        }
        this.get(CONTENT_BOX).setContent(val);
        this.set(TITLE, val);
        return val;
    },

    /**
    Sets the title to the bounding box
    @protected
    @method _titleSetterFn
    @since 1.3.0
    */
    _titleSetterFn: function (val) {
        this.get(BOUNDING_BOX).set(TITLE, val);
        return val;
    },

    /**
    Returns a function based on the type of button. Form buttons such
        as Submit and Reset are attached to their parent form if one is
        found. An empty function is return to prevent execution errors.
    @protected
    @method _callbackFromType
    @return Function
    @since 1.3.0
    */
    _callbackFromType: function () {
        Y.log('_callbackFromType', 'info', 'Y.Xarno.Button');
        var bb = this.get(BOUNDING_BOX),
            frm = bb.ancestor('form');

        switch (this.get('type')) {
            case 'submit':
                if (frm) {
                    return Y.bind(frm.submit, frm);
                }
                break;
            case 'reset':
                if (frm) {
                    return Y.bind(frm.reset, frm);
                }
                break;
        }

        return function () {};
    },

    /**
    Calls the internal method to update the tab index after it has changed.
    @protected
    @method _afterTabindexChange
    */
    _afterTabindexChange: function (e) {
        Y.log('_afterTabindexChange', 'info', 'Y.Xarno.Button');
        this._updateTabindex(e.newVal);
    },

    /**
    Updates the tab index. If the value is undefined or null, tabIndex is removed from the bouding box.
    @protected
    @method _updateTabindex
    @param Number val
    */
    _updateTabindex: function (val) {
        Y.log('_updateTabindex', 'info', 'Y.Xarno.Button');
        var bb = this.get(BOUNDING_BOX);

        if (val !== undefined && val !== null) {
            bb.setAttribute(TAB_INDEX, val);
        } else {
            bb.removeAttribute(TAB_INDEX);
        }
    }

}, {
    EVENTS: {
        PRESS: EVENT_PRESS
    },
    ATTRS: {
        /**
        Button text. Setting label will also set the title.
        @attribute String label
        @default `empty string`
        */
        label: {
            value: '',
            validator: YL.isString,
            setter: '_labelSetterFn',
            lazyAdd: false
        },
        /**
        Default function for button click.
        @attribute Function callback
        @default null
        */
        callback: {
            validator: YL.isFunction
        },
        /**
        Toggles the ability to click the button. Uses disable attribute on the <button> element.
        @attribute Boolean enabled
        @default true
        */
        enabled: {
            value: true,
            validator: YL.isBoolean
        },
        /**
        Tells parent widget this is the default button. Your application will need to interface this as it has no other purpose than state storage.
        @attribute Boolean default
        @default false
        */
        DEFAULT: {
            value: false,
            validator: YL.isBoolean
        },
        /**
        Allows you to set the icon class for the button. This is used for skinning.
        @attribute String icon
        */
        icon: {
            value: DEFAULT,
            setter: '_iconSetterFn',
            lazyAdd: false
        },
        /**
        Placement of icon in relation to the button label. Options are `before` and `after`.
        @attribute String iconPosition
        @default "before"
        */
        iconPosition: {
            value: BEFORE
        },
        /**
        Template used to generate the icon. Icons are typically used by CSS image placement, but this template allows you to add any icon markup required.
        @attribute String iconTemplate
        @default "<span class="yui3-icon" />"
        */
        iconTemplate: {
            value: '<span class="yui3-icon" />'
        },
        /**
        Used in a link button. If `href` is `"#"` or falsey, the default action of the click event is prevented.
        @attribute String href
        @default null
        */
        href: {
            value: null
        },
        /**
        Automatically set with set label, adds a title to the button for accessibility purposes. The title can be set if on an icon only button (no label set).
        @attribute String title
        @default null
        */
        title: {
            validator: YL.isString,
            setter: '_titleSetterFn'
        },
        /**
        Sets the tab index on the button for keyboard navigation.
        @attribute Number tabindex
        @default 0
        */
        tabindex: {
            value: 0
        },
        /**
        If `type` is `submit` or `reset`, the default click event will attempt to find a parent form element to submit or reset. If your button needs to submit or reset a form that it is not contained within, you will need to do the proper bindings in the `callback` config.
        @attribute String type
        @default push
        */
        type: {
            value: 'push',
            validator: YL.isString,
            lazyAdd: false
        }
    },
    /**
    HTML Parser assumes srcNode is either a &lt;button&gt; or
        &lt;input type="submit|reset"&gt;
    @since 1.2.0
    */
    HTML_PARSER: {

        enabled: function (srcNode) {
            return !srcNode.get(DISABLED);
        },

        label: function (srcNode) {
            if (srcNode.getAttribute('value')) {
                return srcNode.getAttribute('value');
            }
            if (srcNode.get(INNER_HTML)) {
                return srcNode.get(INNER_HTML);
            }

            // default form button labels based on type
            if (srcNode.get('tagName') === 'INPUT') {
                switch (srcNode.get('type')) {
                    case 'reset':
                        return 'Reset';
                    case 'submit':
                        return 'Submit';
                }
            }

            return null;
        },

        href: function (srcNode) {
            var href = srcNode.getAttribute(HREF);

            if (href) {
                return href;
            }

            return null;
        },

        type: function (srcNode) {
            var type = srcNode.getAttribute('type');

            if (type) {
                return type;
            }
            return null;
        },

        title: function (srcNode) {
            if (srcNode.getAttribute(TITLE)) {
                return srcNode.getAttribute(TITLE);
            }
            if (srcNode.getAttribute('value')) {
                return srcNode.getAttribute('value');
            }
            if (srcNode.get(INNER_HTML)) {
                return srcNode.get(INNER_HTML);
            }
            return null;
        }
    }
});

