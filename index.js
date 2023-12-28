const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
    }

    draw() {
        c.save();

        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);
        c.beginPath();
        c.moveTo(this.position.x + 30, this.position.y);
        c.lineTo(this.position.x - 10, this.position.y - 10);
        c.lineTo(this.position.x - 10, this.position.y + 10);
        c.closePath();
        c.strokeStyle = 'white';
        c.stroke();

        c.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const player = new Player({ 
    position: {x: canvas.width/2, y: canvas.height/2},
    velocity: {x:0, y:0}
 });

 player.draw();

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

 const SPEED = 4;
 const ROTATIONAL_SPEED = 0.06;
 const FRICTION = .97;

 function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

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
 animate();
 
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