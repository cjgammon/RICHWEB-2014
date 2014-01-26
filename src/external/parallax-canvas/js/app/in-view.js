/*global define $*/

define(function (require) {

    var UserEvent = require('app/events/user-event'),
        InView,
        instance,
        $body,
        $window,
        $animates,
        WINDOW_HEIGHT,
        WINDOW_TOP,
        TIMEOUT;

    /**
     * InView manages view state of js-animates elements
     *
     */
    InView = function () {
        instance = this;

        function inviewAnimations() {
            var i;

            if (WINDOW_TOP < 0) {
                return;
            }

            $animates.each(function () {
                var $this = $(this),
                    elTop = $this.offset().top,
                    elHeight = $this.height();

                if (elTop - WINDOW_TOP < WINDOW_HEIGHT && 
                    elTop - WINDOW_TOP + elHeight > 0) 
                {
                    $this.addClass('in');
                } else {
                    $this.removeClass('in');
                }
            });
        }

        //throttle scroll
        function handle_SCROLL() {
            WINDOW_TOP = $window.scrollTop();

            TIMEOUT = setTimeout(function () {
                inviewAnimations();
            }, 100);
        }

        function handle_RESIZE() {
            WINDOW_HEIGHT = $window.height();
        }

        instance.init = function () {
            $body = $('body');
            $window = $(window);
            $animates = $('.js-animates');

            $body.addClass('js-inview');
            
            WINDOW_HEIGHT = $window.height();
            WINDOW_TOP = $window.scrollTop();

            UserEvent.on('scroll', handle_SCROLL);
            UserEvent.on('resize', handle_RESIZE);
        }
    };

    return new InView();
});
