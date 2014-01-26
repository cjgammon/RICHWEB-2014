/*global define $ requestAnimationFrame*/
/**
 * Flexible Presentation Framework
 *
 * By @cjgammon
 * www.cjgammon.com
 */
define([], function (require) {
	
	var AppBase,
		Backbone = require('backbone'), 
		AppRouter = require('app-router'), 
		Vars = require('pres/models/vars'), 
		HudView = require('pres/views/hud-view'), 
		DeckView = require('pres/views/deck-view'), 
		SlideView = require('pres/views/slide-view'), 
		Slides = require('pres/collections/slides'),
		Slide = require('pres/models/slide'),
		ProgressBar = require('pres/views/progress-bar'),
		Camera = require('pres/models/camera'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event');

    AppBase = Backbone.View.extend({

        /**
         * initialization
         */
        initialize: function () {

			this.BASE_VIEW = this.BASE_VIEW ? this.BASE_VIEW : SlideView;
            this.SLIDEVIEW_LIST = this.SLIDEVIEW_LIST ? this.SLIDEVIEW_LIST : [];

            this.first = true;

			this.slides = new Slides();
            Vars.set({'slides': this.slides});
			this.router = new AppRouter();
			Vars.set({'router': this.router});
			
			this.deck = new DeckView();
			//this.hud = new HudView();
			this.camera = new Camera();
			
			this.deck.setCamera(this.camera);
			
			this.addSlides();
			this.addEventListeners();

			this.deck.setSlides();
									
            Backbone.history.start();
			
            $('li').css('opacity', '0');
			$('body').css('webkitPerspective', this.camera.getFovValue());
			$('#preloader').hide();
        },

        /* render */
        render: function () {
			var i,
				view;
			
			this.deck.render();
        },

        handle_ROUTER: function () {
            var uri = Backbone.history.fragment === '' ? 'slide/cover' : Backbone.history.fragment,
				slide;

			slide = this.slides.findWhere({url: uri});
			Vars.set({'currentSlide': slide.get('id')});
			this.currentSlide = Vars.get('currentSlide');
						
			if (this.first === true) {
				this.first = false;
				AppEvent.trigger('seek', this.currentSlide);
			} else {
				AppEvent.trigger('tween', this.currentSlide);
			}
        },

        handle_KEYDOWN: function (e) {
			UserEvent.trigger('keydown', e);
		},
		
        handle_MOUSEWHEEL: function (e) {
			UserEvent.trigger('mousewheel', e.originalEvent);
		},
		
        handle_RESIZE: function (e) {
			UserEvent.trigger('resize', e);	
		},
		
        navigate: function (slideId) {
			var slide,
				url;
			
			this.stopVideos();
			$('li').css('opacity', '0');
			
			slide = this.slides.findWhere({id: slideId});
						
			if (slide) {
				url = slide.get('url');				
				this.router.navigate(url, {trigger: true});		
			}
		},
		
        next: function () {
			this.nextSlide = this.currentSlide + 1;
			this.navigate(this.nextSlide);	
		},
		
        previous: function () {			            
			this.nextSlide = this.currentSlide - 1;
			this.navigate(this.nextSlide);
		},

        trigger: function () {
            var view = this.slides.get(this.currentSlide).get('view'),
                $el = view.$el,
                video = $el.find('video'),
                list = $el.find('li');
            
            if (this.deck.getPosition() % Vars.get('transitionTime') !== 0) {
				AppEvent.trigger('tween', this.currentSlide);
            } else if (this.SLIDEVIEW_LIST[this.currentSlide]) {
                view.trigger();
            } else if (list.length > 0) {
                this.triggerList($el);
            } else if (video.length > 0) {
                this.triggerVideo($el);
            } else {
                this.next();
            }
        },

        triggerVideo: function ($el) {
            var video = $el.find('video'),
                videoEl = video[0];

            if (videoEl.currentTime === 0) {
				video.attr('src', video.data('src'));
                videoEl.play();
            } else {
                this.next();
            }
        },

		stopVideos: function () {
			$('video').each(function () {
				$(this).attr('src', 'about:blank');
			});
		},

        triggerList: function ($el) {
            var list = $el.find('li'),
                listItem,
                i;

            for (i = 0; i < list.length; i += 1) {
                listItem = list[i];
                if ($(listItem).css('opacity') == '0') {
                    $(listItem).css('opacity', '1');
                    return;
                }
            }

            this.next();
        },

        /*
		* manage visibility of slides
		* //TODO: need to make it so this still works when rapid navigating
		*/
        resolve: function () {
			var i,
                slide,
				$el;

			for (i = 0; i < this.slides.length; i += 1) {
				slide = this.slides.get(i);
				$el = slide.get('view').$el;
				
				if (i < this.currentSlide - 2 || i > this.currentSlide + 2) {
					if ($el.css('display') !== 'none') {
						$el.css('display', 'none');
					}
				} else {
					if ($el.css('display') == 'none') {
						$el.css('display', '-webkit-flex');
					}
				}
				
				if (i !== this.currentSlide) {
					if ($el.css('pointer-events') !== 'none') {
						$el.css('pointer-events', 'none');
					}
				} else {
					if ($el.css('pointer-events') == 'none') {
						$el.css('pointer-events', 'auto');
					}
				}
			}
		},

        /**
		* KEY DOWN
		*/
        keydown: function (e) {
			switch (e.keyCode) {
			case 39: //right
				AppEvent.trigger('next');
				e.preventDefault();
				break;
			case 37: //left
				AppEvent.trigger('previous');
				e.preventDefault();
				break;
			case 27: //esc
				AppEvent.trigger('toggle');
				e.preventDefault();
				break;
            case 32: //space
                AppEvent.trigger('trigger');
                e.preventDefault();
                break;
			}
		},

        mousewheel: function (e) {
			var deltaX = e.wheelDeltaX / 100,
                deltaY = e.wheelDeltaY / 1000,
                slide,
                slideId,
                url,
                playhead;

            playhead = this.deck.getPosition();
            slideId = Math.floor(playhead);

            if (playhead - deltaX < Vars.get('transitionTime')) {
				return;
            }
            
            if (slideId !== this.currentSlide && slideId > -1 && slideId < this.slides.length) {
                slide = this.slides.findWhere({id: slideId});
                url = slide.get('url');
                this.currentSlide = slideId;
                this.router.navigate(url, {trigger: false});
                this.resolve();
			    AppEvent.trigger('desolve');	
            }

            AppEvent.trigger('scrolling', deltaY);
		},

        /* add slides*/
        addSlides: function () {
            var instance = this,
			 	Base = this.BASE_VIEW;


            $('.slide').each(function (i) {
				var $this = $(this),
					slide = new Slide(),
					view, 
					j;
				
				for (j = 0; j < instance.SLIDEVIEW_LIST.length; j += 1) {
					if (instance.SLIDEVIEW_LIST[j].id == $this.attr('id')) {
						view = instance.SLIDEVIEW_LIST[j].view;
						break;
					}
				}
				
				if (!view) {
					view = new Base();
				}
				
				view.setElement($this);
				view.setPosition();

				slide.set({
					'id': i, 
					'name': $this.attr('id'), 
					'url': 'slide/' + $this.attr('id'), 
					'view': view
				});
				
				instance.slides.push(slide);
			});
        },

        /* add event listeners */
        addEventListeners: function () {
            //$('body').bind('keydown', this.handle_KEYDOWN);
			//$('body').bind('mousewheel', this.handle_MOUSEWHEEL.bind(this));
			$(window).bind('scroll', this.handle_MOUSEWHEEL.bind(this));
			$(window).bind('resize', this.handle_RESIZE);

			/*
			this.router.on('route', this.handle_ROUTER, this);
			UserEvent.on('keydown', this.keydown);
			UserEvent.on('mousewheel', this.mousewheel, this);
			AppEvent.on('next', this.next, this);
			AppEvent.on('previous', this.previous, this);
			AppEvent.on('resolve', this.resolve, this);
			AppEvent.on('trigger', this.trigger, this);
			*/
            //AppEvent.on('animate', this.render, this);
        }


    });

	return AppBase;
});
