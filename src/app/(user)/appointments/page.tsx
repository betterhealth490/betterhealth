'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { PageWrapper } from '~/app/(user)/page-wrapper';
import { AppointmentCalendar } from '~/app/(user)/appointments/appointment-calendar';

const AppointmentsPage: React.FC = () => {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [therapists, setTherapists] = useState<any[]>([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const patientId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);

  useEffect(() => {
    if (!user?.unsafeMetadata?.databaseId) return;
    const patientId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);

    // Fetch only the therapist associated with the patient
    const fetchTherapistForPatient = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/therapist_patient/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setTherapists([data]); // Set the single associated therapist
        } else {
          setMessage('Failed to fetch the assigned therapist.');
        }
      } catch (error) {
        console.error('Error fetching therapist for patient:', error);
        setMessage('An error occurred while fetching the assigned therapist.');
      }
    };

    fetchTherapistForPatient();
  }, [user]);

  useEffect(() => {
    if (selectedTherapistId && selectedDate) {
      const fetchTimeSlots = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/therapists/${selectedTherapistId}/availability?date=${selectedDate
              .toISOString()
              .split('T')[0]}`
          );
          if (response.ok) {
            const data = await response.json();
            setTimeSlots(data);
          } else {
            setMessage('Failed to fetch time slots.');
          }
        } catch (error) {
          console.error('Error fetching time slots:', error);
          setMessage('An error occurred while fetching time slots.');
        }
      };

      fetchTimeSlots();
    }
  }, [selectedTherapistId, selectedDate]);

  const handleSubmit = async () => {
    const patientId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);
    if (!selectedTherapistId || !selectedDate || !selectedTime) {
      setMessage('Please select a therapist, date, and time.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          therapist_id: selectedTherapistId,
          appointment_date: selectedDate.toISOString().split('T')[0], // Send only the date part
          appointment_time: selectedTime, // Send the time
          notes,
        }),
      });

      if (response.ok) {
        setMessage('Appointment successfully booked!');
        setNotes('');
        setSelectedTime('');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setMessage('An error occurred while booking the appointment.');
    }
  };

  return (
    <PageWrapper>
      <div style={styles.container}>
        <div style={styles.calendarContainer}>
          <h2 style={styles.title}>Appointments</h2>
          <AppointmentCalendar date={selectedDate} setDate={setSelectedDate} />
        </div>

        <div style={styles.detailsContainer}>
          <h3 style={styles.subtitle}>View Your Appointment</h3>
          <p style={styles.dateText}>{selectedDate?.toDateString()}</p>

          <div style={styles.formGroupRow}>
  <div style={styles.formGroupHalf}>
    <label style={styles.label}>Therapist</label>
    <select
      style={styles.input}
      value={selectedTherapistId || ''} // Default to empty string if no therapist is selected
      onChange={(e) => {
        const selectedId = parseInt(e.target.value, 10);
        if (!isNaN(selectedId)) {
          setSelectedTherapistId(selectedId); // Update state with selected therapist ID
        }
      }}
    >
      <option value="">Select a Therapist</option>
      {therapists.map((therapist) => (
        <option key={therapist.therapist_id} value={therapist.therapist_id}>
          {therapist.first_name} {therapist.last_name}
        </option>
      ))}
    </select>
  </div>
</div>


          <div style={styles.formGroup}>
            <label style={styles.label}>Select Time</label>
            <div style={styles.timeSlotContainer}>
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.timeSlotButton,
                    backgroundColor: selectedTime === slot ? '#7F56D9' : '#f2f2f2',
                    color: selectedTime === slot ? '#fff' : '#000',
                  }}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Notes</label>
            <textarea
              style={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <button style={styles.submitButton} onClick={handleSubmit}>
            Submit
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </PageWrapper>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  detailsContainer: {
    flex: 2,
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '5px',
  },
  dateText: {
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formGroupRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  formGroupHalf: {
    flex: 1,
    marginRight: '10px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    resize: 'none' as 'none',
  },
  timeSlotContainer: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: '10px',
  },
  timeSlotButton: {
    padding: '10px 20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: '#7F56D9',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '10px',
    color: '#7F56D9',
  },
};

export default AppointmentsPage;
