"""
    Resultado: Piso + 360° De Vista

"""
from ursina import *
from ursina.shaders import lit_with_shadows_shader
from ursina.prefabs.first_person_controller import FirstPersonController

app = Ursina(size=(1280, 720))

physics_entities = []

""" PARTE 01 """  # IMPORTANTE


class PhysicsEntity(Entity):
    # Constructor + No se añade parametros extras son los mismos que del padre
    def __init__(self, model="cube", collider="box", **kwargs):
        super().__init__(model=model, collider=collider, **kwargs)
        # Añade Objeto Actual al Array
        physics_entities.append(self)

    # Actualizar Posicion
    def update(self):
        # Si hay colision Detener
        if self.intersects():
            self.stop()
            return

        """ GRAVEDAD """
        self.velocity = lerp( self.velocity, Vec3(0), time.dt)  # [lerp]para suavizar la velocidad del objeto.
        self.velocity += Vec3(0, -1, 0) * time.dt * 5           # Velocidad de Caida
        # mueve el objeto en la dirección y velocidad determinadas
        self.position += (self.velocity + Vec3(0, -4, 0)) * time.dt

    # Detener Fisica
    def stop(self):
        self.velocity = Vec3(0, 0, 0)
        if self in physics_entities:
            physics_entities.remove(self)

    def on_destroy(self):
        self.stop()

    def throw(self, direction, force):
        pass


""" PARTE 02 """  # Luces y Piso
Entity.default_shader = lit_with_shadows_shader  # 🔆 Luces - Esta Oscuro esto lo Evita
DirectionalLight().look_at(Vec3(1, -1, -1))  # 🔆 Luces - Origen de la luz emitida
ground = Entity(
    model="plane",
    scale=32,
    texture="white_cube",
    texture_scale=Vec2(32),
    collider="box",
)  # PISO Plano

""" PARTE 03 """  # Personajes y Tecla
# Especial - Jugador
player = FirstPersonController()


# Funcion - Lanza Cubos
def input(key):
    if key == "left mouse down":
        # referencia Clase - Crea Cubi position 0 -> Position a lugar -> efecto de gravedad
        e = PhysicsEntity(
            model="cube",
            color=color.azure,
            velocity=Vec3(0),
            position=player.position + Vec3(0, 1.5, 0) + player.forward,
            collider="sphere",
        )
        e.velocity = (camera.forward + Vec3(0, 0.5, 0)) * 10


# Especial - Cielo
Sky()

app.run()
