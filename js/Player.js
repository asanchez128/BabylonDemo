Player = function(game, canvas) {
    // La scène du jeu
    this.scene = game.scene;

    // Initialisation de la caméra
    this._initCamera(this.scene, canvas);
    
};

Player.prototype = {
    _initCamera : function(scene, canvas) {
        // On crée la caméra
        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-20, 5, 0), scene);
        
        // Axe de mouvement X et Z
        this.camera.axisMovement = [false,false,false,false];
        
        // Si le joueur est en vie ou non
        this.isAlive = true;
        
        // On demande à la caméra de regarder au point zéro de la scène
        this.camera.setTarget(BABYLON.Vector3.Zero());
    },
};