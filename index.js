const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//setting canvas to fit the screen & making background color black
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);

///////////////////////////////////////////////////////////////////////
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

        //beginPath and closePath further down ensure the animations don't bleed into each other
        c.beginPath();

        //defining spaceship appearance as a triangle
        c.moveTo(this.position.x + 30, this.position.y);
        c.lineTo(this.position.x - 10, this.position.y - 10);
        c.lineTo(this.position.x - 10, this.position.y + 10);

        //^see beginPath comment
        c.closePath();

        //defining the triangle as being made of white lines
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

    //a method to track the boundaries of the player's spaceship
    getVertices() {
        const cos = Math.cos(this.rotation)
        const sin = Math.sin(this.rotation)
      
        return [
          {
            x: this.position.x + cos * 30 - sin * 0,
            y: this.position.y + sin * 30 + cos * 0,
          },
          {
            x: this.position.x + cos * -10 - sin * 10,
            y: this.position.y + sin * -10 + cos * 10,
          },
          {
            x: this.position.x + cos * -10 - sin * -10,
            y: this.position.y + sin * -10 + cos * -10,
          },
        ]
      }
}
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }

    draw() {
        //beginPath and closePath further down ensure the animations don't bleed into each other
        c.beginPath();
        //defining a circle
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        //^see beginPath comment
        c.closePath();

        c.fillStyle = 'white';
        //creates circle
        c.fill();
    }

    update() {
        //calling the draw() function
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };
}
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
class Asteroid {
    constructor({ position, velocity, radius }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }

    draw() {
        //beginPath and closePath further down ensure the animations don't bleed into each other
        c.beginPath();
        //defining a circle
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        //^see beginPath comment
        c.closePath();

        c.strokeStyle = 'white';
        //creates circle
        c.stroke();
    }

