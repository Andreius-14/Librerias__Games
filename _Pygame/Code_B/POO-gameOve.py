import pygame, random

# Parametros Constantes
SCREEN_WIDTH = 900
SCREEN_HEIGHT = 600
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

# [🌱] Tres Clases Principales [Game] [Meteor][Player] 

# [Class-Objeto]
class Meteor(pygame.sprite.Sprite):
	def __init__(self):
		super().__init__()
		self.image = pygame.image.load("img/meteor.png").convert()
		self.image = pygame.transform.scale(self.image, (50, 50)) # Ajusta el tamaño de la imagen
		self.image.set_colorkey(BLACK)
		self.rect = self.image.get_rect()

	def update(self):
		self.rect.y += 1

		if self.rect.y > SCREEN_HEIGHT:
			self.rect.y = -10
			self.rect.x = random.randrange(SCREEN_WIDTH)

# [Class-Objeto]
class Player(pygame.sprite.Sprite):
	def __init__(self):
		super().__init__()
		self.image = pygame.image.load("img/player.png").convert()
		self.image = pygame.transform.scale(self.image, (50, 50)) # Ajusta el tamaño de la imagen
		self.image.set_colorkey(BLACK)
		self.rect = self.image.get_rect()

	def update(self):
		mouse_pos = pygame.mouse.get_pos()
		self.rect.x = mouse_pos[0]
		self.rect.y = mouse_pos[1]

# [Class-Principal]
class Game(object):

	def __init__(self):
        # parametros - Predeterminados - Array Vacia
		self.game_over = False
		self.score = 0
		self.meteor_list = pygame.sprite.Group()
		self.all_sprites_list = pygame.sprite.Group()

        # Crea las coordenadas de los Meteoros
		for i in range(50):
			meteor = Meteor()
			meteor.rect.x = random.randrange(SCREEN_WIDTH)
			meteor.rect.y = random.randrange(SCREEN_HEIGHT)

			self.meteor_list.add(meteor)
			self.all_sprites_list.add(meteor)

		self.player = Player()
		self.all_sprites_list.add(self.player)

    # 💾 Funcion - Se Cierra Ventana - bool
	def process_events(self):
		for event in pygame.event.get():
			if event.type == pygame.QUIT:
				return True

			if event.type == pygame.MOUSEBUTTONDOWN:
				if self.game_over:
					self.__init__()

		return False

    # Logica de Colision
	def run_logic(self):

		if not self.game_over:
			self.all_sprites_list.update()

			meteor_hit_list = pygame.sprite.spritecollide(self.player, self.meteor_list, True)

			for meteor in meteor_hit_list:
				self.score += 1
				print(self.score)

			if len(self.meteor_list) == 0:
				self.game_over = True

    # 💾 Imprime en Pantalla - Muerte - All Sprite
	def display_frame(self, screen):
		screen.fill(WHITE)

		if self.game_over:
			font = pygame.font.SysFont("serif", 25) # Fuente
			text = font.render("Game Over, Click To Continue", True, BLACK) # Texto
			center_x = (SCREEN_WIDTH // 2) - (text.get_width() // 2) # posicion text
			center_y = (SCREEN_HEIGHT // 2) - (text.get_height() // 2)
			screen.blit(text, [center_x, center_y]) # ponerlo en pantalla

		if not self.game_over:
			self.all_sprites_list.draw(screen)

		pygame.display.flip()


# [🌱] Funcion Principal que Inicia y/o Desencadena El Juegos

def main():
    # Basico - Usar Pygame
	pygame.init()

    # Basico - Pantalla - FPS
	screen = pygame.display.set_mode([SCREEN_WIDTH, SCREEN_HEIGHT])
	clock = pygame.time.Clock()

    # Parametros - Instancia
	done = False
	game = Game()

    # 🌱 La ventana se Cierra - el while Termina 🌱
	while not done:
		done = game.process_events()
		game.run_logic()
		game.display_frame(screen)

		clock.tick(60)
	pygame.quit()


if __name__ == "__main__":
	main()
