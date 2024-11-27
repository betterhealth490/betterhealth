import React from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export const NoEntriesView: React.FC<{ onNewEntry: () => void }> = ({ onNewEntry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <p>No journal entries found, create new entries to search for them.</p>
      <Button onClick={onNewEntry} variant="default">
        New Entry
      </Button>
    </div>
  );
};
