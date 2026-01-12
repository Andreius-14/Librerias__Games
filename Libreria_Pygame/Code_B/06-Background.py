
import pygame, sys
pygame.init()


# Ventana - Tamaño Creacion Frame
size = (800, 500)
screen = pygame.display.set_mode(size)
clock = pygame.time.Clock()

# Parametros Constantes
game_over = False
background = pygame.image.load("fondo.jpg").convert()

while not game_over:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
             game_over = True

    """CODIGO DEL JUEGO"""
    # Zona de Dibujo
    screen.blit(background,[50,100])
    # Colisiones

    """CODIGO DEL JUEGO"""

    pygame.display.flip()
    clock.tick(60)

pygame.quit()

