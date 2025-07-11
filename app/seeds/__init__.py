from flask.cli import AppGroup
from .users import seed_users, undo_users
from .maps import seed_maps, undo_maps
from .tiles import seed_tiles, undo_tiles
from .towers import seed_towers, undo_towers
from .enemies import seed_enemies, undo_enemies

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
    seed_users()
    seed_maps()
    seed_tiles()
    seed_towers()
    seed_enemies()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo(): 
    undo_tiles()
    undo_maps()
    undo_towers()
    undo_enemies()
    undo_users()
   
    # Add other undo functions here