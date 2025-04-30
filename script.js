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
      { id: 1, name: 'Juan Pérez', role: 'Developer' },
      { id: 2, name: 'María García', role: 'QA' },
      { id: 3, name: 'Carlos López', role: 'Project Manager' }
    ];
  
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
  });
  