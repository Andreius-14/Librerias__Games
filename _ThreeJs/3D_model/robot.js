//----------------------------------------------------------------//
//                        Import
//----------------------------------------------------------------//
import * as THREE from "three";
import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import {
  EventoResize,
  EventoFullScreen,
} from "../JS-Shared/threejs/Core/Evento.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";

import { Model } from "../JS-Shared/threejs/Model.js";
import { Anime } from "../JS-Shared/threejs/animate.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
//----------------------------------------------------------------//
//                        VARIABLES
//----------------------------------------------------------------//
let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
let camera, scene, renderer, model, face, controls;

// Setting para GUI
const api = { state: "Walking" };

init();

async function init() {
  // CORE
  container = create.contenedor("Contenedor");
  camera = create.camera();
  scene = create.scene();
  renderer = create.renderer();
  stats = create.stats(container);
  controls = create.controls(camera, renderer);
  clock = Anime.createClock(); // NUEVO

  // CONFIG
  config.Estilos();
  config.Controls(controls);
  config.Renderer(renderer, container);
  config.Animation(renderer, animate);

  extra.Controls(controls, { min: 5, max: 30, objetivo: [0, 2, 0] });

  // EVENTO
  EventoResize(camera, renderer);
  EventoFullScreen(renderer);

  // ESCENA
  const World = new WorldBuilder(scene);
  const Luces = new LightBuilder(scene);

  World.Background();
  World.Niebla(20, 100);
  World.HemisphereLight();
  World.Floor(0xcbcbcb, 2000);
  World.Grid(200, 40);

  Luces.Sol({ position: [0, 20, 10] });

  // model - NUEVO AQUI - Modularizado Ya
  const rutaModelo = "../assets/RobotExpressive/RobotExpressive.glb";
  const [modelo, animaciones] = await Model.load(scene, rutaModelo);
  createGUI(modelo, animaciones);
}
//----------------------------------------//
//            Function
//----------------------------------------//

function createGUI(model, animations) {
  //----------------------------------------------------------------//
  //                      VARIABLES - GUI
  //----------------------------------------------------------------//

  // GUI - Array
  const states = [
    "Idle",
    "Walking",
    "Running",
    "Dance",
    "Death",
    "Sitting",
    "Standing",
  ];
  // GUI - Array
  const emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];
  actions = {};

  //----------------------------------------------------------------//
  //                        MIXER
  //----------------------------------------------------------------//
  // Instancia
  mixer = Anime.createMixer(model);
  actions = Anime.groupActionsByName(mixer, animations);

  // Config Actions
  for (const key in actions) {
    if (emotes.indexOf(key) >= 0 || states.indexOf(key) >= 4) {
      Anime.configAnimations(actions[key], Anime.loop.one, true);
    }
  }

  activeAction = actions["Walking"];
  activeAction.play();

  //----------------------------------------------------------------//
  //                        GUI - STATES
  //----------------------------------------------------------------//

  // BASICO
  gui = new GUI();
  const statesFolder = gui.addFolder("States");
  const emoteFolder = gui.addFolder("Emotes");
  const expressionFolder = gui.addFolder("Expressions");

  statesFolder.open();
  emoteFolder.open();
  expressionFolder.open();

  // FOLDER 1 -- Toggle
  //[Cambia el api.state]
  const clipCtrl = statesFolder.add(api, "state").options(states);

  clipCtrl.onChange(function () {
    fadeToAction(api.state, 0.5);
  });

  //----------------------------------------------------------------//
  //                        Expressions
  //----------------------------------------------------------------//

  // FOLDER 2 -- Menu Seleccionable
  for (let i = 0; i < emotes.length; i++) {
    createEmoteCallback(emotes[i]);
  }

  // FOLDER 3 -- Sintonizadores
  face = model.getObjectByName("Head_4");
  const expressions = Object.keys(face.morphTargetDictionary);

  for (let i = 0; i < expressions.length; i++) {
    expressionFolder
      .add(face.morphTargetInfluences, i, 0, 1, 0.01)
      .name(expressions[i]);
  }

  //----------------------------------------------------------------//
  //                    funciones Internas
  //----------------------------------------------------------------//

  function createEmoteCallback(name) {
    // Genera {name:Function} en API
    // Genera Function + Evento
    api[name] = function () {
      fadeToAction(name, 0.2);
      mixer.addEventListener("finished", restoreState);
    };

    // Cada Tarjeta - Ejecuta una Funcion
    emoteFolder.add(api, name);
  }

  // Ejecuta la Api.State
  function restoreState() {
    mixer.removeEventListener("finished", restoreState); // Limpia el Evento
    fadeToAction(api.state, 0.2);
  }
}
//----------------------------------------//
//            Function
//----------------------------------------//
function fadeToAction(name, duration) {
  previousAction = activeAction;
  activeAction = actions[name];

  if (previousAction !== activeAction) {
    previousAction.fadeOut(duration);
  }

  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play();
}

//----------------------------------------//
//            Function
//----------------------------------------//
function animate() {
  const dt = clock.getDelta();

  if (mixer) mixer.update(dt);

  renderer.render(scene, camera);

  stats.update();
  controls.update();
}
