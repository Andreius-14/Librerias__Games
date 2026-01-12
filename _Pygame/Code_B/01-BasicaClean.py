import pygame, sys
pygame.init()

# Ventana - Tamaño Creacion Frame
size = (800, 500)
screen = pygame.display.set_mode(size)
clock = pygame.time.Clock()

# Parametros Constantes
BLACK = (0,0,0)
WHITE = (255,255,255)
GREEN = (0,225,0)
RED   = (225,0,0)
BLUE   = (0,0,225)
game_over = False

while not game_over:
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
             game_over = True
        # 🌱 Dentro del for Comprobamos Teclas - Mouse
        # 🌱 El for se ejecuta en cada While


    """CODIGO DEL JUEGO"""
    # Eventos
    # Logica
    # Zona de Dibujo
    screen. fill (WHITE)
    # Colisiones

    """CODIGO DEL JUEGO"""
    pygame.display.flip()
    clock.tick(60)
pygame.quit()

