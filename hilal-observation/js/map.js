// Map Management Module
const MapManager = (function() {
    let map;
    let marker;
    
    // Configuration des couches
    const layers = {
        osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }),
        relief: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri'
        }),
        sat: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri'
        })
    };

    // Initialiser la carte
    function initMap() {
        map = L.map('map').setView([36.20534, 5.41173], 10);
        layers.osm.addTo(map);
        
        // Créer le marqueur
        marker = L.marker(map.getCenter(), { draggable: true }).addTo(map);
        
        // Événements
        map.on('click', function(e) {
            setPosition(e.latlng.lat, e.latlng.lng);
        });
        
        marker.on('dragend', function() {
            setPosition(marker.getLatLng().lat, marker.getLatLng().lng);
        });
        
        // Initialiser les boutons de couches
        initLayerButtons();
    }

    // Initialiser les boutons de couches
    function initLayerButtons() {
        document.querySelectorAll('#mapButtons button').forEach(button => {
            button.addEventListener('click', function() {
                switchLayer(this.dataset.layer, this);
            });
        });
    }

    // Changer de couche
    function switchLayer(key, btn) {
        Object.values(layers).forEach(l => {
            if (map.hasLayer(l)) map.removeLayer(l);
        });
        layers[key].addTo(map);
        
        document.querySelectorAll('#mapButtons button').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
    }

    // Définir une position
    function setPosition(lat, lng) {
        // Valider les coordonnées
        if (!isValidCoordinates(lat, lng)) return false;
        
        // Mettre à jour les champs
        document.getElementById('lat').value = lat.toFixed(6);
        document.getElementById('lng').value = lng.toFixed(6);
        
        // Mettre à jour le marqueur
        marker.setLatLng([lat, lng]);
        map.panTo([lat, lng]);
        
        return true;
    }

    // Valider les coordonnées
    function isValidCoordinates(lat, lng) {
        return !isNaN(lat) && !isNaN(lng) && 
               lat >= -90 && lat <= 90 && 
               lng >= -180 && lng <= 180;
    }

    // API publique
    return {
        init: initMap,
        setPosition: setPosition,
        isValidCoordinates: isValidCoordinates,
        getMap: () => map
    };
})();