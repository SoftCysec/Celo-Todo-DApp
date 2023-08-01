// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    struct Task {
        string content;
        bool isCompleted;
    }

    Task[] public tasks;
    mapping(address => uint256[]) private userTasks;

    // Simple ERC20-like token for gas payments
    mapping(address => uint256) public balanceOf;
    string public constant name = "TodoToken";
    string public constant symbol = "TODO";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    event TaskCreated(uint256 taskId, address indexed user, string content);
    event TaskCompleted(uint256 taskId, address indexed user);
    event TaskDeleted(uint256 taskId, address indexed user);

    constructor() public {
        totalSupply = 1000000 * (10**uint256(decimals)); // Initialize the total supply of tokens
        balanceOf[msg.sender] = totalSupply; // Set the contract deployer as the initial token holder
    }

    modifier onlyTaskOwner(uint256 taskId) {
        require(userTasks[msg.sender].length > 0, "You don't have any tasks.");
        bool isOwner;
        for (uint256 i = 0; i < userTasks[msg.sender].length; i++) {
            if (userTasks[msg.sender][i] == taskId) {
                isOwner = true;
                break;
            }
        }
        require(isOwner, "You are not the owner of this task.");
        _;
    }

    function createTask(string calldata _content) external {
        tasks.push(Task(_content, false));
        userTasks[msg.sender].push(tasks.length - 1);
        emit TaskCreated(tasks.length - 1, msg.sender, _content);
    }

    function toggleCompleted(uint256 _taskId) external onlyTaskOwner(_taskId) {
        Task storage task = tasks[_taskId];
        task.isCompleted = !task.isCompleted;
        emit TaskCompleted(_taskId, msg.sender);
    }

    function deleteTask(uint256 _taskId) external onlyTaskOwner(_taskId) {
        Task storage task = tasks[_taskId];
        task.content = "";
        task.isCompleted = false;
        emit TaskDeleted(_taskId, msg.sender);
    }

    function getTaskCount() external view returns (uint256) {
        return tasks.length;
    }

    function getTask(uint256 _taskId) external view returns (string memory content, bool isCompleted) {
        Task storage task = tasks[_taskId];
        return (task.content, task.isCompleted);
    }

    function getUserTasks() external view returns (uint256[] memory) {
        return userTasks[msg.sender];
    }

    function getTotalTasks() external view returns (uint256) {
        return tasks.length;
    }

    function getTotalCompletedTasks() external view returns (uint256) {
        uint256 count;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].isCompleted) {
                count++;
            }
        }
        return count;
    }

    function getTotalPendingTasks() external view returns (uint256) {
        uint256 count;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (!tasks[i].isCompleted) {
                count++;
            }
        }
        return count;
    }

    function getTotalDeletedTasks() external view returns (uint256) {
        uint256 count;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (bytes(tasks[i].content).length == 0) {
                count++;
            }
        }
        return count;
    }
}
