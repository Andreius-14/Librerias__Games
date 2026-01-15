/* eslint indent: "off" */
/* eslint-disable space-before-function-paren */
import * as THREE from 'three'
import {
    create,
    config,
    extra
} from '../../Shared-js/threejs/Core/Escena.js'
import { WorldBuilder } from '../../Shared-js/threejs/Core/World.js'
const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

let container, controls

let camera, scene, scene2, renderer

let World1, World2, Light
let mouseX = 0
let mouseY = 0

const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

init()

function init() {
    container = create.contenedor()
    camera = create.camera({ pov: 35, near: 1, far: 5000, posicion: [0, 0, 1500] })

    scene = create.scene()
    scene2 = create.scene()



    World1 = new WorldBuilder(scene, 'black')
    World2 = new WorldBuilder(scene2, 'black')

    World1.Fog(1500, 4000)
    World1.Bg()

    World2.Fog(1500, 4000)
    World2.Bg()


    // ╭─────────────────────────────────────────────────────────╮
    // │                     Dibujo Textura                      │
    // ╰─────────────────────────────────────────────────────────╯

    // textura Canvas ->  Inicio

    const imageCanvas = document.createElement('canvas')
    const context = imageCanvas.getContext('2d')

    imageCanvas.width = imageCanvas.height = 128

    context.fillStyle = 'gray'
    context.fillRect(0, 0, 128, 128)

    context.fillStyle = 'blue'
    context.fillRect(0, 0, 64, 64)
    context.fillRect(64, 64, 64, 64)

    //  ╭───────────┬───────────╮
    //  │           │           │
    //  │  ░░░░░░░  │           │
    //  │  ░░░░░░░  │           │
    //  │           │           │
    //  ├───────────┼───────────┤
    //  │           │           │
    //  │           │  ░░░░░░░  │
    //  │           │  ░░░░░░░  │
    //  │           │           │
    //  ╰───────────┴───────────╯


    // textura Canvas ->  FIN

    // Textura -> Personlizada
    const textureCanvas = new THREE.CanvasTexture(imageCanvas)
    textureCanvas.colorSpace = THREE.SRGBColorSpace
    textureCanvas.repeat.set(1000, 1000)
    textureCanvas.wrapS = THREE.RepeatWrapping
    textureCanvas.wrapT = THREE.RepeatWrapping

    const textureCanvas2 = textureCanvas.clone()
    textureCanvas2.magFilter = THREE.NearestFilter
    textureCanvas2.minFilter = THREE.NearestFilter
    textureCanvas2.generateMipmaps = false

    // Textura -> Material
    const materialCanvas = new THREE.MeshBasicMaterial({
        map: textureCanvas
    })
    const materialCanvas2 = new THREE.MeshBasicMaterial({
        color: 0xffccaa,
        map: textureCanvas2
    })

    const geometry = new THREE.PlaneGeometry(100, 100)


    // Creacion de Piso + Textura
    // Mesh == Como le afecta la luz
    const meshCanvas = new THREE.Mesh(geometry, materialCanvas)
    meshCanvas.rotation.x = -Math.PI / 2
    meshCanvas.scale.set(1000, 1000, 1000)

    const meshCanvas2 = new THREE.Mesh(geometry, materialCanvas2)
    meshCanvas2.rotation.x = -Math.PI / 2
    meshCanvas2.scale.set(1000, 1000, 1000)

    // PAINTING

    const callbackPainting = function () {
        // 🖼️ Obtener imagen cargada y clonarla en la textura pixelada
        const image = texturePainting.image
        texturePainting2.image = image
        texturePainting2.needsUpdate = true

        // 🏗️ Añadir los pisos (Canvas) a ambas escenas
        scene.add(meshCanvas)
        scene2.add(meshCanvas2)

        // 📐 Crear geometrías y objetos para el cuadro
        const geometry = new THREE.PlaneGeometry(100, 100)
        const mesh = new THREE.Mesh(geometry, materialPainting)
        const mesh2 = new THREE.Mesh(geometry, materialPainting2)

        // 🎨 Ejecutar montaje de pintura en Escena 1 y Escena 2
        addPainting(scene, mesh)
        addPainting(scene2, mesh2)

        function addPainting(zscene, zmesh) {
            // 📏 Ajustar escala del cuadro según tamaño real de imagen
            zmesh.scale.x = image.width / 100
            zmesh.scale.y = image.height / 100
            zscene.add(zmesh)

            // 🔳 Crear y posicionar el Marco (detrás del cuadro)
            const meshFrame = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({ color: 0x000000 })
            )
            meshFrame.position.z = -10.0
            meshFrame.scale.x = (1.1 * image.width) / 100
            meshFrame.scale.y = (1.1 * image.height) / 100
            zscene.add(meshFrame)

            // 🌑 Crear y rotar la Sombra (en el suelo)
            const meshShadow = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    opacity: 0.75,
                    transparent: true
                })
            )
            meshShadow.position.y = (-1.1 * image.height) / 2
            meshShadow.position.z = (-1.1 * image.height) / 2
            meshShadow.rotation.x = -Math.PI / 2
            meshShadow.scale.x = (1.1 * image.width) / 100
            meshShadow.scale.y = (1.1 * image.height) / 100
            zscene.add(meshShadow)

            // ⚓ Alinear altura de los pisos con la base del cuadro
            const floorHeight = (-1.117 * image.height) / 2
            meshCanvas.position.y = meshCanvas2.position.y = floorHeight
        }
    }

    //  ╭─────────────────────────────────────────────────────────╮
    //  │                   Textura y Material                    │
    //  ╰─────────────────────────────────────────────────────────╯

    // Texturas
    const texturePainting = new THREE.TextureLoader().load(
        '../img/758px-Canestra_di_frutta_(Caravaggio).jpg',
        callbackPainting
    )
    const texturePainting2 = new THREE.Texture()

    // Material
    const materialPainting = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texturePainting
    })
    const materialPainting2 = new THREE.MeshBasicMaterial({
        color: 0xffccaa,
        map: texturePainting2
    })

    // Detallees Texturas
    texturePainting.colorSpace = THREE.SRGBColorSpace
    texturePainting.minFilter = texturePainting.magFilter = THREE.LinearFilter

    texturePainting2.colorSpace = THREE.SRGBColorSpace
    texturePainting2.minFilter = texturePainting2.magFilter = THREE.NearestFilter

    texturePainting.mapping = THREE.UVMapping



    //  ╭─────────────────────────────────────────────────────────╮
    //  │                      Configuracion                      │
    //  ╰─────────────────────────────────────────────────────────╯

    renderer = create.renderer()
    controls = create.controls(camera, renderer)

    config.Controls(controls)
    config.Renderer(renderer, container)
    config.Animation(renderer, animate)

    renderer.autoClear = false
    renderer.domElement.style.position = 'relative'

    document.addEventListener('mousemove', onDocumentMouseMove)
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX
    mouseY = event.clientY - windowHalfY
}

function animate() {

    controls.update()

    camera.position.x += (mouseX - camera.position.x) * 0.05
    camera.position.y += (-(mouseY - 200) - camera.position.y) * 0.05

    camera.lookAt(scene.position)

    renderer.clear()
    renderer.setScissorTest(true)

    renderer.setScissor(0, 0, SCREEN_WIDTH / 2 - 2, SCREEN_HEIGHT)
    renderer.render(scene, camera)

    renderer.setScissor(
        SCREEN_WIDTH / 2,
        0,
        SCREEN_WIDTH / 2 - 2,
        SCREEN_HEIGHT
    )
    renderer.render(scene2, camera)

    renderer.setScissorTest(false)
}
