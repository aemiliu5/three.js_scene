import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { GUI } from 'https://unpkg.com/dat.gui@0.7.9/build/dat.gui.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- SCENE & CAMERA ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// --- LIGHTING ---
const dirLight = new THREE.DirectionalLight(0xbaccca);
dirLight.intensity = 1;
dirLight.castShadow = true;
dirLight.position.set(5,2,-1);

const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
scene.add(dirLight);
scene.add(dirLightHelper);

const ambLight = new THREE.AmbientLight(0x436866);
scene.add(ambLight);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.visible = true;
spotLight.position.set(0,3,0);
spotLight.castShadow = true;
spotLight.intensity = 10;
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLight);
scene.add(spotLightHelper);

// --- SKYBOX ---
const skyboxLoader = new THREE.CubeTextureLoader();

const skyboxFront       = "./skybox/front.png";
const skyboxBack        = "./skybox/back.png";
const skyboxLeft        = "./skybox/left.png";
const skyboxRight       = "./skybox/right.png";
const skyboxTop         = "./skybox/top.png";
const skyboxBottom      = "./skybox/bottom.png";

// --- TEXTURE IMPORTING ---
const cubeTextureLoader         = new THREE.TextureLoader();
const cubeTexture               = cubeTextureLoader.load('./textures/cube.jpg');

const planeTextureLoader        = new THREE.TextureLoader();
const planeTexture              = planeTextureLoader.load('./textures/ground.jpg');
planeTexture.wrapS              = THREE.RepeatWrapping;
planeTexture.wrapT              = THREE.RepeatWrapping;
planeTexture.repeat.set( 4, 4 );

const skyboxTexture = skyboxLoader.load([skyboxRight, skyboxLeft, skyboxTop, skyboxBottom, skyboxFront, skyboxBack]);
scene.background    = skyboxTexture;

// --- SCENE OBJECTS ---

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { 
	map: cubeTexture,
	envMap: skyboxTexture,
	roughness: 0.8,
	metalness: 0.2,
	//combine: THREE.MixOperation,
 } );

/*
let loadedModel;
const gltfLoader = new GLTFLoader();
gltfLoader.load('./mic.glb', function(gltf)
{
	loadedModel = gltf;
	scene.add(gltf.scene);
	gltf.animations;
	gltf.scene;
	gltf.cameras;
	gltf.asset;
});
//scene.add(gltfModel);*/

const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.receiveShadow = true;
scene.add( cube );

//spotLight.target = loadedModel;

const geometry2 = new THREE.PlaneGeometry(150,150);
const material2 = new THREE.MeshStandardMaterial( {
	map: planeTexture, 
	side: THREE.DoubleSide, 
	envMap: skyboxTexture, 
	roughness: 0.5, 
	metalness: 0.5,
} );
const plane = new THREE.Mesh( geometry2, material2 );
scene.add (plane);
plane.position.set(0,-1,0);
plane.rotation.x = Math.PI / 2;
plane.receiveShadow = true;

// --- VARIOUS ---
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true,
});

renderer.physicallyCorrectLights = true;
const canvas = renderer.domElement;

renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(canvas);

// --- ORBIT CONTROLS ---

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

// --- DAT GUI ---
const gui = new GUI();
const cubeFolder = gui.addFolder('Cube');
cubeFolder.add(cube.material, 'wireframe');
//cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2);
//cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2);
//cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2);
cubeFolder.open();
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera, 'fov', 0, 150).name("Field of View");
cameraFolder.open();
const lightFolder = gui.addFolder('Lighting');
lightFolder.add(dirLight, 'intensity', 0, 2).name("Directional Light Intensity");
lightFolder.add(ambLight, 'intensity', 0, 10).name("Ambient Light Intensity");
lightFolder.add(spotLight, 'intensity', 0, 100).name("Spot Light Intensity");
lightFolder.add(spotLight, 'penumbra', 0, 1).name("Spot Light Penumbra");
lightFolder.open();

// Resize window
window.addEventListener('resize', function() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

var test = 0;
//var rotatecube = false;
//var cubePosAmplitude = 5;
//var cubePosFrequency = 30;

// --- ANIMATION & FINAL RENDERING ---
function animate() 
{
	test++;
	requestAnimationFrame( animate );
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();

	//cube.rotation.x += 0.005;
	//cube.rotation.y += 0.005;
	cube.position.y = Math.sin(test / 30) / 5;
	renderer.render( scene, camera );
}

animate();