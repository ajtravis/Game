from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Tower(db.Model):
    __tablename__ = 'towers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    damage= db.Column(db.Integer, nullable=False)
    attack_speed = db.Column(db.Integer, nullable=False)
    attack_range = db.Column(db.Integer, nullable=False)
    cost = db.Column(db.Integer, nullable=False, default=10)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    tile_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tiles.id")))
    
    # relationships
    tower_tile = db.relationship("Tile", back_populates="tile_tower")


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'damage': self.damage,
            'attack_speed': self.attack_speed,
            'attack_range': self.attack_range,
            'cost': self.cost,
            'tile_id': self.tile_id,
            'created_at': self.created_at
        }
