import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeViewer = ({ selectedFile }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Create custom axes lines
    const axesLines = new THREE.Group();
    const materialX = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const materialY = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const materialZ = new THREE.LineBasicMaterial({ color: 0x0000ff });

    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const loadModel = file => {
      const loader = new STLLoader();

      loader.load(
        URL.createObjectURL(file),
        geometry => {
          const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
          const object = new THREE.Mesh(geometry, material);

          object.scale.set(1, 1, 1);
          scene.add(object);

          const boundingBox = new THREE.Box3().setFromObject(object);
          const center = boundingBox.getCenter(new THREE.Vector3());
          const size = boundingBox.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);

          camera.position.set(center.x, center.y, center.z + maxDim);
          camera.lookAt(center);

          controls.target.copy(center);
          controls.minDistance = maxDim / 10;
          controls.maxDistance = maxDim * 10;
        },
        xhr => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        error => {
          console.error('An error happened', error);
        }
      );
    };

    if (selectedFile) {
      loadModel(selectedFile);
    }
  }, [selectedFile]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
  );
};

export default ThreeViewer;
