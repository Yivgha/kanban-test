import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import TaskInput from './TaskInput';
import { useState } from 'react';

const Column = ({
  status,
  tasks,
  onTaskSubmit,
  onEditTask,
  onDeleteTask,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  editingTaskId,
  setEditingTaskId,
}) => {
  const [isTaskInputVisible, setTaskInputVisible] = useState(false);

  const clearFields = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setEditingTaskId(null);
  };

  const handleSubmit = () => {
    if (editingTaskId !== null) {
      onEditTask(editingTaskId);
    }
    onTaskSubmit(status.name);

    setTaskInputVisible(false);
    clearFields();
  };

  const toggleTaskInput = (taskId: number | null) => {
    if (taskId === null) {
      setTaskInputVisible(true);
      clearFields();
    } else {
      setTaskInputVisible(false);
      // Populate the fields for editing
      const taskToEdit = tasks.find((task) => task.id === taskId);
      setNewTaskTitle(taskToEdit?.title || '');
      setNewTaskDescription(taskToEdit?.description || '');
    }
  };

  const handleClose = () => {
    setTaskInputVisible(false);
    clearFields();
  };

  return (
    <Droppable droppableId={status.name}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="column"
        >
          <h3 className="column-title">{status.name}</h3>

          {tasks.length === 0 ? (
            <p className="no-tasks-msg">No tasks here</p>
          ) : (
            tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      toggleTaskInput={() => toggleTaskInput(task.id)}
                    />
                    {editingTaskId === task.id && (
                      <TaskInput
                        title={newTaskTitle}
                        description={newTaskDescription}
                        setTitle={setNewTaskTitle}
                        setDescription={setNewTaskDescription}
                        onSubmit={handleSubmit}
                        isEditing={true}
                        toggleTaskInput={handleClose}
                      />
                    )}
                  </div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}

          {status.name === 'To Do' && (
            <div className="add-task-wrapper">
              <div className="add-task-card">
                <span
                  className="add-task-button"
                  onClick={() => {
                    if (!isTaskInputVisible) {
                      handleClose();
                    }
                    setTaskInputVisible(true);
                  }}
                >
                  {!isTaskInputVisible && '+'}
                </span>
                {isTaskInputVisible && (
                  <TaskInput
                    title={newTaskTitle}
                    description={newTaskDescription}
                    setTitle={setNewTaskTitle}
                    setDescription={setNewTaskDescription}
                    onSubmit={handleSubmit}
                    isEditing={false}
                    toggleTaskInput={handleClose}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
