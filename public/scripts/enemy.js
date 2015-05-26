define([], function () { 
    /**
      * The enemy used by the client side but instantiated and controlled by the server.
      * @param {EnemyN} enemyN The networking-related enemy object.
      */
    var Enemy = function (enemyN) {

        var self = this;

        // Keep the server reference
        self.id = enemyN.id;

        // Create a new Sprite using the texture
        self.sprite = new PIXI.Sprite(PIXI.loader.resources.soldier.texture);
        
        // Scale the image
        self.sprite.scale = { x: 1.5, y: 1.5 };
    
        // Center the sprite's anchor point
        self.sprite.anchor = { x: 0.5, y: 0.5 };

        // Set up position
        self.sprite.position.x = enemyN.position.x;
        self.sprite.position.y = enemyN.position.y;

        // Events
        self.sprite.interactive = true;
        self.sprite.on("mousedown", emitOnHit);
        self.sprite.on("touchstart", emitOnHit);

        /**
         * Triggers the hit event.
         */
        function emitOnHit(event) {
            if (self.onHit) {
                self.onHit(event);
            }
        }

    };

    return Enemy;
});