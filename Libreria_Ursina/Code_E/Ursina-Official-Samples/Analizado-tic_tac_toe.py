from ursina import *

# Verificador
if __name__ == '__main__':
    app = Ursina()


""" Variables """
player = Entity(name='o', color=color.azure)
cursor = Tooltip(player.name, color=player.color, origin=(0,0), scale=4, enabled=True)
bg = Entity(parent=scene, model='quad', texture='shore', scale=(16,8), z=10, color=color.light_gray)


# Propiedades Mouse 
mouse.visible = False
cursor.background.color = color.clear
Text.default_resolution *= 2
# Propiedades Camara
camera.orthographic = True
camera.fov = 4
camera.position = (1, 1)   # El plano no esta centrado y crentraremos la caja

""" For """
# Make Matriz
board = [[None for x in range(3)] for y in range(3)]     #[[None, None, None], [None, None, None], [None, None, None]] 

for y in range(3):
    for x in range(3):
        # Instancia Button - Plano Cartesiano - Position
        b = Button(parent=scene, position=(x,y))
        # Butonn - Inyectada a  Matriz
        board[x][y] = b

        # Funcion a Cada Caja = AddEventListener
        def on_click(b=b):
            #EDIT BUTTOM
            b.text = player.name
            b.color = player.color
            b.collision = False
            check_for_victory()

            # Efecto Mouse
            if player.name == 'o':
                player.name = 'x'
                player.color = color.orange
            else:
                player.name = 'o'
                player.color = color.azure

            cursor.text = player.name
            cursor.color = player.color

        b.on_click = on_click 


""" Funcion """
def check_for_victory():
    name = player.name

    won = (
    (board[0][0].text == name and board[1][0].text == name and board[2][0].text == name) or # across the bottom
    (board[0][1].text == name and board[1][1].text == name and board[2][1].text == name) or # across the middle
    (board[0][2].text == name and board[1][2].text == name and board[2][2].text == name) or # across the top
    (board[0][0].text == name and board[0][1].text == name and board[0][2].text == name) or # down the left side
    (board[1][0].text == name and board[1][1].text == name and board[1][2].text == name) or # down the middle
    (board[2][0].text == name and board[2][1].text == name and board[2][2].text == name) or # down the right side
    (board[0][0].text == name and board[1][1].text == name and board[2][2].text == name) or # diagonal /
    (board[0][2].text == name and board[1][1].text == name and board[2][0].text == name))   # diagonal \

    if won:
        print('winner is:', name)
        destroy(cursor)
        mouse.visible = True
        Panel(z=1, scale=10, model='quad')
        t = Text(f'player\n{name}\nwon!', scale=3, origin=(0,0), background=True)
        t.create_background(padding=(.5,.25), radius=Text.size/2)
        t.background.color = player.color.tint(-.2)

# Verficador
if __name__ == '__main__':
    app.run()
