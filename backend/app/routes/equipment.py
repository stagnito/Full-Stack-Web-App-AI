from flask import Blueprint, request, jsonify
from app.models import Equipment
from app import db

bp = Blueprint('equipment', __name__)

@bp.route('/api/equipment', methods=['GET'])
def get_equipment_list():
    category = request.args.get('category')
    query = Equipment.query
    
    if category:
        query = query.filter_by(category=category)
    
    equipment_list = query.all()
    return jsonify([{
        'id': e.id,
        'name': e.name,
        'category': e.category,
        'condition': e.condition,
        'quantity': e.quantity,
        'available_quantity': e.available_quantity
    } for e in equipment_list]), 200

@bp.route('/api/equipment/<int:id>', methods=['GET'])
def get_equipment(id):
    equipment = Equipment.query.get_or_404(id)
    return jsonify({
        'id': equipment.id,
        'name': equipment.name,
        'category': equipment.category,
        'condition': equipment.condition,
        'quantity': equipment.quantity,
        'available_quantity': equipment.available_quantity
    }), 200

@bp.route('/api/equipment', methods=['POST'])
def add_equipment():
    data = request.get_json()
    
    equipment = Equipment(
        name=data['name'],
        category=data['category'],
        condition=data['condition'],
        quantity=data['quantity'],
        available_quantity=data['quantity']
    )
    
    db.session.add(equipment)
    db.session.commit()
    
    return jsonify({
        'id': equipment.id,
        'message': 'Equipment added successfully'
    }), 201

@bp.route('/api/equipment/<int:id>', methods=['PUT'])
def update_equipment(id):
    equipment = Equipment.query.get_or_404(id)
    data = request.get_json()
    
    equipment.name = data.get('name', equipment.name)
    equipment.category = data.get('category', equipment.category)
    equipment.condition = data.get('condition', equipment.condition)
    equipment.quantity = data.get('quantity', equipment.quantity)
    equipment.available_quantity = data.get('available_quantity', equipment.available_quantity)
    
    db.session.commit()
    
    return jsonify({'message': 'Equipment updated successfully'}), 200

@bp.route('/api/equipment/<int:id>', methods=['DELETE'])
def delete_equipment(id):
    equipment = Equipment.query.get_or_404(id)
    db.session.delete(equipment)
    db.session.commit()
    
    return jsonify({'message': 'Equipment deleted successfully'}), 200