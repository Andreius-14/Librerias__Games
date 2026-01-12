import pygame, sys ,random

pygame.init()

# Ventana - Tamaño Creacion Frame
size = (800, 500)
screen = pygame.display.set_mode(size)
clock = pygame.time.Clock()

""" PARAMENTROS - INICIO"""

### COLORES
BLACK = (0,0,0)
WHITE = (255,255,255)
GREEN = (0,225,0)
RED   = (225,0,0)
BLUE   = (0,0,225)

### COORDENADAS
coor_list = []
for i in range(60):
    x = random.randint(0,800)
    y = random.randint(0,500)
    coor_list.append([x,y])

""" PARAMENTROS - FIN """


while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
             sys.exit()

    # color de fondo
    screen. fill (WHITE)

    """CODIGO DEL JUEGO"""
    #Se ejecuta en cada frame. no solo inserta sino tambien cambia su posicion en Y
    for coord in coor_list:
        pygame.draw.circle(screen,RED,coord,2)
        
        coord[1] += 1
        if coord[1]> 500:
            coord[1]=0


    """CODIGO DEL JUEGO"""

    pygame.display.flip()
    clock.tick(20)

