const NOVEMBER_MASTER_NAMES = {
  olander: ["Olander", ["Oration", "Meritocracy", "Combat Fervor", "Combined Arms"]],
  catherine: ["Catherine", ["Mystic Privileges", "Pet Master", "Beastly Bounty", "Traveler Honors"]],
};

const NOVEMBER_MASTER_TEXT = {
  en: ["Calculating Strategist", "The Countess", "Battlefield Insight", "Conquest Boons", "Prep points", "Daily reward tiers", "Kingdom Coins", "Shop items", "KvK Lethality & Health", "KvK Rally Capacity", "Trial Crystals", "Double reward chance", "Extra pet attempts", "Chests per rally", "Daily chest cap", "Journey activities", "Chests per reward", "Idle Conquest minutes", "KvK Attack & Defense", "Learning XP"],
  ar: ["الاستراتيجي المحنّك", "الكونتيسة", "بصيرة ساحة المعركة", "مكافآت الفتح", "نقاط التحضير", "مستويات المكافآت اليومية", "عملات المملكة", "عناصر المتجر", "الفتك والصحة في KvK", "سعة الحشد في KvK", "بلورات المحاكمة", "فرصة مضاعفة المكافآت", "محاولات حيوانات إضافية", "صناديق لكل حشد", "الحد اليومي للصناديق", "أنشطة الرحلة", "صناديق لكل مكافأة", "دقائق انتظار مكافآت الفتح", "الهجوم والدفاع في KvK", "خبرة التعلّم"],
  fr: ["Stratège calculateur", "La comtesse", "Vision tactique", "Récompenses de conquête", "Points de préparation", "Paliers de récompenses quotidiens", "Pièces du royaume", "Articles en boutique", "Létalité et santé en KvK", "Capacité de ralliement en KvK", "Cristaux d’épreuve", "Chance de doubler les récompenses", "Tentatives d’animal en plus", "Coffres par ralliement", "Limite de coffres par jour", "Activités de voyage", "Coffres par récompense", "Minutes de conquête passive", "Attaque et défense en KvK", "XP d’apprentissage"],
  es: ["Estratega calculador", "La condesa", "Visión táctica", "Recompensas de conquista", "Puntos de preparación", "Niveles de recompensa diarios", "Monedas del reino", "Artículos de tienda", "Letalidad y salud en KvK", "Capacidad de concentración en KvK", "Cristales de prueba", "Probabilidad de recompensa doble", "Intentos de mascota extra", "Cofres por concentración", "Límite diario de cofres", "Actividades de viaje", "Cofres por recompensa", "Minutos de conquista pasiva", "Ataque y defensa en KvK", "EXP de aprendizaje"],
  de: ["Berechnender Stratege", "Die Gräfin", "Taktischer Weitblick", "Eroberungsbelohnungen", "Vorbereitungspunkte", "Tägliche Belohnungsstufen", "Königreichsmünzen", "Shop-Artikel", "Tödlichkeit und Gesundheit im KvK", "Rallye-Kapazität im KvK", "Prüfungskristalle", "Chance auf doppelte Belohnung", "Zusätzliche Tierversuche", "Truhen pro Rallye", "Tägliches Truhenlimit", "Reiseaktivitäten", "Truhen pro Belohnung", "Passive Eroberungsminuten", "Angriff und Verteidigung im KvK", "Lern-EP"],
  tr: ["Hesapçı Stratejist", "Kontes", "Savaş Alanı Sezgisi", "Fetih Ödülleri", "Hazırlık puanları", "Günlük ödül kademeleri", "Krallık paraları", "Mağaza öğeleri", "KvK öldürücülüğü ve sağlığı", "KvK toplanma kapasitesi", "Sınav kristalleri", "Çifte ödül şansı", "Ek hayvan denemeleri", "Toplanma başına sandık", "Günlük sandık sınırı", "Yolculuk etkinlikleri", "Ödül başına sandık", "Pasif fetih dakikaları", "KvK saldırısı ve savunması", "Öğrenme XP’si"],
  ko: ["치밀한 전략가", "백작부인", "전장 통찰", "정복 보상", "준비 점수", "일일 보상 단계", "왕국 코인", "상점 품목", "KvK 살상력 및 체력", "KvK 집결 수용량", "시련 수정", "보상 두 배 확률", "추가 펫 도전", "집결당 상자", "일일 상자 한도", "여정 활동", "보상당 상자", "정복 대기 시간(분)", "KvK 공격력 및 방어력", "학습 경험치"],
  ja: ["策士", "伯爵夫人", "戦場の洞察", "征服報酬", "準備ポイント", "毎日の報酬段階", "王国コイン", "ショップ商品", "KvKの殺傷力とHP", "KvKの集結容量", "試練クリスタル", "報酬2倍の確率", "ペット冒険の追加回数", "集結ごとの宝箱", "宝箱の1日上限", "旅のアクティビティ", "報酬ごとの宝箱", "征服の放置時間（分）", "KvKの攻撃力と防御力", "学習EXP"],
  zh: ["精算战略家", "伯爵夫人", "战场洞察", "征服奖励", "备战积分", "每日奖励档位", "王国币", "商店商品", "KvK杀伤力与生命", "KvK集结容量", "试炼水晶", "双倍奖励概率", "额外宠物冒险次数", "每次集结的宝箱", "每日宝箱上限", "旅途活动", "每次奖励的宝箱", "征服挂机分钟数", "KvK攻击与防御", "学习经验"],
};

