/**
 * SEO Guide Pages Data
 *
 * Each guide is a curated landing page targeting specific keywords.
 * To add a new guide:
 * 1. Add a new entry to the `guides` array below
 * 2. The page will be automatically generated at /[locale]/guides/[slug]
 * 3. It will also be auto-added to the sitemap
 */

export interface GuideProduct {
  /** Product slug — must match an existing WooCommerce product slug */
  slug: string;
  /** Rank/position in the list (1-based) */
  rank: number;
  /** Short editorial pick reason */
  pickReason: {
    en: string;
    ar: string;
  };
  /** Detailed description of why this product is recommended */
  description: {
    en: string;
    ar: string;
  };
}

export interface GuideFAQ {
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
}

export interface GuideContentBlock {
  heading: { en: string; ar: string };
  body: { en: string; ar: string };
}

export interface Guide {
  /** URL slug — e.g. "best-perfumes-uae" */
  slug: string;
  /** Page title */
  title: {
    en: string;
    ar: string;
  };
  /** Meta description for SEO (max 160 chars) */
  metaDescription: {
    en: string;
    ar: string;
  };
  /** SEO keywords */
  keywords: {
    en: string[];
    ar: string[];
  };
  /** Hero subtitle / eyebrow text */
  eyebrow: {
    en: string;
    ar: string;
  };
  /** Hero intro paragraph */
  intro: {
    en: string;
    ar: string;
  };
  /** Featured product slugs with editorial content */
  products: GuideProduct[];
  /** Rich content blocks below the product list */
  contentBlocks: GuideContentBlock[];
  /** FAQ section for additional SEO value */
  faqs: GuideFAQ[];
  /** Related guide slugs for internal linking */
  relatedGuideSlugs: string[];
  /** OG image URL (optional — falls back to site default) */
  ogImage?: string;
  /** Published date (ISO string) */
  publishedAt: string;
  /** Last updated date (ISO string) */
  updatedAt: string;
}

