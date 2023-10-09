// Import modules
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
scene.add(light);

// Create a world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // m/s²

// Create a moon geometry and material (assuming the moon's radius is similar to the sphere)
const moonGeometry = new THREE.SphereGeometry(3, 32, 32);
const moonTexture = new THREE.TextureLoader().load("img/moon_map.jpg"); // 달 이미지 로드
const moonMaterial = new THREE.MeshLambertMaterial({ map: moonTexture });

// Create a moon mesh and add it to the scene
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moonMesh);

// Create a moon shape and body
const moonShape = new CANNON.Sphere(3); // radius (adjust it according to your moon size)
const moonBody = new CANNON.Body({ mass: 0 }); // Set mass to 0 for a static moon
moonBody.addShape(moonShape);
moonBody.position.set(0, 0, 0); // m (adjust it according to the desired moon position)
world.addBody(moonBody);

// Create a sphere geometry and material for the player's unit (red ball)
const unitGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const unitMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 }); // Red color

// Create the player's unit (red ball) and add it to the scene
const unitMesh = new THREE.Mesh(unitGeometry, unitMaterial);
scene.add(unitMesh);

// Create a unit shape and body
const unitShape = new CANNON.Sphere(0.5); // radius
const unitBody = new CANNON.Body({ mass: 1 }); // kg
unitBody.addShape(unitShape);
unitBody.position.set(0, 5, 0); // m (adjust it according to the starting position)
world.addBody(unitBody);

// Create an orbit control for the camera
const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.target.copy(unitMesh.position); // make the camera look at the unit

// Define the time step for the physics simulation
const fixedTimeStep = 1.0 / 60.0; // seconds

// Define the keyboard input variables
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// Add event listeners for the keyboard input
window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "ArrowUp":
            upPressed = true;
            break;
        case "ArrowDown":
            downPressed = true;
            break;
        case "ArrowLeft":
            leftPressed = true;
            break;
        case "ArrowRight":
            rightPressed = true;
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "ArrowUp":
            upPressed = false;
            break;
        case "ArrowDown":
            downPressed = false;
            break;
        case "ArrowLeft":
            leftPressed = false;
            break;
        case "ArrowRight":
            rightPressed = false;
            break;
    }
});

const clock = new THREE.Clock();

// Define the animation loop function
function animate() {
    requestAnimationFrame(animate);

    // Update the physics world
    const delta = Math.min(clock.getDelta(), 0.1); // limit delta time to avoid instability
    world.step(fixedTimeStep, delta);

    // Apply forces to the unit according to the keyboard input
    const forceFactor = 10; // N (adjust it according to the desired force)
    if (upPressed) {
        unitBody.applyLocalForce(new CANNON.Vec3(0, 0, -forceFactor), new CANNON.Vec3(0, 0, 0));
    }
    if (downPressed) {
        unitBody.applyLocalForce(new CANNON.Vec3(0, 0, forceFactor), new CANNON.Vec3(0, 0, 0));
    }
    if (leftPressed) {
        unitBody.applyLocalForce(new CANNON.Vec3(-forceFactor, 0, 0), new CANNON.Vec3(0, 0, 0));
    }
    if (rightPressed) {
        unitBody.applyLocalForce(new CANNON.Vec3(forceFactor, 0, 0), new CANNON.Vec3(0, 0, 0));
    }

    // Copy the position from the unit body to the unit mesh
    unitMesh.position.copy(new THREE.Vector3(unitBody.position.x, unitBody.position.y, unitBody.position.z));

    // Update the orbit control
    orbitControl.update();

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
