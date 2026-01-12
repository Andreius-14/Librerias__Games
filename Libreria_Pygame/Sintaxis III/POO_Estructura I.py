"""
Complejidad Baja-Media
"""
import pygame, sys

# [Basic] Constantes

# [Class - pygame.sprite.Sprite]

# [Class - Game]
class Game(object):
	def __init__(self):
		self.game_over = False
		self.score = 0
		self.meteor_list = pygame.sprite.Group()
		self.all_sprites_list = pygame.sprite.Group()
		# Inicializar nuestras Variables
		# Crea las coordenadas e Instancias [for]	
		pass
	
	def process_events(self):
		# Los Eventos Del Juego
		for event in pygame.event.get():
			if event.type == pygame.QUIT:
				return True

			if event.type == pygame.MOUSEBUTTONDOWN:
				if self.game_over:
					self.__init__()
		return False

	def display_frame(self, screen):
		# Zona de Dibujo
		screen.fill(WHITE)
  
	def run_logic(self):
		# Logica Juego
		pass
  

# [Funcion Main]
def main():
	# [Basic] Inicializar
	pygame.init()
 
	# [Basic] Pantalla
	size = (800, 500)
	screen = pygame.display.set_mode(size)
	clock = pygame.time.Clock()

	# [Basic] Variables
	game = Game()
	game_over = False

	# [Basic] Game-Loop
	while not game_over:
     
		# [01] Event's Loop
		game_over = game.process_events()
  
		# [02] Logica
		game.run_logic()
  
		# [03] Zona de Dibujo
		game.display_frame(screen)	
  
		# [04] Extra
		pygame.display.flip()
		clock.tick(60)
  
	pygame.quit()

if __name__ == "__main__":
	main()
 
''' En POO 04 y 05 entran dentro de Logica
		# [04] Colisiones
		# [05] Codigo Del Juego    
	La Funcion Game es Opcional pero sirve un codigo mas Limpio
'''