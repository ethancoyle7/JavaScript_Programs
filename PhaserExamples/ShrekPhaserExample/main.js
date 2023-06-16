var game = new Phaser.Game(500, 500, Phaser.AUTO, 'game', {
  preload: preload,
  create: create,
  update: update
});

var Shrek;
var BadMan;
var cursors;
var runButton;
var chaseTimer;
var music;
var music2;
var music3;
var elapsedTime;
var timeText;
var pointSystem;
var pointText;
var originalSize;
var badManGrowRate = 0.02; // 2% growth every 5 seconds
var badManShrinkRate = 0.01; // 1% shrink every 10 seconds
var shrekGrowRate = 0.05; // 5% growth every 10 seconds
var blocks; // Variable to store the block group
var blockGroup; // Variable to store the block group

function preload() {
  game.load.audio('theme', 'assets/ShrekMusic (2).mp3');
  game.load.spritesheet('Shrek', 'assets/Shrekiee.png', 36, 40, 6);
  game.load.spritesheet('BadMan', 'assets/EvilMan.png', 36, 40, 6);
  game.load.image('background', 'assets/background.png');
  game.load.image('block', 'assets/Block.png');
  //SWAMPINTRO.mp3
  game.load.audio('theme2', 'assets/SWAMPINTRO.mp3');
  
  game.load.audio('theme3', 'assets/CantCatchMe.mp3');

}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#5C94FC';

  chaseTimer = game.time.events.add(Phaser.Timer.SECOND * 5, startChase, this);

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  // Set the background image
  var background = game.add.sprite(0, 0, 'background');
  

  // Scale the background image to fit the screen
  background.width = game.width;
  background.height = game.height;

  // Send the background image to the back
  game.world.sendToBack(background);
  game.scale.refresh();
  // Create a group for blocks
  music2 = game.add.audio('theme2');
  music2.play('', 0, 1, true);
  


blocks = game.add.group();
addBlock2(300, game.world.height - 240);


   // ...
 

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
    sprite: game.add.sprite(40, game.world.height - 40, 'BadMan'),
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

  music = game.add.audio('theme');
  music.play('', 0, 0.2, true);
  

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
}

function update() {
  game.physics.arcade.collide(Shrek.sprite, BadMan.sprite, restartGame, null, this);
  Shrek.noMovement = true;
  game.physics.arcade.collide(Shrek.sprite, blocks); // Enable collision between Shrek and blocks

  // ...

  

  if (!BadMan.noMovement) {
    if (BadMan.sprite.x < Shrek.sprite.x) {
      BadMan.sprite.body.velocity.x += 2;
    } else {
      BadMan.sprite.body.velocity.x -= 2;
    }
  }

  if (!BadMan.noMovement) {
    BadMan.sprite.animations.play('angry');

    // Flip BadMan sprite sheet based on movement direction
    if (BadMan.sprite.body.velocity.x > 0) {
      BadMan.sprite.scale.x = -1; // Normal scale
    } else if (BadMan.sprite.body.velocity.x < 0) {
      BadMan.sprite.scale.x = 1; // Flipped horizontally
    }
  }

  if (BadMan.noMovement === true) {
    BadMan.sprite.animations.play('angry');
  }

  if (BadMan.noMovement === false) {
    BadMan.sprite.animations.play('angry');
  }

  if (cursors.left.isDown) {
    if (Shrek.direction !== 'left') {
      Shrek.sprite.scale.x *= -1;
      Shrek.direction = 'left';
    }
    if (
      Shrek.sprite.body.velocity.x === 0 ||
      (Shrek.sprite.animations.currentAnim.name !== 'left' && Shrek.sprite.body.onFloor())
    ) {
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
    Shrek.noMovement = false;
  } else if (cursors.right.isDown) {
    if (Shrek.direction !== 'right') {
      Shrek.sprite.scale.x *= -1;
      Shrek.direction = 'right';
    }
    if (
      Shrek.sprite.body.velocity.x === 0 ||
      (Shrek.sprite.animations.currentAnim.name !== 'left' && Shrek.sprite.body.onFloor())
    ) {
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
    Shrek.noMovement = false;
  } else {
    Shrek.sprite.animations.play('wait');
    Shrek.sprite.body.velocity.x = 0;
    Shrek.noMovement = true;
  }

  if (cursors.up.isDown && (Shrek.sprite.body.onFloor() || isOnBlock(Shrek.sprite))) {
  Shrek.sprite.body.velocity.y = -800;
  Shrek.noMovement = false;
}
  

  elapsedTime += game.time.physicsElapsed;
  timeText.text = 'Time: ' + Math.floor(elapsedTime) + 's';
}

function startChase() {
  BadMan.noMovement = false;
}

function increaseBadManSize() {
  Shrek.sprite.scale.setTo(
    Shrek.sprite.scale.x / 1.02,
    Shrek.sprite.scale.y / 1.02
  );
  BadMan.sprite.scale.setTo(
    BadMan.sprite.scale.x * 1.5,
    BadMan.sprite.scale.y * 1.5
  );
}

function decreaseBadManSize() {
  Shrek.sprite.scale.setTo(
    Shrek.sprite.scale.x * 1.5,
    Shrek.sprite.scale.y * 1.5
  );
  BadMan.sprite.scale.setTo(
    BadMan.sprite.scale.x / 1.2,
    BadMan.sprite.scale.y / 1.2
  );
}


function increasePoints() {
  pointSystem += 1;
  pointText.text = 'Points: ' + pointSystem;
  if (pointSystem%2 == 0){
    music3 = game.add.audio('theme3');
    music3.play('', 0, 1, true);
  }

  
}
function addBlock2(x, y) {
  var block = game.add.sprite(x, y, 'block');
  block.scale.setTo(1.0, 1.0);
  block.anchor.x = 0.5;
  block.anchor.y = 0.5;
  game.physics.enable(block);
  block.body.immovable = true; // Make the block immovable
  block.body.allowGravity = false; // Disable gravity for the block
  blocks.add(block); // Add the block to the group
  //block.body.checkCollision.up = false; 
}
function getBlockBelow(sprite) {
  var blockBelow = null;
  blocks.forEachAlive(function(block) {
    if (sprite.body.bottom >= block.body.top && sprite.body.bottom <= block.body.bottom) {
      blockBelow = block;
    }
  }, this);
  return blockBelow;
}
function isOnBlock(sprite) {
  var onBlock = false;
  blocks.forEachAlive(function(block) {
    if (game.physics.arcade.overlap(sprite, block) && sprite.body.bottom <= block.body.top + 5) {
      onBlock = true;
    }
  }, this);
  return onBlock;
}



function restartGame() {
  game.time.events.add(Phaser.Timer.SECOND, function() {
    music.stop();
    game.state.start(game.state.current);
  }, this);
}
