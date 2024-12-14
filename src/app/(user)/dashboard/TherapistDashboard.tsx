"use client";

import React, { useState, useEffect } from "react";
import { PageWrapper } from "~/app/(user)/page-wrapper";
import { useUser } from "@clerk/nextjs";

const TherapistDashboard: React.FC = () => {
  const { user } = useUser();
  const [patients, setPatients] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch patient data from `betterhealth_therapist_patient`
  const fetchPatients = async () => {
    try {
      const therapistId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);
      if (isNaN(therapistId)) {
        setMessage("Error: Invalid therapist ID.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:5000/therapist_patient_list/${therapistId}`
      );

      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        setMessage("No patients found.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred while fetching patients.");
      console.error(error);
    }
  };

  // Fetch unread messages with sender's name
  const fetchUnreadMessages = async () => {
    try {
      const therapistId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);
      if (isNaN(therapistId)) {
        setMessage("Error: Invalid therapist ID.");
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/messages/unread/${therapistId}`);
      if (response.ok) {
        const data = await response.json();
        setUnreadMessages(data);
      } else {
        setMessage("No recent messages.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred while fetching messages.");
      console.error(error);
    }
  };

  // Fetch comments for a patient
  const fetchComments = async (patientId: number) => {
    try {
      const therapistId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);
      const response = await fetch(
        `http://127.0.0.1:5000/comments/${therapistId}/${patientId}`
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setMessage("Failed to fetch comments.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching comments.");
      console.error(error);
    }
  };

  // Save a new comment
  const saveComment = async () => {
    try {
      const therapistId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);
      const response = await fetch(`http://127.0.0.1:5000/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          therapist_id: therapistId,
          patient_id: selectedPatient,
          comment: newComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments(selectedPatient!); // Refresh comments
      } else {
        setMessage("Failed to save comment.");
      }
    } catch (error) {
      setMessage("An error occurred while saving the comment.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchUnreadMessages();
  }, []);

  const handleCommentsClick = (patientId: number) => {
    setSelectedPatient(patientId);
    fetchComments(patientId);
    setIsCommenting(true);
  };

  const handleCloseComments = () => {
    setIsCommenting(false);
    setComments([]);
    setSelectedPatient(null);
  };


  const handleSurveyClick = (patientId: number) => {
    alert(`Showing survey for patient ID: ${patientId}`);
  };

  return (
    <PageWrapper
      actions={
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Therapist Dashboard</h2>
        </div>
      }
    >
      <div style={styles.dashboard}>
        <div style={styles.content}>
          {/* Patient List */}
          <div style={styles.patientsContainer}>
            <h2 style={styles.title}>Patient List</h2>
            {patients.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.patient_id}>
                      <td style={styles.tableCell}>
                        {patient.first_name} {patient.last_name}
                      </td>
                      <td style={styles.tableCell}>
                        <button
                          style={styles.actionButton}
                          onClick={() => handleCommentsClick(patient.patient_id)}
                        >
                          Comments
                        </button>
                        <button
                          style={styles.actionButton}
                          onClick={() => handleSurveyClick(patient.patient_id)}
                        >
                          Show Survey
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No patients found.</p>
            )}
          </div>

          {/* Recent Messages */}
          <div style={styles.messagesContainer}>
            <h2 style={styles.title}>Recent Messages</h2>
            {unreadMessages.length > 0 ? (
              <ul style={styles.list}>
                {unreadMessages.map((msg: any) => (
                  <li key={msg.message_id} style={styles.listItem}>
                    <strong>From:</strong> {msg.sender_name} <br />
                    <strong>Message:</strong> {msg.content} <br />
                    <strong>Sent At:</strong> {new Date(msg.sent_at).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={styles.noMessages}>No new messages</p>
            )}
          </div>
        </div>

        
          {/* Comments Section */}
          {isCommenting && (
            <div style={styles.commentsContainer}>
              <h2 style={styles.title}>Comments</h2>
              {comments.length > 0 ? (
                <ul style={styles.commentList}>
                  {comments.map((comment: any) => (
                    <li key={comment.commentId} style={styles.commentItem}>
                      <p>{comment.comment}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
              <textarea
                placeholder="Add a new comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={styles.textarea}
              />
              <div style={styles.buttonsContainer}>
                <button style={styles.closeButton} onClick={handleCloseComments}>
                  Close
                </button>
                <button style={styles.saveButton} onClick={saveComment}>
                  Save
                </button>
              </div>
            </div>
          )}


        {/* Message Display */}
        {message && (
          <div style={styles.message}>
            <p>{message}</p>
            <button style={styles.closeButton} onClick={() => setMessage(null)}>
              Close
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

const styles = {
  dashboard: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  content: {
    display: "flex",
    gap: "20px",
  },

  commentsContainer: {
    flex: 2,
    padding: "20px",
    borderRadius: "10px",
    background: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  patientsContainer: {
    flex: 1,
    padding: "20px",
    borderRadius: "10px",
    background: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  textarea: {
    width: "100%",
    height: "100px",
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  saveButton: {
    backgroundColor: "#7C3AED",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  commentItem: {
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as "collapse",
  },
  tableHeader: {
    backgroundColor: "#7C3AED",
    color: "white",
    padding: "10px",
    textAlign: "left" as "left",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left" as "left",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  actionButton: {
    marginRight: "10px",
    backgroundColor: "#7C3AED",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  messagesContainer: {
    flex: 1,
    padding: "20px",
    borderRadius: "10px",
    background: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  commentList: {
    listStyle: "none",
    padding: "0",
  },
  list: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  listItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  noMessages: {
    fontSize: "0.9rem",
    color: "gray",
  },
  message: {
    marginTop: "20px",
    backgroundColor: "#e7f5e7",
    color: "#2f662f",
    padding: "10px",
    borderRadius: "5px",
    textAlign: "center" as "center",
  },
  closeButton: {
    backgroundColor: "#7C3AED",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};

export default TherapistDashboard;
