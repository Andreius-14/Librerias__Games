import * as THREE from "three";

import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";

import {
  EventoFullScreen,
  EventoResize,
} from "../JS-Shared/threejs/Core/Evento.js";

import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Anime } from "../JS-Shared/threejs/animate.js";
import { Model } from "../JS-Shared/threejs/Model.js";

let container, scene, renderer, camera, stats, controls;
let model, skeleton, mixer, clock, animations;

const crossFadeControls = [];

let idleAction, walkAction, runAction;
let idleWeight, walkWeight, runWeight;
let actions, settings;

let singleStepMode = false;
let sizeOfNextStep = 0;

const objetivo = [0, 1, 0];
const rutaModelo = "../assets/Soldier/Soldier.glb";
let group;

init();

async function init() {
  //----------------------------------------------------------------//
  //                        CORE
  //----------------------------------------------------------------//

  container = create.contenedor("contenedor3D");
  camera = create.camera({ posicion: [1, 2, -3], objetivo: objetivo });
  scene = create.scene();
  renderer = create.renderer();

  stats = create.stats(container);
  controls = create.controls(camera, renderer);

  // CONFIG
  config.Estilos();
  config.Controls(controls);
  config.Renderer(renderer, container);
  // EXTRA
  extra.Controls(controls, { objetivo: objetivo });
  extra.Renderer(renderer, { sombra: true });

  // EVENTO
  EventoResize(camera, renderer);
  EventoFullScreen(renderer);

  //----------------------------------------------------------------//
  //                        ESCENA 3D
  //----------------------------------------------------------------//

  // ESCENA
  const World = new WorldBuilder(scene);
  const Luces = new LightBuilder(scene);

  World.Background();
  World.Niebla(10, 50);
  World.HemisphereLight([0, 20, 0]);
  World.Floor(0xcbcbcb, 100, true);
  World.Grid();

  Luces.Sol({ position: [-3, 5, -10], generaSombra: true });

  // MODELO
  [model, animations] = await Model.load(scene, rutaModelo);
  skeleton = Model.skeletonHelper(scene, model);
  Model.enableShadows(model);

  // ANIMACION
  clock = Anime.Clock();
  mixer = Anime.Mixer(model);
  group = Anime.groupAnimation(mixer, animations); // console.log(Object.keys(group));

  idleAction = group.Idle; // mixer.clipAction(animations[0]);
  runAction = group.Run; //   mixer.clipAction(animations[3]);
  walkAction = group.Walk; // mixer.clipAction(animations[3]);
  actions = [idleAction, walkAction, runAction];

  // RUN
  createPanel();
  activateAllActions();

  config.Animation(renderer, animate);
}

