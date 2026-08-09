import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001';

function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/contacts`)
      .then(response => response.json())
      .then(data => setContacts(data))
      .catch(error => console.error('Error fetching contacts:', error));
  }, []);

  return (
    <div className="App">
      <h1>Contact List</h1>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>
            {contact.name} - {contact.email} - {contact.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;