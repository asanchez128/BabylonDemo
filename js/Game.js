Game = function (canvasId) {
  // Canvas et engine défini ici
  var canvas = document.getElementById(canvasId);
  var engine = new BABYLON.Engine(canvas, true);
  var _this = this;
  _this.actualTime = Date.now();
  // On initie la scène avec une fonction associée à l'objet Game
  this.scene = this._initScene(engine);

  var _player = new Player(_this, canvas);

  var _arena = new Arena(_this);

  this._PlayerData = _player;

  // Les roquettes générées dans Player.js
  this._rockets = [];

  // Les explosions qui découlent des roquettes
  this._explosionRadius = [];

  // Permet au jeu de tourner
  engine.runRenderLoop(function () {
    // Récuperet le ratio par les fps
    _this.fps = Math.round(1000 / engine.getDeltaTime());

    // Checker le mouvement du joueur en lui envoyant le ratio de déplacement
    //_player._checkMove((_this.fps)/60);
    // On apelle nos deux fonctions de calcul pour les roquettes
    _this.renderRockets();
    _this.renderExplosionRadius();

    _this.scene.render();

    // Si launchBullets est a true, on tire
    if (_player.camera.weapons.launchBullets === true) {
      _player.camera.weapons.launchFire();
    }
  });

  // Ajuste la vue 3D si la fenetre est agrandie ou diminuée
  window.addEventListener(
    "resize",
    function () {
      if (engine) {
        engine.resize();
      }
    },
    false
  );
};

Game.prototype = {
  // Prototype d'initialisation de la scène
  _initScene: function (engine) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;
    return scene;
  },
  renderRockets: function () {
    for (var i = 0; i < this._rockets.length; i++) {
      // On crée un rayon qui part de la base de la roquette vers l'avant
      var rayRocket = new BABYLON.Ray(
        this._rockets[i].position,
        this._rockets[i].direction
      );

      // On regarde quel est le premier objet qu'on touche
      var meshFound = this._rockets[i].getScene().pickWithRay(rayRocket);

      // Si la distance au premier objet touché est inférieure à 10, on détruit la roquette
      if (!meshFound || meshFound.distance < 10) {
        // On vérifie qu'on a bien touché quelque chose
        if (meshFound.pickedMesh && !meshFound.pickedMesh.isMain) {
          // On crée une sphere qui représentera la zone d'impact
          var explosionRadius = BABYLON.Mesh.CreateSphere(
            "sphere",
            5.0,
            20,
            this.scene
          );
          // On positionne la sphère là où il y a eu impact
          explosionRadius.position = meshFound.pickedPoint;
          // On fait en sorte que les explosions ne soient pas considérées pour le Ray de la roquette
          explosionRadius.isPickable = false;
          // On crée un petit material orange
          explosionRadius.material = new BABYLON.StandardMaterial(
            "textureExplosion",
            this.scene
          );
          explosionRadius.material.diffuseColor = new BABYLON.Color3(1, 0.6, 0);
          explosionRadius.material.specularColor = new BABYLON.Color3(0, 0, 0);
          explosionRadius.material.alpha = 0.8;

          if (
            this._PlayerData.isAlive &&
            this._PlayerData.camera.playerBox &&
            explosionRadius.intersectsMesh(this._PlayerData.camera.playerBox)
          ) {
            // Envoi à la fonction d'affectation des dégâts
            console.log("hit");
          }

          this._explosionRadius.push(explosionRadius);
        }
        this._rockets[i].dispose();
        // On enlève de l'array _rockets le mesh numéro i (défini par la boucle)
        this._rockets.splice(i, 1);
      } else {
        let relativeSpeed = 1 / (this.fps / 60);
        this._rockets[i].translate(
          new BABYLON.Vector3(0, 0, 1),
          relativeSpeed,
          0
        );
      }
    }
  },
  renderExplosionRadius: function () {
    if (this._explosionRadius.length > 0) {
      for (var i = 0; i < this._explosionRadius.length; i++) {
        this._explosionRadius[i].material.alpha -= 0.02;
        if (this._explosionRadius[i].material.alpha <= 0) {
          this._explosionRadius[i].dispose();
          this._explosionRadius.splice(i, 1);
        }
      }
    }
  },
};
