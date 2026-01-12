import * as THREE from "three";
import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";

import { Mesh, geo, mat } from "../JS-Shared/threejs/Mesh.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";

import { Texturas } from "../JS-Shared/threejs/Texturas.js";

let container, camera, scene, renderer, stats, controls;

let mesh;
let prueba;
let rutaPared = "../assets/lado.gif";
//----------------------------------------------------------------//
//                        CORE
//----------------------------------------------------------------//

//CORE
container = create.contenedor();
camera = create.camera();
scene = create.scene();
renderer = create.renderer();
stats = create.stats(container);
controls = create.controls(camera, renderer);

// CONFIG
config.Estilos();
config.Controls(controls);
config.Renderer(renderer, container);
config.Animation(renderer, animate);

extra.Controls(controls, { min: 5, max: 55 });
extra.Renderer(renderer);

// EVENTOS
evento.Resize(camera, renderer);
evento.FullScreen(renderer);

// Funciones
function init() {
  //----------------------------------------------------------------//
  //                        ESCENA 3D
  //----------------------------------------------------------------//

  const World = new WorldBuilder(scene);
  const Luces = new LightBuilder(scene);

  World.Grid();
  World.Axis();
  World.Bg();
  World.Fog();
  // World.Light();
  World.Floor("white");

  Luces.Sol({ ayuda: true });

  prueba = Mesh.create(scene, {
    geo: geo.Cubo(),
    posicion: [2, 2, 0],
    material: mat.Color(),
  });
  mesh = Mesh.create(scene, {
    geo: geo.Cubo(),
    material: mat.Color(),
  });

  Texturas.base(prueba, rutaPared);
  Texturas.base(mesh, rutaPared);
}

function animate() {
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;

  stats.update();
  controls.update();
  // INSERCION
  renderer.render(scene, camera);
}

init();

// 🌱 La funcion animate es Especial - Se ejecuta de Manera Continua FPS
