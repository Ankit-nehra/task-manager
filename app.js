const taskForm = document.getElementById('task-form');
const editForm = document.getElementById('edit-form');
const taskList = document.getElementById('task-list');
const editTitle = document.getElementById('edit-title');
const editDescription = document.getElementById('edit-description');
const editCompleted = document.getElementById('edit-completed');

let editingTaskId = null;
const loadTasks = async (title = '') => {
  let url = '/tasks';
  if (title) {
    url += `?title=${encodeURIComponent(title)}`;
  }

  const res = await fetch(url);
  const tasks = await res.json();

  taskList.innerHTML = '';

  if (Array.isArray(tasks)) {
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${task.title}</strong>: ${task.description}
        <br />
        Status: ${task.completed ? '✅ Completed' : '❌ Not Completed'}
        <br />
        <button onclick="getTask('${task._id}')">📄 View</button>
        <button onclick="editTask('${task._id}', '${task.title}', '${task.description}', ${task.completed})">✏️ Edit</button>
        <button onclick="deleteTask('${task._id}')">🗑️ Delete</button>
      `;
      taskList.appendChild(li);
    });
  } else {
    taskList.innerHTML = '<li>No tasks found</li>';
  }
};


const getTask = async (id) => {
  try {
    const res = await fetch(`/tasks/${id}`);
    if (!res.ok) {
      alert('❌ Task not found');
      return;
    }
    const task = await res.json();
    alert(`📄 Task Details:\n\nTitle: ${task.title}\nDescription: ${task.description}\nCompleted: ${task.completed ? 'Yes' : 'No'}\nCreated At: ${new Date(task.createdAt).toLocaleString()}`);
  } catch (err) {
    console.error('Error fetching task:', err);
    alert('Something went wrong');
  }
};


taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });
  taskForm.reset();
  loadTasks();
});

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('search-title').value;
  loadTasks(title);
});


const deleteTask = async (id) => {
  await fetch(`/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
};

const editTask = (id, title, description, completed) => {
  editingTaskId = id;
  editForm.style.display = 'block';
  editTitle.value = title;
  editDescription.value = description;
  editCompleted.checked = completed;
};

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const updatedTask = {
    title: editTitle.value,
    description: editDescription.value,
    completed: editCompleted.checked
  };
  await fetch(`/tasks/${editingTaskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask)
  });
  editForm.reset();
  editForm.style.display = 'none';
  editingTaskId = null;
  loadTasks();
});

const cancelEdit = () => {
  editingTaskId = null;
  editForm.reset();
  editForm.style.display = 'none';
};

loadTasks();
