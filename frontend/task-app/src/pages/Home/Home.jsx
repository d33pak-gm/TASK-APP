import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import TaskCard from "../../components/Cards/TaskCard";
import { MdAdd } from "react-icons/md";
import AddEditTasks from "./AddEditTasks";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddTasksImg from "../../assets/images/add-tasks.svg";
// import { Query } from "mongoose";
import NoDataImg from "../../assets/images/no-data.svg";

Modal.setAppElement("#root");

export default function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allTasks, setAllTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  // Edit task
  const handleEdit = (taskDetails) => {
    setOpenAddEditModal({
      isShown: true,
      data: taskDetails,
      type: "edit",
    });
  };

  // Toast Msg
  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  // Close Toast
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  //Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all tasks
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get("/get-all-tasks");

      if (response.data && response.data.tasks) {
        setAllTasks(response.data.tasks);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Delete Task
  const deleteTask = async (data) => {
    // const taskId = data._id;

    try {
      const response = await axiosInstance.delete(`/delete-task/${data?._id}`);

      if (response.data && !response.data.error) {
        showToastMessage("Task Deleted Successfully", "delete");
        getAllTasks();
      }
    } catch (error) {
      if (
        error.response &&
        error.response?.data &&
        error.response?.data?.message
      ) {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Search for a Task

  const onSearchTask = async (query) => {
    console.log(`onsearchtask pressed: ${query}`);
    try {
      const response = await axiosInstance.get("/search-tasks", {
        params: { query },
      });

      console.log("Search Response:", response.data);

      if (response.data && response.data.tasks) {
        if (response.data.tasks.length === 0) {
          console.log("No tasks found for query:", query); // Debug: Log if no tasks are found
          setAllTasks([]);
        } else {
          setAllTasks(response.data.tasks);
        }
        setIsSearch(true);
      }
    } catch (error) {
      console.log("Error fetching tasks:", error.message);
    }
  };

  // handle Pinning
  const updateIsPinned = async (taskData) => {
    const taskId = taskData._id;
    const currentPinStatus = taskData.isPinned;

    try {
      const response = await axiosInstance.put(
        `/update-task-pinned/${taskId}`,
        {
          // isPinned: !taskId.isPinned,
          isPinned: !currentPinStatus,
        }
      );

      // {
      //   console.log(`isPinned -> ${response?.data?.task?.isPinned}`);
      // }

      if (response.data && response.data.task) {
        {
          response?.data?.task?.isPinned
            ? showToastMessage("Task Pinned Successfully")
            : showToastMessage("Task Unpinned Successfully");
        }
        getAllTasks();
      }
    } catch (error) {
      // console.log(error);
      console.error(
        "Error updating pin status:",
        error.response?.data || error.message
      );
      showToastMessage("Failed to update task pin status", "error");
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllTasks();
  };

  useEffect(() => {
    if (!isSearch) {
      getAllTasks();
    }
    getUserInfo();
    console.log(`isSearch value: ${isSearch}`);
    return () => {};
  }, [isSearch]);

  return (
    <>
      {/*       <Navbar userInfo={userInfo} onSearchTask={onSearchTask} />

      <div className="container mx-auto">
        {allTasks.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allTasks.map((item, index) => (
              <TaskCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteTask(item)}
                onPinTask={() => {}}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={AddTasksImg}
            message={
              "Start creating your first note! Click the 'Add' button jot down your thoughts, ideas, and reminders. Let's get started!"
            }
          />
        )}
      </div> */}

      <Navbar
        userInfo={userInfo}
        onSearchTask={onSearchTask}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {allTasks.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allTasks.map((item, index) => (
              <TaskCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteTask(item)}
                onPinTask={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddTasksImg}
            message={
              isSearch
                ? "Oops ! No tasks found matching your search."
                : "Start creating your first note! Click the 'Add' button jot down your thoughts, ideas, and reminders. Let's get started!"
            }
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditTasks
          type={openAddEditModal.type}
          taskData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({
              isShown: false,
              type: "add",
              data: null,
            });
          }}
          getAllTasks={getAllTasks}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
}
