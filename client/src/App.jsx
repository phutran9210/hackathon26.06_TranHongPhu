import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Input, Button, message, Card } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const { TextArea } = Input;

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    console.log("running");
    axios
      .get("http://localhost:3000/post")
      .then((response) => {
        if (Array.isArray(response.data)) {
          if (response.data.length === 0) {
            message.info("No notes to display");
          } else {
            setNotes(response.data);
            setToggle(false);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
        message.error("Failed to fetch notes from server");
      });
  }, [toggle]);

  const onChange = (e) => {
    setNewNote(e.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();

    if (!newNote) {
      message.warning("Please enter a note before adding it");
      return;
    }

    const noteObject = { content: newNote };

    axios
      .post("http://localhost:3000/post", noteObject)
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setNotes([...notes, ...response.data]);
        }
        setNewNote("");
        setToggle(true);
      })
      .catch((error) => {
        console.error("Error adding note:", error);
        message.error("Failed to add note. Please try again later.");
      });
  };

  const deleteNote = (id) => {
    console.log(`Deleting note with id: ${id}`);
    axios
      .delete(`http://localhost:3000/post/${id}`)
      .then(() => {
        setNotes(notes.filter((note) => note.postID !== id));
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        message.error("Failed to delete note. Please try again later.");
      });
  };

  return (
    <>
      <div className="textarea-container">
        <h1>NOTE APP</h1>

        <TextArea
          showCount
          style={{
            width: 500,
            height: 250,
            marginBottom: 24,
          }}
          value={newNote}
          onChange={onChange}
          placeholder="can resize"
        />
        <Button type="primary" onClick={addNote} className="add-note-button">
          Add
        </Button>
      </div>
      {notes.length > 0 ? (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={notes}
          renderItem={(note) => (
            <List.Item>
              <Card>
                <p>{note.content}</p>
                <Button
                  className="delBtn"
                  type="primary"
                  danger
                  onClick={() => deleteNote(note.postID)}
                >
                  <DeleteOutlined />
                </Button>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p>No notes to display</p>
      )}
    </>
  );
};

export default App;
