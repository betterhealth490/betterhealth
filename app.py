from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from sqlalchemy import Column, Integer, Text, DateTime, Boolean, String, Float, ForeignKey
from sqlalchemy.sql import func
from dotenv import load_dotenv
from datetime import datetime, timedelta


# Initialize Flask app
app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": ["https://betterhealth.vercel.app"]}})

load_dotenv()

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("POSTGRES_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Models
class User(db.Model):
    __tablename__ = "betterhealth_user"
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

class Therapist(db.Model):
    __tablename__ = "betterhealth_therapist"
    therapist_id = Column(Integer, ForeignKey("betterhealth_user.user_id"), primary_key=True)
    specialty = Column(String(100), nullable=False)  # Example: "Trauma Therapy"
    license_number = Column(String(12), unique=True, nullable=True)
    accepting = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

class Patient(db.Model):
    __tablename__ = "betterhealth_patient"
    patient_id = Column(Integer, ForeignKey("betterhealth_user.user_id"), primary_key=True)
    age_preference = Column(String(20), nullable=True)  # Example: "25-34"
    gender_preference = Column(String(20), nullable=True)  # Example: "Female"
    specialty_preference = Column(String(100), nullable=True)  # Example: "Trauma Therapy"
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

class TherapistPatient(db.Model):
    __tablename__ = "betterhealth_relationship"

    relationship_id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("betterhealth_user.user_id"), nullable=False)  # Correct table name
    therapist_id = Column(Integer, ForeignKey("betterhealth_user.user_id"), nullable=False)  # Correct table name
    status = Column(String, default="pending", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

class Billing(db.Model):
    __tablename__ = "betterhealth_billing"
    bill_id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("betterhealth_patient.patient_id"), nullable=False)
    therapist_id = Column(Integer, ForeignKey("betterhealth_therapist.therapist_id"), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(DateTime, nullable=False)
    status = Column(String, default="pending", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class Messages(db.Model):
    __tablename__ = "betterhealth_message"
    message_id = Column(Integer, primary_key=True, autoincrement=True)
    sender_id = Column(Integer, ForeignKey("betterhealth_user.user_id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("betterhealth_user.user_id"), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    sent_at = Column(DateTime, default=func.now(), nullable=False)

class Journal(db.Model):
    __tablename__ = "betterhealth_journal"
    journal_id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("betterhealth_patient.patient_id"), nullable=False)
    title = Column(String(255), nullable=False)  # New title column
    entry_date = Column(DateTime, default=func.now(), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class TherapistComments(db.Model):
    __tablename__ = "betterhealth_therapist_comment"
    comment_id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("betterhealth_patient.patient_id"), nullable=False)
    therapist_id = Column(Integer, ForeignKey("betterhealth_therapist.therapist_id"), nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

class Appointment(db.Model):
    __tablename__ = "betterhealth_appointment"
    
    appointment_id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("betterhealth_user.user_id"), nullable=False)
    therapist_id = Column(Integer, ForeignKey("betterhealth_user.user_id"), nullable=False)
    date = Column(DateTime, nullable=False)
    time = Column(String(10), nullable=False)  # Format: "HH:MM AM/PM"
    duration = Column(Integer, default=30, nullable=False)  # Duration in minutes
    notes = Column(Text, nullable=True)
    status = Column(String, default="pending", nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

class Availability(db.Model):
    __tablename__ = "availability"
    availability_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    therapist_id = db.Column(db.Integer, db.ForeignKey("therapists.therapist_id"), nullable=False)
    day = db.Column(db.Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


# APIs
@app.route("/users", methods=["GET"])
def get_users():
    """
    Retrieve all users.
    """
    users = User.query.all()
    if not users:
        return jsonify({"message": "No users found."}), 404

    return jsonify([
        {
            "user_id": user.user_id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "age": user.age,
            "gender": user.gender,
            "role": user.role,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
        for user in users
    ]), 200


@app.route("/therapists", methods=["GET"])
def get_therapists():
    """Retrieve all therapists by joining User and Therapist tables."""
    try:
        # Join User and Therapist tables to get combined data for therapists
        therapists = db.session.query(User, Therapist).filter(
            User.user_id == Therapist.therapist_id
        ).all()

        if not therapists:
            return jsonify({"message": "No therapists found."}), 404

        return jsonify([
            {
                "user_id": therapist.User.user_id,  # Retrieve user_id instead of therapist_id
                "first_name": therapist.User.first_name,
                "last_name": therapist.User.last_name,
                "email": therapist.User.email,
                "specialty": therapist.Therapist.specialty,
                "license_number": therapist.Therapist.license_number,
                "accepting": therapist.Therapist.accepting,
                "created_at": therapist.Therapist.created_at.isoformat(),
                "updated_at": therapist.Therapist.updated_at.isoformat(),
            }
            for therapist in therapists
        ]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route("/therapists/<int:therapist_id>/patients", methods=["GET"])
def get_patients_for_therapist(therapist_id):
    """
    Retrieve all patients assigned to a specific therapist.
    """
    try:
        # Query to find all patients associated with the given therapist ID
        patients = db.session.query(User, Patient, TherapistPatient).join(
            Patient, User.user_id == Patient.patientId
        ).join(
            TherapistPatient, Patient.patientId == TherapistPatient.patient_id
        ).filter(
            TherapistPatient.therapist_id == therapist_id,
            TherapistPatient.status == "approved"  # Only approved relationships
        ).all()

        if not patients:
            return jsonify({"message": "No patients found for this therapist."}), 404

        # Format the response
        result = [
            {
                "patient_id": patient.Patient.patientId,
                "first_name": patient.User.first_name,
                "last_name": patient.User.last_name,
                "email": patient.User.email,
                "age_preference": patient.Patient.agePreference,
                "gender_preference": patient.Patient.genderPreference,
                "specialty_preference": patient.Patient.specialtyPreference,
                "relationship_status": patient.TherapistPatient.status,
            }
            for patient in patients
        ]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/chat/<int:sender_id>/<int:recipient_id>", methods=["GET"])
def fetch_messages(sender_id, recipient_id):
    try:
        messages = Messages.query.filter(
            ((Messages.sender_id == sender_id) & (Messages.recipient_id == recipient_id)) |
            ((Messages.sender_id == recipient_id) & (Messages.recipient_id == sender_id))
        ).order_by(Messages.sent_at.asc()).all()

        result = [
            {
                "message_id": msg.message_id,
                "sender_id": msg.sender_id,
                "recipient_id": msg.recipient_id,
                "content": msg.content,
                "is_read": msg.is_read,
                "sent_at": msg.sent_at,
            }
            for msg in messages
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chat/send", methods=["POST"])
def send_message():
    try:
        data = request.get_json()
        sender_id = data.get("sender_id")
        recipient_id = data.get("recipient_id")
        content = data.get("content")

        if not sender_id or not recipient_id or not content:
            return jsonify({"error": "Missing required fields."}), 400

        new_message = Messages(
            sender_id=sender_id,
            recipient_id=recipient_id,
            content=content
        )
        db.session.add(new_message)
        db.session.commit()

        return jsonify({"message": "Message sent successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chat/read/<int:recipient_id>", methods=["PATCH"])
def mark_messages_as_read(recipient_id):
    try:
        updated_count = Messages.query.filter(
            (Messages.recipient_id == recipient_id) & (Messages.is_read == False)
        ).update({"is_read": True})
        db.session.commit()
        return jsonify({"message": f"{updated_count} messages marked as read."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/journals", methods=["POST"])
def add_journal():
    """Add a new journal entry with title and content."""
    data = request.json
    patient_id = data.get("patient_id")
    title = data.get("title")
    content = data.get("content")

    # Validate required fields
    if not patient_id or not title or not content:
        return jsonify({"message": "patient_id, title, and content are required."}), 400

    try:
        # Create a new journal entry
        new_journal = Journal(
            patient_id=patient_id,
            title=title,
            content=content,
            entry_date=datetime.utcnow()
        )
        db.session.add(new_journal)
        db.session.commit()

        return jsonify({
            "message": "Journal added successfully.",
            "journal_id": new_journal.journal_id
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/journals/<int:patient_id>", methods=["GET"])
def get_journals(patient_id):
    """Retrieve all journal entries for a specific patient."""
    try:
        # Query all journal entries for the patient
        journals = Journal.query.filter_by(patient_id=patient_id).order_by(Journal.entry_date.desc()).all()

        if not journals:
            return jsonify({"message": "No journals found for this patient."}), 404

        # Format response
        return jsonify([
            {
                "journal_id": journal.journal_id,
                "patient_id": journal.patient_id,
                "title": journal.title,
                "entry_date": journal.entry_date.isoformat(),
                "content": journal.content
            }
            for journal in journals
        ]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/billing/therapist/<int:therapist_id>", methods=["GET"])
def get_therapist_bills(therapist_id):
    """
    Retrieve all bills for patients assigned to a specific therapist with a 'pending' relationship.
    """
    try:
        # Fetch all patient IDs for the therapist
        patient_ids = db.session.query(TherapistPatient.patient_id).filter_by(
            therapist_id=therapist_id, status="pending"
        ).all()

        patient_ids = [p.patient_id for p in patient_ids]

        # Fetch all bills for those patients, including patient names
        bills = (
            db.session.query(
                Billing.bill_id,
                Billing.amount,
                Billing.due_date,
                Billing.status,
                User.first_name,
                User.last_name
            )
            .join(Patient, Billing.patient_id == Patient.patient_id)
            .join(User, Patient.patient_id == User.user_id)
            .filter(Billing.patient_id.in_(patient_ids))
            .all()
        )

        result = [
            {
                "bill_id": bill.bill_id,
                "amount": float(bill.amount),
                "due_date": bill.due_date.strftime("%Y-%m-%d"),
                "status": bill.status,
                "first_name": bill.first_name,
                "last_name": bill.last_name,
            }
            for bill in bills
        ]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@app.route("/billing", methods=["POST"])
def create_bill():
    data = request.json
    patient_id = data.get("patient_id")
    therapist_id = data.get("therapist_id")
    amount = data.get("amount")
    due_date = data.get("due_date")

    if not patient_id or not therapist_id or not amount or not due_date:
        return jsonify({"message": "patient_id, therapist_id, amount, and due_date are required"}), 400

    new_bill = Billing(
        patient_id=patient_id,
        therapist_id=therapist_id,
        amount=amount,
        due_date=datetime.fromisoformat(due_date),
    )
    db.session.add(new_bill)
    db.session.commit()

    return jsonify({"message": "Bill created successfully", "bill_id": new_bill.bill_id}), 201

@app.route("/therapist_patient_bills/<int:therapist_id>", methods=["GET"])
def get_therapist_patient_bills(therapist_id):
    try:
        # Get patients related to the therapist with "accepted" status
        relationships = TherapistPatient.query.filter_by(
            therapist_id=therapist_id, status="approved"
        ).all()

        # Extract patient IDs
        patient_ids = [relationship.patient_id for relationship in relationships]

        # Fetch bills for these patients
        bills = Billing.query.filter(Billing.patient_id.in_(patient_ids)).all()

        # Format response
        result = [
            {
                "bill_id": bill.bill_id,
                "patient_id": bill.patient_id,
                "therapist_id": bill.therapist_id,
                "amount": float(bill.amount),
                "due_date": bill.due_date.strftime("%Y-%m-%d"),
                "status": bill.status,
            }
            for bill in bills
        ]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/billing/<int:patient_id>", methods=["GET"])
def get_bills(patient_id):
    bills = db.session.query(
        Billing, User.first_name, User.last_name
    ).join(
        Therapist, Billing.therapist_id == Therapist.therapist_id
    ).join(
        User, Therapist.therapist_id == User.user_id
    ).filter(
        Billing.patient_id == patient_id
    ).all()

    if not bills:
        return jsonify({"message": "No bills found"}), 404

    return jsonify(
        [
            {
                "bill_id": bill.Billing.bill_id,
                "patient_id": bill.Billing.patient_id,
                "therapist_id": bill.Billing.therapist_id,
                "therapist_name": f"{bill.first_name} {bill.last_name}",
                "amount": float(bill.Billing.amount),
                "due_date": bill.Billing.due_date.strftime("%Y-%m-%d"),
                "status": bill.Billing.status,
                "created_at": bill.Billing.created_at.isoformat(),
                "updated_at": bill.Billing.updated_at.isoformat(),
            }
            for bill in bills
        ]
    ), 200


@app.route("/billing/pay", methods=["POST"])
def pay_bill():
    data = request.json
    bill_id = data.get("bill_id")

    if not bill_id:
        return jsonify({"message": "bill_id is required"}), 400

    bill = Billing.query.get(bill_id)
    if not bill:
        return jsonify({"message": "Bill not found"}), 404

    if bill.status == "paid":
        return jsonify({"message": "Bill is already paid"}), 400

    bill.status = "paid"
    db.session.commit()

    return jsonify({"message": "Bill paid successfully"}), 200





@app.route("/therapist_patient/<int:patient_id>", methods=["GET"])
def get_selected_therapist(patient_id):
    """
    Retrieve the currently selected therapist for a given patient.
    """
    try:
        # Query the therapist-patient relationship
        relationship = (
            db.session.query(TherapistPatient, User)
            .join(User, TherapistPatient.therapist_id == User.user_id)
            .filter(TherapistPatient.patient_id == patient_id, TherapistPatient.status == 'pending')
            .first()
        )

        if not relationship:
            return jsonify({"message": "No therapist selected"}), 404

        therapist, user_details = relationship

        return jsonify({
            "therapist_id": therapist.therapist_id,
            "first_name": user_details.first_name,
            "last_name": user_details.last_name
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/therapist_patient_list/<int:therapist_id>", methods=["GET"])
def get_therapist_patients(therapist_id):
    """
    Fetch all patients assigned to a therapist with a 'pending' status.
    """
    try:
        pending_patients = (
            db.session.query(User.first_name, User.last_name, TherapistPatient.patient_id)
            .join(TherapistPatient, User.user_id == TherapistPatient.patient_id)
            .filter(
                TherapistPatient.therapist_id == therapist_id,
                TherapistPatient.status == "pending"
            )
            .all()
        )

        result = [
            {
                "first_name": patient.first_name,
                "last_name": patient.last_name,
                "patient_id": patient.patient_id
            }
            for patient in pending_patients
        ]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/therapist_patient_relationship", methods=["POST"])
def update_therapist_patient_relationship():
    """
    Update therapist-patient relationship. Decline previous relationships and create a new one.
    """
    try:
        data = request.json
        patient_id = data.get("patient_id")
        therapist_id = data.get("therapist_id")

        if not patient_id or not therapist_id:
            return jsonify({"error": "Patient ID and Therapist ID are required"}), 400

        # Validate patient_id and therapist_id exist in the database
        patient = Patient.query.filter_by(patient_id=patient_id).first()
        therapist = Therapist.query.filter_by(therapist_id=therapist_id).first()

        if not patient:
            return jsonify({"error": f"Patient ID {patient_id} does not exist in the database."}), 400
        if not therapist:
            return jsonify({"error": f"Therapist ID {therapist_id} does not exist in the database."}), 400

        # Update the status of the previous relationships
        db.session.query(TherapistPatient).filter(
            TherapistPatient.patient_id == patient_id,
            TherapistPatient.status == "pending"
        ).update({"status": "declined"})

        # Create a new therapist-patient relationship
        new_relationship = TherapistPatient(
            patient_id=patient_id,
            therapist_id=therapist_id,
            status="pending"
        )
        db.session.add(new_relationship)
        db.session.commit()

        return jsonify({"message": "Therapist updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@app.route("/comments/<int:therapist_id>/<int:patient_id>", methods=["GET"])
def get_comments(therapist_id, patient_id):
    try:
        comments = TherapistComments.query.filter_by(therapist_id=therapist_id, patient_id=patient_id).all()
        result = [
            {
                "comment_id": comment.comment_id,
                "therapist_id": comment.therapist_id,
                "patient_id": comment.patient_id,
                "comment": comment.comment,
                "created_at": comment.created_at
            }
            for comment in comments
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/comments", methods=["POST"])
def add_comment():
    try:
        data = request.json
        therapist_id = data.get("therapist_id")
        patient_id = data.get("patient_id")
        comment = data.get("comment")

        if not therapist_id or not patient_id or not comment:
            return jsonify({"error": "Missing required fields."}), 400

        new_comment = TherapistComments(
            therapist_id=therapist_id,
            patient_id=patient_id,
            comment=comment
        )
        db.session.add(new_comment)
        db.session.commit()

        return jsonify({"message": "Comment added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/therapist/toggle-verified/<int:therapist_id>", methods=["PATCH"])
def toggle_verified(therapist_id):
    try:
        therapist = User.query.filter_by(user_id=therapist_id, role="therapist").first()
        if not therapist:
            return jsonify({"error": "Therapist not found"}), 404

        therapist.is_verified = not therapist.is_verified
        db.session.commit()

        return jsonify({"message": "Verification status updated", "is_verified": therapist.is_verified}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@app.route("/appointments", methods=["POST"])
def create_appointment():
    data = request.json
    patient_id = data.get("patient_id")
    therapist_id = data.get("therapist_id")
    appointment_date = data.get("appointment_date")
    appointment_time = data.get("appointment_time")
    notes = data.get("notes")

    if not (patient_id and therapist_id and appointment_date and appointment_time):
        return jsonify({"message": "All fields are required"}), 400

    parsed_date = datetime.fromisoformat(appointment_date).date()
    parsed_time = datetime.strptime(appointment_time, "%H:%M").time()

    # Ensure the appointment doesn't overlap
    existing_appointment = db.session.query(Appointment).filter_by(
        therapist_id=therapist_id,
        appointmentDate=datetime.combine(parsed_date, parsed_time)
    ).first()

    if existing_appointment:
        return jsonify({"message": "This time slot is already booked"}), 400

    new_appointment = Appointment(
        patientId=patient_id,
        therapistId=therapist_id,
        appointmentDate=datetime.combine(parsed_date, parsed_time),
        notes=notes
    )
    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({"message": "Appointment created successfully"}), 201

@app.route("/appointments/therapist/<int:therapist_id>", methods=["GET"])
def get_therapist_appointments(therapist_id):
    appointments = Appointment.query.filter_by(therapist_id=therapist_id).all()
    result = [
        {
            "appointment_id": appt.appointment_id,
            "patient_id": appt.patient_id,
            "date": appt.date.strftime("%Y-%m-%d"),
            "time": appt.time,
            "duration": appt.duration,
            "notes": appt.notes,
            "status": appt.status,
        }
        for appt in appointments
    ]
    return jsonify(result), 200

@app.route("/appointments/patient/<int:patient_id>", methods=["GET"])
def get_patient_appointments(patient_id):
    appointments = Appointment.query.filter_by(patient_id=patient_id).all()
    result = [
        {
            "appointment_id": appt.appointment_id,
            "therapist_id": appt.therapist_id,
            "date": appt.date.strftime("%Y-%m-%d"),
            "time": appt.time,
            "duration": appt.duration,
            "notes": appt.notes,
            "status": appt.status,
        }
        for appt in appointments
    ]
    return jsonify(result), 200

@app.route("/appointments/<int:appointment_id>/confirm", methods=["PATCH"])
def confirm_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404

    if appointment.status == "confirmed":
        return jsonify({"message": "Appointment is already confirmed"}), 400

    appointment.status = "confirmed"
    db.session.commit()
    return jsonify({"message": "Appointment confirmed successfully"}), 200


@app.route("/therapists/<int:therapist_id>/availability", methods=["GET"])
def get_therapist_availability(therapist_id):
    date = request.args.get("date")
    if not date:
        return jsonify({"message": "Date is required"}), 400

    try:
        # Parse the date and get the day of the week
        parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
        day_of_week = parsed_date.weekday()  # Monday=0, Sunday=6

        # Get therapist's availability for the selected day of the week
        availability = db.session.query(Availability).filter_by(
            therapist_id=therapist_id, day=day_of_week
        ).all()

        if not availability:
            return jsonify([]), 200

        # Get the booked appointments for the therapist on the selected date
        booked_appointments = db.session.query(Appointment).filter_by(
            therapist_id=therapist_id,
            appointment_date=parsed_date,
        ).all()

        # Convert booked appointment times into a set for faster lookups
        booked_times = set(
            datetime.combine(parsed_date, appointment.start_time).strftime("%H:%M")
            for appointment in booked_appointments
        )

        # Generate available time slots excluding booked times
        time_slots = []
        for slot in availability:
            start_time = datetime.combine(parsed_date, slot.start_time)
            end_time = datetime.combine(parsed_date, slot.end_time)
            current_time = start_time
            while current_time < end_time:
                time_str = current_time.strftime("%H:%M")
                if time_str not in booked_times:  # Only include free slots
                    time_slots.append(time_str)
                current_time += timedelta(minutes=30)

        return jsonify(time_slots), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("FLASK_RUN_PORT", 8000)))
