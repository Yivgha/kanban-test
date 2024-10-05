import { Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskStatuses } from '../constants/TaskStatuses.enum';
import TaskCard from './TaskCard';

const Column = ({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
}) => {
  const handleAddTask = () => {
    if (newTaskTitle.trim() && newTaskDescription.trim()) {
      onAddTask(status.name);

      setNewTaskTitle('');
      setNewTaskDescription('');
    }
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
                    />
                  </div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}

          {/* Add "To Do" column inputs and button */}
          {status.name === TaskStatuses.TODO && (
            <div className="add-task-card">
              <div className="add-task-content">
                <span>+</span>
              </div>
              <input
                type="text"
                id="add task title"
                placeholder="Task Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <input
                type="text"
                id="add task description"
                placeholder="Task Description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
              <button onClick={handleAddTask} className="submit-task-button">
                Add Task
              </button>
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
