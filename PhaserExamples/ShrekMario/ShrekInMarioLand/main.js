var game = new Phaser.Game(256, 256, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.tilemap('objects', 'assets/map1-1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/items2.png');
  game.load.audio('theme', 'assets/ShrekMusic (2).mp3');
  game.load.spritesheet('Shrek', 'assets/Shrekiee.png', 36, 40, 6);
  game.load.spritesheet('BadMan', 'assets/EvilMan.png', 36, 40, 6);
}

var map;
var layer;
var cursors;
var jumpButton;
var runButton;
var result;

var Shrek = {
  sprite: undefined,
  direction: 'right',
  doNothing: true
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#5C94FC';
  chaseTimer = game.time.events.add(Phaser.Timer.SECOND * 5, startChase, this);

  map = game.add.tilemap('objects');
  map.addTilesetImage('items', 'tiles');
  layer = map.createLayer('Capa de Patrones 1');
  layer.resizeWorld();
  layer.wrap = true;
  map.setCollisionBetween(14, 16);
  map.setCollisionBetween(21, 22);
  map.setCollisionBetween(27, 28);
  map.setCollisionByIndex(10);
  map.setCollisionByIndex(13);
  map.setCollisionByIndex(17);
  map.setCollisionByIndex(40);
  music = game.add.audio('theme');
  music.play('', 0, 0.2, true);

  Shrek = {
    sprite: game.add.sprite(100, game.world.height - 80, 'Shrek'),
    direction: 'right',
    noMovement: true
  };
  Shrek.sprite.scale.setTo(1.0, 1.0);
  Shrek.sprite.anchor.x = 0.5;
  Shrek.sprite.anchor.y = 1.0;
  Shrek.sprite.animations.add('walk');
  game.physics.enable(Shrek.sprite);
  Shrek.sprite.body.bounce.y = 0;
  Shrek.sprite.body.linearDamping = 1;
  Shrek.sprite.body.collideWorldBounds = true;
  Shrek.sprite.animations.add('left', [2, 4, 5], 10, true);
  Shrek.sprite.animations.add('wait', [0], 10, true);
  Shrek.sprite.animations.add('jump', [2, 4, 5], 10, true);
  Shrek.sprite.body.fixedRotation = true;
  game.camera.follow(Shrek.sprite);

  BadMan = {
    sprite: game.add.sprite(100, game.world.height - 80, 'BadMan'),
    direction: 'left',
    noMovement: true
  };
  BadMan.sprite.anchor.x = 0.5;
  BadMan.sprite.anchor.y = 1.0;
  BadMan.sprite.scale.setTo(1.0, 1.0);
  originalSize = BadMan.sprite.scale.x;
  game.physics.enable(BadMan.sprite);
  BadMan.sprite.body.bounce.y = 0;
  BadMan.sprite.body.linearDamping = 1;
  BadMan.sprite.body.collideWorldBounds = true;
  BadMan.sprite.animations.add('angry', [0, 1, 2, 3, 4, 5], 5, true);
  BadMan.sprite.body.fixedRotation = true;

  game.physics.arcade.gravity.y = 700;

  cursors = game.input.keyboard.createCursorKeys();
  runButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  elapsedTime = 0;
  timeText = game.add.text(10, 10, 'Time: 0s', {
    fontSize: '16px',
    fill: '#00FF00' // Neon green color
  });

  pointSystem = 0;
  pointText = game.add.text(10, 30, 'Points: 0', {
    fontSize: '16px',
    fill: '#FFD700' // Shimmering golden color
  });
  game.time.events.loop(Phaser.Timer.SECOND * 10, increasePoints, this);

};

