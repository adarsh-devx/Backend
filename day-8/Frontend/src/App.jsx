import { useState, useEffect } from "react";
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

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/notes`)
      .then((res) => {
        setNotes(res.data.note);
      });
  }, []);


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
