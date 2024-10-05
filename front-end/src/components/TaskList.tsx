import { useEffect, useState } from 'react';
import { TaskStatuses } from '../constants/TaskStatuses.enum';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTaskStatus } from '../redux/slices/taskSlice';
import { fetchStatuses } from '../redux/slices/statusSlice';
import { RootState, AppDispatch } from '../redux/store';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatuses;
}

type Columns = {
  [key in TaskStatuses]: Task[];
};

const TaskBoard = () => {
  const dispatch: AppDispatch = useDispatch();
  const { tasks, loadingStatus } = useSelector(
    (state: RootState) => state.tasks
  );
  const { statuses } = useSelector((state: RootState) => state.statuses);

  const [columns, setColumns] = useState<Columns>(() => {
    return Object.values(TaskStatuses).reduce<Columns>((acc, status) => {
      acc[status] = [];
      return acc;
    }, {} as Columns);
  });

  useEffect(() => {
    const fetchAndPopulateTasks = async () => {
      await dispatch(fetchTasks());
      await dispatch(fetchStatuses());
    };
    fetchAndPopulateTasks();
  }, [dispatch]);

  useEffect(() => {
    const newColumns: Columns = statuses.reduce<Columns>((acc, status) => {
      acc[status.name as TaskStatuses] = tasks.filter(
        (task) => task.status === status.name
      );
      return acc;
    }, {} as Columns);

    setColumns(newColumns);
  }, [tasks, statuses]);

  const reorder = (
    list: Task[],
    startIndex: number,
    endIndex: number
  ): Task[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const status = source.droppableId as TaskStatuses;
      const reorderedTasks = reorder(
        columns[status],
        source.index,
        destination.index
      );
      setColumns({
        ...columns,
        [status]: reorderedTasks,
      });
    } else {
      const sourceStatus = source.droppableId as TaskStatuses;
      const destStatus = destination.droppableId as TaskStatuses;

      const sourceTasks = Array.from(columns[sourceStatus]);
      const destTasks = Array.from(columns[destStatus]);

      const [movedTask] = sourceTasks.splice(source.index, 1);

      setColumns({
        ...columns,
        [sourceStatus]: sourceTasks,
        [destStatus]: destTasks,
      });

      await dispatch(
        updateTaskStatus({ id: movedTask.id, status: destStatus })
      );
    }
  };

  if (loadingStatus === 'failed') return <p>Failed to load tasks.</p>;
  if (loadingStatus === 'loading') return <p>Loading...</p>;

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        {statuses.map((status) => {
          const statusTasks = columns[status.name as TaskStatuses] || [];

          return (
            <Droppable droppableId={status.name} key={status.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    width: '30%',
                    marginBottom: '20px',
                    padding: '10px',
                    background: '#f4f4f4',
                  }}
                >
                  <h3>{status.name}</h3>
                  {statusTasks.length === 0 ? (
                    <p>No tasks here</p>
                  ) : (
                    statusTasks.map((task, index) => (
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
                            style={{
                              userSelect: 'none',
                              padding: 16,
                              margin: '0 0 8px 0',
                              background: '#fff',
                              cursor: 'pointer',
                              ...provided.draggableProps.style,
                            }}
                          >
                            {task.title}
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
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