function createPanel() {
  const panel = new GUI({ width: 310 });

  const folder1 = panel.addFolder("Visibility");
  const folder2 = panel.addFolder("Activation/Deactivation");
  const folder3 = panel.addFolder("Pausing/Stepping");
  const folder4 = panel.addFolder("Crossfading");
  const folder5 = panel.addFolder("Blend Weights");
  const folder6 = panel.addFolder("General Speed");

  folder1.open();
  folder2.open();
  folder3.open();
  folder4.open();
  folder5.open();
  folder6.open();

  settings = {
    //Folder1
    "show model": true,
    "show skeleton": false,
    //Folder2
    "deactivate all": deactivateAllActions,
    "activate all": activateAllActions,
    //Folder3
    "pause/continue": pauseContinue,
    "make single step": toSingleStepMode,
    "modify step size": 0.05,
    //Cross
    "from walk to idle": () => {
      prepareCrossFade(walkAction, idleAction, 1.0);
    },
    "from idle to walk": () => {
      prepareCrossFade(idleAction, walkAction, 0.5);
    },
    "from walk to run": () => {
      prepareCrossFade(walkAction, runAction, 2.5);
    },
    "from run to walk": () => {
      prepareCrossFade(runAction, walkAction, 5.0);
    },
    //Cross Folder4
    "use default duration": true,
    "set custom duration": 3.5,
    //Folder5
    "modify idle weight": 0.0,
    "modify walk weight": 1.0,
    "modify run weight": 0.0,
    //Folder6
    "modify time scale": 1.0,
  };
  //-------------------------------------------------------------
  // ↓↓↓↓↓↓↓↓↓ De Aqui para Abajo CHECK ↓↓↓↓↓↓↓↓↓↓↓↓
  //-------------------------------------------------------------
  //Folder1
  folder1.add(settings, "show model").onChange(showModel); // CHECK - Booleano
  folder1.add(settings, "show skeleton").onChange(showSkeleton); // CHECK - Booleano
  //-------------------------------------------------------------
  // ↓↓↓↓↓↓↓↓↓ De Aqui para Abajo son Menu Seleccionable ↓↓↓↓↓↓↓↓↓↓↓↓
  //-------------------------------------------------------------
  //Folder2
  folder2.add(settings, "deactivate all");
  folder2.add(settings, "activate all");
  //Folder3
  folder3.add(settings, "pause/continue");
  folder3.add(settings, "make single step");
  //-------------------------------------------------------------
  // ↓↓↓↓↓↓↓↓↓ De Aqui para Abajo son Sintonizadores ↓↓↓↓↓↓↓↓↓↓↓↓
  //-------------------------------------------------------------
  folder3.add(settings, "modify step size", 0.01, 0.1, 0.001); //Sintonizadores
  //-------------------------------------------------------------
  // ↓↓↓↓↓↓↓↓↓ De Aqui para Abajo son Menu Seleccionable ↓↓↓↓↓↓↓↓↓↓↓↓
  //-------------------------------------------------------------
  //cross
  crossFadeControls.push(folder4.add(settings, "from walk to idle"));
  crossFadeControls.push(folder4.add(settings, "from idle to walk"));
  crossFadeControls.push(folder4.add(settings, "from walk to run"));
  crossFadeControls.push(folder4.add(settings, "from run to walk"));
  //Cross Folder4
  folder4.add(settings, "use default duration"); // CHECK - Booleano

  //-------------------------------------------------------------
  // ↓↓↓↓↓↓↓↓↓ De Aqui para Abajo son Sintonizadores ↓↓↓↓↓↓↓↓↓↓↓↓
  //-------------------------------------------------------------

  folder4.add(settings, "set custom duration", 0, 10, 0.01);
  //Folder5
  folder5
    .add(settings, "modify idle weight", 0.0, 1.0, 0.01)
    .listen()
    .onChange(function (weight) {
      setWeight(idleAction, weight);
    });
  folder5
    .add(settings, "modify walk weight", 0.0, 1.0, 0.01)
    .listen()
    .onChange(function (weight) {
      setWeight(walkAction, weight);
    });
  folder5
    .add(settings, "modify run weight", 0.0, 1.0, 0.01)
    .listen()
    .onChange(function (weight) {
      setWeight(runAction, weight);
    });
  //Folder6
  folder6
    .add(settings, "modify time scale", 0.0, 1.5, 0.01)
    .onChange(modifyTimeScale);
}

//----------------------------------------------------------------//
//                        FOLDER1
//----------------------------------------------------------------//

function showModel(visibility) {
  model.visible = visibility;
}

function showSkeleton(visibility) {
  skeleton.visible = visibility;
}

//----------------------------------------------------------------//
//                        FOLDER2
//----------------------------------------------------------------//

function deactivateAllActions() {
  actions.forEach(function (action) {
    action.stop();
  });
}

function activateAllActions() {
  setWeight(idleAction, settings["modify idle weight"]);
  setWeight(walkAction, settings["modify walk weight"]);
  setWeight(runAction, settings["modify run weight"]);

  actions.forEach(function (action) {
    action.play();
  });
}

//----------------------------------------------------------------//
//                        FOLDER3
//----------------------------------------------------------------//

//Es un Toggle
function pauseContinue() {
  if (singleStepMode) {
    singleStepMode = false;
    unPauseAllActions();
  } else {
    if (idleAction.paused) {
      unPauseAllActions();
    } else {
      pauseAllActions();
    }
  }
}
function pauseAllActions() {
  actions.forEach(function (action) {
    action.paused = true;
  });
}

