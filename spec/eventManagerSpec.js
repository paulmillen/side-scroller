'use strict';

describe('EventManager', function () {
  var carolyn;
  var object;
  var event;
  var engine;
  var worldBuilder;

  beforeEach(function () {
    worldBuilder = new WorldBuilder();
    engine = {};
    carolyn = new EventManager(engine);
    object = {action: function () {}};
    event = {pairs: [{bodyA: {label: ''}, bodyB: {label: ''}}]};
  });

  describe('#playerCollisionEvent', function () {
    it('calls the specified object and action if bodyA is a player sensor', function () {
      event.pairs[0].bodyA.label = 'playerSensor';
      spyOn(object, 'action');
      carolyn.playerCollisionEvent(event, object, 'action');
      expect(object.action).toHaveBeenCalled();
    });

    it('calls the specified object and action if bodyB is a player sensor', function () {
      event.pairs[0].bodyB.label = 'playerSensor';
      spyOn(object, 'action');
      carolyn.playerCollisionEvent(event, object, 'action');
      expect(object.action).toHaveBeenCalled();
    });


    it('otherwise does nothing', function () {
      spyOn(object, 'action');
      carolyn.playerCollisionEvent(event, object, 'action');
      expect(object.action).not.toHaveBeenCalled();
    });
  });

  describe('#playerCollision', function () {
    beforeEach(function () {
      spyOn(Matter.Events, 'on');
    });

    it('creates a Matter event on the game engine', function () {
      carolyn.playerCollision(object, 'eventName', 'action');
      expect(Matter.Events.on).toHaveBeenCalled();
    });

    it('passes in the playerCollisionEvent function in a callback', function () {
      spyOn(carolyn, 'playerCollisionEvent');
      carolyn.playerCollision();
      Matter.Events.on.calls.allArgs()[0][2]();
      expect(carolyn.playerCollisionEvent).toHaveBeenCalled();
    });
  });

  describe('#objectFloorCollisionEvent', function () {
    beforeEach(function () {
      spyOn(worldBuilder, 'objectCollided');
    });

    it('calls objectOnFloor on the passed-in worldBuilder if both conditions are met', function () {
      event.pairs[0].bodyA.label = 'object';
      event.pairs[0].bodyB.label = 'floor';
      carolyn.objectFloorCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).toHaveBeenCalled();
    });

    it('does nothing if bodyA is not an object', function () {
      event.pairs[0].bodyA.label = 'player';
      event.pairs[0].bodyB.label = 'floor';
      carolyn.playerCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).not.toHaveBeenCalled();
    });

    it('does nothing if bodyB is not the floor', function () {
      event.pairs[0].bodyA.label = 'object';
      event.pairs[0].bodyB.label = 'platform';
      carolyn.playerCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).not.toHaveBeenCalled();
    });

    it('does nothing if neither body matches the conditions', function () {
      event.pairs[0].bodyA.label = 'player';
      event.pairs[0].bodyB.label = 'platform';
      carolyn.playerCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).not.toHaveBeenCalled();
    });
  });

  describe('#objectCollision', function () {
    beforeEach(function () {
      spyOn(Matter.Events, 'on');
    });

    it('creates a Matter event on the game engine', function () {
      carolyn.objectCollision();
      expect(Matter.Events.on).toHaveBeenCalled();
    });

    it('passes in the objectFloorCollisionEvent function in a callback if given as an argument', function () {
      spyOn(carolyn, 'objectFloorCollisionEvent');
      carolyn.objectCollision(worldBuilder, 'objectFloorCollisionEvent');
      Matter.Events.on.calls.allArgs()[0][2]();
      expect(carolyn.objectFloorCollisionEvent).toHaveBeenCalled();
    });

    it('passes in the playerCactusCollisionEvent function in a callback if given as an argument', function () {
      spyOn(carolyn, 'playerCactusCollisionEvent');
      carolyn.objectCollision(worldBuilder, 'playerCactusCollisionEvent');
      Matter.Events.on.calls.allArgs()[0][2]();
      expect(carolyn.playerCactusCollisionEvent).toHaveBeenCalled();
    });
  });

  describe('#playerCactusCollisionEvent', function () {
    beforeEach(function () {
      spyOn(worldBuilder, 'objectCollided');
    });

    it('calls cactusTouched on the worldBuilder if bodyA is the player and bodyB is a cactus', function () {
      event.pairs[0].bodyA.label = 'player';
      event.pairs[0].bodyB.label = 'cactus';
      carolyn.playerCactusCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).toHaveBeenCalled();
    });

    it('calls cactusTouched on the worldBuilder if bodyB is the player and bodyA is a cactus', function () {
      event.pairs[0].bodyA.label = 'cactus';
      event.pairs[0].bodyB.label = 'player';
      carolyn.playerCactusCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).toHaveBeenCalled();
    });

    it('does nothing if bodyA is the player but bodyB is not a cactus', function () {
      event.pairs[0].bodyA.label = 'player';
      event.pairs[0].bodyB.label = 'floor';
      carolyn.playerCactusCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).not.toHaveBeenCalled();
    });

    it('does nothing if bodyB is a cactus but bodyA is not the player', function () {
      event.pairs[0].bodyA.label = 'object';
      event.pairs[0].bodyB.label = 'platform';
      carolyn.playerCactusCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).not.toHaveBeenCalled();
    });

    it('does nothing if bodyB is the player but bodyA is not a cactus', function () {
      event.pairs[0].bodyA.label = 'floor';
      event.pairs[0].bodyB.label = 'player';
      carolyn.playerCactusCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).not.toHaveBeenCalled();
    });

    it('does nothing if bodyA is a cactus but bodyB is not the player', function () {
      event.pairs[0].bodyA.label = 'cactus';
      event.pairs[0].bodyB.label = 'platform';
      carolyn.playerCactusCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).not.toHaveBeenCalled();
    });

    it('does nothing if neither body is a cactus or the player', function () {
      event.pairs[0].bodyA.label = 'object';
      event.pairs[0].bodyB.label = 'platform';
      carolyn.playerCactusCollisionEvent(event, worldBuilder);
      expect(worldBuilder.objectCollided).not.toHaveBeenCalled();
    });
  });
});