    update() {
        //calling the draw() function
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };
}
///////////////////////////////////////////////////////////////////////
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
    },
    /*
    s: {
        pressed: false
    }
    */
 };

 //defining movement constants
 const SPEED = 2.5;
 const ROTATIONAL_SPEED = 0.06;
 const FRICTION = .97;
 const PROJECTILE_SPEED = 3;

 const projectiles = [];
 const asteroids = [];

 const intervalId = window.setInterval(() => {

    const index = Math.floor(Math.random() * 4);
    let x, y;
    let vx, vy;
    let radius = 50 * Math.random() + 10;

    switch (index) {
        case 0: //left
            x = 0 - radius;
            y = Math.random() * canvas.height;
            vx = 1;
            vy = 0;
            break
        case 1: //bottom
            x = Math.random() * canvas.width;
            y = canvas.height + radius;
            vx = 0;
            vy = -1;
            break
        case 2: //right
            x = canvas.width + radius;
            y = Math.random() * canvas.height;
            vx = -1;
            vy = 0;
            break
        case 4: //top
            x = Math.random() * canvas.width;
            y = 0 - radius;
            vx = 0;
            vy = 1;
            break
    }

    asteroids.push(new Asteroid({
        position: {
            x: x,
            y: y
        },
        velocity: {
            x: vx,
            y: vy
        },
        radius
    })
    );

    console.log(asteroids);
 }, 1000);

 function circleCollision(circle1, circle2) {
    const xDifference = circle2.position.x - circle1.position.x;
    const yDifference = circle2.position.y - circle1.position.y;
    const distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference);
    if (distance <= circle1.radius + circle2.radius) {
        console.log('yay');
        return true;
    }
    return false;
 }

 function circleTriangleCollision(circle, triangle) {
    // Check if the circle is colliding with any of the triangle's edges
    for (let i = 0; i < 3; i++) {
      let start = triangle[i]
      let end = triangle[(i + 1) % 3]
  
      let dx = end.x - start.x
      let dy = end.y - start.y
      let length = Math.sqrt(dx * dx + dy * dy)
  
      let dot =
        ((circle.position.x - start.x) * dx +
          (circle.position.y - start.y) * dy) /
        Math.pow(length, 2)
  
      let closestX = start.x + dot * dx
      let closestY = start.y + dot * dy
  
      if (!isPointOnLineSegment(closestX, closestY, start, end)) {
        closestX = closestX < start.x ? start.x : end.x
        closestY = closestY < start.y ? start.y : end.y
      }
  
      dx = closestX - circle.position.x
      dy = closestY - circle.position.y
  
      let distance = Math.sqrt(dx * dx + dy * dy)
  
      if (distance <= circle.radius) {
        return true
      }
    }
  
    // No collision
    return false
  }
  
  function isPointOnLineSegment(x, y, start, end) {
    return (
      x >= Math.min(start.x, end.x) &&
      x <= Math.max(start.x, end.x) &&
      y >= Math.min(start.y, end.y) &&
      y <= Math.max(start.y, end.y)
    )
  }

 //functional loop to create animation
 function animate() {
    const animationId = window.requestAnimationFrame(animate);
    //by placing fillStyle and player.update() in this order, the background remains constant and the spaceship remains visible without repeating
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    //loop is setup w the -1 and the i-- so as to start at the back of the array and move to the front
    for (let i = projectiles.length -1; i >= 0; i--) {
        const projectile = projectiles[i];
        projectile.update();

        //removing projectiles that went off screen
        //to the left
        if (projectile.position.x + projectile.radius < 0 ||
            //to the right
                projectile.position.x - projectile.radius > canvas.width ||
                //up top
                projectile.position.y + projectile.radius > canvas.height ||
                //below
                projectile.position.y + projectile.radius < 0
            ) {
            projectiles.splice(i, 1);
        }
    }

    for (let i = asteroids.length -1; i >= 0; i--) {
        const asteroid = asteroids[i];
        asteroid.update();

        if (circleTriangleCollision(asteroid, player.getVertices())) {
            console.log('GAME OVER');
            window.cancelAnimationFrame(animationId);
            window.clearInterval(intervalId);
        }

        if (asteroid.position.x + asteroid.radius < 0 ||
            //to the right
            asteroid.position.x - asteroid.radius > canvas.width ||
            //up top
            asteroid.position.y + asteroid.radius > canvas.height ||
            //below
            asteroid.position.y + asteroid.radius < 0
        ) {
            asteroids.splice(i, 1);
        }

        for (let j = projectiles.length -1; j >= 0; j--) {
            const projectile = projectiles[j];

            if (circleCollision(asteroid, projectile)) {
                asteroids.splice(i, 1);
                projectiles.splice(j, 1);
            }
        }
     
    }

    //conditional functions determining spaceship rotation and friction based on velocity
    if (keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED;
        player.velocity.y = Math.sin(player.rotation) * SPEED;
    } else if (!keys.w.pressed) {
        player.velocity.x *= FRICTION;
        player.velocity.y *= FRICTION;
    }
    /*
    if (keys.s.pressed) {
        player.velocity.x = (Math.cos(player.rotation) * -1)  * (SPEED/2);
        player.velocity.y = (Math.sin(player.rotation) * -1) * (SPEED/2);
    } else if (!keys.s.pressed) {
        player.velocity.x *= FRICTION;
        player.velocity.y *= FRICTION;
    }
    */
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
            /*
        case 'KeyS':
            keys.s.pressed = true;
            break
            */
        case 'Backspace':
            projectiles.push( new Projectile({
                position: {
                    x: player.position.x + Math.cos(player.rotation) * 30,
                    y: player.position.y + Math.sin(player.rotation) * 30
                },
                velocity: {
                    x: Math.cos(player.rotation) * PROJECTILE_SPEED,
                    y: Math.sin(player.rotation) * PROJECTILE_SPEED
                }
            }));

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
            /*
        case 'KeyS':
                keys.s.pressed = false;
                break
                */
    }
});