/* eslint indent: "off" */
/* eslint-disable space-before-function-paren */
import * as THREE from 'three'
// import { FisicaBuilding } from '../Shared-js/addons/_cannon-es.js'
import { Mesh, geo, mat } from '../Shared-js/threejs/Mesh.js'
import * as CANNON from 'cannon-es'
import { create, config, extra } from '../Shared-js/threejs/Core/Escena.js'
import { evento } from '../Shared-js/threejs/Core/_Evento.js'
import { LightBuilder } from '../Shared-js/threejs/Luces.js'
import { WorldBuilder } from '../Shared-js/threejs/Core/World.js'

// ----------------------------------------------
//                  CORE
// ----------------------------------------------

// 1. Configuración inicial
const contenedor = create.contenedor()
const scene = create.scene()
const camera = create.camera()
const renderer = create.renderer()

const controls = create.controls(camera, renderer)
const stats = create.stats(contenedor)

config.Controls(controls)

config.Estilos()
config.Renderer(renderer, contenedor)
config.Animation(renderer, animate)

extra.Renderer(renderer, { sombra: true })
extra.Camera(camera, { posicion: [0, 10, 20] })

// window.__renderer = renderer
// window.destroy = destroyEverything

const offResize = evento.Resize(camera, renderer)
const offFullScreen = evento.FullScreen(renderer)
// const offVisibility = evento.Visibility(renderer, animate)  //MEjor uso manual en animate
// const offClean = evento.Clean(renderer, scene)

// ----------------------------------------------
//                  SCENE
// ----------------------------------------------
const World = new WorldBuilder(scene)
const Luces = new LightBuilder(scene)

World.Floor('blue', 20, true)
World.Light(0x404040)

const sol = Luces.Sol()
Luces.shadowDirecional(sol, { quality: 512, helper: true })

// 5. Inicializar física
// const fisica = new FisicaBuilding()

function animate() {
    // if (document.hidden) { return; }
    renderer.render(scene, camera)
    controls.update()
    stats.update()
}


// Ejecutar limpieza al cerrar la pestaña o recargar
function destroyEverything() {
    offResize?.()
    offFullScreen?.()
    cleanAll(scene, renderer, stats, controls, true)
    // window.__renderer = null
    // window.destroy = null
}
window.addEventListener('beforeunload', destroyEverything);

// Solo en Desarrollo / Produccion
if (import.meta.hot) {
    import.meta.hot.accept()
    import.meta.hot.dispose(destroyEverything);
}

