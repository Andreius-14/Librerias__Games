import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

import { create, config } from "./JS-Shared/threejs/Core/Escena.js";
import { WorldBuilder } from "./JS-Shared/threejs/Core/World.js";
import { evento } from "./JS-Shared/threejs/Core/Evento.js";

//----------------------------------------------------------------//
//                        VARIABLES GLOBALES
//----------------------------------------------------------------//
const objects = []; // Array para almacenar objetos con los que se puede colisionar

let raycaster; // Raycaster para detectar colisiones

// control de movimiento
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

// cálculo de física
const velocity = new THREE.Vector3(); // Velocidad actual del jugador
const direction = new THREE.Vector3(); // Dirección del movimiento
// const vertex = new THREE.Vector3(); // Variable temporal para manipular vértices
// const color = new THREE.Color(); // Variable temporal para manipular colores

let controls;

//----------------------------------------------------------------//
//                        CONFIGURACIÓN INICIAL
//----------------------------------------------------------------//
// Creación de cámara, escena y renderer usando funciones del módulo Escena.js
const camera = create.camera({ pov: 75, near: 1, far: 1000 });
const scene = create.scene();
const renderer = create.renderer();
const stats = create.stats(document.body);

const clock = new THREE.Clock();
let dt = 0;
// Configuración inicial
config.Estilos(); // Aplica estilos CSS necesarios
config.Renderer(renderer, document.body); // Configura el renderer en el documento
config.Animation(renderer, animate); // Inicia el bucle de animación

// Posición inicial de la cámara
camera.position.y = 10;

// Configura el evento de redimensionado de la ventana
evento.Resize(camera, renderer);

// Elementos del DOM para la interfaz
const blocker = document.getElementById("blocker"); // Elemento que bloquea la interacción
const instructions = document.getElementById("instructions"); // Instrucciones para el usuario

//----------------------------------------------------------------//
//                          CONSTRUCCIÓN DEL MUNDO
//----------------------------------------------------------------//
const World = new WorldBuilder(scene);
World.SkyPiso([0.5, 1, 0.75]); // Configura el cielo y el piso
World.Fog(0, 750, 0xffffff); // Opcional: configura niebla
World.Bg(0xffffff); // Opcional: configura color de fondo
World.Axis();

//----------------------------------------------------------------//
//                          INICIALIZACIÓN
//----------------------------------------------------------------//
init();

function init() {
  //----------------------------------------------------------------//
  //                          CONTROLES - PRIMERA PERSONA
  //----------------------------------------------------------------//
  controls = new PointerLockControls(camera, document.body);

  instructions.addEventListener("click", function () {
    // Activa el evento LOCK
    controls.lock();
  });

  // Evento cuando se activa el pointer lock
  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  // ===> Evento cuando se desactiva el pointer lock  <===
  controls.addEventListener("unlock", function () {
    // cuando:
    // El usuario presiona ESC
    // Cambia a otra pestaña/aplicación
    // El navegador pierde el focus

    // Ocurre algún error en el pointer lock

    blocker.style.display = "block";
    instructions.style.display = "";
  });

  // Añade el objeto de controles a la escena
  scene.add(controls.object);

  //----------------------------------------------------------------//
  //                          CONTROLES DE TECLADO
  //----------------------------------------------------------------//
  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW": // Tecla W o flecha arriba - mover adelante
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA": // Tecla A o flecha izquierda - mover izquierda
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS": // Tecla S o flecha abajo - mover atrás
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD": // Tecla D o flecha derecha - mover derecha
        moveRight = true;
        break;

      case "Space": // Barra espaciadora - saltar
        if (canJump === true) velocity.y += 350; // Aplica fuerza de salto
        canJump = false; // Evita saltos múltiples
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  // Asigna los event listeners para teclado
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  //----------------------------------------------------------------//
  //                          CONFIGURACIÓN DE COLISIONES
  //----------------------------------------------------------------//
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(), // Origen del rayo (se actualizará cada frame)
    new THREE.Vector3(0, -1, 0), // Dirección del rayo (hacia abajo)
    0, // Distancia mínima
    10, // Distancia máxima
  );

  //----------------------------------------------------------------//
  //                          CREACIÓN DEL PISO
  //----------------------------------------------------------------//

  World.Floor(undefined, 2000);
  let position;

  //----------------------------------------------------------------//
  //                          CREACIÓN DE OBJETOS (CAJAS)
  //----------------------------------------------------------------//
  // 1. Crear geometría de caja
  const boxG = new THREE.BoxGeometry(20, 20, 20);
  position = boxG.attributes.position; // Declaramos position aquí

  const boxM = new THREE.MeshBasicMaterial({
    color: 0x000000,
  });

  // 3. Crear y posicionar 500 cajas
  for (let i = 0; i < 500; i++) {
    const box = new THREE.Mesh(boxG, boxM);

    // Mismo sistema de posicionamiento en cuadrícula que antes
    box.position.x = (Math.floor(Math.random() * 20) - 10) * 20;
    box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
    box.position.z = (Math.floor(Math.random() * 20) - 10) * 20;

    scene.add(box);
    objects.push(box); // Añadir a objetos colisionables
  }
}
//----------------------------------------------------------------//
//                          BUCLE DE ANIMACIÓN
//----------------------------------------------------------------//
function animate() {
  // DELTA TIME
  // ==> Permite usa Calculo por Segundo
  // ==> Sin el las Fisicas se darias por Frame
  dt = clock.getDelta();

  // Física y Movimiento
  // ==> Cuendo el FP este Activado
  if (controls.isLocked === true) {
    // COLISION
    raycaster.ray.origin.copy(controls.object.position);
    raycaster.ray.origin.y -= 10;
    const onObject = raycaster.intersectObjects(objects, false).length > 0;

    //-------------------
    //  Plano Cartesiano
    //-------------------

    // ==> y (Arriba Abajo)
    // ==> x (Derecha e Izquierda)
    // ==> z (Atraz Adelante)

    // Fisica - FRICCION
    // ==> Sin el codigo no hay freno igual a Patinar
    velocity.x -= velocity.x * 10.0 * dt;
    velocity.z -= velocity.z * 10.0 * dt;

    // Fisica - Gravedad
    velocity.y -= 9.8 * 100.0 * dt;

    // Fisica - Direccion del Movimiento
    direction.z = Number(moveForward) - Number(moveBackward); // Ej: 1 (adelante) o -1 (atrás)
    direction.x = Number(moveRight) - Number(moveLeft); // Ej: 1 (derecha) o -1 (izquierda)
    direction.normalize(); // Asegura que el movimiento diagonal no sea más rápido

    // Fisica - Tecla Presionada
    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * dt;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * dt;

    // Fisica - Salto
    if (onObject) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    // APLICAR MOVIMIENTO CALCULADO
    controls.moveRight(-velocity.x * dt);
    controls.moveForward(-velocity.z * dt);
    controls.object.position.y += velocity.y * dt;

    // LIMITE INFERIOR
    // ==> Maximo que puede Llegar hacia abajo
    if (controls.object.position.y < 10) {
      controls.object.position.y = 10;
      velocity.y = 0;
      canJump = true;
    }
  }

  renderer.render(scene, camera);
  stats.update();
}
