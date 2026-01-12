import * as THREE from "three";
import { FisicaBuilding } from "../JS-Shared/threejs/Fisica.js";
import { Mesh, geo, mat } from "../JS-Shared/threejs/Mesh.js";
import * as CANNON from "cannon-es";
import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";

//----------------------------------------------
//                  CORE
//----------------------------------------------

// 1. Configuración inicial
const contenedor = create.contenedor();
const scene = create.scene();
const camera = create.camera();
const renderer = create.renderer();

const controls = create.controls(camera, renderer);
const stats = create.stats(contenedor);

config.Controls(controls);

config.Estilos();
config.Renderer(renderer, contenedor);
config.Animation(renderer, animate);

extra.Renderer(renderer, { sombra: true });
extra.Camera(camera, { posicion: [0, 10, 20] });

evento.Resize(camera, renderer);
evento.FullScreen(renderer);
//----------------------------------------------
//                  SCENE
//----------------------------------------------
const World = new WorldBuilder(scene);
const Luces = new LightBuilder(scene);

World.Floor("gray", 20, true);
World.Light(0x404040);

const sol = Luces.Sol();
Luces.shadowDirecional(sol, { quality: 512, helper: true });

// 5. Inicializar física
const fisica = new FisicaBuilding();

function animate() {
  renderer.render(scene, camera);
  controls.update();
  stats.update();
}
