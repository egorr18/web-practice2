import { useState } from 'react';
import './Product.css';

export function Product({ title, price, img, badge, description }) {
  const [count, setCount] = useState(0);

  const handleBuy = () => {
    setCount((currentCount) => currentCount + 1);
  };

  return (
    <article className="product">
      <div className="product__media">
        <img src={img} alt={title} />
        <span className="product__badge">{badge}</span>
      </div>

      <div className="product__body">
        <h2>{title}</h2>
        <p>{description}</p>

        <div className="product__footer">
          <strong>{price} грн</strong>
          <span>Куплено: {count}</span>
        </div>

        <button type="button" onClick={handleBuy}>
          Купити
        </button>
      </div>
    </article>
  );
}
