Weapons = function (Player) {
  // On permet d'accéder à Player n'importe où dans Weapons
  this.Player = Player;

  // Positions selon l'arme non utilisée
  this.bottomPosition = new BABYLON.Vector3(0.5, -2.5, 1);

  // Changement de Y quand l'arme est séléctionnée
  this.topPositionY = -0.5;

  // Créons notre arme
  this.rocketLauncher = this.newWeapon(Player);

  // Cadence de tir
  this.fireRate = 800;

  // Delta de calcul pour savoir quand le tir est a nouveau disponible
  this._deltaFireRate = this.fireRate;

  // Variable qui va changer selon le temps
  this.canFire = true;

  // Variable qui changera à l'appel du tir depuis le Player
  this.launchBullets = false;

  // _this va nous permettre d'acceder à l'objet depuis des fonctions que nous utiliserons plus tard
  var _this = this;

  // Engine va nous être utile pour la cadence de tir
  var engine = Player.game.scene.getEngine();

  Player.game.scene.registerBeforeRender(function () {
    if (!_this.canFire) {
      _this._deltaFireRate -= engine.getDeltaTime();
      if (_this._deltaFireRate <= 0 && _this.Player.isAlive) {
        _this.canFire = true;
        _this._deltaFireRate = _this.fireRate;
      }
    }
  });
};

Weapons.prototype = {
  newWeapon: function (Player) {
    var newWeapon;
    newWeapon = BABYLON.Mesh.CreateBox(
      "rocketLauncher",
      0.5,
      Player.game.scene
    );
    newWeapon.isVisible = false;

    // Nous faisons en sorte d'avoir une arme d'apparence plus longue que large
    newWeapon.scaling = new BABYLON.Vector3(1, 0.7, 2);

    // On l'associe à la caméra pour qu'il bouge de la même facon
    newWeapon.parent = Player.camera;

    // On positionne le mesh APRES l'avoir attaché à la caméra
    newWeapon.position = this.bottomPosition.clone();
    newWeapon.position.y = this.topPositionY;

    BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "https://raw.githubusercontent.com/asanchez128/BabylonDemo/master/assets/models/basket/",
      "10431_Wicker_Basket_v1_L3.obj",
      Player.game.scene
    ).then((result) => {
      result.meshes[0].parent = Player.camera;
      result.meshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
      result.meshes[0].rotation.x = Math.PI * 1.5;
      result.meshes[0].position = new BABYLON.Vector3(1.5, -2.5, 0);
    });

    return newWeapon;
  },
  fire: function (pickInfo) {
    this.launchBullets = true;
  },
  stopFire: function (pickInfo) {
    this.launchBullets = false;
  },
  launchFire: function () {
    if (this.canFire) {
      var renderWidth = this.Player.game.scene.getEngine().getRenderWidth(true);
      var renderHeight = this.Player.game.scene
        .getEngine()
        .getRenderHeight(true);

      var direction = this.Player.game.scene.pick(
        renderWidth / 2,
        renderHeight / 2
      );
      direction = direction.pickedPoint.subtractInPlace(
        this.Player.camera.position
      );
      direction = direction.normalize();

      this.createRocket(this.Player.camera, direction, this.Player.game.scene);
      this.canFire = false;
    } else {
      // Nothing to do : cannot fire
    }
  },
  createRocket: function (playerPosition, direction, scene) {
    var positionValue = this.rocketLauncher.absolutePosition.clone();
    var rotationValue = playerPosition.rotation;
    var newRocket = BABYLON.MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1 },
      scene
    );
    newRocket.direction = new BABYLON.Vector3(
      Math.sin(rotationValue.y) * Math.cos(rotationValue.x),
      Math.sin(-rotationValue.x),
      Math.cos(rotationValue.y) * Math.cos(rotationValue.x)
    );
    newRocket.position = new BABYLON.Vector3(
      positionValue.x + newRocket.direction.x * 1,
      positionValue.y + newRocket.direction.y * 1,
      positionValue.z + newRocket.direction.z * 1
    );
    newRocket.rotation = new BABYLON.Vector3(
      rotationValue.x,
      rotationValue.y,
      rotationValue.z
    );
    newRocket.scaling = new BABYLON.Vector3(0.5, 0.5, 1);
    newRocket.isPickable = false;

    newRocket.material = new BABYLON.StandardMaterial("textureWeapon", scene);
    newRocket.material.diffuseColor = new BABYLON.Color3(0.15, 0.55, 0.1);

    this.Player.game._rockets.push(newRocket);
  },
};
