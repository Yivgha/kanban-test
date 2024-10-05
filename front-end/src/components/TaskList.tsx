import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '../redux/slices/taskSlice';
import { fetchStatuses } from '../redux/slices/statusSlice';
import { fetchTasks, updateTaskStatus } from '../api/tasks';
import { RootState, AppDispatch } from '../redux/store';
import { TaskStatuses } from '../constants/TaskStatuses.enum';
import Column from './Column';
import reorder from '../helpers/reorder';

type Columns = {
  [key in TaskStatuses]: Task[];
};

const TaskBoard = () => {
  const dispatch: AppDispatch = useDispatch();
  const { tasks, loadingStatus } = useSelector(
    (state: RootState) => state.tasks
  );
  const { statuses } = useSelector((state: RootState) => state.statuses);

  const [columns, setColumns] = useState<Columns>(
    Object.values(TaskStatuses).reduce<Columns>((acc, status) => {
      acc[status] = [];
      return acc;
    }, {} as Columns)
  );

  useEffect(() => {
    const fetchAndPopulateTasks = async () => {
      await Promise.all([dispatch(fetchTasks()), dispatch(fetchStatuses())]);
    };
    fetchAndPopulateTasks();
  }, [dispatch]);

  const memoizedColumns = useMemo(() => {
    return statuses.reduce<Columns>((acc, status) => {
      acc[status.name as TaskStatuses] = tasks.filter(
        (task) => task.status === status.name
      );
      return acc;
    }, {} as Columns);
  }, [tasks, statuses]);

  useEffect(() => {
    setColumns(memoizedColumns);
  }, [memoizedColumns]);

  const updateTaskOrder = async (tasks: Task[], status: TaskStatuses) => {
    await Promise.all(
      tasks.map((task, index) =>
        dispatch(
          updateTaskStatus({ id: task.id, status: status, order: index })
        )
      )
    );
  };

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceStatus = source.droppableId as TaskStatuses;
    const destStatus = destination.droppableId as TaskStatuses;

    const newColumns = { ...columns };

    if (sourceStatus === destStatus) {
      // Reorder within the same column
      const reorderedTasks = reorder(
        newColumns[sourceStatus],
        source.index,
        destination.index
      );

      newColumns[sourceStatus] = reorderedTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      setColumns(newColumns);
      await updateTaskOrder(reorderedTasks, sourceStatus);
    } else {
      // Move task to a different column
      const sourceTasks = Array.from(newColumns[sourceStatus]);
      const destTasks = Array.from(newColumns[destStatus]);
      const movedTask = { ...sourceTasks[source.index], status: destStatus };

      sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedTask);

      newColumns[sourceStatus] = sourceTasks.map((task, index) => ({
        ...task,
        order: index,
      }));
      newColumns[destStatus] = destTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      setColumns(newColumns);

      // Update the status and order for the moved task
      await Promise.all([
        dispatch(
          updateTaskStatus({
            id: movedTask.id,
            status: destStatus,
            order: destination.index,
          })
        ),
        updateTaskOrder(destTasks, destStatus),
      ]);
    }

    await dispatch(fetchTasks());
  };

  if (loadingStatus === 'failed')
    return <p className="info-msg">Failed to load tasks.</p>;

  if (loadingStatus === 'loading')
    return <p className="info-msg">Loading...</p>;

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="column-wrapper">
        {statuses.map((status) => (
          <Column
            key={status.id}
            status={status}
            tasks={columns[status.name as TaskStatuses] || []}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
