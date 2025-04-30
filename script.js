document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a');
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
  
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
  });
  