// Importaciones
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";

import { FisicaBuilding } from "../JS-Shared/threejs/Fisica.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import {
  EventoFullScreen,
  EventoResize,
} from "../JS-Shared/threejs/Core/Evento.js";

//----------------------------------------------
//                  CORE
//----------------------------------------------
const scene = new THREE.Scene();
const container = create.contenedor("Contenedor");
const camera = create.camera({ pov: 75 });
const renderer = create.renderer();

config.Estilos();
config.Animation(renderer, animate);
config.Renderer(renderer, container);

extra.Camera(camera, { posicion: [0, 5, 10], objetivo: [0, 0, 0] });
extra.Renderer(renderer, { sombra: true });

EventoResize(camera, renderer);
EventoFullScreen(renderer);
//----------------------------------------------
//                  SCENE
//----------------------------------------------

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
light.castShadow = true;
scene.add(light);

// Suelo visual
const World = new WorldBuilder(scene);
World.Floor("gray", 20, true);
World.AmbientLight(0x404040);

//----------------------------------------------
//                  FISICA
//----------------------------------------------

const Fisica = new FisicaBuilding();

const groundShape = FisicaBuilding.shape.Plane();
const groundBody = Fisica.crearCuerpo(groundShape);

const cubeShape = FisicaBuilding.shape.Box(1); // 1x1x1 (0.5 es la mitad del tamaño)
const cubeBody = Fisica.crearCuerpo(cubeShape, { peso: 1 }); // masa 1 = objeto dinámico

groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // rotar para que esté horizontal
cubeBody.position.set(0, 5, 0); // Posición inicial arriba

//----------------------------------------------
//                  MESH
//----------------------------------------------

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x00aaff,
  roughness: 0.3,
  metalness: 0.2,
});
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.castShadow = true;
scene.add(cubeMesh);

//----------------------------------------------
//                  ANIMATION
//----------------------------------------------

function animate() {
  // Step the physics world
  Fisica.actualizar();
  Fisica.asignarAFisica(cubeMesh, cubeBody);

  renderer.render(scene, camera);
}
