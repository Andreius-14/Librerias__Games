import pygame
import math
import sys

# [Basic] Constantes
BLACK = (0,0,0)
WHITE = (255,255,255)
GREEN = (0,225,0)
RED   = (225,0,0)
BLUE   = (0,0,225)


class Player:
    #Constructor simple 
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
        if mx < self.game.limit_border_left or mx > self.game.limit_border_right:
            pygame.mouse.set_pos([self.game.half_width, self.game.half_height])

class Game:
    # Constructor Simple - Crea Ventana
    def __init__(self, width, height):

        # Variables Pantallas
        self.width = width
        self.height = height
        self.screen = pygame.display.set_mode((width, height))

        self.half_width = self.width // 2
        self.half_height = self.height // 2

        self.limit_border_left = 50
        self.limit_border_right = self.width - 50

        #Variables
        pygame.display.set_caption("Triángulo Rectángulo Interactivo")
        self.clock = pygame.time.Clock()

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
        return True

    """ Funciones - Parametro Player """
    def update(self, player):
        # Eventos Teclas
        keys = pygame.key.get_pressed()
        player.move(keys)

        # Determina Si se mueve el Mouse - Izquierda Derecha 
        mouse_movement = pygame.mouse.get_rel()[0]
        if mouse_movement < 0:
            player.rotate(1)
        elif mouse_movement > 0:
            player.rotate(-1)

        # Mover el Mouse al Centro
        player.mouse_control()

    def draw(self, player):
        self.screen.fill(WHITE)

        longitud = 100

        # Coordenadas - Coordenada Opuesto [y] Cateto Abyacente [x]
        """ LOS () Creamos los Tamaño de los Catetos, multiplicando una Longitud por Cos y Sen """
        end_x = player.pos[0] + (longitud * math.cos(math.radians(player.angle))  )
        end_y = player.pos[1] - (longitud * math.sin(math.radians(player.angle))  )


        # 🖍️ Player
        pygame.draw.circle(self.screen, BLACK, player.pos, player.radius)
        
        """ line(Pantalla, color, Position-X, Position-Y) """

        # 🖍️ Cateto Adyacente
        pygame.draw.line(self.screen, BLUE, player.pos, (end_x, player.pos[1]))
        # 🖍️ Cateto Opuesto
        pygame.draw.line(self.screen, GREEN, (end_x, player.pos[1]), (end_x, end_y))
        # 🖍️ Hipotenusa
        pygame.draw.line(self.screen, RED, player.pos, (end_x, end_y))
   
        # Texto - Font
        angle_text = f"Ángulo: {player.angle:.1f} grados"
        font = pygame.font.Font(None, 36)
        text = font.render(angle_text, True, BLACK)
        self.screen.blit(text, (10, 10))
        
        pygame.display.flip()

    def run(self):
        # Instancia
        player = Player(self, self.half_width, self.half_height, 20, 5) 
        running = True
        while running:
            
            # [01] Event's Loop
            running = self.handle_events()
            
            # [02] Logica
            self.update(player)
            
            # [03] Zona de Dibujo
            self.draw(player)
		    
            # [04] Extra    
            self.clock.tick(60)
        
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    pygame.init()
    game = Game(400, 300)
    game.run()

"""
    - El siguiente codigo Instancia GAME 
    - La clase GAME instancia a Player y las funciones de GAME su paramero pide una instancia 
"""