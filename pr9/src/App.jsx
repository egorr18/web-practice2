import { useMemo, useState } from 'react';
import { Counter } from './components/Counter.jsx';
import { UserCard } from './components/UserCard.jsx';
import { TodoItem } from './components/TodoItem.jsx';

const initialTasks = [
  { id: 1, text: 'Створити React-проєкт через Vite', done: true },
  { id: 2, text: 'Розібрати компоненти, props і state', done: true },
  { id: 3, text: 'Додати фільтрацію задач', done: false },
];

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Done' },
];

export default function App() {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');

  const addTask = () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Date.now(), text: trimmedText, done: false },
    ]);
    setText('');
  };

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const removeTask = (id) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'active') {
      return tasks.filter((task) => !task.done);
    }

    if (filter === 'done') {
      return tasks.filter((task) => task.done);
    }

    return tasks;
  }, [filter, tasks]);

  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <main className="workspace">
      <section className="header">
        <p className="eyebrow">Практична робота №9</p>
        <h1>React + Vite: компоненти, props, state, події</h1>
      </section>

      <section className="layout">
        <div className="todo-panel">
          <div className="todo-panel__top">
            <div>
              <h2>Mini ToDo List</h2>
              <p>
                Виконано {doneCount} з {tasks.length}
              </p>
            </div>

            <div className="filters" aria-label="Фільтр задач">
              {filters.map((item) => (
                <button
                  className={filter === item.value ? 'active' : ''}
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <form
            className="task-form"
            onSubmit={(event) => {
              event.preventDefault();
              addTask();
            }}
          >
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Нова задача"
              aria-label="Нова задача"
            />
            <button type="submit">Add</button>
          </form>

          <ul className="task-list">
            {filteredTasks.map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onRemove={removeTask}
              />
            ))}
          </ul>

          {filteredTasks.length === 0 && (
            <p className="empty">Для цього фільтра задач немає.</p>
          )}
        </div>

        <aside className="side-panel">
          <Counter />
          <div className="people">
            <h2>Компоненти та props</h2>
            <UserCard name="Іван" role="Student" />
            <UserCard name="Олена" role="Teacher" />
          </div>
        </aside>
      </section>
    </main>
  );
}
