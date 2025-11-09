from app import create_app, db
from app.models import User, Equipment, BorrowRequest
from datetime import datetime, timedelta

def seed_database():
    app = create_app()
    with app.app_context():
        # Clear existing data
        BorrowRequest.query.delete()
        Equipment.query.delete()
        User.query.delete()
        db.session.commit()

        print("Creating users...")
        # Create sample users
        users = {
            'student': User(username='student', email='student@school.com', role='student'),
            'staff': User(username='staff', email='staff@school.com', role='staff'),
            'admin': User(username='admin', email='admin@school.com', role='admin')
        }
        
        # Set simple passwords
        users['student'].set_password('student')
        users['staff'].set_password('staff')
        users['admin'].set_password('admin')
        
        for user in users.values():
            db.session.add(user)

        # Create sample equipment
        print("Creating equipment...")
        equipment_data = [
            {
                'name': 'Basketball',
                'category': 'sports',
                'condition': 'good',
                'quantity': 10,
                'available_quantity': 7
            },
            {
                'name': 'Microscope',
                'category': 'lab',
                'condition': 'excellent',
                'quantity': 5,
                'available_quantity': 3
            },
            {
                'name': 'DSLR Camera',
                'category': 'camera',
                'condition': 'good',
                'quantity': 3,
                'available_quantity': 2
            },
            {
                'name': 'Violin',
                'category': 'music',
                'condition': 'excellent',
                'quantity': 4,
                'available_quantity': 4
            },
            {
                'name': 'Chemistry Kit',
                'category': 'lab',
                'condition': 'fair',
                'quantity': 6,
                'available_quantity': 5
            },
            {
                'name': 'Soccer Ball',
                'category': 'sports',
                'condition': 'good',
                'quantity': 8,
                'available_quantity': 6
            },
            {
                'name': 'Guitar',
                'category': 'music',
                'condition': 'good',
                'quantity': 5,
                'available_quantity': 3
            },
            {
                'name': 'Video Camera',
                'category': 'camera',
                'condition': 'excellent',
                'quantity': 2,
                'available_quantity': 1
            }
        ]

        equipment_objects = {}
        for item in equipment_data:
            equipment = Equipment(**item)
            equipment_objects[item['name']] = equipment
            db.session.add(equipment)

        # Create sample borrowing requests
        print("Creating borrowing requests...")
        current_time = datetime.utcnow()
        
        # Pending requests
        borrow_request1 = BorrowRequest(
            user=users['student'],
            equipment=equipment_objects['Basketball'],
            quantity=1,
            status='pending',
            borrow_date=current_time + timedelta(days=1),
            return_date=current_time + timedelta(days=3)
        )

        # Approved requests
        borrow_request2 = BorrowRequest(
            user=users['student'],
            equipment=equipment_objects['Microscope'],
            quantity=1,
            status='approved',
            borrow_date=current_time - timedelta(days=2),
            return_date=current_time + timedelta(days=5)
        )

        # Returned requests
        borrow_request3 = BorrowRequest(
            user=users['student'],
            equipment=equipment_objects['Guitar'],
            quantity=2,
            status='returned',
            borrow_date=current_time - timedelta(days=10),
            return_date=current_time - timedelta(days=5),
            actual_return_date=current_time - timedelta(days=6)
        )

        # Rejected requests
        borrow_request4 = BorrowRequest(
            user=users['student'],
            equipment=equipment_objects['DSLR Camera'],
            quantity=1,
            status='rejected',
            borrow_date=current_time - timedelta(days=1),
            return_date=current_time + timedelta(days=2)
        )

        db.session.add(borrow_request1)
        db.session.add(borrow_request2)
        db.session.add(borrow_request3)
        db.session.add(borrow_request4)

        # Commit all changes
        db.session.commit()
        print("Sample data has been created successfully!")
        
        # Print login credentials
        print("\nYou can log in with the following credentials:")
        print("Student: username='student', password='student'")
        print("Staff: username='staff', password='staff'")
        print("Admin: username='admin', password='admin'")

if __name__ == '__main__':
    seed_database()