Game = function(canvasId) {
    // Canvas et engine défini ici
    var canvas = document.getElementById(canvasId);
    var engine = new BABYLON.Engine(canvas, true);
    var _this = this;
    _this.actualTime = Date.now();
    // On initie la scène avec une fonction associée à l'objet Game
    this.scene = this._initScene(engine);
    this.scene.collisionsEnabled = true;
    
    var _player = new Player(_this, canvas);

    var _arena = new Arena(_this);

    // Permet au jeu de tourner
engine.runRenderLoop(function () {

    // Récuperet le ratio par les fps
    _this.fps = Math.round(1000/engine.getDeltaTime());

    // Checker le mouvement du joueur en lui envoyant le ratio de déplacement
    //_player._checkMove((_this.fps)/60);

    _this.scene.render();
    
    // Si launchBullets est a true, on tire
    if(_player.camera.weapons.launchBullets === true){
        _player.camera.weapons.launchFire();
    }
});

    // Ajuste la vue 3D si la fenetre est agrandie ou diminuée
    window.addEventListener("resize", function () {
        if (engine) {
            engine.resize();
        }
    },false);

};

Game.prototype = {
    // Prototype d'initialisation de la scène
    _initScene : function(engine) {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor=new BABYLON.Color3(0,0,0);
        return scene;
    }
};