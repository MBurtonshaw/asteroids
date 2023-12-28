const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//setting canvas to fit the screen & making background color black
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);

//Player class
class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
    }

    //function that creates the spaceship and sets its movement
    draw() {
        c.save();

        //allows the spaceship to rotate
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);

        //defining spaceship appearance
        c.beginPath();
        c.moveTo(this.position.x + 30, this.position.y);
        c.lineTo(this.position.x - 10, this.position.y - 10);
        c.lineTo(this.position.x - 10, this.position.y + 10);
        c.closePath();
        c.strokeStyle = 'white';
        c.stroke();

        c.restore();
    }

    //function that allows for forward movement and keeps the background a constant color
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

//defining player 1
const player = new Player({ 
    position: {x: canvas.width/2, y: canvas.height/2},
    velocity: {x:0, y:0}
 });

 player.draw();

 //defining keys for movement
 const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
 };

 //defining movement constants
 const SPEED = 4;
 const ROTATIONAL_SPEED = 0.06;
 const FRICTION = .97;

 //functional loop to create animation
 function animate() {
    window.requestAnimationFrame(animate);
    //by placing fillStyle and player.update() in this order, the background remains constant
    //and the spaceship remains visible without repeating
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    //conditional functions determining spaceship rotation and friction based on velocity
    if (keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED;
        player.velocity.y = Math.sin(player.rotation) * SPEED;
    } else if (!keys.w.pressed) {
        player.velocity.x *= FRICTION;
        player.velocity.y *= FRICTION;
    }
    if (keys.a.pressed) {
        player.rotation += ROTATIONAL_SPEED;
    } else if (keys.d.pressed) {
        player.rotation -= ROTATIONAL_SPEED;
    };
 }

 //starts the animation loop
 animate();
 
 //event listeners for spaceship movement
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW':
            keys.w.pressed = true;
            break
        case 'KeyA':
            keys.a.pressed = true;
            break
        case 'KeyD':
            keys.d.pressed = true;
            break
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW':
            keys.w.pressed = false;
            break
        case 'KeyA':
            keys.a.pressed = false;
            break
        case 'KeyD':
            keys.d.pressed = false;
            break
    }
});