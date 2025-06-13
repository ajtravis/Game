from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Tile(db.Model):
    __tablename__ = 'tiles'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Integer, nullable=False)
    y = db.Column(db.Integer, nullable=False)
    is_path= db.Column(db.Boolean, nullable=False)
    has_tower = db.Column(db.Boolean, nullable=False)
    is_spawn= db.Column(db.Boolean, nullable=False)
    is_base= db.Column(db.Boolean, nullable=False)
    
    map_id = db.Column(
    db.Integer,
    db.ForeignKey(add_prefix_for_prod("maps.id")),
    nullable=False
    )

    map = db.relationship("Map", back_populates="tiles")

    tile_tower = db.relationship("Tower", back_populates="tower_tile")
    tile_enemy = db.relationship("Enemy", back_populates="enemy_tile")


    def to_dict(self):

        return {
            'id': self.id,
            'x': self.x,
            'y': self.y,
            'is_path': self.is_path,
            'is_spawn': self.is_spawn,
            'is_base': self.is_base,
            'map_id': self.map_id,
        }
