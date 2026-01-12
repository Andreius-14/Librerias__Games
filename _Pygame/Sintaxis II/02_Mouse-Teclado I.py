import pygame, sys
pygame.init()

# [Basic] Constantes

# [Basic] Pantalla
size = (800, 500)
screen = pygame.display.set_mode(size)
clock = pygame.time.Clock()

# [Basic] Variables

# [Basic] Propiedades
pygame.mouse.set_visible(0)  # 🌱 Visibilidad del Mouse

# [Basic] Game-Loop [Update]
while True:
    
    # [01] Event's Loop
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
            
    # [02] Logica
    # [03] Zona de Dibujo
    # [04] Colisiones
    # [05] Codigo Del Juego   
    
    print(pygame.mouse.get_pos())   # 🌱 Coordenada de Mouse en La ventana Pygame
    
    # [06] Extra 
    pygame.display.flip()
    clock.tick(60)

