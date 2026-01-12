
import pygame, sys

pygame.init()
# Define Colore

# Definir colores
BLACK = (0,0,0)
WHITE = (255,255,255)
GREEN = (0,225,0)
RED   = (0,0,225)

size = (800, 500)

# Crear ventana
screen = pygame.display.set_mode(size)

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
             sys.exit()


    # color de fondo
    screen. fill (WHITE)
    ### ZONA DE DIBUJO
    pygame.draw.line(screen, GREEN, [0, 100], [200, 300], 5)
    pygame.draw.rect (screen, BLACK, (100, 100, 80, 80) )
    pygame.draw.circle(screen, BLACK, (200, 200), 30)
    ### ZONA DE DIBUJO
    # actualizar pantalla
    pygame.display.flip()

