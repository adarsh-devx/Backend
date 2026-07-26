import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  // === STATES ===
  // 1. All notes list store karne ke liye
  const [notes, setNotes] = useState([]);

  // 2. Currently edit hone wali note hold karne ke liye (null = Normal Mode, Object = Edit Mode)
  const [editNote, setEditNote] = useState(null);

  // ==========================================
  // 1. CREATE (POST)
  // ==========================================
  // Nayi note database me insert karne ke liye POST request
  function createNotes(title, description) {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/notes`, {
        title,
        description,
      })
      .then(() => {
        fetchNotes(); // Insert ke baad latest data load karo
      });
  }

  // Nayi note create form Submit hone par chalta hai
  function handleSubmit(e) {
    e.preventDefault(); // Page reload hone se roko
    const { title, description } = e.target; // Input elements read karo

    createNotes(title.value, description.value);
    e.target.reset(); // Input fields clear karo
  }

  // ==========================================
  // 2. READ (GET)
  // ==========================================
  // Database se saari notes read karke state me set karta hai
  function fetchNotes() {
    axios.get(`${import.meta.env.VITE_API_URL}/api/notes`).then((res) => {
      setNotes(res.data.note || []);
    });
  }

  // Component load hone par ek baar notes fetch karta hai
  useEffect(() => {
    fetchNotes();
  }, []);

  // ==========================================
  // 3. UPDATE (PATCH)
  // ==========================================
  // Database me target note ko PATCH request se update karta hai
  function updateNote(id, title, description) {
    axios
      .patch(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
        title,
        description,
      })
      .then(() => {
        fetchNotes(); // Updated notes list refresh karo
        setEditNote(null); // Edit mode OFF karo (wapas normal create mode me aao)
      });
  }

  // Edit Form Submit hone par chalta hai
  function handleUpdateSubmit(e) {
    e.preventDefault();
    const { title, description } = e.target;

    // Currently selected note ki ID (editNote._id) aur naye input values API ko bhejte hain
    updateNote(editNote._id, title.value, description.value);
    e.target.reset();
  }

  // ==========================================
  // 4. DELETE (DELETE)
  // ==========================================
  // Selected note ko delete karne ke liye DELETE request
  function handleDeleteNote(id) {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`).then(() => {
      fetchNotes(); // List refresh karo
    });
  }

  return (
    <div className="app-container">
      {/* Top Header & Live Counter */}
      <header className="app-header">
        <div className="logo-section">
          <span className="logo-icon">📝</span>
          <h1>My Notes</h1>
        </div>
        <span className="notes-count">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </span>
      </header>

      <main className="main-content">
        {/* === CREATE FORM === (Tabhi dikhega jab editNote NULL ho) */}
        {!editNote && (
          <form className="note-form create-mode" onSubmit={handleSubmit}>
            <div className="form-header">
              <h3>Create New Note</h3>
            </div>
            <div className="form-inputs">
              <input name="title" placeholder="Note Title..." required />
              <input name="description" placeholder="Write description..." required />
              <button type="submit" className="btn btn-primary">
                + Create Note
              </button>
            </div>
          </form>
        )}

        {/* === EDIT FORM === (Tabhi dikhega jab editNote me Note ka Object ho) */}
        {editNote && (
          <form className="note-form edit-mode" onSubmit={handleUpdateSubmit}>
            <div className="form-header">
              <span className="badge-edit">Editing Note</span>
            </div>
            <div className="form-inputs">
              {/* defaultValue me editNote se existing title aur description pre-fill hote hain */}
              <input name="title" defaultValue={editNote.title} required />
              <input name="description" defaultValue={editNote.description} required />
              <div className="form-actions">
                <button type="submit" className="btn btn-update">
                  Save Changes
                </button>
                {/* Cancel button se edit mode band ho jata hai */}
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => setEditNote(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* === NOTES DISPLAY GRID === */}
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes found. Create your first note above! ✨</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => {
              return (
                <div key={note._id} className="note-card">
                  <div className="note-body">
                    <h2>{note.title}</h2>
                    <p>{note.description}</p>
                  </div>
                  <div className="note-actions">
                    {/* Edit button click karne par target note object state me set hoti hai */}
                    <button
                      className="btn-action btn-edit"
                      onClick={() => setEditNote(note)}
                    >
                      ✏️ Edit
                    </button>
                    {/* Delete button target ID ko delete function me bhejta hai */}
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
