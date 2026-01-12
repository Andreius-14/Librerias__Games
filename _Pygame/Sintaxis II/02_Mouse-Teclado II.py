import pygame, sys
pygame.init()

# [Basic] Constantes
BLACK = (0,0,0)
WHITE = (255,255,255)
GREEN = (0,225,0)
RED   = (225,0,0)
BLUE   = (0,0,225)

# [Basic] Pantalla
size = (800, 500)
screen = pygame.display.set_mode(size)
clock = pygame.time.Clock()

# [Basic] Variables
coord_x = 10
coord_y = 10

x_speed = 0
y_speed = 0

# [Basic] Propiedades


# [Basic] Game-Loop [Update]
while True:
    # [01] Event's Loop
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
            
        # 🌱 Evento-Teclado 🌱
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT:
                x_speed = -3
            if event.key == pygame.K_RIGHT:
                x_speed = 3
            if event.key == pygame.K_UP:
                y_speed = -3
            if event.key == pygame.K_DOWN:
                y_speed = 3

        if event.type == pygame.KEYUP:
            if event.key == pygame.K_LEFT or event.key == pygame.K_RIGHT:
                x_speed = 0
            if event.key == pygame.K_UP or event.key == pygame.K_DOWN:
                y_speed = 0
                
    # [02] Logica
    # [03] Zona de Dibujo
    screen. fill (WHITE)
    
    # [04] Colisiones
    # [05] Codigo Del Juego  
    coord_x += x_speed
    coord_y += y_speed
    pygame.draw.rect(screen,RED,(coord_x,coord_y,100,100)) 
    
    # [0] Extra 
    pygame.display.flip()
    clock.tick(60)
    