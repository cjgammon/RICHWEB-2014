define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		UserEvent = require('pres/events/user-event'),	
		AppEvent = require('pres/events/app-event'),
		HudView; 
		
	require('tweenmax');	
			
	HudView = Backbone.View.extend({
		
		initialize: function () {
			this.$el = $('#hud');
			this._visible = false;
			this._list = [];
			this._selected = 0;
			
			AppEvent.on('toggle', this.toggle, this);
		},
		
		render: function() {
			
		},
		
		keydown: function (e) {
			var element,
				router = Vars.get('router'),
				slides,
				slideNumber,
				slide,
				url,
				character = String.fromCharCode(e.keyCode);
						
			switch (e.keyCode) {
			case 8: //DELETE
				e.preventDefault();
				this.subtractCharacter();
				break;
			case 13: //RETURN
				slides = Vars.get('slides');
				slideNumber = this._list[this._selected].number;
				slide = slides.get(slideNumber);
				url = slide.get('url');
				
				router.navigate(url, {trigger: true});
				this.toggle();
				break;
			case 38: //UP
				this._selected = this._selected > 0 ? this._selected - 1 : this._selected;
				break;
			case 40: //DOWN
				this._selected = this._selected < this._list.length - 1 ? this._selected + 1 : this._selected;
				break;
			}
			
			//number
			if (e.keyCode > 47 && e.keyCode < 58) {
				this.typing(character);
			}

			//letter
			if (e.keyCode > 64 && e.keyCode < 91) {
				this.typing(character);
			}
			
			if (this._list.length > 0) {
				this.updateSelected();
			}
		},
		
		activate: function () {
			this.resetList();
			this._selected = Vars.get('currentSlide');
			this.populateList();
			this.addSearchInput();
			this.updateSelected();
			this.addEventListeners();
		},
		
		deactivate: function () {
			this.$el.empty();
			this.removeEventListeners();
		},
		
		addEventListeners: function () {
			UserEvent.on('keydown', this.keydown, this);
		},
		
		removeEventListeners: function () {
			UserEvent.off('keydown', this.keydown);
		},
		
		updateSelected: function () {
			$('.selected').removeClass('selected');
			$('.primed').removeClass('primed');
			$('.next').removeClass('next');
			$('.prev').removeClass('prev');
			
			element = this._list[this._selected].element;
			element.addClass('selected');
			
			if (this._selected < this._list.length - 1) {
				next = this._list[this._selected + 1].element;
				next.addClass('primed');
				next.addClass('next');
			}
			
			if (this._selected > 0) {
				prev = this._list[this._selected - 1].element;
				prev.addClass('primed');
				prev.addClass('prev');
			}
						
			TweenMax.to($('.hud-list'), 0.2, {y: -($(element).outerHeight() * this._selected) + (window.innerHeight / 2)});	
		},
		
		addSearchInput: function () {
			var $input;
			
			$input = $('<div id="hud-input" class="hud-input">');
			this.$el.append($input);
			
			setTimeout(function () {
				$input.addClass('in');
			}, 10);
		},
		
		resetList: function () {
			var slides = Vars.get('slides'),
				i;
							
			this._list = [];
			for (i = 0; i < slides.length; i += 1) {
				this._list.push({number: i, name: slides.get(i).get('name')});
			}
		},
		
		populateList: function () {
			var i,
				$list,
				$listItem,
				item;
			
			$list = $('<ul class="hud-list">');
			
			for (i = 0; i < this._list.length; i += 1) {
				item = this._list[i];
				$listItem = $('<li class="hud-list-item">');
				$listItem.html(item.number + ': ' + item.name);
				$list.append($listItem);
				item.element = $listItem;
			}
			
			this.$el.append($list);
		},
		
		toggle: function () {
			if (this._visible == true) {
				this.$el.hide();
				this.deactivate();
			} else {
				this.$el.show();
				this.activate();
			}
			
			this._visible = !this._visible;
		},
		
		typing: function (character) {
			var $input = $('#hud-input'),
				term;
			
			$input.html($input.html() + character);
			term = $input.html();
			
			this.search(term);
		},
		
		search: function (term) {
			this._list = [];
			
			if (!isNaN(term)) {
				this.searchNumbers(term);
			} else {
				this.searchString(term);
			}
			
			$('.hud-list').remove();
			this.populateList();
			this._selected = 0;
		},
		
		searchNumbers: function (term) {
			var i, j = 0,
				slideNumber,
				slides = Vars.get('slides');
			
			for (i = 0; i < slides.length; i += 1) {
				term = term.toString();
				slideNumber = i.toString();
				if (slideNumber.search(term) === 0) {
					this._list.push({number: i, name: slides.get(i).get('name')});
				} else {
					j += 1;
				}
			}
			
		},
		
		searchString: function (term) {
			var i, j = 0,
				slideTitle,
				slides = Vars.get('slides');
						
			for (i = 0; i < slides.length; i += 1) {
				slideTitle = slides.get(i).get('name').toUpperCase();				
				if (slideTitle.search(term) === 0) {
					this._list.push({number: i, name: slides.get(i).get('name')});
				} else {
					j += 1;
				}	
			}

		},
		
		subtractCharacter: function () {
			var origString,
				newString, 
				$input = $('#hud-input');
				
			origString = $input.html();
			newString = origString.substr(0, origString.length - 1);

			$input.html(newString);

			this.search(newString);
		}
		
	});
	
	return HudView;
});