from flask import Blueprint, jsonify, request
from app.models import Tile, Tower

tile_routes = Blueprint('tiles', __name__)



@tile_routes.route('/<int:id>')
def get_map_tile(id):
    tile = Tile.query.get(id)
    return tile.to_dict()

    