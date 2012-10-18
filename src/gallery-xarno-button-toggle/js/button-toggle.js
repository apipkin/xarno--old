/**
@author Anthony Pipkin
@class Y.Xarno.ButtonToggle
@module gallery-xarno-button-toggle
@extends Y.Xarno.Button
*/

var YL = Y.Lang,
    DESELECTED_CALLBACK = 'deselectedCallback';

Y.namespace('Xarno').ButtonToggle = Y.Base.create('button', Y.Button, [], {

    /**
    @public
    @method bindUI
    */
    bindUI : function(){
        this.after('selectedChange', this._afterSelectedChange, this);
        Y.ButtonToggle.superclass.bindUI.apply(this, arguments);
    },

    /**
    @protected
    @method _defPressFn
    */
    _defPressFn : function(e) {
      var newSelected = (this.get('selected') === 0) ? 1 : 0;
        this.set('selected', newSelected, {press:e});
    },

    /**
    @protected
    @method _afterSelectChange
    */
    _afterSelectedChange : function(e){
        if(e.newVal) {
          this._executeCallback(e.press);
        }else{
          this._executeDeselectCallback(e.press);
        }
    },

    /**
    @protected
    @method _executeDeselectCallback
    */
    _executeDeselectCallback : function(e) {
      Y.log('Y.ButtonToggle::_executeDeselectCallback');
      if(this.get(DESELECTED_CALLBACK)) {
        (this.get(DESELECTED_CALLBACK))(e);
      }
    }

}, {
    ATTRS : {
        /**
        Method to call when button is deselected
        @attribute Function deselectedCallback
        @default null
        */
        deselectedCallback : {
            validator : YL.isFunction
        }
    }
});