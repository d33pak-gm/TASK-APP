import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

export default function AddEditTasks({
  taskData,
  type,
  onClose,
  getAllTasks,
  showToastMessage,
}) {
  const [title, setTitle] = useState(taskData?.title || "");
  const [content, setContent] = useState(taskData?.content || "");
  const [tags, setTags] = useState(taskData?.tags || []);

  const [error, setError] = useState(null);

  //Add Task
  const addNewTask = async () => {
    try {
      const response = await axiosInstance.post("/add-task", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.task) {
        showToastMessage("Task Added Successfully");
        getAllTasks();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit Task
  const editTask = async () => {
    const taskId = taskData._id;
    try {
      const response = await axiosInstance.put(`/edit-task/${taskId}`, {
        title,
        content,
        tags,
        isPinned: taskData.isPinned,
      });

      if (response.data && response.data.task) {
        showToastMessage("Task Updated Successfully");
        getAllTasks();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddTask = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");

    if (type === "edit") {
      editTask();
    } else {
      addNewTask();
    }
  };

  return (
    <div className=" relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go To Gym At 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddTask}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
}
