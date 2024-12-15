"use client";

import { useState, useEffect } from "react";
import { createJournalAction, listJournalsAction, updateJournalAction } from "./actions";

interface Journal {
  journalId: number;
  title: string;
  entryDate: Date;
  content: string;
}

export default function JournalsPage({ patientId }: { patientId: number }) {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const journalList = await listJournalsAction(patientId);
      setJournals(journalList);
      setFilteredJournals(journalList);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error fetching journals:", error);
      setErrorMessage("Failed to load journals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newTitle || !newContent) {
      setErrorMessage("Title and content cannot be empty.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isEditing && selectedJournal) {
        await updateJournalAction(selectedJournal.journalId, patientId, newContent);
        setSuccessMessage("Journal updated successfully!");
      } else {
        await createJournalAction(patientId, newTitle, new Date(), newContent);
        setSuccessMessage("Journal created successfully!");
      }

      setNewTitle("");
      setNewContent("");
      setIsEditing(false);
      setSelectedJournal(null);
      fetchJournals();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error saving journal:", error);
      setErrorMessage("Failed to save the journal. Please try again.");
    }
  };

  const handleSelectJournal = (journal: Journal) => {
    setSelectedJournal(journal);
    setNewTitle(journal.title);
    setNewContent(journal.content);
    setIsEditing(true);
  };

  const handleNewEntry = () => {
    setSelectedJournal(null);
    setNewTitle("");
    setNewContent("");
    setIsEditing(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredJournals(journals);
    } else {
      setFilteredJournals(
        journals.filter((journal) =>
          journal.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 p-4">
        <button
          onClick={handleNewEntry}
          className="bg-[#7C3AED] hover:bg-[#6A2BC6] text-white px-4 py-2 rounded w-full mb-4"
        >
          New Entry
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search journals..."
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
        />
        {loading ? (
          <p className="text-center text-gray-500">Loading journals...</p>
        ) : (
          <div className="overflow-y-auto max-h-[calc(100vh-200px)] space-y-2">
            <ul>
              {filteredJournals.map((journal) => (
                <li
                  key={journal.journalId}
                  onClick={() => handleSelectJournal(journal)}
                  className={`cursor-pointer p-3 border rounded-lg transition ${
                    selectedJournal?.journalId === journal.journalId
                      ? "bg-[#F3E8FF] border-[#7C3AED]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <p className="font-semibold">{journal.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(journal.entryDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex-1 bg-white p-6">
        <div className="max-w-3xl mx-auto">
          {successMessage && (
            <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-300 p-3 rounded-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 p-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Journal Title"
            className="w-full text-2xl font-bold mb-4 border-b p-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your journal here..."
            className="w-full border p-4 rounded-lg h-[500px] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          ></textarea>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={handleNewEntry}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="bg-[#7C3AED] hover:bg-[#6A2BC6] text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
