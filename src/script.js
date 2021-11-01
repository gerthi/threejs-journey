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
  color: '#4c6b40',
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

const material = new THREE.MeshStandardMaterial({
  color: parameters.color,
  roughness: 0.6,
  metalness: 0,
});

/**************
:::::::: TEXTURES
**************/

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load(
  '/textures/bricks/ambientOcclusion.jpg'
);
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load(
  '/textures/bricks/roughness.jpg'
);
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load(
  '/textures/grass/ambientOcclusion.jpg'
);
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load(
  '/textures/grass/roughness.jpg'
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**************
::::::::: MESHES
**************/

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
plane.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
plane.rotation.x = -(Math.PI / 2);
plane.receiveShadow = true;

// THE HOUSE

const house = new THREE.Group();

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

walls.position.y += walls.geometry.parameters.height / 2;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.rotation.y = Math.PI / 4;
roof.position.y = 3;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.set(0, 0.9, 2.01);

// Adding bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.85, 0.2, 2.2);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.33, 0.33, 0.33);
bush2.position.set(1.6, 0.1, 2.3);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.25, 0.25, 0.25);
bush3.position.set(-1.5, 0, 2.2);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.4, 0.4, 0.4);
bush4.position.set(-1.1, 0.2, 2.2);

house.add(walls, roof, door);
house.add(bush1, bush2, bush3, bush4);

// THE GRAVES

const graves = new THREE.Group();

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 4 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.6;
  grave.rotation.z = (Math.random() - 0.5) * 0.3;

  graves.add(grave);
}

scene.add(plane, house, graves);

/**************
:::::::: LIGHTS
**************/

const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
const doorLight = new THREE.PointLight('#ff7d46', 2, 7);

moonLight.position.set(4, 5, -2);
moonLight.castShadow = true;
doorLight.position.set(0, 2.5, 2.7);

const directionalLightHelper = new THREE.CameraHelper(moonLight.shadow.camera);
directionalLightHelper.visible = false;

scene.add(ambientLight, moonLight, doorLight, directionalLightHelper);

// GHOSTS

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
const ghost2 = new THREE.PointLight('#0EEA4A', 2, 3);
const ghost3 = new THREE.PointLight('#fff000', 2, 3);

scene.add(ghost1, ghost2, ghost3);

/**************
:::::::: FOG
**************/

const fog = new THREE.Fog('#262837', 1, 15);
scene.add(fog);

/**************
:::::::: CHIMNEY
**************/

// Creating the a chimney
const chimney = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1, 4, 4, true),
  new THREE.MeshStandardMaterial({ color: 'gray' })
);

const chimneyBottom = new THREE.Mesh(
  new THREE.PlaneGeometry(0.7, 0.7),
  new THREE.MeshStandardMaterial({ color: 'black' })
);

chimney.position.set(1.2, 3.3, 0);
chimney.rotation.y = Math.PI / 4;
chimney.material.side = THREE.DoubleSide;

chimneyBottom.position.set(1.2, 3.2, 0);
chimneyBottom.rotation.x = -(Math.PI / 2);
chimneyBottom.rotation.y = 0.2;

scene.add(chimney, chimneyBottom);

// Adding smoke somehow
const smokeParts = [];
let i;

const getRandomPos = (min, max) => {
  return Math.random() * (max - min) + min;
};

const smokeGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
// const smokeMaterial = new THREE.MeshStandardMaterial({
//   color: 'white',
//   roughness: 0.4,
//   flatShading: true,
//   metalness: 0.1,
// });
const smokeMaterial = new THREE.MeshNormalMaterial({
  flatShading: true,
});

function smokeItup() {
  let smokePart = new THREE.Mesh(smokeGeo, smokeMaterial);
  smokePart.position.set(
    getRandomPos(0.9, 1.5),
    getRandomPos(2, 3.3),
    getRandomPos(-0.3, 0.3)
  );
  smokeParts.push(smokePart);
  scene.add(smokePart);
}

smokeItup();

/**************
:::::::: SHADOWS
**************/

plane.receiveShadow = true;

moonLight.castShadow = true;
doorLight.castShadow = true;

moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 15;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

graves.children.forEach((grave) => {
  grave.castShadow = true;
});

/**************
::::::::: RENDERER
**************/

renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor('#262837');

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**************
::::::::: ANIMATION
**************/

const clock = new THREE.Clock();

console.log(smokeParts[0]);
function animate() {
  const elapsedTime = clock.getElapsedTime();

  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 7;
  ghost2.position.y = Math.sin(ghost2Angle) * 2;

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2.5);

  if (smokeParts.length > 100) {
    smokeParts.pop();
  }

  smokeParts.map((smokePart) => {
    smokePart.rotation.y = Math.sin(elapsedTime * 5);
    if (smokePart.position.y > 7) {
      smokePart.position.y = 2.5;
    } else {
      smokePart.position.y += Math.sin(Math.random() / 50);
      smokePart.scale.set(getRandomPos(0.5, 1.2), getRandomPos(0.5, 1.2));
    }
  });

  smokeItup();

  controls.update;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

/**************
::::::::: DEBUG.UI
**************/

const gui = new dat.GUI();
gui.hide();

gui
  .add(ambientLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.01)
  .name('light intensity');

gui.add(material, 'roughness').min(0).max(1).step(0.01);
gui.add(material, 'metalness').min(0).max(1).step(0.01);

gui.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color);
});

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
