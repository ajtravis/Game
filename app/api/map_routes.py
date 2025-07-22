from flask import Blueprint, jsonify, request
from app.models import Tile, Map

map_routes = Blueprint('maps', __name__)



@map_routes.route('/<int:id>')
def get_map(id):
    map = Map.query.get(id)
    return map.to_dict()

@map_routes.route('<int:map_id>/spawn_enemy', methods=['POST'])
def spawn_enemy(map_id):
    """
    POST /api/maps/<map_id>/spawn_enemies
    Body JSON: { "type": "<enemy-name>" }
    """
    data = request.get_json() or {}
    enemy_type = data.get('name')
    if not enemy_type:
        return jsonify({"error": "Missing 'type' in request body"}), 400

    # 1. Find the spawn tile for this map
    spawn_tile = Tile.query.filter_by(map_id=map_id, is_spawn=True).first()
    if not spawn_tile:
        return jsonify({"error": f"No spawn tile found for map {map_id}"}), 404

    # 2. Find the prototype enemy (seeded with tile_id=None)
    proto = Enemy.query.filter_by(name=enemy_type, tile_id=None).first()
    if not proto:
        return jsonify({"error": f"Enemy type '{enemy_type}' not found"}), 404

    # 3. Create a new Enemy instance at the spawn tile
    new_enemy = Enemy(
        name        = proto.name,
        damage      = proto.damage,
        health      = proto.health,
        speed       = proto.speed,
        tile_id     = spawn_tile.id
    )

    db.session.add(new_enemy)
    db.session.commit()

    return jsonify(new_enemy.to_dict()), 201