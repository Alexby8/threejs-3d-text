import '../css/style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import gsap from 'gsap'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const parameters = {
    sceneColor: '#060639'
}
const scene = new THREE.Scene()
scene.background = new THREE.Color(parameters.sceneColor)

gui.addColor(parameters, 'sceneColor').onChange(() =>
{
    scene.background = new THREE.Color(parameters.sceneColor)
})

let textObject = null
const objectsGroup = new THREE.Group()
scene.add(objectsGroup)

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();

fontLoader.load(
    'fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new THREE.TextBufferGeometry(
            'Alexey\nBykov',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4 
            }
        );
        textGeometry.computeBoundingBox();
        textGeometry.center()

        const material = new THREE.MeshNormalMaterial();
        const text = new THREE.Mesh(textGeometry, material);
        scene.add(text);
        textObject = text

        // Torus
        const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 20, 45)

        for(let i = 0; i < 400; i++)
        {
            const donut = new THREE.Mesh(donutGeometry, material)

            donut.position.x = (Math.random() - 0.5) * 30
            donut.position.y = (Math.random() - 0.5) * 30
            donut.position.z = (Math.random() - 0.5) * 30

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            let scale = Math.random()
            if(scale < 0.5) scale += 0.3
            donut.scale.set(scale, scale, scale)

            objectsGroup.add(donut)
        }

        // Octahedron
        const octahedronGeometry = new THREE.OctahedronGeometry(0.3)

        for(let i = 0; i < 400; i++)
        {
            const octahedron = new THREE.Mesh(octahedronGeometry, material)

            octahedron.position.x = (Math.random() - 0.5) * 30
            octahedron.position.y = (Math.random() - 0.5) * 30 
            octahedron.position.z = (Math.random() - 0.5) * 30

            octahedron.rotation.x = Math.random() * Math.PI
            octahedron.rotation.y = Math.random() * Math.PI

            let scale = Math.random()
            if(scale < 0.5) scale += 0.3
            octahedron.scale.set(scale, scale, scale)

            objectsGroup.add(octahedron)
        }
        
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
scene.add(camera)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0
 
window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5
    cursor.y = e.clientY / sizes.height - 0.5
})

window.addEventListener('touchmove', (e) => {
    cursor.x = e.changedTouches[0].clientX / sizes.width - 0.5
    cursor.y = e.changedTouches[0].clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    let zAdd = 1.5
    if(sizes.width < 400){
        zAdd = 5
    }else if(sizes.width < 800){
        zAdd = 3
    }

    const newCameraPositionX = cursor.x * 7
    const newCameraPositionY = -cursor.y * 7
    const newCameraPositionZ = Math.pow(cursor.x, 2) * 12 + zAdd

    gsap.to(
        camera.position,
        {
            duration: 1.5,
            x: newCameraPositionX,
            y: newCameraPositionY,
            z: newCameraPositionZ,
        }
    )

    if(textObject){
        camera.lookAt(textObject.position)
    }

    // Animate objects
    objectsGroup.rotation.y += deltaTime * 0.1

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()