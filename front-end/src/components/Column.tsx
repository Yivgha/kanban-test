import { Droppable, Draggable } from 'react-beautiful-dnd';

const Column = ({ status, tasks }) => {
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
                    className="card"
                  >
                    <p>{task.title}</p>
                    <p>
                      #{task.id} {task.description}
                    </p>
                  </div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
