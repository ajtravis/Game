from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Map(db.Model):
    __tablename__ = 'maps'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    spawn = db.Column(db.Integer)
    base = db.Column(db.Integer, nullable=False)
    
    tiles = db.relationship(
        "Tile",
        back_populates="map",
        cascade="all, delete-orphan",
        lazy="joined" 
    )
  
    def to_dict(self):

        return {
            'id': self.id,
            'spawn': self.spawn,
            'base' : self.base,
            'tiles': [tile.to_dict() for tile in self.tiles]
        }
