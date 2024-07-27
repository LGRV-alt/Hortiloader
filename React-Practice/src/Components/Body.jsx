import PocketBase from "pocketbase";
import { useState } from "react";
import { createTask, deleteTask } from "./lib/pocketbase";
const pb = new PocketBase("https://hortiloader.pockethost.io");
const records = await pb.collection("tasks").getFullList({});

export default function Body() {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  const handleSubmit = () => {
    if (!title) {
      window.alert("Please enter a title");
      return;
    }
    createTask(title, description);
  };
  return (
    <>
      <div className="bg-gray-500 flex flex-col">
        <h2>Create Task</h2>
        <div className="grid gap-6 mt-4 text-base">
          <input
            className="text-input "
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="text-input"
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Description"
          />
        </div>

        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md text-base mt-6 hover:bg-green-600"
          onClick={handleSubmit}
        >
          <div className="flex">
            <span className="material-symbols-outlined -ml-2">save</span>
            <p className="text-base ml-2">Save</p>
          </div>
        </button>
        <div className="flex flex-col justify-center items-center">
          {records.map((record) => (
            <div className="flex" key={record.id}>
              <p>
                {record.title} {record.description}
              </p>
              <button
                className="ml-4 bg-red-500 rounded-md text-white px-2 hover:bg-red-600"
                onClick={() => deleteTask(record.id)}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// export default Body;
