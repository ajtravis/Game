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
    # created_at = db.Column(db.DateTime, default=datetime.utcnow)
    tile_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tiles.id")))
    
    # relationships
    # product_user = db.relationship("User", back_populates="user_product")
    # product_item = db.relationship("Cart_Item", back_populates="item_product")
    # product_review = db.relationship("Review", back_populates="review_product")
    tower_tile = db.relationship("Tile", back_populates="tile_tower")


    def to_dict(self):

        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'damage': self.damage,
            'attack_speed': self.attack_speed,
            'attack_range': self.attack_range,
            'tile_id': self.tile_id
            # 'created_at': self.created_at,
            
            # 'category_ids': [c.id for c in self.product_categories]
        }
