import pygame, sys

pygame.init()

# Colores
BLACK = (0,0,0)
WHITE = (255,255,255)
GREEN = (0,225,0)
RED   = (225,0,0)
BLUE   = (0,0,225)

size = (800, 500)
screen = pygame.display.set_mode(size)
clock = pygame.time.Clock()

# Paramentros
pygame.mouse.set_visible(0)

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
             sys.exit()

    # color de fondo
    screen. fill (WHITE)

    """CODIGO DEL JUEGO"""

    mouse_post = pygame.mouse.get_pos()
    x=mouse_post[0]
    y=mouse_post[1]

    pygame.draw.rect(screen,RED,(x,y,100,100))



    """CODIGO DEL JUEGO"""

    pygame.display.flip()
    clock.tick(60)