export const guides: Guide[] = [
  {
    slug: "best-perfumes-uae",
    title: {
      en: "Best Perfumes in UAE – Top Fragrances for 2025",
      ar: "أفضل العطور في الإمارات – أفضل العطور لعام 2025",
    },
    metaDescription: {
      en: "Discover the best perfumes in UAE for 2025. Our expert picks of top-rated luxury fragrances handcrafted in Dubai — Arabian oud, musk, amber & more. Free delivery across UAE.",
      ar: "اكتشف أفضل العطور في الإمارات لعام 2025. اختيارات خبرائنا من أفضل العطور الفاخرة المصنوعة يدوياً في دبي — عود عربي ومسك وعنبر والمزيد. توصيل مجاني في الإمارات.",
    },
    keywords: {
      en: [
        "best perfume UAE",
        "top perfume Dubai",
        "luxury fragrance UAE",
        "Arabian oud perfume",
        "buy perfume online UAE",
        "best fragrance Dubai",
        "perfume shop UAE",
        "premium perfume UAE 2025",
        "handcrafted perfume Dubai",
        "men perfume UAE",
        "women perfume UAE",
        "oud perfume UAE",
        "musk perfume Dubai",
        "amber perfume UAE",
        "Aromatic Scents Lab",
      ],
      ar: [
        "أفضل عطر الإمارات",
        "أفضل عطور دبي",
        "عطور فاخرة الإمارات",
        "عطر عود عربي",
        "شراء عطور أون لاين الإمارات",
        "أفضل عطور دبي",
        "متجر عطور الإمارات",
        "عطور فاخرة 2025",
        "عطور يدوية دبي",
        "عطور رجالية الإمارات",
        "عطور نسائية الإمارات",
        "عطر عود الإمارات",
        "عطر مسك دبي",
        "عطر عنبر الإمارات",
        "Aromatic Scents Lab",
      ],
    },
    eyebrow: {
      en: "Expert Picks 2025",
      ar: "اختيارات الخبراء 2025",
    },
    intro: {
      en: "The UAE is home to some of the world's finest fragrances, blending rich Arabian heritage with modern perfumery. From opulent oud blends to fresh, contemporary scents, we've curated the ultimate list of the best perfumes you can buy in the UAE. Whether you're looking for a signature scent or the perfect gift, these handcrafted fragrances from Aromatic Scents Lab represent the best of what Dubai's perfume scene has to offer.",
      ar: "تُعدّ الإمارات العربية المتحدة موطناً لبعض أرقى العطور في العالم، حيث تمزج بين التراث العربي الغني وفن صناعة العطور الحديثة. من مزيج العود الفاخر إلى العطور العصرية المنعشة، قمنا بتقديم قائمة بأفضل العطور التي يمكنك شراؤها في الإمارات. سواء كنت تبحث عن عطرك المميز أو الهدية المثالية، فإن هذه العطور المصنوعة يدوياً من Aromatic Scents Lab تمثل أفضل ما يقدمه عالم العطور في دبي.",
    },
    products: [
      {
        slug: "dark-musk-perfume",
        rank: 1,
        pickReason: {
          en: "Best Overall — Signature Dark Musk",
          ar: "الأفضل بشكل عام — عطر المسك الداكن المميز",
        },
        description: {
          en: "Dark Musk is our bestselling fragrance and a true icon of Aromatic Scents Lab. This captivating eau de parfum combines rich, deep musk with subtle woody undertones, creating a sophisticated scent that lasts 10+ hours. Perfect for evening wear, special occasions, or anyone who wants to make a lasting impression. It's the #1 choice for perfume lovers across the UAE.",
          ar: "المسك الداكن هو عطرنا الأكثر مبيعاً ورمز حقيقي لـ Aromatic Scents Lab. يجمع هذا العطر الأخاذ بين المسك الغني والعميق مع لمسات خشبية دقيقة، مما يخلق رائحة راقية تدوم أكثر من 10 ساعات. مثالي للسهرات والمناسبات الخاصة أو لأي شخص يريد ترك انطباع لا يُنسى.",
        },
      },
      {
        slug: "velvet-amber-perfume",
        rank: 2,
        pickReason: {
          en: "Best for Elegance — Velvet Amber",
          ar: "الأفضل للأناقة — عطر فلفت أمبر",
        },
        description: {
          en: "Velvet Amber delivers a warm, enveloping fragrance experience that's become a UAE favorite. With its luxurious blend of amber, vanilla, and soft spices, this perfume is ideal for cooler evenings and formal events. Its silky sillage and impressive longevity make it a go-to for those who appreciate refined, warm fragrances that turn heads.",
          ar: "يقدم فلفت أمبر تجربة عطرية دافئة وجذابة أصبحت من المفضلات في الإمارات. مع مزيجه الفاخر من العنبر والفانيليا والتوابل الناعمة، هذا العطر مثالي للأمسيات الباردة والمناسبات الرسمية. يتميز بانتشاره الحريري وثباته المذهل.",
        },
      },
      {
        slug: "secret-leather-perfume",
        rank: 3,
        pickReason: {
          en: "Best for Men — Secret Leather",
          ar: "الأفضل للرجال — عطر سيكرت ليذر",
        },
        description: {
          en: "Secret Leather is a bold, masculine fragrance that captures the essence of Arabian luxury. The interplay of smooth leather, rich oud, and smoky accords creates a powerful yet sophisticated scent. This is the perfume that confident men in the UAE reach for when they want to stand out. Exceptional projection and 8-12 hour longevity.",
          ar: "سيكرت ليذر هو عطر جريء وذكوري يجسد جوهر الفخامة العربية. يخلق التفاعل بين الجلد الناعم والعود الغني والنفحات الدخانية رائحة قوية وراقية في آن واحد. هذا هو العطر الذي يختاره الرجال الواثقون في الإمارات. يتميز بانتشار استثنائي وثبات يدوم من 8 إلى 12 ساعة.",
        },
      },
      {
        slug: "dark-musk-oil",
        rank: 4,
        pickReason: {
          en: "Best Perfume Oil — Dark Musk Oil",
          ar: "أفضل زيت عطري — زيت المسك الداكن",
        },
        description: {
          en: "For those who prefer concentrated fragrance oils, Dark Musk Oil delivers our signature musk in its purest form. This alcohol-free oil is perfect for the UAE climate — it sits close to the skin for an intimate, personal scent experience that intensifies with body heat. A few dabs on pulse points last all day, making it exceptional value.",
          ar: "لمن يفضلون زيوت العطور المركزة، يقدم زيت المسك الداكن مسكنا المميز في أنقى صوره. هذا الزيت الخالي من الكحول مثالي لمناخ الإمارات — يبقى قريباً من البشرة لتجربة عطرية شخصية تتكثف مع حرارة الجسم. بضع قطرات على نقاط النبض تدوم طوال اليوم.",
        },
      },
      {
        slug: "velvet-amber",
        rank: 5,
        pickReason: {
          en: "Best Fragrance Oil — Velvet Amber Oil",
          ar: "أفضل زيت عطري — زيت فلفت أمبر",
        },
        description: {
          en: "Velvet Amber Oil takes the beloved Velvet Amber fragrance and distills it into a rich, concentrated oil format. The warm amber and vanilla notes become even more nuanced and long-lasting in oil form. Ideal for layering with your favorite perfume or wearing alone for a subtle, luxurious scent that's uniquely suited to the warm UAE climate.",
          ar: "يأخذ زيت فلفت أمبر عطر فلفت أمبر المحبوب ويقدمه في صيغة زيت مركز غنية. تصبح نفحات العنبر الدافئ والفانيليا أكثر تميزاً وثباتاً في صيغة الزيت. مثالي للطبقات مع عطرك المفضل أو لارتدائه بمفرده للحصول على رائحة فاخرة ودقيقة.",
        },
      },
    ],
    contentBlocks: [
      {
        heading: {
          en: "Why Buy Perfume in the UAE?",
          ar: "لماذا تشتري العطور في الإمارات؟",
        },
        body: {
          en: "The UAE has become a global hub for luxury perfumery, combining centuries of Arabian fragrance tradition with cutting-edge modern perfumery. Dubai and Abu Dhabi are home to countless perfume souks, boutiques, and artisan perfumers who create unique blends you won't find anywhere else. The region's love for oud, musk, amber, and rose has shaped a fragrance culture that's both distinctive and globally admired. When you buy from a UAE-based perfume house like Aromatic Scents Lab, you're getting authentic, locally crafted fragrances at their freshest — with free delivery across the Emirates.",
          ar: "أصبحت الإمارات مركزاً عالمياً لصناعة العطور الفاخرة، حيث تجمع بين قرون من تراث العطور العربية وأحدث تقنيات صناعة العطور الحديثة. تضم دبي وأبوظبي عدداً لا يحصى من أسواق العطور والبوتيكات وصانعي العطور الحرفيين الذين يبتكرون مزيجات فريدة لا تجدها في أي مكان آخر. عندما تشتري من بيت عطور إماراتي مثل Aromatic Scents Lab، تحصل على عطور أصلية مصنوعة محلياً في أحدث حالاتها — مع توصيل مجاني في جميع أنحاء الإمارات.",
        },
      },
      {
        heading: {
          en: "How to Choose the Right Perfume",
          ar: "كيف تختار العطر المناسب",
        },
        body: {
          en: "Choosing the perfect perfume depends on several factors: the occasion (day vs. evening), the season (lighter scents for summer, richer for winter), and your personal style. In the UAE, oud-based and amber fragrances are perennial favorites thanks to their richness and longevity in warm weather. For a fresh daytime scent, consider lighter floral or citrus notes. For formal events, deep musk or leather fragrances make a powerful statement. Don't forget to try fragrance oils — they're alcohol-free, perfect for sensitive skin, and offer an incredibly intimate scent experience.",
          ar: "يعتمد اختيار العطر المثالي على عدة عوامل: المناسبة (نهارية أو مسائية)، والموسم (عطور أخف للصيف وأغنى للشتاء)، وأسلوبك الشخصي. في الإمارات، تعتبر العطور القائمة على العود والعنبر من المفضلات الدائمة بفضل غناها وثباتها في الطقس الدافئ. لا تنسَ تجربة زيوت العطور — فهي خالية من الكحول ومثالية للبشرة الحساسة وتقدم تجربة عطرية شخصية مميزة.",
        },
      },
      {
        heading: {
          en: "Perfume Concentration: EDP, EDT & Oils Explained",
          ar: "تركيز العطور: شرح أو دو بارفان وأو دو تواليت والزيوت",
        },
        body: {
          en: "Eau de Parfum (EDP) contains 15-20% fragrance oils, offering 6-8 hours of wear. Perfume oils (also called attars) are the most concentrated at 20-30%, lasting 8-12+ hours with a more intimate sillage. In the UAE's warm climate, perfume oils and EDPs perform exceptionally well — the heat intensifies the fragrance notes and helps them project. All Aromatic Scents Lab perfumes are formulated as EDPs or concentrated oils for maximum longevity.",
          ar: "يحتوي أو دو بارفان (EDP) على 15-20% من زيوت العطور، ويدوم من 6 إلى 8 ساعات. زيوت العطور (المعروفة أيضاً بالعطور) هي الأكثر تركيزاً بنسبة 20-30%، وتدوم أكثر من 8-12 ساعة. في مناخ الإمارات الدافئ، تعمل زيوت العطور وأو دو بارفان بشكل استثنائي. جميع عطور Aromatic Scents Lab مصنوعة كأو دو بارفان أو زيوت مركزة لأقصى ثبات.",
        },
      },
    ],
    faqs: [
      {
        question: {
          en: "What is the best perfume to buy in the UAE?",
          ar: "ما هو أفضل عطر يمكن شراؤه في الإمارات؟",
        },
        answer: {
          en: "Dark Musk by Aromatic Scents Lab is our top recommendation — it's a bestseller that combines rich musk with woody undertones for a long-lasting, sophisticated scent. It's handcrafted in Dubai using premium natural ingredients.",
          ar: "المسك الداكن من Aromatic Scents Lab هو توصيتنا الأولى — إنه الأكثر مبيعاً ويجمع بين المسك الغني واللمسات الخشبية لرائحة راقية وطويلة الأمد. مصنوع يدوياً في دبي باستخدام مكونات طبيعية فاخرة.",
        },
      },
      {
        question: {
          en: "Do you offer free delivery in the UAE?",
          ar: "هل تقدمون توصيل مجاني في الإمارات؟",
        },
        answer: {
          en: "Yes! Aromatic Scents Lab offers free delivery on all orders over 500 AED within the UAE. We also ship internationally to Saudi Arabia, Kuwait, Bahrain, Qatar, and Oman.",
          ar: "نعم! يقدم Aromatic Scents Lab توصيل مجاني لجميع الطلبات التي تزيد عن 500 درهم إماراتي داخل الإمارات. كما نقوم بالشحن دولياً إلى السعودية والكويت والبحرين وقطر وعُمان.",
        },
      },
      {
        question: {
          en: "What's the difference between perfume and perfume oil?",
          ar: "ما الفرق بين العطر وزيت العطر؟",
        },
        answer: {
          en: "Perfume (EDP) is alcohol-based and projects widely, while perfume oil (attar) is alcohol-free, sits closer to the skin, and lasts longer. In the UAE's warm climate, both perform exceptionally well. Oils are a great choice for those with sensitive skin.",
          ar: "العطر (أو دو بارفان) يحتوي على الكحول وينتشر بشكل واسع، بينما زيت العطر (العطر) خالٍ من الكحول ويبقى أقرب للبشرة ويدوم أطول. في مناخ الإمارات الدافئ، كلاهما يعمل بشكل استثنائي. الزيوت خيار رائع لأصحاب البشرة الحساسة.",
        },
      },
      {
        question: {
          en: "How long do Aromatic Scents Lab perfumes last?",
          ar: "كم تدوم عطور Aromatic Scents Lab؟",
        },
        answer: {
          en: "Our Eau de Parfum formulations typically last 8-12 hours on skin, while our concentrated perfume oils can last even longer. The UAE's warm climate helps intensify fragrance notes, providing excellent projection and longevity.",
          ar: "تدوم تركيبات أو دو بارفان لدينا عادةً من 8 إلى 12 ساعة على البشرة، بينما يمكن لزيوت العطور المركزة أن تدوم أطول. يساعد مناخ الإمارات الدافئ على تكثيف نفحات العطر، مما يوفر انتشاراً وثباتاً ممتازين.",
        },
      },
      {
        question: {
          en: "Can I buy perfumes online in the UAE?",
          ar: "هل يمكنني شراء العطور أون لاين في الإمارات؟",
        },
        answer: {
          en: "Absolutely! You can shop our full collection online at aromaticscentslab.com with secure payment options including MyFatoorah, Tabby, Tamara, and Cash on Delivery. We deliver across all Emirates with free shipping on orders over 500 AED.",
          ar: "بالتأكيد! يمكنك التسوق من مجموعتنا الكاملة أون لاين على aromaticscentslab.com مع خيارات دفع آمنة تشمل ماي فاتورة وتابي وتمارا والدفع عند الاستلام. نوصل إلى جميع الإمارات مع شحن مجاني للطلبات فوق 500 درهم.",
        },
      },
    ],
    relatedGuideSlugs: [],
    publishedAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },
];

/**
 * Get a guide by its slug
 */
export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/**
 * Get all guide slugs (for static params generation)
 */
export function getAllGuideSlugs(): string[] {
  return guides.map((g) => g.slug);
}

/**
 * Get related guides for a given guide
 */
export function getRelatedGuides(guide: Guide): Guide[] {
  return guide.relatedGuideSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is Guide => g !== undefined);
}
