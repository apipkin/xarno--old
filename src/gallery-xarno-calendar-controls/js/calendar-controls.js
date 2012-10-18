/**
 * @module gallery-xarno-calendar-controls
 * @class Y.Xarno.CalendarControls
 * @extends Y.Plugin.Base
 * @version 1.0.0
 */
 var LANG = Y.Lang,
    BOUNDING_BOX = 'boundingBox';

Y.namespace('Plugin.Xarno').CalendarControls = Y.Base.create('controls', Y.Plugin.Base, [], {

    /*
    @public
    @method initializer
    */
    initializer : function() {
        this._host = this.get('host');
        this.afterHostEvent('render', Y.bind(this._render, this));
    },

    /*
    @public
    @method destructor
    */
    destructor : function() {
        if ( this._delegate ) {
            this._delegate.destroy();
        }
        if ( this._controls ) {
            this._controls.remove(true);
        }

        this._delegate = null;
        this._controls = null;
    },

    /*
    @public
    @method syncUI
    */
    syncUI : function() {
        this._syncUI();
    },

    /*
    @protected
    @method _render
    _render : function() {
        this._renderUI();
        this._bindUI();
        this._syncUI();
    },

    /*
    @protected
    @method _renderUI
    */
    _renderUI : function() {
        var position = Y.WidgetStdMod.HEADER;

        this._buildControls();

        if (this.get('position') === 'footer') {
            position = Y.WidgetStdMod.FOOTER;
        }

        this.get('host').setStdModContent(position, this._controls, Y.WidgetStdMod.AFTER);
    },

    /*
    @protected
    @method _bindUI
    */
    _bindUI : function() {
        this._host.after('dateChange', Y.bind(this._syncUI, this));
    },

    /*
    @protected
    @method _syncUI
    */
    _syncUI : function(e) {
        var d = (e) ? e.newVal : this._host.get('date'),
            month = this.get('months')[d.getMonth()],
            day = d.getDate(),
            year = d.getFullYear();

        this._display.setContent(LANG.sub(this.get('display'), {
            month : month,
            day : day,
            year : year
        }));
    },

    /*
    @protected
    @property Y.Node _controls
    */
    _controls : null,
    /*
    @protected
    @property Y.Node _display
    */
    _display : null,
    /*
    @protected
    @property EventFacade _delegate
    */
    _delegate : null,

    /*
    @protected
    @method _buildControls
    */
    _buildControls : function() {
        var c, py, pm, ny, nm;
        c = new Y.Node.create('<div class="' + this._host.getClassName('controls') + '" />');
        this._display = new Y.Node.create('<span class="display" />');
        c.append(this._display);

        if (this.get('yearButtons')) {
            py = new Y.Button(this.get('prevYearConfig'));
            py.get(BOUNDING_BOX).addClass('prev-year');
            py.on('press', Y.bind(this._prevYear, this));
            py.render(c);

            ny = new Y.Button(this.get('nextYearConfig'));
            ny.get(BOUNDING_BOX).addClass('next-year');
            ny.on('press', Y.bind(this._nextYear, this));
            ny.render(c);
        }

        if (this.get('yearButtons')) {
            pm = new Y.Button(this.get('prevMonthConfig'));
            pm.get(BOUNDING_BOX).addClass('prev-month');
            pm.on('press', Y.bind(this._prevMonth, this));
            pm.render(c);

            nm = new Y.Button(this.get('nextMonthConfig'));
            nm.get(BOUNDING_BOX).addClass('next-month');
            nm.on('press', Y.bind(this._nextMonth, this));
            nm.render(c);
        }

        this._controls = c;
    },

    /*
    Interface for generic control click callback
    @protected
    @method _controlClick
    */
    _controlClick : function(e) {
    },

    /*
    @protected
    @method _prevYear
    */
    _prevYear : function() {
        this._host.prevYear();
    },
    /*
    @protected
    @method _prevMonth
    */
    _prevMonth : function() {
        this._host.prevMonth();
    },
    /*
    @protected
    @method _updateMonthYear
    */
    _updateMonthYear : function() {
    },
    /*
    @protected
    @method _nextMonth
    */
    _nextMonth : function() {
        this._host.nextMonth();
    },
    /*
    @protected
    @method _nextYear
    */
    _nextYear : function() {
        this._host.nextYear();
    },

    /*
    @protected
    @method _setPosition
    @returns 'header', 'footer', null
    */
    _setPosition : function (val) {
        if (val === 'header' || val === 'footer') {
            return val;
        }
        return null;
    }

}, {
    NS : 'controls',
    ATTRS : {
        /*
        @attribute position
        @default header
        */
        position : {
            value : 'header',
            validator : '_setPosition'
        },

        /*
        @attribute yearButtons
        @default true
        */
        yearButtons : {
            value : true,
            validator : LANG.isBoolean
        },

        /*
        @attribute monthButtons
        @default true
        */
        monthButtons : {
            value : true,
            validator : LANG.isBoolean
        },

        /*
        @attribute months
        @default ['January', 'February','March','April','May','June','July','August','September','October','November','December']
        */
        months : {
            value : ['January', 'February','March','April','May','June','July','August','September','October','November','December']
        },

        /*
        @attribute display
        @default {month} {year}
        */
        display : {
            value : '{month} {year}'
        },

        /*
        @attribute prevYearConfig
        @default { icon: 'control-dbl-w' }
        */
        prevYearConfig : {
            value : { icon: 'control-dbl-w' }
        },

        /*
        @attribute prevMonthConfig
        @default { icon: 'control-w' }
        */
        prevMonthConfig : {
            value : { icon: 'control-w' }
        },

        /*
        @attribute nextMonthConfig
        @default { icon: 'control-e' }
        */
        nextMonthConfig: {
            value : { icon: 'control-e' }
        },

        /*
        @attribute nextYearConfig
        @default { icon: 'control-dbl-e' }
        */
        nextYearConfig : {
            value : { icon: 'control-dbl-e' }
        }
    }
});