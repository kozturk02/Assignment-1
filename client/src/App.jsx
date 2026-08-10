import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001';

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/contacts`)
      .then(response => response.json())
      .then(data => setContacts(data))
      .catch(error => console.error('Error fetching contacts:', error));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if(!name.trim()) return;

    if(editingId) {
      const res = await fetch(`${API_URL}/contacts/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      const updatedContact = await res.json();
      setContacts(
        contacts.map((c) => c.id === editingId ? updatedContact : c)
      );
      setEditingId(null);

    } else {
      // ADD MODE — send POST to create new contact
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });

      const newContact = await res.json();
      setContacts([...contacts, newContact]);
    }
    
    setName('');
    setEmail('');
    setPhone('');
  }

  function handleEdit(contact) {
    setEditingId(contact.id);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
  }

  function handleCancelEdit() {
    setEditingId(null);
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
        <button type="submit">{editingId ? 'Update Contact' : 'Add Contact'}</button>
        {editingId && (<button type="button" onClick={handleCancelEdit}>Cancel</button>)}
      </form>

      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.name} — {contact.email} — {contact.phone}
            <button onClick={() => handleEdit(contact)}>Edit</button>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;