import pygame

# Code_E  ->  COdigo del tutorial  🌱 https://www.youtube.com/watch?v=xjAvXGT5z3E&list=PLuB3bC9rWQAu6cGeRo_I6QV8cz1_2V6uM


# 🌱 Dibujar 🌱 

# 🖍️ Explicación para dibujar una línea
# 🖍️ pygame.draw.line(surface, color, start [tupla (x, y)], end [tupla (x, y)], width)
pygame.draw.line(screen, red, (100, 100), (300, 200), 5)

# 🖍️ Explicación para dibujar un círculo
# 🖍️ pygame.draw.circle(surface, color, center [tupla (x, y)], radius)
pygame.draw.circle(screen, green, (400, 300), 50)

# 🖍️ Explicación para dibujar un rectángulo
# 🖍️ pygame.draw.rect(surface, color, rect [tupla (x, y, width, height)])
pygame.draw.rect(screen, blue, (500, 400, 100, 50))


'''
====================

FUNCIONES pygame
    screen.blit()
    pygame.sprite.Group()
    
    background = pygame.image.load("img/fondo.jpg").convert()
    player = pygame.image.load("img/player.png").convert()
    player.set_colorkey([0,0,0])

====================
'''

class Meteor(pygame.sprite.Sprite):
    pass

class Player(pygame.sprite.Sprite):
    pass

class NameClass(pygame.sprite.Sprite):
	def __init__(self):
		super().__init__()
		self.image = pygame.image.load("img.png").convert()
		self.image.set_colorkey(BLACK)
		self.image = pygame.transform.scale(self.image, (50, 50)) # Ajusta el tamaño de la imagen
		self.rect = self.image.get_rect()

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

"""
# Las clases pueden contener una funcion update - Debemos asignar cada instancias a un Array y usar el nameArrayAll.update()
    
    all_sprite_list = pygame.sprite.Group()     -- Array
    all_sprite_list.update()                    -- Actualizar las instancias dentro del Array [Position:Bucle Principal]


# Las instancias o objetos creados antes de ponerlos en pantalla podemos agruparlos dentro de arrays ESpeciales
    meteor_list = pygame.sprite.Group()
    all_sprite_list = pygame.sprite.Group()

    all_sprite_list.draw(screen)

# COLISION Y Eliminacion
    meteor_hit_list = pygame.sprite.spritecollide(player, meteor_list, True)
    
    
        # Tupla - x,y - solo x - Cuanto se desplazo con respecto a su ubicacion Anterior
        self.rel = pg.mouse.get_rel()[0]
        self.rel = max(-MOUSE_MAX_REL, min(MOUSE_MAX_REL, self.rel))
        self.angle += self.rel * MOUSE_SENSITIVITY * self.game.delta_time



"""
