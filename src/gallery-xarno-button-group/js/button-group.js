/**
 * @author Anthony Pipkin
 * @class Y.ButtonGroup
 * @module gallery-xarno-button-group
 * @extends Y.Widget
 */
var YL = Y.Lang;

Y.namespace('Xarno').ButtonGroup = Y.Base.create('button-group', Y.Widget, [Y.WidgetParent, Y.WidgetChild], {

    /**
    A node to identify the button group.
    @property {String} labelNode
    @public
    */
    labelNode: null,

    /**
    @method initializer
    @public
    */
    initializer: function (config) {
        Y.log('Y.ButtonGroup::initializer');

        this.labelNode = Y.Node.create('<span class="' + this.getClassName('label') + '"/>');
    },

    /**
    @method renderUI
    @public
    */
    renderUI: function () {
        Y.log('Y.ButtonGroup::renderUI');

        this.get('boundingBox').prepend(this.labelNode);
    },

    /**
    @method bindUI
    @public
    */
    bindUI: function () {
        Y.log('Y.ButtonGroup::bindUI');

        this.on('button:press', this._defButtonPressFn, this);
    },

    /**
    @method syncUI
    @public
    */
    syncUI: function () {
        Y.log('Y.ButtonGroup::syncUI');

        this.labelNode.set('text', this.get('label'));
    },

    /**
    Default button press callback. Prevents all buttons from being unselected if `alwaysSelected` is true.
    @protected
    @method _defButtonPressFn
    @param Event e
    */
    _defButtonPressFn: function (e) {
        if (this.get('alwaysSelected')) {
            var selection = this.get('selection'),
                button = e.target;

            if (selection === button || ( // selection is the button OR
                selection instanceof Y.ArrayList && // selection is an array AND
                selection.size() === 1 && // there is only one item AND
                selection.item(0) === button) // that one itme is the button
            ) {
                e.preventDefault();
            }
        }
    }

}, {
    ATTRS: {

        /**
        Prepends the bounding box with a <span> containing the label text
        @attribute {String} label
        */
        label: {
            validator: YL.isString,
            setter: function (val) {
                this.labelNode.set('text', val);
                return val;
            }
        },

        /**
        Allows for inline button addition
        @attribute {Object} defaultChildType
        @default Y.Button
        */
        defaultChildType: {
            value: Y.Button
        },

        /**
        Prevents all buttons in the group from being deselected when using Y.ButtonToggle
        @attribute {Boolean} alwaysSelected
        @default false
        */
        alwaysSelected: {
            value: false
        }
    }
});