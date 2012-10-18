/**
 * @module gallery-xarno-proximity
 * @class Y.Xarno.Proximity
 * @extends Y.Plugin.Base
 * @version 1.0.0
 */

Y.namespace('Xarno').Proximity = Y.Base.create('proximity', Y.Plugin.Base, [], {

  /**
  @public
  @method locate
  */
  locate: function() {
    this._getDistance();
    return this.get('distance');
  },

  /**
  @protected
  @method _getDistance
  */
  _getDistance: function() {
    var target = this.get('target').get('region'),
        host = this.get('host').get('region'),
        t = 'top', r = 'right', b = 'bottom', l = 'left',
        dist = [
          Math.abs(Math.sqrt(Math.pow(host[t] - target[t], 2) + Math.pow(host[r] - target[r], 2))),
          Math.abs(Math.sqrt(Math.pow(host[r] - target[r], 2) + Math.pow(host[b] - target[b], 2))),
          Math.abs(Math.sqrt(Math.pow(host[b] - target[b], 2) + Math.pow(host[l] - target[l], 2))),
          Math.abs(Math.sqrt(Math.pow(host[l] - target[l], 2) + Math.pow(host[t] - target[t], 2)))
        ],
        minDistance = Math.min(dist[0],dist[1], dist[2], dist[3]);

    this.set('distance', minDistance);
  },

  /**
  @protected
  @method _targetSetter
  */
  _targetSetter: function(val) {
    return Y.Node(val);
  }

}, {

  NS: 'proximity',

  ATTRS: {

    /**
    @attribute target
    @default null
    */
    target: {},
    /**
    @attribute target
    @default null
    */
    distance: {}
  }

});





