// src/pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import TaskItem from '../components/TaskItem';
import { ContractKit, newKitFromWeb3 } from '@celo/contractkit'; // Import from @celo/contractkit
import dotenv from 'dotenv';

dotenv.config();

const contractABI = require('../../build/TodoList.abi.json'); // Import the contract's ABI
const contractAddress = process.env.CONTRACT_ADDRESS; // Add the contract address here

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [taskContent, setTaskContent] = useState('');
  
    useEffect(() => {
      async function fetchTasks() {
        try {
          const kit = newKitFromWeb3(new Web3(window.ethereum)); // Create ContractKit instance
  
          const contract = new kit.web3.eth.Contract(contractABI, contractAddress);
  
          const taskCount = await contract.methods.getTaskCount().call();
          const fetchedTasks = [];
  
          for (let i = 1; i <= taskCount; i++) {
            const task = await contract.methods.getTask(i).call();
            fetchedTasks.push(task.content);
          }
  
          setTasks(fetchedTasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }
  
      fetchTasks();
    }, []);
  
    const handleAddTask = async () => {
      try {
        const kit = newKitFromWeb3(new Web3(window.ethereum)); // Create ContractKit instance
  
        const contract = new kit.web3.eth.Contract(contractABI, contractAddress);
  
        // Call the contract method to add a task
        await contract.methods.createTask(taskContent).send({ from: window.ethereum.selectedAddress });
  
        // Refresh the tasks after adding a new one
        setTasks([...tasks, taskContent]);
        setTaskContent('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    };
  
    const handleDeleteTask = async (index) => {
      try {
        const kit = newKitFromWeb3(new Web3(window.ethereum)); // Create ContractKit instance
  
        const contract = new kit.web3.eth.Contract(contractABI, contractAddress);
  
        // Call the contract method to delete a task
        await contract.methods.deleteTask(index + 1).send({ from: window.ethereum.selectedAddress });
  
        // Refresh the tasks after deleting
        const updatedTasks = [...tasks];
        updatedTasks.splice(index, 1);
        setTasks(updatedTasks);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };
  
    return (
      <div className="container mx-auto p-4">
        <Head>
          <title>To-Do List DApp</title>
        </Head>
        <h1 className="text-2xl font-semibold mb-4">To-Do List</h1>
        <div className="mb-4">
          <input
            type="text"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            placeholder="Enter a task..."
          />
          <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
            Add Task
          </button>
        </div>
        <ul>
          {tasks.map((task, index) => (
            <TaskItem key={index} task={task} onDelete={() => handleDeleteTask(index)} />
          ))}
        </ul>
      </div>
    );
};
  
export default Home;