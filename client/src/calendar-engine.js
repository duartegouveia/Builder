const CALENDAR_DEFINITIONS = {
  gregorian: {
    name: 'gregorian',
    title: { pt: 'Gregoriano', en: 'Gregorian', es: 'Gregoriano', fr: 'Grégorien', it: 'Gregoriano', de: 'Gregorianisch' },
    active: true,
    type: 'solar',
    units: ['century','decade','year','season','month','week','weekday','day','timezone','hour','minute','second','millisecond'],
    exclude_units: ['century','decade','season','week','weekday'],
    min_unit: 'day',
    max_unit: 'year',
    months_per_year: 12,
    days_per_month: [31,28,31,30,31,30,31,31,30,31,30,31],
    month_names: {
      pt: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
      en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      es: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      fr: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      it: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      de: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
    },
    weekday_names: {
      pt: ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'],
      en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      es: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
      fr: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
      it: ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'],
      de: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']
    }
  },
  gregorian_swatchbeats: {
    name: 'gregorian_swatchbeats',
    title: { pt: 'Gregoriano (Swatch Beats)', en: 'Gregorian (Swatch Beats)', es: 'Gregoriano (Swatch Beats)', fr: 'Grégorien (Swatch Beats)', it: 'Gregoriano (Swatch Beats)', de: 'Gregorianisch (Swatch Beats)' },
    active: false,
    type: 'solar',
    units: ['century','decade','year','season','month','week','weekday','day','beat','centibeat'],
    exclude_units: ['century','decade','season','week','weekday'],
    min_unit: 'centibeat',
    max_unit: 'year',
    beats_per_day: 1000,
    beat_timezone: 'UTC+1',
    months_per_year: 12,
    days_per_month: [31,28,31,30,31,30,31,31,30,31,30,31],
    month_names: null,
    weekday_names: null
  },
  chinese: {
    name: 'chinese',
    title: { pt: 'Chinês', en: 'Chinese', es: 'Chino', fr: 'Chinois', it: 'Cinese', de: 'Chinesisch' },
    active: false,
    type: 'lunisolar',
    units: ['cycle','year','month','day','timezone','hour','minute','second','millisecond'],
    exclude_units: [],
    min_unit: 'day',
    max_unit: 'year',
    has_leap_month: true,
    zodiac: true,
    sexagenary_cycle: true,
    months_per_year: 12,
    days_per_month_range: [29, 30],
    heavenly_stems: {
      zh: ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
      en: ['Jiǎ','Yǐ','Bǐng','Dīng','Wù','Jǐ','Gēng','Xīn','Rén','Guǐ']
    },
    earthly_branches: {
      zh: ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'],
      en: ['Zǐ','Chǒu','Yín','Mǎo','Chén','Sì','Wǔ','Wèi','Shēn','Yǒu','Xū','Hài']
    },
    zodiac_animals: {
      pt: ['Rato','Boi','Tigre','Coelho','Dragão','Serpente','Cavalo','Cabra','Macaco','Galo','Cão','Porco'],
      en: ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'],
      es: ['Rata','Buey','Tigre','Conejo','Dragón','Serpiente','Caballo','Cabra','Mono','Gallo','Perro','Cerdo'],
      fr: ['Rat','Bœuf','Tigre','Lapin','Dragon','Serpent','Cheval','Chèvre','Singe','Coq','Chien','Cochon'],
      it: ['Topo','Bue','Tigre','Coniglio','Drago','Serpente','Cavallo','Capra','Scimmia','Gallo','Cane','Maiale'],
      de: ['Ratte','Büffel','Tiger','Hase','Drache','Schlange','Pferd','Ziege','Affe','Hahn','Hund','Schwein']
    },
    month_names: {
      zh: ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
      en: ['Month 1','Month 2','Month 3','Month 4','Month 5','Month 6','Month 7','Month 8','Month 9','Month 10','Month 11','Month 12']
    }
  },
  japanese: {
    name: 'japanese',
    title: { pt: 'Japonês', en: 'Japanese', es: 'Japonés', fr: 'Japonais', it: 'Giapponese', de: 'Japanisch' },
    active: false,
    type: 'solar',
    units: ['era','year','month','week','weekday','day','timezone','hour','minute','second','millisecond'],
    exclude_units: ['week','weekday'],
    min_unit: 'day',
    max_unit: 'year',
    era_based: true,
    months_per_year: 12,
    days_per_month: [31,28,31,30,31,30,31,31,30,31,30,31],
    eras: [
      { name: 'Meiji', kanji: '明治', start: { year: 1868, month: 1, day: 25 } },
      { name: 'Taishō', kanji: '大正', start: { year: 1912, month: 7, day: 30 } },
      { name: 'Shōwa', kanji: '昭和', start: { year: 1926, month: 12, day: 25 } },
      { name: 'Heisei', kanji: '平成', start: { year: 1989, month: 1, day: 8 } },
      { name: 'Reiwa', kanji: '令和', start: { year: 2019, month: 5, day: 1 } }
    ],
    month_names: null,
    weekday_names: {
      ja: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
      en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    }
  },
  hijri: {
    name: 'hijri',
    title: { pt: 'Islâmico (Hijri)', en: 'Islamic (Hijri)', es: 'Islámico (Hijri)', fr: 'Islamique (Hijri)', it: 'Islamico (Hijri)', de: 'Islamisch (Hijri)' },
    active: false,
    type: 'lunar',
    units: ['year','month','week','weekday','day','timezone','hour','minute','second','millisecond'],
    exclude_units: ['week','weekday'],
    min_unit: 'day',
    max_unit: 'year',
    months_per_year: 12,
    days_per_month: [30,29,30,29,30,29,30,29,30,29,30,29],
    leap_year_pattern: [2,5,7,10,13,16,18,21,24,26,29],
    month_names: {
      ar: ['مُحَرَّم','صَفَر','رَبِيع الأَوَّل','رَبِيع الثَّانِي','جُمَادَىٰ الأُولَىٰ','جُمَادَىٰ الآخِرَة','رَجَب','شَعْبَان','رَمَضَان','شَوَّال','ذُو القِعْدَة','ذُو الحِجَّة'],
      pt: ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab','Sha\'ban','Ramadan','Shawwal','Dhu al-Qi\'dah','Dhu al-Hijjah'],
      en: ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab','Sha\'ban','Ramadan','Shawwal','Dhu al-Qi\'dah','Dhu al-Hijjah'],
      es: ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab','Sha\'ban','Ramadán','Shawwal','Dhu al-Qi\'dah','Dhu al-Hijjah'],
      fr: ['Mouharram','Safar','Rabia al-Awal','Rabia al-Thani','Joumada al-Oula','Joumada al-Thania','Rajab','Chaabane','Ramadan','Chawwal','Dhou al-Qi\'da','Dhou al-Hijja'],
      it: ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab','Sha\'ban','Ramadan','Shawwal','Dhu al-Qi\'dah','Dhu al-Hijjah'],
      de: ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Dschumada al-Ula','Dschumada al-Thani','Radschab','Scha\'ban','Ramadan','Schawwal','Dhu l-Qa\'da','Dhu l-Hiddscha']
    },
    weekday_names: {
      ar: ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
      en: ['al-Ahad','al-Ithnayn','ath-Thulatha','al-Arba\'a','al-Khamis','al-Jum\'a','as-Sabt']
    }
  },
  rumi: {
    name: 'rumi',
    title: { pt: 'Rumi (Otomano)', en: 'Rumi (Ottoman)', es: 'Rumi (Otomano)', fr: 'Roumi (Ottoman)', it: 'Rumi (Ottomano)', de: 'Rumi (Osmanisch)' },
    active: false,
    type: 'solar',
    units: ['year','month','week','weekday','day','timezone','hour','minute','second','millisecond'],
    exclude_units: ['week','weekday'],
    min_unit: 'day',
    max_unit: 'year',
    julian_based: true,
    epoch_offset: 584,
    months_per_year: 12,
    days_per_month: [31,28,31,30,31,30,31,31,30,31,30,31],
    month_names: {
      tr: ['Kânûn-ı Sânî','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Teşrîn-i Evvel','Teşrîn-i Sânî','Kânûn-ı Evvel'],
      en: ['Kanun-i Sani','Shubat','Mart','Nisan','Mayis','Haziran','Temmuz','Agustos','Eylul','Teshrin-i Evvel','Teshrin-i Sani','Kanun-i Evvel']
    }
  },
  french_republican: {
    name: 'french_republican',
    title: { pt: 'Republicano Francês', en: 'French Republican', es: 'Republicano Francés', fr: 'Républicain Français', it: 'Repubblicano Francese', de: 'Französisch Republikanisch' },
    active: false,
    type: 'solar',
    units: ['year','month','decade_week','decade_day','day','timezone','decimal_hour','decimal_minute','decimal_second','millisecond'],
    exclude_units: ['decade_week','decade_day'],
    min_unit: 'day',
    max_unit: 'year',
    decimal_time: true,
    decade_week: true,
    months_per_year: 12,
    days_per_month: [30,30,30,30,30,30,30,30,30,30,30,30],
    complementary_days: { normal: 5, leap: 6 },
    month_names: {
      fr: ['Vendémiaire','Brumaire','Frimaire','Nivôse','Pluviôse','Ventôse','Germinal','Floréal','Prairial','Messidor','Thermidor','Fructidor'],
      pt: ['Vindimário','Brumário','Frimário','Nivoso','Pluvioso','Ventoso','Germinal','Floreal','Pradial','Messidor','Termidor','Frutidor'],
      en: ['Vendémiaire','Brumaire','Frimaire','Nivôse','Pluviôse','Ventôse','Germinal','Floréal','Prairial','Messidor','Thermidor','Fructidor'],
      es: ['Vendimiario','Brumario','Frimario','Nivoso','Pluvioso','Ventoso','Germinal','Floreal','Pradial','Mesidor','Termidor','Fructidor'],
      it: ['Vendemmiaio','Brumaio','Frimaio','Nevoso','Piovoso','Ventoso','Germinale','Fiorile','Pratile','Messidoro','Termidoro','Fruttidoro'],
      de: ['Weinlesemonat','Nebelmonat','Reifmonat','Schneemonat','Regenmonat','Windmonat','Keimmonat','Blütenmonat','Wiesenmonat','Erntemonat','Hitzemonat','Fruchtmonat']
    },
    decade_day_names: {
      fr: ['Primidi','Duodi','Tridi','Quartidi','Quintidi','Sextidi','Septidi','Octidi','Nonidi','Décadi'],
      en: ['Primidi','Duodi','Tridi','Quartidi','Quintidi','Sextidi','Septidi','Octidi','Nonidi','Décadi']
    },
    complementary_day_names: {
      fr: ['La Fête de la Vertu','La Fête du Génie','La Fête du Travail','La Fête de l\'Opinion','La Fête des Récompenses','La Fête de la Révolution'],
      pt: ['Festa da Virtude','Festa do Génio','Festa do Trabalho','Festa da Opinião','Festa das Recompensas','Festa da Revolução'],
      en: ['Festival of Virtue','Festival of Genius','Festival of Labour','Festival of Opinion','Festival of Rewards','Festival of the Revolution'],
      es: ['Fiesta de la Virtud','Fiesta del Genio','Fiesta del Trabajo','Fiesta de la Opinión','Fiesta de las Recompensas','Fiesta de la Revolución'],
      it: ['Festa della Virtù','Festa del Genio','Festa del Lavoro','Festa dell\'Opinione','Festa delle Ricompense','Festa della Rivoluzione'],
      de: ['Fest der Tugend','Fest des Genies','Fest der Arbeit','Fest der Meinung','Fest der Belohnungen','Fest der Revolution']
    }
  }
};

