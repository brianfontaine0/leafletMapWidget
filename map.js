(function () {
  // Récupérer les options de configuration depuis customWidgetConfig
  var options = window.customWidgetConfig || {};

  var mapLat = options.mapLat || 48.8566; // Latitude par défaut : Paris
  var mapLng = options.mapLng || 2.3522;  // Longitude par défaut : Paris
  var mapZoom = options.mapZoom || 13;    // Zoom par défaut
  var markers = options.mapMarkers || [
    {lat: 48.8566, lng: 2.3522, popup: "Bienvenue à Paris!"}
  ]; // Marqueur par défaut

  // Charger le CSS de Leaflet
  var leafletCSS = document.createElement('link');
  leafletCSS.rel = 'stylesheet';
  leafletCSS.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
  document.head.appendChild(leafletCSS);

  // Charger le JS de Leaflet
  var leafletJS = document.createElement('script');
  leafletJS.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
  leafletJS.async = true;
  document.head.appendChild(leafletJS);

  leafletJS.onload = function() {
    // Créer la div pour la carte si elle n'existe pas
    var mapDiv = document.getElementById('map');
    if (!mapDiv) {
      mapDiv = document.createElement('div');
      mapDiv.id = 'map';
      mapDiv.style.height = '400px'; // Hauteur par défaut
      mapDiv.style.width = '100%';   // Largeur par défaut
      document.body.appendChild(mapDiv);
    }

    // Initialiser la carte
    var map = L.map('map').setView([mapLat, mapLng], mapZoom);

    // Ajouter une couche de tuiles (tile layer)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Ajouter les marqueurs spécifiés par l'utilisateur
    markers.forEach(function(marker) {
      var m = L.marker([marker.lat, marker.lng]).addTo(map);
      if (marker.popup) {
        m.bindPopup(marker.popup);
      }
    });
  };

  // Pour signaler le démarrage du widget
  var customWidget = (window.customWidget = window.customWidget || []);
  customWidget.push({
    startTime: new Date().getTime(),
    event: "widget.Start",
  });

})();
