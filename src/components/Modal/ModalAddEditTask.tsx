import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { ITask } from "../../types/task.model";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import axios from "axios";
import { STATUS_RES_API } from "../../common/Contants";
import LoadingButton from "@mui/lab/LoadingButton";
type Props = {
  open: boolean;
  onClose: () => void;
  setListTask: React.Dispatch<React.SetStateAction<ITask[]>>;
  dataEdit: ITask | null;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalAddEditTask = ({ open, onClose, dataEdit, setListTask }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: dataEdit ? dataEdit : {},
  });

  const [isLoading, setLoading] = React.useState<boolean>(false);
  const onSubmit = async (data: ITask) => {
    if (dataEdit) {
      handleEditTask(data);
    } else {
      handleAddTask(data);
    }
  };

  const handleAddTask = async (data: ITask) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://638776d1d9b24b1be3f14cd4.mockapi.io/api/v1/tasks",
        data
      );
      if (res && res.status == STATUS_RES_API.ADD_OK) {
        setListTask((prev: ITask[]) => {
          return [...prev, res.data];
        });
        reset();
        onClose();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleEditTask = async (data: ITask) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `https://638776d1d9b24b1be3f14cd4.mockapi.io/api/v1/tasks/${data.id}`,
        {
          name: data.name,
          status: data.status,
        }
      );
      if (res) {
        setListTask((prev) =>
          prev.map((task) =>
            task.id === data.id
              ? { ...task, status: data.status, name: data.name }
              : task
          )
        );
        reset();
        onClose();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{dataEdit ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent sx={{ width: "500px" }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <TextField
            label="Task Name"
            variant="outlined"
            {...register("name", { required: true })}
            fullWidth
            error={errors && errors.name ? true : false}
          />
          {errors && errors.name && (
            <p
              style={{
                fontSize: "11px",
                color: "red",
              }}
            >
              {"Task name is requried"}
            </p>
          )}
          <FormControlLabel
            control={
              <Checkbox
                {...register("status")}
                defaultChecked={getValues("status")}
              />
            }
            label="Completed"
          />
          <DialogActions>
            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              loading={isLoading}
              variant="contained"
            >
              {dataEdit ? "Edit Task" : "Add Task"}
            </LoadingButton>
            <Button onClick={onClose} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddEditTask;
