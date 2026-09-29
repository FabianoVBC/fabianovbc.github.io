const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x020204, 0.035);

const camera = new THREE.PerspectiveCamera(
    60,
    innerWidth / innerHeight,
    0.1,
    1000
);

camera.position.z = 28;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(
    Math.min(devicePixelRatio, 2)
);

renderer.setSize(
    innerWidth,
    innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

document
    .getElementById("app")
    .appendChild(renderer.domElement);


/* -------------------------
   GALAXY
------------------------- */

const count = 20000;

const positions = new Float32Array(count * 3);
const colours = new Float32Array(count * 3);

const geometry = new THREE.BufferGeometry();

const colourA = new THREE.Color("#7b2cff");
const colourB = new THREE.Color("#00d9ff");
const colourC = new THREE.Color("#ffffff");

for (let i = 0; i < count; i++) {

    const i3 = i * 3;

    const radius = Math.pow(
        Math.random(),
        0.55
    ) * 22;

    const arms = 5;

    const branch =
        (i % arms) / arms *
        Math.PI * 2;

    const spin =
        radius * 0.55;

    const random =
        (Math.random() - .5) *
        (1.8 + radius * .06);

    const angle =
        branch +
        spin +
        random;

    positions[i3] =
        Math.cos(angle) * radius;

    positions[i3 + 1] =
        (Math.random() - .5) *
        (1.3 + radius * .08);

    positions[i3 + 2] =
        Math.sin(angle) * radius;


    /* colour */

    const mix =
        radius / 22;

    let colour;

    if (Math.random() > .94) {
        colour = colourC.clone();
    } else {
        colour =
            colourA.clone()
                .lerp(colourB, mix);
    }

    colours[i3] = colour.r;
    colours[i3 + 1] = colour.g;
    colours[i3 + 2] = colour.b;
}

geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);

geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(
        colours,
        3
    )
);


/* -------------------------
   PARTICLE MATERIAL
------------------------- */

const material =
    new THREE.PointsMaterial({

        size: .055,

        vertexColors: true,

        transparent: true,

        opacity: .9,

        blending:
            THREE.AdditiveBlending,

        depthWrite: false
    });


const galaxy =
    new THREE.Points(
        geometry,
        material
    );

scene.add(galaxy);


/* -------------------------
   CENTRAL CORE
------------------------- */

const coreGeometry =
    new THREE.SphereGeometry(
        1.7,
        32,
        32
    );

const coreMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x9c5cff
    });

const core =
    new THREE.Mesh(
        coreGeometry,
        coreMaterial
    );

scene.add(core);


/* -------------------------
   MOUSE
------------------------- */

const mouse = {
    x: 0,
    y: 0
};

let targetX = 0;
let targetY = 0;

window.addEventListener(
    "pointermove",
    e => {

        targetX =
            (e.clientX /
                innerWidth -
                .5);

        targetY =
            (e.clientY /
                innerHeight -
                .5);

        document.getElementById("x")
            .textContent =
            "X " +
            Math.round(
                targetX * 999
            )
                .toString()
                .padStart(3, "0");

        document.getElementById("y")
            .textContent =
            "Y " +
            Math.round(
                targetY * 999
            )
                .toString()
                .padStart(3, "0");
    }
);


/* -------------------------
   ANIMATION
------------------------- */

const clock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(
        animate
    );

    const time =
        clock.getElapsedTime();


    mouse.x +=
        (targetX - mouse.x) *
        .035;

    mouse.y +=
        (targetY - mouse.y) *
        .035;


    /* Galaxy rotation */

    galaxy.rotation.y =
        time * .035 +
        mouse.x * .3;

    galaxy.rotation.x =
        mouse.y * .12;


    /* Core breathing */

    const pulse =
        1 +
        Math.sin(time * 2) *
        .08;

    core.scale.setScalar(
        pulse
    );


    /* Camera movement */

    camera.position.x +=
        (mouse.x * 3 -
            camera.position.x) *
        .025;

    camera.position.y +=
        (-mouse.y * 2 -
            camera.position.y) *
        .025;

    camera.lookAt(
        0,
        0,
        0
    );


    renderer.render(
        scene,
        camera
    );
}

animate();


/* -------------------------
   RESIZE
------------------------- */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            innerWidth /
            innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            innerWidth,
            innerHeight
        );
    }
);