function update() {
  game.physics.arcade.collide(Shrek.sprite, layer);
  game.physics.arcade.collide(BadMan.sprite, layer);
  game.physics.arcade.collide(Shrek.sprite, BadMan.sprite, restartGame, null, this);

  Shrek.doNothing = true;
  BadMan.doNothing = true;

  if (!BadMan.noMovement) {
    if (BadMan.sprite.x < Shrek.sprite.x) {
      BadMan.sprite.body.velocity.x += 2;
    } else {
      BadMan.sprite.body.velocity.x -= 2;
    }
  }

  if (!BadMan.noMovement) {
    BadMan.sprite.animations.play('angry');

    if (BadMan.sprite.body.velocity.x > 0) {
      BadMan.sprite.scale.x = -1;
    } else if (BadMan.sprite.body.velocity.x < 0) {
      BadMan.sprite.scale.x = 1;
    }
  }

  if (BadMan.noMovement === true) {
    BadMan.sprite.animations.play('angry');
  }

  if (BadMan.noMovement === false) {
    BadMan.sprite.animations.play('angry');
  }

  // Obstacle detection and jumping logic for BadMan
  var tileHits = game.physics.arcade.collide(BadMan.sprite, layer);
  var tileY = Math.floor(BadMan.sprite.y / layer.tileHeight);

  if (BadMan.sprite.body.velocity.x > 0) {
    // Check for obstacles in front of BadMan
    var tileX = Math.floor((BadMan.sprite.right + 1) / layer.tileWidth);
    var tile = map.getTile(tileX, tileY, layer);
    if (tile && tile.index !== -1) {
      // There is an obstacle in front of BadMan, try to jump over it
      BadMan.sprite.body.velocity.y = -400;
      BadMan.doNothing = false;
    }
  } else if (BadMan.sprite.body.velocity.x < 0) {
    // Check for obstacles in front of BadMan
    var tileX = Math.floor((BadMan.sprite.left - 1) / layer.tileWidth);
    var tile = map.getTile(tileX, tileY, layer);
    if (tile && tile.index !== -1) {
      // There is an obstacle in front of BadMan, try to jump over it
      BadMan.sprite.body.velocity.y = -400;
      BadMan.doNothing = false;
    }
  }

  if (cursors.left.isDown) {
    if (Shrek.direction != 'left') {
      Shrek.sprite.scale.x *= -1;
      Shrek.direction = 'left';
    }
    if (Shrek.sprite.body.velocity.x == 0 || (Shrek.sprite.animations.currentAnim.name != 'left' && Shrek.sprite.body.onFloor())) {
      Shrek.sprite.animations.play('left', 10, true);
    }

    Shrek.sprite.body.velocity.x -= 5;
    if (runButton.isDown) {
      if (Shrek.sprite.body.velocity.x < -200) {
        Shrek.sprite.body.velocity.x = -200;
      }
    } else {
      if (Shrek.sprite.body.velocity.x < -120) {
        Shrek.sprite.body.velocity.x = -120;
      }
    }
    Shrek.doNothing = false;
  } else if (cursors.right.isDown) {
    if (Shrek.direction != 'right') {
      Shrek.sprite.scale.x *= -1;
      Shrek.direction = 'right';
    }
    if (Shrek.sprite.body.velocity.x == 0 || (Shrek.sprite.animations.currentAnim.name != 'left' && Shrek.sprite.body.onFloor())) {
      Shrek.sprite.animations.play('left', 10, true);
    }
    Shrek.sprite.body.velocity.x += 5;
    if (runButton.isDown) {
      if (Shrek.sprite.body.velocity.x > 200) {
        Shrek.sprite.body.velocity.x = 200;
      }
    } else {
      if (Shrek.sprite.body.velocity.x > 120) {
        Shrek.sprite.body.velocity.x = 120;
      }
    }
    Shrek.doNothing = false;
  }
  if (cursors.up.justDown) {
    if (Shrek.sprite.body.onFloor()) {
      Shrek.sprite.body.velocity.y = -310;
      Shrek.sprite.animations.play('jump', 20, true);
      Shrek.doNothing = false;
    }
  }
  if (Shrek.doNothing) {
    if (Shrek.sprite.body.velocity.x > 10) {
      Shrek.sprite.body.velocity.x -= 10;
    } else if (Shrek.sprite.body.velocity.x < -10) {
      Shrek.sprite.body.velocity.x += 10;
    } else {
      Shrek.sprite.body.velocity.x = 0;
    }
    if (Shrek.sprite.body.onFloor()) {
      Shrek.sprite.animations.play('wait', 20, true);
    }
  }
  elapsedTime += game.time.physicsElapsed;
  timeText.text = 'Time: ' + Math.floor(elapsedTime) + 's';
}

function startChase() {
  BadMan.noMovement = false;
}

function increasePoints() {
  pointSystem += 1;
  pointText.text = 'Points: ' + pointSystem;
}

function restartGame() {
  game.time.events.add(Phaser.Timer.SECOND, function () {
    music.stop();
    game.state.start(game.state.current);
  }, this);
}

function render() {
  //game.debug.bodyInfo(Shrek.sprite, 32, 32);
}
