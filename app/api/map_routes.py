from flask import Blueprint, jsonify, request
from app.models import Tile, Map

map_routes = Blueprint('maps', __name__)



@map_routes.route('/<int:id>')
def get_map(id):
    map = Map.query.get(id)
    return map.to_dict()