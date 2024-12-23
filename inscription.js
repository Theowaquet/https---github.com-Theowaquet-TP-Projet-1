document.getElementById('registerButton').addEventListener('click', function(event) {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    if (login === '' || password === '') {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const data = {
        identifiant: login,
        passwd: password
    };

    // Requête inscription
    fetch('http://192.168.65.98:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    
    .then(response => response.json())
    .then(result => {
        alert(result.message);
        if (result.message === 'Inscription réussie.') {
            window.location.href = 'index.html';
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    });
});
