Game = function(canvasId) {
    // Canvas y motor
    var canvas = document.getElementById(canvasId);
    var engine = new BABYLON.Engine(canvas, true);
    var _this = this;
    
    this.scene = this._initScene(engine);
    var _player = new Player(_this, canvas);
    var _arena = new Arena(_this);
    
    engine.runRenderLoop(function () {
        _this.scene.render();
    });

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