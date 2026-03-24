// Category-specific SEO content displayed at the bottom of each category page
// Each category has unique content in both English and Arabic to avoid duplicate content issues

interface CategorySeoContent {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
}

export const categorySeoContent: Record<string, CategorySeoContent> = {
  perfumes: {
    title: {
      en: "Discover Aromatic Perfumes — Luxury Fragrances for Men & Women",
      ar: "اكتشف عطور أروماتيك — عطور فاخرة للرجال والنساء",
    },
    description: {
      en: "Explore the finest collection of aromatic perfumes at Aromatic Scents Lab. Our handcrafted perfumes feature premium ingredients including Arabian oud, musk, amber, and floral essences. Whether you prefer woody, oriental, or fresh scents, find the perfect fragrance for every occasion. Shop luxury perfumes in the UAE with free delivery on orders over 500 AED.",
      ar: "استكشف أرقى مجموعة من عطور أروماتيك في Aromatic Scents Lab. عطورنا المصنوعة يدوياً تتميز بمكونات فاخرة تشمل العود العربي والمسك والعنبر والأزهار. سواء كنت تفضل الروائح الخشبية أو الشرقية أو المنعشة، اعثر على العطر المثالي لكل مناسبة. تسوق العطور الفاخرة في الإمارات مع توصيل مجاني للطلبات فوق 500 درهم.",
    },
  },
  "perfumes-oils": {
    title: {
      en: "Aromatic Perfume Oils — Concentrated & Long-Lasting Scents",
      ar: "زيوت عطور أروماتيك — روائح مركزة وطويلة الأمد",
    },
    description: {
      en: "Experience the richness of aromatic perfume oils from Aromatic Scents Lab. Our concentrated fragrance oils are crafted from the finest natural ingredients, offering long-lasting scents that linger throughout the day. Perfect for those who appreciate deep, intense fragrances — from smoky oud and warm amber to fresh florals. Ideal for men and women seeking a good perfume at an affordable price in the UAE.",
      ar: "استمتع بغنى زيوت العطور الأروماتيكية من Aromatic Scents Lab. زيوتنا العطرية المركزة مصنوعة من أجود المكونات الطبيعية، وتوفر روائح تدوم طويلاً طوال اليوم. مثالية لمحبي العطور العميقة والمكثفة — من العود الدخاني والعنبر الدافئ إلى الأزهار المنعشة. مناسبة للرجال والنساء الباحثين عن عطر جيد بسعر مناسب في الإمارات.",
    },
  },
  "home-fragrances": {
    title: {
      en: "Aromatic Home Fragrances — Transform Your Space with Luxury Scents",
      ar: "معطرات منزل أروماتيك — حوّل مساحتك بروائح فاخرة",
    },
    description: {
      en: "Create a welcoming atmosphere with aromatic home fragrances from Aromatic Scents Lab. Our collection includes premium air fresheners, reed diffusers, and bakhoor incense handcrafted in the UAE. Fill your home with captivating scents of oud, sandalwood, rose, and vanilla. Perfect for gifting or elevating your everyday living space with pleasant aromatic fragrances.",
      ar: "اصنع أجواءً مرحبة مع معطرات المنزل الأروماتيكية من Aromatic Scents Lab. تشمل مجموعتنا معطرات الجو الفاخرة وموزعات العطر والبخور المصنوعة يدوياً في الإمارات. املأ منزلك بروائح آسرة من العود وخشب الصندل والورد والفانيلا. مثالية كهدايا أو لتحسين مساحة معيشتك اليومية بروائح أروماتيك مميزة.",
    },
  },
  "personal-care": {
    title: {
      en: "Aromatic Body Care — Protect & Nourish Your Skin with Fragrance",
      ar: "العناية بالجسم أروماتيك — احمِ وغذِّ بشرتك بالعطور",
    },
    description: {
      en: "Pamper your skin with aromatic body care products from Aromatic Scents Lab. Our collection features luxurious body lotions, hand & body lotions, and hair & body mists infused with premium fragrances. Protect your skin while enjoying long-lasting aromatic scents. Each product is carefully formulated to moisturize, nourish, and leave your skin beautifully scented throughout the day.",
      ar: "دللي بشرتك مع منتجات العناية بالجسم الأروماتيكية من Aromatic Scents Lab. تتضمن مجموعتنا لوشن الجسم الفاخر وكريم اليد والجسم وبخاخات الشعر والجسم المعطرة بعطور فاخرة. احمِ بشرتك مع الاستمتاع بروائح أروماتيك تدوم طويلاً. كل منتج مُصاغ بعناية لترطيب وتغذية بشرتك وتركها بعطر جميل طوال اليوم.",
    },
  },
  "gifts-set": {
    title: {
      en: "Aromatic Gift Boxes — Luxury Perfume Gift Sets for Every Occasion",
      ar: "علب هدايا أروماتيك — أطقم عطور فاخرة لكل مناسبة",
    },
    description: {
      en: "Surprise your loved ones with aromatic gift boxes from Aromatic Scents Lab. Our luxury perfume gift sets are beautifully packaged and perfect for birthdays, weddings, Eid, Ramadan, and special celebrations. Each gift box features a curated selection of our finest fragrances, body care products, and aromatic oils. Find the perfect affordable luxury gift set in the UAE.",
      ar: "فاجئ أحبائك بعلب هدايا أروماتيك من Aromatic Scents Lab. أطقم العطور الفاخرة لدينا مغلفة بشكل جميل ومثالية لأعياد الميلاد والزفاف والعيد ورمضان والمناسبات الخاصة. كل علبة هدية تتضمن مجموعة مختارة من أفضل عطورنا ومنتجات العناية بالجسم والزيوت العطرية. اعثر على طقم الهدية الفاخر المناسب بأسعار معقولة في الإمارات.",
    },
  },
  "fragrance-oils": {
    title: {
      en: "Aromatic Fragrance Oils — Pure & Natural Scented Oils",
      ar: "زيوت عطرية أروماتيك — زيوت معطرة نقية وطبيعية",
    },
    description: {
      en: "Indulge in the purest aromatic fragrance oils from Aromatic Scents Lab. Our scented oils capture the essence of natural ingredients — from deep woody oud and warm sandalwood to delicate rose and sweet vanilla. Each fragrance oil is concentrated for a long-lasting smell that evolves beautifully on your skin. A good perfume alternative for those who prefer oil-based fragrances. Shop aromatic oils in Dubai and the UAE.",
      ar: "انغمس في أنقى الزيوت العطرية الأروماتيكية من Aromatic Scents Lab. زيوتنا المعطرة تلتقط جوهر المكونات الطبيعية — من عطر العود الخشبي العميق وخشب الصندل الدافئ إلى الورد الرقيق والفانيلا الحلوة. كل زيت عطري مركز لرائحة تدوم طويلاً وتتطور بجمال على بشرتك. بديل ممتاز للعطور لمحبي العطور الزيتية. تسوق زيوت أروماتيك في دبي والإمارات.",
    },
  },
  "hair-body-mist": {
    title: {
      en: "Aromatic Hair & Body Mist — Light & Refreshing Fragrance Sprays",
      ar: "بخاخ الشعر والجسم أروماتيك — بخاخات عطرية خفيفة ومنعشة",
    },
    description: {
      en: "Refresh yourself with aromatic hair & body mists from Aromatic Scents Lab. Our lightweight fragrance sprays are designed to give you a subtle, pleasant scent throughout the day. Perfect for layering with your favorite perfume or wearing alone for a fresh aromatic touch. Gentle on hair and skin, these mists combine beautiful smells with nourishing care. Available for men and women in the UAE.",
      ar: "انتعش مع بخاخات الشعر والجسم الأروماتيكية من Aromatic Scents Lab. بخاخاتنا العطرية الخفيفة مصممة لمنحك رائحة ناعمة ومميزة طوال اليوم. مثالية للتنسيق مع عطرك المفضل أو للاستخدام بمفردها للحصول على لمسة أروماتيك منعشة. لطيفة على الشعر والبشرة، تجمع هذه البخاخات بين الروائح الجميلة والعناية المغذية. متوفرة للرجال والنساء في الإمارات.",
    },
  },
  "hand-body-lotion": {
    title: {
      en: "Aromatic Hand & Body Lotion — Moisturize & Protect Your Skin",
      ar: "لوشن اليد والجسم أروماتيك — رطب واحمِ بشرتك",
    },
    description: {
      en: "Nourish your skin with aromatic hand & body lotions from Aromatic Scents Lab. Our scented lotions deeply moisturize while leaving a luxurious, long-lasting fragrance on your skin. Formulated to protect your skin from dryness and keep it soft and hydrated throughout the day. Each lotion features premium aromatic scents — perfect for daily skincare and fragrance lovers in the UAE and Dubai.",
      ar: "غذِّ بشرتك مع لوشن اليد والجسم الأروماتيكي من Aromatic Scents Lab. لوشناتنا المعطرة ترطب بعمق مع ترك عطر فاخر يدوم طويلاً على بشرتك. مُصاغة لحماية بشرتك من الجفاف والحفاظ عليها ناعمة ورطبة طوال اليوم. كل لوشن يتميز بروائح أروماتيك فاخرة — مثالي للعناية اليومية بالبشرة ولمحبي العطور في الإمارات ودبي.",
    },
  },
  "air-fresheners": {
    title: {
      en: "Aromatic Air Fresheners — Fill Your Space with Captivating Scents",
      ar: "معطرات الجو أروماتيك — املأ مساحتك بروائح آسرة",
    },
    description: {
      en: "Elevate your environment with aromatic air fresheners from Aromatic Scents Lab. Our premium air fresheners are crafted with rich, natural ingredients to fill your home, office, or car with captivating aromatic scents. Choose from woody, floral, musky, and oriental fragrances that create the perfect ambiance. Long-lasting and elegant — the best air fresheners in the UAE.",
      ar: "ارتقِ بأجواء محيطك مع معطرات الجو الأروماتيكية من Aromatic Scents Lab. معطراتنا الفاخرة مصنوعة من مكونات طبيعية غنية لملء منزلك أو مكتبك أو سيارتك بروائح أروماتيك آسرة. اختر من الروائح الخشبية والزهرية والمسك والشرقية التي تخلق الأجواء المثالية. تدوم طويلاً وأنيقة — أفضل معطرات الجو في الإمارات.",
    },
  },
  "reed-diffusers": {
    title: {
      en: "Aromatic Reed Diffusers — Elegant Continuous Home Fragrance",
      ar: "موزعات العطر أروماتيك — عطر منزلي أنيق ومستمر",
    },
    description: {
      en: "Add a touch of luxury to any room with aromatic reed diffusers from Aromatic Scents Lab. Our elegant diffusers release a gentle, continuous fragrance that transforms your space without the need for flames or electricity. Available in a variety of aromatic scents including oud, rose, vanilla, and sandalwood. The perfect home fragrance solution for those who appreciate subtle, long-lasting pleasant smells.",
      ar: "أضف لمسة فخامة لأي غرفة مع موزعات العطر الأروماتيكية من Aromatic Scents Lab. موزعاتنا الأنيقة تنشر عطراً لطيفاً ومستمراً يحول مساحتك دون الحاجة للهب أو الكهرباء. متوفرة بمجموعة متنوعة من الروائح الأروماتيكية بما في ذلك العود والورد والفانيلا وخشب الصندل. الحل المثالي لعطر المنزل لمحبي الروائح الناعمة والتي تدوم طويلاً.",
    },
  },
};
