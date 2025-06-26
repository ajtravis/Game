from flask import Blueprint, jsonify, request
from app.models import Enemy, Map

enemy_routes = Blueprint('enemies', __name__)



@enemy_routes.route('/all')
def get_enemies():
    enemies = Enemy.query.all()
    # return {'enemies': [enemy.to_dict() for enemy in enemies]}
    return [enemy.to_dict() for enemy in enemies]

# update an enemy tile
@enemy_routes.route('/<int:id>', methods=['PUT'])
def spawn(id):
    enemy = Enemy.query.get(id)
  
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401