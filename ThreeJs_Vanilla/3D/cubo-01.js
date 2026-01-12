import * as THREE from "three";
import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";

import { Mesh, geo, mat } from "../JS-Shared/threejs/Mesh.js";
import { WorldBuilder } from "../JS-Shared/threejs/Core/World.js";
import { LightBuilder } from "../JS-Shared/threejs/Luces.js";
import { color } from "../JS-Shared/Shared.js";

// VARIABLES
let container, camera, scene, renderer, stats, controls;
let grupo, cubo, plano, mesh, torus;

function init() {
  //----------------------------------------------------------------//
  //                        CORE
  //----------------------------------------------------------------//

  //CORE
  container = create.contenedor();
  camera = create.camera();
  scene = create.scene();
  renderer = create.renderer();
  stats = create.stats(container);
  controls = create.controls(camera, renderer);

  // CONFIG
  config.Estilos();
  config.Controls(controls);
  config.Renderer(renderer, container);
  config.Animation(renderer, animate);

  extra.Controls(controls, { min: 5, max: 55 });
  extra.Renderer(renderer);

  // EVENTOS
  evento.Resize(camera, renderer);
  evento.FullScreen(renderer);

  //----------------------------------------------------------------//
  //                        ESCENA 3D
  //----------------------------------------------------------------//

  const World = new WorldBuilder(scene);
  const Luces = new LightBuilder(scene);

  World.Grid();
  World.Axis();
  World.Bg();
  World.Fog();
  // World.Light();
  World.Floor("white");

  Luces.Sol({ ayuda: true });

  //----------------------------------------------------------------//
  //                        ELEMENTOS
  //----------------------------------------------------------------//
  grupo = new THREE.Group();
  // geometria3D();
  mesh = Mesh.simple(geo.Cubo(1), mat.Sombra(), "red");
  cubo = Mesh.create(scene, { geo: geo.Cubo(), posicion: [2, 2, 2] });
  plano = Mesh.create(scene, { geo: geo.Plano(), posicion: [-2, 2, 2] });
  torus = Mesh.create(scene, { geo: geo.Torus(), posicion: [2, 2, -2] });

  grupo.add(torus);
  grupo.add(plano);
  grupo.add(mesh);
  grupo.add(cubo);

  scene.add(grupo);
}

// 🌱 Render [Especial se ejecuta continuamente]
function animate() {
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;

  grupo.children.forEach((objeto, indice) => {
    // Realiza alguna acción en cada objeto
    let i = indice + 1;
    objeto.rotation.x += i * 0.01;
    objeto.rotation.y += i * 0.01;
  });

  stats.update();
  controls.update();
  renderer.render(scene, camera);
}

init();
// 🌱 En cubo-01 la camara se desplaza en PLANO CARTESIOANO
// 🌱 En load-Completo rota sobre el objeto 3d

// 🌱 EL cubo no tiene sombras pero el piso si