function unPauseAllActions() {
  actions.forEach(function (action) {
    action.paused = false;
  });
}
function toSingleStepMode() {
  unPauseAllActions();

  singleStepMode = true;
  sizeOfNextStep = settings["modify step size"];
}
// HASTA AQUI ENTENDIDO
//----------------------------------------------------------------//
//                        CROSS
//----------------------------------------------------------------//
function prepareCrossFade(startAction, endAction, defaultDuration) {
  // Switch default / custom crossfade duration (according to the user's choice)

  const duration = setCrossFadeDuration(defaultDuration);

  // Make sure that we don't go on in singleStepMode, and that all actions are unpaused

  singleStepMode = false;
  unPauseAllActions();

  // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
  // else wait until the current action has finished its current loop

  if (startAction === idleAction) {
    executeCrossFade(startAction, endAction, duration);
  } else {
    synchronizeCrossFade(startAction, endAction, duration);
  }
}

function synchronizeCrossFade(startAction, endAction, duration) {
  mixer.addEventListener("loop", onLoopFinished);

  function onLoopFinished(event) {
    if (event.action === startAction) {
      mixer.removeEventListener("loop", onLoopFinished);

      executeCrossFade(startAction, endAction, duration);
    }
  }
}

function executeCrossFade(startAction, endAction, duration) {
  // Not only the start action, but also the end action must get a weight of 1 before fading
  // (concerning the start action this is already guaranteed in this place)

  setWeight(endAction, 1);
  endAction.time = 0;

  // Crossfade with warping - you can also try without warping by setting the third parameter to false

  startAction.crossFadeTo(endAction, duration, true);
}

//----------------------------------------------------------------//
//                        CROSS FOLDER4
//----------------------------------------------------------------//
function setCrossFadeDuration(defaultDuration) {
  // Switch default crossfade duration <-> custom crossfade duration

  if (settings["use default duration"]) {
    return defaultDuration;
  } else {
    return settings["set custom duration"];
  }
}

//----------------------------------------------------------------//
//                        FOLDER5
//----------------------------------------------------------------//

// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
// the start action's timeScale to ((start animation's duration) / (end animation's duration))

function setWeight(action, weight) {
  action.enabled = true;
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(weight);
}

//----------------------------------------------------------------//
//                        FOLDER6
//----------------------------------------------------------------//

function modifyTimeScale(speed) {
  mixer.timeScale = speed;
}

// Called by the render loop

//----------------------------------------------------------------//
//                        ANIMATE
//----------------------------------------------------------------//
function updateWeightSliders() {
  settings["modify idle weight"] = idleWeight;
  settings["modify walk weight"] = walkWeight;
  settings["modify run weight"] = runWeight;
}

// Called by the render loop

function updateCrossFadeControls() {
  if (idleWeight === 1 && walkWeight === 0 && runWeight === 0) {
    crossFadeControls[0].disable();
    crossFadeControls[1].enable();
    crossFadeControls[2].disable();
    crossFadeControls[3].disable();
  }

  if (idleWeight === 0 && walkWeight === 1 && runWeight === 0) {
    crossFadeControls[0].enable();
    crossFadeControls[1].disable();
    crossFadeControls[2].enable();
    crossFadeControls[3].disable();
  }

  if (idleWeight === 0 && walkWeight === 0 && runWeight === 1) {
    crossFadeControls[0].disable();
    crossFadeControls[1].disable();
    crossFadeControls[2].disable();
    crossFadeControls[3].enable();
  }
}
function animate() {
  // 1. Obtener pesos actualizados de las acciones
  idleWeight = idleAction.getEffectiveWeight();
  walkWeight = walkAction.getEffectiveWeight();
  runWeight = runAction.getEffectiveWeight();
  // 2. Actualizar sliders y controles de crossfade
  updateWeightSliders();
  updateCrossFadeControls();
  // 3. Calcular deltaTime y actualizar el mixer
  let dt = clock.getDelta(); // mixerUpdateDelta
  if (singleStepMode) {
    dt = sizeOfNextStep;
    sizeOfNextStep = 0;
  }
  mixer.update(dt);

  // RENDER
  renderer.render(scene, camera);
  // ADDON
  stats.update();
  controls.update();
}
