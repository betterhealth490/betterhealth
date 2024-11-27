import React from "react";

interface JournalListProps {
  journals: any[];
  onSelectJournal: (journal: any) => void;
}

export const JournalList: React.FC<JournalListProps> = ({
  journals,
  onSelectJournal,
}) => {
  return (
    <div className="space-y-4">
      {journals.map((journal) => (
        <div
          key={journal.journalId}
          className="p-4 border rounded cursor-pointer hover:bg-gray-100"
          onClick={() => onSelectJournal(journal)}
        >
          <h3 className="font-bold">{journal.title || `Journal Entry ${journal.journalId}`}</h3>
          <p className="text-sm text-gray-500">{journal.entryDate.toDateString()}</p>
        </div>
      ))}
    </div>
  );
};
