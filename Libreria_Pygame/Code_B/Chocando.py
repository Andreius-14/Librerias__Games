"""
🌱 Creamos Naves que chocan con Asteroides y contador por Consola
"""

import pygame, random
pygame.init()

# colores
BLACK = (0,0,0)
WHITE = (255,255,255)
GREEN = (0,225,0)
RED   = (225,0,0)
BLUE   = (0,0,225)

# Pantalla
screen = pygame.display.set_mode([900, 600])
clock = pygame.time.Clock()

# Clases - Creaccion de Objetos
class Meteor(pygame.sprite.Sprite):
	def __init__(self):
		super().__init__()
		self.image = pygame.image.load("img/meteor.png").convert()
		self.image.set_colorkey(BLACK)
		self.image = pygame.transform.scale(self.image, (50, 50)) # Ajusta el tamaño de la imagen
		self.rect = self.image.get_rect()

class Player(pygame.sprite.Sprite):
	def __init__(self):
		super().__init__()
		self.image = pygame.image.load("img/player.png").convert()
		self.image.set_colorkey(BLACK)
		self.image = pygame.transform.scale(self.image, (50, 50)) # Ajusta el tamaño de la imagen
		self.rect = self.image.get_rect()



# PARAMETROS e INSTANCIAS
score = 0
meteor_list = pygame.sprite.Group()
all_sprite_list = pygame.sprite.Group()

for i in range(50):
	meteor = Meteor()
	meteor.rect.x = random.randrange(900)
	meteor.rect.y = random.randrange(600)

	meteor_list.add(meteor)
	all_sprite_list.add(meteor)

player = Player()
all_sprite_list.add(player)


#Bucle Principal
done = False

while not done:
	for event in pygame.event.get():
		if event.type == pygame.QUIT:
			done = True

    # Parametros [Mouse Coordenadas]
	mouse_pos = pygame.mouse.get_pos()
	player.rect.x = mouse_pos[0]
	player.rect.y = mouse_pos[1]

    # COLISION Y Elim
	meteor_hit_list = pygame.sprite.spritecollide(player, meteor_list, True)

    # 🌱 Imprime por consola - 
	for meteor in meteor_hit_list:
		score += 1
		print(score)

	
    # DIBUJANDO
	screen.fill(WHITE)
	all_sprite_list.draw(screen)


	pygame.display.flip()
	clock.tick(60)

pygame.quit()
