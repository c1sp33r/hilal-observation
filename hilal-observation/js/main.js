// Main Application Module
const HilalApp = (function() {
    // Variables d'état
    let isInitialized = false;
    
    // Initialiser l'application
    function init() {
        if (isInitialized) return;
        
        // Initialiser la date
        document.getElementById('date').valueAsDate = new Date();
        
        // Initialiser les modules
        LanguageManager.init();
        MapManager.init();
        PanoramaManager.init();
        
        // Initialiser les événements
        initEvents();
        
        // Charger la position par défaut
        loadDefaultPosition();
        
        isInitialized = true;
    }
    
    // Initialiser les événements
    function initEvents() {
        // Bouton de localisation
        document.getElementById('locationBtn').addEventListener('click', getUserLocation);
        
        // Bouton de mise à jour
        document.getElementById('updateBtn').addEventListener('click', syncFromInputs);
        
        // Recherche de lieu
        document.getElementById('locationSearch').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchLocation();
            }
        });
        
        // Validation des coordonnées
        document.getElementById('lat').addEventListener('change', validateCoordinates);
        document.getElementById('lng').addEventListener('change', validateCoordinates);
        
        // Fermer les résultats de recherche
        document.addEventListener('click', function(e) {
            const searchResults = document.getElementById('searchResults');
            const searchInput = document.getElementById('locationSearch');
            
            if (!searchResults.contains(e.target) && e.target !== searchInput) {
                searchResults.style.display = 'none';
            }
        });
    }
    
    // Charger la position par défaut
    async function loadDefaultPosition() {
        const lat = parseFloat(document.getElementById('lat').value);
        const lng = parseFloat(document.getElementById('lng').value);
        
        if (MapManager.isValidCoordinates(lat, lng)) {
            await fetchLocationName(lat, lng);
            await fetchElevation(lat, lng);
        }
    }
    
    // Synchroniser depuis les inputs
    function syncFromInputs() {
        const lat = parseFloat(document.getElementById('lat').value);
        const lng = parseFloat(document.getElementById('lng').value);
        
        if (!MapManager.isValidCoordinates(lat, lng)) {
            showValidationError();
            return;
        }
        
        if (MapManager.setPosition(lat, lng)) {
            updateAll();
        }
    }
    
    // Obtenir la position de l'utilisateur
    function getUserLocation() {
        if (!navigator.geolocation) {
            alert(LanguageManager.getTranslations().geolocationError || 
                  "La géolocalisation n'est pas supportée.");
            return;
        }
        
        const locationBtn = document.getElementById('locationBtn');
        const originalText = locationBtn.textContent;
        const t = LanguageManager.getTranslations();
        
        locationBtn.textContent = t.searchLoading;
        locationBtn.disabled = true;
        document.getElementById('locationName').value = t.searchLoading;
        
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                document.getElementById('lat').value = lat.toFixed(6);
                document.getElementById('lng').value = lng.toFixed(6);
                
                await fetchLocationName(lat, lng);
                await fetchElevation(lat, lng);
                
                if (MapManager.setPosition(lat, lng)) {
                    updateAll();
                    MapManager.getMap().setView([lat, lng], 12);
                }
                
                locationBtn.textContent = originalText;
                locationBtn.disabled = false;
            },
            function(error) {
                handleGeolocationError(error);
                locationBtn.textContent = originalText;
                locationBtn.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }
    
    // Gérer les erreurs de géolocalisation
    function handleGeolocationError(error) {
        const t = LanguageManager.getTranslations();
        let errorMessage = t.geolocationError || "Impossible d'obtenir votre position. ";
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage += t.permissionDenied || "Permission refusée.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage += t.positionUnavailable || "Position indisponible.";
                break;
            case error.TIMEOUT:
                errorMessage += t.timeout || "Délai dépassé.";
                break;
            default:
                errorMessage += t.unknownError || "Erreur inconnue.";
        }
        
        alert(errorMessage);
        document.getElementById('locationName').value = t.positionNotAvailable || "Position non disponible";
    }
    
    // Rechercher un lieu
    async function searchLocation() {
        const searchInput = document.getElementById('locationSearch');
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) return;
        
        const searchLoading = document.getElementById('searchLoading');
        const searchResults = document.getElementById('searchResults');
        
        searchLoading.style.display = 'block';
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
        
        try {
            const lang = LanguageManager.getCurrentLanguage();
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5&accept-language=${lang}`
            );
            
            if (!response.ok) throw new Error('Erreur réseau');
            
            const results = await response.json();
            const t = LanguageManager.getTranslations();
            
            if (results.length === 0) {
                searchResults.innerHTML = `<div class="search-result-item">${t.noResults || 'Aucun résultat'}</div>`;
            } else {
                results.forEach(result => {
                    const item = createSearchResultItem(result);
                    searchResults.appendChild(item);
                });
            }
            
            searchResults.style.display = 'block';
        } catch (error) {
            console.error('Erreur de recherche:', error);
            const t = LanguageManager.getTranslations();
            searchResults.innerHTML = `<div class="search-result-item">${t.searchError || 'Erreur de recherche'}</div>`;
            searchResults.style.display = 'block';
        } finally {
            searchLoading.style.display = 'none';
        }
    }
    
    // Créer un élément de résultat de recherche
    function createSearchResultItem(result) {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        
        const t = LanguageManager.getTranslations();
        const latLabel = t.latLabel || 'Lat';
        const lngLabel = t.lngLabel || 'Lng';
        
        item.innerHTML = `
            <strong>${LanguageManager.convertIndianToArabicNumbers(result.display_name.split(',').slice(0, 2).join(','))}</strong><br>
            <small>${latLabel}: ${result.lat}, ${lngLabel}: ${result.lon}</small>
        `;
        
        item.addEventListener('click', function() {
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            
            document.getElementById('lat').value = lat.toFixed(6);
            document.getElementById('lng').value = lng.toFixed(6);
            document.getElementById('locationSearch').value = LanguageManager.convertIndianToArabicNumbers(result.display_name.split(',')[0]);
            
            const placeName = result.display_name.split(',').slice(0, 2).join(',');
            document.getElementById('locationName').value = LanguageManager.convertIndianToArabicNumbers(placeName);
            
            document.getElementById('searchResults').style.display = 'none';
            
            if (MapManager.setPosition(lat, lng)) {
                updateAll();
            }
        });
        
        return item;
    }
    
    // Récupérer le nom du lieu
    async function fetchLocationName(lat, lng) {
        if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
            const t = LanguageManager.getTranslations();
            document.getElementById('locationName').value = t.invalidPosition;
            return;
        }
        
        try {
            const lang = LanguageManager.getCurrentLanguage();
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12&accept-language=${lang}`
            );
            
            if (!response.ok) throw new Error('Erreur réseau');
            
            const data = await response.json();
            const t = LanguageManager.getTranslations();
            
            if (data.display_name) {
                let placeName = t.unnamedPlace || "Lieu non nommé";
                
                if (data.address) {
                    if (data.address.city) {
                        placeName = data.address.city;
                        if (data.address.country) placeName += `, ${data.address.country}`;
                    } else if (data.address.town) {
                        placeName = data.address.town;
                        if (data.address.country) placeName += `, ${data.address.country}`;
                    } else if (data.address.village) {
                        placeName = data.address.village;
                        if (data.address.country) placeName += `, ${data.address.country}`;
                    } else if (data.address.municipality) {
                        placeName = data.address.municipality;
                        if (data.address.country) placeName += `, ${data.address.country}`;
                    } else if (data.address.country) {
                        placeName = data.address.country;
                    }
                }
                
                document.getElementById('locationName').value = LanguageManager.convertIndianToArabicNumbers(placeName);
            } else {
                const positionText = `${t.position || 'Position'}: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
                document.getElementById('locationName').value = positionText;
            }
        } catch (error) {
            console.error('Erreur de récupération du nom:', error);
            const t = LanguageManager.getTranslations();
            const positionText = `${t.position || 'Position'}: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
            document.getElementById('locationName').value = positionText;
        }
    }
    
    // Récupérer l'altitude
    async function fetchElevation(lat, lng) {
        try {
            const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
            const json = await response.json();
            document.getElementById('ele').value = Math.round(json.results[0].elevation);
        } catch (error) {
            console.error('Erreur d\'altitude:', error);
            document.getElementById('ele').value = 0;
        }
    }
    
    // Valider les coordonnées
    function validateCoordinates() {
        const lat = parseFloat(document.getElementById('lat').value);
        const lng = parseFloat(document.getElementById('lng').value);
        const t = LanguageManager.getTranslations();
        
        if (isNaN(lat) || lat < -90 || lat > 90) {
            showValidationError('lat', true, t.latError);
        } else {
            showValidationError('lat', false);
            if (!isNaN(lng)) {
                fetchLocationName(lat, lng);
            }
        }
        
        if (isNaN(lng) || lng < -180 || lng > 180) {
            showValidationError('lng', true, t.lngError);
        } else {
            showValidationError('lng', false);
            if (!isNaN(lat)) {
                fetchLocationName(lat, lng);
            }
        }
    }
    
    // Afficher/masquer les erreurs de validation
    function showValidationError(inputId, show, message = '') {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + 'Error');
        
        if (show) {
            input.classList.add('input-error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
        } else {
            input.classList.remove('input-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    }
    
    // Mettre à jour toutes les informations
    function updateAll() {
        updateAstronomicalInfo();
        PanoramaManager.update();
    }
    
    // Mettre à jour les informations astronomiques
    function updateAstronomicalInfo() {
        const lat = parseFloat(document.getElementById('lat').value);
        const lng = parseFloat(document.getElementById('lng').value);
        const date = new Date(document.getElementById('date').value || Date.now());
        const criterion = document.getElementById('criterion').value;
        
        if (!MapManager.isValidCoordinates(lat, lng)) return;
        
        const data = Calculations.calculate(lat, lng, date);
        const [cresTxt, cresCls] = Calculations.crescentVisibility(
            { altitude: data.sun.altitude * Math.PI / 180, azimuth: (data.sun.azimuth - 180) * Math.PI / 180 },
            { altitude: data.moon.altitude * Math.PI / 180, azimuth: (data.moon.azimuth - 180) * Math.PI / 180, distance: 384400 },
            { fraction: data.illumination },
            criterion
        );
        
        const moonHiddenStatus = Calculations.estimateMoonBehindTerrain(data.moon.altitude);
        const t = LanguageManager.getTranslations();
        const lang = LanguageManager.getCurrentLanguage();
        
        const directionText = lang === 'en' ? '(N=0)' : lang === 'ar' ? '(الشمال=0)' : '(N=0)';
        
        document.getElementById('info').innerHTML = `
            <h2>${t.infoTitle}</h2>
            <div class="astro-grid">
                <div class="astro-section sun-section">
                    <div class="astro-header">
                        <div class="sun-icon">☀️</div>
                        <h3 style="margin: 0; color: #f59e0b;">${t.sunTitle}</h3>
                    </div>
                    <div class="astro-info-item">
                        <span class="info-label">${t.sunsetLabel}</span>
                        <span class="info-value">${LanguageManager.formatTime(data.sunsetTime)}</span>
                    </div>
                    <div class="astro-info-item">
                        <span class="info-label">${t.azimuthLabel}</span>
                        <span class="info-value">${LanguageManager.formatNumber(data.sun.azimuth)}° ${directionText}</span>
                    </div>
                    <div class="astro-info-item">
                        <span class="info-label">${t.altitudeLabel}</span>
                        <span class="info-value">${LanguageManager.formatNumber(data.sun.altitude)}°</span>
                    </div>
                </div>
                
                <div class="astro-section moon-section">
                    <div class="astro-header">
                        <div class="moon-icon">🌙</div>
                        <h3 style="margin: 0; color: #6b7280;">${t.moonTitle}</h3>
                    </div>
                    <div class="astro-info-item">
                        <span class="info-label">${t.moonsetLabel}</span>
                        <span class="info-value">${data.moonsetTime ? LanguageManager.formatTime(data.moonsetTime) : 'N/A'}</span>
                    </div>
                    <div class="astro-info-item">
                        <span class="info-label">${t.azimuthLabel}</span>
                        <span class="info-value">${LanguageManager.formatNumber(data.moon.azimuth)}° ${directionText}</span>
                    </div>
                    <div class="astro-info-item">
                        <span class="info-label">${t.altitudeLabel}</span>
                        <span class="info-value">${LanguageManager.formatNumber(data.moon.altitude)}°</span>
                    </div>
                </div>
            </div>
            
            <div class="visibility-section">
                <div class="visibility-header">
                    <div class="visibility-icon">🔭</div>
                    <h3 style="margin: 0; color: #2563eb;">${t.visibilityTitle}</h3>
                </div>
                <div class="astro-info-item">
                    <span class="info-label">${t.stateLabel}</span>
                    <span class="info-value">${moonHiddenStatus}</span>
                </div>
                <div class="astro-info-item">
                    <span class="info-label">${t.illuminationLabel}</span>
                    <span class="info-value">${LanguageManager.formatNumber(data.illumination * 100)}%</span>
                </div>
                <div class="astro-info-item">
                    <span class="info-label">${t.elongationLabel}</span>
                    <span class="info-value">${LanguageManager.formatNumber(data.elongation)}°</span>
                </div>
                <div class="astro-info-item">
                    <span class="info-label">${t.crescentLabel}</span>
                    <span class="info-value"><span class="${cresCls}">${cresTxt}</span></span>
                </div>
            </div>`;
    }
    
    // API publique
    return {
        init: init,
        updateAll: updateAll,
        searchLocation: searchLocation,
        getUserLocation: getUserLocation,
        syncFromInputs: syncFromInputs
    };
})();

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    HilalApp.init();
});