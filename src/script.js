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
	lightColor: '#FFFFFF',
};

const aspectRatio = window.innerWidth / window.innerHeight;

scene = new THREE.Scene();

/**************
 ::::::::: CAMERA
**************/

camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.z = 3;
camera.position.y = 1;
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
::::::::: GALAXY
**************/

parameters.count = 1000;
parameters.size = 0.02;

const generateGalaxy = () => {
	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(parameters.count * 3);

	for (let i = 0; i < parameters.count; i++) {
		const i3 = i * 3;
		positions[i3] = (Math.random() - 0.5) * 3;
		positions[i3 + 1] = (Math.random() - 0.5) * 3;
		positions[i3 + 2] = (Math.random() - 0.5) * 3;
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

	const material = new THREE.PointsMaterial({
		size: parameters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
	});

	const points = new THREE.Points(geometry, material);
	scene.add(points);
};

generateGalaxy();

/**************
:::::::: LIGHTS
**************/

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

/**************
::::::::: RENDERER
**************/

renderer = new THREE.WebGLRenderer({
	canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**************
::::::::: ANIMATION
**************/

const clock = new THREE.Clock();

function animate() {
	const elapsedTime = clock.getElapsedTime();

	controls.update;
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();

/**************
::::::::: DEBUG.UI
**************/

const gui = new dat.GUI();
// gui.hide();
gui.add(parameters, 'count')
	.min(100)
	.max(1000000)
	.step(100)
	.onFinishChange(generateGalaxy);
gui.add(parameters, 'size')
	.min(0.001)
	.max(0.1)
	.step(0.001)
	.onFinishChange(generateGalaxy);
gui.add(ambientLight, 'intensity').min(0).max(2).step(0.01).name('A intensity');

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
