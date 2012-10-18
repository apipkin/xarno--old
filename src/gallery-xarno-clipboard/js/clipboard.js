/**
 * @module gallery-xarno-clipboard
 * @class Y.Xarno.Clipboard
 * @extends Y.Base
 * @version 1.0.0
 */
 	Y.namespace('Xarno').Clipboard = Y.Base.create('clipboard', Y.Base, [], {

 		/*
 		@protected
 		@property _movie
 		*/
		_movie : null,

		/*
		@protected
		@property _swf
		*/
		_swf : null,

		/*
		@method initializer
		*/
		initializer : function(){
			Y.log('initializer', 'info', 'Y.Xarno.Clipboard');
			this.publish('ready', { defaultFn: Y.bind(this._defReady, this), fireOnce:true });
			this._renderUI();
			this._bindUI();
		},

		/*
		@method moveToAndCopy
		*/
		moveToAndCopy : function(target) {
			Y.log('moveToAndCopy','info','Y.Xarno.Clipboard');
			this.moveTo(target).copy(target);
		},

		/*
		@method hide
		*/
		hide : function() {
			Y.log('hide','info','Y.Xarno.Clipboard');
			this._movie.setStyles({
				left: '-10px',
				top: '-10px',
				width: '1',
				height: '1'
			});
		},

		/*
		@method moveTo
		*/
		moveTo : function(target) {
			this._movie.setStyles({
				left: target.getX(),
				top: target.getY(),
				width: target.get('offsetWidth'),
				height: target.get('offestHeight')
			});
			return this;
		},

		/*
		@method copy
		*/
		copy : function(target) {
			var copyTarget = this.get('clipTarget');
			if (target !== null && target !== undefined) {
				copyTarget = target;
			} else {
				copyTarget = Y.one(copyTarget);
			}

			if (copyTarget) {
				this.setText( copyTarget.getContent() );
			}
			return this;
		},

		/*
		@method setText
		*/
		setText : function(text) {
			this._swfCall('setText', [ text ]);
			return this;
		},

		/*
		@protected
		@method _movieReady
		*/
		_movieReady : function() {
			Y.log('movieReady','info','Y.Xarno.Clipboard');
			this.fire('ready');
		},

		/*
		@protected
		@method _renderUI
		*/
		_renderUI : function(){
			Y.log('_renderUI','info','Y.Xarno.Clipboard');
			var movie = Y.Node.create('<div />'),
				swf = null;

			Y.one('body').prepend(movie);
			movie.set('id', Y.stamp(movie));
			movie.setStyles({
				width: '1px',
				height: '1px',
				overflow: 'hidden',
				position: 'absolute',
				zIndex: '16000'
			});

			swf = new Y.SWF(movie, this.get('swfPath'), {
				fixedAttributes : {
					allowScriptAccess: 'always',
					allowNetworking: 'all',
					wmode: 'transparent'
				}
			});

			Y.log(swf);

			swf.on('swfReady', Y.bind(this._movieReady, this));

			this._movie = movie;
			this._swf = swf;
		},

		/*
		@protected
		@method _bindUI
		*/
		_bindUI : function() {
			this._movie.on('mouseout', this.hide, this);
			this.after('handChange', this._updateHand, this);
			this.after('debugChange', this._updateDebug, this);
		},

		/*
		@protected
		@method _defReady
		@param Event e
		*/
		_defReady : function(e) {
			Y.log('_defReady', 'info', 'Y.Xarno.Clipboard');
			this._updateHand();
			this._updateDebug();
		},

		/*
		@protected
		@method _updateHand
		@param Event e
		*/
		_updateHand : function(e) {
			Y.log('_updateHand', 'info', 'Y.Xarno.Clipboard');
			var bool = (e && e.newVal) ? e.newVal : this.get('hand');
			this._swfCall('showHand', [bool] );
		},

		/*
		@protected
		@method _updateDebug
		@param Event e
		*/
		_updateDebug : function(e){
			Y.log('_updateDebug', 'info', 'Y.Xarno.Clipboard');
			var bool = (e && e.newVal) ? e.newVal : this.get('debug');
			this._swfCall('setDebug', [bool]);
		},

		/*
		@protected
		@method _swfCall
		@param Function func
		@param Array args
		*/
		_swfCall : function(func, args) {
			Y.log('_swfCall', 'info', 'Y.Xarno.Clipboard');
			var swf = this._swf._swf._node;
			if (!args) {
				  args= [];
			}

			try {
				return(swf[func].apply(swf, args));
			} catch (err) {
				Y.log(err, 'warn');
				return null;
			}
		}

	}, {
		ATTRS : {
			/*
			@attribute swfPath
			@defautl XarnoClipboard.swf
			*/
			swfPath : {
				value : 'XarnoClipboard.swf'
			},

			/*
			@attribute clipTarget
			@defautl null
			*/
			clipTarget : {},

			/*
			@attribute hand
			@defautl true
			*/
			hand : {
				value : true
			},

			/*
			@attribute debug
			@defautl false
			*/
			debug : {
				value : false
			}
		}
	});
