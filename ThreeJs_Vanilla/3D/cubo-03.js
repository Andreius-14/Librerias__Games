import * as THREE from "three";
import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";

import { Mesh, geo, mat } from "../JS-Shared/threejs/Mesh.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";
import { colorCss } from "../JS-Shared/Shared-Const.js";
import GUI from "lil-gui";

// import { worldColor } from "../JS-Shared/Shared-Const.js";

let container, camera, scene, renderer, stats, controls;

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
extra.Renderer(renderer, { sombra: true });

// EVENTOS
evento.Resize(camera, renderer);
evento.FullScreen(renderer);

function init() {
  //----------------------------------------------------------------//
  //                        ESCENA 3D
  //----------------------------------------------------------------//

  const World = new WorldBuilder(scene);
  const Luces = new LightBuilder(scene);

  World.Background();
  World.Grid();
  World.Axis();
  World.Floor(colorCss.dark_gray, 100, true);
  World.Niebla();
  World.Light();

  Luces.Direccional({ posicion: [0, 2, 0], ayuda: true, intensity: 1 });
  Luces.Spot({
    color: "blue",
    position: [5, 5, 0],
    objetivo: [5, 0, 0],
    ayuda: true,
    intensity: 200,
    shadow: true,
  });
  Luces.Linterna({
    color: "green",
    position: [-5, 6, 0],
    objetivo: [-5, 0, 0],
    ayuda: true,
    intensity: 200,
    shadow: true,
  });

  //----------------------------------------------------------------//
  //                        ELEMENTOS
  //----------------------------------------------------------------//

  //🌱 INSERTAR
  Mesh.create(scene, { material: mat.Sombra() });
  Mesh.create(scene, {
    geo: geo.Cubo(),
    material: mat.Sombra(),
    posicion: [5, 2],
    color: "blue",
    shadow: true,
  });

  const g = Mesh.create(scene, {
    geo: geo.Cubo(),
    material: mat.Sombra(),
    posicion: [-5, 2],
    color: "yellow",
    shadow: true,
  });

  const gui = new GUI();
  gui.add(g.position, "x", -5, 5).name("Mover X");
  gui.addColor(g.material, "color").name("Color del Cubo");
}

// 💀 Funciones Especiales

function animate() {
  stats.update();
  controls.update();

  renderer.render(scene, camera);
}
init();
