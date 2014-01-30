/*global define*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideView = require('pres/views/slide-view'),
		FilterView;
		
	require('tweenmax');

	FilterView = SlideView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');
						
			if (view == this) {	
				this.SHIFT = false;
				this.in = true;
				this.animating = true;
				this.delta = 0;
				AppEvent.trigger('stopanimation');
				clearInterval(this.interval);
				this.setup();
			}
		},
		
		desolve: function () {
			if (this.in) {
				this.in = false;
				this.animating = false;
				
				this.kill();
				
				//this.image.removeEventListener('click');
				$(this.image).unbind('click');
				
				for (filter in this.filters) {
					this.filters[filter].lbl.parent().unbind('click');
				}
				
				clearInterval(this.interval);
				AppEvent.trigger('startanimation');
			}
		},
		
		handle_image_CLICK: function () {
			if (this.animating !== false) {
				this.reset();
				TweenMax.to(this.filters['sepia'], 1, {val: 0.8});
				TweenMax.to(this.filters['saturate'], 1, {val: 3});
				TweenMax.to(this.filters['brightness'], 1, {val: 1.2});
				TweenMax.to(this.filters['contrast'], 1, {val: 2, onUpdate: this.render.bind(this)});
			} else {
				this.reset();
				this.animating = true;
				this.update();
			}
		},
		
		handle_label_CLICK: function (e) {
			var $this = $(e.target),
				id = $this.find('span').attr('id'),
				type = id.replace('filter-label-', '');
			
			if (!this.SHIFT) {
				this.reset();			
			}
			
			this.filters[type].val = this.filters[type].range[1];
			this.render();
		},
		
		reset: function () {
			this.animating = false;
			this.kill();
			
			for (filter in this.filters) {
				this.filters[filter].val = this.filters[filter].def;
			}
			
			this.render();
		},
		
		kill: function () {
			for (filter in this.filters) {
				TweenMax.killTweensOf(this.filters[filter]);
			}
		},
		
		render: function () {
			if (this.in) {
				this.image.style.webkitFilter = this.filterString();
				this.updateStrings();
			}
		},
		
		update: function () {
			var filter = this.filters[this.filterTypes[this.delta]],
				instance = this;
				
			if (this.in !== true && this.animating !== true) {
				return;
			}	
			
			new TweenMax.to(filter, 3, {
				val: filter.range[1], 
				onUpdate: this.render.bind(this)
			});
				
			new TweenMax.to(filter, 3, {
				delay: 3,
				val: filter.def, 
				onUpdate: this.render.bind(this), 
				onComplete: function () {
					this.delta = this.delta < this.filterTypes.length - 1 ? this.delta + 1 : 0;
					this.update();
				}.bind(this)
			});
		},
		
		updateStrings: function () {
			var val;
			
			for (filter in this.filters) {
				$item = this.filters[filter].lbl;
				
				if (this.filters[filter].val == this.filters[filter].def) {
					$item.parent().addClass('out')
				} else {
					$item.parent().removeClass('out')
				}
				
				if (this.filters[filter].suffix) {
					val = Math.round(this.filters[filter].val);
					$item.html(val + this.filters[filter].suffix);		
				} else {
					val = this.filters[filter].val;
					val = val.toFixed(1);
					$item.html(val);
				}
			}
		},
		
		activeFilterString: function () {
			var i = 0,
				string = '',
				val;
				
			for (filter in this.filters) {
				
				i += 1;
				if (this.filters[filter].val !== this.filters[filter].def) {
				
					string += filter;
					val = Math.round(this.filters[filter].val);
					
					if (this.filters[filter].suffix) {
						string += '(' + val + this.filters[filter].suffix + ')';
					} else {
						string += '(' + val + ')';
					}
					
					string += ' ';
				}
			}
			
			return string;		
		},
		
		filterString: function () {
			var i = 0,
				string = '';
				
			for (filter in this.filters) {
				
				i += 1;
				if (this.filters[filter].val !== this.filters[filter].def) {
				
					string += filter;
				
					if (this.filters[filter].suffix) {
						string += '(' + this.filters[filter].val + this.filters[filter].suffix + ')';
					} else {
						string += '(' + this.filters[filter].val + ')';
					}
				
					if (i < this.filterTypes.length) {
						string += ' ';
					}
				}
			}
			
			return string;
		},
		
		setup: function () {
			this.filters = {
				saturate: {range: [0, 6], def: 1, val: 1},
				contrast: {range: [0, 4], def: 1, val: 1},
				grayscale: {range: [0, 1], def: 0, val: 0},
				brightness: {range: [0, 2], def: 1, val: 1},
				'hue-rotate': {range: [0, 180], def: 0, val: 0, suffix: 'deg'},
				blur: {range: [0, 10], def: 0, val: 0, suffix: 'px'},
				sepia: {range: [0, 1], def: 0, val: 0},
				invert: {range: [0, 1], def: 0, val: 0},
				opacity: {range: [1, 0], def: 1, val: 1}
			};
			
			this.filterTypes = [];
			for (filter in this.filters) {
				this.filters[filter].lbl = $('#filter-label-' + filter);
				this.filters[filter].lbl.parent().bind('click', this.handle_label_CLICK.bind(this));
				this.filterTypes.push(filter);
			}
			
			this.updateStrings();
			
			this.lbl = document.getElementById('filter-list-label');
			this.image = document.getElementById('filter-list-image');
			$(this.image).bind('click', this.handle_image_CLICK.bind(this));
			
			this.render();
			
			this.update();

		}
		
	});
	
	return FilterView;
});
