document.getElementById('submitButton').addEventListener('click', function() {
    const login = document.getElementById('login').value;
    const passwd = document.getElementById('password').value;

    if (login === '' || passwd === '') {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const data = { login, passwd };

    // Requête connexion
    fetch('http://192.168.65.98:80/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            throw new Error('La réponse du serveur n\'est pas au format JSON');
        }
    })
    .then(result => {
        if (result.token) {
            localStorage.setItem('token', result.token);
            alert('Connexion réussie!');
            window.location.href = 'connected.html';
        } else {
            alert(result.message || 'Erreur de connexion');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    });
});
