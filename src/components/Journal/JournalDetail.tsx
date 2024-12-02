import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Journal } from "~/entities/journal";

interface JournalDetailProps {
  journal: Journal | null;
  onSave: (journal: Journal) => void;
}

export const JournalDetail: React.FC<JournalDetailProps> = ({
  journal,
  onSave,
}) => {
  const [content, setContent] = useState(journal ? journal.content : "");

  const handleSave = () => {
    const newJournal: Journal = {
      ...journal!,
      content,
    };
    onSave(newJournal);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">{journal?.title}</h2>

      <Textarea
        placeholder="Start writing here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow p-2 border rounded-md mb-4"
        style={{ minHeight: "300px" }}
      />

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setContent(journal?.content || "")}
        >
          Discard
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};