const UTC_OFFSETS = [
  { offset: -12, label: 'UTC-12:00', name: 'Baker Island' },
  { offset: -11, label: 'UTC-11:00', name: 'Pago Pago' },
  { offset: -10, label: 'UTC-10:00', name: 'Honolulu' },
  { offset: -9.5, label: 'UTC-09:30', name: 'Marquesas Islands' },
  { offset: -9, label: 'UTC-09:00', name: 'Anchorage' },
  { offset: -8, label: 'UTC-08:00', name: 'Los Angeles' },
  { offset: -7, label: 'UTC-07:00', name: 'Denver' },
  { offset: -6, label: 'UTC-06:00', name: 'Chicago' },
  { offset: -5, label: 'UTC-05:00', name: 'New York' },
  { offset: -4, label: 'UTC-04:00', name: 'Santiago' },
  { offset: -3.5, label: 'UTC-03:30', name: 'Newfoundland' },
  { offset: -3, label: 'UTC-03:00', name: 'São Paulo' },
  { offset: -2, label: 'UTC-02:00', name: 'South Georgia' },
  { offset: -1, label: 'UTC-01:00', name: 'Azores' },
  { offset: 0, label: 'UTC±00:00', name: 'London / Lisbon' },
  { offset: 1, label: 'UTC+01:00', name: 'Paris / Berlin' },
  { offset: 2, label: 'UTC+02:00', name: 'Cairo / Helsinki' },
  { offset: 3, label: 'UTC+03:00', name: 'Moscow / Riyadh' },
  { offset: 3.5, label: 'UTC+03:30', name: 'Tehran' },
  { offset: 4, label: 'UTC+04:00', name: 'Dubai' },
  { offset: 4.5, label: 'UTC+04:30', name: 'Kabul' },
  { offset: 5, label: 'UTC+05:00', name: 'Karachi' },
  { offset: 5.5, label: 'UTC+05:30', name: 'Mumbai / New Delhi' },
  { offset: 5.75, label: 'UTC+05:45', name: 'Kathmandu' },
  { offset: 6, label: 'UTC+06:00', name: 'Dhaka' },
  { offset: 6.5, label: 'UTC+06:30', name: 'Yangon' },
  { offset: 7, label: 'UTC+07:00', name: 'Bangkok / Jakarta' },
  { offset: 8, label: 'UTC+08:00', name: 'Beijing / Singapore' },
  { offset: 8.75, label: 'UTC+08:45', name: 'Eucla' },
  { offset: 9, label: 'UTC+09:00', name: 'Tokyo / Seoul' },
  { offset: 9.5, label: 'UTC+09:30', name: 'Adelaide' },
  { offset: 10, label: 'UTC+10:00', name: 'Sydney' },
  { offset: 10.5, label: 'UTC+10:30', name: 'Lord Howe Island' },
  { offset: 11, label: 'UTC+11:00', name: 'Solomon Islands' },
  { offset: 12, label: 'UTC+12:00', name: 'Auckland' },
  { offset: 12.75, label: 'UTC+12:45', name: 'Chatham Islands' },
  { offset: 13, label: 'UTC+13:00', name: 'Tonga' },
  { offset: 14, label: 'UTC+14:00', name: 'Line Islands' }
];

function isGregorianLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function gregorianDaysInMonth(year, month) {
  const base = [31,28,31,30,31,30,31,31,30,31,30,31];
  if (month === 2 && isGregorianLeapYear(year)) return 29;
  return base[month - 1];
}

function gregorianDaysInYear(year) {
  return isGregorianLeapYear(year) ? 366 : 365;
}

function gregorianToJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToGregorian(jdn) {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor(146097 * b / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

function gregorianWeekday(year, month, day) {
  const jdn = gregorianToJDN(year, month, day);
  return jdn % 7;
}

function weekdayFromJDN(jdn) {
  return ((jdn + 1) % 7);
}

function isHijriLeapYear(year) {
  return CALENDAR_DEFINITIONS.hijri.leap_year_pattern.includes(year % 30);
}

function hijriDaysInMonth(year, month) {
  if (month === 12 && isHijriLeapYear(year)) return 30;
  return CALENDAR_DEFINITIONS.hijri.days_per_month[month - 1];
}

function hijriDaysInYear(year) {
  return isHijriLeapYear(year) ? 355 : 354;
}

function hijriToJDN(year, month, day) {
  return Math.floor((11 * year + 3) / 30) + 354 * year + 30 * month - Math.floor((month - 1) / 2) + day + 1948440 - 385;
}

function jdnToHijri(jdn) {
  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

function isJulianLeapYear(year) {
  return year % 4 === 0;
}

function julianToJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
}

function jdnToJulian(jdn) {
  const b = 0;
  const c = jdn + 32082;
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

function rumiToJDN(year, month, day) {
  const julianYear = year + 584;
  return julianToJDN(julianYear, month, day);
}

function jdnToRumi(jdn) {
  const jul = jdnToJulian(jdn);
  return { year: jul.year - 584, month: jul.month, day: jul.day };
}

function isFrenchRepublicanLeapYear(year) {
  if (year <= 14) {
    return [3, 7, 11].includes(year);
  }
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

const FRENCH_REPUBLICAN_EPOCH_JDN = 2375840;

function frenchRepublicanToJDN(year, month, day) {
  let jdn = FRENCH_REPUBLICAN_EPOCH_JDN;
  for (let y = 1; y < year; y++) {
    jdn += isFrenchRepublicanLeapYear(y) ? 366 : 365;
  }
  jdn += (month - 1) * 30;
  jdn += day;
  return jdn;
}

function jdnToFrenchRepublican(jdn) {
  let remaining = jdn - FRENCH_REPUBLICAN_EPOCH_JDN;
  let year = 1;
  while (true) {
    const daysInYear = isFrenchRepublicanLeapYear(year) ? 366 : 365;
    if (remaining <= daysInYear) break;
    remaining -= daysInYear;
    year++;
  }
  if (remaining <= 360) {
    const month = Math.floor((remaining - 1) / 30) + 1;
    const day = ((remaining - 1) % 30) + 1;
    return { year, month, day, complementary: false };
  } else {
    const compDay = remaining - 360;
    return { year, month: 13, day: compDay, complementary: true };
  }
}

function chineseApproxToJDN(year, month, day) {
  const gYear = year + 2697;
  return gregorianToJDN(gYear, Math.min(month, 12), Math.min(day, 28));
}

function jdnToChineseApprox(jdn) {
  const g = jdnToGregorian(jdn);
  return { year: g.year - 2697, month: g.month, day: g.day, leap_month: false };
}

function getJapaneseEra(gYear, gMonth, gDay) {
  const eras = CALENDAR_DEFINITIONS.japanese.eras;
  for (let i = eras.length - 1; i >= 0; i--) {
    const s = eras[i].start;
    if (gYear > s.year || (gYear === s.year && (gMonth > s.month || (gMonth === s.month && gDay >= s.day)))) {
      return { era: eras[i], eraYear: gYear - s.year + 1 };
    }
  }
  return { era: eras[0], eraYear: gYear - eras[0].start.year + 1 };
}

function japaneseToJDN(eraName, eraYear, month, day) {
  const eras = CALENDAR_DEFINITIONS.japanese.eras;
  const era = eras.find(e => e.name === eraName || e.kanji === eraName);
  if (!era) return gregorianToJDN(eraYear, month, day);
  const gYear = era.start.year + eraYear - 1;
  return gregorianToJDN(gYear, month, day);
}

function jdnToJapanese(jdn) {
  const g = jdnToGregorian(jdn);
  const info = getJapaneseEra(g.year, g.month, g.day);
  return { era: info.era.name, kanji: info.era.kanji, year: info.eraYear, month: g.month, day: g.day };
}

function convertBetweenCalendars(fromCalendar, toCalendar, dateComponents) {
  const jdn = calendarToJDN(fromCalendar, dateComponents);
  return jdnToCalendar(toCalendar, jdn);
}

function calendarToJDN(calendarName, components) {
  switch (calendarName) {
    case 'gregorian':
    case 'gregorian_swatchbeats':
      return gregorianToJDN(components.year, components.month, components.day);
    case 'hijri':
      return hijriToJDN(components.year, components.month, components.day);
    case 'rumi':
      return rumiToJDN(components.year, components.month, components.day);
    case 'french_republican':
      return frenchRepublicanToJDN(components.year, components.month, components.day);
    case 'chinese':
      return chineseApproxToJDN(components.year, components.month, components.day);
    case 'japanese':
      return japaneseToJDN(components.era, components.year, components.month, components.day);
    default:
      return gregorianToJDN(components.year, components.month, components.day);
  }
}

function jdnToCalendar(calendarName, jdn) {
  switch (calendarName) {
    case 'gregorian':
    case 'gregorian_swatchbeats':
      return jdnToGregorian(jdn);
    case 'hijri':
      return jdnToHijri(jdn);
    case 'rumi':
      return jdnToRumi(jdn);
    case 'french_republican':
      return jdnToFrenchRepublican(jdn);
    case 'chinese':
      return jdnToChineseApprox(jdn);
    case 'japanese':
      return jdnToJapanese(jdn);
    default:
      return jdnToGregorian(jdn);
  }
}

function timeToFraction(hours, minutes, seconds, milliseconds) {
  const totalMs = ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds;
  return totalMs / 86400000;
}

function fractionToTime(fraction) {
  const totalMs = Math.round(fraction * 86400000);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const milliseconds = totalMs % 1000;
  return { hours, minutes, seconds, milliseconds };
}

function timeToSwatchBeats(hours, minutes, seconds, utcOffset) {
  const bielHours = hours + (utcOffset !== undefined ? utcOffset : 0) + 1;
  const totalSeconds = ((bielHours * 3600) + (minutes * 60) + seconds);
  const beats = (totalSeconds / 86.4) % 1000;
  return beats < 0 ? beats + 1000 : beats;
}

function swatchBeatsToTime(beats) {
  const totalSeconds = beats * 86.4;
  const bielHours = Math.floor(totalSeconds / 3600);
  const bielMinutes = Math.floor((totalSeconds % 3600) / 60);
  const bielSeconds = Math.floor(totalSeconds % 60);
  const utcHours = bielHours - 1;
  return { hours: ((utcHours % 24) + 24) % 24, minutes: bielMinutes, seconds: bielSeconds };
}

function timeToDecimal(hours, minutes, seconds) {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const decimalSeconds = (totalSeconds / 86400) * 100000;
  const decHour = Math.floor(decimalSeconds / 10000);
  const decMinute = Math.floor((decimalSeconds % 10000) / 100);
  const decSecond = Math.floor(decimalSeconds % 100);
  return { decimal_hour: decHour, decimal_minute: decMinute, decimal_second: decSecond };
}

function decimalToTime(decHour, decMinute, decSecond) {
  const totalDecimalSeconds = decHour * 10000 + decMinute * 100 + decSecond;
  const totalSeconds = (totalDecimalSeconds / 100000) * 86400;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return { hours, minutes, seconds };
}

function applyTimezoneOffset(hours, minutes, fromOffset, toOffset) {
  const diffMinutes = (toOffset - fromOffset) * 60;
  let totalMinutes = hours * 60 + minutes + diffMinutes;
  let dayShift = 0;
  if (totalMinutes >= 1440) { totalMinutes -= 1440; dayShift = 1; }
  if (totalMinutes < 0) { totalMinutes += 1440; dayShift = -1; }
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    dayShift
  };
}

function dateToNumericValue(calendarName, components) {
  const jdn = calendarToJDN(calendarName, components);
  let fraction = 0;
  if (calendarName === 'gregorian_swatchbeats') {
    const beat = components.beat || 0;
    const centibeat = components.centibeat || 0;
    fraction = (beat + centibeat / 100) / 1000;
  } else if (calendarName === 'french_republican') {
    const dh = components.decimal_hour || 0;
    const dm = components.decimal_minute || 0;
    const ds = components.decimal_second || 0;
    fraction = (dh * 10000 + dm * 100 + ds) / 100000;
  } else {
    fraction = timeToFraction(
      components.hours || 0,
      components.minutes || 0,
      components.seconds || 0,
      components.milliseconds || 0
    );
  }
  return jdn + fraction;
}

function numericValueToDate(calendarName, value) {
  const jdn = Math.floor(value);
  const fraction = value - jdn;
  const dateParts = jdnToCalendar(calendarName, jdn);

  if (calendarName === 'gregorian_swatchbeats') {
    const totalBeats = fraction * 1000;
    dateParts.beat = Math.floor(totalBeats);
    dateParts.centibeat = Math.round((totalBeats - dateParts.beat) * 100);
  } else if (calendarName === 'french_republican') {
    const totalDecSec = fraction * 100000;
    dateParts.decimal_hour = Math.floor(totalDecSec / 10000);
    dateParts.decimal_minute = Math.floor((totalDecSec % 10000) / 100);
    dateParts.decimal_second = Math.floor(totalDecSec % 100);
  } else {
    const timeParts = fractionToTime(fraction);
    dateParts.hours = timeParts.hours;
    dateParts.minutes = timeParts.minutes;
    dateParts.seconds = timeParts.seconds;
    dateParts.milliseconds = timeParts.milliseconds;
  }

  return dateParts;
}

function validateDateComponents(calendarName, components, lang) {
  const errors = [];
  const t = (key) => {
    const translations = CALENDAR_VALIDATION_MESSAGES[key];
    if (!translations) return key;
    return translations[lang] || translations.en || translations.pt || key;
  };
  const tf = (key, vars) => {
    let msg = t(key);
    for (const [k, v] of Object.entries(vars)) {
      msg = msg.replace(`{${k}}`, v);
    }
    return msg;
  };

  if (calendarName === 'gregorian' || calendarName === 'gregorian_swatchbeats') {
    const { year, month, day } = components;
    if (month !== undefined && (month < 1 || month > 12)) {
      errors.push(tf('calendar.invalid_month', { min: 1, max: 12 }));
    }
    if (year !== undefined && month !== undefined && day !== undefined) {
      const maxDay = gregorianDaysInMonth(year, month);
      if (day < 1 || day > maxDay) {
        errors.push(tf('calendar.invalid_day', { max: maxDay, month, year }));
      }
      if (month === 2 && day === 29 && !isGregorianLeapYear(year)) {
        errors.push(tf('calendar.not_leap_year', { year }));
      }
    }
  } else if (calendarName === 'hijri') {
    const { year, month, day } = components;
    if (month !== undefined && (month < 1 || month > 12)) {
      errors.push(tf('calendar.invalid_month', { min: 1, max: 12 }));
    }
    if (year !== undefined && month !== undefined && day !== undefined) {
      const maxDay = hijriDaysInMonth(year, month);
      if (day < 1 || day > maxDay) {
        errors.push(tf('calendar.invalid_day', { max: maxDay, month, year }));
      }
    }
  } else if (calendarName === 'french_republican') {
    const { year, month, day } = components;
    if (month !== undefined) {
      if (month < 1 || month > 13) {
        errors.push(tf('calendar.invalid_month', { min: 1, max: 13 }));
      }
      if (month <= 12 && day !== undefined && (day < 1 || day > 30)) {
        errors.push(tf('calendar.invalid_day', { max: 30, month, year }));
      }
      if (month === 13 && day !== undefined) {
        const maxComp = isFrenchRepublicanLeapYear(year) ? 6 : 5;
        if (day < 1 || day > maxComp) {
          errors.push(tf('calendar.invalid_complementary_day', { max: maxComp, year }));
        }
      }
    }
  } else if (calendarName === 'rumi') {
    const { year, month, day } = components;
    if (month !== undefined && (month < 1 || month > 12)) {
      errors.push(tf('calendar.invalid_month', { min: 1, max: 12 }));
    }
    if (year !== undefined && month !== undefined && day !== undefined) {
      const julianYear = year + 584;
      const base = [31,28,31,30,31,30,31,31,30,31,30,31];
      let maxDay = base[month - 1];
      if (month === 2 && isJulianLeapYear(julianYear)) maxDay = 29;
      if (day < 1 || day > maxDay) {
        errors.push(tf('calendar.invalid_day', { max: maxDay, month, year }));
      }
    }
  }

  if (components.hours !== undefined) {
    if (components.hours < 0 || components.hours > 23) {
      errors.push(t('calendar.invalid_hour'));
    }
  }
  if (components.minutes !== undefined) {
    if (components.minutes < 0 || components.minutes > 59) {
      errors.push(t('calendar.invalid_minute'));
    }
  }
  if (components.seconds !== undefined) {
    if (components.seconds < 0 || components.seconds > 59) {
      errors.push(t('calendar.invalid_second'));
    }
  }
  if (components.milliseconds !== undefined) {
    if (components.milliseconds < 0 || components.milliseconds > 999) {
      errors.push(t('calendar.invalid_millisecond'));
    }
  }
  if (components.beat !== undefined) {
    if (components.beat < 0 || components.beat > 999) {
      errors.push(t('calendar.invalid_beat'));
    }
  }
  if (components.decimal_hour !== undefined) {
    if (components.decimal_hour < 0 || components.decimal_hour > 9) {
      errors.push(t('calendar.invalid_decimal_hour'));
    }
  }
  if (components.decimal_minute !== undefined) {
    if (components.decimal_minute < 0 || components.decimal_minute > 99) {
      errors.push(t('calendar.invalid_decimal_minute'));
    }
  }

  return errors;
}

const CALENDAR_VALIDATION_MESSAGES = {
  'calendar.invalid_month': {
    pt: 'Mês inválido (deve ser entre {min} e {max}).',
    en: 'Invalid month (must be between {min} and {max}).',
    es: 'Mes inválido (debe estar entre {min} y {max}).',
    fr: 'Mois invalide (doit être entre {min} et {max}).',
    it: 'Mese non valido (deve essere tra {min} e {max}).',
    de: 'Ungültiger Monat (muss zwischen {min} und {max} liegen).'
  },
  'calendar.invalid_day': {
    pt: 'Dia inválido (máximo {max} para o mês {month} no ano {year}).',
    en: 'Invalid day (maximum {max} for month {month} in year {year}).',
    es: 'Día inválido (máximo {max} para el mes {month} en el año {year}).',
    fr: 'Jour invalide (maximum {max} pour le mois {month} en année {year}).',
    it: 'Giorno non valido (massimo {max} per il mese {month} nell\'anno {year}).',
    de: 'Ungültiger Tag (maximal {max} für Monat {month} im Jahr {year}).'
  },
  'calendar.not_leap_year': {
    pt: '{year} não é um ano bissexto.',
    en: '{year} is not a leap year.',
    es: '{year} no es un año bisiesto.',
    fr: '{year} n\'est pas une année bissextile.',
    it: '{year} non è un anno bisestile.',
    de: '{year} ist kein Schaltjahr.'
  },
  'calendar.invalid_complementary_day': {
    pt: 'Dia complementar inválido (máximo {max} no ano {year}).',
    en: 'Invalid complementary day (maximum {max} in year {year}).',
    es: 'Día complementario inválido (máximo {max} en el año {year}).',
    fr: 'Jour complémentaire invalide (maximum {max} en année {year}).',
    it: 'Giorno complementare non valido (massimo {max} nell\'anno {year}).',
    de: 'Ungültiger Ergänzungstag (maximal {max} im Jahr {year}).'
  },
  'calendar.invalid_hour': {
    pt: 'Hora inválida (deve ser entre 0 e 23).',
    en: 'Invalid hour (must be between 0 and 23).',
    es: 'Hora inválida (debe estar entre 0 y 23).',
    fr: 'Heure invalide (doit être entre 0 et 23).',
    it: 'Ora non valida (deve essere tra 0 e 23).',
    de: 'Ungültige Stunde (muss zwischen 0 und 23 liegen).'
  },
  'calendar.invalid_minute': {
    pt: 'Minuto inválido (deve ser entre 0 e 59).',
    en: 'Invalid minute (must be between 0 and 59).',
    es: 'Minuto inválido (debe estar entre 0 y 59).',
    fr: 'Minute invalide (doit être entre 0 et 59).',
    it: 'Minuto non valido (deve essere tra 0 e 59).',
    de: 'Ungültige Minute (muss zwischen 0 und 59 liegen).'
  },
  'calendar.invalid_second': {
    pt: 'Segundo inválido (deve ser entre 0 e 59).',
    en: 'Invalid second (must be between 0 and 59).',
    es: 'Segundo inválido (debe estar entre 0 y 59).',
    fr: 'Seconde invalide (doit être entre 0 et 59).',
    it: 'Secondo non valido (deve essere tra 0 e 59).',
    de: 'Ungültige Sekunde (muss zwischen 0 und 59 liegen).'
  },
  'calendar.invalid_millisecond': {
    pt: 'Milissegundo inválido (deve ser entre 0 e 999).',
    en: 'Invalid millisecond (must be between 0 and 999).',
    es: 'Milisegundo inválido (debe estar entre 0 y 999).',
    fr: 'Milliseconde invalide (doit être entre 0 et 999).',
    it: 'Millisecondo non valido (deve essere tra 0 e 999).',
    de: 'Ungültige Millisekunde (muss zwischen 0 und 999 liegen).'
  },
  'calendar.invalid_beat': {
    pt: 'Beat inválido (deve ser entre 0 e 999).',
    en: 'Invalid beat (must be between 0 and 999).',
    es: 'Beat inválido (debe estar entre 0 y 999).',
    fr: 'Beat invalide (doit être entre 0 et 999).',
    it: 'Beat non valido (deve essere tra 0 e 999).',
    de: 'Ungültiger Beat (muss zwischen 0 und 999 liegen).'
  },
  'calendar.invalid_decimal_hour': {
    pt: 'Hora decimal inválida (deve ser entre 0 e 9).',
    en: 'Invalid decimal hour (must be between 0 and 9).',
    es: 'Hora decimal inválida (debe estar entre 0 y 9).',
    fr: 'Heure décimale invalide (doit être entre 0 et 9).',
    it: 'Ora decimale non valida (deve essere tra 0 e 9).',
    de: 'Ungültige Dezimalstunde (muss zwischen 0 und 9 liegen).'
  },
  'calendar.invalid_decimal_minute': {
    pt: 'Minuto decimal inválido (deve ser entre 0 e 99).',
    en: 'Invalid decimal minute (must be between 0 and 99).',
    es: 'Minuto decimal inválido (debe estar entre 0 y 99).',
    fr: 'Minute décimale invalide (doit être entre 0 et 99).',
    it: 'Minuto decimale non valido (deve essere tra 0 e 99).',
    de: 'Ungültige Dezimalminute (muss zwischen 0 und 99 liegen).'
  },
  'calendar.inconsistent_units': {
    pt: 'As unidades de tempo são inconsistentes entre os calendários: "{cal1}" tem "{unit}" mas "{cal2}" não.',
    en: 'Time units are inconsistent between calendars: "{cal1}" has "{unit}" but "{cal2}" does not.',
    es: 'Las unidades de tiempo son inconsistentes entre calendarios: "{cal1}" tiene "{unit}" pero "{cal2}" no.',
    fr: 'Les unités de temps sont incohérentes entre les calendriers : "{cal1}" a "{unit}" mais "{cal2}" non.',
    it: 'Le unità di tempo sono incoerenti tra i calendari: "{cal1}" ha "{unit}" ma "{cal2}" no.',
    de: 'Die Zeiteinheiten sind zwischen den Kalendern inkonsistent: "{cal1}" hat "{unit}" aber "{cal2}" nicht.'
  }
};

function getCalendarUnitRange(calendarDef) {
  const allUnits = calendarDef.units;
  const excluded = new Set(calendarDef.exclude_units || []);
  const active = allUnits.filter(u => !excluded.has(u));
  const minIdx = allUnits.indexOf(calendarDef.min_unit);
  const maxIdx = allUnits.indexOf(calendarDef.max_unit);
  return active.filter(u => {
    const idx = allUnits.indexOf(u);
    return idx >= maxIdx && idx <= minIdx;
  });
}

function canUseNativeDateInput(calendarDef) {
  if (calendarDef.name !== 'gregorian') return false;
  const excluded = new Set(calendarDef.exclude_units || []);
  const min = calendarDef.min_unit;
  const max = calendarDef.max_unit;
  if (max === 'year' && min === 'day' && excluded.has('week') && excluded.has('weekday')) return 'date';
  if (max === 'year' && min === 'minute' && excluded.has('week') && excluded.has('weekday') && excluded.has('second') && excluded.has('millisecond')) return 'datetime-local';
  if (max === 'year' && min === 'second' && excluded.has('week') && excluded.has('weekday') && excluded.has('millisecond')) return 'datetime-local';
  if (max === 'year' && min === 'millisecond' && excluded.has('week') && excluded.has('weekday')) return false;
  if (max === 'year' && min === 'month') return 'month';
  if (max === 'year' && (min === 'week' || min === 'weekday')) return 'week';
  if (max === 'hour' && (min === 'minute' || min === 'second' || min === 'millisecond')) return 'time';
  return false;
}

function checkCalendarConsistency(calendars) {
  const warnings = [];
  const activeCalendars = calendars.filter(c => c.active !== false);
  if (activeCalendars.length <= 1) return warnings;

  const timeUnits = ['timezone','hour','minute','second','millisecond','beat','centibeat','decimal_hour','decimal_minute','decimal_second'];
  const dateUnits = ['year','month','day'];

  for (let i = 0; i < activeCalendars.length; i++) {
    for (let j = i + 1; j < activeCalendars.length; j++) {
      const c1 = activeCalendars[i];
      const c2 = activeCalendars[j];
      const r1 = getCalendarUnitRange(c1);
      const r2 = getCalendarUnitRange(c2);

      const hasTime1 = r1.some(u => timeUnits.includes(u));
      const hasTime2 = r2.some(u => timeUnits.includes(u));
      const hasDate1 = r1.some(u => dateUnits.includes(u));
      const hasDate2 = r2.some(u => dateUnits.includes(u));

      if (hasTime1 !== hasTime2) {
        warnings.push({ cal1: c1.name, cal2: c2.name, type: 'time_mismatch' });
      }
      if (hasDate1 !== hasDate2) {
        warnings.push({ cal1: c1.name, cal2: c2.name, type: 'date_mismatch' });
      }
    }
  }
  return warnings;
}

function formatCalendarDate(calendarName, components, lang, calendarDef) {
  const def = calendarDef || CALENDAR_DEFINITIONS[calendarName];
  if (!def) return JSON.stringify(components);

  const parts = [];

  if (calendarName === 'japanese' && components.era) {
    parts.push(`${components.kanji || components.era} ${components.year}`);
  } else if (components.year !== undefined) {
    parts.push(String(components.year));
  }

  if (components.month !== undefined) {
    const monthNames = def.month_names;
    if (monthNames) {
      const names = monthNames[lang] || monthNames.en || monthNames[Object.keys(monthNames)[0]];
      if (names && components.month >= 1 && components.month <= names.length) {
        parts.push(names[components.month - 1]);
      } else {
        parts.push(String(components.month));
      }
    } else {
      parts.push(String(components.month).padStart(2, '0'));
    }
  }

  if (components.day !== undefined) {
    parts.push(String(components.day).padStart(2, '0'));
  }

  let datePart = parts.join(calendarName === 'japanese' ? '年 ' : '/');

  if (components.complementary && def.complementary_day_names) {
    const names = def.complementary_day_names[lang] || def.complementary_day_names.en || def.complementary_day_names.fr;
    if (names && components.day >= 1 && components.day <= names.length) {
      datePart = `${components.year} — ${names[components.day - 1]}`;
    }
  }

  let timePart = '';
  if (calendarName === 'gregorian_swatchbeats') {
    if (components.beat !== undefined) {
      timePart = `@${String(components.beat).padStart(3, '0')}`;
      if (components.centibeat !== undefined) {
        timePart += `.${String(components.centibeat).padStart(2, '0')}`;
      }
    }
  } else if (calendarName === 'french_republican') {
    if (components.decimal_hour !== undefined) {
      timePart = `${components.decimal_hour}h`;
      if (components.decimal_minute !== undefined) timePart += String(components.decimal_minute).padStart(2, '0');
      if (components.decimal_second !== undefined) timePart += `:${String(components.decimal_second).padStart(2, '0')}`;
    }
  } else {
    if (components.hours !== undefined) {
      timePart = `${String(components.hours).padStart(2, '0')}:${String(components.minutes || 0).padStart(2, '0')}`;
      if (components.seconds !== undefined) {
        timePart += `:${String(components.seconds).padStart(2, '0')}`;
        if (components.milliseconds !== undefined) {
          timePart += `.${String(components.milliseconds).padStart(3, '0')}`;
        }
      }
    }
  }

  if (timePart) {
    return `${datePart} ${timePart}`;
  }
  return datePart;
}

function getCalendarDescription(calendarName, lang) {
  const def = CALENDAR_DEFINITIONS[calendarName];
  if (!def) return '';
  const descriptions = CALENDAR_DESCRIPTIONS[calendarName];
  if (!descriptions) return '';
  return descriptions[lang] || descriptions.en || descriptions.pt || '';
}

const CALENDAR_DESCRIPTIONS = {
  gregorian: {
    pt: 'Calendário solar com 12 meses (28-31 dias). Anos bissextos a cada 4 anos (exceto séculos não divisíveis por 400). Semana de 7 dias.',
    en: 'Solar calendar with 12 months (28-31 days). Leap years every 4 years (except centuries not divisible by 400). 7-day week.',
    es: 'Calendario solar con 12 meses (28-31 días). Años bisiestos cada 4 años (excepto siglos no divisibles por 400). Semana de 7 días.',
    fr: 'Calendrier solaire avec 12 mois (28-31 jours). Années bissextiles tous les 4 ans (sauf siècles non divisibles par 400). Semaine de 7 jours.',
    it: 'Calendario solare con 12 mesi (28-31 giorni). Anni bisestili ogni 4 anni (eccetto secoli non divisibili per 400). Settimana di 7 giorni.',
    de: 'Sonnenkalender mit 12 Monaten (28-31 Tage). Schaltjahre alle 4 Jahre (außer Jahrhunderte nicht durch 400 teilbar). 7-Tage-Woche.'
  },
  gregorian_swatchbeats: {
    pt: 'Calendário gregoriano com o sistema de tempo Swatch Internet Time. O dia divide-se em 1000 .beats (1 beat = 86,4 segundos). Baseado em UTC+1 (Biel Mean Time). Sem fusos horários.',
    en: 'Gregorian calendar with Swatch Internet Time system. The day is divided into 1000 .beats (1 beat = 86.4 seconds). Based on UTC+1 (Biel Mean Time). No time zones.',
    es: 'Calendario gregoriano con el sistema Swatch Internet Time. El día se divide en 1000 .beats (1 beat = 86,4 segundos). Basado en UTC+1.',
    fr: 'Calendrier grégorien avec le système Swatch Internet Time. Le jour est divisé en 1000 .beats (1 beat = 86,4 secondes). Basé sur UTC+1.',
    it: 'Calendario gregoriano con il sistema Swatch Internet Time. Il giorno è diviso in 1000 .beats (1 beat = 86,4 secondi). Basato su UTC+1.',
    de: 'Gregorianischer Kalender mit Swatch Internet Time System. Der Tag wird in 1000 .beats unterteilt (1 Beat = 86,4 Sekunden). Basiert auf UTC+1.'
  },
  chinese: {
    pt: 'Calendário lunissolar. Meses de 29-30 dias baseados no ciclo lunar. Mês intercalar adicionado ~cada 3 anos. Ciclo sexagenário de 60 anos (10 Troncos Celestiais × 12 Ramos Terrestres). 12 animais do zodíaco.',
    en: 'Lunisolar calendar. Months of 29-30 days based on the lunar cycle. Leap month added ~every 3 years. 60-year sexagenary cycle (10 Heavenly Stems × 12 Earthly Branches). 12 zodiac animals.',
    es: 'Calendario lunisolar. Meses de 29-30 días basados en el ciclo lunar. Mes intercalar añadido ~cada 3 años. Ciclo sexagenario de 60 años. 12 animales del zodíaco.',
    fr: 'Calendrier luni-solaire. Mois de 29-30 jours basés sur le cycle lunaire. Mois intercalaire ajouté ~tous les 3 ans. Cycle sexagésimal de 60 ans. 12 animaux du zodiaque.',
    it: 'Calendario lunisolare. Mesi di 29-30 giorni basati sul ciclo lunare. Mese intercalare aggiunto ~ogni 3 anni. Ciclo sessagenario di 60 anni. 12 animali dello zodiaco.',
    de: 'Lunisolarer Kalender. Monate von 29-30 Tagen basierend auf dem Mondzyklus. Schaltmonat ~alle 3 Jahre. 60-jähriger Sexagesimalzyklus. 12 Tierkreiszeichen.'
  },
  japanese: {
    pt: 'Calendário gregoriano com eras imperiais. Cada era muda com um novo imperador (atual: Reiwa, desde 2019). Conta os anos a partir do início de cada era.',
    en: 'Gregorian calendar with imperial eras. Each era changes with a new emperor (current: Reiwa, since 2019). Years are counted from the start of each era.',
    es: 'Calendario gregoriano con eras imperiales. Cada era cambia con un nuevo emperador (actual: Reiwa, desde 2019). Los años se cuentan desde el inicio de cada era.',
    fr: 'Calendrier grégorien avec ères impériales. Chaque ère change avec un nouvel empereur (actuelle : Reiwa, depuis 2019). Les années sont comptées depuis le début de chaque ère.',
    it: 'Calendario gregoriano con ere imperiali. Ogni era cambia con un nuovo imperatore (attuale: Reiwa, dal 2019). Gli anni si contano dall\'inizio di ogni era.',
    de: 'Gregorianischer Kalender mit kaiserlichen Ären. Jede Ära wechselt mit einem neuen Kaiser (aktuell: Reiwa, seit 2019). Jahre werden ab dem Beginn jeder Ära gezählt.'
  },
  hijri: {
    pt: 'Calendário lunar puro com 12 meses (29-30 dias). Ano de 354-355 dias, deslizando ~11 dias/ano em relação ao gregoriano. Ciclo de anos bissextos de 30 anos (11 anos bissextos). Início dos meses determinado pela observação do crescente lunar.',
    en: 'Pure lunar calendar with 12 months (29-30 days). Year of 354-355 days, shifting ~11 days/year relative to Gregorian. 30-year leap year cycle (11 leap years). Month start determined by crescent moon sighting.',
    es: 'Calendario lunar puro con 12 meses (29-30 días). Año de 354-355 días, desplazándose ~11 días/año respecto al gregoriano. Ciclo de 30 años bisiestos (11 bisiestos).',
    fr: 'Calendrier lunaire pur avec 12 mois (29-30 jours). Année de 354-355 jours, décalée de ~11 jours/an par rapport au grégorien. Cycle de 30 ans (11 années bissextiles).',
    it: 'Calendario lunare puro con 12 mesi (29-30 giorni). Anno di 354-355 giorni, sfasato di ~11 giorni/anno rispetto al gregoriano. Ciclo di 30 anni (11 bisestili).',
    de: 'Reiner Mondkalender mit 12 Monaten (29-30 Tage). Jahr mit 354-355 Tagen, ~11 Tage/Jahr Verschiebung zum Gregorianischen. 30-Jahres-Schaltjahrzyklus (11 Schaltjahre).'
  },
  rumi: {
    pt: 'Calendário solar baseado no Juliano, com anos contados a partir da Hégira (622 d.C.). Usado no Império Otomano para fins civis e fiscais. Offset de 584 anos em relação ao Gregoriano.',
    en: 'Julian-based solar calendar with years counted from the Hijra (622 CE). Used in the Ottoman Empire for civil and fiscal purposes. 584-year offset from Gregorian.',
    es: 'Calendario solar basado en el Juliano, con años contados desde la Hégira (622 d.C.). Usado en el Imperio Otomano. Desfase de 584 años con el Gregoriano.',
    fr: 'Calendrier solaire basé sur le Julien, avec les années comptées depuis l\'Hégire (622 apr. J.-C.). Utilisé dans l\'Empire ottoman. Décalage de 584 ans avec le Grégorien.',
    it: 'Calendario solare basato sul Giuliano, con anni contati dall\'Egira (622 d.C.). Usato nell\'Impero Ottomano. Offset di 584 anni dal Gregoriano.',
    de: 'Julianischer Sonnenkalender mit Jahren ab der Hidschra (622 n.Chr.). Im Osmanischen Reich für zivile Zwecke verwendet. 584 Jahre Versatz zum Gregorianischen.'
  },
  french_republican: {
    pt: 'Calendário solar com 12 meses de 30 dias + 5-6 dias complementares. Semana de 10 dias (décade). Tempo decimal: 10 horas/dia, 100 minutos/hora, 100 segundos/minuto. Ano começa no equinócio de outono.',
    en: 'Solar calendar with 12 months of 30 days + 5-6 complementary days. 10-day week (décade). Decimal time: 10 hours/day, 100 minutes/hour, 100 seconds/minute. Year starts at autumnal equinox.',
    es: 'Calendario solar con 12 meses de 30 días + 5-6 días complementarios. Semana de 10 días (décade). Tiempo decimal. Año comienza en el equinoccio de otoño.',
    fr: 'Calendrier solaire avec 12 mois de 30 jours + 5-6 jours complémentaires. Semaine de 10 jours (décade). Temps décimal : 10 heures/jour, 100 minutes/heure. Année commence à l\'équinoxe d\'automne.',
    it: 'Calendario solare con 12 mesi di 30 giorni + 5-6 giorni complementari. Settimana di 10 giorni (décade). Tempo decimale. Anno inizia all\'equinozio d\'autunno.',
    de: 'Sonnenkalender mit 12 Monaten à 30 Tage + 5-6 Ergänzungstage. 10-Tage-Woche (Dekade). Dezimalzeit: 10 Stunden/Tag, 100 Minuten/Stunde. Jahr beginnt bei der Herbst-Tagundnachtgleiche.'
  }
};

export {
  CALENDAR_DEFINITIONS,
  UTC_OFFSETS,
  CALENDAR_VALIDATION_MESSAGES,
  CALENDAR_DESCRIPTIONS,
  isGregorianLeapYear,
  gregorianDaysInMonth,
  gregorianDaysInYear,
  gregorianToJDN,
  jdnToGregorian,
  gregorianWeekday,
  weekdayFromJDN,
  isHijriLeapYear,
  hijriDaysInMonth,
  hijriDaysInYear,
  hijriToJDN,
  jdnToHijri,
  isJulianLeapYear,
  julianToJDN,
  jdnToJulian,
  rumiToJDN,
  jdnToRumi,
  isFrenchRepublicanLeapYear,
  frenchRepublicanToJDN,
  jdnToFrenchRepublican,
  chineseApproxToJDN,
  jdnToChineseApprox,
  getJapaneseEra,
  japaneseToJDN,
  jdnToJapanese,
  convertBetweenCalendars,
  calendarToJDN,
  jdnToCalendar,
  timeToFraction,
  fractionToTime,
  timeToSwatchBeats,
  swatchBeatsToTime,
  timeToDecimal,
  decimalToTime,
  applyTimezoneOffset,
  dateToNumericValue,
  numericValueToDate,
  validateDateComponents,
  getCalendarUnitRange,
  canUseNativeDateInput,
  checkCalendarConsistency,
  formatCalendarDate,
  getCalendarDescription
};
