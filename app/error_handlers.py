from flask import jsonify, request
from werkzeug.exceptions import HTTPException
import logging
import traceback

def register_error_handlers(app):
    """Register error handlers for the Flask application"""
    
    @app.errorhandler(400)
    def bad_request(error):
        """Handle 400 Bad Request errors"""
        return jsonify({
            'error': 'Bad Request',
            'message': 'The request was invalid or malformed',
            'status_code': 400
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):
        """Handle 401 Unauthorized errors"""
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication required',
            'status_code': 401
        }), 401

    @app.errorhandler(403)
    def forbidden(error):
        """Handle 403 Forbidden errors"""
        return jsonify({
            'error': 'Forbidden',
            'message': 'Access denied',
            'status_code': 403
        }), 403

    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 Not Found errors"""
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found',
            'status_code': 404
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        """Handle 405 Method Not Allowed errors"""
        return jsonify({
            'error': 'Method Not Allowed',
            'message': f'The {request.method} method is not allowed for this endpoint',
            'status_code': 405
        }), 405

    @app.errorhandler(422)
    def unprocessable_entity(error):
        """Handle 422 Unprocessable Entity errors"""
        return jsonify({
            'error': 'Unprocessable Entity',
            'message': 'The request was well-formed but contains semantic errors',
            'status_code': 422
        }), 422

    @app.errorhandler(500)
    def internal_server_error(error):
        """Handle 500 Internal Server Error"""
        app.logger.error(f'Server Error: {error}')
        app.logger.error(traceback.format_exc())
        
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred on the server',
            'status_code': 500
        }), 500

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        """Handle any unexpected errors"""
        app.logger.error(f'Unexpected error: {error}')
        app.logger.error(traceback.format_exc())
        
        # If it's an HTTP exception, let it be handled by its specific handler
        if isinstance(error, HTTPException):
            return error
        
        return jsonify({
            'error': 'Unexpected Error',
            'message': 'An unexpected error occurred',
            'status_code': 500
        }), 500

def create_error_response(message, status_code=400, error_type=None):
    """Helper function to create consistent error responses"""
    response = {
        'error': error_type or 'Error',
        'message': message,
        'status_code': status_code
    }
    return jsonify(response), status_code

def validate_json_data(required_fields=None):
    """Decorator to validate JSON data in requests"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return create_error_response(
                    'Content-Type must be application/json',
                    400,
                    'Invalid Content Type'
                )
            
            data = request.get_json()
            if data is None:
                return create_error_response(
                    'Invalid JSON data',
                    400,
                    'Invalid JSON'
                )
            
            if required_fields:
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    return create_error_response(
                        f'Missing required fields: {", ".join(missing_fields)}',
                        400,
                        'Missing Fields'
                    )
            
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator
