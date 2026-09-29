// Marquee continuous loop clone
const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
    const clone = marqueeContent.innerHTML;
    marqueeContent.innerHTML += clone;
}

// Service items hover effect
const serviceItems = document.querySelectorAll('.service-item');

serviceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        // Remove active class from all
        serviceItems.forEach(i => i.classList.remove('active'));
        // Add to current
        item.classList.add('active');
    });
});

// Smooth reveal animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(section);
});

/* -------------------------
   GALAXY BACKGROUND
------------------------- */
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020204, 0.035);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 28;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const appContainer = document.getElementById("app");
if (appContainer) {
    appContainer.appendChild(renderer.domElement);
}

const count = 2000;
const positions = new Float32Array(count * 3);
const colours = new Float32Array(count * 3);
const geometry = new THREE.BufferGeometry();
const colourA = new THREE.Color("#7b2cff");
const colourB = new THREE.Color("#00d9ff");
const colourC = new THREE.Color("#ffffff");

for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = Math.pow(Math.random(), 0.55) * 22;
    const arms = 5;
    const branch = (i % arms) / arms * Math.PI * 2;
    const spin = radius * 0.55;
    const random = (Math.random() - .5) * (1.8 + radius * .06);
    const angle = branch + spin + random;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = (Math.random() - .5) * (1.3 + radius * .08);
    positions[i3 + 2] = Math.sin(angle) * radius;

    const mix = radius / 22;
    let colour;
    if (Math.random() > .94) colour = colourC.clone();
    else colour = colourA.clone().lerp(colourB, mix);

    colours[i3] = colour.r;
    colours[i3 + 1] = colour.g;
    colours[i3 + 2] = colour.b;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));

const material = new THREE.PointsMaterial({
    size: .055,
    vertexColors: true,
    transparent: true,
    opacity: .9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);

const coreGeometry = new THREE.SphereGeometry(1.7, 32, 32);
const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x9c5cff });
const core = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(core);

const mouse = { x: 0, y: 0 };
let targetX = 0;
let targetY = 0;

window.addEventListener("pointermove", e => {
    targetX = (e.clientX / window.innerWidth - .5);
    targetY = (e.clientY / window.innerHeight - .5);
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    mouse.x += (targetX - mouse.x) * .035;
    mouse.y += (targetY - mouse.y) * .035;
    galaxy.rotation.y = time * .035 + mouse.x * .3;
    galaxy.rotation.x = mouse.y * .12;
    const pulse = 1 + Math.sin(time * 2) * .08;
    core.scale.setScalar(pulse);
    camera.position.x += (mouse.x * 3 - camera.position.x) * .025;
    camera.position.y += (-mouse.y * 2 - camera.position.y) * .025;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

if (appContainer) {
    animate();
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
