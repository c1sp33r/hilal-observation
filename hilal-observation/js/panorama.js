// Panorama Management Module
const PanoramaManager = (function() {
    let panel;
    let isReady = false;
    
    // Initialiser PeakFinder
    function initPeakFinder() {
        panel = new PeakFinder.PanoramaPanel({ 
            canvasid: "pfcanvas", 
            locale: "fr" 
        });
        
        panel.init(() => {
            isReady = true;
            panel.settings.showSun(1);
            panel.settings.showMoon(1);
            panel.settings.showGrid(1);
            document.getElementById('pfcanvasprogress').style.display = 'none';
            updatePanorama();
        });
    }

    // Mettre à jour le panorama
    function updatePanorama() {
        if (!isReady) return;
        
        const lat = parseFloat(document.getElementById('lat').value);
        const lng = parseFloat(document.getElementById('lng').value);
        const ele = parseInt(document.getElementById('ele').value) || 0;
        
        // Valider les coordonnées
        if (!MapManager.isValidCoordinates(lat, lng)) return;
        
        const date = new Date(document.getElementById('date').value || Date.now());
        const data = Calculations.calculate(lat, lng, date);
        
        try {
            // Configurer le point de vue
            panel.loadViewpoint(lat, lng, "Observation");
            panel.elevationOffset(ele);
            
            // Définir l'heure
            const sunsetUTC = new Date(data.sunsetTime.toISOString());
            panel.astro.currentDateTime(
                sunsetUTC.getUTCFullYear(),
                sunsetUTC.getUTCMonth() + 1,
                sunsetUTC.getUTCDate(),
                sunsetUTC.getUTCHours(),
                sunsetUTC.getUTCMinutes()
            );
            
            // Centrer sur la Lune
            panel.azimut(data.moon.azimuth);
            panel.fieldofview(60);
            
            // Redessiner
            if (typeof panel.redraw === 'function') {
                panel.redraw();
            }
        } catch (error) {
            console.error('Erreur Panorama:', error);
            retryPanorama(lat, lng, ele, data);
        }
    }

    // Réessayer le panorama en cas d'erreur
    function retryPanorama(lat, lng, ele, data) {
        try {
            const canvas = document.getElementById('pfcanvas');
            canvas.width = canvas.width;
            
            setTimeout(() => {
                panel.loadViewpoint(lat, lng, "Observation");
                panel.elevationOffset(ele);
                
                const sunsetUTC = new Date(data.sunsetTime.toISOString());
                panel.astro.currentDateTime(
                    sunsetUTC.getUTCFullYear(),
                    sunsetUTC.getUTCMonth() + 1,
                    sunsetUTC.getUTCDate(),
                    sunsetUTC.getUTCHours(),
                    sunsetUTC.getUTCMinutes()
                );
                
                panel.azimut(data.moon.azimuth);
                panel.fieldofview(60);
            }, 100);
        } catch (retryError) {
            console.error('Erreur lors de la seconde tentative:', retryError);
        }
    }

    // API publique
    return {
        init: initPeakFinder,
        update: updatePanorama,
        isReady: () => isReady
    };
})();