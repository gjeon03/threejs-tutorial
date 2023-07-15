import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1.6, 1.7, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
let geometry = new THREE.BufferGeometry();
const points = [
  new THREE.Vector3(-1, 1, -1), //c
  new THREE.Vector3(-1, -1, 1), //b
  new THREE.Vector3(1, 1, 1), //a

  new THREE.Vector3(1, 1, 1), //a
  new THREE.Vector3(1, -1, -1), //d
  new THREE.Vector3(-1, 1, -1), //c

  new THREE.Vector3(-1, -1, 1), //b
  new THREE.Vector3(1, -1, -1), //d
  new THREE.Vector3(1, 1, 1), //a

  new THREE.Vector3(-1, 1, -1), //c
  new THREE.Vector3(1, -1, -1), //d
  new THREE.Vector3(-1, -1, 1), //b
];

geometry.setFromPoints(points);
geometry.computeVertexNormals();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const stats = new Stats();
document.body.appendChild(stats.dom);

let data = {
  x: 1,
};
const gui = new GUI();
gui.add(data, "x", -5, -1, 0.01).onChange(() => {
  ((geometry.attributes.position as THREE.BufferAttribute).array[3] as number) =
    data.x;
  geometry.attributes.position.needsUpdate = true;
});
gui.open();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
