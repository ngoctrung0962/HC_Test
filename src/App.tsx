import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import axios from "axios";
import ReactLoading from "react-loading";
import "./App.css";
import { STATUS_RES_API } from "./common/Contants";
import { IStateFormTask, ITask } from "./types/task.model";

import Checkbox from "@mui/material/Checkbox";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";

// Perfact scroll bar
import Button from "@mui/material/Button";
import { RiFilterLine } from "react-icons/ri";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import ModalAddEditTask from "./components/Modal/ModalAddEditTask";

import { FaEdit, FaTrash } from "react-icons/fa";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [listTask, setListTask] = useState<ITask[]>([]);
  const [filterStatus, setFilterStatus] = useState<undefined | boolean>();
  const [stateFormTask, setStateFormTask] = useState<IStateFormTask>({
    open: false,
    type: "add",
    dataEdit: null,
  });
  const getDataTask = async () => {
    setLoading(true);
    try {
      const resTasks = await axios.get(
        "https://638776d1d9b24b1be3f14cd4.mockapi.io/api/v1/tasks"
      );
      if (
        resTasks &&
        resTasks.data &&
        resTasks.status == STATUS_RES_API.GET_OK
      ) {
        setListTask(resTasks.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataTask();
  }, []);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const listOptionFilter = [
    {
      name: "All",
      valueFilterStatus: undefined,
    },
    {
      name: "Completed",
      valueFilterStatus: true,
    },
    {
      name: "Incomplete",
      valueFilterStatus: false,
    },
  ];

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await axios.delete(
        `https://638776d1d9b24b1be3f14cd4.mockapi.io/api/v1/tasks/${id}`
      );
      if (res) {
        setListTask((prev) => prev.filter((item) => item.id != id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChangeStatus = async (item: ITask) => {
    try {
      const res = await axios.put(
        `https://638776d1d9b24b1be3f14cd4.mockapi.io/api/v1/tasks/${item.id}`,
        {
          name: item.name,
          status: !item.status,
        }
      );
      if (res) {
        setListTask((prev) =>
          prev.map((task) =>
            task.id === item.id ? { ...task, status: !item.status } : task
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          boxShadow:
            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
          width: "70vw",
          height: "70vh",
          borderRadius: "16px",
          background: "#fff",
          padding: "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontSize: 28,
              marginBottom: 24,
              fontWeight: 500,
            }}
          >
            Todo list app
          </h3>

          {/*Action  */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Button
              ref={anchorRef}
              aria-controls={open ? "composition-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RiFilterLine
                style={{
                  fontSize: 28,
                  cursor: "pointer",
                }}
              />
            </Button>

            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
              sx={{
                zIndex: 10,
              }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                      >
                        {listOptionFilter?.map((item) => {
                          return (
                            <MenuItem
                              onClick={() => {
                                setFilterStatus(item.valueFilterStatus);
                              }}
                              sx={{
                                background:
                                  filterStatus == item.valueFilterStatus
                                    ? "#f0f0f0"
                                    : "",
                              }}
                            >
                              {item.name}
                            </MenuItem>
                          );
                        })}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <Button
              style={{
                width: "100px",
                height: "50px",
              }}
              variant="contained"
              onClick={() => {
                setStateFormTask({
                  open: true,
                  dataEdit: null,
                  type: "add",
                });
              }}
            >
              Add
            </Button>
          </Box>
        </Box>

        {/*List  */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100% - 100px)",
            maxHeight: "calc(100% - 100px)",
            overflow: "auto",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ReactLoading type="spin" color="#172D9D" />
            </Box>
          ) : (
            <PerfectScrollbar>
              {listTask &&
              listTask.filter((item) => {
                if (filterStatus) {
                  return item.status == filterStatus;
                } else return item;
              })?.length > 0 ? (
                listTask
                  .filter((item) => {
                    if (filterStatus) {
                      return item.status == filterStatus;
                    } else return item;
                  })
                  .map((task, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          boxShadow:
                            "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                          padding: "16px 24px",
                          borderRadius: "6px",
                          border: "1px solid #172D9D",
                          marginBottom: "10px",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          Task name <br /> {task.name}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              background: task.status ? "#1a946f" : "#ff5959",
                              color: "#fff",
                              padding: "7px",
                              borderRadius: "6px",
                              height: 30,
                              display: "flex",
                              alignItems: "center",
                              fontSize: 12,
                            }}
                          >
                            {task.status ? "Completed" : "Incomplete"}
                          </Box>
                          <Checkbox
                            defaultChecked={task.status}
                            checked={task.status}
                            onChange={() => {
                              handleOnChangeStatus(task);
                            }}
                          />
                          <FaEdit
                            onClick={() => {
                              setStateFormTask({
                                open: true,
                                dataEdit: task,
                                type: "edit",
                              });
                            }}
                            style={{
                              color: "#172D9D",
                              fontSize: 20,
                              cursor: "pointer",
                            }}
                          />
                          <FaTrash
                            onClick={() => {
                              handleDeleteTask(task.id);
                            }}
                            style={{
                              color: "red",
                              fontSize: 20,
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                  }}
                >
                  No task
                </Box>
              )}
            </PerfectScrollbar>
          )}

          {stateFormTask?.open && (
            <ModalAddEditTask
              open={stateFormTask.open}
              onClose={() => {
                setStateFormTask({
                  open: false,
                  dataEdit: null,
                  type: "add",
                });
              }}
              dataEdit={stateFormTask.dataEdit}
              setListTask={setListTask}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default App;
