import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { GUI } from 'https://unpkg.com/dat.gui/build/dat.gui.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- SCENE & CAMERA ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );

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

const spotLight = new THREE.SpotLight(0x308b71);
spotLight.visible = true;
spotLight.position.set(0,10,12);

scene.add(spotLight.target);
spotLight.target.position.set(0,0,12);
spotLight.castShadow = true;
spotLight.intensity = 600;
spotLight.penumbra = 0.75;
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLight);
scene.add(spotLightHelper);

const pointLight = new THREE.PointLight(0xff4228, 48, 24);
pointLight.position.set(-3.75, 3.75, -13.5);
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLight);
//scene.add(pointLightHelper);

const pointLight2 = new THREE.PointLight(0x42ff28, 48, 24);
pointLight2.position.set(3.75, 3.75, -13.5);
const pointLightHelper2 = new THREE.PointLightHelper(pointLight2);
scene.add(pointLight2);
//scene.add(pointLightHelper2);

const pointLight3 = new THREE.PointLight(0xffffaa, 64, 256);
pointLight3.position.set(0, 3, -14.5);
const pointLightHelper3 = new THREE.PointLightHelper(pointLight3);
scene.add(pointLight3);
//scene.add(pointLightHelper3);

// --- SKYBOX ---
const skyboxLoader = new THREE.CubeTextureLoader();

const skyboxFront       = "./skybox/front.png";
const skyboxBack        = "./skybox/back.png";
const skyboxLeft        = "./skybox/left.png";
const skyboxRight       = "./skybox/right.png";
const skyboxTop         = "./skybox/top.png";
const skyboxBottom      = "./skybox/bottom.png";

// --- TEXTURE IMPORTING ---
//const cubeTextureLoader         = new THREE.TextureLoader();
//const cubeTexture               = cubeTextureLoader.load('./textures/cube.jpg');

const planeTextureLoader        = new THREE.TextureLoader();
const planeTexture              = planeTextureLoader.load('./textures/ground.jpg');
planeTexture.wrapS              = THREE.RepeatWrapping;
planeTexture.wrapT              = THREE.RepeatWrapping;
planeTexture.repeat.set( 5, 5 );
planeTexture.anisotropy = 16;

const skyboxTexture = skyboxLoader.load([skyboxRight, skyboxLeft, skyboxTop, skyboxBottom, skyboxFront, skyboxBack]);
scene.background    = skyboxTexture;

// --- SCENE OBJECTS ---

/*
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { 
	map: cubeTexture,
	envMap: skyboxTexture,
	roughness: 0.8,
	metalness: 0.2,
	//combine: THREE.MixOperation,
 } );
 */


let loadedModel;
const gltfLoader = new GLTFLoader();
gltfLoader.load('./models/spaceship.glb', function(gltf)
{
	loadedModel = gltf;
	scene.add(gltf.scene);
	gltf.scene.children[0].scale.set(5,5,5);
	gltf.scene.children[0].rotation.set(0,0,0);
	gltf.scene.children[0].position.set(0,2,-8);
	gltf.scene.children[0].castShadow = true;
	gltf.scene.children[0].receiveShadow = true;
	gltf.materials;
	gltf.animations;
	gltf.scene;
	gltf.asset;
});
scene.add(loadedModel);

let loadedModel2;
const gltfLoader2 = new GLTFLoader();
gltfLoader2.load('./models/energy_station.glb', function(gltf)
{
	loadedModel2 = gltf;
	scene.add(gltf.scene);
	gltf.scene.children[0].scale.set(0.02,0.02,0.02);
	gltf.scene.children[0].position.set(0,-0.5,-15);
	gltf.scene.children[0].receiveShadow = true;
	gltf.materials;
	gltf.animations;
	gltf.scene;
	gltf.asset;
});
scene.add(loadedModel2);

