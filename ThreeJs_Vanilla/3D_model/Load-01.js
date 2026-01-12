import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";
//----------------------------------------------------------------//
//                        CORE
//----------------------------------------------------------------//
//CORE
const container = create.contenedor("contenedor");
const scene = create.scene();
const renderer = create.renderer();
const camera = create.camera();
const controls = create.controls(camera, renderer);
const stats = create.stats(container);
// CONFIG
config.Estilos();
config.Renderer(renderer, container);
config.Animation(renderer, animate);
config.Controls(controls);

// EXTRA
extra.Controls(controls, { max: 50 });

// EVENTO
evento.Resize(camera, renderer);
evento.FullScreen(renderer);

//----------------------------------------------------------------//
//                          ELEMENTOS
//----------------------------------------------------------------//
// 🌱 GEOMETRIA NUEVA -- Load
let World = new WorldBuilder(scene);
let Luces = new LightBuilder(scene);
World.Bg();
World.Grid();
World.Axis();
World.SkyPiso();
World.Floor();

Luces.Sol();
//----------------------------------------------------------------//
//                           MODELO
//----------------------------------------------------------------//
let mesh = null;

const loader = new GLTFLoader();
loader.load("../assets/scene.gltf", (gltf) => {
  mesh = gltf.scene;
  scene.add(mesh);
});

// 🌱 Render
function animate() {
  if (mesh) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  }

  // INSERCION
  renderer.render(scene, camera);
  controls.update();
  stats.update();
}
