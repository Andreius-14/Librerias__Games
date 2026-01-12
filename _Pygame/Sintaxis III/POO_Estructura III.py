import pygame as pg,sys
import math

# [Basic] Constantes
BLACK = (0,0,0)
WHITE = (255,255,255)
GREEN = (0,225,0)
RED   = (225,0,0)
BLUE   = (0,0,225)

WIDTH = 400
HEIGHT = 300

class Game:

    """Contructor sin Parametros [Init]"""
    def __init__(self):
        # Inicializa pygame 
        # Establece Propiedades
        pg.init()
        self.screen = pg.display.set_mode((WIDTH, HEIGHT))
        self.clock = pg.time.Clock()
        # Extra
        self.new_game()

    
    """Inicializa Import 1vez """
    def new_game(self):  
        # Instanciamos Clases  
        pass

    """ Bucle Funciones """
    def check_events(self):
        # Los Eventos Del Juego
        for event in pg.event.get():
            if event.type == pg.QUIT or (event.type == pg.KEYDOWN and event.key == pg.K_ESCAPE):
                pg.quit()
                sys.exit()

    def update(self):
        # Update - Basica
        pg.display.flip()
        self.clock.tick(60)

    def draw(self):
        self.screen.fill(WHITE)

    """ Bucle Principal """
    def run(self):
        while True:
            #Eventos
            self.check_events()
            #Actualiza Data
            self.update()
            #Dibuja
            self.draw()


# El Inicia
if __name__ == '__main__':
    game = Game()
    game.run()


"""
En el constructor fijamos,

        # Intervalos Eventos
        # self.global_event = pg.USEREVENT + 0
        # pg.time.set_timer(self.global_event, 1000)

En el Bucle de Eventos
        for event in pg.event.get():
            # Teclas Salir
            if event.type == pg.QUIT or (event.type == pg.KEYDOWN and event.key == pg.K_ESCAPE):
                pg.quit()
            # elif event.type == self.global_event:
            #     self.global_trigger = True

            # self.player.single_fire_event(event)
"""

"""
    Fijar FPS del Juego Avanzado
    def __init__(self):
            self.clock = pg.time.Clock()

    def update(self):
        # Update - Basica
        pg.display.flip()
        self.delta_time = self.clock.tick(FPS)
        pg.display.set_caption(f'{self.clock.get_fps() :.1f}')  Titulo de la ventana
    
"""