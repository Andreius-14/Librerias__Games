import * as THREE from "three";
import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";

import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";
import { colorCss } from "../JS-Shared/Shared-Const.js";

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
extra.Controls(controls);

// EVENTO
evento.Resize(camera, renderer);
evento.FullScreen(renderer);

const group = new THREE.Group(),
  radius = 2,
  count = 8;
let i = 0;

function init() {
  // INSERCION WORLD
  const World = new WorldBuilder(scene);
  const Luces = new LightBuilder(scene);

  World.Bg();
  World.Niebla();
  //Help
  World.Grid();
  World.Axis();
  // Light
  World.SkyPiso();
  // World.Light();
  //Element
  World.Floor(colorCss.neutroGrey, 200);

  Luces.Sol(); // [5,5,5]

  while (i < count) {
    // creating a mesh
    const bx = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial(),
      ),
      r = ((Math.PI * 2) / count) * i;
    // set position of mesh
    bx.position.set(Math.cos(r) * radius, 0, Math.sin(r) * radius);
    // add mesh to the group
    group.add(bx);
    i += 1;
  }
  scene.add(group);

  // changing position and rotation of the group
  group.position.set(-4, 0, -4);
  group.rotation.z = (Math.PI / 180) * 90;
  //-------- ----------
  // RENDER
  //-------- ----------
}
function animate() {
  stats.update();
  controls.update();
  renderer.render(scene, camera);
}
init();
animate();
