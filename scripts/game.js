//////////////////////////////////////////////////////////////////////////////////
//
// MIRROR DELIVERY
//
// A 13kB game by Alberto Congiu
//
// http://github.com/4lbertoC/mirrordelivery
//
////////////////////////////////////////////////////////////////////////////////////

(function () {
	/*/ ///////////////////////////////////////
	 *
	 * Constants
	 *
	 */ ///////////////////////////////////////

	//
	// GRAPHICS
	//
	var CANVAS_WIDTH = 640,
		CANVAS_HEIGHT = 400,
		BLOCK_SIZE = 16,
		I = CANVAS_WIDTH / BLOCK_SIZE,
		J = CANVAS_HEIGHT / BLOCK_SIZE,
		IMAGE_MAP_DATA_NAMES = {
			CROW: 0,
			CRUMBS: 1,
			DISPENSER: 2,
			GRANNY: 3,
			LADDER: 4,
			LUKE: 5,
			NEST: 6,
			ROOF: 7,
			SHOT: 8,
			PLATFORM: 9,
			CAT: 10,
			CAT_MOVING: 11
		},
		IMAGE_MAP_DATA = [
			/* CROW */
			{
				frame: {
					x: 30,
					y: 0,
					w: 30,
					h: 14
				},
				spriteSourceSize: {
					x: 1,
					y: 1,
					w: 30,
					h: 14
				},
				frames: [
					{
						x: 1,
						y: 1,
						w: 15,
						h: 11
				},
					{
						x: 17,
						y: 1,
						w: 15,
						h: 13
					}
				]
			},
			/* CRUMBS */
			{
				frame: {
					x: 14,
					y: 40,
					w: 14,
					h: 8
				},
				spriteSourceSize: {
					x: 1,
					y: 7,
					w: 14,
					h: 8
				}
			},
			/* DISPENSER */
			{
				frame: {
					x: 32,
					y: 14,
					w: 16,
					h: 16
				},
				spriteSourceSize: {
					x: 0,
					y: 0,
					w: 16,
					h: 16
				}
			},
			/* GRANNY */
			{
				frame: {
					x: 0,
					y: 24,
					w: 14,
					h: 24
				},
				spriteSourceSize: {
					x: 1,
					y: 7,
					w: 14,
					h: 24
				}
			},
			/* LADDER */
			{
				frame: {
					x: 16,
					y: 48,
					w: 16,
					h: 16
				},
				spriteSourceSize: {
					x: 0,
					y: 0,
					w: 16,
					h: 16
				}
			},
			/* LUKE */
			{
				frame: {
					x: 0,
					y: 0,
					w: 30,
					h: 24
				},
				spriteSourceSize: {
					x: 1,
					y: 3,
					w: 30,
					h: 24
				},
				frames: [
					{
						x: 0,
						y: 0,
						w: 15,
						h: 24
				},
					{
						x: 16,
						y: 0,
						w: 13,
						h: 24
					}
				]
			},
			/* NEST */
			{
				frame: {
					x: 48,
					y: 14,
					w: 16,
					h: 10
				},
				spriteSourceSize: {
					x: 0,
					y: 10,
					w: 16,
					h: 10
				}
			},
			/* ROOF */
			{
				frame: {
					x: 14,
					y: 24,
					w: 16,
					h: 16
				},
				spriteSourceSize: {
					x: 0,
					y: 0,
					w: 16,
					h: 16
				}
			},
			/* SHOT*/
			{
				frame: {
					x: 31,
					y: 32,
					w: 6,
					h: 14
				},
				spriteSourceSize: {
					x: 4,
					y: 1,
					w: 6,
					h: 14
				}
			},
			/* PLATFORM */
			{
				frame: {
					x: 0,
					y: 48,
					w: 16,
					h: 16
				},
				spriteSourceSize: {
					x: 0,
					y: 0,
					w: 16,
					h: 16
				}
			},
			/* CAT */
			{
				frame: {
					x: 36,
					y: 32,
					w: 11,
					h: 13
				},
				spriteSourceSize: {
					x: 0,
					y: 0,
					w: 12,
					h: 13
				}
			},
			/* CAT MOVING */
			{
				frame: {
					x: 49,
					y: 25,
					w: 15,
					h: 16
				},
				spriteSourceSize: {
					x: 0,
					y: 0,
					w: 15,
					h: 16
				}
			}
		],

		//
		// AUDIO
		//
		NOTES_CDEFGABC_FREQUENCIES = [
	        523.25,
	        587.33,
	        659.26,
	        698.46,
	        783.99,
	        880.00,
	        987.77,
	        1046.50,
	        1108.73
   		],
		IS_AUDIO_SUPPORTED = !! (window['btoa'] && window['atob']),
		INTRO_THEME = '023123467'.split(''),
		SOUND_TYPE = {
			JUMP: 0,
			PLAYER_CRASH: 1,
			CROW_SHOT: 2,
			CROW_CRASH: 3,
			CRATE_PICKUP: 4,
			CRATE_DELIVERY: 5,
			SUCCESS: 6,
			FAILURE: 7,
			CANDY_SPEED_BOOST: 8,
			CROW_EAT: 9,
			DISPENSER: 10,
			GRANNY_SHOT: 11
		},

		//
		// INPUT
		//
		KEYCODES = {
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40,
			EAT: 69,
			INTERACT: 32,
			MENU: 27,
			DELETE: 68,
			EXPORT_LEVEL: 74,
			CRATES: 67,
			NAME: 78,
			TIME: 84,
			IMPORT_LEVEL: 73
		},

		//
		// GAME
		//
		GAME_STATE = {
			MENU: 0,
			PLAYING: 1,
			EDIT: 2
		},

		//
		// MAP & EDITOR
		//
		BLOCK_TYPE = {
			EMPTY: '0',
			PLATFORM: '1',
			LADDER: '2',
			ROOF: '3',
			STATUS_BAR: '4',
			GOAL: '5',
			NEST: '6',
			DISPENSER: '7'
		},
		// Keep this info for the level editor
		// This is number of blocks + Player + Crow + Granny + Crates position
		NUM_BLOCKS = 8,
		GAME_ELEMENTS = {
			PLAYER: NUM_BLOCKS + 0,
			CROW: NUM_BLOCKS + 1,
			GRANNY: NUM_BLOCKS + 2,
			CRATES: NUM_BLOCKS + 3
		},
		NUM_GAME_ELEMENTS = 4, // The length of GAME_ELEMENTS
		NUM_EDIT_OPTIONS = NUM_BLOCKS + NUM_GAME_ELEMENTS,

		//
		// PLAYER
		//
		CANDY_SPEED_BOOST = 3,
		CANDY_SPEED_BOOST_TIMEOUT = 5000,
		PLAYER_WARNING_RADIUS = 75,
		PLAYER_DAMAGE_RADIUS = 25,
		PLAYER_RADIUS_MULTIPLIER = 7,
		DISPENSER_CANDIES = 3,

		//
		// CROW
		//
		MAX_NEST_SHOTS = 3,
		CRUMBS_SHOTS = 5,
		CROW_STUN_TIME = 5000,
		CROW_HEALTH = 10,
		CROW_SPEED = 16,
		CROW_MOVEMENT_THRESHOLD = 3,

		//
		// GRANNY
		//
		LASER_MOVEMENT_THRESHOLD = 3,

		//
		// CAT
		//
		CAT_MOVEMENT_THRESHOLD = 3,
		CAT_SPAWN_THRESHOLD = 4,
		CAT_SPEED = 16,
		NEXT_CAT_MOVEMENT_TIMEOUT = 2000,

		//
		// CRATES
		//
		BREAKABLE_CRATES = 10,
		MIN_CRATE_SIZE = 1,
		CRATE_IMAGE_WIDTH = 12,
		CRATE_POSITION_OFFSET = [1, -6],
		MIN_VERTICAL_SPEED_TO_CRASH = 15,

		//
		// LEVELS
		//
		LEVEL_PARAMS = {
			NAME: 0,
			PLAYER_STARTING_POSITION: 1,
			CROW_STARTING_POSITION: 2,
			CRATES_STARTING_POSITION: 3,
			GRANNY_POSITION: 4,
			TIME: 5,
			MAP: 6,
			CRATES: 7,
			INSTRUCTIONS: 8,
			IS_CUSTOM: 9
		};



	/*/ ///////////////////////////////////////
	 *
	 * Variables
	 *
	 */ ///////////////////////////////////////

	//
	// GRAPHICS
	//
	var canvas = document.getElementById('C'),
		ctx = canvas.getContext('2d'),
		ImageMap = new Image(), // The texture atlas
		FlippedImageMap = document.createElement('canvas'), // The mirrored texture atlas, used when player is facing left
		imageMapWidth = 0,
		MenuCanvas = document.createElement('canvas'),
		menuCanvasContext = MenuCanvas.getContext('2d'),

		//
		// AUDIO
		//
		gameSoundArray = [],
		noteSoundArray = {},
		introThemeBuffer = null,

		//
		// INPUT
		//

		// Desktop
		currentMousePosition = [0, 0],
		isLeftMouseButtonDown = false,
		KeyHandler = {
			k: {},

			onKeyUp: function (event) {
				KeyHandler.k[event['keyCode']] = undefined;
			},

			onKeyDown: function (event) {
				KeyHandler.k[event['keyCode']] = currentTime;
			}
		},

		// Mobile
		isMobileDevice = false,
		analogPad = document.getElementById('o'),
		analogPadDivPosition = analogPad.getBoundingClientRect(),
		analogPadCenter = [100, 100],
		isTouchinganalogPad = false,
		touchPositions = null,
		touchStartEvent = null,
		touchEndEvent = null,
		touchMoveEvent = null,

		//
		// GAME
		//
		currentTime = 0,
		Game = { // The current game that is being played
			state: GAME_STATE.MENU,
			canvasBoundingRect: canvas.getBoundingClientRect(), // used to calculate the mouse cursor's position
			time: 0,
			boyPoints: 0,
			crowPoints: 0,
			currentLevel: null
		},

		//
		// MAP
		//
		Map = [],
		platformBlockMap = null, // used to randomly choose Cat's next position

		//
		// EDIT MODE
		//
		selectedBlock = 0,
		isToggleDrawOn = false,

		//
		// ENTITIES
		//
		Player = {
			position: null,
			speed: 4,
			currentSpeed: 0, // takes into account initial movement inertia (see calculateHorizontalSpeed())
			speedBoost: 0,
			speedBoostTimeout: 0,
			ladderSpeed: 2,
			jumpSpeed: -7,
			isJumping: false, // used to avoid player's continue jumping if keeping UP pressed
			isInAir: false,
			isMoving: false, // used to avoid repetition of commands when keeping a button pressed (also in other game states)
			isInteracting: false,
			verticalSpeed: 0,
			crateCarried: undefined,
			candies: 0,
			crates: BREAKABLE_CRATES, // the player's "health"
			facingLeft: false
		},

		Crow = {
			position: null,
			nextPosition: null, // the next position to move to; using this to avoid movement around roofs by going out of screen and back inside with mouse from another side
			shots: 0,
			stunnedTimeout: 0,
			health: CROW_HEALTH
		},

		Granny = {
			position: null,
			startingLaserPosition: null,
			laserPosition: null,
			laserSpeed: 1
		},

		// The black cat appears when Player's of Crow's health go below CAT_SPAWN_THRESHOLD.
		// If touched by both player, it damages their health.
		// When it appears, the laser also slowly increases its speed with time.
		Cat = {
			position: null,
			nextPosition: null,
			nextCatMovement: 0
		},

		Crate = {
			image: null,
			size: 1,
			position: null,
			startPosition: [0, 0]
		},
		crateArray = [],

		Crumbs = {
			position: null
		},
		crumbArray = [],

		Shot = {
			position: null,
			speed: 6
		},
		shotArray = [],

		//
		// LEVELS
		//

		// The predefined Levels definition
		Tutorial = [
			/* NAME */
			'Tutorial',
			/* PLAYER STARTING POSITION */
			[33, 370],
			/* CROW STARTING POSITION */
			[CANVAS_WIDTH - 24, 55],
			/* CRATES STARTING POSITION */
			[300, 365],
			/* GRANNY POSITION */
			[20, 70],
			/* TIME */
			3000000,
			/* MAP */
			'0000000000000000000000000000000000000000' +
			'0000000000000000000000000000000000000000' +
			'3300000000000000000000000000000000000060' +
			'0000000000000000000000000000000000000011' +
			'0000000000033300000000000006000000000000' +
			'1100000000033300000000000011100000000000' +
			'0000000000033300000000000000000000000000' +
			'0000000000000000000000000000000000000000' +
			'0000000000000000000000000000000000000000' +
			'0000000000000000000000000000000000000000' +
			'3333333333333333333333333333333333333333' +
			'0000000000000000000000000000000000000000' +
			'0000000000000000000000000000000000000000' +
			'0000000000000000000000000000000000000000' +
			'0000000000000000000000000000000000000000' +
			'0550000000000000000000000000000000000000' +
			'0550000000000007000000000000002000000000' +
			'1111111111111111111111111111112000000000' +
			'0000000000000000000000000000002000000000' +
			'0000000000000000000000000000002000000000' +
			'0000000000000000000000000000002000000000' +
			'0000000000000000000000000000002000000000' +
			'1111111111111111111111111111111111111111',
			/* CRATES */
			[1],
			/* INSTRUCTIONS */
			[[20, 340, ['PLAYER 1']], [100, 340, ['ARROWS: move/jump']], [250, 340, [(isMobileDevice ? 'I' : 'SPACEBAR') + ': grab/release crate']],
				[500, 340, ['UP/DOWN: Climb']], [450, 250, ['Crates break if you fall from too high']],
				[160, 250, [(isMobileDevice ? 'I' : 'SPACEBAR') + ': buy candies when not holding crate', 'E: Use candy to gain speed']],
				[10, 230, ['Deliver crate to green area']], [560, 30, ['PLAYER 2', (isMobileDevice ? 'analogPad' : 'Mouse') + ': move']], [390, 80, ['Hide from granny in nest']], [390, 130, [(isMobileDevice ? 'A' : 'RClick') + ': eat from nest or crumbs', (isMobileDevice ? 'S' : 'LClick') + ': shoot!']],
				[150, 70, ['Don\'t touch roofs or Luke']]]],

		Level1 = [
			/* NAME */
			'Level 1',
			/* PLAYER STARTING POSITION */
			[25, 366],
			/* CROW STARTING POSITION */
			[616, 24],
			/* CRATES STARTING POSITION */
			[41, 364],
			/* GRANNY POSITION */
			[513, 180],
			/* TIME */
			60000,
			/* MAP */
			'00000000000000000000000000000000000000600000000000000000000000000000000000000011000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000003330000000000000000000000000000000000003333300000000000000000000000000000000000000000000000000000000000000000000000000000550000020000000000000200000000000000000055020002000111111111120000333000000000111112000200133333330002000000000000000000000200021130000000000200000000000000000000020002000000000000020000000000000000000002000200020000000002111111100111001101111100111112000000000200000000000000000000000033333200000000020000000000000000000000000000020000000000000000000000000000000000000002000000000000000000000000000000000000000200000000000000000000000000000000001111111111111111111111111111111111111111',
			/* CRATES */
			[1, 2]
		],

		Level2 = [
			/* NAME */
			'Level 2',
			/* PLAYER STARTING POSITION */
			[28, 143],
			/* CROW STARTING POSITION */
			[600, 296],
			/* CRATES STARTING POSITION */
			[588, 365],
			/* GRANNY POSITION */
			[51, 50],
			/* TIME */
			120000,
			/* MAP */
			'33330000000000000000000000000000000000000000000000000033000000000330000000000000055000000000000000000000000000000000000005500000000000000003030000000000000000001111111000000000000030000000000000110010000000010000000000000000000000000100301000000000000200000200000200000200000000100000000011120111102000201111021113002010111100000002000000020200000002000000211100000000000100000000200000000100000020000000000000000000000000000000000002002000000000000000000000000000000000030211100000001110000000000000000000000030020000000000000000000000003333300000000002000000000000000000000000000000000003020200000000000001100000000000000000000002110000000000000000000000000020700000020200000000000000000000000000112110000002020000060000000000010000000000200000000201000011100000000000000000000020000000020000000000000000000000000000002000000002000000000000000000000000000000200000000200000000001111111111111111111111111111111111111111',
			/* CRATES */
			[1, 2]
		],

		Level3 = [
			/* NAME */
			'Level 3',
			/* PLAYER STARTING POSITION */
			[17, 349],
			/* CROW STARTING POSITION */
			[281, 39],
			/* CRATES STARTING POSITION */
			[96, 316],
			/* GRANNY POSITION */
			[49, 163],
			/* TIME */
			240000,
			/* MAP */
			'00000000000000010001000000000000000000000000000000300001666100003000000000000020000000000003000111110003000000000007002000000000000030000000003000000000001110203000000000000000000000000000000000000020332200000000000000000000000000000000002033202000000000000000000000000000000000203320320000000000222000000000000000000020332033111001111100011111000110011001102055200000000000000000000000000110011000205520000000000000000000000000000000000020111100000000000000000000000000000000002000000000000000030003000000000220022000200000000000000030000030000200000000000020000000000000000300030000020000000000002000003030300000000200000002011001100110200003030303030303020000000200011001100020000000000030303032111111000000000000000000000000000000000203030303030000000000000000011100070000023030303030300000000000000000000011100002000000000000000000000011110000000000000200000000000000000000001111111111111111111111111111111111111111',
			/* CRATES */
			[1, 2]
		],

		Level4 = [
			/* NAME */
			'Level 4',
			/* PLAYER STARTING POSITION */
			[75, 370],
			/* CROW STARTING POSITION */
			[CANVAS_WIDTH - 24, 24],
			/* CRATES STARTING POSITION */
			[83, 365],
			/* GRANNY POSITION */
			[80, 53],
			/* TIME */
			300000,
			/* MAP */
			'3333330000000000000000000000000000000060' +
			'0000000000000000000000000000000000000011' +
			'0550000000000000000000000033330000000000' +
			'0550000000000000000200000000000000000000' +
			'1111110010011001111201110011110000000000' +
			'0000000000033000000200000000001000000000' +
			'0000000000000000070200000000000100000000' +
			'0001110000000000111111000000000010020000' +
			'0020000000000000333333300003333301021000' +
			'0020003333330000000000000000000000020000' +
			'0020000000000000000000000000000000020000' +
			'0020000000000000100100100110000202020000' +
			'0020111111111111100000003331100111121110' +
			'0020033333333330000000000003300000033333' +
			'0020000000000000000000000000000000000000' +
			'0020000000000000000020000000000002000000' +
			'0020111100111110011120111001111112011111' +
			'0020000000000000000020000003030302000000' +
			'0020000000000000000020700000000002000000' +
			'0000333330003030300011110000200002000000' +
			'0000000000000000000000000000211112000000' +
			'0000000000000000000000000000200000000000' +
			'1111111111111111111111111111111111111111',
			/* CRATES */
			[1, 2, 3]
		],

		baseLevels = [Tutorial, Level1, Level2, Level3, Level4],
		Levels = (window.localStorage && window.localStorage.Levels && JSON.parse(window.localStorage.Levels)) || baseLevels,
		customLevelCounter = Levels.length - baseLevels.length + 1,
		selectedLevel = 0;



	/*/ ///////////////////////////////////////
	 *
	 * Cross-browser helper functions
	 *
	 */ ///////////////////////////////////////

	//
	// requestAnimationFrame
	//
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	//
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	//
	// MIT license
	//
	(function () {
		var lastTime = 0;
		var vendors = ['webkit', 'moz'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
						callback(currTime + timeToCall);
					},
					timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
	}());

	//
	// Event handling
	// http://javascriptrules.com/2009/07/22/cross-browser-event-listener-with-design-patterns/
	//

	function addEvent(el, ev, fn) {
		if (el.addEventListener) {
			el.addEventListener(ev, fn, false);
		} else if (el.attachEvent) {
			el.attachEvent('on' + ev, fn);
		} else {
			el['on' + ev] = fn;
		}
	}

	//
	// Detect touch device
	// http://stackoverflow.com/questions/3974827/detecting-touch-screen-devices-with-javascript
	// http://blog.stevelydford.com/2012/03/detecting-touch-hardware-in-ie-10/
	//
	if (('ontouchstart' in document['documentElement']) || window['navigator']['msMaxTouchPoints']) {
		isMobileDevice = true;

		touchStartEvent = window['navigator']['msMaxTouchPoints'] ? 'MSPointerDown' : 'touchstart';
		touchEndEvent = window['navigator']['msMaxTouchPoints'] ? 'MSPointerUp' : 'touchend';
		touchMoveEvent = window['navigator']['msMaxTouchPoints'] ? 'MSPointerMove' : 'touchmove';


		var hiddenButtons = document.getElementsByClassName('btn');
		for (var b = 0; b < hiddenButtons.length; b++) {
			if (hiddenButtons[b].getAttribute('class').indexOf('edit') === -1) {
				hiddenButtons[b].setAttribute('class', 'btn');
			}
		}
	}



	/*/ ///////////////////////////////////////
	 *
	 * Game mechanics functions
	 *
	 */ ///////////////////////////////////////

	//
	// GRAPHICS
	//

	function drawAnim(name, x, y, frameRate, isFlipped, t) {
		// if t is not specified, frameRate is the number of the frame to display
		var source = IMAGE_MAP_DATA[name].frame,
			destinationOffset = IMAGE_MAP_DATA[name].spriteSourceSize,
			frames = IMAGE_MAP_DATA[name].frames,
			/*
				time/frame = 1000/60
				frame = framerate/1000 * time
			*/
			currentFrame = t ? frames[Math.floor(t * frameRate / 1000) % frames.length] : frames[frameRate];
		if (isFlipped) {
			ctx.drawImage(FlippedImageMap, imageMapWidth - (source.x + currentFrame.x) - currentFrame.w, source.y + currentFrame.y, currentFrame.w, currentFrame.h, x + destinationOffset.x, y + destinationOffset.y, currentFrame.w, currentFrame.h);
		} else {
			ctx.drawImage(ImageMap, source.x + currentFrame.x, source.y + currentFrame.y, currentFrame.w, currentFrame.h, x + destinationOffset.x, y + destinationOffset.y, currentFrame.w, currentFrame.h);
		}
	}

	function drawImage(name, x, y, w, h) {
		var source = IMAGE_MAP_DATA[name].frame,
			destinationOffset = IMAGE_MAP_DATA[name].spriteSourceSize;
		ctx.drawImage(ImageMap, source.x, source.y, w || source.w, h || source.h, x + destinationOffset.x, y + destinationOffset.y, destinationOffset.w, destinationOffset.h);
	}

	function getCanvasRelativeCoords(evt) {
		var x = evt.clientX - Game.canvasBoundingRect.left,
			y = evt.clientY - Game.canvasBoundingRect.top;
		x = Math.max(0, Math.min(x, CANVAS_WIDTH - 1));
		y = Math.max(0, Math.min(y, CANVAS_HEIGHT - 1));
		return [x, y];
	}

	function printTextLines(context, textArray, x, y, yIncrement, color) {
		var previousFillColor = context.fillColor,
			previousTextAlign = context.textAlign;
		context.fillStyle = color;
		var textArrayCopy = textArray.slice(),
			tempY = y;
		while (textArrayCopy.length > 0) {
			context.fillText(textArrayCopy.shift(), x, tempY);
			tempY += yIncrement;
		}
		context.fillStyle = previousFillColor;
		context.textAlign = previousTextAlign;
	}

	//
	// AUDIO
	//

	function loadSound(name, data) {
		if (IS_AUDIO_SUPPORTED) {
			try {
				gameSoundArray[name] = jsfxlib.createWave(data);
			} catch (e) {}
		}
	}

	function playIntroSong() {
		if (IS_AUDIO_SUPPORTED) {
			playNextSongNote();
		}
	}

	function playNextSongNote() {
		try {
			if (Game.state === GAME_STATE.PLAYING && introThemeBuffer.length > 0) {
				noteSoundArray[introThemeBuffer.shift()]['play']();
				setTimeout(playNextSongNote, 200);
			}
		} catch (e) {}
	}

	function playSound(soundName) {
		if (IS_AUDIO_SUPPORTED) {
			try {
				if (gameSoundArray[soundName]) {
					gameSoundArray[soundName]['pause']();
					gameSoundArray[soundName]['currentTime'] = 0;
					gameSoundArray[soundName]['play']();
				}
			} catch (e) {}
		}
	}

	//
	// INPUT
	//

	function bindButtonToKeyCode(buttonId, keyCode) {
		var btn = document.getElementById(buttonId);

		function touchstart() {
			KeyHandler.onKeyDown({
				'keyCode': keyCode
			});
		}

		function touchend() {
			KeyHandler.onKeyUp({
				'keyCode': keyCode
			});
		}
		addEvent(btn, touchStartEvent, touchstart);
		addEvent(btn, touchEndEvent, touchend);
	}

	function bindButtonToCustomFunction(buttonId, touchStartCallback, touchEndCallback) {
		var btn = document.getElementById(buttonId);
		addEvent(btn, touchStartEvent, touchStartCallback);
		addEvent(btn, touchEndEvent, touchEndCallback);
	}

	//
	// GAME
	//

	function resetCrates(level) {
		var crateStartingPosition = level[LEVEL_PARAMS.CRATES_STARTING_POSITION],
			currentCrateSize,
			newCrate,
			crateCanvas,
			crateCtx,
			x,
			y;

		Crate.startPosition = crateStartingPosition;

		crateArray.length = 0;
		for (var cr = 0; cr < level[LEVEL_PARAMS.CRATES].length; cr++) {
			currentCrateSize = level[LEVEL_PARAMS.CRATES][cr];
			var newCrate = Object.create(Crate);
			newCrate.size = currentCrateSize;

			crateCanvas = document.createElement('canvas');
			crateCanvas.width = CRATE_IMAGE_WIDTH + currentCrateSize;
			crateCanvas.height = CRATE_IMAGE_WIDTH + currentCrateSize;
			crateCtx = crateCanvas.getContext('2d');
			crateCtx.fillStyle = 'yellow';
			crateCtx.fillRect(0, 0, CRATE_IMAGE_WIDTH + currentCrateSize, CRATE_IMAGE_WIDTH + currentCrateSize);
			crateCtx.fillStyle = 'black';
			crateCtx.fillText(currentCrateSize, 5, 10);
			newCrate.image = crateCanvas;

			x = crateStartingPosition[0] + cr * 16;
			y = crateStartingPosition[1] - currentCrateSize;
			newCrate.position = [x, y];
			newCrate.startPosition = [x, y];

			crateArray.push(newCrate);
		}
	}

	function resetGame(levelId) {
		var level = Game.currentLevel = Levels[levelId] || Levels[selectedLevel];

		Player.position = level[LEVEL_PARAMS.PLAYER_STARTING_POSITION].slice();
		Player.candies = 0;
		Player.speedBoostTimeout = 0;
		Player.crateCarried = undefined;
		Player.crates = BREAKABLE_CRATES;
		Player.isInteracting = false;
		Player.isJumping = false;
		Player.isMoving = false;
		Player.isInAir = false;
		Player.facingLeft = false;

		Crow.health = CROW_HEALTH;
		Crow.shots = 0;
		Crow.stunnedTimeout = 0;
		Crow.position = level[LEVEL_PARAMS.CROW_STARTING_POSITION].slice();

		Granny.position = level[LEVEL_PARAMS.GRANNY_POSITION].slice();
		Granny.startingLaserPosition = [level[LEVEL_PARAMS.GRANNY_POSITION][0] + 15, level[LEVEL_PARAMS.GRANNY_POSITION][1] + 23];
		Granny.laserPosition = Granny.startingLaserPosition.slice();
		Granny.laserSpeed = 1;

		Cat.position = Cat.nextPosition = null;

		Game.time = 0;
		setGameState(GAME_STATE.MENU);

		selectedBlock = 0;

		// Adding the title bars to the map. Don't ask why they are tiles.
		Map = '4444444444444444444444444444444444444444' + level[LEVEL_PARAMS.MAP] + '4444444444444444444444444444444444444444';
		Map = Map.split('');
		platformBlockMap = null;

		resetCrates(level);

		crumbArray.length = 0;
		shotArray.length = 0;

		// Redraw the menu screen
		menuCanvasContext.fillStyle = 'rgba(0,0,0,0.7)';
		menuCanvasContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Draw subtitle and points
		menuCanvasContext.fillStyle = '#fff';
		menuCanvasContext['textAlign'] = 'center';
		menuCanvasContext.fillText('A 13kB game by Alberto Congiu', CANVAS_WIDTH / 2, 12);
		menuCanvasContext.font = '20px courier';
		menuCanvasContext.fillText(Game.currentLevel[LEVEL_PARAMS.NAME], CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
		menuCanvasContext.fillText('Luke ' + Game.boyPoints + ' - ' + Game.crowPoints + ' Crow', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

		// Draw menu options
		menuCanvasContext.font = '15px courier';
		menuCanvasContext.fillText('Click the ' + (isMobileDevice ? 'screen' : 'crow') + ' to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
		menuCanvasContext.fillText('< >: Select level', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);
		var str = level[LEVEL_PARAMS.IS_CUSTOM] ? 'E: EDIT   ' + (isMobileDevice ? 'S' : 'D') + ': DELETE   ' + (isMobileDevice ? 'A' : 'J') + ': EXPORT   I: IMPORT' : 'E: EDIT   I: IMPORT';
		menuCanvasContext.fillText(str, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 120);

		// Draw the circle around the crow
		menuCanvasContext['beginPath']();
		menuCanvasContext['arc'](Crow.position[0], Crow.position[1], 16, 0, 360);
		menuCanvasContext['lineWidth'] = 2;
		menuCanvasContext['strokeStyle'] = '#fff';
		menuCanvasContext['stroke']();

		// Get the intro theme buffer ready to be played again when the game is started
		introThemeBuffer = INTRO_THEME.slice();

		// Save the levels in the local storage
		if (window.localStorage) {
			window.localStorage.Levels = JSON.stringify(Levels);
		}
	}

	function setGameState(state) {
		Game.state = state;
		if (isMobileDevice) {
			var editButtons = document['getElementsByClassName']('edit'),
				className = 'btn edit' + (state === GAME_STATE.EDIT ? '' : ' h');
			for (var eb = 0; eb < editButtons.length; eb++) {
				editButtons[eb].setAttribute('class', className);
			}
		}
	}

	function startGame() {
		setGameState(GAME_STATE.PLAYING);
		Game.time = currentTime + Game.currentLevel[LEVEL_PARAMS.TIME];
		playIntroSong();

		canvas['style']['cursor'] = 'none';
	}

	function winBoy() {
		Game.boyPoints += 1;
		canvas['style']['cursor'] = 'auto';
		playSound(SOUND_TYPE.SUCCESS);
		resetGame(selectedLevel);
	}

	function winCrow() {
		Game.crowPoints += 1;
		canvas['style']['cursor'] = 'auto';
		playSound(SOUND_TYPE.FAILURE);
		resetGame(selectedLevel);
	}

	//
	// MAP
	//

	function arePositionsInSameBlock(pos1, pos2) {
		return (Math.round(pos1[0] / BLOCK_SIZE) === Math.round(pos2[0] / BLOCK_SIZE)) && (Math.round(pos1[1] / BLOCK_SIZE) === Math.round(pos2[1] / BLOCK_SIZE));
	}

	function calculateAngle(origin, destination) {
		return Math.atan((destination[1] - origin[1]) / (destination[0] - origin[0]));
	}

	function calculateEuclideanDistance(pos1, pos2) {
		return pos1 && pos2 && Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2));
	}

	function getMapAt(i, j) {
		return Map[I * j + i];
	}

	function getMapAtXY(x, y) {
		return Map[I * Math.floor(y / BLOCK_SIZE) + Math.floor(x / BLOCK_SIZE)];
	}

	function isAABBCollidingWithBlock(x1, y1, w1, h1, blockType) {
		var x = x1,
			y = y1,
			topLeft = getMapAtXY(x, y);
		x = x1 + w1;
		topRight = getMapAtXY(x, y);
		y = y1 + h1;
		bottomRight = getMapAtXY(x, y);
		x = x1, y = y1,
		bottomLeft = getMapAtXY(x, y);

		return (topLeft === blockType) || (topRight === blockType) || (bottomRight === blockType) || (bottomLeft === blockType);
	}

	function isAABBOverBlock(x1, y1, w1, h1, blockType) {
		var x = x1,
			y = y1 + h1,
			bottomRight = getMapAtXY(x, y);
		x = x1 + w1,
		bottomLeft = getMapAtXY(x, y);

		return (bottomRight === blockType) || (bottomLeft === blockType);
	}

	function isPositionOnBlock(position, blockType) {
		return isAABBOverBlock(position[0], position[1], 0, 0, blockType);
	}

	function setMapAtXY(value, x, y) {
		var idx = (I * Math.floor(y / BLOCK_SIZE) + Math.floor(x / BLOCK_SIZE));
		if (idx < Map.length) {
			Map[idx] = value;
		}
	}

	//
	// EDIT MODE
	//

	function exitAndSave() {
		canvas['style']['cursor'] = 'auto';
		if (Game.state === GAME_STATE.EDIT) {
			Levels[selectedLevel][LEVEL_PARAMS.MAP] = Map.join('').substring(I, I * J - I);
			Levels[selectedLevel][LEVEL_PARAMS.PLAYER_STARTING_POSITION] = Player.position.slice();
			Levels[selectedLevel][LEVEL_PARAMS.CROW_STARTING_POSITION] = Crow.position.slice();
			Levels[selectedLevel][LEVEL_PARAMS.GRANNY_POSITION] = Granny.position.slice();
			Levels[selectedLevel][LEVEL_PARAMS.CRATES_STARTING_POSITION] = Crate.startPosition.slice();
		}
		resetGame(selectedLevel);
	}

	//
	// PLAYER
	//

	function calculateHorizontalSpeed(t) {
		var currentSpeed = Player.currentSpeed,
			speed = calculatePlayerSpeed();
		if (!Player.isMoving) {
			currentSpeed = 0;
		}
		currentSpeed = Math.min(speed, currentSpeed + speed / 7);
		Player.currentSpeed = currentSpeed;
		return (isPlayerOnBlock(BLOCK_TYPE.LADDER) ? speed / 2 : currentSpeed);
	}

	function calculatePlayerSpeed() {
		return Math.max(1, Player.speed + Player.speedBoost - (Player.crateCarried !== undefined ? crateArray[Player.crateCarried].size : 0));
	}

	function getDamageRadius() {
		return calculatePlayerSpeed() * PLAYER_RADIUS_MULTIPLIER + PLAYER_DAMAGE_RADIUS;
	}

	function interact() {
		var currentCrateIdx = Player.crateCarried,
			currentCrate = currentCrateIdx !== undefined ? crateArray[currentCrateIdx] : undefined;
		if (currentCrate === undefined) {
			var obj,
				c;
			for (c = 0; c < crateArray.length; c++) {
				if (arePositionsInSameBlock(Player.position, crateArray[c].position)) {
					Player.crateCarried = c;
					playSound(SOUND_TYPE.CRATE_PICKUP);
					return;
				}
			}
			// If no crate is picked up, use dispenser
			if (isPlayerOnBlock(BLOCK_TYPE.DISPENSER)) {
				Player.candies = DISPENSER_CANDIES;
				playSound(SOUND_TYPE.DISPENSER);
			}
		} else {
			Player.crateCarried = undefined;
			playSound(SOUND_TYPE.CRATE_PICKUP);
			if (isPlayerOnBlock(BLOCK_TYPE.GOAL) && currentCrate !== undefined) {
				crateArray.splice(currentCrateIdx, 1);
				if (crateArray.length <= 0) {
					winBoy();
				} else {
					playSound(SOUND_TYPE.CRATE_DELIVERY);
				}
			}
		}
	}

	function isPlayerOnBlock(blockType) {
		return isAABBCollidingWithBlock(Player.position[0] - 8, Player.position[1] - 32, 16, 32, blockType) ||
			isAABBCollidingWithBlock(Player.position[0], Player.position[1] - 8, 0, 0, blockType);
	}

	//
	// CROW
	//

	// Used also to toggle drawing in edit mode (mobile)

	function crowEat(evt) {
		evt.preventDefault();
		if (Game.state === GAME_STATE.EDIT) {
			isToggleDrawOn = !isToggleDrawOn;
		} else if (Game.state === GAME_STATE.PLAYING && Crow.stunnedTimeout < currentTime) {
			var currentMousePosition = getCanvasRelativeCoords(evt);
			if (isCrowOnBlock(BLOCK_TYPE.NEST) && Crow.shots < MAX_NEST_SHOTS) {
				playSound(SOUND_TYPE.CROW_EAT);
				Crow.shots++;
			} else {
				var c;
				for (c = 0; c < crumbArray.length; c++) {
					if (arePositionsInSameBlock(currentMousePosition, crumbArray[c].position)) {
						Crow.shots = Math.max(Crow.shots, CRUMBS_SHOTS);
						playSound(SOUND_TYPE.CROW_EAT);
						crumbArray.splice(c, 1);
						return;
					}
				}
			}
		}
	}

	// Used also to draw in edit mode

	function crowShoot(evt) {
		if (Game.state === GAME_STATE.EDIT) {
			if (selectedBlock < NUM_BLOCKS) {
				setMapAtXY('' + selectedBlock, currentMousePosition[0], currentMousePosition[1]);
			} else if (selectedBlock === GAME_ELEMENTS.PLAYER) {
				Player.position = currentMousePosition.slice();
			} else if (selectedBlock === GAME_ELEMENTS.CROW) {
				Crow.position = currentMousePosition.slice();
			} else if (selectedBlock === GAME_ELEMENTS.GRANNY) {
				Granny.position = currentMousePosition.slice();
				Granny.startingLaserPosition = [Granny.position[0] + 15, Granny.position[1] + 23];
				Granny.laserPosition = Granny.startingLaserPosition.slice();
			} else if (selectedBlock === GAME_ELEMENTS.CRATES) {
				Crate.startPosition = currentMousePosition.slice();
				for (var cr = 0; cr < crateArray.length; cr++) {
					var crate = crateArray[cr];
					crate.position[0] = currentMousePosition[0] + cr * 16;
					crate.position[1] = currentMousePosition[1] - crate.size;
				}
			}
		} else if (Game.state === GAME_STATE.MENU && !isMobileDevice) {
			if (currentMousePosition[0] > Crow.position[0] - 16 && currentMousePosition[0] < Crow.position[0] + 16 && currentMousePosition[1] > Crow.position[1] - 16 && currentMousePosition[1] < Crow.position[1] + 16) {
				startGame();
			}
		} else if (Crow.shots > 0 && Crow.stunnedTimeout < currentTime) {
			Crow.shots--;
			playSound(SOUND_TYPE.CROW_SHOT);
			var newShot = Object.create(Shot);
			newShot.position = Crow.position.slice();
			shotArray.push(newShot);
		}
	}

	function isCrowInPlayerDamageZone() {
		return getDamageRadius() >= calculateEuclideanDistance(Crow.position, Player.position);
	}

	function isCrowOnBlock(blockType) {
		return isAABBOverBlock(Crow.position[0] - 8, Crow.position[1] - 8, 16, 16, blockType) ||
			isAABBCollidingWithBlock(Crow.position[0], Crow.position[1], 0, 0, blockType);
	}

	function stunCrow(t) {
		Crow.stunnedTimeout = t + CROW_STUN_TIME;
		playSound(SOUND_TYPE.GRANNY_SHOT);
		Crow.shots = 0;
		Crow.health--;
		if (Crow.health <= 0) {
			winBoy();
		} else if (Crow.health < CAT_SPAWN_THRESHOLD) {
			showCat(t);
		}
	}

	//
	// CAT
	//

	function showCat(t) {
		if (!platformBlockMap) {
			platformBlockMap = [];
			for (var i = 0; i < Map.length; i++) {
				if (Map[i] === BLOCK_TYPE.PLATFORM) {
					platformBlockMap.push(i);
				}
			}
		}
		var rndPos = platformBlockMap[Math.floor(Math.random() * platformBlockMap.length)] + 1,
			nextPosition = [(rndPos % I) * BLOCK_SIZE, Math.floor(rndPos / I) * BLOCK_SIZE];

		Cat.nextPosition = [nextPosition[0] - 6, nextPosition[1] - 10];
		if (!Cat.position) {
			Cat.position = Cat.nextPosition.slice();
		}
		Cat.nextCatMovement = t + NEXT_CAT_MOVEMENT_TIMEOUT;
		Granny.laserSpeed += 0.05;
	}

	//
	// CRATES
	//

	function breakCrate(crate, t) {
		playSound(SOUND_TYPE.PLAYER_CRASH);
		Player.crateCarried = undefined;
		crate.position = crate.startPosition.slice();
		Player.crates--;
		if (Player.crates <= 0) {
			winCrow();
		} else if (Player.crates < CAT_SPAWN_THRESHOLD) {
			showCat(t);
		}
	}

	//
	// LEVELS
	//

	function createCustomLevel(level) {
		var currentLevel = level || Levels[selectedLevel],
			CustomLevel = [
			/* NAME */
			'CustomLevel' + customLevelCounter++,
			/* PLAYER STARTING POSITION */
			currentLevel[LEVEL_PARAMS.PLAYER_STARTING_POSITION].slice(),
			/* CROW STARTING POSITION */
			currentLevel[LEVEL_PARAMS.CROW_STARTING_POSITION].slice(),
			/* CRATES STARTING POSITION */
			currentLevel[LEVEL_PARAMS.CRATES_STARTING_POSITION].slice(),
			/* GRANNY POSITION */
			currentLevel[LEVEL_PARAMS.GRANNY_POSITION].slice(),
			/* TIME */
			currentLevel[LEVEL_PARAMS.TIME],
			/* MAP */
			currentLevel[LEVEL_PARAMS.MAP],
			/* CRATES */
			currentLevel[LEVEL_PARAMS.CRATES].slice(),
			/* INSTRUCTIONS */
			null,
			/* IS_CUSTOM */
			true
		];
		Levels.push(CustomLevel);
		if (Game.state === GAME_STATE.MENU) {
			selectedLevel = Levels.length - 1;
			resetGame(selectedLevel);
		}
	}



	/*/ ///////////////////////////////////////
	 *
	 * Game loop specific functions
	 *
	 */ ///////////////////////////////////////

	//
	// GRAPHICS
	//

	function clearColor(color) {
		ctx.fillStyle = color || 'black';
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	function drawBlockTypeAt(blockType, x, y) {
		var image = null,
			color = (Cat.position) ? '#c29' : '#00deff'; // As default, use sky color, also as background for images that have transparency
		if (blockType === BLOCK_TYPE.PLATFORM) {
			image = IMAGE_MAP_DATA_NAMES.PLATFORM;
		} else if (blockType === BLOCK_TYPE.ROOF) {
			image = IMAGE_MAP_DATA_NAMES.ROOF;
		} else if (blockType === BLOCK_TYPE.STATUS_BAR) {
			color = '#000';
		} else if (blockType === BLOCK_TYPE.GOAL) {
			color = '#0f0';
		} else if (blockType === BLOCK_TYPE.NEST) {
			image = IMAGE_MAP_DATA_NAMES.NEST;
		} else if (blockType === BLOCK_TYPE.LADDER) {
			image = IMAGE_MAP_DATA_NAMES.LADDER;
		} else if (blockType === BLOCK_TYPE.DISPENSER) {
			image = IMAGE_MAP_DATA_NAMES.DISPENSER;
		}
		ctx.fillStyle = color;
		ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
		if (image !== null) {
			drawImage(image, x, y, BLOCK_SIZE, BLOCK_SIZE);
		}
	}

	function drawCat() {
		drawImage(calculateEuclideanDistance(Cat.position, Cat.nextPosition) > 5 ? IMAGE_MAP_DATA_NAMES.CAT_MOVING : IMAGE_MAP_DATA_NAMES.CAT, Cat.position[0] - 8, Cat.position[1]);
	}

	function drawCrates() {
		var cur, cr;
		for (cr = 0; cr < crateArray.length; cr++) {
			if (cr !== Player.crateCarried) {
				cur = crateArray[cr];
				ctx.drawImage(cur.image, cur.position[0] - 8, cur.position[1] - 8);
			}
		}
	}

	function drawCrow(t) {
		if (Game.state === GAME_STATE.PLAYING) {
			if (!(Crow.stunnedTimeout > t && Math.floor(t / 100) % 2 === 0)) {
				drawAnim(IMAGE_MAP_DATA_NAMES.CROW, Crow.position[0] - 8, Crow.position[1] - 8, 2, false, t);
			}
		} else {
			drawAnim(IMAGE_MAP_DATA_NAMES.CROW, Crow.position[0] - 8, Crow.position[1] - 8, 0);
		}
	}

	function drawCrumbs() {
		var cur, cr;
		for (cr = 0; cr < crumbArray.length; cr++) {
			cur = crumbArray[cr];
			drawImage(IMAGE_MAP_DATA_NAMES.CRUMBS, cur.position[0] - 8, cur.position[1] - 8);
		}

	}

	function drawGranny() {
		drawImage(IMAGE_MAP_DATA_NAMES.GRANNY, Granny.position[0], Granny.position[1]);
	}

	function drawEditCursor() {
		ctx.globalAlpha = 0.6;
		if (selectedBlock < NUM_BLOCKS) {
			drawBlockTypeAt('' + selectedBlock, currentMousePosition[0] - (currentMousePosition[0] % BLOCK_SIZE), currentMousePosition[1] - (currentMousePosition[1] % BLOCK_SIZE))
			ctx.strokeStyle = '#000';
			ctx.strokeRect(currentMousePosition[0] - (currentMousePosition[0] % BLOCK_SIZE), currentMousePosition[1] - (currentMousePosition[1] % BLOCK_SIZE), BLOCK_SIZE, BLOCK_SIZE);
		} else if (selectedBlock === GAME_ELEMENTS.PLAYER) {
			drawAnim(IMAGE_MAP_DATA_NAMES.LUKE, currentMousePosition[0] - 8, currentMousePosition[1] - 24, 1);
		} else if (selectedBlock === GAME_ELEMENTS.CROW) {
			drawAnim(IMAGE_MAP_DATA_NAMES.CROW, currentMousePosition[0] - 8, currentMousePosition[1] - 8, 0);
		} else if (selectedBlock === GAME_ELEMENTS.GRANNY) {
			drawImage(IMAGE_MAP_DATA_NAMES.GRANNY, currentMousePosition[0], currentMousePosition[1]);
		} else if (selectedBlock === GAME_ELEMENTS.CRATES) {
			ctx.fillStyle = 'yellow';
			ctx.fillRect(currentMousePosition[0] - 8, currentMousePosition[1] - 8, 16, 16);
			ctx.fillStyle = '#000';
			ctx.fillText('C', currentMousePosition[0] - 4, currentMousePosition[1] + 4);
		}
		ctx.globalAlpha = 1;
	}

	function drawCrowShots() {
		var cur, cr;
		for (cr = 0; cr < shotArray.length; cr++) {
			cur = shotArray[cr];
			drawImage(IMAGE_MAP_DATA_NAMES.SHOT, cur.position[0] - 8, cur.position[1] - 8);
		}

	}

	function drawInstructions() {
		if (Game.currentLevel[LEVEL_PARAMS.INSTRUCTIONS]) {
			for (var instr = 0; instr < Game.currentLevel[LEVEL_PARAMS.INSTRUCTIONS].length; instr++) {
				printTextLines(ctx, Game.currentLevel[LEVEL_PARAMS.INSTRUCTIONS][instr][2], Game.currentLevel[LEVEL_PARAMS.INSTRUCTIONS][instr][0], Game.currentLevel[LEVEL_PARAMS.INSTRUCTIONS][instr][1], 10, 'black');
			}
		}
	}

	function drawLaser() {
		ctx.fillStyle = 'red';
		ctx.fillRect(Granny.laserPosition[0] - 1, Granny.laserPosition[1] - 1, 2, 2);
		ctx['beginPath']();
		ctx['arc'](Granny.laserPosition[0], Granny.laserPosition[1], 5, 0, 360);
		ctx['lineWidth'] = 2;
		ctx['strokeStyle'] = 'red';
		ctx['stroke']();
	}

	function drawMap() {
		var i, j;
		for (i = 0; i < I; i++) {
			for (j = 0; j < J; j++) {
				drawBlockTypeAt(getMapAt(i, j), i * BLOCK_SIZE, j * BLOCK_SIZE);
			}
		}
	}

	function drawMenu() {
		ctx.drawImage(MenuCanvas, 0, 0);
	}

	function drawPlayer(t) {
		if (Game.state === GAME_STATE.PLAYING) {
			if (Player.isInAir) {
				drawAnim(IMAGE_MAP_DATA_NAMES.LUKE, Player.position[0] - 8, Player.position[1] - 24, 0, Player.facingLeft);
			} else if (Player.isMoving) {
				drawAnim(IMAGE_MAP_DATA_NAMES.LUKE, Player.position[0] - 8, Player.position[1] - 24, 10, Player.facingLeft, t);
			} else {
				drawAnim(IMAGE_MAP_DATA_NAMES.LUKE, Player.position[0] - 8, Player.position[1] - 24, 1, Player.facingLeft);
			}
		} else {
			drawAnim(IMAGE_MAP_DATA_NAMES.LUKE, Player.position[0] - 8, Player.position[1] - 24, 1);
		}
		if (Player.crateCarried !== undefined) {
			var cur = crateArray[Player.crateCarried];
			ctx.drawImage(cur.image, Player.facingLeft ? cur.position[0] + 2 : cur.position[0] - 15 - cur.size, cur.position[1] - 10);
		}

		if ((calculatePlayerSpeed() * PLAYER_RADIUS_MULTIPLIER + PLAYER_WARNING_RADIUS) >= calculateEuclideanDistance(Crow.position, Player.position)) {
			ctx['beginPath']();
			ctx['arc'](Player.position[0], Player.position[1], getDamageRadius(), 0, 360);
			ctx['lineWidth'] = 2;
			ctx['strokeStyle'] = '#f09';
			ctx['stroke']();
		}
	}

	function drawStatusBars(t) {
		ctx.fillStyle = 'white';
		if (Game.state === GAME_STATE.PLAYING) {
			// Boy's status
			ctx.fillText('⚙ ' + Math.max(0, Math.ceil((Game.time - t) / 1000)) + '   § ' + Player.candies + '   ◼ ' + Player.crates, 50, 396);

			// Crow's status
			ctx.fillText('↡ ' + Crow.shots + '   ♥ ' + Crow.health, 530, 12);

			ctx.fillStyle = '#00deff';
			ctx.fillText('LUKE', 10, 396);
			ctx.fillStyle = 'red';
			ctx.fillText('CROW', 600, 12);
		} else if (Game.state === GAME_STATE.EDIT) {
			// Edit commands
			ctx.fillText('< > CHANGE BLOCK   C: CRATES   T: TIME (' + Levels[selectedLevel][LEVEL_PARAMS.TIME] + ')   N: NAME (' + Levels[selectedLevel][LEVEL_PARAMS.NAME] + ')' + (isMobileDevice ? '   S: PAINT   A: TOGGLE PAINT   analogPad: MOVE' : ''), 12, 12);
		}
	}

	function render(t) {
		// TODO move to an onResize
		Game.canvasBoundingRect = canvas.getBoundingClientRect();

		clearColor();

		drawMap();

		drawCrates();
		drawCrumbs();
		drawCrowShots();
		drawGranny();
		drawInstructions();

		if (Cat.position) {
			drawCat();
		}
		drawPlayer(t);
		drawCrow(t);
		drawLaser();

		drawStatusBars(t);

		if (Game.state === GAME_STATE.MENU) {
			drawMenu();
		}
		if (Game.state === GAME_STATE.EDIT) {
			drawEditCursor();
		}
	}

	//
	// INPUT
	//

	function processInput(t) {
		var speed = calculatePlayerSpeed(),
			ladderSpeed = Player.ladderSpeed,
			x = Player.position[0],
			y = Player.position[1],
			k = KeyHandler.k;

		if (Game.state === GAME_STATE.MENU) {
			//
			// Menu
			//
			if (k[KEYCODES.LEFT] && !Player.isMoving) { // Select previous level
				selectedLevel = (selectedLevel + Levels.length - 1) % Levels.length;
				resetGame(selectedLevel);
				Player.isMoving = true;
			} else if (k[KEYCODES.RIGHT] && !Player.isMoving) { // Select next level
				selectedLevel = (selectedLevel + 1) % Levels.length;
				resetGame(selectedLevel);
				Player.isMoving = true;
			} else if (k[KEYCODES.EAT] && !Player.isMoving) { // Create custom level from this one, or edit if it's already custom
				Player.isMoving = true;
				if (!Levels[selectedLevel][LEVEL_PARAMS.IS_CUSTOM]) {
					createCustomLevel();
				}
				setGameState(GAME_STATE.EDIT);
				k[KEYCODES.EAT] = undefined;
			} else if (k[KEYCODES.DELETE] && !Player.isMoving) { // Delete current custom level
				Player.isMoving = true;
				if (Levels[selectedLevel][LEVEL_PARAMS.IS_CUSTOM]) {
					Levels.splice(selectedLevel, 1);
					selectedLevel--;
					resetGame(selectedLevel);
				}
				k[KEYCODES.DELETE] = undefined;
			} else if (k[KEYCODES.EXPORT_LEVEL] && Levels[selectedLevel][LEVEL_PARAMS.IS_CUSTOM] && !Player.isMoving) { // Export current custom level
				var jsonLevel = prompt('Data', JSON.stringify(Levels[selectedLevel]));
				// Need to do this because the prompt hangs the keycode pressed
				k[KEYCODES.EXPORT_LEVEL] = undefined;
			} else if (k[KEYCODES.IMPORT_LEVEL]) { // Import a level from its JSON
				var jsonLevel = prompt('Data');
				if (jsonLevel) {
					try {
						createCustomLevel(JSON.parse(jsonLevel));
					} catch (e) {
						alert('Error!');
					}
				}
				// Need to do this because the prompt hangs the keycode pressed
				k[KEYCODES.IMPORT_LEVEL] = undefined;
			} else if (!k[KEYCODES.LEFT] && !k[KEYCODES.RIGHT] && !k[KEYCODES.DELETE] && !k[KEYCODES.EAT] && !k[KEYCODES.EXPORT_LEVEL] && !k[KEYCODES.IMPORT_LEVEL]) {
				Player.isMoving = false;
			}
			return;
		} else if (Game.state === GAME_STATE.EDIT) {
			//
			// Edit Mode
			//
			if (k[KEYCODES.LEFT] && !Player.isMoving) { // Select previous block
				selectedBlock = (selectedBlock + NUM_EDIT_OPTIONS - 1) % NUM_EDIT_OPTIONS;
				Player.isMoving = true;
			} else if (k[KEYCODES.RIGHT] && !Player.isMoving) { // Select next block
				selectedBlock = (selectedBlock + 1) % NUM_EDIT_OPTIONS;
				Player.isMoving = true;
			} else if (k[KEYCODES.CRATES] && !Player.isMoving) { // Edit crates
				Player.isMoving = true;
				try {
					var crates = JSON.parse(prompt('Crates', JSON.stringify(Levels[selectedLevel][LEVEL_PARAMS.CRATES])));
					if (crates instanceof Array) {
						for (var c = 0; c < crates.length; c++) {
							if (!typeof c === 'number') {
								alert('Error!');
							}
							crates[c] = Math.max(1, Math.min(5, crates[c]));
						}
						Levels[selectedLevel][LEVEL_PARAMS.CRATES] = crates;
						resetCrates(Levels[selectedLevel]);
					}
				} catch (e) {
					alert('Error!');
				}
				k[KEYCODES.CRATES] = undefined;
			} else if (k[KEYCODES.NAME] && !Player.isMoving) { // Edit level
				Player.isMoving = true;
				var n = prompt('Name', Levels[selectedLevel][LEVEL_PARAMS.NAME]);
				if (n) {
					Levels[selectedLevel][LEVEL_PARAMS.NAME] = n;
				}
				k[KEYCODES.NAME] = false;
			} else if (k[KEYCODES.TIME] && !Player.isMoving) { // Edit game time
				Player.isMoving = true;
				var t = +prompt('Time', Levels[selectedLevel][LEVEL_PARAMS.TIME]);
				if (!isNaN(t) && t > 0) {
					Levels[selectedLevel][LEVEL_PARAMS.TIME] = t;
				}
				k[KEYCODES.TIME] = false;
			} else if (k[KEYCODES.EAT] && !Player.isMoving) { // Exit from edit mode
				Player.isMoving = true;
				exitAndSave();
				k[KEYCODES.EAT] = undefined;
			} else if (!k[KEYCODES.LEFT] && !k[KEYCODES.RIGHT] && !k[KEYCODES.CRATES] && !k[KEYCODES.NAME] && !k[KEYCODES.TIME] && !k[KEYCODES.EAT]) {
				Player.isMoving = false;
			}
		} else if (Game.state === GAME_STATE.PLAYING) {
			//
			// Playing
			//
			if (k[KEYCODES.INTERACT] && !Player.isJumping && !Player.isInAir && !Player.isInteracting) { // SPACEBAR (interact)
				Player.isInteracting = true;
				interact();
			} else if (k[KEYCODES.EAT] && !Player.isInteracting) { // E (eat candy)
				Player.isInteracting = true;
				if (Player.candies > 0) {
					Player.candies--;
					Player.speedBoost = CANDY_SPEED_BOOST;
					Player.speedBoostTimeout = t + CANDY_SPEED_BOOST_TIMEOUT;
					var newCrumbs = Object.create(Crumbs);
					newCrumbs.position = [Player.position[0] + 4, Player.position[1] - 7];
					crumbArray.push(newCrumbs);

					playSound(SOUND_TYPE.CANDY_SPEED_BOOST);
				}
			} else if (!k[KEYCODES.INTERACT] && !k[KEYCODES.EAT] && Player.isInteracting) {
				Player.isInteracting = false;
			}
			if (k[KEYCODES.UP]) { // UP (Jump or climb ladders)
				if (isPlayerOnBlock(BLOCK_TYPE.LADDER)) {
					Player.position[1] = Math.min(CANVAS_HEIGHT - BLOCK_SIZE, y - ladderSpeed);
					Player.isMoving = true;
				} else if (!Player.isJumping && !Player.isInAir) {
					Player.verticalSpeed = Player.jumpSpeed;
					Player.currentSpeed = speed;
					Player.isJumping = true;
					Player.isInAir = true;
					playSound(SOUND_TYPE.JUMP);
				}
			} else if (!k[KEYCODES.UP] && Player.isJumping) {
				Player.isJumping = false;
			}
			if (k[KEYCODES.LEFT]) { // LEFT (Move left)
				Player.position[0] = Math.max(BLOCK_SIZE, x - calculateHorizontalSpeed(t));
				Player.isMoving = true;
				Player.facingLeft = true;
			}
			if (k[KEYCODES.RIGHT]) { // RIGHT (Move right)
				Player.position[0] = Math.min(CANVAS_WIDTH - 2 * BLOCK_SIZE, x + calculateHorizontalSpeed(t));
				Player.isMoving = true;
				Player.facingLeft = false;
			}
			if (k[KEYCODES.DOWN] && isPlayerOnBlock(BLOCK_TYPE.LADDER)) { // DOWN (Climb ladders)
				Player.position[1] = Math.min(CANVAS_HEIGHT, y + ladderSpeed);
				Player.isMoving = true;
			}
			if (!k[KEYCODES.LEFT] && !k[KEYCODES.UP] && !k[KEYCODES.RIGHT] && !k[KEYCODES.DOWN]) {
				Player.isMoving = false;
			}
		}
		if (k[KEYCODES.MENU]) {
			exitAndSave();
		}
	}

	//
	// GAME
	//

	// Move an entity from its .position to its .nextPosition if the distance
	// is less than the threshold.

	function updateMovingPosition(entity, threshold, speed) {
		if (entity.position && entity.nextPosition) {
			var crowAngle = calculateAngle(entity.position, entity.nextPosition),
				crowTangentSize = entity.position[0] > entity.nextPosition[0] ? -1 : 1,
				absDX = Math.abs(entity.position[0] - entity.nextPosition[0]),
				absDY = Math.abs(entity.position[1] - entity.nextPosition[1]);
			if (absDX > threshold || absDY > threshold) {
				var dx = Math.cos(crowAngle) * crowTangentSize * speed,
					dy = Math.sin(crowAngle) * crowTangentSize * speed;
				if (Math.abs(dx) > absDX) {
					dx = absDX * dx / Math.abs(dx);
				}
				if (Math.abs(dy) > absDY) {
					dy = absDY * dy / Math.abs(dy);
				}
				entity.position[0] += dx;
				entity.position[1] += dy;
			}
		}
	}

	function update(t) {
		currentTime = t;

		// Mobile controls
		if (isTouchinganalogPad && touchPositions) {
			var touchPosition, tempTp;
			if (touchPositions['clientX']) {
				touchPosition = touchPositions;
			} else if (touchPositions instanceof TouchList) {
				for (var tp = 0; tp < touchPositions.length; tp++) {
					tempTp = touchPositions[tp];
					if (tempTp.clientX >= analogPadDivPosition.left && tempTp.clientX < (analogPadDivPosition.left + analogPadDivPosition.width) &&
						tempTp.clientY >= analogPadDivPosition.top && tempTp.clientY < (analogPadDivPosition.top + analogPadDivPosition.height)) {
						touchPosition = touchPositions[tp];
						break;
					}
				}
			}
			if (touchPosition) {
				var analogPadClickPosition = [touchPosition.clientX - analogPadDivPosition.left, touchPosition.clientY - analogPadDivPosition.top],
					angle = calculateAngle(analogPadCenter, analogPadClickPosition),
					module = calculateEuclideanDistance(analogPadCenter, analogPadClickPosition) / 12.5;
				var pos;
				if (Game.state === GAME_STATE.PLAYING) {
					pos = Crow.position;
				} else if (Game.state === GAME_STATE.EDIT) {
					pos = currentMousePosition;
				}
				if (pos) {
					// If we are in edit mode, it's annoying to have analog controls for a cursor that moves digitally,
					// so I round the value on the analogPad
					pos[0] += (Game.state === GAME_STATE.EDIT ? Math.round(Math.cos(angle)) : Math.cos(angle)) * (analogPadClickPosition[0] < 100 ? -module : module);
					pos[1] += (Game.state === GAME_STATE.EDIT ? Math.round(Math.sin(angle)) : Math.sin(angle)) * (analogPadClickPosition[0] < 100 ? -module : module);
					pos[0] = Math.max(0, Math.min(pos[0], CANVAS_WIDTH - 1));
					pos[1] = Math.max(0, Math.min(pos[1], CANVAS_HEIGHT - 1));
				}
				if (isToggleDrawOn) {
					crowShoot();
				}
			}
		}

		if (Game.state !== GAME_STATE.PLAYING) {
			return;
		}

		// Updating Canvas position
		Game.canvasBoundingRect = canvas.getBoundingClientRect();
		// window.onresize = function () {
		// 	Game.canvasBoundingRect = canvas.getBoundingClientRect();
		// });

		// Player collision
		var currentVectorFraction = 0,
			stoppingY;
		while (currentVectorFraction <= Player.verticalSpeed) {
			if (isAABBOverBlock(Player.position[0] - 8, Player.position[1] + currentVectorFraction, 16, 0, BLOCK_TYPE.PLATFORM)) {
				stoppingY = (Player.position[1] + currentVectorFraction) - ((Player.position[1] + currentVectorFraction) % BLOCK_SIZE);
				break;
			}
			currentVectorFraction += BLOCK_SIZE;
		}
		if (stoppingY) {
			Player.position[1] = stoppingY;
			if (Player.isInAir) {
				Player.currentSpeed = 0;
				var currentCrate = (Player.crateCarried !== undefined) && crateArray[Player.crateCarried];
				if (currentCrate) {
					var verticalSpeedThreshold = MIN_VERTICAL_SPEED_TO_CRASH - currentCrate.size;
					if (Player.verticalSpeed > verticalSpeedThreshold) {
						breakCrate(currentCrate, t);
					}
				}
			}
			Player.isInAir = false;
			Player.verticalSpeed = 0;
		} else if (!isAABBCollidingWithBlock(Player.position[0] - 16, Player.position[1] - 32, 16, 32, BLOCK_TYPE.LADDER)) {
			Player.verticalSpeed += 1;
			Player.isInAir = true;
			Player.position[1] += Player.verticalSpeed;
		} else {
			Player.isInAir = false;
		}

		// Crate carried
		if (Player.crateCarried !== undefined) {
			crateArray[Player.crateCarried].position[0] = Player.position[0] + CRATE_POSITION_OFFSET[0];
			crateArray[Player.crateCarried].position[1] = Player.position[1] + CRATE_POSITION_OFFSET[1];
		}

		// Speed boost timeout check
		if (Player.speedBoostTimeout < t && Player.speedBoost > 0) {
			Player.speedBoost = 0;
		}

		// Update shots position
		var s;
		for (s = 0; s < shotArray.length; s++) {
			var curShot = shotArray[s];
			curShot.position[1] += curShot.speed;
			if (arePositionsInSameBlock(Player.position, curShot.position) && Player.crateCarried !== undefined) {
				breakCrate(crateArray[Player.crateCarried], t);
				shotArray.splice(s, 1);
				s--;
			} else if (curShot.position[1] > CANVAS_HEIGHT || isPositionOnBlock(curShot.position, BLOCK_TYPE.ROOF)) {
				// TODO Destroy roof?
				shotArray.splice(s, 1);
				s--;
			}
		}

		// Check Game Time
		if (Game.time < t) {
			winCrow();
		}

		// Update Crow's position
		updateMovingPosition(Crow, CROW_MOVEMENT_THRESHOLD, CROW_SPEED);

		// Update Cat's position
		if (Cat.position) {
			if (Player.crateCarried !== undefined && calculateEuclideanDistance(Player.position, Cat.position) < 15) {
				breakCrate(crateArray[Player.crateCarried], t);
			}
			if (calculateEuclideanDistance(Crow.position, Cat.position) < 15) {
				stunCrow(t);
			}
			if (Cat.nextCatMovement < t) {
				showCat(t);
			}
			updateMovingPosition(Cat, CAT_MOVEMENT_THRESHOLD, CAT_SPEED);
		}

		// Update Laser's position
		var laserTargetPosition = isPositionOnBlock(Crow.position, BLOCK_TYPE.NEST) ? Granny.startingLaserPosition : Crow.position,
			laserToCrowAngle = calculateAngle(Granny.laserPosition, laserTargetPosition),
			tangentSide = Granny.laserPosition[0] > laserTargetPosition[0] ? -1 : 1;
		if (Math.abs(laserTargetPosition[0] - Granny.laserPosition[0]) > LASER_MOVEMENT_THRESHOLD || Math.abs(laserTargetPosition[1] - Granny.laserPosition[1]) > LASER_MOVEMENT_THRESHOLD) {
			Granny.laserPosition[0] += Math.cos(laserToCrowAngle) * tangentSide * Granny.laserSpeed;
			Granny.laserPosition[1] += Math.sin(laserToCrowAngle) * tangentSide * Granny.laserSpeed;
		}

		// Stun Crow if it hits roof, player's zone or laser
		if ((isCrowInPlayerDamageZone() || isAABBCollidingWithBlock(Crow.position[0], Crow.position[1], 0, 0, BLOCK_TYPE.ROOF) || (calculateEuclideanDistance(Granny.laserPosition, Crow.position) < LASER_MOVEMENT_THRESHOLD)) && Crow.stunnedTimeout < t) {
			stunCrow(t);
		}
	}



	/*/ ///////////////////////////////////////
	 *
	 * Initialization
	 *
	 */ ///////////////////////////////////////

	//
	// GRAPHICS
	//

	// Initialize the Texture Atlas and create its mirrored version
	ImageMap.onload = function () {
		FlippedImageMap.width = imageMapWidth = ImageMap.naturalWidth;
		FlippedImageMap.height = ImageMap.naturalHeight;
		var imCtx = FlippedImageMap.getContext('2d');
		imCtx.translate(ImageMap.naturalWidth, 0);
		imCtx.scale(-1, 1);
		imCtx.drawImage(ImageMap, 0, 0);
	};
	ImageMap.src = 'img/imgmap.png';

	MenuCanvas.width = CANVAS_WIDTH;
	MenuCanvas.height = CANVAS_HEIGHT;

	//
	// AUDIO
	//

	// Load the notes of the small intro tune
	for (var s = 0; s < NOTES_CDEFGABC_FREQUENCIES.length; s++) {
		noteSoundArray[s] = jsfxlib.createWave(['synth', 0.0000, 0.4000, 0.0000, 0.2080, 0.0000, 0.1200, 20.0000, NOTES_CDEFGABC_FREQUENCIES[s], 2400.0000, 0.0000, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.1000, 0.0000]);
	}
	introThemeBuffer = INTRO_THEME.slice();

	// Load the sounds
	loadSound(SOUND_TYPE.JUMP, ['square', 0.0000, 0.4000, 0.0000, 0.1740, 0.0000, 0.2800, 20.0000, 497.0000, 2400.0000, 0.2200, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.0000, 0.0000, 0.0665, 0.0000, 0.0000, 0.0000, 0.0000, 0.7830, 0.0000, 0.0000, 0.0000, 0.0000]);
	loadSound(SOUND_TYPE.PLAYER_CRASH, ['noise', 0.0000, 0.4000, 0.0000, 0.1400, 0.4050, 0.1160, 20.0000, 479.0000, 2400.0000, -0.0700, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, -0.0860, -0.1220, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
	loadSound(SOUND_TYPE.CRATE_DELIVERY, ['square', 0.0000, 0.4000, 0.0000, 0.0980, 0.5040, 0.2820, 20.0000, 1582.0000, 2400.0000, 0.0000, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
	loadSound(SOUND_TYPE.CANDY_SPEED_BOOST, ['saw', 0.0000, 0.4000, 0.0000, 0.3240, 0.0000, 0.2840, 20.0000, 631.0000, 2400.0000, 0.1720, 0.0000, 0.4980, 19.3500, 0.0003, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
	loadSound(SOUND_TYPE.CROW_SHOT, ['saw', 0.0000, 0.4000, 0.0000, 0.2120, 0.0000, 0.0280, 20.0000, 1169.0000, 2400.0000, -0.5200, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.0000, 0.0000, 0.5000, -0.5920, 0.0000, 0.0940, 0.0660, 1.0000, 0.0000, 0.0000, 0.2800, 0.0000]);
	loadSound(SOUND_TYPE.FAILURE, ['synth', 0.0000, 0.4000, 0.0000, 0.3200, 0.3480, 0.4400, 20.0000, 372.0000, 417.0000, 0.0000, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.3740, 0.2640, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
	loadSound(SOUND_TYPE.SUCCESS, ['synth', 0.0000, 0.4000, 0.0000, 0.1300, 0.3450, 0.4100, 253.0000, 1168.0000, 1407.0000, -0.0060, -0.0820, 0.0000, 0.0100, 0.0003, 0.0000, 0.2060, 0.1660, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
	loadSound(SOUND_TYPE.CRATE_PICKUP, ['noise', 0.0000, 0.4000, 0.0000, 0.0020, 0.0240, 0.0900, 20.0000, 372.0000, 2400.0000, 0.0000, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, -0.3420, 0.8090, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
	loadSound(SOUND_TYPE.CROW_CRASH, ['noise', 0.0000, 0.4000, 0.0000, 0.1520, 0.3930, 0.2740, 20.0000, 839.0000, 2400.0000, -0.3100, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, -0.3400, 0.7830, 0.0000, 0.0000, 0.6096, 0.5260, -0.0080, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
	loadSound(SOUND_TYPE.CROW_EAT, ['square', 0.0000, 0.4000, 0.0000, 0.0400, 0.0000, 0.0480, 20.0000, 578.0000, 2400.0000, 0.1040, 0.0000, 0.6830, 19.1580, 0.0003, 0.0000, 0.0000, 0.0000, 0.3850, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
	loadSound(SOUND_TYPE.DISPENSER, ['square', 0.0000, 0.4000, 0.0000, 0.0460, 0.4770, 0.2400, 20.0000, 1197.0000, 2400.0000, 0.0000, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.4980, 0.2040, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);
	loadSound(SOUND_TYPE.GRANNY_SHOT, ['noise', 0.0000, 0.4000, 0.0000, 0.1080, 0.3360, 0.1240, 20.0000, 462.0000, 2400.0000, 0.0000, 0.0000, 0.0000, 0.0100, 0.0003, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 1.0000, 0.0000, 0.0000, 0.0000, 0.0000]);


	//
	// INPUT
	//

	// Add event listener for key presses
	window.addEventListener('keyup', KeyHandler.onKeyUp, false);
	window.addEventListener('keydown', KeyHandler.onKeyDown, false);

	// Add touch events handlers if we are on a mobile device
	if (isMobileDevice) {

		// Start the game if the game canvas is clicked (instead of
		// clicking on the crow, like on desktop)
		function touchstart() {
			if (Game.state === GAME_STATE.MENU) {
				startGame();
			}
		}
		addEvent(canvas, touchStartEvent, touchstart);

		// Bind the overlay buttons.
		// Some of them require custom handlers, since their behavior
		// depends on which game state we are in.
		bindButtonToCustomFunction('s', function () {
			if (Game.state === GAME_STATE.MENU) {
				KeyHandler.onKeyDown({
					'keyCode': KEYCODES.DELETE
				});
			} else {
				crowShoot();
			}
		}, function () {
			KeyHandler.onKeyUp({
				'keyCode': KEYCODES.DELETE
			});
		});

		bindButtonToCustomFunction('a', function (evt) {
			if (Game.state === GAME_STATE.MENU) {
				KeyHandler.onKeyDown({
					'keyCode': KEYCODES.EXPORT_LEVEL
				});
			} else {
				crowEat(evt);
			}
		}, function () {
			KeyHandler.onKeyUp({
				'keyCode': KEYCODES.EXPORT_LEVEL
			});
		});

		bindButtonToCustomFunction('i', function () {
			KeyHandler.onKeyDown({
				'keyCode': (Game.state === GAME_STATE.MENU) ? KEYCODES.IMPORT_LEVEL : KEYCODES.INTERACT
			});
		}, function () {
			KeyHandler.onKeyUp({
				'keyCode': (Game.state === GAME_STATE.MENU) ? KEYCODES.IMPORT_LEVEL : KEYCODES.INTERACT
			});
		});

		bindButtonToKeyCode('x', KEYCODES.MENU);
		bindButtonToKeyCode('e', KEYCODES.EAT);
		bindButtonToKeyCode('l', KEYCODES.LEFT);
		bindButtonToKeyCode('u', KEYCODES.UP);
		bindButtonToKeyCode('r', KEYCODES.RIGHT);
		bindButtonToKeyCode('d', KEYCODES.DOWN);

		bindButtonToKeyCode('c', KEYCODES.CRATES);
		bindButtonToKeyCode('t', KEYCODES.TIME);
		bindButtonToKeyCode('n', KEYCODES.NAME);

		// Bind the custom handler to the analogPad to move the crow
		var analogPadHandler = function (evt) {
			evt.preventDefault();
			touchPositions = evt.changedTouches || evt;
			// TODO move this line to onResize
			analogPadDivPosition = analogPad.getBoundingClientRect(),
			isTouchinganalogPad = true;
		};
		addEvent(analogPad, touchStartEvent, analogPadHandler);
		addEvent(analogPad, touchMoveEvent, analogPadHandler);
		addEvent(analogPad, touchEndEvent, function (evt) {
			evt.preventDefault();
			isTouchinganalogPad = false;
		});

		// Avoid showing the context menu that appears when long
		// pressing a button.
		addEvent(document.body, 'contextmenu', function (evt) {
			evt.preventDefault();
		}, false);

	} else {
		// Use mouse events if we are not on a touch enabled device
		addEvent(canvas, 'click', crowShoot);
		addEvent(canvas, 'contextmenu', crowEat);

		addEvent(canvas, 'mousedown', function (evt) {
			if (evt.which === 1) isLeftMouseButtonDown = true;
			if ((Game.state === GAME_STATE.EDIT) && isLeftMouseButtonDown) {
				crowShoot();
			}
		});

		addEvent(canvas, 'mouseup', function (evt) {
			if (evt.which === 1) isLeftMouseButtonDown = false;
		});

		addEvent(canvas, 'mousemove', function (evt) {
			var tempCurMousePos = getCanvasRelativeCoords(evt);
			currentMousePosition = [tempCurMousePos[0], tempCurMousePos[1]];
			if (Game.state === GAME_STATE.PLAYING) { // Update the crow's position
				var newCrowPosition = getCanvasRelativeCoords(evt);
				Crow.nextPosition = newCrowPosition.slice();
			} else if ((Game.state === GAME_STATE.EDIT) && isLeftMouseButtonDown) {
				crowShoot();
			}
		});
	}

	//
	// GAME
	//

	// Load the first level
	resetGame(selectedLevel);



	/*////////////////////////////////////////
	 *
	 * Start the game loop
	 *
	 */ ///////////////////////////////////////
	(function gameLoop(t) {
		processInput(t);
		update(t);
		render(t);

		window.requestAnimationFrame(gameLoop);
	})();
})();