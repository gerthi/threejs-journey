import './style.css';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**************
::::::::: SETUP
**************/

let camera, renderer, scene;

const canvas = document.querySelector('canvas.webgl');

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const parameters = {
  color: '#FFFFFF',
  lightColor: '#ff04c7',
  spin: () => {
    gsap.to(sphere.rotation, {
      duration: 1,
      y: sphere.rotation.y + Math.PI,
      x: sphere.rotation.y + Math.PI,
    });
  },
};

const aspectRatio = window.innerWidth / window.innerHeight;

scene = new THREE.Scene();

/**************
 ::::::::: CAMERA
**************/

camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.z = 3;

/**************
::::::::: MESHES
**************/

const material = new THREE.MeshStandardMaterial({
  color: parameters.color,
  metalness: 0.2,
  roughness: 0.4,
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), material);
scene.add(sphere);

/**************
:::::::: LIGHTS
**************/

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(parameters.lightColor, 0.85);

pointLight.position.x = 2;
pointLight.position.y = 2;
pointLight.position.z = 4;

scene.add(ambientLight, pointLight);

/**************
::::::::: RENDERER
**************/

renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**************
::::::::: ANIMATION
**************/

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  pointLight.position.x = Math.sin(elapsedTime) * Math.PI * 2;

  controls.update;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

/**************
::::::::: DEBUG.UI
**************/

const gui = new dat.GUI();
const pointLightFolder = gui.addFolder('pointLight');
const sphereFolder = gui.addFolder('sphere');

gui.add(parameters, 'spin');

sphereFolder.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color);
});
sphereFolder.add(material, 'metalness').min(0).max(1).step(0.0001);
sphereFolder.add(material, 'roughness').min(0).max(1).step(0.0001);
sphereFolder.add(material, 'wireframe');

pointLightFolder.addColor(parameters, 'lightColor').onChange(() => {
  pointLight.color.set(parameters.lightColor);
});

pointLightFolder
  .add(pointLight.position, 'y')
  .min(-10)
  .max(10)
  .step(0.1)
  .name('Height');

pointLightFolder
  .add(pointLight.position, 'x')
  .min(-10)
  .max(10)
  .step(0.1)
  .name('Position');

pointLightFolder
  .add(pointLight, 'intensity')
  .min(0)
  .max(3)
  .step(0.01)
  .name('Intensity');

/**************
::::::::: RESPONSIVE
**************/

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
