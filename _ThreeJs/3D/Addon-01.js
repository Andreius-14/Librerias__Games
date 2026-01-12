import { Scene } from "three";
import {
  config_Animation,
  config_Estilos,
  config_Renderer,
  createCamara,
  createContenedor,
  createControls,
  createRenderer,
  createScene,
  createStats,
} from "../JS-Shared/threejs/Core/Escena.js";

// Componentes Extra
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";
import { Mesh, mat, geo } from "../JS-Shared/threejs/Mesh.js";

import GUI from "lil-gui";

let container, camera, scene, renderer;
let stats, controls;

function init() {
  //----------------------------------------------------------------//
  //                        CORE
  //----------------------------------------------------------------//

  container = createContenedor("contenedor3D");
  camera = createCamara();
  scene = createScene();
  renderer = createRenderer({ sombra: true });

  // ADDON
  stats = createStats(container);
  controls = createControls(camera, renderer);

  config_Estilos();
  config_Renderer(renderer, container);

  //----------------------------------------------------------------//
  //                        ESCENA
  //----------------------------------------------------------------//
  const World = new WorldBuilder(scene);
  World.Light();
  World.Grid();
  World.Axis();
  World.Floor();
  // World.Background();
  //let luz1 = Luces.Direccional("red", 1, [4, 5, 0], [4, 0, 0], true);
  //let luz2 = Luces.Direccional("blue", 1, [-4, 5, 0], [-4, 0, 0], true);

  const Luces = new LightBuilder(scene);
  Luces.Sol();
  Luces.Linterna({
    position: [4, 5, 0],
    objetivo: [4, 0, 0],
    color: "red",
    intensity: 10,
    ayuda: true,
  });
  Luces.Linterna({
    position: [-4, 5, 0],
    objetivo: [-4, 0, 0],
    color: "blue",
    intensity: 10,
    ayuda: true,
  });
  Luces.Linterna({
    position: [-4, 5, -5],
    objetivo: [-4, 0, -5],
    color: "yellow",
    intensity: 1,
    ayuda: true,
  });

  const cubo = Mesh.create(scene, {
    material: mat.Sombra(),
  });
  const gui = new GUI();
  gui.add(cubo.position, "x", -5, 5).name("Mover X");
  gui.addColor(cubo.material, "color").name("Color del Cubo");

  //// Creamos un objeto de parámetros
  //const parametros = {
  //  posicionX: cubo.position.x,
  //  color: cubo.material.color,
  //};
  //
  //// Ahora agregas los controles
  //gui.add(parametros, "posicionX", -5, 5).onChange((valor) => {
  //  cubo.position.x = valor;
  //});
  //
  //gui.addColor(parametros, "color").onChange((valor) => {
  //  cubo.material.color.set(valor);
  //});
}

function animate() {
  stats.update();
  controls.update();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
animate();
