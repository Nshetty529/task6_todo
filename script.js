document.addEventListener('DOMContentLoaded', () => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priority');
    const taskList = document.getElementById('taskList');
    const themeToggle = document.getElementById('themeToggle');
    const themeBody = document.getElementById('themeBody');

    // Load and apply saved theme preference from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    themeBody.classList.add(savedTheme);

    // Update Theme Toggle Button Text
    function updateThemeToggleButton(currentTheme) {
        themeToggle.textContent = currentTheme === 'dark-mode' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
    updateThemeToggleButton(savedTheme);

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = themeBody.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
        themeBody.classList.remove(currentTheme);
        themeBody.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleButton(newTheme);
    });

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Render tasks on the page
    function renderTasks(filteredTasks = tasks) {
        taskList.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskItem.innerHTML = `
                <span>${task.text} - <strong>${task.priority}</strong> - Due: ${task.dueDate}</span>
                <div>
                    <button onclick="toggleComplete(${index})" class="btn btn-sm ${task.completed ? 'btn-success' : 'btn-outline-success'}">✔</button>
                    <button onclick="deleteTask(${index})" class="btn btn-sm btn-outline-danger">✖</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    // Add Task
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (taskText === '' || dueDate === '' || priority === 'Priority') {
            alert('Please enter task details.');
            return;
        }

        const newTask = {
            text: taskText,
            dueDate: dueDate,
            priority: priority,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = 'Priority';
    });

    // Toggle Complete Task
    window.toggleComplete = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    // Delete Task
    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    // Filter Tasks
    document.getElementById('showAll').addEventListener('click', () => renderTasks(tasks));
    document.getElementById('showCompleted').addEventListener('click', () => renderTasks(tasks.filter(task => task.completed)));
    document.getElementById('showPending').addEventListener('click', () => renderTasks(tasks.filter(task => !task.completed)));

    // Sort Tasks
    document.getElementById('sortByDate').addEventListener('click', () => {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        saveTasks();
        renderTasks();
    });
    document.getElementById('sortByPriority').addEventListener('click', () => {
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        saveTasks();
        renderTasks();
    });

    // Initial Render
    renderTasks();
});
