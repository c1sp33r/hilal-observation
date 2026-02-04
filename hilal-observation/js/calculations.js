// Astronomical Calculations Module
const Calculations = (function() {
    const MOON_RADIUS_KM = 1737.4;
    
    // Calculer l'élongation
    function elong(sun, moon) {
        return Math.acos(
            Math.sin(sun.altitude) * Math.sin(moon.altitude) + 
            Math.cos(sun.altitude) * Math.cos(moon.altitude) * 
            Math.cos(sun.azimuth - moon.azimuth)
        ) * 180 / Math.PI;
    }

    // Déterminer la visibilité du croissant
    function crescentVisibility(sun, moon, illum, criterion) {
        const e = elong(sun, moon);
        const altMoon = moon.altitude * 180 / Math.PI;
        const altSun = sun.altitude * 180 / Math.PI;
        const lang = LanguageManager.getCurrentLanguage();
        const t = LanguageManager.getTranslations();
        
        if (criterion === "danjon") {
            if (e < 7) return [t.visibilityResults.danjon.danger, "danger"];
            return [t.visibilityResults.danjon.warning, "warning"];
        }
        
        if (criterion === "yallop") {
            if (e < 7 || altMoon < 3) return [t.visibilityResults.yallop.danger, "danger"];
            if (e > 10 && altMoon > 5) return [t.visibilityResults.yallop.success, "success"];
            return [t.visibilityResults.yallop.warning, "warning"];
        }

        if (criterion === "saao") {
            const arcv = altMoon - altSun;
            const daz = Math.abs((moon.azimuth - sun.azimuth) * 180 / Math.PI);
            const q = arcv - (5.22 - 0.0125 * daz + 0.002 * Math.pow(daz, 2));
            if (q > 0.5) return [t.visibilityResults.saao.success, "success"];
            if (q > 0) return [t.visibilityResults.saao.warning, "warning"];
            return [t.visibilityResults.saao.danger, "danger"];
        }
        
        if (criterion === "odeh") {
            const sd = (MOON_RADIUS_KM / moon.distance) * (180 / Math.PI) * 60;
            const w = 2 * sd * illum.fraction;
            const poly = -0.1018 * Math.pow(w, 3) + 0.7319 * Math.pow(w, 2) - 6.3226 * w + 7.1651;
            const v = (altMoon - altSun) - poly;
            if (v >= 5.65) return [t.visibilityResults.odeh.success2, "success"];
            if (v >= 2) return [t.visibilityResults.odeh.success1, "success"];
            if (v >= -0.96) return [t.visibilityResults.odeh.warning, "warning"];
            return [t.visibilityResults.odeh.danger, "danger"];
        }
        
        return ["Inconnu", "warning"];
    }

    // Estimer si la Lune est cachée par le relief
    function estimateMoonBehindTerrain(moonAltitudeDeg) {
        const t = LanguageManager.getTranslations();
        
        if (moonAltitudeDeg <= 0) {
            return t.alreadyHidden;
        }
        
        if (moonAltitudeDeg < 5) {
            return t.nearHorizon;
        }
        
        return t.aboveHorizon;
    }

    // Calculer les positions astronomiques
    function calculateAstronomicalData(lat, lng, date) {
        const st = SunCalc.getTimes(date, lat, lng);
        const mt = SunCalc.getMoonTimes(date, lat, lng);
        const sunsetTime = st.sunset;
        
        const sun = SunCalc.getPosition(sunsetTime, lat, lng);
        const moon = SunCalc.getMoonPosition(sunsetTime, lat, lng);
        const illum = SunCalc.getMoonIllumination(sunsetTime);
        
        // Convertir les azimuts (sud=0 vers nord=0)
        const sunAzimuthDeg = (sun.azimuth * 180 / Math.PI + 180) % 360;
        const sunAltitudeDeg = sun.altitude * 180 / Math.PI;
        const moonAzimuthDeg = (moon.azimuth * 180 / Math.PI + 180) % 360;
        const moonAltitudeDeg = moon.altitude * 180 / Math.PI;
        
        return {
            sunsetTime,
            moonsetTime: mt.set,
            sun: { azimuth: sunAzimuthDeg, altitude: sunAltitudeDeg },
            moon: { azimuth: moonAzimuthDeg, altitude: moonAltitudeDeg },
            illumination: illum.fraction,
            elongation: elong(sun, moon)
        };
    }

    // API publique
    return {
        calculate: calculateAstronomicalData,
        crescentVisibility: crescentVisibility,
        estimateMoonBehindTerrain: estimateMoonBehindTerrain,
        getMoonRadius: () => MOON_RADIUS_KM
    };
})();