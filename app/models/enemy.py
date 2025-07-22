from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Enemy(db.Model):
    __tablename__ = 'enemies'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    damage= db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=False)
    health = db.Column(db.Integer, nullable=False)
    speed = db.Column(db.Integer, nullable=False)
    tile_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tiles.id")))
    # created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    # product_user = db.relationship("User", back_populates="user_product")
    # product_item = db.relationship("Cart_Item", back_populates="item_product")
    # product_review = db.relationship("Review", back_populates="review_product")
    # product_categories = db.relationship("Category", secondary=products_categories, back_populates="category_products")
    enemy_tile = db.relationship("Tile", back_populates="tile_enemy")

    def to_dict(self):

        return {
            'id': self.id,
            'name': self.name,
            'damage': self.damage,
            'description': self.description,
            'health': self.health,
            'speed': self.speed,
            'tile_id': self.tile_id,
            'enemy_tile':self.enemy_tile
            # 'created_at': self.created_at,
            
            # 'category_ids': [c.id for c in self.product_categories]
        }

    