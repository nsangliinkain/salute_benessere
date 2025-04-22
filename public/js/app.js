document.addEventListener("DOMContentLoaded", () => {
    includeHTML("header", "/header.html").then(() => {
        setPageTitle();
    });
    includeHTML("footer", "/footer.html");
    caricaCitazione();
    espandiConsigli();
    loadExercises();
    const parteCorpo = document.getElementById('body-part-select');
    if (parteCorpo) {
        parteCorpo.addEventListener('change', (e) => {
            loadExercises(e.target.value);
        });
    }
});

function includeHTML(elementId, file) {
    return fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => {
            console.error(`Error loading ${file}:`, error);
        });
}

function setPageTitle() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const pageTitle = document.getElementById("page-title");
    const pageParagraph = document.getElementById("page-paragraph");
    
    switch(currentPage) {
        case "index.html":
        case "":
            pageTitle.textContent = "Vivi Meglio";
            pageParagraph.textContent = "Il tuo spazio per ritrovare equilibrio, salute e benessere ogni giorno.";
            break;
        case "consigli":
            pageTitle.textContent = "Consigli per il tuo benessere";
            pageParagraph.textContent = "Piccoli gesti quotidiani per migliorare la tua salute fisica e mentale.";
            break;
        case "bmi":
            pageTitle.textContent = "Calcola BMI";
            pageParagraph.textContent = "Body Mass Index: cos'é e calcola il tuo BMI.";
            break;
        case "test":
            pageTitle.textContent = "Test Benessere";
            pageParagraph.textContent = "Scopri il tuo stato di benessere con il nostro test.";
            break;
        case "contatti":
            pageTitle.textContent = "Contatti";
            pageParagraph.textContent = "Hai domande o suggerimenti? Contattaci!";
            break;
        case "conferma":
            break;
        default:
            pageTitle.textContent = "Benvenuti";
    }
}

function caricaCitazione() {
    const citatione = document.getElementById('citazione');
    if (!citatione) return; // Skip if element doesn't exist on current page
    
    citatione.innerText = "Caricamento citazione...";
    
    fetch('/api/quotes')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && data[0]) {
            citatione.innerText = `"${data[0].q}" – ${data[0].a}`;
        } else {
            citatione.innerText = "Non è stato possibile trovare una citazione.";
        }
    })
    .catch(error => {
        console.error('Error fetching quote:', error);
        citatione.innerText = "Non è stato possibile caricare una citazione.";
    });
}

function espandiConsigli() {
    const readMoreButtons = document.querySelectorAll('.consiglio button.read-more');
    
    if (readMoreButtons.length > 0) {
        document.querySelectorAll('.consiglio').forEach(consiglio => {
            const button = consiglio.querySelector('button.read-more');
            if (button) {
                if (consiglio.classList.contains('expanded')) {
                    button.textContent = 'Mostra meno';
                } else {
                    button.textContent = 'Leggi di più';
                }
            }
        });
        
        readMoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                const consiglio = this.closest('.consiglio');
                consiglio.classList.toggle('expanded');
                
                if (consiglio.classList.contains('expanded')) {
                    this.textContent = 'Mostra meno';
                } else {
                    this.textContent = 'Leggi di più';
                }
            });
        });
    }
}

// Funzione per caricare esercizi
async function loadExercises(bodyPart = '') {
    try {
        let url = '/api/exercises';
        if (bodyPart) {
            url = `/api/exercises/bodyPart/${bodyPart}`;
        }
        const response = await fetch(url);
        const exercises = await response.json();
        displayExercises(exercises);
    } catch (error) {
        console.error('Errore:', error);
        document.getElementById('exercise-container').innerHTML = 
        '<p>Si è verificato un errore nel caricare gli esercizi. Riprova più tardi.</p>';
    }
}
  
  // Funzione per visualizzare gli esercizi
function displayExercises(exercises) {
    const container = document.getElementById('exercise-container');
    container.innerHTML = '';

    exercises.slice(0, 10).forEach(exercise => {
        const exerciseCard = document.createElement('div');
        exerciseCard.className = 'exercise-card';
        exerciseCard.innerHTML = `
        <h3>${exercise.name}</h3>
        <p><strong>Parte del corpo:</strong> ${exercise.bodyPart}</p>
        <p><strong>Gruppo muscolare:</strong> ${exercise.target}</p>
        <p><strong>Attrezzatura:</strong> ${exercise.equipment}</p>
        <img src="${exercise.gifUrl}" alt="${exercise.name}" />
        <div class="instructions">
            <h4>Istruzioni:</h4>
            <p>${exercise.instructions ? exercise.instructions.join('</p><p>') : 'Nessuna istruzione disponibile'}</p>
        </div>
        `;
        container.appendChild(exerciseCard);
    });
}
