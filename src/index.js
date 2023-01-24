import * as THREE from 'three'
import { CubeCamera } from 'three';
import { WEBGL } from './webgl'

if (WEBGL.isWebGLAvailable()) {
  
  // 장면
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x004fff);

  // 카메라
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // 캔버
  const canvas = document.querySelector('#index');

  // 렌더러
  const renderer = new THREE.WebGLRenderer({canvas});
  // renderer.setSize(window.innerWidth, window.innerHeight);

  // document.body.appendChild(renderer.domElement);

  // renderer.render(scene, camera);
  function render(time){
    time *= 0.001; // convert time to seconds

    // cube.rotation.x = time;
    // cube.rotation.y = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
