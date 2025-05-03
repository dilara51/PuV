import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  // const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const apiBaseUrl = "https://verbose-space-potato-rv49gjxwwrh59v6-3000.app.github.dev";


  useEffect(() => {
    axios.get(`${apiBaseUrl}/items`)
      .then(res => setItems(res.data))
      .catch(err => {
        console.error("Fehler beim Laden:", err);
        alert("Fehler beim Laden der Items!");
      });
  }, [apiBaseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("POST an:", `${apiBaseUrl}/items`);
      await axios.post(`${apiBaseUrl}/items`, { name, quantity: Number(quantity) });
      setName('');
      setQuantity(1);
      const res = await axios.get(`${apiBaseUrl}/items`);
      setItems(res.data);
    } catch (err) {
      console.error("Fehler beim Senden:", err);
      alert("Fehler beim Hinzufügen!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🛒 Shopping List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Menge"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Hinzufügen</button>
      </form>

      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name} – {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
}
