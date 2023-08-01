// src/components/TaskItem.js
const TaskItem = ({ task, onDelete }) => {
    return (
      <li className="border-b border-gray-300 py-2">
        {task}
        <button onClick={onDelete} className="text-red-600 ml-2">
          Delete
        </button>
      </li>
    );
  };
  
  export default TaskItem;
  