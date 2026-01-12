import { create, config, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { evento } from "../JS-Shared/threejs/Core/Evento.js";
//----------------------------------------------------------------//
//                        CORE
//----------------------------------------------------------------//
//CORE
const container = create.contenedor("contenedor");
const scene = create.scene();
const renderer = create.renderer();
const camera = create.camera(35, 0.1, 100);
const controls = create.controls(camera, renderer);
const stats = create.stats(container);
// CONFIG
config.Estilos();
config.Renderer(renderer, container);
config.Animation(renderer, animate);
config.Controls(controls);

// EVENTO
evento.Resize(camera, renderer);
evento.FullScreen(renderer);
//----------------------------------------------------------------//
//                        Animacion
//----------------------------------------------------------------//
function animate() {
  if (mesh) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  }

  // INSERCION
  renderer.render(scene, camera);
  controls.update();
  stats.update();
}
