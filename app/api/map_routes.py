from flask import Blueprint, jsonify, request
from app.models import Tile, Map, Enemy, db
from app.error_handlers import create_error_response, validate_json_data
import logging

map_routes = Blueprint('maps', __name__)

@map_routes.route('/<int:id>')
def get_map(id):
    """Get map data by ID"""
    try:
        if id < 1:
            return create_error_response('Invalid map ID', 400, 'Validation Error')
        
        map = Map.query.get(id)
        if not map:
            return create_error_response(f'Map with id {id} not found', 404, 'Not Found')
        
        return map.to_dict()
    
    except Exception as e:
        logging.error(f'Error fetching map {id}: {str(e)}')
        return create_error_response(
            'Failed to fetch map data', 
            500, 
            'Database Error'
        )

@map_routes.route('/<int:map_id>/spawn_enemy', methods=['POST'])
@validate_json_data(['name'])
def spawn_enemy(map_id):
    """
    POST /api/maps/<map_id>/spawn_enemy
    Body JSON: { "name": "<enemy-type>" }
    """
    try:
        if map_id < 1:
            return create_error_response('Invalid map ID', 400, 'Validation Error')
        
        data = request.get_json()
        enemy_type = data.get('name')
        
        if not enemy_type or not isinstance(enemy_type, str):
            return create_error_response('Invalid enemy type', 400, 'Validation Error')

        # 1. Verify map exists
        map_obj = Map.query.get(map_id)
        if not map_obj:
            return create_error_response(f'Map {map_id} not found', 404, 'Not Found')

        # 2. Find the spawn tile for this map
        spawn_tile = Tile.query.filter_by(map_id=map_id, is_spawn=True).first()
        if not spawn_tile:
            return create_error_response(
                f'No spawn tile found for map {map_id}', 
                404, 
                'Configuration Error'
            )

        # 3. Find the prototype enemy (seeded with tile_id=None)
        proto = Enemy.query.filter_by(name=enemy_type, tile_id=None).first()
        if not proto:
            return create_error_response(
                f'Enemy type "{enemy_type}" not found', 
                404, 
                'Not Found'
            )

        # 4. Create a new Enemy instance at the spawn tile
        new_enemy = Enemy(
            name=proto.name,
            damage=proto.damage,
            health=proto.health,
            speed=proto.speed,
            tile_id=spawn_tile.id
        )

        db.session.add(new_enemy)
        db.session.commit()

        return jsonify(new_enemy.to_dict()), 201
    
    except Exception as e:
        logging.error(f'Error spawning enemy on map {map_id}: {str(e)}')
        db.session.rollback()
        return create_error_response(
            'Failed to spawn enemy', 
            500, 
            'Database Error'
        )