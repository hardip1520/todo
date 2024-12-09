import { Component } from "react";
import {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
} from "./services/taskServices";

class Tasks extends Component {
    state = { tasks: [], currentTask: "" };

    async componentDidMount() {
        try {
            const { data } = await getTasks();
            console.log("Fetched data:", data); // Debugging
            this.setState({ tasks: Array.isArray(data) ? data : [] });
        } catch (error) {
            console.error("Error fetching tasks:", error.response?.data || error.message);
            this.setState({ tasks: [] });
        }
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState({ currentTask: input.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const originalTasks = this.state.tasks;
        try {
            const { data } = await addTask({ task: this.state.currentTask });
            const tasks = [...originalTasks, data]; // Avoid direct mutation
            this.setState({ tasks, currentTask: "" });
        } catch (error) {
            console.error("Error adding task:", error.response?.data || error.message);
        }
    };

    handleUpdate = async (currentTask) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = [...originalTasks];
            const index = tasks.findIndex((task) => task._id === currentTask);
            tasks[index] = { ...tasks[index] };
            tasks[index].completed = !tasks[index].completed;
            this.setState({ tasks });
            await updateTask(currentTask, {
                completed: tasks[index].completed,
            });
        } catch (error) {
            this.setState({ tasks: originalTasks }); // Rollback state
            console.error("Error updating task:", error.response?.data || error.message);
        }
    };

    handleDelete = async (currentTask) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = originalTasks.filter(
                (task) => task._id !== currentTask
            );
            this.setState({ tasks });
            await deleteTask(currentTask);
        } catch (error) {
            this.setState({ tasks: originalTasks }); // Rollback state
            console.error("Error deleting task:", error.response?.data || error.message);
        }
    };
}

export default Tasks;
