// IMPORTS
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; // Control de Camara
import { create, extra } from "../JS-Shared/threejs/Core/Escena.js";
import { colorCss } from "../JS-Shared/Shared-Const.js";
// DOM ELEMENTS
const canvas = document.querySelector("#c");
const view1Elem = document.querySelector("#view1");
const view2Elem = document.querySelector("#view2");
const view3Elem = document.querySelector("#view3");

// RENDERER -- COMPRENDIDO
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas });

// CAMERA SETTINGS -- COMPRENDIDO
const fov = 45;
// const aspect = globalThis.innerWidth / globalThis.innerHeight;
const aspect = 2; // Canvas default
const near = 5;
const far = 100;
const objetivoControls = [0, 5, 0];

// CAMERAS -- COMPRENDIDO

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);
const cameraHelper = new THREE.CameraHelper(camera);

const camera2 = new THREE.PerspectiveCamera(60, 2, 0.1, 500);
camera2.position.set(40, 10, 30);
camera2.lookAt(0, 5, 0);

const camera3 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera3.position.set(10, 10, 20);
const camera3Helper = new THREE.CameraHelper(camera3);

// ORBIT CONTROLS -- COMPRENDIDO
const controls = create.controls(camera, view1Elem);
const controls2 = create.controls(camera2, view2Elem);
const controls3 = create.controls(camera3, view3Elem);

extra.Controls(controls, { objetivo: objetivoControls });
extra.Controls(controls2, { objetivo: objetivoControls });
extra.Controls(controls3, { objetivo: objetivoControls });

// MAIN FUNCTION
function main() {
  // GUI HELPER CLASS
  class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }

    get min() {
      return this.obj[this.minProp];
    }

    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(
        this.obj[this.maxProp],
        v + this.minDif,
      );
    }

    get max() {
      return this.obj[this.maxProp];
    }

    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min; // Calls the min setter
    }
  }

  // GUI SETUP
  const gui = new GUI();

  const f1 = gui.addFolder("Camera 1 Controls");
  f1.add(camera, "fov", 1, 180);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);
  f1.add(minMaxGUIHelper, "min", 0.1, 50, 0.1).name("near");
  f1.add(minMaxGUIHelper, "max", 0.1, 50, 0.1).name("far");
  f1.close();

  const f3 = gui.addFolder("Camera 2 Controls");
  f3.add(camera3, "fov", 1, 180);
  const minMaxGUIHelper3 = new MinMaxGUIHelper(camera3, "near", "far", 0.1);
  f3.add(minMaxGUIHelper3, "min", 0.1, 50, 0.1).name("near");
  f3.add(minMaxGUIHelper3, "max", 0.1, 50, 0.1).name("far");
  f3.close();

  // SCENE SETUP
  scene.background = new THREE.Color("black");
  const axesHelper = new THREE.AxesHelper(40);
  scene.add(axesHelper);
  scene.add(cameraHelper);
  scene.add(camera3Helper);

  // FLOOR -- COMPRENDIDO

  {
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "https://threejsfundamentals.org/threejs/resources/images/checker.png",
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.repeat.set(planeSize / 2, planeSize / 2);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  // CUBE -- COMPRENDIDO

  {
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh);
  }

  // SPHERE -- COMPRENDIDO

  {
    const sphereRadius = 3;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 16);
    const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(mesh);
  }

  // LIGHTING -- COMPRENDIDO

  {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
  }

  // CONFIGURACION

  // UTILITY FUNCTIONS
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) renderer.setSize(width, height, false);
    return needResize;
  }

  function setScissorForElement(elem) {
    const can = canvas.getBoundingClientRect();
    const ele = elem.getBoundingClientRect();

    const right = Math.min(ele.right, can.right) - can.left;
    const left = Math.max(0, ele.left - can.left);
    const bottom = Math.min(ele.bottom, can.bottom) - can.top;
    const top = Math.max(0, ele.top - can.top);

    const width = Math.min(can.width, right - left);
    const height = Math.min(can.height, bottom - top);

    const positiveYUpBottom = can.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    return width / height;
  }

  // RENDER LOOP
  function render() {
    resizeRendererToDisplaySize(renderer);
    renderer.setScissorTest(true);

    // Render view 1
    {
      const aspect = setScissorForElement(view1Elem); //El Div
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      cameraHelper.update();
      cameraHelper.visible = false;
      camera3Helper.visible = false;

      renderer.render(scene, camera);
    }
    // Render view 2
    {
      const aspect = setScissorForElement(view2Elem); // El Div
      camera2.aspect = aspect;
      camera2.updateProjectionMatrix();

      cameraHelper.visible = true;
      camera3Helper.visible = true;

      renderer.render(scene, camera2);
    }
    // Render view 3
    {
      const aspect = setScissorForElement(view3Elem); //Eldiv
      camera3.aspect = aspect;
      camera3.updateProjectionMatrix();

      camera3Helper.update();
      cameraHelper.visible = false;
      camera3Helper.visible = false;

      renderer.render(scene, camera3);
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// EXECUTE
main();

// DEscartado, para analisis, Buscar otros Elementos
