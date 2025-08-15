from flask import Blueprint, jsonify, request
from app.models import Enemy, Map
from app.error_handlers import create_error_response
import logging

enemy_routes = Blueprint('enemies', __name__)

@enemy_routes.route('/prototypes')
def get_enemies():
    """Get all enemy prototypes"""
    try:
        enemies = Enemy.query.all()
        if not enemies:
            return create_error_response('No enemy prototypes found', 404, 'Not Found')
        
        return {enemy.name: enemy.to_dict() for enemy in enemies}
    
    except Exception as e:
        logging.error(f'Error fetching enemy prototypes: {str(e)}')
        return create_error_response(
            'Failed to fetch enemy prototypes', 
            500, 
            'Database Error'
        )

@enemy_routes.route('/<int:id>', methods=['PUT'])
def update_enemy(id):
    """Update an enemy's position or properties"""
    try:
        enemy = Enemy.query.get(id)
        if not enemy:
            return create_error_response(f'Enemy with id {id} not found', 404, 'Not Found')
        
        data = request.get_json()
        if not data:
            return create_error_response('No data provided', 400, 'Bad Request')
        
        # Update enemy properties if provided
        if 'tile_id' in data:
            if not isinstance(data['tile_id'], int) or data['tile_id'] < 0:
                return create_error_response('Invalid tile_id', 400, 'Validation Error')
            enemy.tile_id = data['tile_id']
        
        if 'health' in data:
            if not isinstance(data['health'], (int, float)) or data['health'] < 0:
                return create_error_response('Invalid health value', 400, 'Validation Error')
            enemy.health = data['health']
        
        # Add more field validations as needed
        
        return enemy.to_dict()
    
    except Exception as e:
        logging.error(f'Error updating enemy {id}: {str(e)}')
        return create_error_response(
            'Failed to update enemy', 
            500, 
            'Database Error'
        )

