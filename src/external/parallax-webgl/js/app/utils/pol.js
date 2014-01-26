define([], function (require) {
		
	var POL = function (vertices, obj) {
		var comma,
			i;
			
		if (vertices instanceof Array === true) {
			this.vertices = vertices;
		} else if (typeof(vertices) == 'string') {
			comma = vertices.indexOf(' ') > vertices.indexOf(',') ? false : true; //determine if comma or space delimeted

			if (comma) {
				this.vertices = vertices.split(',');
				for (i = 0; i < this.vertices.length; i += 1) {
					this.vertices[i] = this.vertices[i].split(' ');
				}
			} else {
				this.vertices = vertices.split(' ');
				for (i = 0; i < this.vertices.length; i += 1) {
					this.vertices[i] = this.vertices[i].split(',');
				}
			}
		}
	};
	
	POL.prototype.setContext = function (ctx) {
		this.ctx = ctx;
	};

	POL.prototype.setClip = function (clipTarget) {
		this.clipTarget = clipTarget;
	};
	
	POL.prototype.getVertices = function () {
		return this.vertices;
	};
	
	/**
	* create canvas polygon out of vertices
	*/
	POL.prototype.canvasPolygon = function (vertices) {
		var i,
			vertices = vertices ? vertices : this.vertices;

		if (this.ctx) {
			this.ctx.beginPath();
			this.ctx.moveTo(vertices[0][0], vertices[0][1]);

			for (i = 1; i < vertices.length; i += 1) {
				this.ctx.lineTo(vertices[i][0], vertices[i][1]);
			}

			this.ctx.closePath();
		}
	};

	/**
	* create clip path out of vertices
	*/
	POL.prototype.clipPolygon = function (vertices) {
		var i,
			clipString,
			vertices = vertices ? vertices : this.vertices;

		if (this.clipTarget) {
			clipString = "polygon(";

			for (i = 0; i < vertices.length; i += 1) {
				clipString += vertices[i][0] + "px " + vertices[i][1] + 'px';

				if (i < vertices.length - 1) {
					clipString += ", ";
				}
			}

			clipString += ")";
			this.clipTarget.style.webkitClipPath = clipString;
		}
	};
		

	return POL;
});
