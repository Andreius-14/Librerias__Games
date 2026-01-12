import * as THREE from "three";
import { config, create } from "../JS-Shared/threejs/Core/Escena.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";

let camP, camO, controls, scene, renderer, stats, container;

const params = {
  camO: false,
};

const frustumSize = 400;

init();

function init() {
  //----------------------------------------------------------------//
  //                        CORE
  //----------------------------------------------------------------//
  container = document.body;
  scene = create.scene();
  renderer = create.renderer();
  stats = create.stats(container);

  config.Renderer(renderer, document.body);
  config.Animation(renderer, animate);

  //----------------------------------------------------------------//
  //                        CAMERA
  //----------------------------------------------------------------//

  const aspect = window.innerWidth / window.innerHeight;

  camP = create.camera({ pov: 60, near: 1, far: 5000 });

  camO = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    1000,
  );

  camP.position.z = 500;
  camO.position.z = 500;

  // world
  //----------------------------------------------------------------//
  //                        WORLD
  //----------------------------------------------------------------//
  const World = new WorldBuilder(scene);
  const Light = new LightBuilder(scene);

  World.Bg(0xcccccc);
  World.rFog(0xcccccc, 0.002);
  World.Light(0x555555);

  // lights
  Light.createDirectional({ position: [1, 1, 1] });
  Light.createDirectional({ color: 0x002288, position: [-1, -1, -1] });

  //----------------------------------------------------------------//
  //                        ELEMENT
  //----------------------------------------------------------------//

  const geometry = new THREE.ConeGeometry(10, 30, 4, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });

  for (let i = 0; i < 500; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 1000;
    mesh.position.y = (Math.random() - 0.5) * 1000;
    mesh.position.z = (Math.random() - 0.5) * 1000;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add(mesh);
  }

  //----------------------------------------------------------------//
  //                        GUI
  //----------------------------------------------------------------//
  const gui = new GUI();
  gui
    .add(params, "camO")
    .name("use orthographic")
    .onChange(function (value) {
      controls.dispose();

      createControls(value ? camO : camP);
    });

  window.addEventListener("resize", onWindowResize);

  createControls(camP);
}

function createControls(camera) {
  controls = new TrackballControls(camera, renderer.domElement);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.keys = ["KeyA", "KeyS", "KeyD"];
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;

  // Configura Cam1
  camP.aspect = aspect;
  camP.updateProjectionMatrix();

  // Configura Cam2
  camO.left = (-frustumSize * aspect) / 2;
  camO.right = (frustumSize * aspect) / 2;
  camO.top = frustumSize / 2;
  camO.bottom = -frustumSize / 2;
  camO.updateProjectionMatrix();

  //Final
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();
}

function animate() {
  controls.update();
  stats.update();

  //-----------------------------------//
  //       IMPORTANTE DE CAMARA
  //-----------------------------------//
  // Cambio de Camara
  const camElegida = params.camO ? camO : camP;
  renderer.render(scene, camElegida);
}
