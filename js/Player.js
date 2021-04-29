Player = function (game, canvas) {
  // _this est l'accès à la caméraà l'interieur de Player
  var _this = this;

  // Si le tir est activée ou non
  this.weaponShoot = false;
  this.controlEnabled = true;

  // Le jeu, chargé dans l'objet Player
  this.game = game;

  // Initialisation de la caméra
  this._initCamera(this.game.scene, canvas);

  // On récupère le canvas de la scène
  var canvas = this.game.scene.getEngine().getRenderingCanvas();

  // On affecte le clic et on vérifie qu'il est bien utilisé dans la scène (_this.controlEnabled)
  canvas.addEventListener(
    "pointerdown",
    function (evt) {
      if (_this.controlEnabled && !_this.weaponShoot) {
        _this.weaponShoot = true;
        _this.handleUserMouseDown();
      }
    },
    false
  );

  // On fait pareil quand l'utilisateur relache le clic de la souris
  canvas.addEventListener(
    "pointerup",
    function (evt) {
      if (_this.controlEnabled && _this.weaponShoot) {
        _this.weaponShoot = false;
        _this.handleUserMouseUp();
      }
    },
    false
  );
};

Player.prototype = {
  _initCamera: function (scene, canvas) {
    //         var playerBox = BABYLON.Mesh.CreateBox("headMainPlayer", 3, scene);
    // playerBox.position = new BABYLON.Vector3(-20, 5, 0);
    // playerBox.ellipsoid = new BABYLON.Vector3(2, 2, 2);
    // On crée la caméra
    this.camera = new BABYLON.UniversalCamera(
      "camera",
      new BABYLON.Vector3(-20, 5, 0),
      scene
    );
    // this.camera.playerBox = playerBox;
    // this.camera.parent = playerBox;
    this.camera.applyGravity = true;
    this.camera.checkCollisions = true;
    this.camera.ellipsoid = new BABYLON.Vector3(1, 1.7, 1);

    // Axe de mouvement X et Z
    //this.camera.axisMovement = [false,false,false,false];

    // Si le joueur est en vie ou non
    this.isAlive = true;

    // Pour savoir que c'est le joueur principal
    this.camera.isMain = true;
    // La santé du joueur
    this.camera.health = 100;
    // L'armure du joueur
    this.camera.armor = 0;

    // On demande à la caméra de regarder au point zéro de la scène
    this.camera.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    this.camera.attachControl(canvas, true);

    // Appel de la création des armes
    this.camera.weapons = new Weapons(this);
    // var hitBoxPlayer = BABYLON.Mesh.CreateBox("hitBoxPlayer", 3, scene);
    // hitBoxPlayer.parent = this.camera.playerBox;
    // hitBoxPlayer.scaling.y = 2;
    // hitBoxPlayer.isPickable = true;
    // hitBoxPlayer.isMain = true;
  },
  handleUserMouseDown: function () {
    if (this.isAlive === true) {
      this.camera.weapons.fire();
    }
  },
  handleUserMouseUp: function () {
    if (this.isAlive === true) {
      this.camera.weapons.stopFire();
    }
  },
};
