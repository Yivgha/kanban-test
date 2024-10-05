import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-actions">
        <FontAwesomeIcon
          icon={faEdit}
          className="task-icon"
          onClick={() => onEdit(task.id)}
          title="Edit Task"
        />
        <FontAwesomeIcon
          icon={faTrash}
          className="task-icon"
          onClick={() => onDelete(task.id)}
          title="Delete Task"
        />
      </div>
    </div>
  );
};

export default TaskCard;
