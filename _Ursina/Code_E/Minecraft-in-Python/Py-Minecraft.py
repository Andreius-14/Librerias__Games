from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController

app = Ursina()

""" Variables"""

# Rutas Texturas
grass_texture = load_texture('assets/grass_block.png')
stone_texture = load_texture('assets/stone_block.png')
brick_texture = load_texture('assets/brick_block.png')
dirt_texture  = load_texture('assets/dirt_block.png')
sky_texture   = load_texture('assets/skybox.png')
arm_texture   = load_texture('assets/arm_texture.png')

punch_sound   = Audio('assets/punch_sound',loop = False, autoplay = False)

# Textura 
block_pick = 1

# Propiedades de Ventana
window.fps_counter.enabled = False   # Oculta FPS
window.exit_button.visible = False	 # Oculta [x]


def update():
	global block_pick

	""" 👋 Actualiza Posicion de Manos 👋 """
	if held_keys['left mouse'] or held_keys['right mouse']:
		hand.active()
	else:
		hand.passive()

	""" 📷 Actualiza La Textura Usada 📷 """
	if held_keys['1']: block_pick = 1
	if held_keys['2']: block_pick = 2
	if held_keys['3']: block_pick = 3
	if held_keys['4']: block_pick = 4



# 🌱 Class: La Caja [🌱 Importante 🌱] 
# Cada Caja es un Boton
class Voxel(Button):
	def __init__(self, position = (0,0,0), texture = grass_texture):
		super().__init__(
			#Propiedades Estandar de cada Caja Creada
			parent = scene,
			position = position,
			model = 'assets/block',
			origin_y = 0.5,
			texture = texture,
			color = color.color(0,0,random.uniform(0.9,1)),
			scale = 0.5)
    
    # 🖱️ Click Izquierdo - 🖱️ Click Derecho
	def input(self,key):
		if self.hovered:
			if key == 'left mouse down':
				punch_sound.play()

				# MAGIC
				if block_pick == 1: voxel = Voxel(position = self.position + mouse.normal, texture = grass_texture)
				if block_pick == 2: voxel = Voxel(position = self.position + mouse.normal, texture = stone_texture)
				if block_pick == 3: voxel = Voxel(position = self.position + mouse.normal, texture = brick_texture)
				if block_pick == 4: voxel = Voxel(position = self.position + mouse.normal, texture = dirt_texture)

			if key == 'right mouse down':
				punch_sound.play()
				destroy(self)

# 🌱 Class: El Cielo --- una herencia por ello usa super() -- [Solo un Efecto Visual]
class Sky(Entity):
	def __init__(self):
		super().__init__(
			parent = scene,
			model = 'sphere',
			texture = sky_texture,
			scale = 150,
			double_sided = True)

# 🌱 Class: El Brazo --- una herencia por ello usa super() -- [Solo un Efecto Visual]
class Hand(Entity):
	def __init__(self):
		super().__init__(
			parent = camera.ui,
			model = 'assets/arm',
			texture = arm_texture,
			scale = 0.2,
			rotation = Vec3(150,-10,0),		# Su padre es la Camara rotanto en 3D (x,y,z)
			position = Vec2(0.4,-0.6))		# borrarlo sin problema no afecta nada

	def active(self):
		self.position = Vec2(0.3,-0.5)        # El punto rojo es el plano cartesiano [Usa Decimas de 0][No Enteros]

	def passive(self):
		self.position = Vec2(0.4,0.6)	 # El punto rojo es el plano cartesiano [Usa Decimas de 0][No Enteros]



# 🌱 Intancia cada Instanacia es un Objeto """
for z in range(20):
	for x in range(20):
		voxel = Voxel(position = (x,0,z))

player = FirstPersonController()
sky = Sky()
hand = Hand()


app.run()


