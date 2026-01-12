from ursina import *

app = Ursina(forced_aspect_ratio=0.6)

""" INSTANCIAS """
bg = Entity(model="quad", scale=(30, 50), texture="grass", color=hsv(0, 0, 0.2))
player = Entity(model=Circle(3), color=color.azure, speed=8, y=-0.4, z=-1)
ec = EditorCamera(rotation_x=-20)

# ⚙️  Propiedades
scene.fog_density = (10, 50)

# Objeto Bala
player.bullet_renderer = Entity( model=Mesh(mode="point", thickness=0.2), texture="circle", color=color.yellow)

def shoot():
    player.bullet_renderer.model.vertices.append(player.position)

# ⚙️  Propiedades
shoot_cooldown = 0.1
shoot_sequence = Sequence(Func(shoot), Wait(shoot_cooldown), loop=True)


""" Funciones Importantes """

# funcion - Frames
def update():

    # Teclado Movimiento  # Animacion Player
    move_direction = Vec2( held_keys["d"] - held_keys["a"], held_keys["w"] - held_keys["s"]).normalized()
    player.position += move_direction * player.speed * time.dt

    # Animacion UV - Textura
    bg.texture_offset += Vec2(0, time.dt)
    
    # Bala - model.vertices
    for i, bullet in enumerate(player.bullet_renderer.model.vertices):
        player.bullet_renderer.model.vertices[i] += Vec3(0, time.dt * 10, 0)
        
        # Enemigo y Bullet - Interaccion
        for enemy in enemies:
            if distance_2d(bullet, enemy) < 0.5:
                enemy.hp -= 1
                enemy.blink(color.white)

                # Eliminar Enemy
                if enemy.hp <= 0:
                    enemies.remove(enemy)
                    destroy(enemy)
                    # todo: add explosion particles and sound effect

                # Bala
                if bullet in player.bullet_renderer.model.vertices:
                    player.bullet_renderer.model.vertices.remove(bullet)


                print("a")
    
    # Bala
    if len(player.bullet_renderer.model.vertices):
        player.bullet_renderer.model.vertices = player.bullet_renderer.model.vertices[ -100: ]  # max bullets
    
    # Bala
    player.bullet_renderer.model.generate()


# funcion - Teclas
def input(key):
    if key == "space":
        shoot_sequence.start()
    if key == "space up":
        shoot_sequence.paused = True

""" VARIABLES ENEMIGO """

enemies = []
# enemy = Entity( model=Circle(3), rotation_z=180, position=( random.randint(-5,5) , 16), color=color.red, z=-1, speed=random.randint(3, 5), hp=5,)
# enemies.append(enemy)

enemy = None
def añadiendoEnemy():
    global enemy  # Indicar que la variable 'enemy' es global

    if random.randint(0, 20) == 4:

         #Enemigo y Propiedades
         enemy = Entity( model=Circle(3), rotation_z=180, position=( random.randint(-5,5) , 16), color=color.red, z=-1, speed=random.randint(3, 5), hp=5,)
         enemies.append(enemy)

   
def enemy_update():
    añadiendoEnemy()
    global enemy  # Indicar que la variable 'enemy' es global
    if enemy is not None:
        for e in enemies:
            e.position += e.up * enemy.speed * time.dt

enemy_handler = Entity(update=enemy_update)


app.run()
