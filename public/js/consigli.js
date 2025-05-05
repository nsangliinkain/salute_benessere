document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.consiglio .details').forEach(details => {
        details.style.display = 'none';
    });
    
    const readMoreButtons = document.querySelectorAll('.consiglio button.read-more');
    
    if (readMoreButtons.length > 0) {
        document.querySelectorAll('.consiglio').forEach(consiglio => {
            const button = consiglio.querySelector('button.read-more');
            if (button) {
                button.textContent = 'Leggi di più';
            }
        });
        
        readMoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                const consiglio = this.closest('.consiglio');
                const details = consiglio.querySelector('.details');
                
                consiglio.classList.toggle('expanded');
                
                if (consiglio.classList.contains('expanded')) {
                    details.style.display = 'block';
                    this.textContent = 'Mostra meno';
                } else {
                    details.style.display = 'none';
                    this.textContent = 'Leggi di più';
                }
            });
        });
    }
});