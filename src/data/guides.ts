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
  // ==========================================================================
  // 1. BEST PERFUMES UAE (existing)
  // ==========================================================================
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
    relatedGuideSlugs: ["top-5-perfumes-for-men", "top-5-perfumes-for-women", "best-perfume-gift-sets"],
    publishedAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 2. TOP 5 PERFUMES FOR MEN
  // ==========================================================================
  {
    slug: "top-5-perfumes-for-men",
    title: {
      en: "Top 5 Perfumes for Men – Best Men's Fragrances 2025",
      ar: "أفضل 5 عطور للرجال – أفضل العطور الرجالية 2025",
    },
    metaDescription: {
      en: "Discover the top 5 perfumes for men in 2025. From powerful oud to sophisticated musk — our curated picks of the best men's fragrances in the UAE.",
      ar: "اكتشف أفضل 5 عطور للرجال لعام 2025. من العود القوي إلى المسك الراقي — اختياراتنا المنتقاة من أفضل العطور الرجالية في الإمارات.",
    },
    keywords: {
      en: ["best perfume for men", "men's cologne UAE", "top men's fragrance", "masculine perfume", "best men's perfume 2025", "oud perfume men", "leather perfume men"],
      ar: ["أفضل عطر رجالي", "عطور رجالية الإمارات", "أفضل عطور الرجال", "عطر ذكوري", "عطور رجالية 2025"],
    },
    eyebrow: {
      en: "Men's Fragrances 2025",
      ar: "عطور رجالية 2025",
    },
    intro: {
      en: "The perfect men's fragrance is bold, sophisticated, and memorable. We've curated the top 5 perfumes for men that dominate the UAE market — from powerful oud blends to refined musk and leather compositions. These fragrances project confidence and leave a lasting impression.",
      ar: "العطر الرجالي المثالي جريء وراقٍ ولا يُنسى. قمنا بتنسيق أفضل 5 عطور للرجال التي تهيمن على سوق الإمارات — من مزيج العود القوي إلى تركيبات المسك والجلد الراقية. هذه العطور تعكس الثقة وتترك انطباعاً دائماً.",
    },
    products: [
      {
        slug: "secret-leather-perfume",
        rank: 1,
        pickReason: { en: "Best for Confidence — Secret Leather", ar: "الأفضل للثقة — سيكرت ليذر" },
        description: {
          en: "Secret Leather is the ultimate masculine fragrance for men who want to command attention. This bold scent combines smooth leather with rich oud and smoky accords, creating a powerful signature that lasts 8-12 hours. Ideal for evening wear, business meetings, and special occasions.",
          ar: "سيكرت ليذر هو العطر الذكوري المثالي للرجال الذين يريدون جذب الانتباه. يجمع هذا العطر الجريء بين الجلد الناعم والعود الغني والنفحات الدخانية.",
        },
      },
      {
        slug: "dark-musk-perfume",
        rank: 2,
        pickReason: { en: "Best Signature Scent — Dark Musk", ar: "أفضل عطر مميز — المسك الداكن" },
        description: {
          en: "Dark Musk is a timeless classic that works for any occasion. Its deep musk base with woody undertones creates a sophisticated, versatile scent. Perfect for daily wear or special events — this is the fragrance men reach for when they want to feel confident and polished.",
          ar: "المسك الداكن هو كلاسيكي خالد يعمل لأي مناسبة. قاعدة المسك العميقة مع اللمسات الخشبية تخلق رائحة راقية ومتعددة الاستخدامات.",
        },
      },
      {
        slug: "royal-tobacco-perfume",
        rank: 3,
        pickReason: { en: "Best for Evening — Royal Tobacco", ar: "الأفضل للمساء — رويال توباكو" },
        description: {
          en: "Royal Tobacco is a warm, spicy fragrance with tobacco leaf, vanilla, and amber notes. This luxurious scent is perfect for cooler evenings and formal events. Its rich, enveloping character makes it ideal for men who appreciate complex, refined fragrances.",
          ar: "رويال توباكو هو عطر دافئ حار مع نفحات ورق التبغ والفانيليا والعنبر. هذا العطر الفاخر مثالي للأمسيات الباردة والمناسبات الرسمية.",
        },
      },
      {
        slug: "dark-wood",
        rank: 4,
        pickReason: { en: "Best Woody Scent — Dark Wood", ar: "أفضل عطر خشبي — دارك وود" },
        description: {
          en: "Dark Wood delivers a bold, earthy fragrance with sandalwood, cedarwood, and vetiver. This masculine scent is perfect for men who prefer natural, grounding fragrances. Excellent projection and 10+ hour longevity make it a reliable daily driver.",
          ar: "دارك وود يقدم عطراً جريئاً وترابياً مع خشب الصندل والأرز والفيتيفر. هذا العطر الذكوري مثالي للرجال الذين يفضلون العطور الطبيعية.",
        },
      },
      {
        slug: "spicy-sandal-perfume",
        rank: 5,
        pickReason: { en: "Best for Versatility — Spicy Sandal", ar: "الأفضل للتنوع — سبايسي ساندال" },
        description: {
          en: "Spicy Sandal blends warm sandalwood with cardamom and pepper notes for a versatile fragrance that works day or night. Its balanced composition makes it perfect for the UAE climate, offering sophistication without being overwhelming.",
          ar: "سبايسي ساندال يمزج خشب الصندل الدافئ مع نفحات الهيل والفلفل لعطر متعدد الاستخدامات يعمل نهاراً أو ليلاً.",
        },
      },
    ],
    contentBlocks: [
      {
        heading: { en: "What Makes a Great Men's Perfume?", ar: "ما الذي يجعل العطر الرجالي رائعاً؟" },
        body: {
          en: "The best men's perfumes balance strength with sophistication. They should project well without being overpowering, last 8+ hours, and complement your natural chemistry. In the UAE, men gravitate toward oud, leather, musk, and woody fragrances that suit the warm climate and cultural preferences.",
          ar: "أفضل العطور الرجالية توازن بين القوة والرقي. يجب أن تنتشر جيداً دون أن تكون طاغية، وتدوم أكثر من 8 ساعات، وتكمل كيمياء جسمك الطبيعية.",
        },
      },
    ],
    faqs: [
      {
        question: { en: "What is the best perfume for men in UAE?", ar: "ما هو أفضل عطر للرجال في الإمارات؟" },
        answer: {
          en: "Secret Leather is our top pick for men in the UAE. Its bold leather and oud composition suits the region's preference for powerful, long-lasting fragrances.",
          ar: "سيكرت ليذر هو اختيارنا الأول للرجال في الإمارات. تركيبته الجريئة من الجلد والعود تناسب تفضيل المنطقة للعطور القوية والطويلة الأمد.",
        },
      },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-leather-perfumes", "long-lasting-perfumes"],
    publishedAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 3. TOP 5 PERFUMES FOR WOMEN
  // ==========================================================================
  {
    slug: "top-5-perfumes-for-women",
    title: {
      en: "Top 5 Perfumes for Women – Best Women's Fragrances 2025",
      ar: "أفضل 5 عطور للنساء – أفضل العطور النسائية 2025",
    },
    metaDescription: {
      en: "Explore the top 5 perfumes for women in 2025. From elegant florals to warm vanilla — our expert picks of the best women's fragrances in the UAE.",
      ar: "اكتشف أفضل 5 عطور للنساء لعام 2025. من الزهور الأنيقة إلى الفانيليا الدافئة — اختيارات خبرائنا من أفضل العطور النسائية في الإمارات.",
    },
    keywords: {
      en: ["best perfume for women", "ladies perfume UAE", "women's fragrance", "feminine perfume", "best women's perfume 2025"],
      ar: ["أفضل عطر نسائي", "عطور نسائية الإمارات", "عطور للنساء", "عطر أنثوي"],
    },
    eyebrow: {
      en: "Women's Fragrances 2025",
      ar: "عطور نسائية 2025",
    },
    intro: {
      en: "The perfect women's fragrance is elegant, memorable, and uniquely yours. We've selected the top 5 perfumes for women that capture femininity, sophistication, and luxury — from warm amber to fresh florals. These are the fragrances that turn heads and leave lasting impressions.",
      ar: "العطر النسائي المثالي أنيق ولا يُنسى ومميز لك. اخترنا أفضل 5 عطور للنساء تجسد الأنوثة والرقي والفخامة — من العنبر الدافئ إلى الزهور المنعشة.",
    },
    products: [
      {
        slug: "velvet-amber-perfume",
        rank: 1,
        pickReason: { en: "Best for Elegance — Velvet Amber", ar: "الأفضل للأناقة — فلفت أمبر" },
        description: {
          en: "Velvet Amber is the epitome of feminine elegance. Its warm blend of amber, vanilla, and soft spices creates a luxurious scent that's perfect for evening wear and special occasions. This fragrance envelops you in sophistication and warmth.",
          ar: "فلفت أمبر هو قمة الأناقة الأنثوية. مزيجه الدافئ من العنبر والفانيليا والتوابل الناعمة يخلق رائحة فاخرة مثالية للسهرات والمناسبات الخاصة.",
        },
      },
      {
        slug: "white-bouquet-perfume",
        rank: 2,
        pickReason: { en: "Best Floral — White Bouquet", ar: "أفضل عطر زهري — وايت بوكيه" },
        description: {
          en: "White Bouquet is a fresh, romantic fragrance featuring white flowers, jasmine, and lily. Perfect for daytime wear, this light yet sophisticated scent is ideal for women who love floral compositions. Its delicate nature makes it suitable for any season.",
          ar: "وايت بوكيه هو عطر منعش ورومانسي يضم الزهور البيضاء والياسمين والزنبق. مثالي للارتداء النهاري، هذا العطر الخفيف والراقي مثالي للنساء.",
        },
      },
      {
        slug: "rich-vanilla-perfume",
        rank: 3,
        pickReason: { en: "Best Gourmand — Rich Vanilla", ar: "الأفضل الحلو — ريتش فانيليا" },
        description: {
          en: "Rich Vanilla is a warm, comforting fragrance with vanilla, caramel, and tonka bean notes. This sweet yet sophisticated scent is perfect for women who love gourmand fragrances. Its creamy character makes it ideal for cooler months.",
          ar: "ريتش فانيليا هو عطر دافئ ومريح مع نفحات الفانيليا والكراميل وحبوب التونكا. هذا العطر الحلو والراقي مثالي للنساء اللواتي يحببن العطور الحلوة.",
        },
      },
      {
        slug: "black-vanilla-perfume",
        rank: 4,
        pickReason: { en: "Best for Evening — Black Vanilla", ar: "الأفضل للمساء — بلاك فانيليا" },
        description: {
          en: "Black Vanilla adds a mysterious twist to classic vanilla with dark amber and patchouli. This seductive fragrance is perfect for evening events and special occasions. Its depth and complexity make it unforgettable.",
          ar: "بلاك فانيليا يضيف لمسة غامضة للفانيليا الكلاسيكية مع العنبر الداكن والباتشولي. هذا العطر المثير مثالي للمناسبات المسائية.",
        },
      },
      {
        slug: "patchouli-glow-perfume",
        rank: 5,
        pickReason: { en: "Best Unique Scent — Patchouli Glow", ar: "أفضل عطر فريد — باتشولي جلو" },
        description: {
          en: "Patchouli Glow is a distinctive fragrance with earthy patchouli, bergamot, and amber. For women who want to stand out, this unique composition offers both freshness and depth. Its bohemian character is perfect for confident, free-spirited individuals.",
          ar: "باتشولي جلو هو عطر مميز مع الباتشولي الترابي والبرغموت والعنبر. للنساء اللواتي يردن التميز، هذا التركيب الفريد يوفر الانتعاش والعمق.",
        },
      },
    ],
    contentBlocks: [
      {
        heading: { en: "Choosing Your Signature Scent", ar: "اختيار عطرك المميز" },
        body: {
          en: "Your signature scent should reflect your personality and complement your style. Consider the occasions you'll wear it for, your personal preferences (floral, sweet, warm, fresh), and the UAE climate. Don't rush — try samples and wear them for a full day before committing.",
          ar: "يجب أن يعكس عطرك المميز شخصيتك ويكمل أسلوبك. ضع في اعتبارك المناسبات التي سترتديه فيها، وتفضيلاتك الشخصية، ومناخ الإمارات.",
        },
      },
    ],
    faqs: [
      {
        question: { en: "What is the best perfume for women?", ar: "ما هو أفضل عطر للنساء؟" },
        answer: {
          en: "Velvet Amber is our top recommendation for women. Its elegant blend of amber and vanilla creates a sophisticated, warm fragrance perfect for any occasion.",
          ar: "فلفت أمبر هو توصيتنا الأولى للنساء. مزيجه الأنيق من العنبر والفانيليا يخلق عطراً راقياً ودافئاً مثالياً لأي مناسبة.",
        },
      },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-vanilla-perfumes", "best-floral-perfumes"],
    publishedAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 4. BEST PERFUME GIFT SETS
  // ==========================================================================
  {
    slug: "best-perfume-gift-sets",
    title: {
      en: "Best Perfume Gift Sets UAE – Luxury Fragrance Gift Boxes 2025",
      ar: "أفضل مجموعات هدايا العطور في الإمارات – صناديق هدايا العطور الفاخرة 2025",
    },
    metaDescription: {
      en: "Shop the best perfume gift sets in UAE. Curated luxury fragrance gift boxes perfect for Ramadan, Eid, birthdays & corporate gifting. Free delivery UAE.",
      ar: "تسوق أفضل مجموعات هدايا العطور في الإمارات. صناديق هدايا عطور فاخرة منسقة مثالية لرمضان والعيد وأعياد الميلاد والهدايا المؤسسية. توصيل مجاني في الإمارات.",
    },
    keywords: {
      en: ["perfume gift set", "fragrance gift box", "luxury gift set UAE", "perfume gift Dubai", "Ramadan gift", "Eid gift", "corporate gift set"],
      ar: ["مجموعة هدايا عطور", "صندوق هدايا عطور", "هدية فاخرة الإمارات", "هدية رمضان", "هدية عيد"],
    },
    eyebrow: {
      en: "Gift Sets 2025",
      ar: "مجموعات الهدايا 2025",
    },
    intro: {
      en: "The perfect gift combines luxury, thoughtfulness, and practicality. Our curated perfume gift sets feature premium fragrances, elegant packaging, and exceptional value. Whether for Ramadan, Eid, birthdays, or corporate gifting, these sets make unforgettable impressions.",
      ar: "الهدية المثالية تجمع بين الفخامة والتفكير والعملية. تتميز مجموعات هدايا العطور المنسقة لدينا بعطور فاخرة وتغليف أنيق وقيمة استثنائية. سواء لرمضان أو العيد أو أعياد الميلاد أو الهدايا المؤسسية، هذه المجموعات تترك انطباعات لا تُنسى.",
    },
    products: [
      {
        slug: "asl-ramadan-box",
        rank: 1,
        pickReason: { en: "Best for Ramadan — ASL Ramadan Gift Set", ar: "الأفضل لرمضان — مجموعة هدايا رمضان ASL" },
        description: {
          en: "The ASL Ramadan Gift Set is specifically curated for the holy month. This luxurious box includes premium perfumes, body care, and home fragrances designed to elevate every moment. Perfect for family, friends, or corporate gifting during Ramadan and Eid. Complete with elegant packaging that reflects the spirit of the season.",
          ar: "مجموعة هدايا رمضان ASL منسقة خصيصاً للشهر الفضيل. يشمل هذا الصندوق الفاخر عطوراً فاخرة ومنتجات العناية بالجسم وعطور المنزل المصممة لتعزيز كل لحظة. مثالية للعائلة والأصدقاء أو الهدايا المؤسسية خلال رمضان والعيد.",
        },
      },
      {
        slug: "the-ultimate-fragrance-collection",
        rank: 2,
        pickReason: { en: "Most Luxurious — Ultimate Fragrance Collection", ar: "الأكثر فخامة — مجموعة العطور المطلقة" },
        description: {
          en: "For the ultimate perfume enthusiast, this collection brings together our finest fragrances in one spectacular gift box. Featuring a curated selection of eau de parfums and fragrance oils, this is the premium gift for someone who appreciates true luxury. Beautifully packaged with premium materials and presentation.",
          ar: "لعشاق العطور المطلقين، تجمع هذه المجموعة أجود عطورنا في صندوق هدايا واحد مذهل. تتضمن مجموعة منتقاة من أو دو بارفان وزيوت العطور، هذه هي الهدية الفاخرة لمن يقدر الفخامة الحقيقية.",
        },
      },
      {
        slug: "the-signature-set",
        rank: 3,
        pickReason: { en: "Best Value — The Signature Set", ar: "أفضل قيمة — المجموعة المميزة" },
        description: {
          en: "The Signature Set offers exceptional value without compromising on quality. This carefully curated collection features our bestselling perfumes in elegant presentation, making it perfect for birthdays, anniversaries, or saying thank you. An accessible luxury gift that always impresses.",
          ar: "المجموعة المميزة تقدم قيمة استثنائية دون المساس بالجودة. تتضمن هذه المجموعة المنسقة بعناية عطورنا الأكثر مبيعاً في عرض أنيق، مما يجعلها مثالية لأعياد الميلاد والذكرى السنوية أو قول شكراً.",
        },
      },
      {
        slug: "build-your-own-set",
        rank: 4,
        pickReason: { en: "Most Personal — Build Your Own Set", ar: "الأكثر شخصية — اصنع مجموعتك الخاصة" },
        description: {
          en: "Create a truly personal gift with our Build Your Own Set option. Choose from our full range of perfumes, oils, and body care to create a custom gift box tailored to the recipient's preferences. Perfect when you know their favorite scents or want to introduce them to a curated selection. Comes with premium gift packaging.",
          ar: "أنشئ هدية شخصية حقيقية مع خيار اصنع مجموعتك الخاصة. اختر من مجموعتنا الكاملة من العطور والزيوت والعناية بالجسم لإنشاء صندوق هدايا مخصص مصمم حسب تفضيلات المستلم.",
        },
      },
      {
        slug: "aromatic-gift-box",
        rank: 5,
        pickReason: { en: "Best Starter Set — Aromatic Gift Box", ar: "أفضل مجموعة بداية — صندوق الهدايا العطري" },
        description: {
          en: "The Aromatic Gift Box is perfect for introducing someone to our fragrance collection. This starter set includes carefully selected products with elegant presentation, plus 1 free fragrance oil. Ideal for first-time perfume buyers or as a thoughtful gesture that won't break the budget.",
          ar: "صندوق الهدايا العطري مثالي لتقديم شخص ما إلى مجموعة العطور لدينا. تتضمن هذه المجموعة المبتدئة منتجات مختارة بعناية مع عرض أنيق، بالإضافة إلى زيت عطري مجاني واحد.",
        },
      },
    ],
    contentBlocks: [
      {
        heading: { en: "Why Gift Perfume Sets?", ar: "لماذا تهدي مجموعات العطور؟" },
        body: {
          en: "Perfume gift sets are the perfect present for any occasion. They combine luxury with practicality, offer variety, and come beautifully packaged. In the UAE and GCC, fragrance gifting is a cherished tradition during Ramadan, Eid, weddings, and corporate events. A thoughtfully curated perfume set shows appreciation and leaves a lasting impression.",
          ar: "مجموعات هدايا العطور هي الهدية المثالية لأي مناسبة. تجمع بين الفخامة والعملية، وتقدم التنوع، وتأتي معبأة بشكل جميل. في الإمارات ودول مجلس التعاون الخليجي، تقديم العطور كهدايا تقليد عزيز خلال رمضان والعيد والأعراس والمناسبات المؤسسية.",
        },
      },
    ],
    faqs: [
      {
        question: { en: "What is the best perfume gift set for Ramadan?", ar: "ما هي أفضل مجموعة هدايا عطور لرمضان؟" },
        answer: {
          en: "The ASL Ramadan Gift Set is specifically curated for Ramadan with premium fragrances, body care, and home scents. It's beautifully packaged and perfect for family, friends, or corporate gifting.",
          ar: "مجموعة هدايا رمضان ASL منسقة خصيصاً لرمضان مع عطور فاخرة ومنتجات العناية بالجسم وعطور المنزل. معبأة بشكل جميل ومثالية للعائلة والأصدقاء أو الهدايا المؤسسية.",
        },
      },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-perfumes-for-ramadan", "best-perfumes-for-eid"],
    publishedAt: "2025-01-25T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 5. LONG-LASTING PERFUMES
  // ==========================================================================
  {
    slug: "long-lasting-perfumes",
    title: {
      en: "Long-Lasting Perfumes That Last All Day — 10+ Hour Fragrances",
      ar: "عطور طويلة الأمد تدوم طوال اليوم — عطور أكثر من 10 ساعات",
    },
    metaDescription: {
      en: "Discover long-lasting perfumes that last 10+ hours. Our expert picks of the best UAE fragrances with exceptional longevity and projection. Shop now.",
      ar: "اكتشف العطور طويلة الأمد التي تدوم أكثر من 10 ساعات. اختيارات خبرائنا من أفضل عطور الإمارات مع ثبات وانتشار استثنائي. تسوق الآن.",
    },
    keywords: {
      en: ["long lasting perfume", "perfume that lasts all day", "10 hour perfume", "strong perfume", "best lasting fragrance UAE"],
      ar: ["عطر طويل الأمد", "عطر يدوم طوال اليوم", "عطر 10 ساعات", "عطر قوي"],
    },
    eyebrow: {
      en: "Maximum Longevity",
      ar: "أقصى ثبات",
    },
    intro: {
      en: "Nothing is more frustrating than a perfume that fades within hours. Our selection of long-lasting fragrances delivers exceptional longevity, projecting beautifully for 10+ hours. These are the perfumes you apply once in the morning and still smell throughout the evening.",
      ar: "لا شيء أكثر إحباطاً من عطر يتلاشى في غضون ساعات. يقدم اختيارنا من العطور طويلة الأمد ثباتاً استثنائياً، وينتشر بشكل جميل لأكثر من 10 ساعات. هذه هي العطور التي تضعها مرة واحدة في الصباح وما زلت تشمها طوال المساء.",
    },
    products: [
      {
        slug: "dark-musk-perfume",
        rank: 1,
        pickReason: { en: "Best Longevity — Dark Musk | Mandarin, Praline, Musk", ar: "أفضل ثبات — المسك الداكن | ماندرين، برالين، مسك" },
        description: {
          en: "Dark Musk is legendary for its longevity. This Oriental Musky fragrance features top notes of Mandarin and Praline, heart notes of Cypriol and Guaiac wood, and a base of Ambergris and Musk. The musk base ensures this perfume lasts 10+ hours with excellent projection. Perfect for those who want one application to last all day.",
          ar: "المسك الداكن أسطوري في ثباته. يتميز هذا العطر الشرقي المسكي بنفحات عليا من الماندرين والبرالين، ونفحات قلبية من السيبريول وخشب الجواياك، وقاعدة من العنبر الأشهب والمسك.",
        },
      },
      {
        slug: "secret-leather-perfume",
        rank: 2,
        pickReason: { en: "Extreme Projection — Secret Leather | Orris, Leather, Musk", ar: "انتشار قوي — سيكرت ليذر | أوريس، جلد، مسك" },
        description: {
          en: "Secret Leather offers both longevity and power. With top notes of Orris, heart notes of Leather and Cypress, and a base of Tonka Bean and Musk, this fragrance projects boldly for 8-12 hours. The leather and musk combination creates a scent that evolves beautifully throughout the day without fading.",
          ar: "سيكرت ليذر يوفر الثبات والقوة معاً. مع نفحات عليا من الأوريس، ونفحات قلبية من الجلد والسرو، وقاعدة من حبوب التونكا والمسك، ينتشر هذا العطر بجرأة لمدة 8-12 ساعة.",
        },
      },
      {
        slug: "royal-tobacco-perfume",
        rank: 3,
        pickReason: { en: "Rich & Lasting — Royal Tobacco | Mandarin, Vanilla, Tobacco", ar: "غني وطويل الأمد — رويال توباكو | ماندرين، فانيليا، تبغ" },
        description: {
          en: "Royal Tobacco combines Mandarin top notes with Incense and Vanilla at the heart, finishing with Vetiver and Tobacco at the base. This complex Oriental Spicy fragrance develops over 10+ hours, revealing different facets as it wears. The tobacco and vetiver base ensures exceptional staying power.",
          ar: "رويال توباكو يجمع نفحات عليا من الماندرين مع البخور والفانيليا في القلب، وينتهي بالفيتيفر والتبغ في القاعدة. يتطور هذا العطر الشرقي الحار المعقد على مدى أكثر من 10 ساعات.",
        },
      },
      {
        slug: "dark-musk-oil",
        rank: 4,
        pickReason: { en: "All-Day Wear — Dark Musk Oil | Concentrated Musk", ar: "ارتداء طوال اليوم — زيت المسك الداكن | مسك مركز" },
        description: {
          en: "For ultimate longevity, Dark Musk Oil delivers 12+ hours of wear. This alcohol-free concentrated oil sits close to the skin and intensifies with body heat. A few dabs on pulse points in the morning last all day and into the evening. Perfect for the UAE climate where alcohol-based perfumes can evaporate quickly.",
          ar: "للحصول على أقصى ثبات، يوفر زيت المسك الداكن أكثر من 12 ساعة من الارتداء. هذا الزيت المركز الخالي من الكحول يبقى قريباً من البشرة ويكتسب كثافة مع حرارة الجسم.",
        },
      },
      {
        slug: "velvet-amber",
        rank: 5,
        pickReason: { en: "Subtle Persistence — Velvet Amber Oil | Amber, Sandalwood", ar: "ثبات دقيق — زيت فلفت أمبر | عنبر، خشب الصندل" },
        description: {
          en: "Velvet Amber Oil offers 10+ hours of wear with a more subtle sillage. Featuring Lily of the Valley at the top, Cedarwood and Dry Amber at the heart, and Sandalwood with Musk at the base, this oil creates an intimate scent bubble that lasts beautifully without being overpowering.",
          ar: "زيت فلفت أمبر يوفر أكثر من 10 ساعات من الارتداء مع انتشار أكثر دقة. يتميز بزنبق الوادي في القمة، وخشب الأرز والعنبر الجاف في القلب، وخشب الصندل مع المسك في القاعدة.",
        },
      },
    ],
    contentBlocks: [
      {
        heading: { en: "What Makes Perfumes Last Longer?", ar: "ما الذي يجعل العطور تدوم أطول؟" },
        body: {
          en: "Longevity depends on fragrance concentration (EDP vs EDT), base notes (musk, amber, woods last longest), and your skin chemistry. Fragrance oils last even longer than EDPs because they're alcohol-free and absorb into the skin. In the UAE's warm climate, both concentrated EDPs and oils perform exceptionally well. Apply to pulse points and moisturized skin for maximum longevity.",
          ar: "يعتمد الثبات على تركيز العطر (أو دو بارفان مقابل أو دو تواليت)، والنفحات الأساسية (المسك والعنبر والأخشاب تدوم أطول)، وكيمياء بشرتك. تدوم زيوت العطور أطول من أو دو بارفان لأنها خالية من الكحول وتمتصها البشرة.",
        },
      },
    ],
    faqs: [
      {
        question: { en: "Which perfume lasts the longest?", ar: "أي عطر يدوم أطول؟" },
        answer: {
          en: "Dark Musk and Dark Musk Oil offer the best longevity, lasting 10-12+ hours. Perfume oils generally last longer than EDPs because they're concentrated and alcohol-free.",
          ar: "المسك الداكن وزيت المسك الداكن يوفران أفضل ثبات، ويدومان من 10 إلى 12+ ساعة. تدوم زيوت العطور بشكل عام أطول من أو دو بارفان لأنها مركزة وخالية من الكحول.",
        },
      },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-musk-perfumes", "best-fragrance-oils"],
    publishedAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 6. BEST MUSK PERFUMES
  // ==========================================================================
  {
    slug: "best-musk-perfumes",
    title: {
      en: "Best Musk Perfumes UAE – Dark Musk, Ambergris & Oriental Musk 2025",
      ar: "أفضل عطور المسك في الإمارات – المسك الداكن والعنبر الأشهب 2025",
    },
    metaDescription: {
      en: "Discover the best musk perfumes in UAE. Featuring Dark Musk (Mandarin, Praline, Ambergris), Velvet Amber (Sandalwood, Musk) and more long-lasting oriental musks.",
      ar: "اكتشف أفضل عطور المسك في الإمارات. المسك الداكن وفلفت أمبر والمزيد من المسك الشرقي طويل الأمد.",
    },
    keywords: {
      en: ["musk perfume UAE", "dark musk perfume", "ambergris perfume", "oriental musk", "best musk fragrance", "musky perfume"],
      ar: ["عطر مسك الإمارات", "عطر المسك الداكن", "عطر عنبر أشهب", "مسك شرقي", "أفضل عطر مسكي"],
    },
    eyebrow: { en: "Musk Fragrances 2025", ar: "عطور المسك 2025" },
    intro: {
      en: "Musk is the backbone of some of the world's most beloved perfumes — warm, sensual, skin-like, and impossibly long-lasting. Our curated selection ranges from powdery white musk to deep oriental musks with ambergris and cypriol.",
      ar: "المسك هو العمود الفقري لبعض أكثر العطور المحبوبة في العالم — دافئ وحسي وطويل الأمد.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Best Dark Musk — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris", ar: "أفضل مسك داكن — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. The definitive musk perfume with irresistible skin-close warmth lasting 10+ hours.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القلب: سيبريول | القاعدة: عنبر أشهب، مسك." } },
      { slug: "dark-musk-oil", rank: 2, pickReason: { en: "Most Concentrated — Dark Musk Oil | Alcohol-Free Pure Musk", ar: "الأكثر تركيزاً — زيت المسك الداكن" }, description: { en: "Dark Musk Oil | Same notes, concentrated oil format | 12+ hour longevity. Perfect for layering or wearing alone.", ar: "زيت المسك الداكن | صيغة زيت مركزة | يدوم أكثر من 12 ساعة." } },
      { slug: "velvet-amber-perfume", rank: 3, pickReason: { en: "Softest Musk — Velvet Amber | Ambry | Lily, Sandalwood, Musk", ar: "أنعم مسك — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Soft, powdery musk perfect for elegant women.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز، عنبر جاف | القاعدة: خشب صندل، مسك." } },
      { slug: "secret-leather-perfume", rank: 4, pickReason: { en: "Musk & Leather — Secret Leather | Oriental | Orris, Tonka Bean, Musk", ar: "مسك وجلد — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Musk amplifies the leather for a complex scent.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "patchouli-glow-perfume", rank: 5, pickReason: { en: "Earthy Musk — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Amber, Musk", ar: "مسك ترابي — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. Distinctive, earthy, deeply sensual.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي | القاعدة: عنبر، مسك." } },
    ],
    contentBlocks: [
      { heading: { en: "Understanding Musk in Perfumery", ar: "فهم المسك في عالم العطور" }, body: { en: "Musk is one of the oldest ingredients in perfumery. Modern synthetic musks create warmth and skin-like quality. In the UAE and GCC, musk fragrances are deeply traditional in Arabic perfumery.", ar: "المسك أحد أقدم مكونات عالم العطور. في الإمارات ودول الخليج، عطور المسك تقليدية عميقة." } },
    ],
    faqs: [
      { question: { en: "What is the best musk perfume in UAE?", ar: "ما هو أفضل عطر مسك في الإمارات؟" }, answer: { en: "Dark Musk is our top pick. Its Oriental Musky composition with Mandarin, Praline, Ambergris, and Musk delivers exceptional longevity and projection.", ar: "المسك الداكن هو اختيارنا الأول. تركيبته الشرقية المسكية تقدم ثباتاً وانتشاراً استثنائيين." } },
    ],
    relatedGuideSlugs: ["long-lasting-perfumes", "best-perfumes-uae", "best-fragrance-oils"],
    publishedAt: "2025-02-05T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 7. BEST LEATHER PERFUMES
  // ==========================================================================
  {
    slug: "best-leather-perfumes",
    title: {
      en: "Best Leather Perfumes UAE – Secret Leather, Orris & Masculine Scents 2025",
      ar: "أفضل عطور الجلد في الإمارات – سيكرت ليذر والروائح الذكورية 2025",
    },
    metaDescription: {
      en: "Explore the best leather perfumes in UAE. From Secret Leather (Orris, Leather, Tonka Bean) to bold masculine leather fragrances. Powerful, sophisticated, long-lasting.",
      ar: "استكشف أفضل عطور الجلد في الإمارات. من سيكرت ليذر إلى عطور الجلد الذكورية الجريئة. قوية ومتطورة وطويلة الأمد.",
    },
    keywords: {
      en: ["leather perfume UAE", "secret leather fragrance", "masculine leather scent", "best leather perfume men", "oud leather"],
      ar: ["عطر جلد الإمارات", "عطر سيكرت ليذر", "رائحة جلد ذكورية", "أفضل عطر جلد للرجال"],
    },
    eyebrow: { en: "Leather Fragrances 2025", ar: "عطور الجلد 2025" },
    intro: {
      en: "Leather fragrances are bold, sophisticated, and unmistakably masculine. From smooth suede to rugged oud-leather blends, these scents project power and confidence.",
      ar: "عطور الجلد جريئة ومتطورة وذكورية بشكل لا لبس فيه. تعكس هذه الروائح القوة والثقة.",
    },
    products: [
      { slug: "secret-leather-perfume", rank: 1, pickReason: { en: "Ultimate Leather — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "الجلد المطلق — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. The definitive leather fragrance with 8-12 hour longevity.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "dark-wood", rank: 2, pickReason: { en: "Woody Leather — Dark Wood | Woody | Bergamot, Cardamom, Cedarwood, Vetiver", ar: "جلد خشبي — دارك وود" }, description: { en: "Dark Wood | Woody | Top: Bergamot | Heart: Caramel, Cardamom | Base: Cedarwood, Vetiver. Rugged character with leather-like qualities.", ar: "دارك وود | خشبي | القمة: برغموت | القلب: كراميل، هيل | القاعدة: خشب أرز، فيتيفر." } },
      { slug: "leather-intense-perfume", rank: 3, pickReason: { en: "Pure Leather — Leather Intense | Leather | Juniper, Sage, Vetiver, Leather", ar: "جلد نقي — ليذر إنتنس" }, description: { en: "Leather Intense | Leather | Top: Juniper Berry | Heart: Clary Sage, Vetiver | Base: Leather. Bold, unapologetic, intensely masculine.", ar: "ليذر إنتنس | جلد | القمة: توت عرعر | القلب: مريمية، فيتيفر | القاعدة: جلد." } },
      { slug: "royal-tobacco-perfume", rank: 4, pickReason: { en: "Smoky Leather — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "جلد دخاني — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. Smoky quality gives leather-adjacent character.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ." } },
      { slug: "dark-musk-perfume", rank: 5, pickReason: { en: "Leather Undertones — Dark Musk | Oriental Musky | Mandarin, Cypriol, Ambergris", ar: "لمسات جلدية — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Cypriol and Guaiac give subtle leather smokiness.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القلب: سيبريول | القاعدة: عنبر أشهب، مسك." } },
    ],
    contentBlocks: [
      { heading: { en: "Leather in Modern Perfumery", ar: "الجلد في العطور الحديثة" }, body: { en: "Leather notes are created synthetically using birch tar and styrax. In Arabic perfumery, leather is often paired with oud, musk, and spices for added complexity.", ar: "يتم إنشاء نفحات الجلد صناعياً باستخدام قطران البتولا. في العطور العربية، يقترن الجلد بالعود والمسك والتوابل." } },
    ],
    faqs: [
      { question: { en: "What does leather perfume smell like?", ar: "كيف تبدو رائحة عطر الجلد؟" }, answer: { en: "Leather perfumes smell smoky, slightly animalic, and sophisticated — reminiscent of a luxury leather jacket. Modern leather fragrances often blend leather with oud or musk.", ar: "عطور الجلد تشم دخانية ومتطورة — تذكرك بسترة جلدية فاخرة." } },
    ],
    relatedGuideSlugs: ["best-musk-perfumes", "top-5-perfumes-for-men", "long-lasting-perfumes"],
    publishedAt: "2025-02-10T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 8. BEST AMBER PERFUMES
  // ==========================================================================
  {
    slug: "best-amber-perfumes",
    title: {
      en: "Best Amber Perfumes UAE – Velvet Amber, Dry Amber & Warm Fragrances 2025",
      ar: "أفضل عطور العنبر في الإمارات – فلفت أمبر والعطور الدافئة 2025",
    },
    metaDescription: {
      en: "Shop the best amber perfumes in UAE. Featuring Velvet Amber (Lily, Cedarwood, Sandalwood), Rich Vanilla (Amber, Tonka) and warm oriental amber fragrances.",
      ar: "تسوق أفضل عطور العنبر في الإمارات. فلفت أمبر وريتش فانيليا وعطور العنبر الشرقية الدافئة.",
    },
    keywords: {
      en: ["amber perfume UAE", "velvet amber perfume", "warm amber fragrance", "oriental amber", "best amber scent Dubai"],
      ar: ["عطر عنبر الإمارات", "عطر فلفت أمبر", "عطر عنبر دافئ", "عنبر شرقي"],
    },
    eyebrow: { en: "Amber Fragrances 2025", ar: "عطور العنبر 2025" },
    intro: {
      en: "Amber perfumes are warm, enveloping, and luxurious — the quintessence of Arabian perfumery. From soft powdery ambers to deep resinous blends, these fragrances create an aura of sophistication and warmth.",
      ar: "عطور العنبر دافئة وفاخرة — جوهر صناعة العطور العربية. من العنبر الناعم إلى المزيج الراتنجي العميق.",
    },
    products: [
      { slug: "velvet-amber-perfume", rank: 1, pickReason: { en: "Best Overall — Velvet Amber | Ambry | Top: Lily of the Valley | Base: Sandalwood, Musk", ar: "الأفضل — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Elegant, powdery amber with exceptional 10+ hour longevity.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز، عنبر جاف | القاعدة: خشب صندل، مسك." } },
      { slug: "velvet-amber", rank: 2, pickReason: { en: "Concentrated Amber — Velvet Amber Oil | Alcohol-Free | Intimate Warmth", ar: "عنبر مركز — زيت فلفت أمبر" }, description: { en: "Velvet Amber Oil | Concentrated oil format of the beloved Velvet Amber. Alcohol-free, warm amber becomes even more nuanced in oil form. 12+ hours.", ar: "زيت فلفت أمبر | صيغة زيت مركزة من فلفت أمبر المحبوب. خالي من الكحول ويدوم 12+ ساعة." } },
      { slug: "rich-vanilla-perfume", rank: 3, pickReason: { en: "Amber & Vanilla — Rich Vanilla | Oriental | Bergamot, Amber, Tonka Bean, Vanilla", ar: "عنبر وفانيليا — ريتش فانيليا" }, description: { en: "Rich Vanilla | Oriental | Top: Bergamot, Heliotrope | Heart: Tonka Bean, Amber | Base: Vanilla, Benzoin. Gourmand amber with a creamy vanilla embrace.", ar: "ريتش فانيليا | شرقي | القمة: برغموت | القلب: تونكا، عنبر | القاعدة: فانيليا، بنزوين." } },
      { slug: "patchouli-glow-perfume", rank: 4, pickReason: { en: "Earthy Amber — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Amber", ar: "عنبر ترابي — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. A distinctive take on amber — earthy, deep, and sensual.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي | القاعدة: عنبر، مسك." } },
      { slug: "dark-musk-perfume", rank: 5, pickReason: { en: "Amber Base — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris", ar: "قاعدة عنبرية — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Ambergris provides a rich amber undertone.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك." } },
    ],
    contentBlocks: [
      { heading: { en: "Why Amber Perfumes Are UAE Favourites", ar: "لماذا عطور العنبر مفضلة في الإمارات" }, body: { en: "Amber is deeply rooted in Arabian perfumery tradition. Its warm, resinous character complements the region's preference for rich, opulent scents. In the UAE climate, amber perfumes bloom beautifully and project with impressive sillage.", ar: "العنبر متجذر بعمق في تقاليد العطور العربية. طابعه الدافئ والراتنجي يكمل تفضيل المنطقة للروائح الغنية والفاخرة." } },
    ],
    faqs: [
      { question: { en: "What does amber perfume smell like?", ar: "كيف تبدو رائحة عطر العنبر؟" }, answer: { en: "Amber perfumes smell warm, sweet, and resinous — often with notes of vanilla, labdanum, and benzoin. They create a cozy, enveloping aura.", ar: "عطور العنبر تشم دافئة وحلوة وراتنجية — غالباً مع نفحات الفانيليا واللبدانم والبنزوين." } },
    ],
    relatedGuideSlugs: ["best-musk-perfumes", "best-perfumes-for-winter", "long-lasting-perfumes"],
    publishedAt: "2025-02-10T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 9. BEST TOBACCO PERFUMES
  // ==========================================================================
  {
    slug: "best-tobacco-perfumes",
    title: {
      en: "Best Tobacco Perfumes UAE – Royal Tobacco, Incense & Smoky Fragrances 2025",
      ar: "أفضل عطور التبغ في الإمارات – رويال توباكو والعطور الدخانية 2025",
    },
    metaDescription: {
      en: "Discover the best tobacco perfumes in UAE. Featuring Royal Tobacco (Mandarin, Incense, Vanilla, Tobacco) and smoky oriental spicy fragrances for men.",
      ar: "اكتشف أفضل عطور التبغ في الإمارات. رويال توباكو والعطور الدخانية الشرقية الحارة للرجال.",
    },
    keywords: {
      en: ["tobacco perfume UAE", "royal tobacco perfume", "smoky fragrance", "incense perfume", "best tobacco scent"],
      ar: ["عطر تبغ الإمارات", "عطر رويال توباكو", "عطر دخاني", "عطر بخور"],
    },
    eyebrow: { en: "Tobacco Fragrances 2025", ar: "عطور التبغ 2025" },
    intro: {
      en: "Tobacco fragrances evoke richness, warmth, and an old-world sophistication. Blended with incense, vanilla, and spices, these are the perfumes of choice for confident, distinguished men.",
      ar: "عطور التبغ تستحضر الثراء والدفء والأناقة الكلاسيكية. ممزوجة بالبخور والفانيليا والتوابل.",
    },
    products: [
      { slug: "royal-tobacco-perfume", rank: 1, pickReason: { en: "Best Tobacco — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "أفضل تبغ — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. Rich, smoky, and sophisticated — a true gentleman's fragrance.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ." } },
      { slug: "secret-leather-perfume", rank: 2, pickReason: { en: "Smoky Alternative — Secret Leather | Oriental | Orris, Cypress, Tonka, Musk", ar: "بديل دخاني — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Shares the smoky depth of tobacco but through leather.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "dark-musk-perfume", rank: 3, pickReason: { en: "Smoky Musk — Dark Musk | Oriental Musky | Mandarin, Cypriol, Ambergris", ar: "مسك دخاني — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Guaiac wood adds a tobacco-like smokiness.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القلب: سيبريول، خشب جواياك | القاعدة: عنبر أشهب، مسك." } },
      { slug: "dark-wood", rank: 4, pickReason: { en: "Woody Tobacco — Dark Wood | Woody | Bergamot, Cardamom, Cedarwood, Vetiver", ar: "تبغ خشبي — دارك وود" }, description: { en: "Dark Wood | Woody | Top: Bergamot | Heart: Caramel, Cardamom | Base: Cedarwood, Vetiver. Vetiver and caramel create tobacco-adjacent warmth.", ar: "دارك وود | خشبي | القمة: برغموت | القلب: كراميل، هيل | القاعدة: خشب أرز، فيتيفر." } },
      { slug: "patchouli-glow-perfume", rank: 5, pickReason: { en: "Earthy Tobacco — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Amber", ar: "تبغ ترابي — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. Patchouli delivers earthy, tobacco-like depth.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي | القاعدة: عنبر، مسك." } },
    ],
    contentBlocks: [
      { heading: { en: "Tobacco Notes in Arabic Perfumery", ar: "نفحات التبغ في العطور العربية" }, body: { en: "Tobacco is increasingly popular in Arabic perfumery. Its warm, slightly sweet, smoky character blends perfectly with traditional oud, incense, and spice notes that define Arabian fragrances.", ar: "التبغ يحظى بشعبية متزايدة في العطور العربية. طابعه الدافئ والدخاني يمتزج بشكل مثالي مع العود والبخور والتوابل." } },
    ],
    faqs: [
      { question: { en: "Is Royal Tobacco perfume good for everyday wear?", ar: "هل عطر رويال توباكو مناسب للارتداء اليومي؟" }, answer: { en: "Royal Tobacco works best for evening and cooler weather. For daytime, consider layering with a lighter scent or applying minimally to pulse points.", ar: "رويال توباكو يعمل بشكل أفضل للمساء والطقس البارد. للنهار، فكر في وضعه بشكل خفيف على نقاط النبض." } },
    ],
    relatedGuideSlugs: ["best-leather-perfumes", "top-5-perfumes-for-men", "best-perfumes-for-winter"],
    publishedAt: "2025-02-12T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 10. BEST FLORAL PERFUMES
  // ==========================================================================
  {
    slug: "best-floral-perfumes",
    title: {
      en: "Best Floral Perfumes UAE – White Bouquet, Rose & Feminine Fragrances 2025",
      ar: "أفضل العطور الزهرية في الإمارات – وايت بوكيه وعطور الورد 2025",
    },
    metaDescription: {
      en: "Explore the best floral perfumes in UAE. Featuring White Bouquet (Jasmine, Rose, Peony), and elegant feminine floral fragrances. Fresh, romantic, long-lasting.",
      ar: "استكشف أفضل العطور الزهرية في الإمارات. وايت بوكيه والعطور الزهرية الأنثوية الأنيقة.",
    },
    keywords: {
      en: ["floral perfume UAE", "rose perfume", "jasmine fragrance", "white bouquet perfume", "feminine floral scent"],
      ar: ["عطر زهري الإمارات", "عطر ورد", "عطر ياسمين", "عطر وايت بوكيه"],
    },
    eyebrow: { en: "Floral Fragrances 2025", ar: "عطور زهرية 2025" },
    intro: {
      en: "Floral perfumes are timeless and universally beloved. From fresh white florals to rich rose compositions, these fragrances capture the beauty of nature's finest blooms in a bottle.",
      ar: "العطور الزهرية خالدة ومحبوبة عالمياً. من الزهور البيضاء المنعشة إلى تركيبات الورد الغنية.",
    },
    products: [
      { slug: "white-bouquet-perfume", rank: 1, pickReason: { en: "Best Floral — White Bouquet | White Floral | Jasmine, Rose, Peony, White Musk", ar: "أفضل زهري — وايت بوكيه" }, description: { en: "White Bouquet | White Floral | Top: Bergamot, Pink Pepper | Heart: Jasmine, Rose, Peony | Base: White Musk, Cedarwood. Fresh, romantic, and elegant.", ar: "وايت بوكيه | زهري أبيض | القمة: برغموت، فلفل وردي | القلب: ياسمين، ورد، فاوانيا | القاعدة: مسك أبيض، خشب أرز." } },
      { slug: "velvet-amber-perfume", rank: 2, pickReason: { en: "Floral Amber — Velvet Amber | Ambry | Lily of the Valley, Cedarwood, Sandalwood", ar: "عنبر زهري — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Floral opening with warm amber heart.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز، عنبر جاف | القاعدة: خشب صندل، مسك." } },
      { slug: "rich-vanilla-perfume", rank: 3, pickReason: { en: "Floral Sweet — Rich Vanilla | Oriental | Bergamot, Heliotrope, Tonka, Vanilla", ar: "زهري حلو — ريتش فانيليا" }, description: { en: "Rich Vanilla | Oriental | Top: Bergamot, Heliotrope | Heart: Tonka Bean, Amber | Base: Vanilla, Benzoin. Heliotrope gives it a powdery floral quality.", ar: "ريتش فانيليا | شرقي | القمة: برغموت، هليوتروب | القلب: تونكا، عنبر | القاعدة: فانيليا، بنزوين." } },
      { slug: "patchouli-glow-perfume", rank: 4, pickReason: { en: "Earthy Floral — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Sandalwood", ar: "زهري ترابي — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. Bergamot lifts patchouli into a bright floral-green space.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي | القاعدة: عنبر، مسك." } },
      { slug: "black-vanilla-perfume", rank: 5, pickReason: { en: "Dark Floral — Black Vanilla | Gourmand | Rose, Vanilla, Patchouli", ar: "زهري داكن — بلاك فانيليا" }, description: { en: "Black Vanilla | Gourmand | Top: Bergamot, Cinnamon | Heart: Rose, Tonka | Base: Vanilla, Patchouli. Dark florals meet rich gourmand notes.", ar: "بلاك فانيليا | حلو | القمة: برغموت، قرفة | القلب: ورد، تونكا | القاعدة: فانيليا، باتشولي." } },
    ],
    contentBlocks: [
      { heading: { en: "Floral Perfumes for UAE Climate", ar: "العطور الزهرية لمناخ الإمارات" }, body: { en: "In the UAE's warm climate, floral perfumes perform beautifully during cooler months and air-conditioned environments. For outdoor wear in summer, lighter white florals like White Bouquet are ideal.", ar: "في مناخ الإمارات الدافئ، تؤدي العطور الزهرية بشكل جميل في الأشهر الباردة والبيئات المكيفة." } },
    ],
    faqs: [
      { question: { en: "What is the best floral perfume for women?", ar: "ما هو أفضل عطر زهري للنساء؟" }, answer: { en: "White Bouquet is our top recommendation. Its blend of Jasmine, Rose, and Peony creates a universally flattering floral that works for any occasion.", ar: "وايت بوكيه هو توصيتنا الأولى. مزيجه من الياسمين والورد والفاوانيا يخلق عطراً زهرياً مناسباً لأي مناسبة." } },
    ],
    relatedGuideSlugs: ["top-5-perfumes-for-women", "best-perfumes-for-summer", "best-perfumes-uae"],
    publishedAt: "2025-02-15T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 11. BEST WOODY PERFUMES
  // ==========================================================================
  {
    slug: "best-woody-perfumes",
    title: {
      en: "Best Woody Perfumes UAE – Dark Wood, Cedarwood & Sandalwood Fragrances 2025",
      ar: "أفضل العطور الخشبية في الإمارات – دارك وود وخشب الأرز وخشب الصندل 2025",
    },
    metaDescription: {
      en: "Shop the best woody perfumes in UAE. Featuring Dark Wood (Bergamot, Cardamom, Cedarwood, Vetiver), sandalwood fragrances and masculine woody scents.",
      ar: "تسوق أفضل العطور الخشبية في الإمارات. دارك وود وعطور خشب الصندل والروائح الخشبية الذكورية.",
    },
    keywords: {
      en: ["woody perfume UAE", "cedarwood fragrance", "sandalwood perfume", "dark wood perfume", "best woody scent men"],
      ar: ["عطر خشبي الإمارات", "عطر خشب أرز", "عطر خشب صندل", "عطر دارك وود"],
    },
    eyebrow: { en: "Woody Fragrances 2025", ar: "عطور خشبية 2025" },
    intro: {
      en: "Woody fragrances embody strength and grounded sophistication. From dry cedarwood to creamy sandalwood, these scents are perfect for men who value understated elegance.",
      ar: "العطور الخشبية تجسد القوة والأناقة الراسخة. من خشب الأرز الجاف إلى خشب الصندل الكريمي.",
    },
    products: [
      { slug: "dark-wood", rank: 1, pickReason: { en: "Best Woody — Dark Wood | Woody | Bergamot, Caramel, Cardamom, Cedarwood, Vetiver", ar: "أفضل خشبي — دارك وود" }, description: { en: "Dark Wood | Woody | Top: Bergamot | Heart: Caramel, Cardamom | Base: Cedarwood, Vetiver. The definitive woody fragrance — warm, earthy, endlessly versatile.", ar: "دارك وود | خشبي | القمة: برغموت | القلب: كراميل، هيل | القاعدة: خشب أرز، فيتيفر." } },
      { slug: "patchouli-glow-perfume", rank: 2, pickReason: { en: "Earthy Wood — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Sandalwood, Amber", ar: "خشب ترابي — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. Sandalwood and patchouli create rich woody depth.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي، خشب صندل | القاعدة: عنبر، مسك." } },
      { slug: "velvet-amber-perfume", rank: 3, pickReason: { en: "Woody Amber — Velvet Amber | Ambry | Cedarwood, Dry Amber, Sandalwood", ar: "عنبر خشبي — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Cedarwood and sandalwood form a luxurious woody base.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز، عنبر جاف | القاعدة: خشب صندل، مسك." } },
      { slug: "secret-leather-perfume", rank: 4, pickReason: { en: "Woody Leather — Secret Leather | Oriental | Orris, Cypress, Tonka Bean", ar: "جلد خشبي — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Cypress provides an aromatic woody dimension.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "dark-musk-perfume", rank: 5, pickReason: { en: "Woody Musk — Dark Musk | Oriental Musky | Cypriol, Guaiac Wood, Ambergris", ar: "مسك خشبي — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Guaiac wood and cypriol lend rich woody character.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القلب: سيبريول، خشب جواياك | القاعدة: عنبر أشهب، مسك." } },
    ],
    contentBlocks: [
      { heading: { en: "Wood Notes in Arabic Perfumery", ar: "النفحات الخشبية في العطور العربية" }, body: { en: "Woody notes like sandalwood, cedarwood, and oud are foundational to Arabian perfumery. In the UAE, woody fragrances are worn year-round, with heavier woods preferred in winter and lighter woods in summer.", ar: "النفحات الخشبية مثل خشب الصندل والأرز والعود أساسية في العطور العربية." } },
    ],
    faqs: [
      { question: { en: "What is the best woody perfume for men?", ar: "ما هو أفضل عطر خشبي للرجال؟" }, answer: { en: "Dark Wood is our top woody pick. Its Cedarwood and Vetiver base with Bergamot and Cardamom creates a sophisticated, versatile woody fragrance.", ar: "دارك وود هو اختيارنا الأفضل. قاعدته من خشب الأرز والفيتيفر تخلق عطراً خشبياً متطوراً ومتعدد الاستعمالات." } },
    ],
    relatedGuideSlugs: ["best-leather-perfumes", "top-5-perfumes-for-men", "best-perfumes-uae"],
    publishedAt: "2025-02-15T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 12. BEST UNISEX PERFUMES
  // ==========================================================================
  {
    slug: "best-unisex-perfumes",
    title: {
      en: "Best Unisex Perfumes UAE – Gender-Neutral Fragrances for Men & Women 2025",
      ar: "أفضل العطور للجنسين في الإمارات – عطور للرجال والنساء 2025",
    },
    metaDescription: {
      en: "Discover the best unisex perfumes in UAE. Gender-neutral fragrances including Patchouli Glow, Dark Musk, and Velvet Amber — perfect for anyone who loves great scent.",
      ar: "اكتشف أفضل العطور للجنسين في الإمارات. عطور محايدة بما فيها باتشولي جلو والمسك الداكن وفلفت أمبر.",
    },
    keywords: {
      en: ["unisex perfume UAE", "gender neutral fragrance", "perfume for him and her", "shared perfume", "best unisex scent"],
      ar: ["عطر للجنسين الإمارات", "عطر محايد", "عطر للرجال والنساء"],
    },
    eyebrow: { en: "Unisex Fragrances 2025", ar: "عطور للجنسين 2025" },
    intro: {
      en: "The best fragrances transcend gender. These unisex perfumes are designed for anyone who appreciates quality ingredients, balanced compositions, and long-lasting wear.",
      ar: "أفضل العطور تتجاوز حدود الجنس. هذه العطور مصممة لكل من يقدر المكونات عالية الجودة والتركيبات المتوازنة.",
    },
    products: [
      { slug: "patchouli-glow-perfume", rank: 1, pickReason: { en: "Most Versatile — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Sandalwood, Amber", ar: "الأكثر تنوعاً — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. Earthy and warm, equally stunning on any wearer.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي | القاعدة: عنبر، مسك." } },
      { slug: "dark-musk-perfume", rank: 2, pickReason: { en: "Signature Unisex — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "مميز للجنسين — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Skin-hugging warmth that suits everyone.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك." } },
      { slug: "velvet-amber-perfume", rank: 3, pickReason: { en: "Elegant Unisex — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "أنيق للجنسين — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Sophisticated amber appeals across genders.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القاعدة: خشب صندل، مسك." } },
      { slug: "rich-vanilla-perfume", rank: 4, pickReason: { en: "Sweet Unisex — Rich Vanilla | Oriental | Bergamot, Tonka, Amber, Vanilla", ar: "حلو للجنسين — ريتش فانيليا" }, description: { en: "Rich Vanilla | Oriental | Top: Bergamot, Heliotrope | Heart: Tonka Bean, Amber | Base: Vanilla, Benzoin. Creamy vanilla appeals universally.", ar: "ريتش فانيليا | شرقي | القمة: برغموت | القلب: تونكا، عنبر | القاعدة: فانيليا، بنزوين." } },
      { slug: "white-bouquet-perfume", rank: 5, pickReason: { en: "Fresh Unisex — White Bouquet | White Floral | Jasmine, Rose, Peony, White Musk", ar: "منعش للجنسين — وايت بوكيه" }, description: { en: "White Bouquet | White Floral | Top: Bergamot, Pink Pepper | Heart: Jasmine, Rose, Peony | Base: White Musk, Cedarwood. Modern white florals work for all.", ar: "وايت بوكيه | زهري أبيض | القمة: برغموت | القلب: ياسمين، ورد | القاعدة: مسك أبيض، خشب أرز." } },
    ],
    contentBlocks: [
      { heading: { en: "Why Unisex Perfumes Are Trending", ar: "لماذا العطور للجنسين رائجة" }, body: { en: "Modern perfumery is moving beyond traditional gender norms. The best unisex perfumes focus on quality ingredients and balanced compositions rather than conforming to masculine or feminine stereotypes.", ar: "صناعة العطور الحديثة تتجاوز القواعد التقليدية. أفضل العطور للجنسين تركز على جودة المكونات والتركيبات المتوازنة." } },
    ],
    faqs: [
      { question: { en: "Can men wear floral perfumes?", ar: "هل يمكن للرجال ارتداء العطور الزهرية؟" }, answer: { en: "Absolutely! Many of the world's finest men's fragrances contain floral notes. Patchouli Glow and Dark Musk both have subtle floral elements that work beautifully on men.", ar: "بالتأكيد! العديد من أرقى عطور الرجال في العالم تحتوي على نفحات زهرية." } },
    ],
    relatedGuideSlugs: ["top-5-perfumes-for-men", "top-5-perfumes-for-women", "best-musk-perfumes"],
    publishedAt: "2025-02-18T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 13. BEST PERFUMES DUBAI
  // ==========================================================================
  {
    slug: "best-perfumes-dubai",
    title: {
      en: "Best Perfumes in Dubai – Top Dubai Fragrances & Arabian Scents 2025",
      ar: "أفضل العطور في دبي – أفضل العطور العربية ودبي 2025",
    },
    metaDescription: {
      en: "Discover the best perfumes in Dubai 2025. Featuring Dark Musk, Velvet Amber, Secret Leather and more handcrafted Arabian fragrances. Free delivery Dubai.",
      ar: "اكتشف أفضل العطور في دبي 2025. المسك الداكن وفلفت أمبر وسيكرت ليذر والمزيد. توصيل مجاني في دبي.",
    },
    keywords: {
      en: ["best perfume Dubai", "perfume shop Dubai", "buy perfume Dubai", "Dubai fragrance", "Arabian perfume Dubai"],
      ar: ["أفضل عطر دبي", "متجر عطور دبي", "شراء عطور دبي", "عطور عربية دبي"],
    },
    eyebrow: { en: "Dubai Perfumes 2025", ar: "عطور دبي 2025" },
    intro: {
      en: "Dubai is the perfume capital of the Middle East. From traditional souks to modern boutiques, the city's fragrance scene is unrivaled. These are the best perfumes you can buy in Dubai right now.",
      ar: "دبي هي عاصمة العطور في الشرق الأوسط. من الأسواق التقليدية إلى البوتيكات الحديثة، مشهد العطور في المدينة لا مثيل له.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Dubai's #1 — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "الأول في دبي — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Dubai's bestselling luxury fragrance.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القلب: سيبريول | القاعدة: عنبر أشهب، مسك." } },
      { slug: "velvet-amber-perfume", rank: 2, pickReason: { en: "Most Elegant — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "الأكثر أناقة — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. A warm, sophisticated amber fragrance.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز، عنبر جاف | القاعدة: خشب صندل، مسك." } },
      { slug: "secret-leather-perfume", rank: 3, pickReason: { en: "Best for Men — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka", ar: "أفضل للرجال — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Bold and masculine, a Dubai favourite.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "royal-tobacco-perfume", rank: 4, pickReason: { en: "Most Luxurious — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "الأفخم — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. Dubai's premier luxury tobacco scent.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ." } },
      { slug: "white-bouquet-perfume", rank: 5, pickReason: { en: "Best Fresh — White Bouquet | White Floral | Jasmine, Rose, Peony, White Musk", ar: "أفضل منعش — وايت بوكيه" }, description: { en: "White Bouquet | White Floral | Top: Bergamot, Pink Pepper | Heart: Jasmine, Rose, Peony | Base: White Musk, Cedarwood. Perfect for Dubai's daytime outings.", ar: "وايت بوكيه | زهري أبيض | القمة: برغموت | القلب: ياسمين، ورد | القاعدة: مسك أبيض، خشب أرز." } },
    ],
    contentBlocks: [
      { heading: { en: "Dubai's Perfume Scene", ar: "مشهد العطور في دبي" }, body: { en: "Dubai is home to the world's largest perfume souks and luxury boutiques. The city's multicultural population creates demand for both traditional Arabian scents and modern international fragrances.", ar: "دبي هي موطن أكبر أسواق العطور في العالم والبوتيكات الفاخرة." } },
    ],
    faqs: [
      { question: { en: "Where can I buy perfume in Dubai?", ar: "أين يمكنني شراء عطور في دبي؟" }, answer: { en: "Shop Aromatic Scents Lab online at aromaticscentslab.com for free delivery in Dubai. You can also visit traditional perfume souks in Deira and luxury malls like Dubai Mall.", ar: "تسوق من Aromatic Scents Lab أونلاين مع توصيل مجاني في دبي." } },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-perfumes-abu-dhabi", "best-arabian-oud-perfumes"],
    publishedAt: "2025-01-25T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 14. BEST PERFUMES ABU DHABI
  // ==========================================================================
  {
    slug: "best-perfumes-abu-dhabi",
    title: {
      en: "Best Perfumes in Abu Dhabi – Top Fragrances & Luxury Scents 2025",
      ar: "أفضل العطور في أبوظبي – أفضل العطور الفاخرة 2025",
    },
    metaDescription: {
      en: "Shop the best perfumes in Abu Dhabi 2025. Featuring Dark Musk, Velvet Amber, Secret Leather — handcrafted luxury fragrances. Free delivery Abu Dhabi.",
      ar: "تسوق أفضل العطور في أبوظبي 2025. المسك الداكن وفلفت أمبر وسيكرت ليذر. توصيل مجاني في أبوظبي.",
    },
    keywords: {
      en: ["best perfume Abu Dhabi", "perfume shop Abu Dhabi", "buy perfume Abu Dhabi", "fragrance Abu Dhabi"],
      ar: ["أفضل عطر أبوظبي", "متجر عطور أبوظبي", "شراء عطور أبوظبي"],
    },
    eyebrow: { en: "Abu Dhabi Perfumes 2025", ar: "عطور أبوظبي 2025" },
    intro: {
      en: "Abu Dhabi blends tradition with modernity, and its perfume scene reflects this perfectly. From royal oud compositions to contemporary fragrances, here are the best perfumes available in Abu Dhabi.",
      ar: "أبوظبي تمزج بين التقاليد والحداثة، ومشهد العطور فيها يعكس ذلك بشكل مثالي.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Top Pick — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "الاختيار الأول — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Our bestseller in Abu Dhabi.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك." } },
      { slug: "velvet-amber-perfume", rank: 2, pickReason: { en: "Best Elegant — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "الأكثر أناقة — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Perfect for Abu Dhabi's elegant social scene.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز | القاعدة: خشب صندل، مسك." } },
      { slug: "secret-leather-perfume", rank: 3, pickReason: { en: "Best Men's — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "أفضل للرجال — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Powerful leather sophistication.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "rich-vanilla-perfume", rank: 4, pickReason: { en: "Best Sweet — Rich Vanilla | Oriental | Bergamot, Tonka, Amber, Vanilla", ar: "أفضل حلو — ريتش فانيليا" }, description: { en: "Rich Vanilla | Oriental | Top: Bergamot, Heliotrope | Heart: Tonka Bean, Amber | Base: Vanilla, Benzoin. A warm, comforting sweetness.", ar: "ريتش فانيليا | شرقي | القمة: برغموت | القلب: تونكا، عنبر | القاعدة: فانيليا، بنزوين." } },
      { slug: "royal-tobacco-perfume", rank: 5, pickReason: { en: "Best Luxurious — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "الأفخم — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. Distinguished and royal.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ." } },
    ],
    contentBlocks: [
      { heading: { en: "Perfume Culture in Abu Dhabi", ar: "ثقافة العطور في أبوظبي" }, body: { en: "Abu Dhabi's perfume culture is deeply rooted in Emirati tradition. The capital city is known for its appreciation of premium oud, musk, and amber fragrances.", ar: "ثقافة العطور في أبوظبي متجذرة بعمق في التقاليد الإماراتية. العاصمة معروفة بتقديرها للعود والمسك والعنبر الفاخر." } },
    ],
    faqs: [
      { question: { en: "Do you deliver perfume to Abu Dhabi?", ar: "هل توصلون العطور إلى أبوظبي؟" }, answer: { en: "Yes! Aromatic Scents Lab offers free delivery to Abu Dhabi on all orders. Shop online at aromaticscentslab.com.", ar: "نعم! Aromatic Scents Lab يقدم توصيلاً مجانياً إلى أبوظبي على جميع الطلبات." } },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-perfumes-dubai", "best-musk-perfumes"],
    publishedAt: "2025-01-28T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 15. BEST PERFUMES SAUDI ARABIA
  // ==========================================================================
  {
    slug: "best-perfumes-saudi-arabia",
    title: {
      en: "Best Perfumes in Saudi Arabia – Top KSA Fragrances & Oud Scents 2025",
      ar: "أفضل العطور في السعودية – أفضل العطور والعود 2025",
    },
    metaDescription: {
      en: "Shop the best perfumes in Saudi Arabia 2025. Featuring Dark Musk, Secret Leather, Royal Tobacco — premium Arabian fragrances with free delivery to KSA.",
      ar: "تسوق أفضل العطور في السعودية 2025. المسك الداكن وسيكرت ليذر ورويال توباكو. توصيل مجاني للسعودية.",
    },
    keywords: {
      en: ["best perfume Saudi Arabia", "perfume KSA", "buy perfume Saudi", "Arabian oud KSA", "fragrance Saudi Arabia"],
      ar: ["أفضل عطر السعودية", "عطور المملكة", "شراء عطور السعودية", "عود عربي السعودية"],
    },
    eyebrow: { en: "KSA Perfumes 2025", ar: "عطور السعودية 2025" },
    intro: {
      en: "Saudi Arabia has a centuries-old love affair with perfume. From the incense markets of Jeddah to the modern boutiques of Riyadh, Saudis appreciate the finest oud, musk, and amber fragrances. Here are our top picks for the Kingdom.",
      ar: "المملكة العربية السعودية لديها علاقة حب عمرها قرون مع العطور. من أسواق البخور في جدة إلى بوتيكات الرياض الحديثة.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "KSA Bestseller — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "الأكثر مبيعاً في السعودية — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. A firm favourite across the Kingdom.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك. المفضل في أنحاء المملكة." } },
      { slug: "royal-tobacco-perfume", rank: 2, pickReason: { en: "Most Distinguished — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "الأكثر تميزاً — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. Perfectly suited to Saudi Arabia's appreciation for rich scents.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ." } },
      { slug: "secret-leather-perfume", rank: 3, pickReason: { en: "Best for Men — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "أفضل للرجال — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Bold leather that resonates with Saudi men.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "velvet-amber-perfume", rank: 4, pickReason: { en: "Most Elegant — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "الأكثر أناقة — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Elegant warmth for formal occasions.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز | القاعدة: خشب صندل، مسك." } },
      { slug: "dark-wood", rank: 5, pickReason: { en: "Best Woody — Dark Wood | Woody | Bergamot, Cardamom, Cedarwood, Vetiver", ar: "أفضل خشبي — دارك وود" }, description: { en: "Dark Wood | Woody | Top: Bergamot | Heart: Caramel, Cardamom | Base: Cedarwood, Vetiver. Versatile and grounded, a Saudi gentleman's favourite.", ar: "دارك وود | خشبي | القمة: برغموت | القلب: كراميل، هيل | القاعدة: خشب أرز، فيتيفر." } },
    ],
    contentBlocks: [
      { heading: { en: "Saudi Arabia's Rich Perfume Heritage", ar: "تراث العطور الغني في السعودية" }, body: { en: "Saudi Arabia is the world's largest perfume market per capita. The Kingdom's deep connection to fragrance dates back centuries, with oud, musk, and incense being integral to daily life, hospitality, and religious practices.", ar: "المملكة العربية السعودية هي أكبر سوق للعطور في العالم للفرد. ارتباط المملكة العميق بالعطور يعود لقرون." } },
    ],
    faqs: [
      { question: { en: "Do you deliver perfume to Saudi Arabia?", ar: "هل توصلون العطور إلى السعودية؟" }, answer: { en: "Yes! Aromatic Scents Lab delivers across Saudi Arabia including Riyadh, Jeddah, Dammam, and all major cities.", ar: "نعم! Aromatic Scents Lab يوصل في جميع أنحاء السعودية بما في ذلك الرياض وجدة والدمام." } },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-perfumes-kuwait", "best-perfumes-qatar"],
    publishedAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 16. BEST PERFUMES KUWAIT
  // ==========================================================================
  {
    slug: "best-perfumes-kuwait",
    title: {
      en: "Best Perfumes in Kuwait – Top Luxury Fragrances & Arabian Scents 2025",
      ar: "أفضل العطور في الكويت – أفضل العطور الفاخرة 2025",
    },
    metaDescription: {
      en: "Discover the best perfumes in Kuwait 2025. Dark Musk, Velvet Amber, Secret Leather and more handcrafted luxury fragrances. Delivery to Kuwait.",
      ar: "اكتشف أفضل العطور في الكويت 2025. المسك الداكن وفلفت أمبر وسيكرت ليذر. توصيل إلى الكويت.",
    },
    keywords: {
      en: ["best perfume Kuwait", "perfume shop Kuwait", "buy perfume Kuwait", "Arabian perfume Kuwait", "fragrance Kuwait"],
      ar: ["أفضل عطر الكويت", "متجر عطور الكويت", "شراء عطور الكويت"],
    },
    eyebrow: { en: "Kuwait Perfumes 2025", ar: "عطور الكويت 2025" },
    intro: {
      en: "Kuwait has one of the highest per-capita spending on fragrances in the world. Kuwaitis have a discerning taste for premium oud, musk, and leather perfumes — and we've curated the best for you.",
      ar: "الكويت لديها واحد من أعلى معدلات الإنفاق على العطور للفرد في العالم. الكويتيون يمتلكون ذوقاً مميزاً للعود والمسك والجلد.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Kuwait Favourite — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "المفضل في الكويت — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Rich, warm, and long-lasting.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك." } },
      { slug: "secret-leather-perfume", rank: 2, pickReason: { en: "Best Men's — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "أفضل للرجال — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Bold, powerful, and sophisticated.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "velvet-amber-perfume", rank: 3, pickReason: { en: "Best Women's — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "أفضل للنساء — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Elegant and refined.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز | القاعدة: خشب صندل، مسك." } },
      { slug: "royal-tobacco-perfume", rank: 4, pickReason: { en: "Most Luxurious — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "الأفخم — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. Opulent and commanding.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ." } },
      { slug: "rich-vanilla-perfume", rank: 5, pickReason: { en: "Best Sweet — Rich Vanilla | Oriental | Bergamot, Tonka, Amber, Vanilla", ar: "أفضل حلو — ريتش فانيليا" }, description: { en: "Rich Vanilla | Oriental | Top: Bergamot, Heliotrope | Heart: Tonka Bean, Amber | Base: Vanilla, Benzoin. A warm, indulgent treat.", ar: "ريتش فانيليا | شرقي | القمة: برغموت | القلب: تونكا، عنبر | القاعدة: فانيليا، بنزوين." } },
    ],
    contentBlocks: [
      { heading: { en: "Kuwait's Love for Premium Fragrance", ar: "حب الكويت للعطور الفاخرة" }, body: { en: "Kuwaitis are among the world's most passionate perfume enthusiasts. The country's traditional diwaniya culture ensures perfume is worn daily, and premium fragrances are considered essential for social gatherings.", ar: "الكويتيون من بين أكثر عشاق العطور شغفاً في العالم. ثقافة الديوانية تضمن ارتداء العطور يومياً." } },
    ],
    faqs: [
      { question: { en: "Can I buy perfume from UAE and deliver to Kuwait?", ar: "هل يمكنني شراء عطور من الإمارات وتوصيلها إلى الكويت؟" }, answer: { en: "Yes! Aromatic Scents Lab ships to Kuwait with fast delivery. All our handcrafted fragrances are available for purchase online.", ar: "نعم! Aromatic Scents Lab يشحن إلى الكويت مع توصيل سريع." } },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-perfumes-saudi-arabia", "best-perfumes-qatar"],
    publishedAt: "2025-02-05T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 17. BEST PERFUMES QATAR
  // ==========================================================================
  {
    slug: "best-perfumes-qatar",
    title: {
      en: "Best Perfumes in Qatar – Top Doha Fragrances & Luxury Scents 2025",
      ar: "أفضل العطور في قطر – أفضل عطور الدوحة الفاخرة 2025",
    },
    metaDescription: {
      en: "Shop the best perfumes in Qatar 2025. Dark Musk, Velvet Amber, Royal Tobacco — handcrafted Arabian fragrances delivered to Doha and across Qatar.",
      ar: "تسوق أفضل العطور في قطر 2025. المسك الداكن وفلفت أمبر ورويال توباكو. توصيل إلى الدوحة وقطر.",
    },
    keywords: {
      en: ["best perfume Qatar", "perfume Doha", "buy perfume Qatar", "Arabian perfume Qatar", "fragrance Doha"],
      ar: ["أفضل عطر قطر", "عطور الدوحة", "شراء عطور قطر"],
    },
    eyebrow: { en: "Qatar Perfumes 2025", ar: "عطور قطر 2025" },
    intro: {
      en: "Qatar's growing luxury market has made it a destination for premium fragrances. From the souks of Doha to the modern malls, Qataris appreciate the finest oud and musk perfumes.",
      ar: "سوق الفخامة المتنامي في قطر جعلها وجهة للعطور الفاخرة. يقدر القطريون أرقى عطور العود والمسك.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Top Pick — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "الاختيار الأول — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Qatar's most requested fragrance.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك." } },
      { slug: "velvet-amber-perfume", rank: 2, pickReason: { en: "Most Elegant — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "الأكثر أناقة — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Warm sophistication.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القاعدة: خشب صندل، مسك." } },
      { slug: "secret-leather-perfume", rank: 3, pickReason: { en: "Best Bold — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "الأكثر جرأة — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Bold and commanding.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "royal-tobacco-perfume", rank: 4, pickReason: { en: "Most Luxurious — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "الأفخم — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. Rich and distinguished.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ." } },
      { slug: "white-bouquet-perfume", rank: 5, pickReason: { en: "Best Fresh — White Bouquet | White Floral | Jasmine, Rose, Peony, White Musk", ar: "أفضل منعش — وايت بوكيه" }, description: { en: "White Bouquet | White Floral | Top: Bergamot, Pink Pepper | Heart: Jasmine, Rose, Peony | Base: White Musk, Cedarwood. Light and elegant.", ar: "وايت بوكيه | زهري أبيض | القمة: برغموت | القلب: ياسمين، ورد | القاعدة: مسك أبيض، خشب أرز." } },
    ],
    contentBlocks: [
      { heading: { en: "Perfume Shopping in Qatar", ar: "تسوق العطور في قطر" }, body: { en: "Qatar's luxury retail scene has expanded rapidly. Premium fragrances are available in Doha's malls and souks, with growing demand for artisanal and niche perfumes.", ar: "توسع مشهد التجزئة الفاخرة في قطر بسرعة. تتوفر العطور الفاخرة في مراكز التسوق والأسواق في الدوحة." } },
    ],
    faqs: [
      { question: { en: "Do you ship perfume to Qatar?", ar: "هل تشحنون العطور إلى قطر؟" }, answer: { en: "Yes! We deliver to Qatar including Doha and all major areas. Fast, secure shipping for all fragrances.", ar: "نعم! نوصل إلى قطر بما في ذلك الدوحة وجميع المناطق الرئيسية." } },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-perfumes-kuwait", "best-perfumes-bahrain"],
    publishedAt: "2025-02-05T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 18. BEST PERFUMES BAHRAIN
  // ==========================================================================
  {
    slug: "best-perfumes-bahrain",
    title: {
      en: "Best Perfumes in Bahrain – Top Fragrances & Arabian Scents 2025",
      ar: "أفضل العطور في البحرين – أفضل العطور العربية 2025",
    },
    metaDescription: {
      en: "Discover the best perfumes in Bahrain 2025. Dark Musk, Velvet Amber, Secret Leather and luxury Arabian fragrances delivered to Bahrain.",
      ar: "اكتشف أفضل العطور في البحرين 2025. المسك الداكن وفلفت أمبر وسيكرت ليذر. توصيل إلى البحرين.",
    },
    keywords: {
      en: ["best perfume Bahrain", "perfume shop Bahrain", "buy perfume Bahrain", "Arabian perfume Bahrain"],
      ar: ["أفضل عطر البحرين", "متجر عطور البحرين", "شراء عطور البحرين"],
    },
    eyebrow: { en: "Bahrain Perfumes 2025", ar: "عطور البحرين 2025" },
    intro: {
      en: "Bahrain's perfume culture is rich and deeply traditional. As the pearl of the Gulf, Bahrain appreciates exquisite fragrances that blend heritage with modern luxury.",
      ar: "ثقافة العطور في البحرين غنية وتقليدية بعمق. كلؤلؤة الخليج، تقدر البحرين العطور الرائعة.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Top Pick — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "الاختيار الأول — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. The quintessential Arabian fragrance.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك." } },
      { slug: "velvet-amber-perfume", rank: 2, pickReason: { en: "Best Elegant — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "الأكثر أناقة — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Warm and refined.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز | القاعدة: خشب صندل، مسك." } },
      { slug: "secret-leather-perfume", rank: 3, pickReason: { en: "Best Bold — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "الأكثر جرأة — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Powerful and sophisticated.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "rich-vanilla-perfume", rank: 4, pickReason: { en: "Best Sweet — Rich Vanilla | Oriental | Bergamot, Tonka, Amber, Vanilla", ar: "أفضل حلو — ريتش فانيليا" }, description: { en: "Rich Vanilla | Oriental | Top: Bergamot, Heliotrope | Heart: Tonka Bean, Amber | Base: Vanilla, Benzoin. Comforting sweetness.", ar: "ريتش فانيليا | شرقي | القمة: برغموت | القلب: تونكا، عنبر | القاعدة: فانيليا، بنزوين." } },
      { slug: "patchouli-glow-perfume", rank: 5, pickReason: { en: "Most Unique — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Amber, Musk", ar: "الأكثر تفرداً — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. Distinctive and earthy.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي | القاعدة: عنبر، مسك." } },
    ],
    contentBlocks: [
      { heading: { en: "Bahrain's Fragrance Heritage", ar: "تراث العطور في البحرين" }, body: { en: "Bahrain's perfume tradition is closely linked to its pearl-diving heritage. The island kingdom's preference for rich, opulent scents reflects its historic connection to luxury and trade.", ar: "تقاليد العطور في البحرين مرتبطة ارتباطاً وثيقاً بتراث الغوص على اللؤلؤ." } },
    ],
    faqs: [
      { question: { en: "Do you deliver perfume to Bahrain?", ar: "هل توصلون العطور إلى البحرين؟" }, answer: { en: "Yes! We deliver to Bahrain with fast international shipping. All fragrances available online.", ar: "نعم! نوصل إلى البحرين مع شحن دولي سريع." } },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-perfumes-qatar", "best-perfumes-saudi-arabia"],
    publishedAt: "2025-02-08T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 19. BEST PERFUMES OMAN
  // ==========================================================================
  {
    slug: "best-perfumes-oman",
    title: {
      en: "Best Perfumes in Oman – Top Muscat Fragrances & Arabian Scents 2025",
      ar: "أفضل العطور في عُمان – أفضل عطور مسقط والروائح العربية 2025",
    },
    metaDescription: {
      en: "Discover the best perfumes in Oman 2025. Featuring Dark Musk, Secret Leather, Royal Tobacco — luxury Arabian fragrances delivered to Muscat and Oman.",
      ar: "اكتشف أفضل العطور في عُمان 2025. المسك الداكن وسيكرت ليذر ورويال توباكو. توصيل إلى مسقط وعُمان.",
    },
    keywords: {
      en: ["best perfume Oman", "perfume Muscat", "buy perfume Oman", "Arabian perfume Oman", "fragrance Muscat"],
      ar: ["أفضل عطر عُمان", "عطور مسقط", "شراء عطور عُمان"],
    },
    eyebrow: { en: "Oman Perfumes 2025", ar: "عطور عُمان 2025" },
    intro: {
      en: "Oman is the birthplace of frankincense and has a perfume heritage stretching back millennia. Omanis have an unmatched appreciation for premium oud, incense, and musk fragrances.",
      ar: "عُمان هي مهد اللبان ولديها تراث عطري يمتد لآلاف السنين.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Top Pick — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "الاختيار الأول — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Perfect for Oman's appreciation of rich musks.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك." } },
      { slug: "royal-tobacco-perfume", rank: 2, pickReason: { en: "Incense Lover — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "لعشاق البخور — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. Incense heart resonates with Omani traditions.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ." } },
      { slug: "secret-leather-perfume", rank: 3, pickReason: { en: "Best Leather — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "أفضل جلد — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Bold and commanding.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "velvet-amber-perfume", rank: 4, pickReason: { en: "Best Amber — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "أفضل عنبر — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Warm, opulent amber.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القاعدة: خشب صندل، مسك." } },
      { slug: "dark-wood", rank: 5, pickReason: { en: "Best Woody — Dark Wood | Woody | Bergamot, Cardamom, Cedarwood, Vetiver", ar: "أفضل خشبي — دارك وود" }, description: { en: "Dark Wood | Woody | Top: Bergamot | Heart: Caramel, Cardamom | Base: Cedarwood, Vetiver. Grounded and sophisticated.", ar: "دارك وود | خشبي | القمة: برغموت | القلب: كراميل، هيل | القاعدة: خشب أرز، فيتيفر." } },
    ],
    contentBlocks: [
      { heading: { en: "Oman: The Birthplace of Frankincense", ar: "عُمان: مهد اللبان" }, body: { en: "Oman's Dhofar region has been producing the world's finest frankincense for over 5,000 years. This deep connection to fragrance makes Omanis some of the world's most discerning perfume connoisseurs.", ar: "منطقة ظفار في عُمان تنتج أجود أنواع اللبان في العالم منذ أكثر من 5000 عام." } },
    ],
    faqs: [
      { question: { en: "Can you deliver perfume to Oman?", ar: "هل يمكنكم توصيل العطور إلى عُمان؟" }, answer: { en: "Yes! Aromatic Scents Lab ships to Oman including Muscat, Salalah, and all major cities.", ar: "نعم! Aromatic Scents Lab يشحن إلى عُمان بما في ذلك مسقط وصلالة." } },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-perfumes-bahrain", "best-perfumes-saudi-arabia"],
    publishedAt: "2025-02-08T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 20. BEST PERFUMES FOR WEDDINGS
  // ==========================================================================
  {
    slug: "best-perfumes-for-weddings",
    title: {
      en: "Best Perfumes for Weddings UAE – Bridal Fragrances & Wedding Scents 2025",
      ar: "أفضل عطور الأعراس في الإمارات – عطور العروس والزفاف 2025",
    },
    metaDescription: {
      en: "Find the best perfumes for weddings in UAE. Velvet Amber for brides, Secret Leather for grooms, and luxury wedding fragrance gift sets. Make your special day unforgettable.",
      ar: "اعثر على أفضل عطور الأعراس في الإمارات. فلفت أمبر للعروس وسيكرت ليذر للعريس ومجموعات هدايا العطور الفاخرة.",
    },
    keywords: {
      en: ["wedding perfume UAE", "bridal fragrance", "wedding scent", "perfume for bride", "groom perfume", "wedding gift perfume"],
      ar: ["عطر زفاف الإمارات", "عطر العروس", "عطر العريس", "هدية عطر زفاف"],
    },
    eyebrow: { en: "Wedding Fragrances 2025", ar: "عطور الأعراس 2025" },
    intro: {
      en: "Your wedding day deserves a fragrance as special as the occasion. From elegant bridal scents to powerful groom fragrances, these perfumes will make your celebration unforgettable.",
      ar: "يوم زفافك يستحق عطراً مميزاً مثل المناسبة. من روائح العروس الأنيقة إلى عطور العريس القوية.",
    },
    products: [
      { slug: "velvet-amber-perfume", rank: 1, pickReason: { en: "Best Bridal — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "أفضل للعروس — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. The ultimate bridal fragrance — elegant, warm, and memorable.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز | القاعدة: خشب صندل، مسك. العطر الأمثل للعروس." } },
      { slug: "secret-leather-perfume", rank: 2, pickReason: { en: "Best for Groom — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "أفضل للعريس — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Bold and confident — perfect for the groom.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك. جريء وواثق — مثالي للعريس." } },
      { slug: "dark-musk-perfume", rank: 3, pickReason: { en: "Most Romantic — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "الأكثر رومانسية — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Deeply romantic and intimate.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك. رومانسي عميق وحميم." } },
      { slug: "white-bouquet-perfume", rank: 4, pickReason: { en: "Fresh Bridal — White Bouquet | White Floral | Jasmine, Rose, Peony, White Musk", ar: "منعش للعروس — وايت بوكيه" }, description: { en: "White Bouquet | White Floral | Top: Bergamot, Pink Pepper | Heart: Jasmine, Rose, Peony | Base: White Musk, Cedarwood. Light, fresh, and bridal.", ar: "وايت بوكيه | زهري أبيض | القمة: برغموت | القلب: ياسمين، ورد | القاعدة: مسك أبيض. خفيف ومنعش." } },
      { slug: "rich-vanilla-perfume", rank: 5, pickReason: { en: "Romantic Sweet — Rich Vanilla | Oriental | Bergamot, Tonka, Amber, Vanilla", ar: "حلو رومانسي — ريتش فانيليا" }, description: { en: "Rich Vanilla | Oriental | Top: Bergamot, Heliotrope | Heart: Tonka Bean, Amber | Base: Vanilla, Benzoin. Sweet, warm, and irresistibly romantic.", ar: "ريتش فانيليا | شرقي | القمة: برغموت | القلب: تونكا، عنبر | القاعدة: فانيليا، بنزوين." } },
    ],
    contentBlocks: [
      { heading: { en: "Choosing Your Wedding Fragrance", ar: "اختيار عطر زفافك" }, body: { en: "Your wedding perfume becomes a scent memory forever tied to your special day. Choose a fragrance that matches the season, venue, and your personal style. Test it well before the day — wear it for a full day to ensure it performs.", ar: "عطر زفافك يصبح ذكرى عطرية مرتبطة إلى الأبد بيومك الخاص. اختر عطراً يناسب الموسم والمكان وأسلوبك." } },
    ],
    faqs: [
      { question: { en: "What is the best perfume for a bride?", ar: "ما هو أفضل عطر للعروس؟" }, answer: { en: "Velvet Amber is our top pick for brides. Its warm, elegant composition with Lily, Cedarwood, Sandalwood, and Musk creates a memorable bridal scent.", ar: "فلفت أمبر هو اختيارنا الأول للعروس. تركيبته الدافئة والأنيقة تخلق رائحة عروس لا تُنسى." } },
    ],
    relatedGuideSlugs: ["best-perfume-gift-sets", "best-perfumes-for-date-night", "best-perfumes-uae"],
    publishedAt: "2025-02-15T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 21. BEST PERFUMES FOR RAMADAN
  // ==========================================================================
  {
    slug: "best-perfumes-for-ramadan",
    title: {
      en: "Best Perfumes for Ramadan 2025 – Oud, Musk & Incense Fragrances UAE",
      ar: "أفضل عطور رمضان 2025 – العود والمسك والبخور في الإمارات",
    },
    metaDescription: {
      en: "Shop the best perfumes for Ramadan 2025. Featuring Dark Musk, Royal Tobacco (Incense, Vanilla) and luxury fragrance gift sets for Ramadan in the UAE.",
      ar: "تسوق أفضل عطور رمضان 2025. المسك الداكن ورويال توباكو ومجموعات هدايا العطور الفاخرة لرمضان في الإمارات.",
    },
    keywords: {
      en: ["Ramadan perfume", "perfume for Ramadan", "Ramadan gift perfume", "oud Ramadan", "musk Ramadan", "Ramadan fragrance UAE"],
      ar: ["عطر رمضان", "هدية عطر رمضان", "عود رمضان", "مسك رمضان"],
    },
    eyebrow: { en: "Ramadan Fragrances 2025", ar: "عطور رمضان 2025" },
    intro: {
      en: "Ramadan is a time of spiritual reflection, family gatherings, and generous gifting. The right fragrance elevates your iftar gatherings and Taraweeh prayers. These are the best perfumes for the holy month.",
      ar: "رمضان هو وقت التأمل الروحي والتجمعات العائلية والهدايا السخية. العطر المناسب يرتقي بتجمعات الإفطار وصلاة التراويح.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Ramadan Essential — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "أساسي لرمضان — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. The perfect companion for Ramadan evenings and gatherings.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك. الرفيق المثالي لأمسيات رمضان." } },
      { slug: "royal-tobacco-perfume", rank: 2, pickReason: { en: "Most Spiritual — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "الأكثر روحانية — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. The incense heart creates a spiritual, contemplative atmosphere.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ. قلب البخور يخلق أجواء روحانية." } },
      { slug: "dark-musk-oil", rank: 3, pickReason: { en: "Alcohol-Free — Dark Musk Oil | Concentrated Perfume Oil | Ideal for Prayer", ar: "خالي من الكحول — زيت المسك الداكن" }, description: { en: "Dark Musk Oil | Concentrated oil format | Alcohol-free, making it ideal for use during prayer and spiritual occasions. 12+ hour longevity.", ar: "زيت المسك الداكن | صيغة زيت مركزة | خالي من الكحول، مثالي للاستخدام أثناء الصلاة. يدوم 12+ ساعة." } },
      { slug: "velvet-amber-perfume", rank: 4, pickReason: { en: "Iftar Gatherings — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "تجمعات الإفطار — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Warm and inviting for family gatherings.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز | القاعدة: خشب صندل، مسك." } },
      { slug: "velvet-amber", rank: 5, pickReason: { en: "Prayer Oil — Velvet Amber Oil | Alcohol-Free | Intimate, Spiritual", ar: "زيت للصلاة — زيت فلفت أمبر" }, description: { en: "Velvet Amber Oil | Concentrated oil format | Alcohol-free amber warmth ideal for spiritual occasions and daily prayer.", ar: "زيت فلفت أمبر | صيغة زيت مركزة | دفء عنبري خالي من الكحول مثالي للمناسبات الروحانية." } },
    ],
    contentBlocks: [
      { heading: { en: "Fragrance Etiquette During Ramadan", ar: "آداب العطور في رمضان" }, body: { en: "During Ramadan, many Muslims prefer alcohol-free perfume oils as they are considered more appropriate for prayer. Rich, opulent scents like musk and incense are traditional choices for evening gatherings after iftar.", ar: "خلال رمضان، يفضل الكثير من المسلمين زيوت العطور الخالية من الكحول لأنها أكثر ملاءمة للصلاة." } },
    ],
    faqs: [
      { question: { en: "What is the best perfume for Ramadan?", ar: "ما هو أفضل عطر لرمضان؟" }, answer: { en: "Dark Musk is our top Ramadan pick. For alcohol-free options, Dark Musk Oil is ideal for prayer and spiritual occasions.", ar: "المسك الداكن هو اختيارنا الأول لرمضان. للخيارات الخالية من الكحول، زيت المسك الداكن مثالي للصلاة." } },
    ],
    relatedGuideSlugs: ["best-perfumes-for-eid", "best-perfume-gift-sets", "best-fragrance-oils"],
    publishedAt: "2025-02-20T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 22. BEST PERFUMES FOR EID
  // ==========================================================================
  {
    slug: "best-perfumes-for-eid",
    title: {
      en: "Best Perfumes for Eid 2025 – Luxury Eid Gift Fragrances UAE",
      ar: "أفضل عطور العيد 2025 – هدايا العطور الفاخرة للعيد في الإمارات",
    },
    metaDescription: {
      en: "Shop the best perfumes for Eid 2025. Luxury Eid fragrance gifts including Dark Musk, Velvet Amber gift sets, and premium Arabian perfumes. Perfect Eid gifts UAE.",
      ar: "تسوق أفضل عطور العيد 2025. هدايا عطور العيد الفاخرة بما فيها المسك الداكن ومجموعات هدايا فلفت أمبر.",
    },
    keywords: {
      en: ["Eid perfume", "Eid gift perfume", "Eid fragrance gift", "Eid al-Fitr perfume", "Eid al-Adha perfume", "best Eid gift UAE"],
      ar: ["عطر العيد", "هدية عطر العيد", "هدايا عيد الفطر", "هدايا عيد الأضحى"],
    },
    eyebrow: { en: "Eid Fragrances 2025", ar: "عطور العيد 2025" },
    intro: {
      en: "Eid is a time for celebration, family, and generous gifting. The perfect Eid fragrance should be festive, luxurious, and memorable — something that makes both the wearer and their loved ones smile.",
      ar: "العيد وقت للاحتفال والعائلة والهدايا السخية. عطر العيد المثالي يجب أن يكون احتفالياً وفاخراً ولا يُنسى.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Best Eid Gift — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "أفضل هدية عيد — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. The ultimate Eid gift — luxurious and universally loved.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك. هدية العيد المثالية." } },
      { slug: "velvet-amber-perfume", rank: 2, pickReason: { en: "Best for Women — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "أفضل للنساء — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Elegant and festive.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القاعدة: خشب صندل، مسك. أنيق واحتفالي." } },
      { slug: "secret-leather-perfume", rank: 3, pickReason: { en: "Best for Men — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "أفضل للرجال — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Bold, confident — a man's perfect Eid gift.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "white-bouquet-perfume", rank: 4, pickReason: { en: "Festive Fresh — White Bouquet | White Floral | Jasmine, Rose, Peony, White Musk", ar: "منعش احتفالي — وايت بوكيه" }, description: { en: "White Bouquet | White Floral | Top: Bergamot, Pink Pepper | Heart: Jasmine, Rose, Peony | Base: White Musk, Cedarwood. Light and joyful for Eid morning.", ar: "وايت بوكيه | زهري أبيض | القمة: برغموت | القلب: ياسمين، ورد | القاعدة: مسك أبيض." } },
      { slug: "rich-vanilla-perfume", rank: 5, pickReason: { en: "Sweet Celebration — Rich Vanilla | Oriental | Bergamot, Tonka, Amber, Vanilla", ar: "احتفال حلو — ريتش فانيليا" }, description: { en: "Rich Vanilla | Oriental | Top: Bergamot, Heliotrope | Heart: Tonka Bean, Amber | Base: Vanilla, Benzoin. Sweet and festive.", ar: "ريتش فانيليا | شرقي | القمة: برغموت | القلب: تونكا، عنبر | القاعدة: فانيليا، بنزوين." } },
    ],
    contentBlocks: [
      { heading: { en: "Perfume as an Eid Gift Tradition", ar: "العطر كتقليد هدايا العيد" }, body: { en: "Perfume is one of the most popular Eid gifts in the GCC. A luxury fragrance shows thoughtfulness and appreciation. Gift sets are especially popular as they offer variety and beautiful presentation.", ar: "العطر من أكثر هدايا العيد شعبية في دول الخليج. العطر الفاخر يظهر التقدير والاهتمام." } },
    ],
    faqs: [
      { question: { en: "What is the best Eid gift for him?", ar: "ما هي أفضل هدية عيد له؟" }, answer: { en: "Secret Leather or Dark Musk are both excellent Eid gifts for men. For a premium presentation, consider our gift set options.", ar: "سيكرت ليذر أو المسك الداكن كلاهما هدايا عيد ممتازة للرجال." } },
    ],
    relatedGuideSlugs: ["best-perfumes-for-ramadan", "best-perfume-gift-sets", "best-perfumes-uae"],
    publishedAt: "2025-02-20T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 23. BEST PERFUMES FOR OFFICE
  // ==========================================================================
  {
    slug: "best-perfumes-for-office",
    title: {
      en: "Best Perfumes for Office & Work – Subtle, Professional Fragrances 2025",
      ar: "أفضل عطور المكتب والعمل – عطور رقيقة ومهنية 2025",
    },
    metaDescription: {
      en: "Find the best office-friendly perfumes. Subtle, long-lasting fragrances that won't overwhelm your colleagues. Velvet Amber, White Bouquet & more professional scents.",
      ar: "اعثر على أفضل عطور المكتب. عطور رقيقة وطويلة الأمد لن تزعج زملاءك. فلفت أمبر ووايت بوكيه والمزيد.",
    },
    keywords: {
      en: ["office perfume", "work fragrance", "subtle perfume", "professional scent", "perfume for office UAE"],
      ar: ["عطر مكتب", "عطر عمل", "عطر رقيق", "رائحة مهنية"],
    },
    eyebrow: { en: "Office Fragrances 2025", ar: "عطور المكتب 2025" },
    intro: {
      en: "The perfect office perfume is subtle enough not to overwhelm in close quarters, yet distinctive enough to leave a lasting impression. These fragrances balance professionalism with personality.",
      ar: "عطر المكتب المثالي رقيق بما يكفي لعدم الإزعاج، ومميز بما يكفي لترك انطباع دائم.",
    },
    products: [
      { slug: "velvet-amber-perfume", rank: 1, pickReason: { en: "Most Professional — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "الأكثر مهنية — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Soft, warm sillage that's never overwhelming.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز | القاعدة: خشب صندل، مسك." } },
      { slug: "white-bouquet-perfume", rank: 2, pickReason: { en: "Freshest — White Bouquet | White Floral | Jasmine, Rose, Peony, White Musk", ar: "الأكثر انتعاشاً — وايت بوكيه" }, description: { en: "White Bouquet | White Floral | Top: Bergamot, Pink Pepper | Heart: Jasmine, Rose, Peony | Base: White Musk, Cedarwood. Clean, fresh, and perfectly office-appropriate.", ar: "وايت بوكيه | زهري أبيض | القمة: برغموت | القلب: ياسمين، ورد | القاعدة: مسك أبيض." } },
      { slug: "dark-wood", rank: 3, pickReason: { en: "Best for Men — Dark Wood | Woody | Bergamot, Cardamom, Cedarwood, Vetiver", ar: "أفضل للرجال — دارك وود" }, description: { en: "Dark Wood | Woody | Top: Bergamot | Heart: Caramel, Cardamom | Base: Cedarwood, Vetiver. Professional and understated.", ar: "دارك وود | خشبي | القمة: برغموت | القلب: كراميل، هيل | القاعدة: خشب أرز، فيتيفر." } },
      { slug: "patchouli-glow-perfume", rank: 4, pickReason: { en: "Unique Professional — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Sandalwood", ar: "مهني فريد — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. Distinctive yet subtle.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي | القاعدة: عنبر، مسك." } },
      { slug: "dark-musk-oil", rank: 5, pickReason: { en: "Subtle Musk — Dark Musk Oil | Concentrated Oil | Close-to-Skin Musk", ar: "مسك رقيق — زيت المسك الداكن" }, description: { en: "Dark Musk Oil | Concentrated oil format | Sits close to skin — perfect for shared office spaces. Intimate sillage only you and close colleagues can enjoy.", ar: "زيت المسك الداكن | صيغة زيت مركزة | يبقى قريباً من البشرة — مثالي للمكاتب المشتركة." } },
    ],
    contentBlocks: [
      { heading: { en: "Office Fragrance Etiquette", ar: "آداب العطور في المكتب" }, body: { en: "In office environments, less is more. Apply your fragrance sparingly — one or two sprays on pulse points. Choose fragrances with moderate sillage. Perfume oils are excellent for office as they stay close to the skin.", ar: "في بيئات المكتب، الأقل هو الأكثر. ضع عطرك باعتدال — رشة أو رشتين على نقاط النبض." } },
    ],
    faqs: [
      { question: { en: "What perfume is good for the office?", ar: "ما هو العطر المناسب للمكتب؟" }, answer: { en: "Velvet Amber and White Bouquet are our top office picks. They're subtle, professional, and long-lasting without being overpowering.", ar: "فلفت أمبر ووايت بوكيه هما اختياراتنا الأولى للمكتب. رقيقة ومهنية وطويلة الأمد." } },
    ],
    relatedGuideSlugs: ["best-perfumes-for-summer", "best-unisex-perfumes", "long-lasting-perfumes"],
    publishedAt: "2025-02-22T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 24. BEST PERFUMES FOR SUMMER
  // ==========================================================================
  {
    slug: "best-perfumes-for-summer",
    title: {
      en: "Best Perfumes for Summer UAE – Fresh, Light & Long-Lasting Scents 2025",
      ar: "أفضل عطور الصيف في الإمارات – عطور منعشة وخفيفة وطويلة الأمد 2025",
    },
    metaDescription: {
      en: "Discover the best perfumes for summer in UAE. Light, fresh fragrances that last in heat — White Bouquet (Jasmine, Rose), Dark Wood (Bergamot, Cedarwood) and more.",
      ar: "اكتشف أفضل عطور الصيف في الإمارات. عطور خفيفة ومنعشة تدوم في الحرارة — وايت بوكيه ودارك وود والمزيد.",
    },
    keywords: {
      en: ["summer perfume UAE", "best summer fragrance", "light perfume hot weather", "fresh scent UAE", "perfume for heat"],
      ar: ["عطر صيفي الإمارات", "أفضل عطر صيفي", "عطر خفيف للحرارة"],
    },
    eyebrow: { en: "Summer Fragrances 2025", ar: "عطور الصيف 2025" },
    intro: {
      en: "Summer in the UAE demands fragrances that can handle extreme heat while staying fresh and appealing. These perfumes are designed to thrive in warm weather — light enough to not overwhelm, yet long-lasting enough to survive the heat.",
      ar: "صيف الإمارات يتطلب عطوراً تتحمل الحرارة الشديدة مع البقاء منعشة وجذابة.",
    },
    products: [
      { slug: "white-bouquet-perfume", rank: 1, pickReason: { en: "Best Summer — White Bouquet | White Floral | Bergamot, Jasmine, Rose, White Musk", ar: "أفضل صيفي — وايت بوكيه" }, description: { en: "White Bouquet | White Floral | Top: Bergamot, Pink Pepper | Heart: Jasmine, Rose, Peony | Base: White Musk, Cedarwood. Fresh and light — perfect for UAE summers.", ar: "وايت بوكيه | زهري أبيض | القمة: برغموت | القلب: ياسمين، ورد | القاعدة: مسك أبيض. منعش وخفيف." } },
      { slug: "dark-wood", rank: 2, pickReason: { en: "Fresh Woody — Dark Wood | Woody | Bergamot, Cardamom, Cedarwood, Vetiver", ar: "خشبي منعش — دارك وود" }, description: { en: "Dark Wood | Woody | Top: Bergamot | Heart: Caramel, Cardamom | Base: Cedarwood, Vetiver. Bergamot opening keeps it fresh in heat.", ar: "دارك وود | خشبي | القمة: برغموت | القلب: كراميل، هيل | القاعدة: خشب أرز، فيتيفر." } },
      { slug: "patchouli-glow-perfume", rank: 3, pickReason: { en: "Earthy Fresh — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Amber", ar: "ترابي منعش — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. Bergamot-forward with earthy depth.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي | القاعدة: عنبر، مسك." } },
      { slug: "velvet-amber-perfume", rank: 4, pickReason: { en: "Soft Summer — Velvet Amber | Ambry | Lily, Cedarwood, Dry Amber, Sandalwood", ar: "صيفي ناعم — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Dry amber note keeps it from being heavy.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القلب: خشب أرز، عنبر جاف | القاعدة: خشب صندل، مسك." } },
      { slug: "dark-musk-oil", rank: 5, pickReason: { en: "Heat-Proof — Dark Musk Oil | Concentrated Oil | Thrives in Heat, Close Projection", ar: "مقاوم للحرارة — زيت المسك الداكن" }, description: { en: "Dark Musk Oil | Concentrated oil format | Perfume oils perform better in heat than alcohol-based sprays. Sits close to skin without projecting too strongly.", ar: "زيت المسك الداكن | صيغة زيت مركزة | زيوت العطور تؤدي بشكل أفضل في الحرارة." } },
    ],
    contentBlocks: [
      { heading: { en: "How to Wear Perfume in UAE Summer", ar: "كيفية ارتداء العطر في صيف الإمارات" }, body: { en: "UAE summers can reach 50°C. Perfume oils tend to outperform sprays in extreme heat. Apply to pulse points (wrists, neck, behind ears) and consider lighter concentrations. Fresh, citrus, and green notes work best outdoors.", ar: "يمكن أن تصل درجات حرارة صيف الإمارات إلى 50 درجة مئوية. زيوت العطور تتفوق على البخاخات في الحرارة الشديدة." } },
    ],
    faqs: [
      { question: { en: "What perfume lasts longest in UAE heat?", ar: "ما العطر الذي يدوم أطول في حرارة الإمارات؟" }, answer: { en: "Perfume oils like Dark Musk Oil outperform sprays in heat. Among sprays, White Bouquet and Dark Wood both perform well in summer.", ar: "زيوت العطور مثل زيت المسك الداكن تتفوق على البخاخات في الحرارة." } },
    ],
    relatedGuideSlugs: ["best-perfumes-for-winter", "long-lasting-perfumes", "best-fragrance-oils"],
    publishedAt: "2025-02-25T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 25. BEST PERFUMES FOR WINTER
  // ==========================================================================
  {
    slug: "best-perfumes-for-winter",
    title: {
      en: "Best Perfumes for Winter UAE – Warm, Rich & Cozy Fragrances 2025",
      ar: "أفضل عطور الشتاء في الإمارات – عطور دافئة وغنية 2025",
    },
    metaDescription: {
      en: "Shop the best perfumes for winter in UAE. Dark Musk (Ambergris, Musk), Royal Tobacco (Incense, Vanilla), and rich warm fragrances for cooler months.",
      ar: "تسوق أفضل عطور الشتاء في الإمارات. المسك الداكن ورويال توباكو والعطور الدافئة الغنية للأشهر الباردة.",
    },
    keywords: {
      en: ["winter perfume UAE", "warm fragrance", "cozy perfume", "best winter scent", "rich perfume cold weather"],
      ar: ["عطر شتوي الإمارات", "عطر دافئ", "أفضل عطر شتوي"],
    },
    eyebrow: { en: "Winter Fragrances 2025", ar: "عطور الشتاء 2025" },
    intro: {
      en: "Winter in the UAE (October–March) brings cooler temperatures perfect for wearing rich, warm, and opulent fragrances. This is when heavy oud, musk, leather, and amber perfumes truly shine.",
      ar: "الشتاء في الإمارات (أكتوبر–مارس) يجلب درجات حرارة أبرد مثالية لارتداء العطور الغنية والدافئة والفاخرة.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Winter King — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "ملك الشتاء — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Rich, warm, and powerful — designed for cooler weather.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك." } },
      { slug: "royal-tobacco-perfume", rank: 2, pickReason: { en: "Warmest — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "الأكثر دفئاً — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. Smoky warmth that thrives in cool air.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ." } },
      { slug: "secret-leather-perfume", rank: 3, pickReason: { en: "Bold Winter — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "شتاء جريء — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Leather and cypress project beautifully in cold air.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "rich-vanilla-perfume", rank: 4, pickReason: { en: "Coziest — Rich Vanilla | Oriental | Bergamot, Tonka, Amber, Vanilla", ar: "الأكثر دفئاً — ريتش فانيليا" }, description: { en: "Rich Vanilla | Oriental | Top: Bergamot, Heliotrope | Heart: Tonka Bean, Amber | Base: Vanilla, Benzoin. Like a warm cashmere sweater in a bottle.", ar: "ريتش فانيليا | شرقي | القمة: برغموت | القلب: تونكا، عنبر | القاعدة: فانيليا، بنزوين." } },
      { slug: "black-vanilla-perfume", rank: 5, pickReason: { en: "Dark Winter — Black Vanilla | Gourmand | Cinnamon, Rose, Vanilla, Patchouli", ar: "شتاء داكن — بلاك فانيليا" }, description: { en: "Black Vanilla | Gourmand | Top: Bergamot, Cinnamon | Heart: Rose, Tonka | Base: Vanilla, Patchouli. Dark, mysterious, and deeply warm.", ar: "بلاك فانيليا | حلو | القمة: برغموت، قرفة | القلب: ورد، تونكا | القاعدة: فانيليا، باتشولي." } },
    ],
    contentBlocks: [
      { heading: { en: "Why Winter Is Peak Perfume Season in UAE", ar: "لماذا الشتاء هو موسم العطور في الإمارات" }, body: { en: "UAE winters (October–March) bring temperatures of 15-25°C — ideal for wearing rich, opulent fragrances. The cooler air helps project heavier scents beautifully without the heat breaking them down.", ar: "شتاء الإمارات (أكتوبر–مارس) يجلب درجات حرارة 15-25 مئوية — مثالية لارتداء العطور الغنية والفاخرة." } },
    ],
    faqs: [
      { question: { en: "What is the best winter perfume?", ar: "ما هو أفضل عطر شتوي؟" }, answer: { en: "Dark Musk is our top winter pick. Its rich Ambergris and Musk base notes project beautifully in cool weather. Royal Tobacco is equally excellent.", ar: "المسك الداكن هو اختيارنا الأول للشتاء. قاعدته الغنية من العنبر والمسك تنتشر بشكل جميل في الطقس البارد." } },
    ],
    relatedGuideSlugs: ["best-perfumes-for-summer", "best-amber-perfumes", "best-leather-perfumes"],
    publishedAt: "2025-02-25T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 26. BEST FRAGRANCE OILS
  // ==========================================================================
  {
    slug: "best-fragrance-oils",
    title: {
      en: "Best Fragrance Oils UAE – Dark Musk Oil, Velvet Amber Oil & Concentrated Perfume Oils 2025",
      ar: "أفضل زيوت العطور في الإمارات – زيت المسك الداكن وزيت فلفت أمبر 2025",
    },
    metaDescription: {
      en: "Shop the best fragrance oils in UAE. Alcohol-free concentrated perfume oils including Dark Musk Oil, Velvet Amber Oil — 12+ hour longevity, perfect for layering.",
      ar: "تسوق أفضل زيوت العطور في الإمارات. زيوت عطور مركزة خالية من الكحول بما فيها زيت المسك الداكن وزيت فلفت أمبر.",
    },
    keywords: {
      en: ["fragrance oil UAE", "perfume oil", "concentrated oil perfume", "alcohol free perfume", "dark musk oil", "velvet amber oil"],
      ar: ["زيت عطر الإمارات", "زيت عطري مركز", "عطر خالي من الكحول", "زيت المسك الداكن"],
    },
    eyebrow: { en: "Fragrance Oils 2025", ar: "زيوت العطور 2025" },
    intro: {
      en: "Fragrance oils are the purest way to wear perfume — concentrated, alcohol-free, and incredibly long-lasting. Perfect for the UAE climate, they sit close to the skin and last 12+ hours.",
      ar: "زيوت العطور هي أنقى طريقة لارتداء العطر — مركزة وخالية من الكحول وطويلة الأمد بشكل لا يصدق.",
    },
    products: [
      { slug: "dark-musk-oil", rank: 1, pickReason: { en: "Best Musk Oil — Dark Musk Oil | Concentrated | Same notes as Dark Musk EDP, 12+ hours", ar: "أفضل زيت مسك — زيت المسك الداكن" }, description: { en: "Dark Musk Oil | Concentrated perfume oil | Same Oriental Musky composition as Dark Musk EDP. Alcohol-free, 12+ hour longevity. Perfect for layering.", ar: "زيت المسك الداكن | زيت عطر مركز | نفس تركيبة المسك الداكن الشرقية. خالي من الكحول، يدوم 12+ ساعة." } },
      { slug: "velvet-amber", rank: 2, pickReason: { en: "Best Amber Oil — Velvet Amber Oil | Concentrated | Warm amber in pure oil form", ar: "أفضل زيت عنبر — زيت فلفت أمبر" }, description: { en: "Velvet Amber Oil | Concentrated perfume oil | Warm amber, sandalwood, and musk in pure oil form. 12+ hour longevity, alcohol-free.", ar: "زيت فلفت أمبر | زيت عطر مركز | عنبر دافئ وخشب صندل ومسك في صيغة زيت نقية. يدوم 12+ ساعة." } },
      { slug: "dark-musk-perfume", rank: 3, pickReason: { en: "Spray Option — Dark Musk EDP | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "خيار بخاخ — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. The EDP version for those who prefer sprays.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك." } },
      { slug: "velvet-amber-perfume", rank: 4, pickReason: { en: "Spray Option — Velvet Amber EDP | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "خيار بخاخ — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. The EDP version for wider projection.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القاعدة: خشب صندل، مسك." } },
      { slug: "patchouli-glow-perfume", rank: 5, pickReason: { en: "Oil-Like Depth — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Amber, Musk", ar: "عمق شبيه بالزيت — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. Rich enough to rival oil concentrations.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي | القاعدة: عنبر، مسك." } },
    ],
    contentBlocks: [
      { heading: { en: "Perfume Oil vs EDP: Which Is Better?", ar: "زيت العطر مقابل أو دو بارفان: أيهما أفضل؟" }, body: { en: "Perfume oils are more concentrated, alcohol-free, and last longer — but project less. EDPs project more and create a scent cloud around you. Many fragrance lovers layer both: oil on pulse points + EDP spray for projection.", ar: "زيوت العطور أكثر تركيزاً وخالية من الكحول وتدوم أطول — لكنها تنتشر أقل. الكثير من عشاق العطور يطبقون كليهما." } },
    ],
    faqs: [
      { question: { en: "Are fragrance oils better than perfume sprays?", ar: "هل زيوت العطور أفضل من بخاخات العطور؟" }, answer: { en: "They're different. Oils last longer, are alcohol-free, and project closer to skin. Sprays project more. For UAE heat, oils perform better outdoors.", ar: "هما مختلفان. الزيوت تدوم أطول وخالية من الكحول. البخاخات تنتشر أكثر. للحرارة، الزيوت أفضل في الخارج." } },
    ],
    relatedGuideSlugs: ["best-musk-perfumes", "best-perfumes-for-ramadan", "long-lasting-perfumes"],
    publishedAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 27. BEST PERFUMES FOR DATE NIGHT
  // ==========================================================================
  {
    slug: "best-perfumes-for-date-night",
    title: {
      en: "Best Perfumes for Date Night – Romantic, Seductive Fragrances 2025",
      ar: "أفضل عطور للسهرات الرومانسية – عطور مثيرة وجذابة 2025",
    },
    metaDescription: {
      en: "Discover the best perfumes for date night. Dark Musk (Ambergris, Musk), Velvet Amber (Sandalwood, Musk) and seductive fragrances that leave a lasting impression.",
      ar: "اكتشف أفضل العطور للسهرات الرومانسية. المسك الداكن وفلفت أمبر وعطور مثيرة تترك انطباعاً لا يُنسى.",
    },
    keywords: {
      en: ["date night perfume", "romantic fragrance", "seductive perfume", "best perfume for dating", "attractive scent"],
      ar: ["عطر سهرة رومانسية", "عطر مثير", "عطر جذاب"],
    },
    eyebrow: { en: "Date Night Fragrances 2025", ar: "عطور السهرات 2025" },
    intro: {
      en: "The right perfume can transform a date night into an unforgettable experience. These seductive, intimate fragrances are designed to captivate, attract, and leave a lasting memory.",
      ar: "العطر المناسب يمكن أن يحول سهرة رومانسية إلى تجربة لا تُنسى. هذه العطور المثيرة مصممة للجذب والسحر.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Most Seductive — Dark Musk | Oriental Musky | Mandarin, Praline, Ambergris, Musk", ar: "الأكثر إثارة — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Intimate, warm, skin-hugging — irresistible on a date.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القاعدة: عنبر أشهب، مسك. حميم ودافئ ولا يقاوم." } },
      { slug: "velvet-amber-perfume", rank: 2, pickReason: { en: "Most Elegant — Velvet Amber | Ambry | Lily, Cedarwood, Sandalwood, Musk", ar: "الأكثر أناقة — فلفت أمبر" }, description: { en: "Velvet Amber | Ambry | Top: Lily of the Valley | Heart: Cedarwood, Dry Amber | Base: Sandalwood, Musk. Sophisticated warmth that draws people in.", ar: "فلفت أمبر | عنبري | القمة: زنبق الوادي | القاعدة: خشب صندل، مسك. أناقة دافئة تجذب الآخرين." } },
      { slug: "secret-leather-perfume", rank: 3, pickReason: { en: "Most Powerful — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "الأقوى — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Bold, confident, and magnetically attractive.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "black-vanilla-perfume", rank: 4, pickReason: { en: "Most Tempting — Black Vanilla | Gourmand | Cinnamon, Rose, Vanilla, Patchouli", ar: "الأكثر إغراء — بلاك فانيليا" }, description: { en: "Black Vanilla | Gourmand | Top: Bergamot, Cinnamon | Heart: Rose, Tonka | Base: Vanilla, Patchouli. Dark, mysterious, and utterly tempting.", ar: "بلاك فانيليا | حلو | القمة: برغموت، قرفة | القلب: ورد | القاعدة: فانيليا، باتشولي." } },
      { slug: "rich-vanilla-perfume", rank: 5, pickReason: { en: "Sweetest — Rich Vanilla | Oriental | Bergamot, Tonka, Amber, Vanilla", ar: "الأحلى — ريتش فانيليا" }, description: { en: "Rich Vanilla | Oriental | Top: Bergamot, Heliotrope | Heart: Tonka Bean, Amber | Base: Vanilla, Benzoin. Sweet and alluring.", ar: "ريتش فانيليا | شرقي | القمة: برغموت | القلب: تونكا، عنبر | القاعدة: فانيليا، بنزوين." } },
    ],
    contentBlocks: [
      { heading: { en: "How to Wear Perfume on a Date", ar: "كيفية ارتداء العطر في سهرة" }, body: { en: "Apply to warm pulse points — wrists, neck, behind ears, and chest. Don't rub your wrists together as it breaks down the molecules. For a subtle effect, spray in the air and walk through the mist.", ar: "ضع العطر على نقاط النبض الدافئة — المعصمين والرقبة وخلف الأذنين والصدر. لا تفرك معصميك معاً." } },
    ],
    faqs: [
      { question: { en: "What perfume is most attractive?", ar: "ما هو العطر الأكثر جاذبية؟" }, answer: { en: "Dark Musk is consistently rated as our most attractive fragrance. Its warm, musky, skin-hugging quality draws people in without being overwhelming.", ar: "المسك الداكن يُصنف باستمرار كأكثر عطورنا جاذبية. جودته الدافئة والمسكية تجذب الآخرين." } },
    ],
    relatedGuideSlugs: ["best-musk-perfumes", "best-perfumes-for-weddings", "long-lasting-perfumes"],
    publishedAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },

  // ==========================================================================
  // 28. BEST ARABIAN OUD PERFUMES
  // ==========================================================================
  {
    slug: "best-arabian-oud-perfumes",
    title: {
      en: "Best Arabian Oud Perfumes UAE – Oud, Incense & Traditional Scents 2025",
      ar: "أفضل عطور العود العربي في الإمارات – العود والبخور والروائح التقليدية 2025",
    },
    metaDescription: {
      en: "Discover the best Arabian oud perfumes in UAE. Featuring Dark Musk (Cypriol, Guaiac), Royal Tobacco (Incense), Secret Leather and traditional oud-based scents.",
      ar: "اكتشف أفضل عطور العود العربي في الإمارات. المسك الداكن ورويال توباكو وسيكرت ليذر وروائح العود التقليدية.",
    },
    keywords: {
      en: ["Arabian oud perfume", "best oud fragrance UAE", "oud perfume", "traditional Arabian scent", "bakhoor perfume"],
      ar: ["عطر عود عربي", "أفضل عطر عود الإمارات", "عطر عود", "رائحة عربية تقليدية"],
    },
    eyebrow: { en: "Arabian Oud 2025", ar: "العود العربي 2025" },
    intro: {
      en: "Oud is the heart and soul of Arabian perfumery — a liquid gold treasured for centuries across the Middle East. These fragrances capture the essence of Arabian oud tradition with modern sophistication.",
      ar: "العود هو قلب وروح صناعة العطور العربية — ذهب سائل يُعتز به منذ قرون في الشرق الأوسط.",
    },
    products: [
      { slug: "dark-musk-perfume", rank: 1, pickReason: { en: "Oud Character — Dark Musk | Oriental Musky | Cypriol, Guaiac Wood, Ambergris", ar: "طابع العود — المسك الداكن" }, description: { en: "Dark Musk | Oriental Musky | Top: Mandarin, Praline | Heart: Cypriol, Guaiac wood | Base: Ambergris, Musk. Cypriol (nagarmotha) brings oud-like smokiness and depth.", ar: "المسك الداكن | مسكي شرقي | القمة: ماندرين، برالين | القلب: سيبريول، خشب جواياك | القاعدة: عنبر أشهب، مسك." } },
      { slug: "royal-tobacco-perfume", rank: 2, pickReason: { en: "Incense & Oud — Royal Tobacco | Oriental Spicy | Mandarin, Incense, Vanilla, Tobacco", ar: "بخور وعود — رويال توباكو" }, description: { en: "Royal Tobacco | Oriental Spicy | Top: Mandarin | Heart: Incense, Vanilla | Base: Vetiver, Tobacco. The incense heart is deeply Arabian in character.", ar: "رويال توباكو | شرقي حار | القمة: ماندرين | القلب: بخور، فانيليا | القاعدة: فيتيفر، تبغ." } },
      { slug: "secret-leather-perfume", rank: 3, pickReason: { en: "Leather & Oud — Secret Leather | Oriental | Orris, Leather, Cypress, Tonka, Musk", ar: "جلد وعود — سيكرت ليذر" }, description: { en: "Secret Leather | Oriental | Top: Orris | Heart: Leather, Cypress | Base: Tonka Bean, Musk. Leather and oud are classic Arabian pairing.", ar: "سيكرت ليذر | شرقي | القمة: أوريس | القلب: جلد، سرو | القاعدة: تونكا، مسك." } },
      { slug: "dark-wood", rank: 4, pickReason: { en: "Woody Oud — Dark Wood | Woody | Bergamot, Cardamom, Cedarwood, Vetiver", ar: "عود خشبي — دارك وود" }, description: { en: "Dark Wood | Woody | Top: Bergamot | Heart: Caramel, Cardamom | Base: Cedarwood, Vetiver. Woody depth inspired by Arabian traditions.", ar: "دارك وود | خشبي | القمة: برغموت | القلب: كراميل، هيل | القاعدة: خشب أرز، فيتيفر." } },
      { slug: "patchouli-glow-perfume", rank: 5, pickReason: { en: "Earthy Oud — Patchouli Glow | Woody Oriental | Bergamot, Patchouli, Sandalwood, Amber", ar: "عود ترابي — باتشولي جلو" }, description: { en: "Patchouli Glow | Woody Oriental | Top: Bergamot | Heart: Patchouli, Sandalwood | Base: Amber, Musk. Earthy depth reminiscent of oud blends.", ar: "باتشولي جلو | خشبي شرقي | القمة: برغموت | القلب: باتشولي | القاعدة: عنبر، مسك." } },
    ],
    contentBlocks: [
      { heading: { en: "The Art of Arabian Oud", ar: "فن العود العربي" }, body: { en: "Oud (agarwood) is formed when Aquilaria trees are infected by a specific mold. The resin-saturated heartwood is then distilled into oud oil — one of the most expensive raw materials in perfumery. In the UAE and GCC, oud is deeply cultural and spiritual.", ar: "العود يتشكل عندما تصاب أشجار الأكويلاريا بعفن محدد. يُقطر خشب القلب المشبع بالراتنج إلى زيت العود — أحد أغلى المواد الخام في العطور." } },
    ],
    faqs: [
      { question: { en: "What is the best Arabian oud perfume?", ar: "ما هو أفضل عطر عود عربي؟" }, answer: { en: "Dark Musk with its Cypriol and Guaiac wood notes offers an oud-like experience. Royal Tobacco's incense heart is also deeply Arabian in character.", ar: "المسك الداكن بنفحات السيبريول وخشب الجواياك يقدم تجربة شبيهة بالعود." } },
    ],
    relatedGuideSlugs: ["best-perfumes-uae", "best-woody-perfumes", "best-perfumes-saudi-arabia"],
    publishedAt: "2025-03-05T00:00:00Z",
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
