import { Product } from './components/Product/Product.jsx';
import { products } from './products.js';

export default function App() {
  const shopName = 'Smart Bottle Shop';

  return (
    <main className="page">
      <section className="shop-panel">
        <div className="intro">
          <p className="eyebrow">Практична робота №8</p>
          <h1>{shopName}</h1>
          <p>
            Каталог товарів створений на React: кожна картка є окремим
            компонентом, дані передаються через props, а кількість покупок
            зберігається у state.
          </p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <Product key={product.id} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
}
