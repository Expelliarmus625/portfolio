import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger'

let scene, camera, renderer, controls, pointLight, fillLight, earth, cage, cage2;
let scrollPercent = 0
const animationScripts = []

function init() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  //Create Camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / (window.innerHeight), 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  })

  //Create Renderer
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(20);

  renderer.render(scene, camera);

  //Add Point Light
  pointLight = new THREE.PointLight(0xffffff)
  pointLight.position.set(20, 20, 20)
  scene.add(pointLight)

  fillLight = new THREE.AmbientLight(0xffffff)
  fillLight.position.set(-20, -20, 20)
  scene.add(fillLight)
  
  
  //Helpers
  const lightHelper = new THREE.PointLightHelper(pointLight)
  //scene.add(lightHelper)
  
  const gridHelper = new THREE.GridHelper(200, 50)
  //scene.add(gridHelper)
  
  controls = new OrbitControls(camera, renderer.domElement);
  
}
function createIcosahedron(x, y, z){
  //Add Icosahedron Object
  const geometry = new THREE.IcosahedronGeometry(10, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true});
  let torus = new THREE.Mesh(geometry, material);
  torus.position.set(x, y, z)
  return torus
  // scene.add(torus)
}
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star)
}
function createEarth(x, y, z){
  //Earth
  const earthTexture = new THREE.TextureLoader().load('assets/2k_earth_daymap.jpg');
  // const earthNormal = new THREE.TextureLoader().load('assets/2k_earth_clouds.jpg');
  earth = new THREE.Mesh(
    new THREE.SphereGeometry(7, 400, 400),
    new THREE.MeshStandardMaterial({
      map: earthTexture
    })
    )
    earth.position.set(x, y, z)
    
    scene.add(earth)
}  
function animate() {
    requestAnimationFrame(animate);
    cage.rotation.x += 0.001;
    cage.rotation.y += 0.001;
    cage.rotation.z += 0.001;
    cage2.rotation.x += 0.005;
    cage2.rotation.y += 0.002;
    cage2.rotation.z += 0.001;



    //playScrollAnimations()
    // torus2.rotation.x -= 0.001;
    // torus2.rotation.y -= 0.001;
    // torus2.rotation.z += 0.001;
  
    //earth.rotation.y -= 0.005;
  
    //controls.update();
    controls.enableDamping = true;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 0.
    renderer.render(scene, camera);
}
function moveCamera() {
  scrollPercent = (
    (document.documentElement.scrollTop || document.body.scrollTop) / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight)
  )*100;
  console.log(scrollPercent)
}
function lerp(x, y, a){
  return (1-a)*x + a*y
}

function scalePercent(start, end){
  return (scrollPercent - start)/(end-start)
}

function playScrollAnimations(){
  animationScripts.forEach((a) => {
    if(scrollPercent >= a.start && scrollPercent < a.end){
      a.func()
    }
  })
}


//Move camera with cursor movement
let oldx = 0;
let oldy = 0;
function onMouseMove(ev){
  let changex = ev.x - oldx
  let changey = ev.y - oldy
  camera.position.x += changex/500
  camera.position.y -= changey/100

  oldx = ev.x
  oldy = ev.y

  console.log(changex, changey)
}


//OLD ANIMATION CODE
animationScripts.push({
  start: 0,
  end: 101,
  func: () => {
    //camera.lookAt(cage.position)
    //camera.position.set(0,0,30)
    //camera.position.x = lerp(0, 30, scalePercent(0, 101));
    //camera.position.y = lerp(0, 30, scalePercent(0, 101));
    gsap.to(camera,{
      y: scrollPercent
    })
  }
})

// animationScripts.push({
//   start: 50,
//   end: 101,
//   func: () => {
//     camera.lookAt(cage.position)

//     camera.position.x = 2*scrollPercent;
//     camera.position.y = scrollPercent;
//   }
// })


init()
cage = createIcosahedron(10, 30, 0)
scene.add(cage)
cage2 = createIcosahedron(10, 0, 0)
scene.add(cage2)
let stars = Array(200).fill().forEach(addStar)
console.log(stars)
//createEarth(EARTHPOSX, EARTHPOSY, EARTHPOSZ)
document.body.onscroll = moveCamera


//GSAP
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.defaults({
  // scrub:3,
  ease: 'none'
})

const sections = document.querySelectorAll('.sections')
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".left",
    start: "top 80%",
    scrub: 3
  }
})

timeline.to(camera.position, {
  x: 40, 
  y: 30,
  z: 0,
  duration: 3,
  ease: 'expo'
  }
)
.to(camera.rotation, {
  y: Math.PI/3,
  duration: 3,
  ease: 'expo',
}, "<")


const timeline2 = gsap.timeline({
  scrollTrigger:{
    trigger: ".light",
    start: "top 80%",
    scrub: 3
  }
}).to(camera.rotation,{
  x: Math.PI/3, 
  duration: 3,
  ease: 'expo'
})

















animate()
//document.body.onmousemove = onMouseMove



//recalculate the camera aspect and renderer size when window is resized
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


