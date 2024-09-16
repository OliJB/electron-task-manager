// Fetch system information and update the UI
async function loadSystemInfo() {
    const systemInfo = await window.systemAPI.getSystemInfo();

    // Update the UI with the fetched data
    document.getElementById('pcHeat').textContent = systemInfo.heat.main !== -1 ? systemInfo.heat.main : 'N/A';

    const usedRam = (systemInfo.totalMemory - systemInfo.freeMemory) / (1024 ** 3);
    document.getElementById('pcRam').textContent = usedRam.toFixed(2) + ' GB';
    const storageUsage = systemInfo.storage[0].use;
    document.getElementById('pcStorage').textContent = storageUsage + '%';
    document.getElementById('pcCpu').textContent = systemInfo.cpuUsage.currentLoad.toFixed(2) + '%';
   
    // Process GPU information (ensure the correct GPU controller is used)
    const nvidiaGpu = systemInfo.gpuUsage.controllers.find(controller => controller.vendor.includes('NVIDIA'));

    if (nvidiaGpu) {
        // Use NVIDIA GPU stats if available
        document.getElementById('pcGpu').textContent = nvidiaGpu.utilizationGpu ? nvidiaGpu.utilizationGpu + '%' : 'N/A';
    } else {
        // If no NVIDIA GPU, use the first available controller as fallback
        const defaultGpu = systemInfo.gpuUsage.controllers[0];
        document.getElementById('pcGpu').textContent = defaultGpu.utilizationGpu ? defaultGpu.utilizationGpu + '%' : 'N/A';
    }

}

// Load system information when the page is loaded
window.onload = loadSystemInfo;


// Function to load and display tasks
async function loadTasks() {
    const tasks = await window.taskAPI.getTasks();
  
    // Get the container where tasks will be listed
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = ''; // Clear any existing tasks
  
    // Create table rows for each task
    tasks.forEach(task => {
      const taskRow = document.createElement('div');
      taskRow.classList.add('task-row');
      taskRow.innerHTML = `
        <div class="task-name">${task.name}</div>
        <div class="task-pid">${task.pid}</div>
        <div class="task-cpu">${task.cpu}%</div>
        <div class="task-mem">${task.mem}%</div>
      `;
      taskContainer.appendChild(taskRow);
    });
  }
  
  // Refresh the tasks list periodically (every 5 seconds)
  setInterval(loadTasks, 5000);
  
  // Load tasks on initial page load
  window.onload = loadTasks;
  