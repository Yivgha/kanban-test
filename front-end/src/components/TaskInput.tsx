import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

type TaskInputProps = {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  onSubmit: () => void;
  isEditing: boolean;
  toggleTaskInput: () => void;
};

const TaskInput: React.FC<TaskInputProps> = ({
  title,
  description,
  setTitle,
  setDescription,
  onSubmit,
  isEditing,
  toggleTaskInput,
}) => {
  return (
    <div className="add-task-card">
      <FontAwesomeIcon
        icon={faTimes}
        className="close-icon"
        onClick={toggleTaskInput}
        title="Close"
      />
      <h4 className="task-input-title">
        {isEditing ? 'Edit Task' : 'Add Task'}
      </h4>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={onSubmit} className="submit-task-button">
        {isEditing ? 'Save' : 'Add'}
      </button>
    </div>
  );
};

export default TaskInput;
