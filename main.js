const EARTHPOSX = -10
const EARTHPOSY = 0
const EARTHPOSZ = 15

import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Mesh } from 'three';

const scene = new THREE.Scene()

//Create Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/(window.innerHeight), 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

//Create Renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);


//Add Torus Object
const geometry = new THREE.IcosahedronGeometry(10, 1)
const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
const torus = new THREE.Mesh(geometry, material); 
  torus.position.z = EARTHPOSZ
  torus.position.y = EARTHPOSY
  torus.position.x = EARTHPOSX
  scene.add(torus)
  
//Add Torus Object
const geometry2 = new THREE.IcosahedronGeometry(10, 1)
const material2 = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
const torus2 = new THREE.Mesh(geometry, material); 
  torus2.position.z = 25
  torus2.position.y = -30
  torus2.position.x = -20
  scene.add(torus2)
  

//Add Point Light
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20,20,20)
scene.add(pointLight)

const fillLight = new THREE.AmbientLight(0xffffff)
fillLight.position.set(-20,-20,20)
scene.add(fillLight)


//Helpers
const lightHelper = new THREE.PointLightHelper(pointLight)
//scene.add(lightHelper)

const gridHelper = new THREE.GridHelper(200, 50)
//scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);


function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(200));

  star.position.set(x,y,z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('assets/sky.jpg');
//scene.background = spaceTexture;

function animate(){
  requestAnimationFrame(animate);
  torus.rotation.x += 0.001;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.001;
  torus2.rotation.x -= 0.001;
  torus2.rotation.y -= 0.001;
  torus2.rotation.z += 0.001;

  earth.rotation.y += 0.005;

  controls.update();
  controls.enableDamping = true;
  renderer.render(scene, camera);
}


// //Earth
const earthTexture = new THREE.TextureLoader().load('assets/2k_earth_clouds.jpg');
const earthNormal = new THREE.TextureLoader().load('assets/2k_earth_normal_map.tif');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(7, 100, 100),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthNormal
  })
)

earth.position.z = EARTHPOSZ
earth.position.x = EARTHPOSX
earth.position.y = EARTHPOSY

//scene.add(earth)

animate()


function moveCamera(){

  const t = document.body.getBoundingClientRect().top;
  camera.position.x = t * 0.01;
  camera.position.y = t * 0.01;
  //camera.position.z = t * -0.0002;
}

document.body.onscroll = moveCamera



window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight
})