let loadedModel3;
const gltfLoader3 = new GLTFLoader();
gltfLoader3.load('./models/street_light.glb', function(gltf)
{
	loadedModel3 = gltf;
	scene.add(gltf.scene);
	gltf.scene.children[0].scale.set(0.03,0.03,0.03);
	gltf.scene.children[0].position.set(0,-1,15);
	gltf.scene.children[0].rotation.set(Math.PI * -1.5,Math.PI * 1, Math.PI * -0.5);
	gltf.scene.children[0].receiveShadow = true;
	gltf.materials;
	gltf.animations;
	gltf.scene;
	gltf.asset;

	gltf.castShadow = true;
	gltf.receiveShadow = true;
});
scene.add(loadedModel3);

/*
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.receiveShadow = true;
scene.add( cube );
*/

const geometry2 = new THREE.PlaneGeometry(75,75);
const material2 = new THREE.MeshStandardMaterial( {
	map: planeTexture, 
	side: THREE.DoubleSide, 
	envMap: skyboxTexture, 
	roughness: 0.9, 
	metalness: 0,
} );
const plane = new THREE.Mesh( geometry2, material2 );
scene.add (plane);
plane.position.set(0,-1,0);
plane.rotation.x = Math.PI / 2;
plane.receiveShadow = true;

// --- VARIOUS ---
camera.position.set(-22,5,17.5);

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true,
});

renderer.physicallyCorrectLights = true;
const canvas = renderer.domElement;

renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(canvas);

// --- CONTROLS ---

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

var spaceshipControls = new function()
{
	this.offset = 2.5;
	this.cubePosAmplitude = 0.2;
	this.cubePosFrequency = 0.02;
	this.rotationx = Math.PI * 1.5;
	this.rotationy = 0;
	this.rotationz = Math.PI * 1.5;
}

var lightControls = new function()
{
	this.spotlightHelper = false;
	this.dirLightHelper  = false;
}

// --- DAT GUI ---
const gui = new GUI( { width: 400 } );
const spaceshipFolder = gui.addFolder('Spaceship');
spaceshipFolder.add(spaceshipControls, 'cubePosAmplitude', 0.0, 2.0).name("Movement Amplitude");
spaceshipFolder.add(spaceshipControls, 'cubePosFrequency', 0.0, 0.2).name("Movement Frequency");
spaceshipFolder.add(spaceshipControls, 'offset', 0.5, 10).name("Movement Y Offset");
spaceshipFolder.open();
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera, 'fov', 20, 150).name("Field of View");
cameraFolder.open();
const lightFolder = gui.addFolder('Lighting Parameters');
lightFolder.add(dirLight, 'intensity', 0, 3).name("Directional Light Intensity");
lightFolder.add(ambLight, 'intensity', 0, 5).name("Ambient Light Intensity");
lightFolder.add(spotLight, 'intensity', 0, 750).name("Spot Light Intensity");
lightFolder.add(spotLight, 'penumbra', 0, 1).name("Spot Light Penumbra");
//lightFolder.add(spotLight, 'distance', 0, 1000).name("Spot Light Distance");
//lightFolder.add(spotLight.position, 'y', 0, 100).name("Spot Light Height");
lightFolder.open();
const lightFolder2 = gui.addFolder('Debugging');
lightFolder2.add(lightControls, 'spotlightHelper').name("Visualise Spot Light");
lightFolder2.add(lightControls, 'dirLightHelper').name("Visualise Directional Light");
lightFolder2.open();

// Resize window
window.addEventListener('resize', function() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function updateHelpers()
{
	// Update Helpers
	if(lightControls.spotlightHelper == true)
		spotLightHelper.visible = true;
	else
		spotLightHelper.visible = false;

	if(lightControls.dirLightHelper == true)
		dirLightHelper.visible = true;
	else
		dirLightHelper.visible = false;
}

var sineVar = 0
// --- FINAL RENDERING ---
function update() 
{
	sineVar++;

	updateHelpers();

	requestAnimationFrame( update );
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();

	if(loadedModel != null)
	{
		loadedModel.scene.children[0].rotation.set(spaceshipControls.rotationx,spaceshipControls.rotationy,spaceshipControls.rotationz);
		loadedModel.scene.children[0].position.y = spaceshipControls.offset + Math.sin(sineVar * spaceshipControls.cubePosFrequency) * spaceshipControls.cubePosAmplitude;
	}

	renderer.render( scene, camera );
}

update();