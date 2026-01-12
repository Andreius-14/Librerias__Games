import * as THREE from "three";
import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";
import { colorCss } from "../JS-Shared/Shared-Const.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";

let renderer, scene, camera, camera2, controls, stats, gui, container;
let cube; // Objeto simple para estudio
let insetWidth, insetHeight;

init();

function init() {
  //----------------------------------------------------------------//
  //                        CORE (sin cambios)
  //----------------------------------------------------------------//
  container = create.contenedor();
  renderer = create.renderer();
  scene = create.scene();
  camera = create.camera({ pov: 40, near: 1, far: 1000 });
  camera2 = create.camera({ pov: 40, aspect: 1, near: 1, far: 1000 });
  stats = create.stats(container);
  controls = create.controls(camera, renderer);

  config.Estilos();
  config.Renderer(renderer, container);
  config.Animation(renderer, animate);
  config.Controls(controls, { stopFloor: false });
  extra.Controls(controls, { min: 10, max: 500 });

  camera.position.set(-50, 0, 50);
  camera2.position.copy(camera.position);

  const World = new WorldBuilder(scene);
  World.Grid(200);
  World.Axis();

  //----------------------------------------------------------------//
  //                        CUBO SIMPLE (reemplazo)
  //----------------------------------------------------------------//
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0x4080ff,
    wireframe: true, // Mantenemos estilo de wireframe para el estudio
  });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  initGui();
  window.addEventListener("resize", onWindowResize);
  onWindowResize();
}

function onWindowResize() {
  const [w, h] = [window.innerWidth, window.innerHeight];
  insetWidth = h / 4;
  insetHeight = h / 4;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  camera2.aspect = insetWidth / insetHeight;
  camera2.updateProjectionMatrix();

  renderer.setSize(w, h);
}

function animate() {
  // Rotación básica para visualización
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render vista principal
  // renderer.setClearColor(colorCss.darkGray);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  // Render vista inset
  // renderer.setClearColor(colorCss.black);
  renderer.clearDepth();

  renderer.setScissorTest(true);
  renderer.setScissor(20, 20, insetWidth, insetHeight);
  renderer.setViewport(20, 20, insetWidth, insetHeight);

  camera2.position.copy(camera.position);
  camera2.quaternion.copy(camera.quaternion);
  renderer.render(scene, camera2);

  renderer.setScissorTest(false);

  // Extra
  stats.update();
  controls.update();
}

function initGui() {
  gui = new GUI();
  const params = {
    Rotación: true,
    Tamaño: 10,
    Color: "#4080ff",
  };

  gui.add(params, "Rotación").onChange((val) => {
    cube.rotation.set(0, 0, 0); // Reset al cambiar
  });

  gui.add(params, "Tamaño", 5, 20).onChange((val) => {
    cube.scale.set(val / 10, val / 10, val / 10);
  });

  gui.addColor(params, "Color").onChange((val) => {
    cube.material.color.set(val);
  });
}
