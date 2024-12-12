document.getElementById('mapid').style.height = window.innerHeight + 'px';

// Initialisation de la carte
var mymap = L.map('mapid').setView([48.8566, 2.3522], 13); // Coordonnées de Paris

// Ajout d'une couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

// Ajout d'un marqueur sur la carte
var marker = L.marker([48.8566, 2.3522]).addTo(mymap);

// Ajout d'un popup
marker.bindPopup("<b>Bienvenue à Paris !</b><br>Ceci est un exemple de carte.").openPopup();
