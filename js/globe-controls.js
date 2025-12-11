/**
 * Globe Controls Module
 * Mouse and touch controls for the 3D globe
 */

/**
 * Setup mouse/touch controls for globe
 * @param {HTMLCanvasElement} canvas
 * @param {THREE.Group} group - Group to rotate
 * @param {THREE.PerspectiveCamera} camera - Camera to zoom
 */
export function setupControls(canvas, group, camera) {
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    // Mouse drag
    canvas.addEventListener('mousedown', e => {
        isDragging = true;
        prevMouse = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);

    canvas.addEventListener('mousemove', e => {
        if (isDragging) {
            group.rotation.y += (e.clientX - prevMouse.x) * 0.005;
            group.rotation.x += (e.clientY - prevMouse.y) * 0.005;
            group.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, group.rotation.x));
        }
        prevMouse = { x: e.clientX, y: e.clientY };
    });

    // Mouse wheel zoom
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        camera.position.z += e.deltaY * 0.005;
        camera.position.z = Math.max(1.5, Math.min(5, camera.position.z));
    }, { passive: false });

    // Touch support
    let touchStartDist = 0;

    canvas.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
            isDragging = true;
            prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
            touchStartDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    });

    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        if (e.touches.length === 1 && isDragging) {
            group.rotation.y += (e.touches[0].clientX - prevMouse.x) * 0.005;
            group.rotation.x += (e.touches[0].clientY - prevMouse.y) * 0.005;
            group.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, group.rotation.x));
            prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            camera.position.z -= (dist - touchStartDist) * 0.01;
            camera.position.z = Math.max(1.5, Math.min(5, camera.position.z));
            touchStartDist = dist;
        }
    }, { passive: false });

    canvas.addEventListener('touchend', () => isDragging = false);
}
