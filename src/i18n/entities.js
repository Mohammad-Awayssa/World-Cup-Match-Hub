const arabicTeamsByCode = {
  dz: 'الجزائر', ar: 'الأرجنتين', au: 'أستراليا', at: 'النمسا', be: 'بلجيكا',
  ba: 'البوسنة والهرسك', br: 'البرازيل', ca: 'كندا', cv: 'الرأس الأخضر',
  co: 'كولومبيا', hr: 'كرواتيا', cw: 'كوراساو', cz: 'التشيك', cd: 'الكونغو الديمقراطية',
  ec: 'الإكوادور', eg: 'مصر', gb_eng: 'إنجلترا', gb: 'إنجلترا', fr: 'فرنسا',
  de: 'ألمانيا', gh: 'غانا', ht: 'هايتي', ir: 'إيران', iq: 'العراق', jp: 'اليابان',
  jo: 'الأردن', mx: 'المكسيك', ma: 'المغرب', nl: 'هولندا', nz: 'نيوزيلندا',
  no: 'النرويج', pa: 'بنما', py: 'باراغواي', pt: 'البرتغال', qa: 'قطر',
  sa: 'السعودية', gb_sct: 'اسكتلندا', sn: 'السنغال', za: 'جنوب أفريقيا',
  kr: 'كوريا الجنوبية', es: 'إسبانيا', se: 'السويد', ch: 'سويسرا', tr: 'تركيا',
  tn: 'تونس', uy: 'أوروغواي', us: 'الولايات المتحدة', uz: 'أوزبكستان', ci: 'ساحل العاج',
};

const arabicTeamsByName = {
  Algeria: 'الجزائر',
  Argentina: 'الأرجنتين',
  Australia: 'أستراليا',
  Austria: 'النمسا',
  Belgium: 'بلجيكا',
  'Bosnia & Herzegovina': 'البوسنة والهرسك',
  Brazil: 'البرازيل',
  Canada: 'كندا',
  'Cape Verde': 'الرأس الأخضر',
  Colombia: 'كولومبيا',
  Croatia: 'كرواتيا',
  Curaçao: 'كوراساو',
  'CuraÃ§ao': 'كوراساو',
  Czechia: 'التشيك',
  'DR Congo': 'الكونغو الديمقراطية',
  Ecuador: 'الإكوادور',
  Egypt: 'مصر',
  England: 'إنجلترا',
  France: 'فرنسا',
  Germany: 'ألمانيا',
  Ghana: 'غانا',
  Haiti: 'هايتي',
  Iran: 'إيران',
  Iraq: 'العراق',
  Japan: 'اليابان',
  Jordan: 'الأردن',
  Mexico: 'المكسيك',
  Morocco: 'المغرب',
  Netherlands: 'هولندا',
  'New Zealand': 'نيوزيلندا',
  Norway: 'النرويج',
  Panama: 'بنما',
  Paraguay: 'باراغواي',
  Portugal: 'البرتغال',
  Qatar: 'قطر',
  'Saudi Arabia': 'السعودية',
  Scotland: 'اسكتلندا',
  Senegal: 'السنغال',
  'South Africa': 'جنوب أفريقيا',
  'South Korea': 'كوريا الجنوبية',
  Spain: 'إسبانيا',
  Sweden: 'السويد',
  Switzerland: 'سويسرا',
  Tunisia: 'تونس',
  Uruguay: 'أوروغواي',
  USA: 'الولايات المتحدة',
  Uzbekistan: 'أوزبكستان',
  "Côte d'Ivoire": 'ساحل العاج',
  "CÃ´te d'Ivoire": 'ساحل العاج',
  Türkiye: 'تركيا',
  'TÃ¼rkiye': 'تركيا',
};

const arabicCities = {
  Atlanta: 'أتلانتا', Boston: 'بوسطن', Dallas: 'دالاس', Guadalajara: 'غوادالاخارا',
  Houston: 'هيوستن', 'Kansas City': 'كانساس سيتي', 'Los Angeles': 'لوس أنجلوس',
  'Mexico City': 'مكسيكو سيتي', Miami: 'ميامي', Monterrey: 'مونتيري',
  'New York/New Jersey': 'نيويورك / نيوجيرسي', Philadelphia: 'فيلادلفيا',
  'San Francisco Bay Area': 'منطقة خليج سان فرانسيسكو', Seattle: 'سياتل',
  Toronto: 'تورونتو', Vancouver: 'فانكوفر',
};

const arabicStadiums = {
  'Atlanta Stadium': 'ملعب أتلانتا',
  'BC Place Vancouver': 'بي سي بليس فانكوفر',
  'Boston Stadium': 'ملعب بوسطن',
  'Dallas Stadium': 'ملعب دالاس',
  'Estadio Ciudad de Mexico': 'ملعب مدينة مكسيكو',
  'Estadio Guadalajara': 'ملعب غوادالاخارا',
  'Estadio Monterrey': 'ملعب مونتيري',
  'Houston Stadium': 'ملعب هيوستن',
  'Kansas City Stadium': 'ملعب كانساس سيتي',
  'Los Angeles Stadium': 'ملعب لوس أنجلوس',
  'Miami Stadium': 'ملعب ميامي',
  'New York New Jersey Stadium': 'ملعب نيويورك نيوجيرسي',
  'Philadelphia Stadium': 'ملعب فيلادلفيا',
  'San Francisco Bay Area Stadium': 'ملعب منطقة خليج سان فرانسيسكو',
  'Seattle Stadium': 'ملعب سياتل',
  'Toronto Stadium': 'ملعب تورونتو',
};

const normalizeCode = (code = '') => String(code ?? '').toLowerCase().replace('-', '_');

export const localizeTeam = (name, code, language) => {
  if (/^(Winner|Loser) Match \d+$/.test(String(name ?? ''))) {
    return language === 'ar' ? '\u064a\u062d\u062f\u062f \u0644\u0627\u062d\u0642\u0627' : 'To be decided';
  }
  if (language !== 'ar') return name;
  const translated = arabicTeamsByCode[normalizeCode(code)] ?? arabicTeamsByName[name];
  if (translated) return translated;
  if (!name) return '';

  let match = name.match(/^Winner Group ([A-L])$/);
  if (match) return `متصدر المجموعة ${match[1]}`;
  match = name.match(/^Runner-up Group ([A-L])$/);
  if (match) return `وصيف المجموعة ${match[1]}`;
  match = name.match(/^Winner Match (\d+)$/);
  if (match) return `الفائز من المباراة ${match[1]}`;
  match = name.match(/^Loser Match (\d+)$/);
  if (match) return `الخاسر من المباراة ${match[1]}`;
  match = name.match(/^3rd Place \((.+)\)$/);
  if (match) return `أحد أفضل الثوالث (${match[1]})`;
  return name;
};

export const localizeCity = (city, language) => (
  language === 'ar' ? arabicCities[city] ?? city : city
);

export const localizeStadium = (stadium, language) => (
  language === 'ar' ? arabicStadiums[stadium] ?? stadium : stadium
);

export const localizeStage = (stage, t) => t(`stages.${stage}`);

export const localizeTimezone = (timezone, language) => {
  if (language !== 'ar') return timezone;
  if (['Asia/Hebron', 'Asia/Jerusalem', 'Asia/Gaza'].includes(timezone)) return 'القدس';
  return timezone.replaceAll('_', ' ');
};
