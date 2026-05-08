import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section className="counter">
      <h2>Лічильник</h2>
      <strong>{count}</strong>
      <div>
        <button type="button" onClick={() => setCount(count + 1)}>
          +1
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </section>
  );
}
