/*global define createjs TweenMax Box2D Filters requestAnimationFrame*/
define(function (require) {
	
	require('tweenmax');
	require('vendor/box2d/Box2dWeb-2.1.a.3');
	require('vendor/CanvasFilters');

    var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		UIView,
        b2Vec2 = Box2D.Common.Math.b2Vec2, 
        b2BodyDef = Box2D.Dynamics.b2BodyDef, 
        b2Body = Box2D.Dynamics.b2Body, 
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef, 
        b2Fixture = Box2D.Dynamics.b2Fixture, 
        b2World = Box2D.Dynamics.b2World, 
        b2MassData = Box2D.Collision.Shapes.b2MassData, 
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, 
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, 
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
        b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
        b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef,
        angle = 0,
        tangle = 0,
        cup_left,
        cup_right,
        cup_bottom,
        view,
        mouseX, mouseY,
        particles = [],
        SCALE = 16;

	UIView = Backbone.View.extend({
		
        initialize: function () {
            var i,
                fixDef,
                bodyDef,
                jointDef,
                particle,
                debugDraw;
            
            this.el = document.getElementById('ui-button-canvas-blend');
            this.ctx = this.el.getContext('2d');

            this.fxcanvas = document.createElement('canvas');
            this.fxctx = this.fxcanvas.getContext('2d');

            this.img = new Image();
            this.img.src = './assets/images/buttons/blend_btn.png';

            this.world = new b2World(
                new b2Vec2(0, 60),    //gravity
                true //allow sleep
            ); 

            // definition
            fixDef = new b2FixtureDef();
            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.2;
            
            bodyDef = new b2BodyDef();
            
            // initials
            bodyDef.type = b2Body.b2_staticBody;
            fixDef.shape = new b2PolygonShape();
                
            // new def	
            fixDef.shape.SetAsOrientedBox(70 / SCALE, 10 / SCALE, new b2Vec2(0 / SCALE, 45 / SCALE), 0);
            bodyDef.position.Set(100 / SCALE, 100 / SCALE);
            cup_bottom = this.world.CreateBody(bodyDef);
            cup_bottom.CreateFixture(fixDef);

            // left and right side
            bodyDef.type = b2Body.b2_dynamicBody;
            // new def	
            fixDef.shape.SetAsBox(10 / SCALE, 90 / SCALE);
            fixDef.density = 50;
            fixDef.friction = 100;
            fixDef.restitution = 0;
            // wall
            bodyDef.position = cup_bottom.GetWorldPoint(new b2Vec2(-20 / SCALE, -30 / SCALE));
            cup_left = this.world.CreateBody(bodyDef);
            cup_left.CreateFixture(fixDef);
            cup_left.SetAngle(this.radians(20));
            // wall
            bodyDef.position = cup_bottom.GetWorldPoint(new b2Vec2(20 / SCALE, -30 / SCALE));
            cup_right = this.world.CreateBody(bodyDef); 
            cup_right.CreateFixture(fixDef);
            cup_right.SetAngle(this.radians(-20));
            
            // cup joints
            jointDef = new b2WeldJointDef();
            jointDef.Initialize(cup_left, cup_bottom, cup_bottom.GetWorldCenter(), new b2Vec2(1 / SCALE, 1 / SCALE));
            jointDef.enableLimit = true;
            this.world.CreateJoint(jointDef);
            
            jointDef.Initialize(cup_right, cup_bottom, cup_bottom.GetWorldCenter(), new b2Vec2(-1 / SCALE, 1 / SCALE));
            jointDef.enableLimit = true;
            this.world.CreateJoint(jointDef);

            // particles
            for (i = 0; i < 100; i += 1) {
            
                bodyDef.type = b2Body.b2_dynamicBody;
                bodyDef.inertiaScale = 1;
                bodyDef.linearDamping = 1;
                bodyDef.angularDamping = 1;		
                
                fixDef.shape = new b2CircleShape(1 / SCALE);
                fixDef.density = 1;
                fixDef.friction = 0.1;
                fixDef.restitution = 0.95;
                
                bodyDef.position.Set((90 + Math.random() * 20) / SCALE, (90 + Math.random() * 20) / SCALE);
                particle = this.world.CreateBody(bodyDef);
                particle.CreateFixture(fixDef);
                
                particles.push(particle);
            }
            
            //setup debug draw
            //debugDraw = new b2DebugDraw();
            //debugDraw.SetSprite(this.ctx);
            //debugDraw.SetDrawScale(SCALE);
            //debugDraw.SetFillAlpha(0.5);
            //debugDraw.SetLineThickness(0.5);
            //debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
            //this.world.SetDebugDraw(debugDraw);
            
            this.el.addEventListener('mousemove', this.handle_MOUSEMOVE.bind(this));
            this.el.addEventListener('mouseout', this.handle_MOUSEOUT.bind(this));
            //this.render();
        },

        handle_MOUSEOUT: function (event) {
            var obj = {angle: angle};
            new TweenMax.to(obj, 0.2, {angle: 0, onUpdate: function () {
                tangle = obj.angle;
            }});
        },

        handle_MOUSEMOVE: function (event) {
            var o, a;

            mouseX = event.offsetX;
            mouseY = event.offsetY;
            o = 200 - mouseY;
            a = 100 - mouseX;
            tangle = Math.min(this.radians(90), Math.max(this.radians(-90), Math.atan2(-a, o)));
        },

		render: function (e) {
            var pos,
                i,
                pixels,
                filtered;

            this.world.Step(
                1 / 60,   //frame-rate
                10,		//velocity iterations
                8		//position iterations
            );
            
            // calc and set cup angle
            angle += 0.1 * (tangle - angle);
            cup_bottom.SetAngle(angle);
            
            this.fxctx.clearRect(0, 0, 200, 200);
            this.ctx.clearRect(0, 0, this.el.width, this.el.height);
            this.ctx.canvas.width = this.ctx.canvas.width;

            this.ctx.fillStyle = "white";
            this.ctx.arc(100, 100, 100, 0, 2 * Math.PI, false);
            this.ctx.fill();

            // draw
            for (i in particles) {
                if (i) {
                    pos = particles[i].GetPosition();
                    this.fxctx.shadowBlur = 9;
                    this.fxctx.shadowOffsetX = 0;
                    this.fxctx.shadowOffsetY = 0;
                    this.fxctx.fillStyle = "#FF0000";
                    this.fxctx.shadowColor = "#FF0000";

                    this.fxctx.beginPath();
                    this.fxctx.arc(pos.x * SCALE, pos.y * SCALE, 2, 0, Math.PI * 2, true); 
                    this.fxctx.closePath();
                    this.fxctx.fill();
                }
            }

            pixels = this.fxctx.getImageData(0, 0, 200, 200);
            filtered = Filters.filterPixels(Filters.threshold2, pixels, 80, 50);
            for (i = 0; i < 200 * 200 * 4; i += 4) {
                if (filtered.data[i] === 0) {
                    filtered.data[i] = 232;
                    filtered.data[i + 1] = 97;
                    filtered.data[i + 2] = 49;
                }
            }

            this.fxctx.putImageData(filtered, 0, 0);
            
            //image
            this.ctx.save();
            this.ctx.translate(100, 100);
            this.ctx.rotate(angle);
            this.ctx.drawImage(this.img, -80, -80);
            this.ctx.restore();

            //goo
            this.ctx.globalCompositeOperation = "multiply";
            this.ctx.drawImage(this.fxcanvas, 0, 0);

            //this.world.DrawDebugData();
            this.world.ClearForces();
            
            //this.interval = requestAnimationFrame(this.render.bind(this));
        },

        radians: function (degrees) {
            return degrees * (Math.PI / 180);
        },

		destroy: function () {
            //cancelAnimationFrame(this.interval);
            this.el.removeEventListener('mousemove');
            this.el.removeEventListener('mouseout');
            
            particles = [];
            this.world.ClearForces();
            this.world = null;
        }
		
	});
	
	return UIView;
});

