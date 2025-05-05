document.addEventListener('DOMContentLoaded', function() {
    const bmiForm = document.getElementById('bmi-form');
    const risultatoBmi = document.getElementById('risultato-bmi');
    
    if (bmiForm) {
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const altezza = parseFloat(document.getElementById('altezza').value);
            const peso = parseFloat(document.getElementById('peso').value);
            
            if (isNaN(altezza) || isNaN(peso) || altezza <= 0 || peso <= 0) {
                mostraRisultato('Per favore, inserisci valori validi per altezza e peso.', 'errore');
                return;
            }

            const altezzaMetri = altezza / 100;
            const bmi = peso / (altezzaMetri * altezzaMetri);
            const bmiArrotondato = Math.round(bmi * 10) / 10;
            
            let categoria, classeColore;
            
            if (bmi < 16.5) {
                categoria = 'Grave Sottopeso';
                classeColore = 'bmi-sottopeso';
            } else if (bmi < 18.5) {
                categoria = 'Sottopeso';
                classeColore = 'bmi-sottopeso';
            } else if (bmi < 25) {
                categoria = 'Normopeso';
                classeColore = 'bmi-normopeso';
            } else if (bmi < 30) {
                categoria = 'Sovrappeso';
                classeColore = 'bmi-sovrappeso';
            } else if (bmi < 35) {
                categoria = 'Obesità di I grado';
                classeColore = 'bmi-obesita';
            } else if (bmi < 40) {
                categoria = 'Obesità di II grado';
                classeColore = 'bmi-obesita';
            } else {
                categoria = 'Obesità di III grado';
                classeColore = 'bmi-obesita';
            }
            const messaggio = `Il tuo BMI è ${bmiArrotondato} (${categoria})`;
            mostraRisultato(messaggio, classeColore);
        });
    }
    
    function mostraRisultato(messaggio, classeStile) {
        risultatoBmi.className = 'risultato mostrato';
        if (classeStile) {
            risultatoBmi.classList.add(classeStile);
        }
        risultatoBmi.textContent = messaggio;
        risultatoBmi.style.display = 'block';
        risultatoBmi.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});