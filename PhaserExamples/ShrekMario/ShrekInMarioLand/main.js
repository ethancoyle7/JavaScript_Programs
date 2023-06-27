var game = new Phaser.Game(256, 256, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.tilemap('objects', 'assets/map1-1.json', null, Phaser.Tilemap.TILED_JSON);//
  game.load.image('tiles', 'assets/items2.png');// load the tiles
  game.load.audio('theme', 'assets/ShrekMusic (2).mp3');// lodaa the music
  game.load.spritesheet('Shrek', 'assets/Shrekiee.png', 36, 40, 6);// load shrek
  game.load.spritesheet('GreenBeastie', 'assets/BigBooger(1).png', 22, 43, 9);// load fiona
  //game.load.spritesheet('GreenBeastie2', 'assets/BoogerGirl.png', 33, 44, 3);// load fiona
  game.load.spritesheet('LordFartQuad', 'assets/EvilMan.png', 36, 40, 6);// load the bad man sprite sheet
  game.load.spritesheet('Dunky', 'assets/DoonkerBoy.png', 50, 62, 6);// load fiona
  //loading images on the screen to choose a character to play
  game.load.image('DonkeyStart', 'assets/DonkeySelect.png'); // Load the coin image
  game.load.image('FionaStart', 'assets/FionaSelect.png'); // Load the coin image
  game.load.image('ShrekStart', 'assets/ShrekSelect.png'); // Load the coin image
  game.load.image('BackgroundImage', 'assets/Scrollingbackground.png'); // Load the coin image
  game.load.image('StartBackground', 'assets/Menu.jpg'); // Load the coin image
  //load the HelloAudio.mp3
  game.load.audio('GetOutOfMySwamp', 'assets/HelloAudio.mp3');
  game.load.image("onion", "assets/Falling onions.png");
  game.load.image("DebrisShreks", "assets/FallingShreks.png");
  game.load.image('Block', 'assets/Block.png'); // Load the coin image

  // game.load.spritesheet('coin', 'assets/coin.png', 32, 32); // Load the coin sprite sheet

  // game.load.spritesheet('additionalSprite', 'assets/additionalSprite.png'); // Load the additional sprite image coins
}

var map;
var layer;
var cursors;
var jumpButton;
var runButton;
var result;
var CharacterSelected;
var CharacterName;
var promptText; 
var restartText;
var timeTextTween; // Declare timeTextTween variable outside any function scope


var background;
var StartBackgroundImage;
var timerEvent;
var totalTime = 120; // 2 minutes in seconds
var elapsedTime = 0;
var timeText;
var timer;
var seconds = 360;// 3 minute time 
var FionaStart, ShrekStart, DonkeyStart;
var checkOnionCount;
var steppingBlock; // Declare steppingBlock as a global variable
var steppingBlock2;
var steppingBlock3;
var steppingBlock4;
var steppingBlock5;
var steppingBlock6;
var steppingBlock7;
var steppingBlock8;
var steppingBlock9;
var steppingBlock10;
var onion;


