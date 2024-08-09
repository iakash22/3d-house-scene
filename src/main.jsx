import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './index.css'
import * as THREE from 'three'
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import {
  BricksAmbient, BricksColor, BricksNormal, BricksRough,
  GrassAmbient, GrassColor, GrassNormal, GrassRough,
  DoorAlpha, DoorAmbient, DoorColor, DoorHeight, DoorMetal, DoorNormal, DoorRough,
  Road,
  Moon,
  Wood,
  Roof,
  Branch
} from './assets/textures/index'
import GUI from 'lil-gui';
// import EnvBg1 from './assets/environment/env1.hdr';

const scene = new THREE.Scene();
const gui = new GUI();
const guiProps = {
  moon: true,
}
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 15;
camera.position.x = -2;
camera.position.y = 5;
scene.add(camera);

const textureLoader = new THREE.TextureLoader();
// Door texture
const doorColor = textureLoader.load(DoorColor);
doorColor.colorSpace = THREE.SRGBColorSpace;

const doorAlphaTexture = textureLoader.load(DoorAlpha);
const doorAmbientTexture = textureLoader.load(DoorAmbient);
const doorHeightTexture = textureLoader.load(DoorHeight);
const doorMetalTexture = textureLoader.load(DoorMetal);
const doorRoughTexture = textureLoader.load(DoorRough);
const doorNormalTexture = textureLoader.load(DoorNormal);

// House texture
const walltexture = textureLoader.load(BricksColor);
walltexture.colorSpace = THREE.SRGBColorSpace;

const wallNormaltexture = textureLoader.load(BricksNormal);
const wallAmbienttexture = textureLoader.load(BricksAmbient);
const wallRoughtexture = textureLoader.load(BricksRough);

// Road texture
const roadTexture = textureLoader.load(Road);
roadTexture.colorSpace = THREE.SRGBColorSpace;

// Grass texture
const grassAmbientTexture = textureLoader.load(GrassAmbient);
const grassColorTexture = textureLoader.load(GrassColor);
const grassNormalTexture = textureLoader.load(GrassNormal);
const grassRoughTexture = textureLoader.load(GrassRough);
grassColorTexture.colorSpace = THREE.SRGBColorSpace;
grassColorTexture.repeat.set(10, 10);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;

const moonColorTexture = textureLoader.load(Moon);
moonColorTexture.colorSpace = THREE.SRGBColorSpace;

const woodColorTexture = textureLoader.load(Wood);
woodColorTexture.colorSpace = THREE.SRGBColorSpace;

const roofColorTexture = textureLoader.load(Roof);
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
roofColorTexture.repeat.set(3, 2);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapT = THREE.RepeatWrapping;
roofColorTexture.mipmaps = true;

const branchColorTexture = textureLoader.load(Branch);
branchColorTexture.colorSpace = THREE.SRGBColorSpace;

const ambientLight = new THREE.AmbientLight(0xfffffff, 0.1);
scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(0xfffffff, 3.5);
directionalLight.position.set(4, 5, 5);
directionalLight.shadow.camera.near = 1.
directionalLight.shadow.camera.far = 15
scene.add(directionalLight);
directionalLight.castShadow = !guiProps.moon;
directionalLight.visible = !guiProps.moon;

const pointLight = new THREE.PointLight('#fff', 10);
pointLight.position.set(-5, -6, -15)
// spotLight.shadow.camera.near = 10;
// spotLight.shadow.camera.far = 1.5;
pointLight.castShadow = guiProps.moon;
pointLight.visible = guiProps.moon;
scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper)

// const cameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(cameraHelper)


const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshBasicMaterial({ color: "yellow", map: moonColorTexture })
);
moon.position.set(-5, -6, -15)
scene.add(moon);
moon.visible = guiProps.moon
gsap.to(moon.scale, { x: 1.01, z: 1.01, y: 1.01, duration: 0.5, repeat: -1 });
gsap.to(moon.position, { x: -5, z: -1, y: 6, duration: 5 });
gsap.to(pointLight.position, { x: -4, z: 1, y: 5, duration: 5.2 });


const groupAll = new THREE.Group();
scene.add(groupAll);
groupAll.position.y = -1;
const groupHouse = new THREE.Group();
scene.add(groupHouse);
groupAll.add(groupHouse);
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: walltexture,
    aoMap: wallAmbienttexture,
    roughnessMap: wallRoughtexture,
    normalMap: wallNormaltexture,
  })
);
wall.castShadow = guiProps.moon;
wall.position.y = 1.25;
groupHouse.add(wall);

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(4, 2, 4),
  new THREE.MeshStandardMaterial({ color: "#eee", map: roofColorTexture })
);
roof.castShadow = guiProps.moon;
roof.position.y = 3.5;
roof.rotation.y = Math.PI / 4;
groupHouse.add(roof);

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: doorColor,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientTexture,
    transparent: true,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    roughnessMap: doorRoughTexture,
    metalnessMap: doorMetalTexture,
    normalMap: doorNormalTexture,
  })
)
door.position.z = 2.01;
door.position.y = 1
groupHouse.add(door);

