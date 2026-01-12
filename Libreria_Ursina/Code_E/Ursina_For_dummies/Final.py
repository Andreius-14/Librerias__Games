""" Final del Post Ursina for Dummies"""

from ursina import *  # this will import everything we need from ursina with just one line.
import random  # Import the random library

random_generator = random.Random()  # Create a random number generator


""" ANIMACION UV"""
texoffset = 0.0  # define a variable that will keep the texture offset
texoffset2 = 0.0  # define a variable that will keep the texture offset

texoffset3 = 0.0
childcube = None
newcube = None

animacion = []
""" FUNCION: Se ejecuta en Cada Frame"""


def update():
    for index, entity in enumerate(cubes):  # Go through the cube list
        entity.rotation_y += (
            time.dt * 25
        )  # Rotate all the cubes every time update is called
        entity.rotation_x += (
            time.dt * 10
        )  # Rotate all the cubes every time update is called
    if held_keys["q"]:  # If q is pressed
        camera.position += (0, time.dt, 0)  # move up vertically
    if held_keys["a"]:  # If a is pressed
        camera.position -= (0, time.dt, 0)  # move down vertically

    # EFECTO ANIMACION UV
    global texoffset  # Inform we are going to use the variable defined outside
    global texoffset2  # Inform we are going to use the variable defined outside
    global texoffset3

    texoffset += time.dt * 0.3  # Add a small number to this variable
    texoffset2 += time.dt * 0.6  # Add a small number to this variable
    texoffset3 += time.dt * 0.6

    setattr(cube, "texture_offset", (0, texoffset))  # Assign as a texture offset
    setattr(cube2, "texture_offset", (0, texoffset2))  # Assign as a texture offset
    # setattr(cube3, "texture_offset", (0, texoffset))  # Assign as a texture offset

    if newcube is not None:
        # setattr(newcube, "texture_offset", (0, texoffset3))
        for entity in animacion:
            setattr(entity, "texture_offset", (0, texoffset3))

    # EVENTO DE TEXTO
    if mouse.hovered_entity == cube:
        info.visible = True
    else:
        info.visible = False


"""Funcion: Cambia colore - Crea nuevas Instancias Nueva Con Hijo"""


def input(key):
    global childcube
    global newcube
    if key == "space":
        red = random_generator.random() * 255
        green = random_generator.random() * 255
        blue = random_generator.random() * 255
        cube.color = color.rgb(red, green, blue)

    if key == "c":
        x = random_generator.random() * 10 - 5  # Value between -5 and 5
        y = random_generator.random() * 10 - 5  # Value between -5 and 5
        z = random_generator.random() * 10 - 5  # Value between -5 and 5
        s = random_generator.random() * 1  # Value between 0 and 1

        newcube = Entity(
            parent=cube,
            model="cube",
            color=color.white,
            position=(x, y, z),
            scale=(s, s, s),
            texture="crate",
        )
        childcube = Entity(
            parent=newcube,
            model="cube",
            color=color.white,
            position=(1, 0, 0),
            scale=(s / 2, s / 2, s / 2),
            texture="water",
        )

        cubes.append(newcube)
        cubes.append(childcube)
        animacion.append(childcube)
        # print(f'Cubos => {cubes}')


app = Ursina()

""" PROPIEDADES De la Ventana"""
window.title = "My Game"  # The window title
window.borderless = False  # Show a border
window.fullscreen = False  # Go Fullscreen
window.exit_button.visible = False  # Show the in-game red X that loses the window
window.fps_counter.enabled = True  # Show the FPS (Frames per second) counter

""" ARRAY de los Cubos e Insercion"""
cubes = []  # Create the list
cube = Entity(
    model="cube", color=color.white, scale=(2, 2, 2), texture="water", collider="box"
)
cube2 = Entity(
    model="cube",
    color=color.rgba(255, 255, 255, 128),
    scale=(2.5, 6, 2.5),
    texture="water",
)
# cube3 = Entity(model='cube', color=color.white, scale=(2,6,2), texture="water", collider="box", position=(1, 0, 0))


cubes.append(cube)  # Add the cube to the list
cubes.append(cube2)  # Add the cube to the list
# cubes.append(cube3)                     # Add the cube to the list


""" TEXTO Del Hover"""
Text.size = 0.05
Text.default_resolution = 1080 * Text.size
info = Text(text="A powerful waterfall roaring on the mountains")
info.x = -0.5
info.y = 0.4
info.background = True
info.visible = False  # Do not show this text


app.run()
