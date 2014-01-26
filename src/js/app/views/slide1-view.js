define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		WireFragShader = require('text!app/shaders/wire.fs'),
		WireVertShader = require('text!app/shaders/wire.vs'),
		SlideBlurView = require('app/views/slide-blur-view'),
		Slide1View,
		postprocessing;
	
	require('tweenmax');
	require('three');
	require('app/shaders/BokehShader');
	require('app/post/BloomPass');
	require('app/post/EffectComposer');
	require('app/post/MaskPass');
	require('app/post/RenderPass');
	require('app/post/SavePass');
	require('app/post/ShaderPass');
	require('app/shaders/CopyShader');
	require('app/shaders/HorizontalTiltShiftShader');
	require('app/shaders/LuminosityShader');
	require('app/shaders/NormalMapShader');
	require('app/shaders/VerticalTiltShiftShader');
		
	Slide1View = SlideBlurView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');
						
			if (view == this) {
				this.in = true;
				this.delta = 1000;
				this.setup();
			}
		},
		
		desolve: function () {
			if (this.in) {
				this.in = false;
				clearInterval(this.interval);
				this.destroy();
			}
		},
		
		render: function () {
			if (this.in) {
				this.delta += 0.2;
				
				for (var i = 0; i < this.wireGeometry.vertices.length; i += 1) {
					var wireV = this.wireGeometry.vertices[i], 
						planeV = this.planeGeometry.vertices[i], 
						particleV = this.particleGeometry.vertices[i],
                        newZ;
					
	                //wireV.z = Math.sin(this.delta + vertice.y) * Math.cos(this.delta + vertice.x) * 50;
	                //wireV.y += Math.sin(i / this.delta) * 10;
	                //wireV.x -= Math.cos(i / this.delta) * 10;
	 				
                    //newZ = Math.sin(this.delta + planeV.y) * Math.cos(this.delta + planeV.y) * Math.cos(this.delta + planeV.y) * 100;
	 				
                    //sombrero function
                    var r = Math.sqrt(particleV.x * particleV.x + particleV.y * particleV.y) + this.delta;
                    var value = Math.sin(r) / r;
                    newZ = value * 100000;

                    planeV.z = particleV.z = wireV.z = newZ;
				}
				
				this.wireGeometry.verticesNeedUpdate = true;
				this.planeGeometry.verticesNeedUpdate = true;
				this.particleGeometry.verticesNeedUpdate = true;
				
				//this.camera.position.z = 1000 + Math.sin(this.delta) * 1000;
				//postprocessing.bokeh_uniforms[ "focus" ].value = 1.0 + Math.sin(this.delta) * 0.1;
				
				this.renderer.clear();
				
				if (postprocessing) {
					// Render scene into texture
					this.scene.overrideMaterial = null;
					this.renderer.render( this.scene, this.camera, postprocessing.rtTextureColor, true );
					// Render depth into texture
					this.scene.overrideMaterial = this.material_depth;
					this.renderer.render( this.scene, this.camera, postprocessing.rtTextureDepth, true );
					// Render bokeh composite
					this.renderer.render( postprocessing.scene, postprocessing.camera );
				} else {
					this.renderer.render( this.scene, this.camera );
				}
				
			}
		},
		
		setup: function () {
			var width = window.innerWidth,
				height = window.innerHeight,
				attributes,
				uniforms;
				
			this.canvas = this.$el.find('canvas')[0];
			
			this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
			this.renderer.setSize( width, height );
			this.renderer.setClearColor( 0x324448, 1 );
			//this.renderer.gammaInput = true;
			//this.renderer.gammaOutput = true;
			//this.renderer.autoClear = false;
						
			this.scene = new THREE.Scene();
			//this.scene.fog = new THREE.Fog( 0x020d17, 500, 1000 );

			this.camera = new THREE.PerspectiveCamera( 70, width / height, 2, 10000 );
			this.camera.position.set( 0, 0, 2000 );
			
			this.projector = new THREE.Projector();
			this.mouse = new THREE.Vector2();
			
			var pointLight = new THREE.AmbientLight(0xffffff);
			this.scene.add(pointLight)
			
			var pointLight = new THREE.PointLight(0xffffff, 0.6);
			pointLight.position.z = 3490;
			this.scene.add(pointLight)
			
			this.addDome();
			this.addWires();

			this.addPlane();
			this.addParticles();
			
			this.material_depth = new THREE.MeshDepthMaterial();
			
			this.addPostProcessing();
			
			$(document).bind('mousedown', this.handle_MOUSE_DOWN.bind(this));
			$(document).bind('mouseup', this.handle_MOUSE_UP.bind(this));
			$(document).bind('mousemove', this.handle_MOUSE_MOVE.bind(this));
			
			this.interval = setInterval(this.render.bind(this), 100);
		},
		
		handle_MOUSE_DOWN: function (e) {
            e.preventDefault();

			this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 0.5 );
            this.projector.unprojectVector( vector, this.camera );

            var ray = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );

            var intersects = ray.intersectObject(this.plane);
			
			if ( intersects.length > 0) {
				this.dragging = intersects[0].face;
			}
			
			// Parse all the faces
			for ( var i in intersects ) {
				this.planeMaterials[intersects[i].face.materialIndex] = new THREE.MeshLambertMaterial({ambient: 0xffffff, opacity: 0.4, transparent: true, vertexColors: THREE.FaceColors});				
			}			
		},
		
		handle_MOUSE_UP: function (e) {
			this.dragging = null;
		},
		
		handle_MOUSE_MOVE: function (e) {			
			if (this.dragging) {
				
				var distanceY = e.pageY - this.mouse.y;
				
				console.log('vertices', this.planeGeometry.vertices[this.dragging.a]);
				this.planeGeometry.vertices[this.dragging.a].z = distanceY;
				this.planeGeometry.vertices[this.dragging.b].z = distanceY;
				this.planeGeometry.vertices[this.dragging.c].z = distanceY;
				
				this.wireGeometry.vertices[this.dragging.a].z = distanceY;
				this.wireGeometry.vertices[this.dragging.b].z = distanceY;
				this.wireGeometry.vertices[this.dragging.c].z = distanceY;
				
				this.particleGeometry.vertices[this.dragging.a].z = distanceY;
				this.particleGeometry.vertices[this.dragging.b].z = distanceY;
				this.particleGeometry.vertices[this.dragging.c].z = distanceY;
				
				this.wireGeometry.verticesNeedUpdate = true;
				this.planeGeometry.verticesNeedUpdate = true;
				this.particleGeometry.verticesNeedUpdate = true;			
			}
			
		},
		
		addDome: function () {
			
			var geometry = new THREE.SphereGeometry(3500, 10, 10);
			var material = new THREE.MeshLambertMaterial({ambient: 0x314346, color: 0x7d9089, side: THREE.DoubleSide});
			
			var dome = new THREE.Mesh( geometry, material );
			this.scene.add(dome)
		},
		
		addWires: function () {
			
			this.wireGeometry = new THREE.PlaneGeometry( 4000, 4000, 10, 10 );
            THREE.GeometryUtils.triangulateQuads(this.wireGeometry);
			
			this.wireAttributes = {
				displacement: 	{ type: 'v3', value: [] },
				customColor: 	{ type: 'c', value: [] },
				customAlpha: 	{ type: 'f', value: [] }
			};
			
			this.wireUniforms = {
				amplitude: 	{ type: "f", value: 5.0 },
				opacity:   	{ type: "f", value: 0.3 },
				color:     	{ type: "c", value: new THREE.Color( 0xffffff ) },
				fogColor: 	{ type: "c", value: new THREE.Color( 0x020d17 )},
				fogNear:  	{ type: "f", value: 500.0},
				fogFar:  	{ type: "f", value: 1000.0}
			};

			this.wireMaterial = new THREE.ShaderMaterial( {
				uniforms:       this.wireUniforms,
				attributes:     this.wireAttributes,
				vertexShader:   WireVertShader,
				fragmentShader: WireFragShader,
				blending:       THREE.AdditiveBlending,
				fog: 			true,
				depthTest:      false,
				transparent:    true,
				wireframe: 		true,
				wireframeLinewidth: 1.0
			});            
			
			this.wires = new THREE.Mesh(this.wireGeometry, this.wireMaterial);
			this.wires.rotation.set(-1.1, 0, -1.3)
			this.scene.add(this.wires);
			
			//color
			var vertices = this.wires.geometry.vertices;
			var displacement = this.wireAttributes.displacement.value;
			var color = this.wireAttributes.customColor.value;
			var opacity = this.wireAttributes.customAlpha.value;
			
			for( var v = 0; v < vertices.length; v += 1 ) {
				displacement[ v ] = new THREE.Vector3();
				color[ v ] = new THREE.Color( 0xffffff );
			//	color[ v ].setHSL( v / vertices.length, 0.5, 0.5 );
				opacity[ v ] = 0.2 + (vertices[v].x / 3000) - (vertices[v].y / 4000);
			}
		},
		
		addPlane: function () {
			
			this.planeGeometry = new THREE.PlaneGeometry( 4000, 4000, 10, 10 );
			THREE.GeometryUtils.triangulateQuads(this.planeGeometry);
			
			this.planeMaterials = [];
			for (var i = 0; i < this.planeGeometry.faces.length; i += 1) {
				var material = new THREE.MeshLambertMaterial({ambient: 0xffffff, opacity: 0.0, transparent: true, vertexColors: THREE.FaceColors});
				this.planeMaterials.push(material);
				this.planeGeometry.faces[i].materialIndex = i;
			}
			
			this.plane = new THREE.Mesh(this.planeGeometry, new THREE.MeshFaceMaterial( this.planeMaterials ));
			this.plane.rotation.set(-1.1, 0, -1.3)
			this.scene.add(this.plane);
			
			for (var i = 0; i < this.planeGeometry.faces.length; i += 1) {
				var face = this.planeGeometry.faces[i];
				if (face.centroid.x < 0 && face.centroid.x > -400 ||
					face.centroid.x < 800 && face.centroid.x > 400) 
				{
					this.planeMaterials[face.materialIndex] = new THREE.MeshLambertMaterial({ambient: 0xffffff, opacity: 0.4, transparent: true, vertexColors: THREE.FaceColors});
				}
			}
			
			this.planeGeometry.colorsNeedUpdate = true;
		},
		
		addParticles: function () {
			this.particleGeometry = new THREE.PlaneGeometry( 4000, 4000, 10, 10 );
			
			var sprite = THREE.ImageUtils.loadTexture( "assets/images/disc.png" );
			this.particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xffffff, size: 30, map: sprite, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9});
		
			this.particles = new THREE.ParticleSystem(this.particleGeometry, this.particleMaterial);
			this.particles.rotation.set(-1.1, 0, -1.3)
			this.scene.add(this.particles);
		},
		
		addPostProcessing: function () {
			var width = window.innerWidth,
				height = window.innerHeight;
			
			postprocessing = {};
			postprocessing.scene = new THREE.Scene();
			
			postprocessing.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
			postprocessing.camera.position.z = 100;

			postprocessing.scene.add( postprocessing.camera );

			var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
			postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
			postprocessing.rtTextureColor = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

			var bokeh_shader = THREE.BokehShader;
			postprocessing.bokeh_uniforms = THREE.UniformsUtils.clone( bokeh_shader.uniforms );
			postprocessing.bokeh_uniforms[ "tColor" ].value = postprocessing.rtTextureColor;
			postprocessing.bokeh_uniforms[ "tDepth" ].value = postprocessing.rtTextureDepth;
			postprocessing.bokeh_uniforms[ "focus" ].value = 0.97;
			postprocessing.bokeh_uniforms[ "aspect" ].value = window.innerWidth / window.innerHeight;

			postprocessing.materialBokeh = new THREE.ShaderMaterial( {
				uniforms: postprocessing.bokeh_uniforms,
				vertexShader: bokeh_shader.vertexShader,
				fragmentShader: bokeh_shader.fragmentShader
			} );

			postprocessing.quad = new THREE.Mesh( new THREE.PlaneGeometry( window.innerWidth, window.innerHeight ), postprocessing.materialBokeh );
			postprocessing.quad.position.z = -500;
			postprocessing.scene.add( postprocessing.quad );
		},
		
		destroy: function () {
			this.renderer.clear();
			
			this.scene.remove(this.plane);
			this.scene.remove(this.wires);
			this.scene.remove(this.wires2);
			this.scene.remove(this.particles);
		}
		
	});
	
	return Slide1View;
});
