import pygame, random

# Clases
class Meteor(pygame.sprite.Sprite):
	def __init__(self):
		super().__init__()
		self.image = pygame.image.load("img/meteor.png").convert()
		self.image = pygame.transform.scale(self.image, (50, 50)) # Ajusta el tamaño de la imagen
		self.image.set_colorkey(BLACK)
		self.rect = self.image.get_rect()

class Player(pygame.sprite.Sprite):
	def __init__(self):
		super().__init__()
		self.image = pygame.image.load("img/player.png").convert()
		self.image = pygame.transform.scale(self.image, (50, 50)) # Ajusta el tamaño de la imagen
		self.image.set_colorkey(BLACK)
		self.rect = self.image.get_rect()

	def update(self):
		mouse_pos = pygame.mouse.get_pos()
		player.rect.x = mouse_pos[0]
		player.rect.y = 510

class Laser(pygame.sprite.Sprite):
	def __init__(self):
		super().__init__()
		# self.image = pygame.image.load("img/laser.jpg").convert()
		self.image = pygame.image.load("img/galleta.png").convert()
		self.image = pygame.transform.scale(self.image, (50, 50)) # Ajusta el tamaño de la imagen
		self.image.set_colorkey(BLACK)
		self.rect = self.image.get_rect()

	def update(self):
		self.rect.y -= 4

# Inicializar Pygame
pygame.init()

# [Basic] Pantalla
size = (900, 600)
screen = pygame.display.set_mode(size)
clock = pygame.time.Clock()

# [Basic] Constantes
BLACK = (0, 0, 0)





# [Basic] Variables
score = 0

meteor_list = pygame.sprite.Group()
all_sprite_list = pygame.sprite.Group()
laser_list = pygame.sprite.Group()

for i in range(50):
	meteor = Meteor()
	meteor.rect.x = random.randrange(600 - 20)
	meteor.rect.y = random.randrange(450) 

	meteor_list.add(meteor)
	all_sprite_list.add(meteor)

player = Player()
all_sprite_list.add(player)

# Bucle Principal
done = False
while not done:
	for event in pygame.event.get():
		if event.type == pygame.QUIT:
			done = True

		if event.type == pygame.MOUSEBUTTONDOWN:
			laser = Laser()
			laser.rect.x = player.rect.x + 45
			laser.rect.y = player.rect.y - 20

			laser_list.add(laser)
			all_sprite_list.add(laser)


	all_sprite_list.update() # Especial - Llama la funcion update de cada clase para ejecutarse

	for laser in laser_list:
		meteor_hit_list = pygame.sprite.spritecollide(laser, meteor_list, True)	
		for meteor in meteor_hit_list:
			all_sprite_list.remove(laser)
			laser_list.remove(laser)
			score += 1
			print(score)
		if laser.rect.y < -10:
			all_sprite_list.remove(laser)
			laser_list.remove(laser)


	screen.fill([255, 255, 255])

	all_sprite_list.draw(screen)

	pygame.display.flip()
	clock.tick(60)

pygame.quit()
