import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

import { config, create, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";

import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";
import { Model } from "../JS-Shared/threejs/Model.js";
import { Texturas, Space } from "../JS-Shared/threejs/Texturas.js";
import { Anime } from "../JS-Shared/threejs/animate.js";

let World, Light;

let scene, renderer, camera, floor, orbitControls;
let group, followGroup, model, animations, skeleton, mixer, clock;

let actions;

const settings = {
  show_skeleton: false,
  fixe_transition: true,
};

const PI = Math.PI;
const PI90 = Math.PI / 2;

const controls = {
  up: new THREE.Vector3(0, 1, 0),
  ease: new THREE.Vector3(),
  rotate: new THREE.Quaternion(),
  position: new THREE.Vector3(),

  key: [0, 0],
  fadeDuration: 0.5,

  //Animacion
  current: "Idle",

  //Constantes
  runVelocity: 5,
  walkVelocity: 1.8,

  rotateSpeed: 0.05,
  floorDecale: 0,
};

init();

function init() {
  //----------------------------------------------------------------//
  //                            CORE
  //----------------------------------------------------------------//
  const container = document.body;

  scene = create.scene();
  renderer = create.renderer();
  camera = create.camera({ pov: 45, near: 0.1, far: 100 });
  orbitControls = create.controls(camera, renderer);

  config.Estilos();
  config.Renderer(renderer, container);
  config.Animation(renderer, animate);
  config.Controls(orbitControls);

  config.rRenderer(renderer);

  extra.Camera(camera, { posicion: [0, 2, -5] });
  extra.Renderer(renderer, { sombra: true });
  extra.Controls(orbitControls, { objetivo: [0, 1, 0] });

  evento.Resize(camera, renderer);
  evento.FullScreen(renderer);
  evento.Clean(renderer, scene);
  //----------------------------------------------------------------//
  //                            ESCENA
  //----------------------------------------------------------------//
  clock = new THREE.Clock();
  group = new THREE.Group();
  followGroup = new THREE.Group();

  scene.add(group);
  scene.add(followGroup);

  World = new WorldBuilder(scene);
  Light = new LightBuilder(scene);

  World.Bg(0x5e5d5d);
  World.SkyPiso();
  World.Fog(2, 20, 0x5e5d5d);

  const dirLight = Light.Sol({ intensity: 5, position: [-2, 5, -3] });
  Light.shadowD(dirLight, { near: 3, far: 8, radius: 4, helper: false });

  followGroup.add(dirLight);
  followGroup.add(dirLight.target);

  // EVENTS
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  //----------------------------------------------------------------//
  //                            DEMO
  //----------------------------------------------------------------//

  // Modularizado;
  // new RGBELoader()
  //   .setPath("../assets/textures/")
  //   .load("lobe.hdr", function (texture) {
  //     texture.mapping = THREE.EquirectangularReflectionMapping;
  //     scene.environment = texture;
  //     // scene.background = texture;
  //     // scene.environmentIntensity = 1.5;
  //
  //     loadModel();
  //     addFloor();
  //   });

  Texturas.AddHDR(scene, "../assets/textures/lobe.hdr");
  loadModel();
  addFloor();
}

function addFloor() {
  //-------------------------------------//
  //                VAR
  //-------------------------------------//
  const size = 50;
  const repeat = 16;
  const rutaMap = "../assets/textures/floors/FloorsCheckerboard_S_Diffuse.jpg";
  const rutaNMap = "../assets/textures/floors/FloorsCheckerboard_S_Normal.jpg";
  const floorM = Texturas.load(rutaMap);
  const floorNM = Texturas.load(rutaNMap, Space.Linear);

  Texturas.Config.Repeat(renderer, [floorNM, floorM], repeat);
  //-------------------------------------//
  //                FLOOR
  //-------------------------------------//
  floor = World.Floor(0x404040, size, true, { texture: true });

  Texturas.AddMap(floor, floorM);
  Texturas.AddNormalMap(floor, floorNM, [0.5, 0.5]);

  floor.material.depthWrite = false;
  floor.material.roughness = 0.85;

  //-------------------------------------//
  //             BOLA BRILLANTE
  //-------------------------------------//

  controls.floorDecale = (size / repeat) * 4;

  const bulbGeometry = new THREE.SphereGeometry(0.15, 16, 8);
  const bulbLight = new THREE.PointLight(0xffee88, 2, 500, 2);

  const bulbMat = new THREE.MeshStandardMaterial({
    emissive: 0xffffee,
    emissiveIntensity: 1,
    color: 0x000000,
  });

  bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
  bulbLight.position.set(1, 0.1, -3);
  bulbLight.castShadow = true;
  floor.add(bulbLight);
}

async function loadModel() {
  const ruta = "../assets/Soldier/Soldier.glb";

  [model, animations] = await Model.load(scene, ruta, { optimizado: true });

  // model = gltf.scene;
  group.add(model);
  model.rotation.y = PI;
  group.rotation.y = PI;

  // Configura: Material del Modelo
  model.traverse(function (object) {
    if (object.isMesh) {
      if (object.name == "vanguard_Mesh") {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.shadowSide = THREE.DoubleSide;
        //object.material.envMapIntensity = 0.5;
        object.material.metalness = 1.0;
        object.material.roughness = 0.2;
        object.material.color.set(1, 1, 1);
        object.material.metalnessMap = object.material.map;
      } else {
        object.material.metalness = 1;
        object.material.roughness = 0;
        object.material.transparent = true;
        object.material.opacity = 0.8;
        object.material.color.set(1, 1, 1);
      }
    }
  });

  skeleton = Model.skeletonHelper(scene, model);
  mixer = Anime.createMixer(model);
  actions = Anime.groupAnimation(mixer, animations);

  // console.log(Object.keys(actions));

  //Configura: Propiedades de Material
  for (const m in actions) {
    actions[m].enabled = true;
    actions[m].setEffectiveTimeScale(1);
    if (m !== "Idle") actions[m].setEffectiveWeight(0);
  }

  actions.Idle.play();

  createPanel();
  animate();
}

function updateCharacter(delta) {
  const up = controls.up;
  const ease = controls.ease;
  const rotate = controls.rotate;
  const position = controls.position;

  const key = controls.key;
  const fade = controls.fadeDuration;

  const azimuth = orbitControls.getAzimuthalAngle();

  //¿Se esta Presionando?
  const active = key[0] === 0 && key[1] === 0 ? false : true;
  // Selecciona (Name-Action)
  const play = active ? (key[2] ? "Run" : "Walk") : "Idle";

  // Anime.SoftDura(actions, play, controls);
  Anime.SoftChange(actions, play, controls);

  // move object

  if (controls.current !== "Idle") {
    // Aplica Velocidad
    // Selecciona Velocidad A Usar
    const velocity =
      controls.current == "Run" ? controls.runVelocity : controls.walkVelocity;

    // direction with key
    // Desplazamiento [x,y,z]
    ease.set(key[1], 0, key[0]).multiplyScalar(velocity * delta);

    // calculate camera direction
    const angle = unwrapRad(Math.atan2(ease.x, ease.z) + azimuth);
    rotate.setFromAxisAngle(up, angle);

    // apply camera angle on ease
    controls.ease.applyAxisAngle(up, azimuth);

    position.add(ease);
    camera.position.add(ease);

    group.position.copy(position);
    group.quaternion.rotateTowards(rotate, controls.rotateSpeed);

    orbitControls.target.copy(position).add({ x: 0, y: 1, z: 0 });
    followGroup.position.copy(position);

    // Move the floor without any limit
    const dx = position.x - floor.position.x;
    const dz = position.z - floor.position.z;
    if (Math.abs(dx) > controls.floorDecale) floor.position.x += dx;
    if (Math.abs(dz) > controls.floorDecale) floor.position.z += dz;
  }

  if (mixer) mixer.update(delta);

  orbitControls.update();
}

function unwrapRad(r) {
  return Math.atan2(Math.sin(r), Math.cos(r));
}

//
//

function animate() {
  // Render loop

  const delta = clock.getDelta();

  updateCharacter(delta);

  renderer.render(scene, camera);
}

function createPanel() {
  const panel = new GUI({ width: 310 });

  panel.add(settings, "show_skeleton").onChange((b) => {
    skeleton.visible = b;
  });
  panel.add(settings, "fixe_transition");
}

function onKeyDown(event) {
  const key = controls.key;
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
    case "KeyZ":
      key[0] = -1;
      break;
    case "ArrowDown":
    case "KeyS":
      key[0] = 1;
      break;
    case "ArrowLeft":
    case "KeyA":
    case "KeyQ":
      key[1] = -1;
      break;
    case "ArrowRight":
    case "KeyD":
      key[1] = 1;
      break;

    // Activa Aceleracion
    case "ShiftLeft":
    case "ShiftRight":
      key[2] = 1;
      break;
  }
  // console.log(controls.key);
}

function onKeyUp(event) {
  const key = controls.key;
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
    case "KeyZ":
      key[0] = key[0] < 0 ? 0 : key[0];
      break;
    case "ArrowDown":
    case "KeyS":
      key[0] = key[0] > 0 ? 0 : key[0];
      break;
    case "ArrowLeft":
    case "KeyA":
    case "KeyQ":
      key[1] = key[1] < 0 ? 0 : key[1];
      break;
    case "ArrowRight":
    case "KeyD":
      key[1] = key[1] > 0 ? 0 : key[1];
      break;
    case "ShiftLeft":
    case "ShiftRight":
      key[2] = 0;
      break;
  }
}
