from flask import Blueprint, jsonify, request
from app.models import Enemy

enemy_routes = Blueprint('enemies', __name__)



@enemy_routes.route('/all')
def get_enemies():
    enemies = Enemy.query.all()
     return {'enemies': [enemy.to_dict() for enemy in enemies]}