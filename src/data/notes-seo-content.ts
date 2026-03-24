// SEO content for fragrance note pages
// Each note has a display name, title, and description in EN and AR

export interface NoteSeoContent {
  name: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
}

export const notesSeoContent: Record<string, NoteSeoContent> = {
  amber: {
    name: { en: "Amber", ar: "عنبر" },
    title: {
      en: "Amber Perfumes — Warm & Resinous Fragrances",
      ar: "عطور العنبر — روائح دافئة وراتنجية",
    },
    description: {
      en: "Explore aromatic perfumes featuring amber — a warm, resinous note prized in Arabian perfumery for its rich depth and long-lasting sillage. Shop amber-based fragrances, oils, and body care from Aromatic Scents Lab with free UAE delivery over 500 AED.",
      ar: "اكتشف عطور أروماتيك بنوتة العنبر — نوتة دافئة وراتنجية تتميز بعمقها الغني وثباتها الطويل في العطور العربية. تسوق عطور وزيوت ومنتجات عناية بالعنبر من أروماتيك سنتس لاب مع توصيل مجاني في الإمارات للطلبات فوق 500 درهم.",
    },
  },
  ambergris: {
    name: { en: "Ambergris", ar: "عنبر رمادي" },
    title: {
      en: "Ambergris Perfumes — Oceanic & Musky Scents",
      ar: "عطور العنبر الرمادي — روائح بحرية ومسكية",
    },
    description: {
      en: "Discover perfumes with ambergris — a rare oceanic note that adds marine warmth and musky depth to luxury fragrances. Shop ambergris-infused scents from Aromatic Scents Lab.",
      ar: "اكتشف عطور العنبر الرمادي — نوتة بحرية نادرة تضيف دفئاً بحرياً وعمقاً مسكياً للعطور الفاخرة. تسوق عطور بالعنبر الرمادي من أروماتيك سنتس لاب.",
    },
  },
  bergamot: {
    name: { en: "Bergamot", ar: "برغموت" },
    title: {
      en: "Bergamot Perfumes — Fresh & Citrusy Fragrances",
      ar: "عطور البرغموت — روائح منعشة وحمضية",
    },
    description: {
      en: "Shop aromatic perfumes with bergamot — a bright, zesty citrus note that opens fragrances with sparkling freshness. Ideal for everyday wear in the UAE climate. Free delivery over 500 AED.",
      ar: "تسوق عطور أروماتيك بنوتة البرغموت — نوتة حمضية مشرقة تفتتح العطور بانتعاش متألق. مثالية للارتداء اليومي في مناخ الإمارات. توصيل مجاني فوق 500 درهم.",
    },
  },
  "black-pepper": {
    name: { en: "Black Pepper", ar: "فلفل أسود" },
    title: {
      en: "Black Pepper Perfumes — Spicy & Bold Fragrances",
      ar: "عطور الفلفل الأسود — روائح حارة وجريئة",
    },
    description: {
      en: "Explore bold perfumes with black pepper — a spicy, invigorating note that adds warmth and edge to modern fragrances. Shop spicy scents from Aromatic Scents Lab.",
      ar: "اكتشف عطور جريئة بنوتة الفلفل الأسود — نوتة حارة ومنعشة تضيف دفئاً وجرأة للعطور العصرية. تسوق روائح حارة من أروماتيك سنتس لاب.",
    },
  },
  cardamom: {
    name: { en: "Cardamom", ar: "هيل" },
    title: {
      en: "Cardamom Perfumes — Aromatic & Spicy Scents",
      ar: "عطور الهيل — روائح عطرية وحارة",
    },
    description: {
      en: "Discover perfumes with cardamom — an aromatic spice note that brings warmth and a touch of the exotic to luxury fragrances. A staple in Arabian perfumery traditions.",
      ar: "اكتشف عطور الهيل — نوتة توابل عطرية تجلب الدفء ولمسة من الغرابة للعطور الفاخرة. عنصر أساسي في تقاليد العطور العربية.",
    },
  },
  cedarwood: {
    name: { en: "Cedarwood", ar: "خشب الأرز" },
    title: {
      en: "Cedarwood Perfumes — Woody & Elegant Fragrances",
      ar: "عطور خشب الأرز — روائح خشبية وأنيقة",
    },
    description: {
      en: "Shop cedarwood perfumes — a refined woody note that provides a dry, elegant backbone to both men's and women's fragrances. Explore our cedarwood collection at Aromatic Scents Lab.",
      ar: "تسوق عطور خشب الأرز — نوتة خشبية راقية توفر قاعدة جافة وأنيقة لعطور الرجال والنساء. اكتشف مجموعة خشب الأرز من أروماتيك سنتس لاب.",
    },
  },
  "clary-sage": {
    name: { en: "Clary Sage", ar: "المريمية" },
    title: {
      en: "Clary Sage Perfumes — Herbal & Relaxing Scents",
      ar: "عطور المريمية — روائح عشبية ومريحة",
    },
    description: {
      en: "Discover clary sage fragrances — a calming herbal note that adds a natural, earthy dimension to perfumes. Shop aromatic herbal scents from Aromatic Scents Lab.",
      ar: "اكتشف عطور المريمية — نوتة عشبية مهدئة تضيف بعداً طبيعياً وترابياً للعطور. تسوق روائح عشبية من أروماتيك سنتس لاب.",
    },
  },
  cypress: {
    name: { en: "Cypress", ar: "سرو" },
    title: {
      en: "Cypress Perfumes — Green & Woody Fragrances",
      ar: "عطور السرو — روائح خضراء وخشبية",
    },
    description: {
      en: "Explore cypress perfumes — a fresh, green-woody note that evokes Mediterranean forests and adds crisp structure to luxury fragrances.",
      ar: "اكتشف عطور السرو — نوتة خضراء خشبية منعشة تستحضر غابات البحر المتوسط وتضيف بنية نقية للعطور الفاخرة.",
    },
  },
  cypriol: {
    name: { en: "Cypriol", ar: "سعد" },
    title: {
      en: "Cypriol Perfumes — Smoky & Earthy Scents",
      ar: "عطور السعد — روائح مدخنة وترابية",
    },
    description: {
      en: "Discover cypriol (nagarmotha) perfumes — a smoky, earthy note used in traditional Arabian and Indian perfumery for its deep, woody character.",
      ar: "اكتشف عطور السعد — نوتة مدخنة وترابية تُستخدم في العطور العربية والهندية التقليدية لطابعها الخشبي العميق.",
    },
  },
  frankincense: {
    name: { en: "Frankincense", ar: "لبان" },
    title: {
      en: "Frankincense Perfumes — Sacred & Resinous Scents",
      ar: "عطور اللبان — روائح مقدسة وراتنجية",
    },
    description: {
      en: "Shop frankincense perfumes — a sacred resinous note deeply rooted in Arabian heritage. Known for its spiritual, calming aroma and exceptional longevity on skin.",
      ar: "تسوق عطور اللبان — نوتة راتنجية مقدسة متجذرة في التراث العربي. معروفة برائحتها الروحانية المهدئة وثباتها الاستثنائي على البشرة.",
    },
  },
  "guaiac-wood": {
    name: { en: "Guaiac Wood", ar: "خشب الغاياك" },
    title: {
      en: "Guaiac Wood Perfumes — Smoky & Creamy Fragrances",
      ar: "عطور خشب الغاياك — روائح مدخنة وكريمية",
    },
    description: {
      en: "Explore guaiac wood perfumes — a smoky, creamy wood note that adds a velvety depth to both niche and luxury fragrance compositions.",
      ar: "اكتشف عطور خشب الغاياك — نوتة خشبية مدخنة وكريمية تضيف عمقاً مخملياً لتركيبات العطور الفاخرة والنيش.",
    },
  },
  jasmine: {
    name: { en: "Jasmine", ar: "ياسمين" },
    title: {
      en: "Jasmine Perfumes — Floral & Romantic Fragrances",
      ar: "عطور الياسمين — روائح زهرية ورومانسية",
    },
    description: {
      en: "Discover jasmine perfumes — a timeless white floral note that brings romantic elegance to every fragrance. Shop jasmine-based scents and oils from Aromatic Scents Lab.",
      ar: "اكتشف عطور الياسمين — نوتة زهرية بيضاء خالدة تجلب الأناقة الرومانسية لكل عطر. تسوق عطور وزيوت الياسمين من أروماتيك سنتس لاب.",
    },
  },
  "juniper-berry": {
    name: { en: "Juniper Berry", ar: "توت العرعر" },
    title: {
      en: "Juniper Berry Perfumes — Fresh & Aromatic Scents",
      ar: "عطور توت العرعر — روائح منعشة وعطرية",
    },
    description: {
      en: "Shop juniper berry perfumes — a crisp, pine-like note that adds freshness and a natural outdoors feel to aromatic fragrances.",
      ar: "تسوق عطور توت العرعر — نوتة منعشة شبيهة بالصنوبر تضيف انتعاشاً وإحساساً بالطبيعة للعطور الأروماتية.",
    },
  },
  leather: {
    name: { en: "Leather", ar: "جلد" },
    title: {
      en: "Leather Perfumes — Bold & Luxurious Fragrances",
      ar: "عطور الجلد — روائح جريئة وفاخرة",
    },
    description: {
      en: "Explore leather perfumes — a bold, sophisticated note that evokes luxury and power. Shop leather-based fragrances and oils from Aromatic Scents Lab with free UAE delivery.",
      ar: "اكتشف عطور الجلد — نوتة جريئة وراقية تستحضر الفخامة والقوة. تسوق عطور وزيوت الجلد من أروماتيك سنتس لاب مع توصيل مجاني في الإمارات.",
    },
  },
  "lily-of-the-valley": {
    name: { en: "Lily of the Valley", ar: "زنبق الوادي" },
    title: {
      en: "Lily of the Valley Perfumes — Delicate & Fresh Scents",
      ar: "عطور زنبق الوادي — روائح رقيقة ومنعشة",
    },
    description: {
      en: "Discover lily of the valley perfumes — a delicate, dewy floral note that adds a clean, spring-like freshness to elegant fragrances.",
      ar: "اكتشف عطور زنبق الوادي — نوتة زهرية رقيقة وندية تضيف انتعاشاً ربيعياً نقياً للعطور الأنيقة.",
    },
  },
  mandarin: {
    name: { en: "Mandarin", ar: "ماندرين" },
    title: {
      en: "Mandarin Perfumes — Bright & Citrus Fragrances",
      ar: "عطور الماندرين — روائح مشرقة وحمضية",
    },
    description: {
      en: "Shop mandarin perfumes — a sweet, sunny citrus note that lifts fragrances with joyful brightness. Perfect for warm UAE days. Free delivery over 500 AED.",
      ar: "تسوق عطور الماندرين — نوتة حمضية حلوة ومشمسة ترفع العطور بإشراقة مبهجة. مثالية لأيام الإمارات الدافئة. توصيل مجاني فوق 500 درهم.",
    },
  },
  musk: {
    name: { en: "Musk", ar: "مسك" },
    title: {
      en: "Musk Perfumes — Sensual & Long-Lasting Scents",
      ar: "عطور المسك — روائح حسية وطويلة الأمد",
    },
    description: {
      en: "Explore musk perfumes — a sensual, skin-like note that enhances every fragrance with warmth and extraordinary longevity. A cornerstone of Arabian perfumery at Aromatic Scents Lab.",
      ar: "اكتشف عطور المسك — نوتة حسية قريبة من البشرة تعزز كل عطر بالدفء والثبات الاستثنائي. حجر الزاوية في العطور العربية من أروماتيك سنتس لاب.",
    },
  },
  "orange-blossom": {
    name: { en: "Orange Blossom", ar: "زهر البرتقال" },
    title: {
      en: "Orange Blossom Perfumes — Sweet & Floral Fragrances",
      ar: "عطور زهر البرتقال — روائح حلوة وزهرية",
    },
    description: {
      en: "Discover orange blossom perfumes — a sweet, honeyed floral note that adds a Mediterranean radiance to luxury scents. Shop our collection at Aromatic Scents Lab.",
      ar: "اكتشف عطور زهر البرتقال — نوتة زهرية حلوة وعسلية تضيف إشراقة متوسطية للعطور الفاخرة. تسوق مجموعتنا من أروماتيك سنتس لاب.",
    },
  },
  orris: {
    name: { en: "Orris", ar: "سوسن" },
    title: {
      en: "Orris Perfumes — Powdery & Elegant Scents",
      ar: "عطور السوسن — روائح بودرية وأنيقة",
    },
    description: {
      en: "Shop orris perfumes — a powdery, violet-like note derived from iris root, prized in haute perfumery for its delicate elegance and earthy depth.",
      ar: "تسوق عطور السوسن — نوتة بودرية شبيهة بالبنفسج مستخلصة من جذر السوسن، مُقدرة في العطور الراقية لأناقتها الرقيقة وعمقها الترابي.",
    },
  },
  patchouli: {
    name: { en: "Patchouli", ar: "باتشولي" },
    title: {
      en: "Patchouli Perfumes — Earthy & Rich Fragrances",
      ar: "عطور الباتشولي — روائح ترابية وغنية",
    },
    description: {
      en: "Explore patchouli perfumes — a rich, earthy note with a sweet, dark depth that anchors complex fragrance compositions. Shop patchouli scents from Aromatic Scents Lab.",
      ar: "اكتشف عطور الباتشولي — نوتة ترابية غنية بعمق حلو وداكن ترسخ تركيبات العطور المعقدة. تسوق عطور الباتشولي من أروماتيك سنتس لاب.",
    },
  },
  praline: {
    name: { en: "Praline", ar: "برالين" },
    title: {
      en: "Praline Perfumes — Sweet & Gourmand Scents",
      ar: "عطور البرالين — روائح حلوة وغورماند",
    },
    description: {
      en: "Discover praline perfumes — a sweet, caramelized nut note that adds a gourmand warmth to indulgent fragrances. Shop sweet scents from Aromatic Scents Lab.",
      ar: "اكتشف عطور البرالين — نوتة مكسرات محمصة حلوة تضيف دفئاً غورماند للعطور الفاخرة. تسوق عطور حلوة من أروماتيك سنتس لاب.",
    },
  },
  saffron: {
    name: { en: "Saffron", ar: "زعفران" },
    title: {
      en: "Saffron Perfumes — Luxurious & Spicy Fragrances",
      ar: "عطور الزعفران — روائح فاخرة وحارة",
    },
    description: {
      en: "Shop saffron perfumes — a luxurious, warm spice note that has been a jewel in Middle Eastern perfumery for centuries. Explore saffron-infused scents at Aromatic Scents Lab.",
      ar: "تسوق عطور الزعفران — نوتة توابل فاخرة ودافئة كانت جوهرة في العطور الشرقية لقرون. اكتشف عطور بالزعفران من أروماتيك سنتس لاب.",
    },
  },
  sandalwood: {
    name: { en: "Sandalwood", ar: "صندل" },
    title: {
      en: "Sandalwood Perfumes — Creamy & Meditative Scents",
      ar: "عطور الصندل — روائح كريمية وتأملية",
    },
    description: {
      en: "Explore sandalwood perfumes — a creamy, warm wood note revered across cultures for its calming, meditative quality. Shop sandalwood fragrances from Aromatic Scents Lab.",
      ar: "اكتشف عطور الصندل — نوتة خشبية كريمية ودافئة تُقدّر عبر الثقافات لجودتها المهدئة والتأملية. تسوق عطور الصندل من أروماتيك سنتس لاب.",
    },
  },
  tobacco: {
    name: { en: "Tobacco", ar: "تبغ" },
    title: {
      en: "Tobacco Perfumes — Rich & Smoky Fragrances",
      ar: "عطور التبغ — روائح غنية ومدخنة",
    },
    description: {
      en: "Discover tobacco perfumes — a rich, smoky note with honeyed sweetness that adds an opulent character to modern and classic fragrances. Free UAE delivery over 500 AED.",
      ar: "اكتشف عطور التبغ — نوتة غنية ومدخنة بحلاوة عسلية تضيف طابعاً فاخراً للعطور العصرية والكلاسيكية. توصيل مجاني في الإمارات فوق 500 درهم.",
    },
  },
  "tonka-bean": {
    name: { en: "Tonka Bean", ar: "حبة التونكا" },
    title: {
      en: "Tonka Bean Perfumes — Sweet & Warm Fragrances",
      ar: "عطور حبة التونكا — روائح حلوة ودافئة",
    },
    description: {
      en: "Shop tonka bean perfumes — a sweet, vanilla-like note with almond and caramel facets that wraps fragrances in cozy warmth. Explore our collection at Aromatic Scents Lab.",
      ar: "تسوق عطور حبة التونكا — نوتة حلوة شبيهة بالفانيلا بأوجه اللوز والكراميل تغلف العطور بدفء مريح. اكتشف مجموعتنا من أروماتيك سنتس لاب.",
    },
  },
  tuberose: {
    name: { en: "Tuberose", ar: "مسك الليل" },
    title: {
      en: "Tuberose Perfumes — Opulent & White Floral Scents",
      ar: "عطور مسك الليل — روائح زهرية بيضاء فاخرة",
    },
    description: {
      en: "Discover tuberose perfumes — an opulent, intoxicating white floral note that commands attention. Shop tuberose-based fragrances from Aromatic Scents Lab.",
      ar: "اكتشف عطور مسك الليل — نوتة زهرية بيضاء فاخرة ومسكرة تستحوذ على الانتباه. تسوق عطور مسك الليل من أروماتيك سنتس لاب.",
    },
  },
  vanilla: {
    name: { en: "Vanilla", ar: "فانيلا" },
    title: {
      en: "Vanilla Perfumes — Sweet & Comforting Fragrances",
      ar: "عطور الفانيلا — روائح حلوة ومريحة",
    },
    description: {
      en: "Shop vanilla perfumes — a universally loved, sweet and warm note that adds comfort and gourmand allure to luxury scents. Explore vanilla fragrances at Aromatic Scents Lab.",
      ar: "تسوق عطور الفانيلا — نوتة حلوة ودافئة محبوبة عالمياً تضيف الراحة وجاذبية غورماند للعطور الفاخرة. اكتشف عطور الفانيلا من أروماتيك سنتس لاب.",
    },
  },
  vetiver: {
    name: { en: "Vetiver", ar: "فيتيفر" },
    title: {
      en: "Vetiver Perfumes — Earthy & Sophisticated Scents",
      ar: "عطور الفيتيفر — روائح ترابية وراقية",
    },
    description: {
      en: "Explore vetiver perfumes — a smoky, earthy root note that brings refined sophistication to both men's and women's fragrances. Shop at Aromatic Scents Lab.",
      ar: "اكتشف عطور الفيتيفر — نوتة جذرية مدخنة وترابية تجلب رقياً مصقولاً لعطور الرجال والنساء. تسوق من أروماتيك سنتس لاب.",
    },
  },
  "ylang-ylang": {
    name: { en: "Ylang-Ylang", ar: "يلانغ يلانغ" },
    title: {
      en: "Ylang-Ylang Perfumes — Exotic & Floral Fragrances",
      ar: "عطور يلانغ يلانغ — روائح غريبة وزهرية",
    },
    description: {
      en: "Discover ylang-ylang perfumes — an exotic, sweet floral note that adds a tropical, sensual character to luxury fragrances. Shop our collection at Aromatic Scents Lab.",
      ar: "اكتشف عطور يلانغ يلانغ — نوتة زهرية حلوة وغريبة تضيف طابعاً استوائياً وحسياً للعطور الفاخرة. تسوق مجموعتنا من أروماتيك سنتس لاب.",
    },
  },
};

// List of all known note slugs for static generation
export const ALL_NOTE_SLUGS = Object.keys(notesSeoContent);
