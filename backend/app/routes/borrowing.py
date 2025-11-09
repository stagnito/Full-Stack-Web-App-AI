from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models import BorrowRequest, Equipment, User
from app import db

bp = Blueprint('borrowing', __name__)

@bp.route('/api/borrow-requests', methods=['POST'])
def create_borrow_request():
    data = request.get_json()
    
    equipment = Equipment.query.get_or_404(data['equipment_id'])
    
    if equipment.available_quantity < data['quantity']:
        return jsonify({'error': 'Not enough items available'}), 400
    
    # Check for overlapping bookings
    existing_request = BorrowRequest.query.filter(
        BorrowRequest.equipment_id == data['equipment_id'],
        BorrowRequest.status.in_(['approved', 'pending']),
        BorrowRequest.return_date >= datetime.fromisoformat(data['borrow_date']),
        BorrowRequest.borrow_date <= datetime.fromisoformat(data['return_date'])
    ).first()
    
    if existing_request:
        return jsonify({'error': 'Equipment already booked for this period'}), 400
    
    borrow_request = BorrowRequest(
        user_id=1,  # Default to user ID 1
        equipment_id=data['equipment_id'],
        quantity=data['quantity'],
        borrow_date=datetime.fromisoformat(data['borrow_date']),
        return_date=datetime.fromisoformat(data['return_date'])
    )
    
    db.session.add(borrow_request)
    db.session.commit()
    
    return jsonify({'message': 'Borrow request created successfully'}), 201

@bp.route('/api/borrow-requests/<int:id>/status', methods=['PUT'])
def update_request_status(id):
    # Assume admin role for all requests
    user = User.query.filter_by(role='admin').first()
    
    borrow_request = BorrowRequest.query.get_or_404(id)
    data = request.get_json()
    new_status = data['status']
    
    if new_status not in ['approved', 'rejected', 'returned']:
        return jsonify({'error': 'Invalid status'}), 400
    
    if new_status == 'approved' and borrow_request.status == 'pending':
        equipment = borrow_request.equipment
        if equipment.available_quantity < borrow_request.quantity:
            return jsonify({'error': 'Not enough items available'}), 400
        equipment.available_quantity -= borrow_request.quantity
    
    elif new_status == 'returned' and borrow_request.status == 'approved':
        equipment = borrow_request.equipment
        equipment.available_quantity += borrow_request.quantity
        borrow_request.actual_return_date = datetime.utcnow()
    
    borrow_request.status = new_status
    db.session.commit()
    
    return jsonify({'message': 'Request status updated successfully'}), 200

@bp.route('/api/borrow-requests', methods=['GET'])
def get_borrow_requests():
    # Show all requests to everyone
    requests = BorrowRequest.query.all()
    
    return jsonify([{
        'id': r.id,
        'user_id': r.user_id,
        'equipment_id': r.equipment_id,
        'equipment_name': r.equipment.name,
        'status': r.status,
        'quantity': r.quantity,
        'borrow_date': r.borrow_date.isoformat(),
        'return_date': r.return_date.isoformat(),
        'actual_return_date': r.actual_return_date.isoformat() if r.actual_return_date else None
    } for r in requests]), 200