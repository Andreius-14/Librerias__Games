// Basico
import * as THREE from "three";

// Aumento de Realidad - Cuarto para el Objeto 3D
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";

import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { Model } from "../JS-Shared/threejs/Model.js";
import { Anime } from "../JS-Shared/threejs/animate.js";
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
const World = new WorldBuilder(scene);

World.Bg(0xbfe3dd);
World.Grid();
World.Axis();

//----------------------------------------------------------------//
//                           MODELO
//----------------------------------------------------------------//
const ruta = "../assets/cube_kirby/scene.gltf";
// UNRAR -- OPTIMIZADO
// const dracoLoader = new DRACOLoader();
// const loader = new GLTFLoader();
let loader;
let mixer, clock, pmremGenerator;
let model = null;
let animacion = null;
let group;

async function init() {
  // VARIABLES
  loader = Model.createLoader();
  clock = Anime.createClock();

  //MODELO
  [model, animacion] = await Model.load(scene, ruta, { objLoader: loader });

  model.traverse((child) => {
    if (child.isMesh) {
      child.material.envMapIntensity = 0;
    }
  });

  model.position.set(-0.5, 0.5, 0);
  model.scale.set(0.01, 0.01, 0.01);

  mixer = Anime.createMixer(model);
  group = Anime.groupAnimation(mixer, animacion);

  // mixer.clipAction(animacion[0]).play();
}
// Funcion -- Actualiza por Segundos
function animate() {
  // UPLOAD x SECOND
  if (model) {
    model.rotation.x += 0.01;
    model.rotation.y += 0.01;
  }

  if (mixer) {
    const delta = clock.getDelta();
    mixer.update(delta);
  } // INSERCION
  renderer.render(scene, camera);
  controls.update();
  stats.update();
}
init();
//🌱 Tubimos q desactivar el mixer para que funcione - parece que es la animacion
// Podemos Eliminar el Cuarto de Iluminacion - Opcional
