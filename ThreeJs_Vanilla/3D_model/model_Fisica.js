import * as THREE from "three";

import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";
import { Model } from "../JS-Shared/threejs/Model.js";
import { Anime } from "../JS-Shared/threejs/animate.js";

//----------------------------------------------------------------//
//                        VARIABLES
//----------------------------------------------------------------//
let container, scene, renderer, camera;
let controls, stats;

let mixer, clock, loader;

let all, model;
let ruta = "../assets/RobotExpressive/RobotExpressive.glb";
let animacion, group;

let action = {
  Base: null,
  Current: null,
  Previous: null,
  // let actionBase, activeAction, previousAction;
};
let jumpAction, walkingAction, idleAction;
let pressedKeys = {};
async function init() {
  //----------------------------------------------------------------//
  //                          CORE
  //----------------------------------------------------------------//
  {
    container = create.contenedor("contenedor");
    scene = create.scene();
    renderer = create.renderer();
    camera = create.camera();
    controls = create.controls(camera, renderer);
    stats = create.stats(container);

    // CONFIG
    config.Estilos();
    config.Renderer(renderer, container);
    config.Animation(renderer, animate);
    config.Controls(controls);

    // EXTRA
    extra.Controls(controls, { max: 50 });

    // EVENTO
    evento.Resize(camera, renderer);
    evento.FullScreen(renderer);
  }
  //----------------------------------------------------------------//
  //                          SCENA
  //----------------------------------------------------------------//
  {
    // 🌱 GEOMETRIA NUEVA -- Load
    let World = new WorldBuilder(scene, "black");
    let Luces = new LightBuilder(scene);

    World.Bg();
    World.Grid();
    World.Axis();
    World.SkyPiso();
    World.Floor();
  }
  //----------------------------------------------------------------//
  //                    CONTROLES DE TECLADO
  //----------------------------------------------------------------//
  {
    const onKeyDown = function (event) {
      pressedKeys[event.code] = true;
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          fadeToAction(walkingAction);
          break;

        case "KeyC":
          fadeToAction(group.Punch);
          break;
        case "ArrowLeft":
        case "KeyA":
          break;

        case "ArrowDown":
        case "KeyS":
          break;

        case "ArrowRight":
        case "KeyD":
          break;

        case "Space": // Barra espaciadora - saltar
          fadeToAction(jumpAction);
          break;
      }
    };

    const onKeyUp = function (event) {
      delete pressedKeys[event.code];
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          // fadeToAction(idleAction);
          break;

        case "ArrowLeft":
        case "KeyA":
          break;

        case "ArrowDown":
        case "KeyS":
          break;

        case "ArrowRight":
        case "KeyD":
          break;
        case "Space": // Barra espaciadora - saltar
          // fadeToAction(idleAction);

          break;
      }
    };

    // Asigna los event listeners para teclado
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
  }
  //----------------------------------------------------------------//
  //                          MODELO
  //----------------------------------------------------------------//

  clock = Anime.createClock();
  [model, animacion] = await Model.load(scene, ruta, { optimizado: true });
  mixer = Anime.createMixer(model);
  group = Anime.groupAnimation(mixer, animacion);
  console.log(Object.seal(group));

  walkingAction = group.Walking;
  jumpAction = group.Jump;
  idleAction = group.Idle;

  const emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];
  emotes.forEach((key) => {
    if (group[key]) {
      Anime.configAnimations(group[key], Anime.loop.one, true);
    }
  });

  action.Base = idleAction;
  action.Base.play();
}
//
//----------------------------------------------------------------//
//                          LOGICA DE ANIMACION
//----------------------------------------------------------------//

// ==> la funcion original seria grande
// ==> Fragmentar la funcion original
// ==> Funcion, Cambian la animacion a otra animacion

function fadeToAction(newAction, duration = 0.2) {
  if (action.Current === newAction) return;
  action.Previous = action.Current;
  action.Current = newAction;

  if (action.Previous) {
    action.Previous.fadeOut(duration);
  }

  newAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play();

  if (newAction.loop !== THREE.LoopRepeat) {
    mixer.addEventListener("finished", restoreToBase);
  }
}

function restoreToBase() {
  mixer.removeEventListener("finished", restoreToBase);
  fadeToAction(action.Base);
}
//----------------------------------------------------------------//
//                          LOOP
//----------------------------------------------------------------//

function animate() {
  if (mixer) {
    const dt = clock.getDelta();
    mixer.update(dt);
  }
  // INSERCION
  renderer.render(scene, camera);
  controls.update();
  stats.update();
}

init();

// {
// loader.load(ruta, (gltf) => {
//   all = gltf;
//   model = gltf.scene;
//   animacion = gltf.animations;
//
//   scene.add(modelo);
// });
// }
