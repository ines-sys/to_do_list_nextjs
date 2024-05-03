"use client";
import React, { FormEvent, useState, useRef, useEffect } from "react";

interface Task {
  title: string;
  id: number;
}

const List = () => {
  const manageTasks = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Get saved tasks from local storage when starting the component
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } else {
      return null;
    }
  }

  const [tasks, setTasks] = useState<Task[]>(manageTasks);
  const [isEditing, setIsEditing] = useState<number>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Save tasks to local storage every time the task list is updated
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;

    const value = input.value;
    if (value.trim() === "") return alert("You must enter a task");

    if (isEditing !== undefined) editTask(value, isEditing);
    else newTask(value);

    input.value = "";
  };

  const newTask = (title: string) => {
    setTasks((prev) => {
      const id = Math.floor(Math.random() * 1000);
      return [
        ...prev,
        {
          title: title,
          id: id,
        },
      ];
    });
  };

  const editTask = (title: string, id: number) => {
    setTasks((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          el.title = title;
        }
        return el;
      })
    );
    setIsEditing(undefined);
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((el) => el.id !== id));
  };

  const deleteTaskList = () => {
    localStorage.removeItem("tasks");
    setTasks([]); // Update task status to an empty array
  }

  const orderTaskList = () => {
    const tasksCopy = [...tasks];

    tasksCopy.sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    });

    setTasks(tasksCopy);
  };

  const handleEdit = (id: number) => {
    setIsEditing(id);
    const input = inputRef.current;

    if (input) {
      input.value = tasks.find((el) => el.id === id)?.title || "";
    }
  };

  const filteredTasks = tasks?.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[990px] w-full mx-auto px-6 text-black">
      <form className="flex justify-center md:flex-row flex-col gap-2" onSubmit={(e) => handleSubmit(e)}>
        <input type="text" placeholder="new task" className="px-4 py-2 px-4 border rounded" ref={inputRef} />
        <button className={isEditing ? "bg-pink-600 px-4 py-2 text-white font-bold py-2 px-4 rounded-full" : "bg-pink-300 py-2 px-4 text-white font-bold py-2 px-4 rounded-full"}>{isEditing ? "Finish task edition" : "Add new task"}</button>
      </form>
 
      <div className="flex justify-center gap-3">
        <button className="w-full md:w-auto my-6 bg-pink-700 px-4 py-2 text-white font-bold py-2 px-4 rounded-full" onClick={orderTaskList}> Order the tasks list </button>
        <button className="w-full md:w-auto my-6 bg-red-400 px-4 py-2 text-white font-bold py-2 px-4 rounded-full" onClick={deleteTaskList}> Delete all tasks</button>
      </div>

      <input
        type="text" className="px-4 py-2 px-4 border rounded flex w-full my-5"
        placeholder="Search tasks"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {tasks && tasks.length > 0 && (
        <ul>
          {filteredTasks.map((el) => (
            <li key={el.id} className="py-2 px-4 border-t border-gray-300 flex items-center justify-between">
              <p className="break-all">
                {el.title}
              </p>
              <div className="flex gap-2">
                <button className="bg-pink-400 px-4 py-2 text-white font-bold py-2 px-4 rounded-full" onClick={() => handleEdit(el.id)}>Edit</button>
                <button className="bg-red-400 px-4 py-2 text-white font-bold py-2 px-4 rounded-full" onClick={() => deleteTask(el.id)}>Delete</button>{" "}
              </div>
            </li>
          ))}
        </ul>
      )}
    
    </div>
  );
};

export default List;
