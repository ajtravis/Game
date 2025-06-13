from flask import Blueprint, jsonify, request
from app.models import Tile, Tower

tile_routes = Blueprint('tiles', __name__)



@tile_routes.route('/<int:id>')
def get_map_tiles(id):
    product = Product.query.get(id)
    return product.to_dict()

    