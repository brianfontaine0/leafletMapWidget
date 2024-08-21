(async function () {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  function loadStylesheet(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = () => resolve(link);
      link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
      document.head.appendChild(link);
    });
  }

  async function initializeMap() {
    try {
      await loadStylesheet("https://unpkg.com/leaflet/dist/leaflet.css");
      await loadStylesheet("https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css");
      await loadScript("https://unpkg.com/leaflet/dist/leaflet.js");
      await loadScript("https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js");

      console.log("Leaflet et Leaflet.markercluster chargés");

      const {
        mapLat: lat,
        mapLng: lng,
        mapZoom: zomms,
        mapMarkers,
        markerIconUrl: icon // URL de l'image pour les marqueurs
      } = window.customWidgetConfig;

      // Ajouter des styles CSS personnalisés pour les clusters
      const style = document.createElement('style');
      style.innerHTML = `
        .marker-cluster {
          background: rgba(0, 102, 204, 0.6); /* Couleur de fond du cluster */
          border-radius: 50%;
          color: white;
          font-size: 12px;
          line-height: 1.2;
          text-align: center;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(0, 102, 204, 0.8); /* Couleur de bordure du cluster */
        }
      `;
      document.head.appendChild(style);

      // Récupérer les paramètres de l'utilisateur
      const mapLat = lat || 48.8566; // Latitude par défaut : Paris
      const mapLng = lng || 2.3522; // Longitude par défaut : Paris
      const mapZoom = zomms || 13; // Zoom par défaut

      const markers = mapMarkers || [
        { lat: 48.8566, lng: 2.3522, popup: "Bienvenue à Paris!" },
      ]; // Marqueur par défaut

      // URL de l'image pour les marqueurs
      const markerIconUrl = icon || 'https://emassi.fr/wp-content/uploads/2017/10/Map-Marker-PNG-File.png';

      // Créer la div pour la carte si elle n'existe pas
      let mapDiv = document.getElementById("map");
      if (!mapDiv) {
        mapDiv = document.createElement("div");
        mapDiv.id = "map";
        mapDiv.style.height = "400px"; // Hauteur par défaut
        mapDiv.style.width = "100%"; // Largeur par défaut
        document.body.appendChild(mapDiv);
      }

      // Initialiser la carte
      const map = L.map("map").setView([mapLat, mapLng], mapZoom);

      // Ajouter une couche de tuiles (tile layer)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Créer un cluster de marqueurs avec des options personnalisées
      const markersCluster = L.markerClusterGroup({
        // Options personnalisées pour les clusters
        iconCreateFunction: function (cluster) {
          return L.divIcon({
            html: `<div class="marker-cluster">${cluster.getChildCount()}</div>`,
            className: 'custom-cluster-icon', // Optionnel, si vous souhaitez ajouter plus de styles
            iconSize: L.point(40, 40)
          });
        }
      });

      // Définir l'icône du marqueur
      const customIcon = L.icon({
        iconUrl: markerIconUrl,
        iconSize: [32, 32], // Taille de l'icône (ajustez selon vos besoins)
        iconAnchor: [16, 32], // Point de l'icône qui correspond à la position du marqueur
        popupAnchor: [0, -32] // Point à partir duquel le popup doit s'ouvrir
      });

      // Ajouter les marqueurs spécifiés par l'utilisateur au cluster
      markers.forEach(function (marker) {
        const m = L.marker([marker.lat, marker.lng], { icon: customIcon });
        if (marker.popup) {
          m.bindPopup(marker.popup);
        }
        markersCluster.addLayer(m);
      });

      // Ajouter le cluster à la carte
      map.addLayer(markersCluster);
      
      // Ajuster la vue pour inclure tous les marqueurs du groupe
      map.fitBounds(markersCluster.getBounds());
    } catch (error) {
      console.error('Erreur lors du chargement des scripts ou de l\'initialisation de la carte:', error);
    }
  }
  
  // Initialiser la carte
  await initializeMap();
})();
