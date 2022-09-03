import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
// import { OutlineEffect } from './jsm/effects/OutlineEffect.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.IcosahedronBufferGeometry(4,1);
const particleGeo = new THREE.TetrahedronBufferGeometry(0.2,0);
const planetCoreGeo = new THREE.IcosahedronBufferGeometry(3,1);
const planetRingGeo = new THREE.IcosahedronBufferGeometry(4,1);


// Materials

const particleMaterial = new THREE.MeshStandardMaterial({color: '#ffffff', flatShading: true});
const planetCoreMaterial = new THREE.MeshPhongMaterial({color: '#ffffff', flatShading: true});
const planetRingMaterial = new THREE.MeshBasicMaterial({color: '#ffffff', flatShading: true, wireframe: true, wireframeLinewidth: 4});

const planetCore = new THREE.Mesh(planetCoreGeo, planetCoreMaterial);
const planetRing = new THREE.Mesh(planetRingGeo, planetRingMaterial);
scene.add(planetCore);
scene.add(planetRing);

const particles = new THREE.Object3D();

for(let i=0;i<1000;i++){
    const particle= new THREE.Mesh(particleGeo, particleMaterial);
    particle.position.set(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
    particle.position.multiplyScalar(65 + (Math.random() *80));
    particle.rotation.set(Math.random(), Math.random(), Math.random());
    particles.add(particle);
}
scene.add(particles);

// material.color = new THREE.Color(0xffffff)
// material.flatShading=true;
// Mesh
// const sphere = new THREE.Mesh(geometry,material)
// scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.7)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const d1= new THREE.DirectionalLight('#ffffff', 0.2);
d1.position.set(1,0,0);
scene.add(d1);
const directionalLight1 = new THREE.DirectionalLight('#C33764', 1);
directionalLight1.position.set(0.75,1,0.5);
scene.add(directionalLight1);
const directionalLight2 = new THREE.DirectionalLight('#1D2671', 1);
directionalLight2.position.set(-0.75,-1,-0.5);
scene.add(directionalLight2);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 12
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
let effect = new OutlineEffect( renderer );

/**
 * Animate
 */

const clock = new THREE.Clock()

window.addEventListener('mousemove', event=>{
    particles.rotation.z=event.clientX*0.0001+ event.clientY * 0.001;
})


const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime
    planetCore.rotation.x = - elapsedTime * .1
    planetCore.rotation.y = - elapsedTime * .08
    planetRing.rotation.x=elapsedTime *.5;
    planetRing.rotation.y=elapsedTime *.2;
    particles.rotation.x += 0.0000;
    particles.rotation.y -= 0.0040;

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()