
import pygame, sys
pygame.init()

# Ventana - Tamaño Creacion Frame
size = (800, 500)
screen = pygame.display.set_mode(size)
clock = pygame.time.Clock()

# Parametros Constantes

background = pygame.image.load("img/fondo.jpg").convert()
player = pygame.image.load("img/player.png").convert()
player.set_colorkey([0,0,0])

# Bucle principal
game_over = False

while not game_over:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
             game_over = True
    
    # Parametros [Mouse Coordenadas]
    mouse_pos = pygame.mouse.get_pos()
    x = mouse_pos[0]
    y = mouse_pos[1]

    """CODIGO DEL JUEGO"""
    screen.blit(background,[0,0])
    screen.blit(player,[x,y])

    """CODIGO DEL JUEGO"""
    pygame.display.flip()
    clock.tick(60)

pygame.quit()