//playable characters
var Shrek = {
  sprite: undefined,
  direction: 'right',
  doNothing: true
}
var Friona = {
  sprite: undefined,
  direction: 'right',
  doNothing: true
}
var Dunky = {
  sprite: undefined,
  direction: 'right',
  doNothing: true
}
var LordFartQuad = {
  sprite: undefined,
  direction: 'right',
  doNothing: true
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#5C94FC';CharacterSelected = false;

  if (CharacterSelected === false) {
    StartBackgroundImage = game.add.sprite(0, 0, 'StartBackground');
    //scale image to fit the screen
    StartBackgroundImage.scale.setTo(0.4, 0.4);
    //center the image to center of the displayed game screen
    StartBackgroundImage.anchor.setTo(0.5, 0.5);
    //set the image to the center of the screen
    StartBackgroundImage.x = game.world.centerX;
    StartBackgroundImage.y = game.world.centerY;
    //stretch it to fill the screen
    StartBackgroundImage.height = game.height;
    StartBackgroundImage.width = game.width;
    //play the getoutofmyswamp audio
    var audio = game.add.audio('GetOutOfMySwamp');
    audio.play();

  FionaStart = game.add.sprite(20, 60, 'FionaStart');
  FionaStart.scale.setTo(0.5, 0.5);
  FionaStart.alpha = 0;
  FionaStart.inputEnabled = true;
  FionaStart.events.onInputDown.add(selectCharacter, this);

  ShrekStart = game.add.sprite(100, 60, 'ShrekStart');
  ShrekStart.scale.setTo(0.5, 0.5);
  ShrekStart.alpha = 0;
  ShrekStart.inputEnabled = true;
  ShrekStart.events.onInputDown.add(selectCharacter, this);

  DonkeyStart = game.add.sprite(180, 60, 'DonkeyStart');
  DonkeyStart.scale.setTo(0.5, 0.5);
  DonkeyStart.alpha = 0;
  DonkeyStart.inputEnabled = true;
  DonkeyStart.events.onInputDown.add(selectCharacter, this);

  // Create tweens to fade in and out the sprites
  var fadeDuration = 1000; // Duration of fade animation in milliseconds

  var fionaTween = game.add.tween(FionaStart).to({ alpha: 1 }, fadeDuration, Phaser.Easing.Linear.None, true, 0, -1, true);
  var shrekTween = game.add.tween(ShrekStart).to({ alpha: 1 }, fadeDuration, Phaser.Easing.Linear.None, true, 0, -1, true);
  var donkeyTween = game.add.tween(DonkeyStart).to({ alpha: 1 }, fadeDuration, Phaser.Easing.Linear.None, true, 0, -1, true);
    var textStyle = { font: "18px Arial", fill: "#ff0000", backgroundColor: "#FFFFFF" };
    promptText = game.add.text(game.world.centerX, game.world.centerY + 70, "Please Select A Character", textStyle);
    promptText.anchor.setTo(0.5);
    game.add.tween(promptText.scale).to({ x: 1.2, y: 1.2 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
  }

  function selectCharacter(sprite) {
    if (!CharacterSelected) {
      CharacterSelected = true;
      CharacterName = sprite.key;
      sprite.visible = false;

      chaseTimer = game.time.events.add(Phaser.Timer.SECOND * 5, startChase, this);

      map = game.add.tilemap('objects');
      map.addTilesetImage('items', 'tiles');
      layer = map.createLayer('Capa de Patrones 1');
      layer.resizeWorld();
      layer.wrap = true;
      // map.setCollisionBetween(14, 16);
      // map.setCollisionBetween(21, 22);
      // map.setCollisionBetween(27, 28);
      // map.setCollisionByIndex(10);
      // map.setCollisionByIndex(13);
      // map.setCollisionByIndex(17);
      // map.setCollisionByIndex(40);
      //stop the geoutofmyswamp audio
      audio.stop();
      //play the theme music
      music = game.add.audio('theme');
      music.play('', 0, 0.2, true);
      backgroundImage = game.add.sprite(0, 0, 'BackgroundImage');
       if (CharacterName === 'ShrekStart') {
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
        Shrek.sprite.animations.add('left', [0,1,2,3, 4, 5], 5, true);
        Shrek.sprite.animations.add('wait', [0,1,2,3], 10, true);
        Shrek.sprite.animations.add('jump', [2,3,4], 10, true);
        Shrek.sprite.body.fixedRotation = true;
        game.camera.follow(Shrek.sprite);
        console.log("Shrek was selected");
      } else if (CharacterName === 'FionaStart') {
        Friona = {
          sprite: game.add.sprite(100, game.world.height - 80, 'GreenBeastie'),
          direction: 'right',
          noMovement: true
        };
        Friona.sprite.scale.setTo(1.0, 1.0);
        Friona.sprite.anchor.x = 0.5;
        Friona.sprite.anchor.y = 1.0;
        Friona.sprite.animations.add('walk');
        game.physics.enable(Friona.sprite);
        Friona.sprite.body.bounce.y = 0;
        Friona.sprite.body.linearDamping = 1;
        Friona.sprite.body.collideWorldBounds = true;
        Friona.sprite.animations.add('left', [ 3,4,2], 10, true);
        Friona.sprite.animations.add('wait', [2], 10, true);
        Friona.sprite.animations.add('jump', [6,7,8], 10, true);
        Friona.sprite.body.fixedRotation = true;
        game.camera.follow(Friona.sprite);
        console.log("Fiona was selected");
      } else if (CharacterName === 'DonkeyStart') {
        Dunky = {
          sprite: game.add.sprite(100, game.world.height - 80, 'Dunky'),
          direction: 'right',
          noMovement: true
        };
        Dunky.sprite.scale.setTo(0.7, 0.7);
        Dunky.sprite.anchor.x = 0.5;
        Dunky.sprite.anchor.y = 1.0;
        Dunky.sprite.animations.add('walk');
        game.physics.enable(Dunky.sprite);
        Dunky.sprite.body.bounce.y = 0;
        Dunky.sprite.body.linearDamping = 1;
        Dunky.sprite.body.collideWorldBounds = true;
        Dunky.sprite.animations.add('left', [2, 4, 5], 10, true);
        Dunky.sprite.animations.add('wait', [0], 10, true);
        Dunky.sprite.animations.add('jump', [2, 4, 5], 10, true);
        Dunky.sprite.body.fixedRotation = true;
        game.camera.follow(Dunky.sprite);
        console.log("Donkey was selected");
      }
      if(CharacterName === 'ShrekStart' || CharacterName === 'FionaStart' || CharacterName === 'DonkeyStart'){
        CharacterSelected = true;
        CharacterName = sprite.key;
        console.log("The character Selected was :"+CharacterName +"Destroying the selection screen");
        FionaStart.destroy();
        ShrekStart.destroy();
        DonkeyStart.destroy();
      promptText.destroy();
      LordFartQuad = {
          sprite: game.add.sprite(100, game.world.height - 80, 'LordFartQuad'),
          direction: 'left',
          noMovement: true
        };
        LordFartQuad.sprite.anchor.x = 0.5;
        LordFartQuad.sprite.anchor.y = 1.0;
        LordFartQuad.sprite.scale.setTo(1.0, 1.0);
        game.physics.enable(LordFartQuad.sprite);
        LordFartQuad.sprite.body.bounce.y = 0;
        LordFartQuad.sprite.body.linearDamping = 1;
        LordFartQuad.sprite.body.collideWorldBounds = true;
        LordFartQuad.sprite.animations.add('angry', [0, 1, 2, 3, 4, 5], 5, true);
        LordFartQuad.sprite.body.fixedRotation = true;
      
      game.physics.arcade.gravity.y = 700;
      
      cursors = game.input.keyboard.createCursorKeys();
      runButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
      elapsedTime = 0;
      
    //    // Start the countdown timer
    //    timeText = game.add.text(10, 10, formatTime(seconds), { font: "bold 10px Arial", fill: "#ffffff" });
    // timer = game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);
         // Create the stepping block sprite
  steppingBlock = game.add.sprite(150, 180, 'Block');
  steppingBlock.scale.setTo(3.0, 0.5);

  game.physics.arcade.enable(steppingBlock);
  steppingBlock.body.immovable = true;
  steppingBlock.body.allowGravity = false;
        //steppingblock.body.immovable = true;
        //steppingblock.body.allowGravity = false;
        //add it where the player can jump on top
  steppingBlock2 = game.add.sprite(500, 160, 'Block');
  steppingBlock2.scale.setTo(3.0, 0.5);
      
  game.physics.arcade.enable(steppingBlock2);
  steppingBlock2.body.immovable = true;
  steppingBlock2.body.allowGravity = false;
        //add three more stepping blocks
  steppingBlock3 = game.add.sprite(815, 137, 'Block');
  steppingBlock3.scale.setTo(3.0, 0.5);
            
  game.physics.arcade.enable(steppingBlock3);
  steppingBlock3.body.immovable = true;
  steppingBlock3.body.allowGravity = false;  
  
  //create block 4
  steppingBlock4 = game.add.sprite(1100, 90, 'Block');
  steppingBlock4.scale.setTo(3.0, 0.5);

  game.physics.arcade.enable(steppingBlock4);
  steppingBlock4.body.immovable = true;
  steppingBlock4.body.allowGravity = false;

  //create block 5
  steppingBlock5 = game.add.sprite(1400, 120, 'Block');
  steppingBlock5.scale.setTo(3.0, 0.5);

  game.physics.arcade.enable(steppingBlock5);
  steppingBlock5.body.immovable = true;
  steppingBlock5.body.allowGravity = false;

  //create block 6
  steppingBlock6 = game.add.sprite(1700, 200, 'Block');
  steppingBlock6.scale.setTo(3.0, 0.5);

  game.physics.arcade.enable(steppingBlock6);
  steppingBlock6.body.immovable = true;
  steppingBlock6.body.allowGravity = false;

  //create block 7
  steppingBlock7 = game.add.sprite(2000, 143, 'Block');
  steppingBlock7.scale.setTo(3.0, 0.5);

  game.physics.arcade.enable(steppingBlock7);
  steppingBlock7.body.immovable = true;

  steppingBlock7.body.allowGravity = false;

  //create block 8
  steppingBlock8 = game.add.sprite(2300, 115, 'Block');
  steppingBlock8.scale.setTo(3.0, 0.5);

  game.physics.arcade.enable(steppingBlock8);
  steppingBlock8.body.immovable = true;

  steppingBlock8.body.allowGravity = false;

  //create block 9
  steppingBlock9 = game.add.sprite(2600, 190, 'Block');
  steppingBlock9.scale.setTo(3.0, 0.5);

  game.physics.arcade.enable(steppingBlock9);
  steppingBlock9.body.immovable = true;

  steppingBlock9.body.allowGravity = false;

  //create block 10
  steppingBlock10 = game.add.sprite(2900, 160, 'Block');
  steppingBlock10.scale.setTo(3.0, 0.5);

  game.physics.arcade.enable(steppingBlock10);
  steppingBlock10.body.immovable = true;

  steppingBlock10.body.allowGravity = false;


      
      
      pointSystem = 0;
      timeText = game.add.text(10, 10, 'Time Remaining: ' + formatTime(seconds), { font: "bold 12px Arial", fill: "#000000" });

    // Create the point text
    pointSystem = 0;
    pointText = game.add.text(10, 37, 'Points: ' + pointSystem, { font: "bold 12px Arial", fill: "#000000" });

    // Create the restart text
    restartText = game.add.text(10, 67, 'Quit Game', { font: "bold 12px Arial", fill: "#000000", backgroundColor: "#FFFFFF", padding: { x: 10, y: 5 } });

    // Start the countdown timer
    timer = game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);
      restartText.inputEnabled = true;
      restartText.events.onInputDown.add(quitGame, this);
      //game.time.events.loop(Phaser.Timer.SECOND * 10, increasePoints, this);
      // Set up a recurring timer to generate onions every ten seconds
      game.time.events.loop(Phaser.Timer.SECOND * 1, generateOnions, this);
      //game.time.events.loop(Phaser.Timer.SECOND * 2, generateWazowskis, this);
      //generateWazowskis();
    }
  }}
  }


function update() {
  
  console.log("we are in the update and The character selected was: " + CharacterName);
  // genereate 10 -15 onions falling at random points on the game screen dont allow any to go out of the screen
  //check to see how many onions are in the game and if there is less than 10 generate more onions
  // game.physics.arcade.collide(onion, steppingBlock, collisionHandler, null, this);
  //     game.physics.arcade.collide(onion, steppingBlock2, collisionHandler, null, this);
  //     game.physics.arcade.collide(onion, steppingBlock3, collisionHandler, null, this);
  //     game.physics.arcade.collide(onion, steppingBlock4, collisionHandler, null, this);
  //     game.physics.arcade.collide(onion, steppingBlock5, collisionHandler, null, this);
  //     game.physics.arcade.collide(onion, steppingBlock6, collisionHandler, null, this);
  //     game.physics.arcade.collide(onion, steppingBlock7, collisionHandler, null, this);
  //     game.physics.arcade.collide(onion, steppingBlock8, collisionHandler, null, this);
  //     game.physics.arcade.collide(onion, steppingBlock9, collisionHandler, null, this);
  //     game.physics.arcade.collide(onion, steppingBlock10, collisionHandler, null, this);

  


    
  





  // LordFartQuad logic
  if (CharacterName === 'ShrekStart' || CharacterName === 'FionaStart' || CharacterName === 'DonkeyStart') {
    
    pointText.x = game.camera.view.x + 10;
  pointText.y = game.camera.view.y + 10;
  timeText.x = game.camera.view.x + 10;
  timeText.y = game.camera.view.y + 37;
  restartText.x = game.camera.view.x + 10;
  restartText.y = game.camera.view.y + 67;
    // Colliding with the layers for characters
    game.physics.arcade.collide(LordFartQuad.sprite, layer);
    LordFartQuad.doNothing = true;
    if (!LordFartQuad.noMovement) {
      LordFartQuad.sprite.animations.play('angry');

      if (LordFartQuad.sprite.body.velocity.x > 0) {
        LordFartQuad.sprite.scale.x = -1;
      } else if (LordFartQuad.sprite.body.velocity.x < 0) {
        LordFartQuad.sprite.scale.x = 1;
      }
    }

    if (LordFartQuad.noMovement === true) {
      LordFartQuad.sprite.animations.play('angry');
    }

    if (LordFartQuad.noMovement === false) {
      LordFartQuad.sprite.animations.play('angry');
    }

    // Obstacle detection and jumping logic for LordFartQuad
    var tileHits = game.physics.arcade.collide(LordFartQuad.sprite, layer);
    var tileY = Math.floor(LordFartQuad.sprite.y / layer.tileHeight);

    if (LordFartQuad.sprite.body.velocity.x > 0) {
      // Check for obstacles in front of LordFartQuad
      var tileX = Math.floor((LordFartQuad.sprite.right + 1) / layer.tileWidth);
      var tile = map.getTile(tileX, tileY, layer);
      if (tile && tile.index !== -1) {
        // There is an obstacle in front of LordFartQuad, try to jump over it
        LordFartQuad.sprite.body.velocity.y = -400;
        LordFartQuad.doNothing = false;
      }
    } else if (LordFartQuad.sprite.body.velocity.x < 0) {
      // Check for obstacles in front of LordFartQuad
      var tileX = Math.floor((LordFartQuad.sprite.left - 1) / layer.tileWidth);
      var tile = map.getTile(tileX, tileY, layer);
      if (tile && tile.index !== -1) {
        // There is an obstacle in front of LordFartQuad, try to jump over it
        LordFartQuad.sprite.body.velocity.y = -400;
        LordFartQuad.doNothing = false;
      }
    }
    if (CharacterName == 'ShrekStart') {
    if (!LordFartQuad.noMovement) {
      if (LordFartQuad.sprite.x < Shrek.sprite.x) {
        LordFartQuad.sprite.body.velocity.x += 2;
      } else {
        LordFartQuad.sprite.body.velocity.x -= 2;
      }
    }} else if (CharacterName == 'FionaStart') {
      if (!LordFartQuad.noMovement) {
      if (LordFartQuad.sprite.x < Friona.sprite.x) {
        LordFartQuad.sprite.body.velocity.x += 2;
      } else {
        LordFartQuad.sprite.body.velocity.x -= 2;
      }
    }}
    else if (CharacterName == 'DonkeyStart') {
      if (!LordFartQuad.noMovement) {
      if (LordFartQuad.sprite.x < Dunky.sprite.x) {
        LordFartQuad.sprite.body.velocity.x += 2;
      } else {
        LordFartQuad.sprite.body.velocity.x -= 2;
      }
    }}



    
  

  // Shrek logic
  if (CharacterName === 'ShrekStart') {
    game.physics.arcade.collide(Shrek.sprite, layer);
    // Enable collision between Shrek and steppingBlock from above only
  game.physics.arcade.collide(Shrek.sprite, steppingBlock, function (shrekSprite, steppingBlock) {
    // Check if Shrek is above the steppingBlock
    if (shrekSprite.body.bottom <= steppingBlock.body.top) {
      return true; // Allow collision
    }
    return false; // Ignore collision
  });
  //do for block 2
  game.physics.arcade.collide(Shrek.sprite, steppingBlock2, function (shrekSprite, steppingBlock2) {
    // Check if Shrek is above the steppingBlock
    if (shrekSprite.body.bottom <= steppingBlock2.body.top) {
      return true; // Allow collision
    }
    return false; // Ignore collision
  });
  //do for block 3
  game.physics.arcade.collide(Shrek.sprite, steppingBlock3, function (shrekSprite, steppingBlock3) {
    // Check if Shrek is above the steppingBlock
    if (shrekSprite.body.bottom <= steppingBlock3.body.top) {
      return true; // Allow collision
    }
    return false; // Ignore collision
  });
  //do for block 4
  game.physics.arcade.collide(Shrek.sprite, steppingBlock4, function (shrekSprite, steppingBlock4) {
    // Check if Shrek is above the steppingBlock
    if (shrekSprite.body.bottom <= steppingBlock4.body.top) {
      return true; // Allow collision
    }
    return false; // Ignore collision
  });
  //do for block 5
  game.physics.arcade.collide(Shrek.sprite, steppingBlock5, function (shrekSprite, steppingBlock5) {
    // Check if Shrek is above the steppingBlock
    if (shrekSprite.body.bottom <= steppingBlock5.body.top) {
      return true; // Allow collision
    }
    return false; // Ignore collision
  });
  //do for block 6
  game.physics.arcade.collide(Shrek.sprite, steppingBlock6, function (shrekSprite, steppingBlock6) {
    // Check if Shrek is above the steppingBlock
    if (shrekSprite.body.bottom <= steppingBlock6.body.top) {
      return true; // Allow collision
    }
    return false; // Ignore collision
  });
  //do for block 7
  game.physics.arcade.collide(Shrek.sprite, steppingBlock7, function (shrekSprite, steppingBlock7) {
    // Check if Shrek is above the steppingBlock
    if (shrekSprite.body.bottom <= steppingBlock7.body.top) {
      return true; // Allow collision
    }
    return false; // Ignore collision
  });
  //do for block 8
  game.physics.arcade.collide(Shrek.sprite, steppingBlock8, function (shrekSprite, steppingBlock8) {
    // Check if Shrek is above the steppingBlock
    if (shrekSprite.body.bottom <= steppingBlock8.body.top) {
      return true; // Allow collision
    }
    return false; // Ignore collision
  });
  //do for block 9
  game.physics.arcade.collide(Shrek.sprite, steppingBlock9, function (shrekSprite, steppingBlock9) {
    // Check if Shrek is above the steppingBlock
    if (shrekSprite.body.bottom <= steppingBlock9.body.top) {
      return true; // Allow collision
    }
    return false; // Ignore collision
  });
  //do for block 10
  game.physics.arcade.collide(Shrek.sprite, steppingBlock10, function (shrekSprite, steppingBlock10) {
    // Check if Shrek is above the steppingBlock
    if (shrekSprite.body.bottom <= steppingBlock10.body.top) {
      return true; // Allow collision
    }
    return false; // Ignore collision
  });

    game.physics.arcade.overlap(Shrek.sprite, game.world, function (character, onion) {
      if (onion.key === "onion") {
        collectOnion(character, onion);
      }
    });
    
  
    Shrek.doNothing = true;

    if (cursors.left.isDown) {
      if (Shrek.direction != 'left') {
        Shrek.sprite.scale.x *= -1;
        Shrek.direction = 'left';
        Shrek.sprite.animations.play('left');
      }
      if (Shrek.sprite.body.velocity.x === 0 || (Shrek.sprite.body.blocked.down && !cursors.up.isDown)) {
        Shrek.sprite.body.velocity.x = -150;
      }
    } else if (cursors.right.isDown) {
      if (Shrek.direction != 'right') {
        Shrek.sprite.scale.x *= -1;
        Shrek.direction = 'right';
        Shrek.sprite.animations.play('left');
      }
      if (Shrek.sprite.body.velocity.x === 0 || (Shrek.sprite.body.blocked.down && !cursors.up.isDown)) {
        Shrek.sprite.body.velocity.x = 150;
      }
    } else {
      Shrek.sprite.body.velocity.x = 0;
    }

    if (cursors.up.isDown && (Shrek.sprite.body.onFloor() || Shrek.sprite.body.touching.down)) {
      Shrek.sprite.body.velocity.y = -350;
      Shrek.doNothing = false;
      Shrek.sprite.animations.play('jump');
    }
    

    // if (Shrek.sprite.body.velocity.x !== 0 && Shrek.sprite.body.onFloor()) {
    //   Shrek.sprite.animations.play('walk');
    // } else if (!Shrek.sprite.body.onFloor()) {
    //   Shrek.sprite.animations.play('jump');
    // } else {
    //   if (Shrek.doNothing) {
    //     Shrek.sprite.animations.play('idle');
    //   }
    // }
  }

  // Fiona logic
  //animations 
  // Friona.sprite.animations.add('left', [ 3,4,2], 10, true);
  //       Friona.sprite.animations.add('wait', [2], 10, true);
  //       Friona.sprite.animations.add('jump', [6,7,8], 10, true);
  if (CharacterName === 'FionaStart') {
    game.physics.arcade.collide(Friona.sprite, layer);
    game.physics.arcade.collide(Friona.sprite, steppingBlock, function (FrionaSprite, steppingBlock) {
      // Check if Shrek is above the steppingBlock
      if (FrionaSprite.body.bottom <= steppingBlock.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for all the other blocks
    game.physics.arcade.collide(Friona.sprite, steppingBlock2, function (FrionaSprite, steppingBlock2) {
      // Check if Shrek is above the steppingBlock
      if (FrionaSprite.body.bottom <= steppingBlock2.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 3
    game.physics.arcade.collide(Friona.sprite, steppingBlock3, function (FrionaSprite, steppingBlock3) {
      // Check if Shrek is above the steppingBlock
      if (FrionaSprite.body.bottom <= steppingBlock3.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 4
    game.physics.arcade.collide(Friona.sprite, steppingBlock4, function (FrionaSprite, steppingBlock4) {
      // Check if Shrek is above the steppingBlock
      if (FrionaSprite.body.bottom <= steppingBlock4.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 5
    game.physics.arcade.collide(Friona.sprite, steppingBlock5, function (FrionaSprite, steppingBlock5) {
      // Check if Shrek is above the steppingBlock
      if (FrionaSprite.body.bottom <= steppingBlock5.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 6
    game.physics.arcade.collide(Friona.sprite, steppingBlock6, function (FrionaSprite, steppingBlock6) {
      // Check if Shrek is above the steppingBlock
      if (FrionaSprite.body.bottom <= steppingBlock6.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 7
    game.physics.arcade.collide(Friona.sprite, steppingBlock7, function (FrionaSprite, steppingBlock7) {
      // Check if Shrek is above the steppingBlock
      if (FrionaSprite.body.bottom <= steppingBlock7.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 8
    game.physics.arcade.collide(Friona.sprite, steppingBlock8, function (FrionaSprite, steppingBlock8) {
      // Check if Shrek is above the steppingBlock
      if (FrionaSprite.body.bottom <= steppingBlock8.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 9
    game.physics.arcade.collide(Friona.sprite, steppingBlock9, function (FrionaSprite, steppingBlock9) {
      // Check if Shrek is above the steppingBlock
      if (FrionaSprite.body.bottom <= steppingBlock9.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 10
    game.physics.arcade.collide(Friona.sprite, steppingBlock10, function (FrionaSprite, steppingBlock10) {
      // Check if Shrek is above the steppingBlock
      if (FrionaSprite.body.bottom <= steppingBlock10.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });


    game.physics.arcade.overlap(Friona.sprite, game.world, function (character, onion) {
      if (onion.key === "onion") {
        collectOnion(character, onion);
      }
    });
    
  
    Friona.doNothing = true;

    if (cursors.left.isDown) {
      if (Friona.direction != 'left') {
        Friona.sprite.scale.x *= -1;
        Friona.direction = 'left';
        Friona.sprite.animations.play('left');
      }
      if (Friona.sprite.body.velocity.x === 0 || (Friona.sprite.body.blocked.down && !cursors.up.isDown)) {
        Friona.sprite.body.velocity.x = -150;
      }
    } else if (cursors.right.isDown) {
      if (Friona.direction != 'right') {
        Friona.sprite.scale.x *= -1;
        Friona.direction = 'right';
        Friona.sprite.animations.play('left');
      }
      if (Friona.sprite.body.velocity.x === 0 || (Friona.sprite.body.blocked.down && !cursors.up.isDown)) {
        Friona.sprite.body.velocity.x = 150;
      }
    } else {
      Friona.sprite.body.velocity.x = 0;
    }

    if (cursors.up.isDown && (Friona.sprite.body.onFloor() || Friona.sprite.body.touching.down)) {
      Friona.sprite.body.velocity.y = -350;
      Friona.doNothing = false;
      Friona.sprite.animations.play('jump');
    }
    

    // if (Friona.sprite.body.velocity.x !== 0 && Friona.sprite.body.onFloor()) {
    //   Friona.sprite.animations.play('walk');
    // } else if (!Friona.sprite.body.onFloor()) {
    //   Friona.sprite.animations.play('jump');
    // } else {
    //   if (Friona.doNothing) {
    //     Friona.sprite.animations.play('idle');
    //   }
    // }
  }

  // Donkey logic
  if (CharacterName === 'DonkeyStart') {
    game.physics.arcade.collide(Dunky.sprite, layer);
    game.physics.arcade.collide(Dunky.sprite, steppingBlock, function (DunkySprite, steppingBlock) {
      // Check if Shrek is above the steppingBlock
      if (DunkySprite.body.bottom <= steppingBlock.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //write this for blocks 2 -9
    game.physics.arcade.collide(Dunky.sprite, steppingBlock2, function (DunkySprite, steppingBlock2) {
      // Check if Shrek is above the steppingBlock
      if (DunkySprite.body.bottom <= steppingBlock2.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 3
    game.physics.arcade.collide(Dunky.sprite, steppingBlock3, function (DunkySprite, steppingBlock3) {
      // Check if Shrek is above the steppingBlock
      if (DunkySprite.body.bottom <= steppingBlock3.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 4
    game.physics.arcade.collide(Dunky.sprite, steppingBlock4, function (DunkySprite, steppingBlock4) {
      // Check if Shrek is above the steppingBlock
      if (DunkySprite.body.bottom <= steppingBlock4.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 5
    game.physics.arcade.collide(Dunky.sprite, steppingBlock5, function (DunkySprite, steppingBlock5) {
      // Check if Shrek is above the steppingBlock
      if (DunkySprite.body.bottom <= steppingBlock5.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 6
    game.physics.arcade.collide(Dunky.sprite, steppingBlock6, function (DunkySprite, steppingBlock6) {
      // Check if Shrek is above the steppingBlock
      if (DunkySprite.body.bottom <= steppingBlock6.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 7
    game.physics.arcade.collide(Dunky.sprite, steppingBlock7, function (DunkySprite, steppingBlock7) {
      // Check if Shrek is above the steppingBlock
      if (DunkySprite.body.bottom <= steppingBlock7.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 8
    game.physics.arcade.collide(Dunky.sprite, steppingBlock8, function (DunkySprite, steppingBlock8) {
      // Check if Shrek is above the steppingBlock
      if (DunkySprite.body.bottom <= steppingBlock8.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 9
    game.physics.arcade.collide(Dunky.sprite, steppingBlock9, function (DunkySprite, steppingBlock9) {
      // Check if Shrek is above the steppingBlock
      if (DunkySprite.body.bottom <= steppingBlock9.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });
    //do for block 10
    game.physics.arcade.collide(Dunky.sprite, steppingBlock10, function (DunkySprite, steppingBlock10) {
      // Check if Shrek is above the steppingBlock
      if (DunkySprite.body.bottom <= steppingBlock10.body.top) {
        return true; // Allow collision
      }
      return false; // Ignore collision
    });


    game.physics.arcade.overlap(Dunky.sprite, game.world, function (character, onion) {
      if (onion.key === "onion") {
        collectOnion(character, onion);
      }
    });
    
    Dunky.doNothing = true;

    if (cursors.left.isDown) {
      if (Dunky.direction != 'left') {
        Dunky.sprite.scale.x *= -1;
        Dunky.direction = 'left';
      }
      if (Dunky.sprite.body.velocity.x === 0 || (Dunky.sprite.body.blocked.down && !cursors.up.isDown)) {
        Dunky.sprite.body.velocity.x = -150;
      }
    } else if (cursors.right.isDown) {
      if (Dunky.direction != 'right') {
        Dunky.sprite.scale.x *= -1;
        Dunky.direction = 'right';
      }
      if (Dunky.sprite.body.velocity.x === 0 || (Dunky.sprite.body.blocked.down && !cursors.up.isDown)) {
        Dunky.sprite.body.velocity.x = 150;
      }
    } else {
      Dunky.sprite.body.velocity.x = 0;
    }

    if (cursors.up.isDown && (Dunky.sprite.body.onFloor() || Dunky.sprite.body.touching.down)) {
      Dunky.sprite.body.velocity.y = -350;
      Dunky.doNothing = false;
    }

    if (Dunky.sprite.body.velocity.x !== 0 && Dunky.sprite.body.onFloor()) {
      Dunky.sprite.animations.play('walk');
    } else if (!Dunky.sprite.body.onFloor()) {
      Dunky.sprite.animations.play('jump');
    } else {
      if (Dunky.doNothing) {
        Dunky.sprite.animations.play('idle');
      } else {
        Dunky.sprite.animations.play('angry');
      }
    }
  }

}
//timerEvent = game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);

  
}


function startChase() {
  LordFartQuad.noMovement = false;
}
function collectOnion(character, onion) {
  // Destroy the onion
  onion.destroy();

  // Increment the point counter by 1
  increasePoints();
}

function increasePoints() {
  pointSystem += 1;
  pointText.text = 'Points: ' + pointSystem;
}

function quitGame() {
  game.destroy();
}

function render() {
  //game.debug.bodyInfo(Shrek.sprite, 32, 32);
}
// function selectCharacter(sprite, pointer) {
  
//   //update();

//
// function updateTimer() {
//   elapsedTime++;
//   timeText.text = 'Time: ' + elapsedTime + 's';
// }
function updateTimer() {
  seconds--;
  
  timeText.text = formatTime(seconds);
  if (seconds <= 30 && seconds >0) {
    // Create the tween for phasing the timer text (if not already created)
    if (!timeTextTween) {
        timeText.fill = '#ff0000'; // Change to red color
        timeTextTween = game.add.tween(timeText);
        timeTextTween.to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false, 0, -1, true); // Phase in and out every 500 milliseconds
        timeTextTween.start();
    }
}
  if (seconds <= 0) {
      // Timer has reached 0, destroy the game or perform any desired action
      game.destroy();
  }
}
var timeTextTween; // Declare timeTextTween variable outside any function scope

// Inside your updateTimer function
function updateTimer() {
    seconds--;
    if (seconds <= 0) {
        // Time is up, perform the necessary actions
        game.destroy();
        // ...
    } else {
        // Update the timer text
        timeText.text = 'Time Remaining: ' + formatTime(seconds);

        // Check if there are 30 seconds or less remaining
        if (seconds <= 30) {
            // Create the tween for phasing the timer text (if not already created)
            if (!timeTextTween) {
                timeText.fill = '#ff0000'; // Change to red color
                timeTextTween = game.add.tween(timeText);
                timeTextTween.to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false, 0, -1, true); // Phase in and out every 500 milliseconds
                timeTextTween.start();
            }
        }
    }
}

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var seconds = seconds % 60;

  // Zero-padding for single digits
  var minutesStr = (minutes < 10) ? "0" + minutes : minutes;
  var secondsStr = (seconds < 10) ? "0" + seconds : seconds;

  return minutesStr + ":" + secondsStr;
}

function generateOnions() {
  var onionsOnScreen = 0;
  var totalOnions = Math.floor(Math.random() * 6) + 10;
  var minXDistance = 20; // Minimum distance between x values

  // Count existing onions on the screen
  for (var i = 0; i < game.world.children.length; i++) {
    var child = game.world.children[i];
    if (child.key === "onion") {
      onionsOnScreen++;
    }
  }

  // Generate onions if there are none on the screen
  if (onionsOnScreen === 0) {
    var xValues = []; // Array to store generated x values

    for (var j = 0; j < totalOnions; j++) {
      var x;
      do {
        x = game.rnd.between(0, game.world.width); // Random x position
      } while (!isXDistanceValid(x, xValues, minXDistance));

      xValues.push(x);

      var y = game.rnd.between(0, game.world.height / 2); // Random y position

      onion = game.add.sprite(x, y, "onion");
      onion.scale.setTo(0.5, 0.5);
      game.physics.arcade.enable(onion);
      onion.body.gravity.y = 300;
      onion.checkWorldBounds = true;
      onion.body.collideWorldBounds = true;
      //add collision for blocks 1-10
      game.physics.arcade.collide(onion, steppingBlock, collisionHandler, null, this);
      game.physics.arcade.collide(onion, steppingBlock2, collisionHandler, null, this);
      game.physics.arcade.collide(onion, steppingBlock3, collisionHandler, null, this);
      game.physics.arcade.collide(onion, steppingBlock4, collisionHandler, null, this);
      game.physics.arcade.collide(onion, steppingBlock5, collisionHandler, null, this);
      game.physics.arcade.collide(onion, steppingBlock6, collisionHandler, null, this);
      game.physics.arcade.collide(onion, steppingBlock7, collisionHandler, null, this);
      game.physics.arcade.collide(onion, steppingBlock8, collisionHandler, null, this);
      game.physics.arcade.collide(onion, steppingBlock9, collisionHandler, null, this);
      game.physics.arcade.collide(onion, steppingBlock10, collisionHandler, null, this);

      //add collision for blocks 2-10
  
    }
  }

  console.log("Number of onions on screen: " + onionsOnScreen);
}
function collisionHandler(onion, block) {
  // Check if the onion is colliding with the top of the block
  if (onion.body.touching.down && onion.body.touching.up) {
    // Adjust the position of the onion to sit on top of the block
    onion.y = block.y - onion.height;
    // Stop the onion from falling by disabling its gravity
    onion.body.gravity.y = 0;
    onion.body.velocity.y = 0;
  }
}

// Helper function to check if the x distance is valid
function isXDistanceValid(x, xValues, minXDistance) {
  for (var i = 0; i < xValues.length; i++) {
    if (Math.abs(x - xValues[i]) < minXDistance) {
      return false;
    }
  }
  return true;
}




function generateWazowskis() {
  console.log("Generating wazowskis");
  var wazowskisOnScreen = 0;
  var totalWazowskis = Math.floor(Math.random() * 6) + 10;
  var minXDistance = 20; // Minimum distance between x values

  // Count existing wazowskis on the screen
  for (var i = 0; i < game.world.children.length; i++) {
    var child = game.world.children[i];
    if (child.key === "wazowski") {
      wazowskisOnScreen++;
    }
  }

  // Generate wazowskis if there are none on the screen
  if (wazowskisOnScreen === 0) {
    var xValues = []; // Array to store generated x values

    for (var j = 0; j < totalWazowskis; j++) {
      var x;
      do {
        x = game.rnd.between(0, game.world.width); // Random x position
      } while (!isXDistanceValid(x, xValues, minXDistance));

      xValues.push(x);

      var y = game.rnd.between(0, game.world.height / 2); // Random y position

      var wazowski = game.add.sprite(x, y, "DebrisShreks");
      wazowski.scale.setTo(0.5, 0.5);
      game.physics.arcade.enable(wazowski);
      wazowski.body.gravity.y = 700;
      wazowski.body.collideWorldBounds = true;

      // Collide with stepping blocks
      game.physics.arcade.collide(wazowski, steppingBlock, function (wazowski, block) {
        if (wazowski.body.bottom <= block.body.top) {
          return true;
        } else {
          return false;
        }
      });

      game.physics.arcade.collide(wazowski, steppingBlock2, function (wazowski, block) {
        if (wazowski.body.bottom <= block.body.top) {
          return true;
        } else {
          return false;
        }
      });

	game.physics.arcade.collide(wazowski.sprite, steppingBlock3, function (wazowski, block) {
      // Check if wazowski's bottom body is above or equal to the top of the steppingBlock
      if (wazowski.body.bottom <= block.body.top) {
        // Enable collision only when wazowski is on top of the block
        return true;
      } else {
        // Disable collision when wazowski is underneath the block
        return false;
      }
    });
    game.physics.arcade.collide(wazowski.sprite, steppingBlock4, function (wazowski, block) {
      // Check if wazowski's bottom body is above or equal to the top of the steppingBlock
      if (wazowski.body.bottom <= block.body.top) {
        // Enable collision only when wazowski is on top of the block
        return true;
      } else {
        // Disable collision when wazowski is underneath the block
        return false;
      }
    });
    game.physics.arcade.collide(wazowski.sprite, steppingBlock5, function (wazowski, block) {
      // Check if wazowski's bottom body is above or equal to the top of the steppingBlock
      if (wazowski.body.bottom <= block.body.top) {
        // Enable collision only when wazowski is on top of the block
        return true;
      } else {
        // Disable collision when wazowski is underneath the block
        return false;
      }
    });
    game.physics.arcade.collide(wazowski.sprite, steppingBlock6, function (wazowski, block) {
      // Check if wazowski's bottom body is above or equal to the top of the steppingBlock
      if (wazowski.body.bottom <= block.body.top) {
        // Enable collision only when wazowski is on top of the block
        return true;
      } else {
        // Disable collision when wazowski is underneath the block
        return false;
      }
    });
    game.physics.arcade.collide(wazowski.sprite, steppingBlock7, function (wazowski, block) {
      // Check if wazowski's bottom body is above or equal to the top of the steppingBlock
      if (wazowski.body.bottom <= block.body.top) {
        // Enable collision only when wazowski is on top of the block
        return true;
      } else {
        // Disable collision when wazowski is underneath the block
        return false;
      }
    });
    game.physics.arcade.collide(wazowski.sprite, steppingBlock8, function (wazowski, block) {
      // Check if wazowski's bottom body is above or equal to the top of the steppingBlock
      if (wazowski.body.bottom <= block.body.top) {
        // Enable collision only when wazowski is on top of the block
        return true;
      } else {
        // Disable collision when wazowski is underneath the block
        return false;
      }
    });
    game.physics.arcade.collide(wazowski.sprite, steppingBlock9, function (wazowski, block) {
      // Check if wazowski's bottom body is above or equal to the top of the steppingBlock
      if (wazowski.body.bottom <= block.body.top) {
        // Enable collision only when wazowski is on top of the block
        return true;
      } else {
        // Disable collision when wazowski is underneath the block
        return false;
      }
    });
    
    game.physics.arcade.collide(wazowski.sprite, steppingBlock10, function (wazowski, block) {
      // Check if wazowski's bottom body is above or equal to the top of the steppingBlock
      if (wazowski.body.bottom <= block.body.top) {
        // Enable collision only when wazowski is on top of the block
        return true;
      } else {
        // Disable collision when wazowski is underneath the block
        return false;
      }
    
    });
      // Add collision with other stepping blocks here...

    }
  }

  console.log("Number of wazowskis on screen: " + wazowskisOnScreen);
}


