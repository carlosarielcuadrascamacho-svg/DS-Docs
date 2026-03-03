/* ==========================================================================
   LÓGICA DE INTERFAZ - PORTAFOLIO DE CIENCIA DE DATOS
   Archivo: js/main.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INICIALIZAR ANIMACIONES (AOS) ---
    // Aseguramos que AOS esté disponible antes de inicializar
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,    // Duración de la animación en ms
            once: true,       // Si es true, la animación solo ocurre la primera vez que se scrollea
            offset: 100,      // Desplazamiento (en px) desde el elemento original
            easing: 'ease-in-out'
        });
    }

    // --- 2. GESTIÓN DEL TEMA (MODO OSCURO / CLARO) ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // Verificar si el usuario ya tenía una preferencia guardada
    const savedTheme = localStorage.getItem('ds-theme') || 'light';
    
    // Aplicar el tema inicial
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Evento de clic para cambiar el tema
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Actualizar el DOM y guardar en el almacenamiento local
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('ds-theme', newTheme);
            updateThemeIcon(newTheme);

            // Emitir un evento personalizado para que las gráficas (Chart.js) se enteren del cambio
            // Esto es crucial para que charts.js pueda repintar los ejes sin estar en este mismo archivo
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
        });
    }

    // Función auxiliar para cambiar el icono del sol/luna
    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeIcon.style.color = '#fbbf24'; // Color amarillo para el sol
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeIcon.style.color = 'inherit';
        }
    }

    // --- 3. BOTONES DE COPIAR CÓDIGO ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Encontrar el bloque de código hermano del botón
            const codeBlock = btn.nextElementSibling;
            if (!codeBlock) return;
            
            const codeText = codeBlock.innerText;
            
            // Usar la API del portapapeles
            navigator.clipboard.writeText(codeText).then(() => {
                // Feedback visual: Cambiar icono temporalmente a un check
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
                btn.style.backgroundColor = 'var(--accent-color)';
                btn.style.color = '#ffffff';
                btn.style.borderColor = 'var(--accent-color)';
                
                // Restaurar después de 2 segundos
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar el código: ', err);
                btn.innerHTML = '<i class="fas fa-times"></i> Error';
            });
        });
    });

});

// --- 4. LÓGICA DE PESTAÑAS (TABS) PARA EXPLICACIONES ---
// Esta función está fuera del DOMContentLoaded para poder ser llamada desde los atributos onclick del HTML
function switchTab(element, targetId) {
    // 1. Manejar el estado visual de los botones (pestañas)
    const tabContainer = element.parentElement;
    const allTabs = tabContainer.querySelectorAll('.tab');
    
    allTabs.forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');
    
    // 2. Manejar la visualización del contenido
    // Buscamos el contenedor padre general (la tarjeta) para no afectar pestañas de otras tarjetas
    const cardContainer = element.closest('.card') || document;
    
    // Ocultar todos los contenidos relacionados a este grupo de pestañas
    // Asumimos que los IDs tienen un formato como "sencillo-2" y "examen-2"
    const baseId = targetId.split('-')[1]; 
    if (baseId) {
        const contentSencillo = cardContainer.querySelector(`#sencillo-${baseId}`);
        const contentExamen = cardContainer.querySelector(`#examen-${baseId}`);
        
        if (contentSencillo) contentSencillo.style.display = 'none';
        if (contentExamen) contentExamen.style.display = 'none';
    }
    
    // Mostrar el contenido objetivo
    const targetContent = cardContainer.querySelector(`#${targetId}`);
    if (targetContent) {
        // Usamos una pequeña animación de desvanecimiento usando CSS y JS
        targetContent.style.opacity = '0';
        targetContent.style.display = 'block';
        setTimeout(() => {
            targetContent.style.transition = 'opacity 0.3s ease';
            targetContent.style.opacity = '1';
        }, 10);
    }
}