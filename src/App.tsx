import React from 'react';
import './style.css';
import 'react-toastify/dist/ReactToastify.css';
import CardHeader from '@mui/material/CardHeader';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import CancelIcon from '@mui/icons-material/Cancel';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Checkbox from '@mui/material/Checkbox';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';



import FormHelperText from '@mui/material/FormHelperText';

export const App: FC<{ name: string }> = ({ name }) => {
  //array for tasks
  const [taskArray, setTaskArray] = React.useState([]);

  //setting up each task
  const [task, setTask] = React.useState({
    title: '',
    description: '',
    deadline: moment(),
    priority: '',
    complete: false,
  });

  //setting up the dialog
  const [dialog, setDialog] = React.useState(false);

  //keeps track of if we're adding (vs. editing)
  const [adding, setAdding] = React.useState(false);

  // Adds state to track the index being edited
  const [editIndex, setEditIndex] = React.useState(-1); 

  //validator states
  const [titleValidator, setTitleValidator] = React.useState('');
  const [descriptionValidator, setDescriptionValidator] = React.useState('');
  const [priorityValidator, setPriorityValidator] = React.useState('');

  //error states
  const [titleError, setTitleError] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState(false);
  const [priorityError, setPriorityError] = React.useState(false);

  //opens the dialog
  const openDialog = () => {
    setDialog(true);
  };

  //adds a task
  const addItem = () => {
    setAdding(true);
    openDialog();
  };

  //closes the dialog and clears errors
  const handleClose = () => {
    setDialog(false);
    setTitleValidator('');
    setDescriptionValidator('');
    setPriorityValidator('');

    setTitleError(false);
    setDescriptionError(false);
    setPriorityError(false);
  };

  //creates the title for edit or add dialog
  const addOrEditTitle = (addOrEdit) => {
    if (addOrEdit) {
      return (
        <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
          <AddCircleIcon fontSize="small" />
          Add Task
        </DialogTitle>
      );
    } else {
      return (
        <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
          <EditIcon fontSize="small" />
          Edit
        </DialogTitle>
      );
    }
  };

  //allows editing
  const handleEdit = () => {
    if (validateDescription() || validatePriority()) {
      return;
    } else {
      let temp = [...taskArray];
      let taskToEdit = temp[editIndex];
      temp[editIndex] = {
        title: taskToEdit.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        complete: taskToEdit.complete,
      };

      setTaskArray(temp);
      handleClose();
      clear();
    }
  };

  // shows dialog for edit pressed
  const openUpdateDialog = (index) => {
    setAdding(false);
    setEditIndex(index);
    openDialog();
    let taskToEdit = taskArray[index];
    setTask({
      title: taskToEdit.title,
      description: taskToEdit.description,
      deadline: taskToEdit.deadline,
      priority: taskToEdit.priority,
    });
  };

  //creates the add/edit button at bottom of dialog
  const addOrEditButtons = (addOrEdit) => {
    if (addOrEdit) {
      return (
        <Button
          sx={{ bgcolor: 'primary-dark', width: '30%' }}
          onClick={() => addToArray()}
          variant="contained"
        >
          <AddCircleIcon fontSize="small" />
          &nbsp;Add
        </Button>
      );
    } else {
      return (
        <Button
          sx={{ bgcolor: 'primary-dark', width: '30%' }}
          onClick={() => handleEdit()}
          variant="contained"
        >
          <EditIcon fontSize="small" />
          Edit
        </Button>
      );
    }
  };

  //resets the dialog
  const clear = () => {
    setTask({
      title: '',
      description: '',
      deadline: moment(),
      priority: '',
    });
  };

  //adds a task when the button is clicked
  function addToArray() {
    validateDescription();
    validatePriority();
    if (validateTitle() || validateDescription() || validatePriority()) {
      return;
    } else {
      setTaskArray((taskArray) => [...taskArray, task]);
      clear();
      handleClose();
      displaySuccess();
    }
  }

  //handles when complete is toggled
  const handleCheckBox = (index) => (e) => {
    let temp = [...taskArray];
    let taskToEdit = temp[index];
    let boxChecked = taskToEdit.complete;
    temp[index] = {
      title: taskToEdit.title,
      description: taskToEdit.description,
      deadline: taskToEdit.deadline,
      priority: taskToEdit.priority,
      complete: !boxChecked,
    };
    setTaskArray(temp);
  };

  //validates the title
  let validateTitle = () => {
    let title = task.title;
    let error = false;

    /*if the title is empty, set validators*/
    if (title == '') {
      setTitleValidator('Enter title.');
      error = true;
      setTitleError(true);
    } else {
      setTitleError(false);
      setTitleValidator('');
    }

    //sets validators if title is repeat
    for (let i = 0; i < taskArray.length; i++) {
      if (title === taskArray[i].title) {
        setTitleValidator('Title is a duplicate');
        error = true;
        setTitleError(true);
        return error;
      }
    }

    return error;
  };

  //validates description
  let validateDescription = () => {
    let description = task.description;
    let hasError = false;

    //if description is empty, sets error
    if (description == '') {
      setDescriptionValidator('Enter description.');
      hasError = true;
      setDescriptionError(true);
    } else {
      setDescriptionValidator('');
      setDescriptionError(false);
    }

    return hasError;
  };

  let validatePriority = () => {
    let priority = task.priority;
    let hasError = false;

    //if priority empty, sets error
    if (priority == '') {
      setPriorityValidator('Select a priority.');
      hasError = true;
      setPriorityError(true);
    } else {
      setPriorityValidator('');
      setPriorityError(false);
    }
  };

  //success toaster
  const displaySuccess = () => {
    toastr.success('Task added', 'Success', {
      positionClass: 'toast-bottom-right',
    });
  };

  //handles task deletion
  const deleteTask = (index) => {
    let temp = [...taskArray];
    temp.splice(index, 1);
    setTaskArray(temp);
    displayDelete();
  };

  //delete toaster
  const displayDelete = () => {
    toastr.success('Task Deleted', 'Success', {
      positionClass: 'toast-bottom-right',
    });
  };

  return (
    <div>
      {/*sets up title card*/}
      <CardHeader
        
        sx={{
          color: 'white',
          backgroundColor: (theme) => theme.palette.primary.dark,
        }}
        title={
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <MenuIcon sx={{ fontSize: '40px', alignItems: 'center' }} />
            <span style={{ marginLeft: '10px' }}>FRAMEWORKS </span>
          </div>
        }
        style={{ textAlign: 'center' }}
        action={
          <div>
            <Button
              variant="contained"
              onClick={() => {
                addItem();
              }}
              sx={{ marginRight: '10px', width: 125 }}
            >
              <AddCircleIcon sx={{ width: 23 }} />
              ADD
            </Button>
          </div>
        }
      ></CardHeader>
      {/*creates dialog*/}
      <Dialog open={dialog} onClose={handleClose}>
        {addOrEditTitle(adding)}

        <DialogContent>
          {/* includes title if adding */}
          {adding && (
            <>
              <br />
              <TextField
                error={titleError}
                helperText={titleValidator}
                label="Title"
                value={task.title}
                sx={{ width: '100%' }}
                onChange={(e) => {
                  setTask(Object.assign({}, task, { title: e.target.value }));
                }}
              />
            </>
          )}
          <br /> <br />
          {/*Description*/}
          <TextField
            error={descriptionError}
            helperText={descriptionValidator}
            label="Description"
            value={task.description}
            fullWidth
            onChange={(e) => {
              setTask(Object.assign({}, task, { description: e.target.value }));
            }}
          />
          <br /> <br />
          {/*Deadline */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              label="Deadline" 
              value={task.deadline}
              onChange={(date) =>
                setTask(Object.assign({}, task, { deadline: date }))
              }
            />
          </LocalizationProvider>
        </DialogContent>

        {/*Priority*/}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FormControl error={priorityError}>
            <br />
            <FormLabel>Priority</FormLabel>
            <RadioGroup
              row
              value={task.priority}
              onChange={function (e) {
                const updatedTask = { ...task };
                updatedTask.priority = e.target.value;
                setTask(updatedTask);
              }}
            >
              <FormControlLabel value="low" control={<Radio />} label="Low" />
              <FormControlLabel value="med" control={<Radio />} label="Med" />
              <FormControlLabel value="high" control={<Radio />} label="High" />
            </RadioGroup>
            <FormHelperText> {priorityValidator} </FormHelperText>
          </FormControl>
        </div>

        {/*add and edit buttons*/}
        <DialogActions>
          {addOrEditButtons(adding)}

          {/* Cancel button*/}
          <Button
            sx={{ bgcolor: 'red', width: '30%' }}
            onClick={handleClose}
            variant="contained"
          >
            <DoNotDisturbAltIcon fontSize="small" />
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* sets up table structure */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell align="center" sx={{ color: 'gray' }}>
              {' '}
              Title{' '}
            </TableCell>
            <TableCell align="center" sx={{ color: 'gray' }}>
              {' '}
              Description{' '}
            </TableCell>
            <TableCell align="center" sx={{ color: 'gray' }}>
              {' '}
              Deadline
            </TableCell>
            <TableCell align="center" sx={{ color: 'gray' }}>
              {' '}
              Priority{' '}
            </TableCell>
            <TableCell align="center" sx={{ color: 'gray' }}>
              {' '}
              Is Complete
            </TableCell>
            <TableCell align="center" sx={{ color: 'gray' }}>
              {' '}
              Action{' '}
            </TableCell>
          </TableHead>
          <TableBody>
            {taskArray.map((task, index) => (
              <TableRow key={task.title}>
                <TableCell align="center">{task.title}</TableCell>
                <TableCell align="center">{task.description}</TableCell>
                <TableCell align="center">
                  {moment(task.deadline).format('MM/DD/YY')}
                </TableCell>
                <TableCell align="center">{task.priority}</TableCell>
                <TableCell align="center">
                  <Checkbox onChange={handleCheckBox(index)} />
                </TableCell>
                <TableCell align="center">
                  {/*only shows edit button if task is not completed*/}
                  {!task.complete && (
                    <div>
                      <Button
                        variant="contained"
                        onClick={() => openUpdateDialog(index)}
                        sx={{ width: '80%' }}
                      >
                        <EditIcon size="small" />
                        &nbsp; Update
                      </Button>
                    </div>
                  )}

                  <div>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => deleteTask(index)}
                      sx={{ bgcolor: 'red', width: '80%' }}
                    >
                      <CancelIcon fontSize="small" />
                      &nbsp;Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
