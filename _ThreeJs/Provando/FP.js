/* eslint indent: "off" */
/* eslint-disable space-before-function-paren */
import * as THREE from 'three'
import { create, config, extra } from '../Shared-js/threejs/Core/Escena.js'
import { evento } from '../Shared-js/threejs/Core/_Evento.js'

import { WorldBuilder } from '../Shared-js/threejs/Core/World.js'
import { LightBuilder } from '../Shared-js/threejs/Luces.js'

let container, camera, scene, renderer, stats, controls, person

container = create.contenedor()
camera = create.camera()
scene = create.scene()
renderer = create.renderer()
stats = create.stats(container)
// controls = create.controls(camera, renderer)

create.controlFP(camera, renderer, { escena: scene })
// mirada.getObject().position.y = 10.6

// CONFIG
config.Estilos()
// config.Controls(controls)
config.Renderer(renderer, container)
config.Animation(renderer, animate)

// extra.Controls(controls, { min: 5, max: 55 })
extra.Renderer(renderer)

// EVENTOS
evento.Resize(camera, renderer)
evento.FullScreen(renderer)

function init() {
    const World = new WorldBuilder(scene)
    const Luces = new LightBuilder(scene)

    World.Background()
    World.Grid()
    World.Axis()
    // World.Floor(colorCss.dark_gray, 100, true)
    World.Niebla(10, 50, 'red')
    World.Light()
}

function animate() {
    stats.update()
    // controls.update()

    renderer.render(scene, camera)
}
init()
