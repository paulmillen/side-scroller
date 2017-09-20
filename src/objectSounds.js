'use strict';

function ObjectSounds(score, soundBank) {
  this.score = score;
  this.scoreTracker = score.showPoints();
  this.soundBank = soundBank || new SoundBank
  this.crashes = [  this.soundBank.glassCrash,
                    this.soundBank.metalCrash,
                    this.soundBank.chinaCrash,
                    this.soundBank.woodCrash  ];
  this.ping = this.soundBank.ping;
}

ObjectSounds.prototype.setObjectVols = function () {
  this.soundBank.setObjectVols();
};

ObjectSounds.prototype.loadObjectSounds = function () {
  this._playCrash();
};

ObjectSounds.prototype._playCrash = function () {
  if(this.score.showPoints() > this.scoreTracker) {
    this._selectCrash().play();
  } else if(this.score.showPoints() < this.scoreTracker) {
    this._playPing();
  }
  this.scoreTracker = this.score.showPoints();
};

ObjectSounds.prototype._selectCrash = function () {
  return this.crashes[Math.floor(Math.random() * this.crashes.length)]
};

ObjectSounds.prototype._playPing = function () {
  this.ping.play();
};