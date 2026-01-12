import * as THREE from "three";
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
extra.Controls(controls);

// EVENTO
evento.Resize(camera, renderer);
evento.FullScreen(renderer);

//----------------------------------------------------------------//
//                          ELEMENTOS
//----------------------------------------------------------------//

const World = new WorldBuilder(scene);
const Luces = new LightBuilder(scene);

World.Bg();
World.Niebla();
//Help
World.Grid();
World.Axis();
//Light
World.SkyPiso();
// World.Light();

//Element
World.Floor();

Luces.Sol();

//----------------------------------------------------------------//
//                          ESCENA
//----------------------------------------------------------------//

const makeCube = (size, x, y, z) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshNormalMaterial(),
  );
  mesh.position.set(x, y, z);
  return mesh;
};
//-------- ----------
// CREATING A GROUP
//-------- ----------
const group = new THREE.Group();

// changing position and rotation of the group
group.position.x = -2;
group.rotation.y = (Math.PI / 180) * 90;
//-------- ----------
// ADDING MESH OBJECTS TO THE GROUP
//-------- ----------
group.add(makeCube(1.0, 0, 0, 0));
group.add(makeCube(0.5, 0, 2, 0));
group.add(makeCube(0.5, 0, -2, 0));
group.add(makeCube(0.5, 2, 0, 0));
group.add(makeCube(0.5, -2, 0, 0));

scene.add(group);

// 1. Configura geometría y material (una sola instancia)
const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// 2. Crea y posiciona cubos en un círculo
const radius = 4;
const cubes = new THREE.Group();

Array.from({ length: 8 }).forEach((_, i) => {
  const angle = ((Math.PI * 2) / 8) * i;
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  cubes.add(cube);
});

scene.add(cubes);
// 💀 RENDER
function animate() {
  if (group) {
    group.rotation.x += 0.01;
    group.rotation.y += 0.05;
  }

  if (cubes) {
    cubes.rotation.x += 0.05;
    cubes.rotation.y += 0.01;
  }
  renderer.render(scene, camera);

  stats.update();
  controls.update();
}
