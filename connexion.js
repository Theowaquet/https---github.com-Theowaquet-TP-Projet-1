document.getElementById('submitButton').addEventListener('click', function() {
    const login = document.getElementById('login').value;
    const passwd = document.getElementById('password').value;

    if (login === '' || passwd === '') {
        alert('Veuillez remplir tous les champs');
        return;
    }

    console.log(login);
    console.log(passwd);
    const data = { login, passwd };

    // Requête connexion
    fetch('http://192.168.65.98:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.token) {
            localStorage.setItem('token', result.token);
            alert('Connexion réussie!');
            window.location.href = 'map.html';
        } else {
            alert(result.message || 'Erreur de connexion');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    });
});

