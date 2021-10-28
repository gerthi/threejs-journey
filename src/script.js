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
  color: '#4bcc37',
  lightColor: '#FFFFFF',
};

const aspectRatio = window.innerWidth / window.innerHeight;

scene = new THREE.Scene();

/**************
 ::::::::: CAMERA
**************/

camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.z = 8;
camera.position.y = 8;
camera.position.x = 1;

/**************
::::::::: MATERIAL
**************/
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('/bakedShadow.jpg');
const matcapTexture = textureLoader.load('/matcap.png');
const simpleShadow = textureLoader.load('/simpleShadow.jpg');

const material = new THREE.MeshStandardMaterial({
  color: parameters.color,
  roughness: 0.6,
  metalness: 0,
});

/**************
::::::::: MESHES
**************/

const planeGeo = new THREE.PlaneGeometry(8, 8);
const plane = new THREE.Mesh(
  planeGeo,
  new THREE.MeshStandardMaterial({ color: 'white' })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1;
plane.receiveShadow = true;

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
cube.castShadow = true;

const shadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = plane.position.y + 0.01;
shadow.position.x = cube.position.x + 0.5;
shadow.position.z = -cube.position.x - 0.5;

scene.add(plane, cube, shadow);

/**************
:::::::: LIGHTS
**************/

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(parameters.lightColor, 0.5);
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 8, 0.39, 0.5, 0.4);
spotLight.castShadow = true;
spotLight.position.set(-1, 2, 2);

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.position.set(-1, 2, 0);
pointLight.castShadow = true;

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

directionalLight.position.set(0.7, 1, 1.1);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0;
directionalLight.shadow.camera.far = 5;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.left = 2;
directionalLight.shadow.camera.right = -2;
directionalLight.shadow.camera.bottom = -1;

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);

directionalLightCameraHelper.visible = false;
spotLightHelper.visible = false;
pointLightHelper.visible = false;

scene.add(
  directionalLightCameraHelper,
  spotLight.target,
  spotLightHelper,
  pointLightHelper
);
scene.add(ambientLight, directionalLight, spotLight);

/**************
::::::::: RENDERER
**************/

renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = false;

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**************
::::::::: ANIMATION
**************/

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  cube.rotation.y = 0.1 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  cube.position.y = Math.abs(Math.sin(elapsedTime * 3));

  shadow.position.x = cube.position.x;
  shadow.position.z = cube.position.z;
  shadow.material.opacity = (1 - cube.position.y) * 0.3;

  controls.update;
  spotLightHelper.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

/**************
::::::::: DEBUG.UI
**************/

const gui = new dat.GUI();
gui.hide();

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('A intensity');
gui
  .addColor(parameters, 'lightColor')
  .onChange(() => {
    directionalLight.color.set(parameters.lightColor);
  })
  .name('D color');
gui
  .add(directionalLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.01)
  .name('D intensity');

gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.01);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.01);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.01);

gui.add(spotLight, 'angle');

gui.add(material, 'roughness').min(0).max(1).step(0.01);
gui.add(material, 'metalness').min(0).max(1).step(0.01);

gui.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color);
});

gui.add(cube.position, 'x').min(-5).max(5).step(0.01);
gui.add(cube.position, 'y').min(-5).max(5).step(0.01);

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
