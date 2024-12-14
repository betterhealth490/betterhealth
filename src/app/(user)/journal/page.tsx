"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk's useUser hook
import { PageWrapper } from "~/app/(user)/page-wrapper"; // Import PageWrapper

interface JournalEntry {
  journal_id: number; // Journal entry ID
  patient_id: number; // Patient ID
  title: string; // Title of the journal entry
  content: string;
  entry_date: string; // ISO date string
}

const Journal = () => {
  const { isLoaded, user } = useUser();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    journal_id: 0,
    patient_id: 0,
    title: "",
    content: "",
    entry_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // If the user is not loaded or not authenticated, show loading state
  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  const patientId = parseInt((user.unsafeMetadata as any).databaseId, 10);

  if (isNaN(patientId)) {
    return <div>Error: Invalid patient ID</div>;
  }

  // Fetch journal entries
  const fetchEntries = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/journals/${patientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch journal entries");
      }
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      setError("Failed to load journal entries");
    }
  };

  // Fetch entries when the component mounts
  useEffect(() => {
    fetchEntries();
  }, [patientId]);

  const handleNewEntry = () => {
    setCurrentEntry({
      journal_id: 0,
      patient_id: patientId,
      title: "",
      content: "",
      entry_date: new Date().toISOString(),
    });
    setIsEditing(true);
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setIsEditing(true);
  };

  const handleSaveEntry = async () => {
    setIsLoading(true);
    setError(null);

    const url =
      currentEntry.journal_id === 0
        ? "http://127.0.0.1:5000/journals"
        : `http://127.0.0.1:5000/journals/${currentEntry.journal_id}`;

    const method = currentEntry.journal_id === 0 ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          title: currentEntry.title,
          content: currentEntry.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save entry");
      }

      // Refresh entries after saving
      await fetchEntries();

      setIsEditing(false);
    } catch (error) {
      setError("Failed to save the entry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseEntry = () => {
    setIsEditing(false); // Close the currently open entry
  };

  const handleDiscard = () => {
    setIsEditing(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEntry({ ...currentEntry, title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentEntry({ ...currentEntry, content: e.target.value });
  };

  return (
    <PageWrapper
      actions={
        <button
          onClick={handleNewEntry}
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
        >
          New Entry
        </button>
      }
    >
      <div style={styles.dashboardContainer}>
        {/* Left Column: List of journal entries */}
        <div style={styles.entriesContainer}>
          {entries.length === 0 ? (
            <p>No journal entries available</p>
          ) : (
            <div>
              {entries.map((entry: JournalEntry) => (
                <div
                  key={entry.journal_id}
                  style={styles.entryItem}
                  onClick={() => handleSelectEntry(entry)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{entry.title}</span>
                    <span style={styles.entryDate}>
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Journal entry editor */}
        <div style={styles.editorContainer}>
          {isEditing ? (
            <div>
              <input
                placeholder="Title"
                style={styles.titleInput}
                value={currentEntry.title}
                onChange={handleTitleChange}
              />
              <textarea
                placeholder="Start writing here..."
                style={styles.textarea}
                value={currentEntry.content}
                onChange={handleContentChange}
              />
              <div style={styles.buttonsContainer}>
                <button style={styles.discardButton} onClick={handleDiscard}>
                Discard
                </button>
                {currentEntry.journal_id === 0 ? (
                  <button
                    style={styles.saveButton}
                    onClick={handleSaveEntry}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                ) : (
                  <button
                    style={styles.closeButton}
                    onClick={handleCloseEntry}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>

          ) : (
            <div>
              <h2 style={styles.entryTitle}>{currentEntry.title}</h2>
              <p>{currentEntry.content}</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "20px",
    height: "calc(100vh - 64px)", // Adjust for PageWrapper header height
  },
  entriesContainer: {
    width: "30%",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    overflowY: "auto" as "auto",
  },
  entryItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
  },
  entryDate: {
    fontSize: "12px",
    color: "#888",
  },
  editorContainer: {
    width: "65%",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    overflowY: "auto" as "auto",
  },
  titleInput: {
    width: "100%",
    padding: "10px",
    fontSize: "18px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    height: "300px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "20px",
    resize: "none" as "none",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  discardButton: {
    backgroundColor: "#ccc",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#6c5dd3",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeButton: {
    backgroundColor: "#6c5dd3",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  entryTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
};

export default Journal;
