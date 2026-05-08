export function TodoItem({ task, onToggle, onRemove }) {
  return (
    <li className={task.done ? 'task done' : 'task'}>
      <button
        className="task__check"
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? 'Позначити активною' : 'Позначити виконаною'}
      >
        {task.done ? '✓' : ''}
      </button>

      <span onClick={() => onToggle(task.id)}>{task.text}</span>

      <button
        className="task__remove"
        type="button"
        onClick={() => onRemove(task.id)}
        aria-label="Видалити задачу"
      >
        x
      </button>
    </li>
  );
}
