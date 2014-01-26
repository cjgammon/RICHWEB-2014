/*global define TimelineMax TweenMax $ Quad*/
define([], function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		DeckView; 
		
	require('tweenmax');
	
    //TODO:: there should be a global timeline object instead of using the deckview??
	DeckView = Backbone.View.extend({
		
		initialize: function () {
			this.$el = $('#deck');
			
			AppEvent.on('scrolling', this.scrolling, this);
			AppEvent.on('seek', this.seek, this);
			AppEvent.on('tween', this.tweenTo, this);	

			//TweenMax.ticker.useRAF(false);		
		},
		
		render: function () {
			var camera = this._camera.get('position');
			//camera.y = -document.body.scrollTop;
			camera.y = -$(window).scrollTop();
		},
		
		scrolling: function (delta) {

		},
		
		tweenTo: function (target) {			
			var view = this._slides.get(target).get('view'),
				id = view.$el.attr('id'),
				time = this._timeline.getLabelTime(id);
						
			this.desolve();
			
			if (Math.abs(this._timeline.time() - time) > Vars.get('transitionTime')) {							
				this._timeline.timeScale(Math.abs(this._timeline.time() - time)); //only if greater than 1	
			} else {
				this._timeline.timeScale(1);
			}
			
			this._timeline.tweenTo(time, {onComplete: this.resolve});				
		},

		seek: function (target) {
			/*
			var view = this._slides.get(target).get('view'),
				id = view.$el.attr('id'),
				time = this._timeline.getLabelTime(id);
			
			this.desolve();
			this._timeline.seek(time);
			this.resolve();
			*/
		},
		
		resolve: function () {
			AppEvent.trigger('resolve');
		},
		
		desolve: function () {
			AppEvent.trigger('desolve');	
		},
		
		setCamera: function (camera) {
			this._camera = camera;
		},

		getSlides: function () {
			return this._slides;
		},

		setSlides: function () {
			/*
			var i,
				slides = Vars.get('slides'),
				cameraTween,
				slideTweenIn,
				slideTweenOut,
				target,
                view,
				offset;
				
			this._slides = slides;
			this._timeline = new TimelineMax({onUpdate: function () {
                AppEvent.trigger('animate');
            }});

			Vars.set({'timeline': this._timeline});
			
			this.tweenOffset = 0;
						
			for (i = 0; i < this._slides.length; i += 1) {	
				this.addTween(i);
			}
			
			this._timeline.pause();
			*/
		},
		
		addTween: function (i) {
			/*
			var view = this._slides.get(i).get('view'),
				target = view.$el,
				//duration = view.getTransitionTime() / 2;
				duration = Vars.get('transitionTime');
						
			this.tweenOffset += duration;	
			
 			cameraTween = new TweenMax.to(this._camera.get('position'), duration, {
				x: target.data('x'), 
				y: target.data('y'), 
				z: target.data('z'),
				ease: Quad.easeInOut
			});
			
			this._timeline.add(cameraTween, this.tweenOffset - duration);
			
			view.addTransitionIn(this._timeline, this.tweenOffset - duration / 2);
			view.addTransitionOut(this._timeline, this.tweenOffset);
			
			this._timeline.addLabel(target.attr('id'), this.tweenOffset);
			*/			
		},
		
		getPosition: function () {
			//return this._timeline.time();
		}
	});
	
	return DeckView;
});
