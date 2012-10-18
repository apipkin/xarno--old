/**
 @author Anthony Pipkin
 @class Y.Xarno.ProgressBar
 @module gallery-xarno-progress-bar
 @version 1.0.0
 */
var LANG = Y.Lang;

Y.namespace('Xarno').ProgressBar = Y.Base.create('progressBar', Y.Widget, [], {

    /**
    @protected
    @property _anim
    @default null
    */
    _anim: null,


    /** set up **/
    /**
    @method renderUI
    */
    renderUI: function() {
        Y.log('renderUI', 'info', 'Y.ProgressBar');
        this.get('contentBox').append(LANG.sub(this.get('layout'), {
            sliderClass: this.getClassName('slider'),
            labelClass: this.getClassName('label')
        }));
    },

    /**
    @method bindUI
    */
    bindUI: function() {
        Y.log('bindUI', 'info', 'Y.ProgressBar');
        this.after('labelChange', this._updateLabel);
        this.after('labelTemplateChange', this._updateLabel);
        this.after('progressChange', this._updateBar);
    },

    /**
    @method syncUI
    */
    syncUI: function() {
        Y.log('syncUI', 'info', 'Y.ProgressBar');
        this._updateBar();
    },

    /** A little bit of sugar **/
    /**
    @method imcrement
    @param {Number} [step]
    @return this
    @chainable
    */
    increment: function(step) {
        Y.log('increment', 'info', 'Y.ProgressBar');
        step = step || 1;
        this.set('progress', this.get('progress') + parseFloat(step, 10));
        return this;
    },

    /**
    @method decrement
    @param {Number} [step]
    @return this
    @chainable
    */
    decrement: function(step) {
        Y.log('decrement', 'info', 'Y.ProgressBar');
        step = step || 1;
        this.set('progress', this.get('progress') - parseFloat(step, 10));
        return this;
    },

    /**
    @method update
    @param {Number} progress
    @return this
    @chainable
    */
    update: function(progress) {
        Y.log('update', 'info', 'Y.ProgressBar');
        this.set('progress', progress);
        return this;
    },

    /**
    @method setLabelAt
    @param {Number} position
    @param {String} value
    @returns this
    @chainable
    */
    setLabelAt: function(position, value) {
        Y.log('setLabelAt', 'info', 'Y.ProgressBar');
        var label = this.get('label');
        position = parseFloat(position, 10);
        label[position] = value;
        this.set('label', label);
        return this;
    },

    /**
    @method removeLabelAt
    @param {Number} position
    @returns this
    @chainable
    */
    removeLabelAt: function(position) {
        Y.log('removeLabelAt', 'info', 'Y.ProgressBar');
        var label = this.get('label');
        position = parseFloat(position, 10);
        if (label[position] !== undefined && label[position] !== null) {
            delete label[position];
        }
        this.set('label', label);
        return this;
    },

    /**
    @method setLabelTemplateAt
    @param {Number} position
    @param {String} value
    @returns this
    @chainable
    */
    setLabelTemplateAt: function(position, value) {
        Y.log('setLabelTemplateAt', 'info', 'Y.ProgressBar');
        var template = this.get('labelTemplate');
        position = parseFloat(position, 10);
        template[position] = value;
        this.set('labelTemplate', template);
        return this;
    },

    /**
    @method removeLabelTemplateAt
    @param {Number} position
    @return this
    @chainable
    */
    removeLabelTemplateAt: function(position) {
        Y.log('removeLabelTemplateAt', 'info', 'Y.ProgressBar');
        var template = this.get('labelTemplate');
        position = parseFloat(position, 10);
        if (template[position] !== undefined && template[position] !== null) {
            delete template[position];
        }
        this.set('labelTemplate', template);
        return this;
    },

    /** protected updaters **/
    /**
    @protected
    @method _updateLabel
    @param {Event} e
    */
    _updateLabel: function(e) {
        Y.log('_updateLabel', 'info', 'Y.ProgressBar');
        var progress = this.get('progress'),
            attrs = this.getAttrs(),
            label = this._getLabel(progress),
            labelTemplate = this._getLabelTemplate(progress);

        attrs.label = label || '';
        this.get('contentBox').all('.' + this.getClassName('label')).set('text', LANG.sub(labelTemplate, attrs));
    },

    /**
    @protected
    @method _updateBar
    */
    _updateBar: function(e) {
        Y.log('_updateBar', 'info', 'Y.ProgressBar');
        var cb = this.get('contentBox'),
            position = cb.get('offsetWidth') * this.get('progress') / 100;

        if (!this._anim) {
            this._makeAnim();
        }

        if (this._anim && this._anim.get('running')) {
            this._anim.stop();
        }

        this._anim.set('to.width', position);

        this._anim.run();

        this._updateLabel();
    },

    /**
    @protected
    @method _makeAnim
    */
    _makeAnim: function() {
        Y.log('_makeAnim', 'info', 'Y.ProgressBar');
        var animConfig = this.get('animation'),
            node = this.get('contentBox').one(this.get('animateNode'));

        animConfig.node = node;

        if (!animConfig.to) {
            animConfig.to = {
                width: 0
            };
        }

        this._anim = new Y.Anim(animConfig);
    },

    /**
    @protected
    @method _getAnimatedNode
    @returns {String}
    */
    _getAnimateNode: function() {
        return ('.' + this.getClassName('slider'));
    },

    /**
    @protected
    @method _getLabel
    @param {Number} progress
    @returns {String}
    */
    _getLabel : function(progress) {
        Y.log('_getLabel', 'info', 'Y.ProgressBar');
        var label = this.get('label'),
            labelString = null,
            keys, i = -1, l;

        if ( !LANG.isObject(label) ) {
            return label;
        }

        if (label[progress] !== undefined && label[progress] !== null) {
            labelString = label[progress];
        } else {
            keys = Y.Object.keys(label);
            keys.sort(Y.Array.numericSort);
            l = keys.length;
            while (++i < l) {
                if (keys[i] <= progress) {
                    labelString = label[keys[i]];
                }
            }
        }

        return labelString;
    },

    /**
    Returns a label template for the nearest previous progress
        increment or the static template if ATTRS.labelTemplate
        is a string.
    @protected
    @method _getLabelTemplate
    @param {Number} progress
    @return {String}
    */
    _getLabelTemplate : function(progress) {
        Y.log('_getLabelTemplate', 'info', 'Y.ProgressBar');
        var template = this.get('labelTemplate'),
            templateString = null,
            keys, i = -1, l;

        if ( !LANG.isObject(template) ) {
            return template;
        }

        if (template[progress] !== undefined && template[progress] !== null) {
            templateString = template[progress];
        } else {
            keys = Y.Object.keys(template);
            keys.sort(Y.Array.numericSort);
            l = keys.length;
            while (++i < l) {
                if (keys[i] <= progress) {
                    templateString = template[keys[i]];
                }
            }
        }

        return templateString;
    }

}, {
    ATTRS: {

        /**
        Animation configuration to be used when updating the progress bar. Width is added automatically and will override any to.width configuration supplied.
        */
        animation: {
            value: {
                easing: Y.Easing.easeIn,
                duration: 0.5
            }
        },

        /**
        Selector used to target the node that should be animated
        @readonly
        @attribute {String} animateNode
        */
        animateNode: {
            valueFn: '_getAnimateNode'
        },

/* REMOVED FOR TRANSITION BUG
transition : {
  value : {
    easing : 'ease-out',
    duration: 0.5
  }
},
*/

        /**
        Template used to display the progress
        @attribute {Object} labelTemplate
        @default { 0 : '{label} - {progress}%' }
        */
        labelTemplate: {
            value: { 0 : '{label} - {progress}%' },
            validator: function(val) {
                return (LANG.isString(val) || LANG.isObject(val));
            },
            setter: function(val) {
                if (LANG.isString(val)) {
                    val = {
                        0: val
                    };
                }
                return val;
            }
        },

        /**
        Associated array used to update the label template with a status at a specific percentage.
        @attribute {Object} label
        @default {0: 'Loading', 100:'Complete'}
        */
        label: {
            value: {
                0: 'Loading',
                100: 'Complete'
            },
            validator: function(val) {
                return (LANG.isString(val) || LANG.isObject(val));
            },
            setter: function(val) {
                if (LANG.isString(val)) {
                    val = {
                        0: val
                    };
                }
                return val;
            }
        },

        /**
        Template used to append to the content box as the animated progress slider
        @attribute {String} layout
        @default <div class="{sliderClass} {labelClass}"></div>
        */
        layout: {
            value: '<div class="{sliderClass} {labelClass}"></div>'
        },

        /**
        Number of decimals to show with percentage calculations
        @attribute {Number} precision
        @default 2
        */
        precision: {
            value: 2,
            setter: function(val) {
                return parseInt(val, 10);
            }
        },

        /**
        Percentage of completion
        @attribute {Number} progress
        @default 0
        */
        progress: {
            value: 0,
            setter: function(val) {
                var precision = Math.pow(10, this.get('precision'));
                val = parseFloat(val, 10);
                if (val < 0) {
                    val = 0;
                } else if (val > 100) {
                    val = 100;
                }
                return Math.round(val * precision) / precision;
            }
        }
    }
});



