// Language Management Module
const LanguageManager = (function() {
    // Dictionnaires de traduction
    const translations = {
        fr: {
            pageTitle: "Observation du Croissant Lunaire (Hilal)",
            positionTitle: "1. Position",
            searchLabel: "Rechercher un lieu :",
            searchPlaceholder: "Ex: Paris, France (Appuyez sur Entrée)",
            locationBtn: "📍 Ma Position Actuelle",
            locationPlaceholder: "Nom du lieu (sera rempli automatiquement)",
            latLabel: "Latitude",
            lngLabel: "Longitude",
            eleLabel: "Altitude (m)",
            mapTitle: "2. Carte Interactive",
            mapBtnStandard: "Standard",
            mapBtnRelief: "Relief",
            mapBtnSatellite: "Satellite",
            dateTitle: "3. Date et Critère de Visibilité",
            dateLabel: "Date",
            criterionLabel: "Critère de visibilité",
            criterionOptions: {
                yallop: "Yallop (Recommandé)",
                saao: "SAAO (Afrique du Sud)",
                odeh: "Odeh (Précis)",
                danjon: "Danjon (Élongation)"
            },
            updateBtn: "Mettre à jour",
            infoTitle: "4. Informations Astronomiques",
            loadingText: "Chargement des données...",
            panoramaTitle: "5. Panorama du Relief",
            sunTitle: "Soleil",
            moonTitle: "Lune",
            sunsetLabel: "Coucher :",
            sunriseLabel: "Lever :",
            azimuthLabel: "Azimut :",
            altitudeLabel: "Altitude :",
            moonsetLabel: "Coucher :",
            moonriseLabel: "Lever :",
            visibilityTitle: "Visibilité du Croissant Lunaire",
            stateLabel: "État :",
            illuminationLabel: "Illumination :",
            elongationLabel: "Élongation Soleil-Lune :",
            crescentLabel: "Premier Croissant :",
            searchLoading: "Recherche en cours...",
            alreadyHidden: "Déjà cachée",
            nearHorizon: "Très proche de l'horizon (risque de cachée)",
            aboveHorizon: "Au-dessus de l'horizon",
            visibilityResults: {
                yallop: {
                    danger: "Non visible",
                    warning: "Visible avec instrument",
                    success: "Visible à l'œil nu"
                },
                saao: {
                    danger: "Non visible (SAAO)",
                    warning: "Possible avec instrument (SAAO)",
                    success: "Visible à l'oeil nu (SAAO)"
                },
                odeh: {
                    danger: "Non visible",
                    warning: "Visible avec instrument",
                    success1: "Possible à l'œil nu",
                    success2: "Facile à l'œil nu"
                },
                danjon: {
                    danger: "Impossible (Danjon)",
                    warning: "Possible"
                }
            },
            usageTitle: "Comment utiliser cet outil",
            step1Title: "Choisissez votre position",
            step1Desc: "Utilisez la carte, recherchez un lieu ou cliquez sur \"Ma Position Actuelle\".",
            step2Title: "Sélectionnez la date",
            step2Desc: "Choisissez la date d'observation pour calculer les positions du soleil et de la lune.",
            step3Title: "Consultez les informations",
            step3Desc: "Analysez les données astronomiques et la visibilité du croissant lunaire.",
            step4Title: "Visualisez le panorama",
            step4Desc: "Observez la position de la lune par rapport au relief sur le panorama.",
            usageTip: "Pour une observation optimale, choisissez un lieu avec un horizon dégagé vers l'ouest.",
            latError: "La latitude doit être entre -90° et 90°",
            lngError: "La longitude doit être entre -180° et 180°",
            invalidPosition: "Position invalide"
        },
        en: {
            pageTitle: "Lunar Crescent Observation (Hilal)",
            positionTitle: "1. Position",
            searchLabel: "Search for a place:",
            searchPlaceholder: "Ex: Paris, France (Press Enter)",
            locationBtn: "📍 My Current Location",
            locationPlaceholder: "Place name (will be filled automatically)",
            latLabel: "Latitude",
            lngLabel: "Longitude",
            eleLabel: "Elevation (m)",
            mapTitle: "2. Interactive Map",
            mapBtnStandard: "Standard",
            mapBtnRelief: "Relief",
            mapBtnSatellite: "Satellite",
            dateTitle: "3. Date and Visibility Criterion",
            dateLabel: "Date",
            criterionLabel: "Visibility criterion",
            criterionOptions: {
                yallop: "Yallop (Recommended)",
                saao: "SAAO (South Africa)",
                odeh: "Odeh (Precise)",
                danjon: "Danjon (Elongation)"
            },
            updateBtn: "Update",
            infoTitle: "4. Astronomical Information",
            loadingText: "Loading data...",
            panoramaTitle: "5. Relief Panorama",
            sunTitle: "Sun",
            moonTitle: "Moon",
            sunsetLabel: "Sunset:",
            sunriseLabel: "Sunrise:",
            azimuthLabel: "Azimuth:",
            altitudeLabel: "Altitude:",
            moonsetLabel: "Moonset:",
            moonriseLabel: "Moonrise:",
            visibilityTitle: "Lunar Crescent Visibility",
            stateLabel: "State:",
            illuminationLabel: "Illumination:",
            elongationLabel: "Sun-Moon Elongation:",
            crescentLabel: "First Crescent:",
            searchLoading: "Searching...",
            alreadyHidden: "Already hidden",
            nearHorizon: "Very close to horizon (risk of hidden)",
            aboveHorizon: "Above horizon",
            visibilityResults: {
                yallop: {
                    danger: "Not visible",
                    warning: "Visible with instrument",
                    success: "Visible to naked eye"
                },
                saao: {
                    danger: "Not visible (SAAO)",
                    warning: "Possible with instrument (SAAO)",
                    success: "Visible to naked eye (SAAO)"
                },
                odeh: {
                    danger: "Not visible",
                    warning: "Visible with instrument",
                    success1: "Possible to naked eye",
                    success2: "Easy to naked eye"
                },
                danjon: {
                    danger: "Impossible (Danjon)",
                    warning: "Possible"
                }
            },
            usageTitle: "How to use this tool",
            step1Title: "Choose your location",
            step1Desc: "Use the map, search for a place or click \"My Current Location\".",
            step2Title: "Select the date",
            step2Desc: "Choose the observation date to calculate sun and moon positions.",
            step3Title: "Check the information",
            step3Desc: "Analyze astronomical data and crescent moon visibility.",
            step4Title: "View the panorama",
            step4Desc: "Observe the moon position relative to terrain on the panorama.",
            usageTip: "For optimal observation, choose a location with clear western horizon.",
            latError: "Latitude must be between -90° and 90°",
            lngError: "Longitude must be between -180° and 180°",
            invalidPosition: "Invalid position"
        },
        ar: {
            pageTitle: "رصد الهلال",
            positionTitle: "١. الموقع",
            searchLabel: "البحث عن مكان:",
            searchPlaceholder: "مثال: باريس، فرنسا (اضغط Enter)",
            locationBtn: "📍 موقعي الحالي",
            locationPlaceholder: "اسم المكان (سيتم ملؤه تلقائياً)",
            latLabel: "خط العرض",
            lngLabel: "خط الطول",
            eleLabel: "الارتفاع (م)",
            mapTitle: "٢. الخريطة التفاعلية",
            mapBtnStandard: "قياسي",
            mapBtnRelief: "تضاريس",
            mapBtnSatellite: "قمر صناعي",
            dateTitle: "٣. التاريخ ومعيار الرؤية",
            dateLabel: "التاريخ",
            criterionLabel: "معيار الرؤية",
            criterionOptions: {
                yallop: "يالوب (مُوصى به)",
                saao: "SAAO (جنوب أفريقيا)",
                odeh: "عودة (دقيق)",
                danjon: "دانجون (الاستطالة)"
            },
            updateBtn: "تحديث",
            infoTitle: "٤. المعلومات الفلكية",
            loadingText: "جاري تحميل البيانات...",
            panoramaTitle: "٥. بانوراما التضاريس",
            sunTitle: "الشمس",
            moonTitle: "القمر",
            sunsetLabel: "غروب الشمس:",
            sunriseLabel: "شروق الشمس:",
            azimuthLabel: "السمت:",
            altitudeLabel: "الارتفاع:",
            moonsetLabel: "غروب القمر:",
            moonriseLabel: "شروق القمر:",
            visibilityTitle: "رؤية الهلال",
            stateLabel: "الحالة:",
            illuminationLabel: "الإضاءة:",
            elongationLabel: "الاستطالة الشمس-قمر:",
            crescentLabel: "الهلال الأول:",
            searchLoading: "جاري البحث...",
            alreadyHidden: "مخفي بالفعل",
            nearHorizon: "قريب جداً من الأفق (خطر الاختفاء)",
            aboveHorizon: "فوق الأفق",
            visibilityResults: {
                yallop: {
                    danger: "غير مرئي",
                    warning: "مرئي بالأداة",
                    success: "مرئي بالعين المجردة"
                },
                saao: {
                    danger: "غير مرئي (SAAO)",
                    warning: "ممكن بالأداة (SAAO)",
                    success: "مرئي بالعين المجردة (SAAO)"
                },
                odeh: {
                    danger: "غير مرئي",
                    warning: "مرئي بالأداة",
                    success1: "ممكن بالعين المجردة",
                    success2: "سهل بالعين المجردة"
                },
                danjon: {
                    danger: "مستحيل (دانجون)",
                    warning: "ممكن"
                }
            },
            usageTitle: "كيفية استخدام هذه الأداة",
            step1Title: "اختر موقعك",
            step1Desc: "استخدم الخريطة، ابحث عن مكان أو انقر على \"موقعي الحالي\".",
            step2Title: "حدد التاريخ",
            step2Desc: "اختر تاريخ الرصد لحساب مواقع الشمس والقمر.",
            step3Title: "راجع المعلومات",
            step3Desc: "حلل البيانات الفلكية وإمكانية رؤية الهلال.",
            step4Title: "شاهد البانوراما",
            step4Desc: "راقب موقع القمر بالنسبة للتضاريس على البانوراما.",
            usageTip: "للحصول على أفضل رصد، اختر موقعاً بأفق غربي مكشوف.",
            latError: "يجب أن يكون خط العرض بين ٩٠° و ٩٠°-",
            lngError: "يجب أن يكون خط الطول بين ١٨٠° و ١٨٠°-",
            invalidPosition: "موقع غير صالح"
        }
    };

    let currentLang = 'fr';

    // Fonction pour convertir les chiffres indiens en chiffres arabes
    function convertIndianToArabicNumbers(text) {
        if (!text) return text;
        
        const indianToArabic = {
            '٠': '0', '۰': '0',
            '١': '1', '۱': '1',
            '٢': '2', '۲': '2',
            '٣': '3', '۳': '3',
            '٤': '4', '۴': '4',
            '٥': '5', '۵': '5',
            '٦': '6', '۶': '6',
            '٧': '7', '۷': '7',
            '٨': '8', '۸': '8',
            '٩': '9', '۹': '9'
        };
        
        return text.split('').map(char => indianToArabic[char] || char).join('');
    }

    // Fonction pour formater les nombres
    function formatNumber(number) {
        if (typeof number !== 'number') return number;
        const formatted = number.toFixed(2).replace(/\.00$/, '');
        return convertIndianToArabicNumbers(formatted);
    }

    // Fonction pour formater l'heure
    function formatTime(date, lang) {
        if (!date) return 'N/A';
        
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: lang === 'ar' ? false : false
        };
        
        let timeString;
        try {
            timeString = date.toLocaleTimeString(
                lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'fr-FR', 
                options
            );
        } catch (e) {
            timeString = date.toLocaleTimeString('fr-FR', options);
        }
        
        return convertIndianToArabicNumbers(timeString);
    }

    // Fonction pour générer la section d'utilisation
    function updateUsageSection() {
        const t = translations[currentLang];
        const tipPrefix = currentLang === 'en' ? 'Tip:' : currentLang === 'ar' ? 'نصيحة:' : 'Astuce :';
        
        const usageHTML = `
            <h3>${t.usageTitle}</h3>
            <div class="usage-steps">
                <div class="usage-step">
                    <h4><span class="step-number">1</span> <span>${t.step1Title}</span></h4>
                    <p>${t.step1Desc}</p>
                </div>
                <div class="usage-step">
                    <h4><span class="step-number">2</span> <span>${t.step2Title}</span></h4>
                    <p>${t.step2Desc}</p>
                </div>
                <div class="usage-step">
                    <h4><span class="step-number">3</span> <span>${t.step3Title}</span></h4>
                    <p>${t.step3Desc}</p>
                </div>
                <div class="usage-step">
                    <h4><span class="step-number">4</span> <span>${t.step4Title}</span></h4>
                    <p>${t.step4Desc}</p>
                </div>
            </div>
            <p><strong>${tipPrefix}</strong> ${t.usageTip}</p>
        `;
        
        document.getElementById('usageNote').innerHTML = usageHTML;
    }

    // Fonction pour mettre à jour les textes
    function updateTexts() {
        const t = translations[currentLang];
        
        // Titre de la page
        document.getElementById('pageTitle').textContent = t.pageTitle;
        
        // Section Position
        document.getElementById('positionTitle').textContent = t.positionTitle;
        document.getElementById('searchLabel').textContent = t.searchLabel;
        document.getElementById('locationSearch').placeholder = t.searchPlaceholder;
        document.getElementById('locationBtn').textContent = t.locationBtn;
        document.getElementById('locationName').placeholder = t.locationPlaceholder;
        document.getElementById('latLabel').textContent = t.latLabel;
        document.getElementById('lngLabel').textContent = t.lngLabel;
        document.getElementById('eleLabel').textContent = t.eleLabel;
        
        // Messages d'erreur
        document.getElementById('latError').textContent = t.latError;
        document.getElementById('lngError').textContent = t.lngError;
        
        // Section Carte
        document.getElementById('mapTitle').textContent = t.mapTitle;
        document.getElementById('mapBtnStandard').textContent = t.mapBtnStandard;
        document.getElementById('mapBtnRelief').textContent = t.mapBtnRelief;
        document.getElementById('mapBtnSatellite').textContent = t.mapBtnSatellite;
        
        // Section Date
        document.getElementById('dateTitle').textContent = t.dateTitle;
        document.getElementById('dateLabel').textContent = t.dateLabel;
        document.getElementById('criterionLabel').textContent = t.criterionLabel;
        
        // Options du critère de visibilité
        const criterionSelect = document.getElementById('criterion');
        Array.from(criterionSelect.options).forEach(option => {
            const value = option.value;
            if (t.criterionOptions[value]) {
                option.textContent = t.criterionOptions[value];
            }
        });
        
        document.getElementById('updateBtn').textContent = t.updateBtn;
        document.getElementById('infoTitle').textContent = t.infoTitle;
        document.getElementById('loadingText').textContent = t.loadingText;
        document.getElementById('panoramaTitle').textContent = t.panoramaTitle;
        
        // Texte de chargement de recherche
        document.getElementById('searchLoading').textContent = t.searchLoading;
    }

    // Fonction pour mettre à jour le sélecteur de langue
    function updateLangSelector(lang) {
        const langTexts = { 'fr': 'Français', 'en': 'English', 'ar': 'عربي' };
        const langFlags = { 'fr': '🇫🇷', 'en': '🇬🇧', 'ar': '🇸🇦' };
        
        document.getElementById('currentLangText').textContent = langTexts[lang];
        document.getElementById('currentLangFlag').textContent = langFlags[lang];
        
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.lang === lang) {
                option.classList.add('active');
            }
        });
    }

    // Fonction pour changer la langue
    function changeLanguage(lang) {
        currentLang = lang;
        
        // Changer la direction du texte
        if (lang === 'ar') {
            document.body.dir = 'rtl';
            document.body.style.textAlign = 'right';
        } else {
            document.body.dir = 'ltr';
            document.body.style.textAlign = 'left';
        }
        
        // Mettre à jour les textes
        updateTexts();
        updateUsageSection();
        updateLangSelector(lang);
        
        // Sauvegarder la préférence
        localStorage.setItem('hilal-lang-preference', lang);
        
        // Fermer le menu déroulant
        document.getElementById('langDropdown').classList.remove('show');
        
        return currentLang;
    }

    // Initialiser le sélecteur de langue
    function initLanguageSelector() {
        // Gestion du menu déroulant
        document.getElementById('langDropdownBtn').addEventListener('click', function() {
            document.getElementById('langDropdown').classList.toggle('show');
        });

        // Fermer le menu en cliquant ailleurs
        document.addEventListener('click', function(e) {
            const langDropdown = document.getElementById('langDropdown');
            const langBtn = document.getElementById('langDropdownBtn');
            
            if (!langDropdown.contains(e.target) && e.target !== langBtn) {
                langDropdown.classList.remove('show');
            }
        });

        // Gestion des clics sur les options de langue
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.dataset.lang;
                changeLanguage(lang);
            });
        });

        // Charger la langue sauvegardée ou la langue par défaut
        const savedLang = localStorage.getItem('hilal-lang-preference');
        if (savedLang && translations[savedLang]) {
            changeLanguage(savedLang);
        } else {
            changeLanguage('fr');
        }
    }

    // API publique
    return {
        init: initLanguageSelector,
        changeLanguage: changeLanguage,
        getCurrentLanguage: () => currentLang,
        getTranslations: () => translations[currentLang],
        formatNumber: formatNumber,
        formatTime: (date) => formatTime(date, currentLang),
        convertIndianToArabicNumbers: convertIndianToArabicNumbers
    };
})();