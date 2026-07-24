import { useState } from "react";
import axios from "axios";

const App = () => {
  const [notes, setNotes] = useState([
    {
      title: "test title",
      description: "test description",
    },
    {
      title: "test title",
      description: "test description",
    },
    {
      title: "test title",
      description: "test description",
    },
    {
      title: "test title",
      description: "test description",
    },
  ]);

  axios.get('http://localhost:3000/api/notes')
  .then((res) => {
    setNotes(res.data.note);
    
  })

  return (
    <>
      <div className="notes">
        {notes.map((note , id) => {
         return (
          <div key={id} className="note">
            <h1>{note.title}</h1>
            <p>{note.description}</p>
          </div>
         );
        })}
      </div>
    </>
  );
};

export default App;
