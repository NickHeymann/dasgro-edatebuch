/**
 * Globe Module
 * 3D interactive globe with Three.js
 */

import logger from './logger.js';
import { DESTINATIONS } from './config.js';
import { setupControls } from './globe-controls.js';

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

let scene = null;
let camera = null;
let renderer = null;
let group = null;
let initialized = false;

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initialize the 3D globe
 */
export function init() {
    if (initialized) return;

    const canvas = document.getElementById('globeCanvas');
    if (!canvas || typeof THREE === 'undefined') {
        logger.warn('Globe', 'Canvas or Three.js not available');
        return;
    }

    const container = canvas.parentElement;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 2.8;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create group for all globe objects
    group = new THREE.Group();
    scene.add(group);

    // Initial rotation (show Europe)
    group.rotation.x = 0.4;
    group.rotation.y = -1.75;

    // Build the scene
    createStars();
    createEarth();
    createAtmosphere();
    createLights();
    addMarkers();

    // Setup controls
    setupControls(canvas, group, camera);

    // Start animation
    animate();
    updateStats();

    initialized = true;
    logger.success('Globe', 'Globe initialized');
}

// ═══════════════════════════════════════════════════════════════════
// SCENE CREATION
// ═══════════════════════════════════════════════════════════════════

function createStars() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1500 * 3);

    for (let i = 0; i < 1500 * 3; i += 3) {
        const radius = 15 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });

    scene.add(new THREE.Points(geometry, material));
}

function createEarth() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
        'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
    );

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 5 });

    group.add(new THREE.Mesh(geometry, material));
}

function createAtmosphere() {
    const geometry = new THREE.SphereGeometry(1.02, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });

    group.add(new THREE.Mesh(geometry, material));
}

function createLights() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(5, 3, 5);
    scene.add(sun);
}

// ═══════════════════════════════════════════════════════════════════
// MARKERS
// ═══════════════════════════════════════════════════════════════════

function latLonToVector3(lat, lon, r) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;

    return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
    );
}

function addMarkers() {
    // Visited countries (green)
    DESTINATIONS.visited.forEach(d => {
        const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x7a9e7a })
        );
        marker.position.copy(latLonToVector3(d.lat, d.lon, 1.02));
        group.add(marker);
    });

    // Wishlist destinations (rose)
    DESTINATIONS.wishlist.forEach(d => {
        const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xc17b7f })
        );
        marker.position.copy(latLonToVector3(d.lat, d.lon, 1.02));
        group.add(marker);
    });
}

// ═══════════════════════════════════════════════════════════════════
// ANIMATION & UI
// ═══════════════════════════════════════════════════════════════════

function animate() {
    requestAnimationFrame(animate);
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function updateStats() {
    const countriesEl = document.getElementById('travelCountries');
    const citiesEl = document.getElementById('travelCities');
    const wishlistEl = document.getElementById('travelWishlist');

    if (countriesEl) countriesEl.textContent = DESTINATIONS.visited.length;
    if (citiesEl) citiesEl.textContent = DESTINATIONS.visitedCities?.length || 0;
    if (wishlistEl) wishlistEl.textContent = DESTINATIONS.wishlist.length;
}

export function zoom(direction) {
    if (!camera) return;
    camera.position.z += direction * 0.3;
    camera.position.z = Math.max(1.5, Math.min(5, camera.position.z));
}

export function handleResize() {
    if (!renderer || !camera) return;

    const container = document.querySelector('.globe-container');
    if (container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL HANDLERS
// ═══════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
    window.globeZoom = zoom;
}
