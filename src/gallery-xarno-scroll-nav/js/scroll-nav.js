/**
A plugin that will take all selected anchors and attach a click event to scroll to the anchor target.

Takes a selector config so you can allow for specific anchors or items to trigger the scroll. If using something other than <a> you will need to have an href attribute in the element for scroll-nav to work.

Allows for multi-click overrides, so if you click on a second item before the first is reached, it will continue the smooth scroll to the second item and forget the first.

Also calculates to highest scroll Y position if target is at the bottom of the page so smooth scrolling will not break.

@author Anthony Pipkin
@class Y.Plugin.ScrollNav
@module gallery-xarno-scoll-nav
@version 1.0.0
*/
Y.namespace('Plugin').ScrollNav = Y.Base.create('scroll-nav', Y.Plugin.Base, [], {

    /**
    @method initializer
    */
    initializer : function(config){
        Y.delegate('click', function(e){
            var href = e.currentTarget.getAttribute('href'),
                    target, targetY, hash, winH, docH;

            // make sure the link we clicked has a hash and is for this page
            if('#' !== href.substring(0,1)){
                return;
            }

            // if we made it this far let's prevent the link from firing
            e.preventDefault();

            // get the hash from the clicked href
            hash = href.substring(1);

            // find the target with the hash
            if(hash === '') {
                targetY = 0;
            }else{
                // get target
                target = (Y.one('a[name="' + hash + '"]')) ? Y.one('a[name="' + hash + '"]') : Y.one('#' + hash);

                targetY = target.getY();
            }

            if(targetY !== null) {
                // pause the animation if it's running,
                // stopping causes the scroll bar to jump
                if(this.anim && this.anim.get('running')) {
                    this.anim.pause();
                }

                // record current window conditions
                winH = Y.DOM.winHeight();
                docH = Y.DOM.docHeight();

                // create the animation and run it
                this.anim = new Y.Anim({
                    node: this.get('scroller'),
                    to: { // can't scoll to target if it's beyond the doc height - window height
                        scroll : [Y.DOM.docScrollX(), Math.min(docH - winH, targetY)]
                    },
                    duration: this.get('duration'),
                    easing: this.get('easing'),
                    on : {
                        end : function() { location.hash = hash; }
                    }
                }).run();
            }
        }, this.get('host'), this.get('selector'), this);
    }
},{
    NS : 'scrollNav',
    ATTRS : {
        /**
        Change the easing style of the animation
        @attribute {Function} easing
        @default Y.Easing.easeOutStrong
        */
        easing : {
            value : Y.Easing.easeOutStrong
        },

        /**
        Time it takes for the animation to complete
        @attribute {Number} duration
        @default 1.5
        */
        duration : {
            value : 1.5
        },

        /**
        Allows you to specify the anchors or items to trigger the scroll
        @attribute {String} selector
        @default a
        */
        selector : {
            value : 'a'
        },


        scroller : {
            value : 'window'
        }
    }
});