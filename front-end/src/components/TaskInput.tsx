import React from 'react';

type TaskInputProps = {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  onSubmit: () => void;
  isEditing: boolean;
};

const TaskInput: React.FC<TaskInputProps> = ({
  title,
  description,
  setTitle,
  setDescription,
  onSubmit,
  isEditing,
}) => {
  return (
    <div className="add-task-card">
      {isEditing ? (
        <h4>Edit Task</h4>
      ) : (
        <div className="add-task-content">
          <span>+</span>
        </div>
      )}
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
        {isEditing ? 'Save' : 'Add Task'}
      </button>
    </div>
  );
};

export default TaskInput;
