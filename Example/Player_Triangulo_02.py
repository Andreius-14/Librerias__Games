import pygame, sys
import math
# [Basic] Constantes
BLACK = (0,0,0)
WHITE = (255,255,255)
GREEN = (0,225,0)
RED   = (225,0,0)
BLUE   = (0,0,225)

WIDTH = 800
HEIGHT = 500


# [Class - Player]
class Player:
    def __init__(self, game, x, y, radius, speed):
        self.game = game
        self.pos = [x, y]
        self.radius = radius
        self.speed = speed
        self.angle = 45
        self.rotation_speed = 2
        
    #Funcion - Movimiento
    def move(self, keys):
        """ Modifica Posicion [dx, dy] """
        dx, dy = 0, 0
        if keys[pygame.K_w]:
            dx, dy = self.calculate_movement(math.radians(self.angle), self.speed)
        if keys[pygame.K_s]:
            dx, dy = self.calculate_movement(math.radians(self.angle + 180), self.speed)
        if keys[pygame.K_a]:
            dx, dy = self.calculate_movement(math.radians(self.angle + 90), self.speed)
        if keys[pygame.K_d]:
            dx, dy = self.calculate_movement(math.radians(self.angle - 90), self.speed)
        
        """ Modifica Posicion [dx, dy] """
        self.pos[0] += dx
        self.pos[1] += dy

    #Funcion - Movimiento
    def calculate_movement(self, angle, speed):
        """ Modifica Posicion [dx, dy] """
        dx = speed * math.cos(angle)
        dy = -speed * math.sin(angle)
        return dx, dy

    #Funcion - Mouse Detector
    def rotate(self, direction):
        """ Angulo """
        self.angle += self.rotation_speed * direction
        self.angle %= 360

    # Mover el Mouse al Centro
    def mouse_control(self):
        mx, my = pygame.mouse.get_pos()
        if mx < (self.game.limit_border_left) or mx > (self.game.limit_border_right):
            pygame.mouse.set_pos([self.game.half_width, self.game.half_height])


# [Class - Game]
class Game(object):
	def __init__(self):
		# Variables Pantallas
		self.width = WIDTH
		self.height = HEIGHT

		self.half_width = self.width // 2
		self.half_height = self.height // 2

		self.limit_border_left = 50
		self.limit_border_right = self.width - 50

		self.player = Player(self, self.half_width, self.half_height,20,5)


	""" Funciones - Bucle Principal """
	def process_events(self):
		# Los Eventos Del Juego
		for event in pygame.event.get():
			if event.type == pygame.QUIT:
				return True

			# if event.type == pygame.MOUSEBUTTONDOWN:
			# 	if self.game_over:
			# 		self.__init__()
		return False

	def run_logic(self):
		keys = pygame.key.get_pressed()
		self.player.move(keys)

		# Determina Si se mueve el Mouse - Izquierda Derecha 
		mouse_movement = pygame.mouse.get_rel()[0]
		if mouse_movement < 0:
			self.player.rotate(1)
		elif mouse_movement > 0:
			self.player.rotate(-1)

        # Mover el Mouse al Centro
		self.player.mouse_control()
  
	def display_frame(self, screen):
		# Zona de Dibujo
		screen.fill(WHITE)  
		longitud = 100

		# Coordenadas - Coordenada Opuesto [y] Cateto Abyacente [x]
		""" LOS () Creamos los Tamaño de los Catetos, multiplicando una Longitud por Cos y Sen """
		end_x = self.player.pos[0] + (longitud * math.cos(math.radians(self.player.angle))  )
		end_y = self.player.pos[1] - (longitud * math.sin(math.radians(self.player.angle))  )

		# 🖍️ Player
		pygame.draw.circle(screen, BLACK, self.player.pos, self.player.radius)

		# 🖍️ Cateto Adyacente 🖍️ Cateto Opuesto 🖍️ Hipotenusa  (Pantalla, color, Position-X, Position-Y)
		pygame.draw.line(screen, BLUE, self.player.pos, (end_x, self.player.pos[1]))
		pygame.draw.line(screen, GREEN, (end_x, self.player.pos[1]), (end_x, end_y))
		pygame.draw.line(screen, RED, self.player.pos, (end_x, end_y))

		# Texto - Font
		angle_text = f"Ángulo: {self.player.angle:.1f} grados"
		font = pygame.font.Font(None, 36)
		text = font.render(angle_text, True, BLACK)
		screen.blit(text, (10, 10))

		pygame.display.flip()

# [Funcion Main]
def main():
	# [Basic] Inicializar
	pygame.init()
 
	# [Basic] Pantalla
	size = (WIDTH, HEIGHT)
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
		pygame.display.set_caption("Triángulo Rectángulo Interactivo")
  
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