const groupTree = new THREE.Group();
groupTree.position.set(-6, 0, 3);
scene.add(groupTree);
groupAll.add(groupTree);

groupTree.castShadow = true;

const wood = new THREE.Mesh(
  new THREE.CylinderGeometry(0.15, 0.15, 4),
  new THREE.MeshStandardMaterial({ color: 'brown', map: woodColorTexture, roughness: 1.2 })
)
wood.position.y = 2.01;
wood.castShadow = true;
groupTree.add(wood);

const branch1 = new THREE.Mesh(
  new THREE.ConeGeometry(2, 1, 5),
  new THREE.MeshStandardMaterial({ color: 'green', map: branchColorTexture })
);
branch1.position.y = 2;
branch1.castShadow = true;

const branch2 = new THREE.Mesh(
  new THREE.ConeGeometry(1.5, 1.3, 5),
  new THREE.MeshStandardMaterial({ color: 'green', map: branchColorTexture })
);
branch2.position.y = 3;
branch2.castShadow = true;

const branch3 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 1.3, 9),
  new THREE.MeshStandardMaterial({ color: 'green', map: branchColorTexture })
);
branch3.position.y = 4;
branch3.castShadow = true;
groupTree.add(branch1, branch2, branch3);


const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 30),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientTexture,
    roughnessMap: grassRoughTexture,
    normalMap: grassNormalTexture,
  })
)
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
groupAll.add(floor);

const road1 = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 4),
  new THREE.MeshStandardMaterial({ map: roadTexture })
)
road1.rotation.x = -Math.PI / 2;
road1.position.z = 7;
road1.position.y = 0.1;
groupAll.add(road1);
road1.receiveShadow = true;

const road2 = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 4),
  new THREE.MeshStandardMaterial({ map: roadTexture })
)
road2.rotation.x = -Math.PI / 2;
road2.position.z = 11;
road2.position.y = 0.1;
groupAll.add(road2);
road2.receiveShadow = true;

const groupCar1 = new THREE.Group();
groupCar1.position.z = 7;
groupCar1.position.x = -20;
scene.add(groupCar1);

const wheelB1 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 2),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
)
wheelB1.rotation.x = Math.PI / 2;
wheelB1.position.y = 0.34;
groupCar1.add(wheelB1);

const wheelF1 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 2),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
)
wheelF1.rotation.x = Math.PI / 2;
wheelF1.position.y = 0.34;
wheelF1.position.x = 2;
groupCar1.add(wheelF1);

const main1 = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1.5, 3.5),
  new THREE.MeshStandardMaterial({ color: "yellow" })
);
main1.rotation.y = Math.PI / 2;
main1.position.y = 1
main1.position.x = 1
main1.castShadow = true;
groupCar1.add(main1);

const cabin1 = new THREE.Mesh(
  new THREE.BoxGeometry(1.3, 1, 2),
  new THREE.MeshStandardMaterial({ color: "blue" })
);
cabin1.rotation.y = Math.PI / 2;
cabin1.position.y = 2
cabin1.position.x = 1
groupCar1.add(cabin1);
cabin1.castShadow = true;

const groupCar2 = new THREE.Group();
groupCar2.position.z = 11;
groupCar2.position.x = 20;
scene.add(groupCar2);

const wheelB2 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 2),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
)
wheelB2.rotation.x = Math.PI / 2;
wheelB2.position.y = 0.34;
groupCar2.add(wheelB2);

const wheelF2 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 2),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
)
wheelF2.rotation.x = Math.PI / 2;
wheelF2.position.y = 0.34;
wheelF2.position.x = 2;
groupCar2.add(wheelF2);

const main2 = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1.5, 3.5),
  new THREE.MeshStandardMaterial({ color: "red" })
);
main2.rotation.y = Math.PI / 2;
main2.position.y = 1
main2.position.x = 1
main2.castShadow = true;
groupCar2.add(main2);

const cabin2 = new THREE.Mesh(
  new THREE.BoxGeometry(1.3, 1, 2),
  new THREE.MeshStandardMaterial({ color: "#fff" })
);
cabin2.rotation.y = Math.PI / 2;
cabin2.position.y = 2
cabin2.position.x = 1
groupCar2.add(cabin2);
cabin2.castShadow = true;

groupAll.add(groupCar1);
groupAll.add(groupCar2);

gsap.to(groupCar1.position, { x: 20, duration: 8, repeat: -1 });
gsap.to(groupCar2.position, { x: -20, duration: 8, repeat: -1 });

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

const animate = () => {
  control.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})


gui.add(guiProps, 'moon').onChange(() => {
  // console.log(guiProps.moon);
  moon.visible = guiProps.moon;
  pointLight.visible = guiProps.moon;
  pointLight.castShadow = guiProps.moon;
  directionalLight.visible = !guiProps.moon;
  directionalLight.castShadow = !guiProps.moon;
  wall.castShadow = guiProps.moon;
  roof.castShadow = guiProps.moon;
});

// const rgbeLoader = new RGBELoader();
// rgbeLoader.load(EnvBg1, (envMap) => {
//   envMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = envMap
//   scene.environment = envMap;
// });