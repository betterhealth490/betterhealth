"use client";

import React, { useState } from "react";
import { NoEntriesView } from "~/components/Journal/NoEntriesView";
import { JournalList } from "~/components/Journal/JournalList";
import { JournalDetail } from "~/components/Journal/JournalDetail";
import { Button } from "~/components/ui/button";
import { mockJournals } from "~/entities/mock-journal";
import { Journal } from "~/entities/journal";

const JournalPage: React.FC = () => {
  const [journals, setJournals] = useState<Journal[]>(mockJournals);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewEntry = () => {
    setSelectedJournal({
      journalId: Date.now(),
      entryDate: new Date(),
      title: `Journal ${journals.length + 1}`,
      content: "",
    });
  };

  const handleSelectJournal = (journal: Journal) => {
    setSelectedJournal(journal);
  };

  const filteredJournals = journals.filter((journal) =>
    journal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <div className="w-1/3 flex flex-col p-4 border-r">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex-grow overflow-y-auto">
          {filteredJournals.length > 0 ? (
            <JournalList
              journals={filteredJournals}
              onSelectJournal={handleSelectJournal}
            />
          ) : (
            <div className="text-center text-gray-500">
              No entries match your search.
            </div>
          )}
        </div>
      </div>

      <div className="w-2/3 flex flex-col p-4">
        <div className="flex justify-end mb-4">
          <Button onClick={handleNewEntry} variant="default">
            New Entry
          </Button>
        </div>

        <div className="border rounded-lg p-6 shadow-sm flex-grow flex flex-col">
          {selectedJournal ? (
            <JournalDetail
              journal={selectedJournal}
              onSave={(newJournal) => {
                const updatedJournals = journals.some(
                  (j) => j.journalId === newJournal.journalId
                )
                  ? journals.map((j) =>
                      j.journalId === newJournal.journalId
                        ? newJournal
                        : j
                    )
                  : [...journals, newJournal];
                setJournals(updatedJournals);
                setSelectedJournal(null);
              }}
            />
          ) : (
            <div className="text-center text-gray-500">
              Select or create a journal entry to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;