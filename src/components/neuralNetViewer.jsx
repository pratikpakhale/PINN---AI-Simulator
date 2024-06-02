import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const NeuralNetworkVisualization = ({ modelTrainingTreeData }) => {
  if (!modelTrainingTreeData) return <></>;

  const { Layers } = modelTrainingTreeData;
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;

    const neuronGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const neuronMaterial = new THREE.MeshBasicMaterial({ color: 0x007bff });

    const layers = [];
    const totalLayers = 2 + parseInt(Layers?.['Hidden Layers']);
    const layerSpacing = 2;
    const neuronSpacing = 1;

    for (let i = 0; i < totalLayers; i++) {
      const layer = new THREE.Group();
      const neuronCount =
        i === 0
          ? parseInt(Layers['Input Neurons'])
          : i === totalLayers - 1
          ? parseInt(Layers['Output Neurons'])
          : parseInt(Layers['Hidden Layer Neurons']);

      for (let j = 0; j < neuronCount; j++) {
        const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial);
        neuron.position.y = (j - (neuronCount - 1) / 2) * neuronSpacing;
        layer.add(neuron);
      }

      layer.position.x = (i - (totalLayers - 1) / 2) * layerSpacing;
      layers.push(layer);
      scene.add(layer);
    }

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    for (let i = 0; i < totalLayers - 1; i++) {
      const startLayer = layers[i];
      const endLayer = layers[i + 1];

      startLayer.children.forEach(startNeuron => {
        endLayer.children.forEach(endNeuron => {
          const lineGeometry = new THREE.BufferGeometry();
          const positions = new Float32Array([
            startNeuron.position.x,
            startNeuron.position.y,
            startNeuron.position.z,
            endNeuron.position.x,
            endNeuron.position.y,
            endNeuron.position.z,
          ]);
          lineGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
          );
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
        });
      });
    }

    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, [Layers]);

  return <div ref={containerRef} className='h-full w-full'></div>;
};

export default NeuralNetworkVisualization;