const NOVEMBER_SKILL_TRANSLATIONS = {
  ar: [["الخطابة", "مكافأة الاستحقاق", "الحماس القتالي", "القوات المشتركة"], ["امتيازات المحاكمة", "خبيرة الحيوانات", "مكافأة الوحوش", "تكريم المسافرين"]],
  fr: [["Art oratoire", "Méritocratie", "Ferveur au combat", "Armes combinées"], ["Privilèges mystiques", "Maîtrise des animaux", "Prime aux monstres", "Honneurs du voyageur"]],
  es: [["Oratoria", "Meritocracia", "Fervor de combate", "Armas combinadas"], ["Privilegios místicos", "Dominio de mascotas", "Recompensa por bestias", "Honores del viajero"]],
  de: [["Redekunst", "Meritokratie", "Kampfeslust", "Verbundene Waffen"], ["Mystische Privilegien", "Tiermeisterin", "Bestienprämie", "Ehrung der Reisenden"]],
  tr: [["Hitabet", "Liyakat", "Savaş Şevki", "Birleşik Kuvvetler"], ["Mistik Ayrıcalıklar", "Hayvan Ustası", "Canavar Ödülü", "Gezgin Onurları"]],
  ko: [["연설", "능력주의", "전투 열정", "연합 병과"], ["신비한 특권", "펫 마스터", "야수 현상금", "여행자의 명예"]],
  ja: [["演説", "実力主義", "戦闘への熱意", "諸兵科連合"], ["神秘の特権", "ペットマスター", "野獣の報奨", "旅人の栄誉"]],
  zh: [["演说", "论功行赏", "战斗热忱", "协同作战"], ["秘境特权", "宠物大师", "野兽悬赏", "旅者荣誉"]],
};

// Each effect uses its localized label and whether the value is a percentage.
const NOVEMBER_SKILL_EFFECTS = {
  olander: [[[4, true], [5]], [[6], [7]], [[8, true]], [[9]]],
  catherine: [[[10, true]], [[11, true], [12]], [[13], [14]], [[15], [16], [14]]],
};

function novemberProfiles(baseProfile) {
  return Object.fromEntries(Object.entries(NOVEMBER_MASTER_DATA).map(([id, data]) => {
    const [name, skillNames] = NOVEMBER_MASTER_NAMES[id];
    return [id, {
      name,
      image: `portraits/${id}.webp`,
      storage: `saifksMasters${name}State`,
      i18n: baseProfile.i18n,
      extra: baseProfile.extra,
      levels: data.affinity.map(([affinity, emblems, stat], index) => ({
        level: index + 1,
        cumulative_affinity: affinity,
        cumulative_advancement: emblems,
        troops_attack_percent: stat,
      })),
      skills: data.skills.map((rows, index) => ({
        id: skillNames[index].toLowerCase().replaceAll(" ", "_"),
        name: {
          en: skillNames[index],
          ...Object.fromEntries(Object.entries(NOVEMBER_SKILL_TRANSLATIONS).map(([language, names]) =>
            [language, names[id === "olander" ? 0 : 1][index]])),
        },
        metrics: NOVEMBER_SKILL_EFFECTS[id][index],
        levels: rows.map(([books, exp, ...effects], level) => ({level: level + 1, books, exp, effects: effects.slice(0, NOVEMBER_SKILL_EFFECTS[id][index].length)})),
      })),
      expertise: data.expertise,
    }];
  }));
}

function novemberEffect(values, metrics, language, change = false) {
  const labels = NOVEMBER_MASTER_TEXT[language] || NOVEMBER_MASTER_TEXT.en;
  const format = new Intl.NumberFormat(language === "ar" ? "en-US" : language, {maximumFractionDigits: 2});
  return values.map((value, index) => {
    if (change && value === 0) return "";
    const [label, percent] = metrics[index];
    const sign = change && value > 0 ? "+" : "";
    return `${labels[label]} ${sign}${format.format(value)}${percent ? "%" : ""}`;
  }).filter(Boolean).join(" · ") || "—";
}
