import * as THREE from "three";
import TWEEN from "three/addons/libs/tween.module.js";

import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";

import { Mesh, geo, mat } from "../JS-Shared/threejs/Mesh.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";

//----------------------------------------------------------------//
//                        CORE
//----------------------------------------------------------------//
//CORE
const container = create.contenedor("contenedor");
const scene = create.scene();
const renderer = create.renderer();
const camera = create.camera(35, 0.1, 100);
const controls = create.controls(camera, renderer);

// CONFIG
config.Estilos();
config.Renderer(renderer, container);
config.Animation(renderer, animate);
config.Controls(controls);

// EXTRA
extra.Controls(controls, { min: 1, max: 10 });
extra.Renderer(renderer, { sombra: true });

// EVENTO
evento.Resize(camera, renderer);
evento.FullScreen(renderer);

//----------------------------------------------------------------//
//                        ESCENA 3D
//----------------------------------------------------------------//
const mshBox = Mesh.create(scene, {
  geo: geo.Cubo(),
  material: mat.Reflectante(),
  color: 0xaaaaaa,
});

const World = new WorldBuilder(scene);
const mshFloor = World.Suelo(0x808080, 100);
// const mshFloor = Mesh.create(scene, {
//   geo: geo.Plano(100, 100),
//   material: mat.Reflectante(),
//   color: 0x808080,
// });
// mshFloor.rotation.x = -Math.PI * 0.5;

const ambient = new THREE.AmbientLight(0x444444);

const spotLight1 = createSpotlight(0xff7f00);
const spotLight2 = createSpotlight(0x00ff7f);
const spotLight3 = createSpotlight(0x7f00ff);

let lightHelper1, lightHelper2, lightHelper3;

function init() {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera.position.set(4.6, 2.2, -2.1);

  spotLight1.position.set(1.5, 4, 4.5);
  spotLight2.position.set(0, 4, 3.5);
  spotLight3.position.set(-1.5, 4, 4.5);

  lightHelper1 = new THREE.SpotLightHelper(spotLight1);
  lightHelper2 = new THREE.SpotLightHelper(spotLight2);
  lightHelper3 = new THREE.SpotLightHelper(spotLight3);

  mshFloor.receiveShadow = true;
  mshFloor.position.set(0, -0.05, 0);

  mshBox.castShadow = true;
  mshBox.receiveShadow = true;
  mshBox.position.set(0, 0.5, 0);

  scene.add(ambient);
  scene.add(spotLight1, spotLight2, spotLight3);
  scene.add(lightHelper1, lightHelper2, lightHelper3);
}

function createSpotlight(color) {
  const newObj = new THREE.SpotLight(color, 10);

  newObj.castShadow = true;
  newObj.angle = 0.3;
  newObj.penumbra = 0.2;
  newObj.decay = 2;
  newObj.distance = 50;

  return newObj;
}

function tween(light) {
  new TWEEN.Tween(light)
    .to(
      {
        angle: Math.random() * 0.7 + 0.1,
        penumbra: Math.random() + 1,
      },
      Math.random() * 3000 + 2000,
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  new TWEEN.Tween(light.position)
    .to(
      {
        x: Math.random() * 3 - 1.5,
        y: Math.random() * 1 + 1.5,
        z: Math.random() * 3 - 1.5,
      },
      Math.random() * 3000 + 2000,
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}

function updateTweens() {
  tween(spotLight1);
  tween(spotLight2);
  tween(spotLight3);

  setTimeout(updateTweens, 5000);
}

function animate() {
  TWEEN.update();

  if (lightHelper1) lightHelper1.update();
  if (lightHelper2) lightHelper2.update();
  if (lightHelper3) lightHelper3.update();

  renderer.render(scene, camera);
  controls.update();
}

init();
updateTweens();
