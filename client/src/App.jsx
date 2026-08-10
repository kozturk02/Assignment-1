import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001';

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/contacts`)
      .then(response => response.json())
      .then(data => setContacts(data))
      .catch(error => console.error('Error fetching contacts:', error));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if(!name.trim()) return;

    const res = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone })
    });

    const newContact = await res.json();
    setContacts([...contacts, newContact]);
    
    setName('');
    setEmail('');
    setPhone('');
  }

  async function handleDelete(id) {
    await fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE' });
    setContacts(contacts.filter(contact => contact.id !== id));
  }

  return (
    <div className="App">
      <h1>Contacts</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Add Contact</button>
      </form>

      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.name} — {contact.email} — {contact.phone}
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;