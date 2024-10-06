import React from 'react';

interface Kanban {
  uniqueId: string;
  name: string;
}

interface KanbanSelectProps {
  kanbans: Kanban[];
  selectedKanbanId: string | null;
  onKanbanChange: (kanbanId: string) => void;
}

const KanbanSelect: React.FC<KanbanSelectProps> = ({
  kanbans,
  selectedKanbanId,
  onKanbanChange,
}) => {
  return (
    <select
      onChange={(e) => onKanbanChange(e.target.value)}
      value={selectedKanbanId || ''}
    >
      <option value="">Select Kanban</option>
      {kanbans.map((kanban) => (
        <option key={kanban.uniqueId} value={kanban.uniqueId}>
          {kanban.name}
        </option>
      ))}
    </select>
  );
};

export default KanbanSelect;
