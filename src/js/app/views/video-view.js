/*global define*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event'),
		SlideView = require('pres/views/slide-view'),
		VideoView;
		
	VideoView = SlideView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');
			
			if (view == this) {	
				this.active = true;
				//TODO start video
				
				var $video = this.$el.find('video');
				
				this.video = $video[0];
				this.video.src = $video.data('src');
				this.video.volume = 0;
				this.video.addEventListener('loadedmetadata', function () {
					this.resize();
					this.video.play();
				}.bind(this));
				
				UserEvent.on('resize', this.resize.bind(this));
				
				AppEvent.trigger('stopanimation');
			}
		},
		
		resize: function () {			
			var _height,
				_width,
				_left,
				_top;
			
			
			_height = window.innerHeight;
			_width = this.video.videoWidth * (window.innerHeight / this.video.videoHeight);
			_left = (window.innerWidth / 2) - (_width / 2);
			_top = 0;
			
			if (_width < window.innerWidth) {
				_height = this.video.videoHeight * (window.innerWidth / this.video.videoWidth);
				_width = window.innerWidth;
				_left = (window.innerWidth / 2) - (_width / 2);
				_top = (window.innerHeight / 2) - (_height / 2);
			}
					
			this.video.style.top = _top + 'px';
			this.video.style.left = _left + 'px';
			this.video.style.width = _width + 'px';
			this.video.style.height = _height + 'px';
		},
		
		desolve: function () {
			if (this.active) {
				this.active = false;
				this.video.pause();
				this.video.src = "about:blank";
				
				UserEvent.off('resize', this.resize.bind(this));
				AppEvent.trigger('startanimation');
			}
		}
		
	});
	
	return VideoView;
});

