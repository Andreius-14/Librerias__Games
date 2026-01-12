// Basico
import * as THREE from "three";
// import Stats from "three/addons/libs/stats.module.js";                            // Informacion de Consumo
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";           // Control de Camara - Sensilla
// import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";   // Aumento de Realidad - Cuarto para el Objeto 3D
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";                  // Cargar Archivos
// import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";                // Optimizador de Carga

let camera, scene, renderer;
// let mesh;

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });

  globalThis.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  //ZONA ESPECIAL [Ejecucion COnstante]
  // controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}
