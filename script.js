document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a');
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
  
    // DOM Elements
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const closeModal = modal.querySelector('.close-modal');
    const actionButtons = document.querySelectorAll('.action-btn');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
  
    // Theme management
    const THEME_KEY = 'preferred-theme';
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      localStorage.setItem(THEME_KEY, theme);
    }
  
    function initTheme() {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (prefersDarkScheme.matches) {
        setTheme('dark');
      }
    }
  
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  
    // Initialize theme
    initTheme();
  
    // Mock data for collaborators (in a real app, this would come from an API)
    const mockCollaborators = [
      { 
        id: 1, 
        name: 'Juan Pérez', 
        role: 'Developer',
        startDate: '2023-01-15',
        status: 'active'
      },
      { 
        id: 2, 
        name: 'María García', 
        role: 'QA',
        startDate: '2023-02-20',
        status: 'vacation'
      },
      { 
        id: 3, 
        name: 'Carlos López', 
        role: 'Project Manager',
        startDate: '2023-03-10',
        status: 'active'
      },
      { 
        id: 4, 
        name: 'Ana Martínez', 
        role: 'Developer',
        startDate: '2023-04-05',
        status: 'license'
      },
      { 
        id: 5, 
        name: 'Roberto Sánchez', 
        role: 'QA',
        startDate: '2023-05-12',
        status: 'active'
      }
    ];
  
    // Table management
    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;
    let filteredData = [...mockCollaborators];
    
    const tableBody = document.getElementById('collaborators-table-body');
    const searchInput = document.getElementById('search-collaborator');
    const filterSelect = document.getElementById('filter-status');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const showingCountSpan = document.getElementById('showing-count');
    const totalCountSpan = document.getElementById('total-count');
    
    function renderTable() {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageData = filteredData.slice(start, end);
      
      tableBody.innerHTML = '';
      
      pageData.forEach(collab => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${collab.name}</td>
          <td>${collab.role}</td>
          <td>${formatDate(collab.startDate)}</td>
          <td>
            <span class="status-badge ${collab.status}">
              ${getStatusText(collab.status)}
            </span>
          </td>
          <td class="action-buttons-cell">
            <button class="action-button" title="Ver detalles" onclick="viewDetails(${collab.id})">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-button" title="Editar" onclick="editCollaborator(${collab.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-button" title="Eliminar" onclick="deleteCollaborator(${collab.id})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });
      
      updatePagination();
    }
    
    function updatePagination() {
      const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
      
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
      
      currentPageSpan.textContent = currentPage;
      showingCountSpan.textContent = filteredData.length;
      totalCountSpan.textContent = mockCollaborators.length;
    }
    
    function filterData() {
      const searchTerm = searchInput.value.toLowerCase();
      const statusFilter = filterSelect.value;
      
      filteredData = mockCollaborators.filter(collab => {
        const matchesSearch = collab.name.toLowerCase().includes(searchTerm) ||
                            collab.role.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || collab.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      });
      
      currentPage = 1;
      renderTable();
    }
    
    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    }
    
    function getStatusText(status) {
      switch(status) {
        case 'active': return 'Activo';
        case 'vacation': return 'En vacaciones';
        case 'license': return 'En licencia';
        default: return status;
      }
    }
    
    // Table event listeners
    searchInput.addEventListener('input', filterData);
    filterSelect.addEventListener('change', filterData);
    
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
    
    nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });
    
    // Mock action handlers
    window.viewDetails = (id) => {
      const collab = mockCollaborators.find(c => c.id === id);
      showNotification(`Ver detalles de ${collab.name}`, 'info');
    };
    
    window.editCollaborator = (id) => {
      const collab = mockCollaborators.find(c => c.id === id);
      showNotification(`Editar ${collab.name}`, 'info');
    };
    
    window.deleteCollaborator = (id) => {
      const collab = mockCollaborators.find(c => c.id === id);
      if (confirm(`¿Está seguro de eliminar a ${collab.name}?`)) {
        showNotification(`${collab.name} eliminado`, 'success');
        // In a real app, this would make an API call
      }
    };
    
    // Initialize table
    renderTable();
  
    // Form templates
    const altaFormTemplate = document.getElementById('alta-form-template');
    const bajaFormTemplate = document.getElementById('baja-form-template');
    const licenciaFormTemplate = document.getElementById('licencia-form-template');
  
    function showSection(sectionId) {
      try {
        // Sections
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        
        if (!targetSection) {
          console.error(`Section with id "${sectionId}" not found`);
          return;
        }
        
        targetSection.classList.add('active');
  
        // Sidebar active state
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.parentElement.classList.add('active');
          // Update ARIA attributes
          activeLink.setAttribute('aria-current', 'page');
        }
      } catch (error) {
        console.error('Error showing section:', error);
      }
    }
  
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        showSection(sectionId);
        history.replaceState(null, '', `#${sectionId}`);
        sidebar.classList.remove('open');
        
        // Focus the section for better accessibility
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          targetSection.focus();
        }
      });
    });
  
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      // Update ARIA expanded state
      const isExpanded = sidebar.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
  
    // Handle escape key to close sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  
    // Initialize on load
    const initial = window.location.hash.substring(1) || 'inicio';
    showSection(initial);
  
    // Show modal with form
    function showModal(action) {
      modalTitle.textContent = getModalTitle(action);
      modalBody.innerHTML = '';
      
      let formTemplate;
      switch(action) {
        case 'alta':
          formTemplate = altaFormTemplate;
          break;
        case 'baja':
          formTemplate = bajaFormTemplate;
          break;
        case 'licencia':
          formTemplate = licenciaFormTemplate;
          break;
      }
      
      const form = formTemplate.content.cloneNode(true);
      modalBody.appendChild(form);
      
      // Populate collaborator selects if needed
      if (action === 'baja' || action === 'licencia') {
        const select = modalBody.querySelector('select[name="colaborador"]');
        mockCollaborators.forEach(collab => {
          const option = document.createElement('option');
          option.value = collab.id;
          option.textContent = `${collab.name} (${collab.role})`;
          select.appendChild(option);
        });
      }
      
      modal.classList.add('active');
      
      // Add form submit handler
      const formElement = modalBody.querySelector('form');
      formElement.addEventListener('submit', handleFormSubmit);
    }
    
    // Get modal title based on action
    function getModalTitle(action) {
      switch(action) {
        case 'alta': return 'Registrar Alta de Colaborador';
        case 'baja': return 'Registrar Baja de Colaborador';
        case 'licencia': return 'Registrar Licencia/Vacaciones';
        default: return 'Formulario';
      }
    }
    
    // Handle form submission
    function handleFormSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Validate form data
      if (!validateForm(data)) {
        return;
      }
      
      // Mock API call
      submitFormData(data)
        .then(response => {
          showNotification('Operación completada con éxito', 'success');
          closeModalHandler();
        })
        .catch(error => {
          showNotification('Error al procesar la solicitud', 'error');
        });
    }
    
    // Validate form data
    function validateForm(data) {
      // Basic validation
      for (const [key, value] of Object.entries(data)) {
        if (value.trim() === '' && key !== 'comentarios') {
          showNotification('Por favor complete todos los campos requeridos', 'error');
          return false;
        }
      }
      
      // Date validation for licencia
      if (data['fecha-inicio'] && data['fecha-fin']) {
        const startDate = new Date(data['fecha-inicio']);
        const endDate = new Date(data['fecha-fin']);
        
        if (endDate < startDate) {
          showNotification('La fecha de fin no puede ser anterior a la fecha de inicio', 'error');
          return false;
        }
      }
      
      return true;
    }
    
    // Mock API call
    function submitFormData(data) {
      return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
          console.log('Form data submitted:', data);
          resolve({ success: true });
        }, 1000);
      });
    }
    
    // Show notification
    function showNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
    
    // Close modal handler
    function closeModalHandler() {
      modal.classList.remove('active');
      modalBody.innerHTML = '';
    }
    
    // Event Listeners
    actionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        showModal(action);
      });
    });
    
    closeModal.addEventListener('click', closeModalHandler);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModalHandler();
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModalHandler();
      }
    });
  
    // Settings Management
    const defaultSettings = {
      display: {
        showProfilePic: true,
        showActivityStatus: true,
        showNotifications: true
      },
      table: {
        itemsPerPage: 10,
        defaultSort: 'name',
        visibleColumns: ['name', 'role', 'date', 'status', 'actions']
      },
      notifications: {
        email: true,
        alta: true,
        baja: true,
        licencia: true
      }
    };
  
    // Load settings from localStorage or use defaults
    function loadSettings() {
      const savedSettings = localStorage.getItem('appSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }
  
    // Save settings to localStorage
    function saveSettings(settings) {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    }
  
    // Apply settings to the UI
    function applySettings(settings) {
      // Display settings
      document.getElementById('show-profile-pic').checked = settings.display.showProfilePic;
      document.getElementById('show-activity-status').checked = settings.display.showActivityStatus;
      document.getElementById('show-notifications').checked = settings.display.showNotifications;
  
      // Table settings
      document.getElementById('items-per-page').value = settings.table.itemsPerPage;
      document.getElementById('default-sort').value = settings.table.defaultSort;
  
      // Visible columns
      const columnCheckboxes = document.querySelectorAll('input[name="visible-columns"]');
      columnCheckboxes.forEach(checkbox => {
        checkbox.checked = settings.table.visibleColumns.includes(checkbox.value);
      });
  
      // Notification settings
      document.getElementById('email-notifications').checked = settings.notifications.email;
      document.getElementById('alta-notifications').checked = settings.notifications.alta;
      document.getElementById('baja-notifications').checked = settings.notifications.baja;
      document.getElementById('licencia-notifications').checked = settings.notifications.licencia;
    }
  
    // Get current settings from UI
    function getCurrentSettings() {
      const settings = {
        display: {
          showProfilePic: document.getElementById('show-profile-pic').checked,
          showActivityStatus: document.getElementById('show-activity-status').checked,
          showNotifications: document.getElementById('show-notifications').checked
        },
        table: {
          itemsPerPage: parseInt(document.getElementById('items-per-page').value),
          defaultSort: document.getElementById('default-sort').value,
          visibleColumns: Array.from(document.querySelectorAll('input[name="visible-columns"]:checked'))
            .map(checkbox => checkbox.value)
        },
        notifications: {
          email: document.getElementById('email-notifications').checked,
          alta: document.getElementById('alta-notifications').checked,
          baja: document.getElementById('baja-notifications').checked,
          licencia: document.getElementById('licencia-notifications').checked
        }
      };
      return settings;
    }
  
    // Initialize settings
    document.addEventListener('DOMContentLoaded', () => {
      const settings = loadSettings();
      applySettings(settings);
  
      // Save settings button
      document.getElementById('save-settings').addEventListener('click', () => {
        const currentSettings = getCurrentSettings();
        saveSettings(currentSettings);
        showNotification('Configuración guardada exitosamente', 'success');
      });
  
      // Reset settings button
      document.getElementById('reset-settings').addEventListener('click', () => {
        if (confirm('¿Está seguro de que desea restaurar la configuración por defecto?')) {
          applySettings(defaultSettings);
          saveSettings(defaultSettings);
          showNotification('Configuración restaurada a valores por defecto', 'success');
        }
      });
    });
  });
  