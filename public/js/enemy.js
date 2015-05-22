/**
 * The enemy used by the client side but instantiated and controlled by the server.
 * @param {EnemyN} enemyN The networking-related enemy object.
 */
var Enemy = function (enemyN) {

    var self = this;

    // Keep the server reference
    self.id = enemyN.id;

    // Create a texture from an image path
    var enemyTexture = PIXI.Texture.fromImage("/assets/soldier.gif");
	
    // Create a new Sprite using the texture
    self.sprite = new PIXI.Sprite(enemyTexture);
    
    // Center the sprite's anchor point
    self.sprite.anchor.x = 0.5;
    self.sprite.anchor.y = 0.5;

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

    return self;

};