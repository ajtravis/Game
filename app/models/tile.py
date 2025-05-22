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
    # tower_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("towers.id")))
    # created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    # product_user = db.relationship("User", back_populates="user_product")
    # product_item = db.relationship("Cart_Item", back_populates="item_product")
    # product_review = db.relationship("Review", back_populates="review_product")
    tile_tower = db.relationship("Tower", back_populates="tower_tile")
    tile_enemy = db.relationship("Enemy", back_populates="enemy_tile")


    def to_dict(self):

        return {
            'id': self.id,
            'x': self.x,
            'y': self.y,
            'is_path': self.is_path,
            'has_tower': self.has_tower,
            # 'tower_id': self.tower_id
            # 'created_at': self.created_at,
            
            # 'category_ids': [c.id for c in self.product_categories]
        }
