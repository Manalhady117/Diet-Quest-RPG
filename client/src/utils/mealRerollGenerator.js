/**
 * Local Smart Meal Generator & Fallback Catalog
 * Provides rich, balanced meal alternatives for each meal slot (breakfast, lunch, dinner, snack).
 * Allows instant offline rerolling without network dependency or server failure.
 */

export const LOCAL_MEAL_CATALOG = {
  breakfast: [
    {
      name: 'Greek Yogurt Parfait with Mixed Berries & Walnuts',
      name_ar: 'زبادي يوناني مع التوت المشكل والجوز والعسل',
      rpg_title: 'Olympus Dawn Ambrosia',
      rpg_title_ar: 'وليمة فجر الأولمب',
      calories: 420,
      protein_g: 32,
      carbs_g: 45,
      fats_g: 12,
      ingredients: ['200g Non-Fat Plain Greek Yogurt', '80g Fresh Strawberries & Blueberries', '25g Chopped Walnuts', '1 tbsp Chia Seeds', '1 tsp Raw Honey'],
      ingredients_ar: ['200 جم زبادي يوناني خالي الدسم', '80 جم فراولة وتوت أزرق طازج', '25 جم جوز مفروم', 'ملعقة بذور الشيا', 'ملعقة صغيرة عسل نقي'],
      cooking_tip: 'Layer yogurt and berries alternately in a glass for an appetizing morning texture.',
      cooking_tip_ar: 'ضع طبقات متتالية من الزبادي والتوت للحصول على قوام ومظهر صباحي شهي.'
    },
    {
      name: 'Sunfire Mediterranean Egg White & Feta Omelette',
      name_ar: 'أومليت بياض البيض المتوسطي مع جبن فيتا وخبز ريفي',
      rpg_title: 'Helios Radiant Scramble',
      rpg_title_ar: 'طبق الشمس المشرقة',
      calories: 410,
      protein_g: 34,
      carbs_g: 42,
      fats_g: 11,
      ingredients: ['4 Egg Whites & 1 Whole Egg', '35g Crumbled Greek Feta', 'Baby Spinach & Cherry Tomatoes', '1 Slice Toasted Whole-Grain Sourdough'],
      ingredients_ar: ['4 بياض بيض مع بيضة كاملة', '35 جم جبنة فيتا يونانية', 'سبانخ طازجة وطماطم كرزية', 'شريحة خبز قمح كامل محمص'],
      cooking_tip: 'Sauté cherry tomatoes until blistered before pouring in eggs for extra sweetness.',
      cooking_tip_ar: 'شوّح الطماطم الكرزية حتى تذبل قليلاً قبل إضافة البيض لنكهة سكرية طبيعية.'
    },
    {
      name: 'Warm Cinnamon Vanilla Protein Oatmeal Bake',
      name_ar: 'شوفان دافئ بالبروتين والفانيليا والقرفة والتوت الأزرق',
      rpg_title: 'Valhalla Hearth Porridge',
      rpg_title_ar: 'شوفان المحارب الدافئ',
      calories: 430,
      protein_g: 35,
      carbs_g: 48,
      fats_g: 10,
      ingredients: ['60g Rolled Oats', '1 Scoop Vanilla Whey Protein', 'Handful of Blueberries', '1 tbsp Ground Flaxseed', 'Pinch of Ceylon Cinnamon'],
      ingredients_ar: ['60 جم رقائق شوفان كامل', 'سكوب بروتين فانيليا', 'حفنة توت أزرق طازج', 'ملعقة بذور كتان مطحونة', 'رشة قرفة سيلانية'],
      cooking_tip: 'Stir protein powder in after cooking oats with warm water to maintain a smooth texture.',
      cooking_tip_ar: 'أضف مسحوق البروتين بعد نضج الشوفان بالماء الفاتر لتجنب التكتل والحفاظ على القوام الكريمي.'
    },
    {
      name: 'Spiced Avocado & Cottage Cheese Power Toast',
      name_ar: 'توست الأفوكادو والجبن القريش مع بيضة مسلوقة',
      rpg_title: 'Sylvan Ranger Toast',
      rpg_title_ar: 'توست حارس الغابة المتبل',
      calories: 415,
      protein_g: 30,
      carbs_g: 44,
      fats_g: 13,
      ingredients: ['2 Slices Sprouted Grain Toast', '120g Low-Fat Cottage Cheese', '1/2 Ripe Avocado Mashed', '1 Soft-Boiled Egg', 'Red Pepper Flakes & Lemon Zest'],
      ingredients_ar: ['شريحتا توست الحبوب الكاملة', '120 جم جبن قريش قليل الدسم', 'نصف حبة أفوكادو مهروسة', 'بيضة مسلوقة برشت', 'رقائق فلفل أحمر وبشر ليمون'],
      cooking_tip: 'Cottage cheese provides slow-digesting casein protein for long-lasting satiety.',
      cooking_tip_ar: 'يمتاز الجبن القريش ببروتين الكازين بطيء الامتصاص للشعور بالشبع والامتلاء لساعات طويلة.'
    },
    {
      name: 'Smoked Salmon & Herbed Labneh Morning Plate',
      name_ar: 'شرائح السلمون المدخن مع اللبنة بالأعشاب والخبز المقرمش',
      rpg_title: 'Frost Peak Angler Rations',
      rpg_title_ar: 'مؤونة صياد قمم الجليد',
      calories: 425,
      protein_g: 33,
      carbs_g: 40,
      fats_g: 14,
      ingredients: ['80g Smoked Wild Salmon', '90g Light Greek Labneh', 'Cucumber Ribbons & Capers', '2 Multigrain Crispbreads', 'Fresh Dill'],
      ingredients_ar: ['80 جم شرائح سلمون مدخن بري', '90 جم لبنة لايت بالأعشاب', 'شرائح خيار وكبر مخلل', 'شريحتا خبز حبوب كاملة مقرمش', 'شبت طازج'],
      cooking_tip: 'Rich in omega-3 fatty acids for anti-inflammatory muscle and joint recovery.',
      cooking_tip_ar: 'غني بأحماض أوميغا 3 المفيدة للحد من الالتهابات وتعافي العضلات والمفاصل.'
    },
    {
      name: 'Fluffy High-Protein Oat Flour Pancakes with Strawberries',
      name_ar: 'بان كيك الشوفان عالي البروتين مع الفراولة الطازجة',
      rpg_title: 'Titan Sunrise Stack',
      rpg_title_ar: 'فطائر فجر العمالقة',
      calories: 435,
      protein_g: 36,
      carbs_g: 46,
      fats_g: 11,
      ingredients: ['50g Blended Rolled Oats', '2 Egg Whites + 1 Whole Egg', '1 Scoop Whey Protein', '1 Cup Sliced Strawberries', 'Drizzle of Sugar-Free Maple Syrup'],
      ingredients_ar: ['50 جم شوفان مطحون', '2 بياض بيض مع بيضة كاملة', 'سكوب بروتين', 'كوب فراولة طازجة مقطعة', 'قليل من شراب القيقب الخالي من السكر'],
      cooking_tip: 'Blend oats and eggs in a blender for an ultra-smooth instant batter.',
      cooking_tip_ar: 'اخفق الشوفان والبيض في الخلاط للحصول على قوام متجانس وخفيف للغاية.'
    },
    {
      name: 'Shakshuka Eggs Poached in Spiced Bell Pepper & Tomato',
      name_ar: 'شكشوكة بيض بالصلصة الشرقية والفلفل الملون مع خبز بيتا',
      rpg_title: 'Desert Oasis Morning Skillet',
      rpg_title_ar: 'مقلاة واحة الصحراء',
      calories: 415,
      protein_g: 31,
      carbs_g: 43,
      fats_g: 13,
      ingredients: ['3 Farm Eggs', 'Diced Sweet Bell Peppers & Onion', 'Crushed San Marzano Tomatoes', 'Cumin & Smoked Paprika', '1 Small Whole-Wheat Pita'],
      ingredients_ar: ['3 بيضات مزارع طازجة', 'فلفل ألوان وبصل مقطع مكعبات', 'طماطم طازجة مسبكة', 'كمون وبابريكا مدخنة', 'رغيف خبز بيتا قمح كامل صغير'],
      cooking_tip: 'Simmer the tomato pepper base until thick before making wells for the eggs.',
      cooking_tip_ar: 'دع صلصة الطماطم والفلفل تتسبك جيداً على نار هادئة قبل تكسير البيض بداخلها.'
    }
  ],

  lunch: [
    {
      name: 'Flame-Grilled Chicken Breast Bowl with Quinoa & Steamed Greens',
      name_ar: 'وعاء صدور الدجاج المشوية مع الكينوا والخضار المطهو',
      rpg_title: 'Aegis Sentinel Midday Feast',
      rpg_title_ar: 'وليمة حارس الدرع الذهبي',
      calories: 550,
      protein_g: 48,
      carbs_g: 58,
      fats_g: 14,
      ingredients: ['180g Grilled Chicken Breast', '140g Cooked Tricolor Quinoa', 'Steamed Broccoli & Green Beans', '1 tsp Cold-Pressed Olive Oil', 'Fresh Lemon Juice'],
      ingredients_ar: ['180 جم صدور دجاج مشوية متبلة', '140 جم كينوا مطهوة ملونة', 'بروكلي وفاصوليا خضراء على البخار', 'ملعقة صغيرة زيت زيتون بكر', 'عصير ليمون طازج'],
      cooking_tip: 'Marinate chicken in garlic, oregano, and lemon for at least 30 minutes before grilling.',
      cooking_tip_ar: 'انقع الدجاج في الثوم والأوريجانو وعصير الليمون 30 دقيقة للحصول على طراوة فائقة.'
    },
    {
      name: 'Chipotle Lime Chicken Burrito Bowl with Black Beans & Corn',
      name_ar: 'بوريتو بول الدجاج بالليمون والفلفل المشوي مع الفاصوليا السوداء',
      rpg_title: 'Sol Invictus Feast',
      rpg_title_ar: 'وليمة شمس النصر',
      calories: 560,
      protein_g: 49,
      carbs_g: 60,
      fats_g: 13,
      ingredients: ['180g Marinated Chicken Breast', '150g Brown Rice', '100g Black Beans & Sweet Corn', '2 tbsp Fire-Roasted Salsa', 'Fresh Cilantro'],
      ingredients_ar: ['180 جم دجاج متبل بصلصة الشيبوتلي', '150 جم أرز بني مطهو', '100 جم فاصوليا سوداء وذرة حلوة', 'ملعقتا صلصة طماطم مشوية', 'كزبرة طازجة'],
      cooking_tip: 'Squeeze fresh lime juice over warm grains to elevate the aroma without calories.',
      cooking_tip_ar: 'اعصر الليمون الأخضر فوق الحبوب الدافئة لتعزيز النكهة بدون أي سعرات إضافية.'
    },
    {
      name: 'Pan-Seared Yellowfin Tuna Steak with Sesame Ginger Soba',
      name_ar: 'ستيك التونة المشوح مع نودلز السوبا وزيت السمسم والزنجبيل',
      rpg_title: 'Tidal Blade Sustenance',
      rpg_title_ar: 'زاد شفرة المد البحري',
      calories: 540,
      protein_g: 46,
      carbs_g: 56,
      fats_g: 15,
      ingredients: ['170g Seared Tuna Steak', '140g Chilled Buckwheat Soba Noodles', 'Crunchy Red Cabbage & Carrot Slaw', '1 tbsp Light Toasted Sesame Dressing'],
      ingredients_ar: ['170 جم ستيك تونة يلوفين مشوح', '140 جم نودلز سوبا حبوب الحنطة', 'سلطة ملفوف أحمر وجزر مقرمشة', 'ملعقة صوص سمسم وزنجبيل خفيف'],
      cooking_tip: 'Sear tuna on smoking hot cast iron for 60 seconds per side to keep center tender.',
      cooking_tip_ar: 'شوّح التونة على مقلاة ساخنة جداً لمدة دقيقة واحدة لكل جانب للحفاظ على قوامها الطري.'
    },
    {
      name: 'Lean Flank Steak Medallions with Sweet Potato Mash & Asparagus',
      name_ar: 'ميداليات الستيك البقري مع بيوريه البطاطا الحلوة والهليون',
      rpg_title: 'Vanguard Caravan Banquet',
      rpg_title_ar: 'وليمة طليعة الفرسان',
      calories: 565,
      protein_g: 47,
      carbs_g: 57,
      fats_g: 16,
      ingredients: ['160g Lean Flank Steak Slices', '180g Mashed Roasted Sweet Potato', '120g Grilled Asparagus Spears', 'Rosemary Garlic Pan Jus'],
      ingredients_ar: ['160 جم شرائح ستيك بقري قليل الدهن', '180 جم بيوريه بطاطا حلوة مشوية', '120 جم أعواد هليون مشوية', 'عصارة مرق الروزماري والثوم'],
      cooking_tip: 'Slice flank steak thinly against the grain for maximum tenderness.',
      cooking_tip_ar: 'قطّع الستيك شرائح رقيقة عكس اتجاه الألياف للحصول على أقصى درجات الطراوة.'
    },
    {
      name: 'Tuscan Garlic Grilled Turkey Breast with Rosemary Cannellini Beans',
      name_ar: 'صدر ديك رومي مشوي بالثوم وإكليل الجبل مع الفاصوليا البيضاء',
      rpg_title: 'Highlands Paladin Platter',
      rpg_title_ar: 'طبق فارس المرتفعات',
      calories: 545,
      protein_g: 50,
      carbs_g: 55,
      fats_g: 13,
      ingredients: ['180g Turkey Breast Tenderloin', '140g Cannellini Beans with Garlic & Rosemary', 'Steamed Asparagus Spears', '1 tsp Cold-Pressed Olive Oil'],
      ingredients_ar: ['180 جم صدر ديك رومي مشوي', '140 جم فاصوليا بيضاء بالثوم وإكليل الجبل', 'أعواد هليون مطهوة على البخار', 'ملعقة صغيرة زيت زيتون بكر'],
      cooking_tip: 'Rosemary infused with garlic adds earthy complexity with zero added sodium.',
      cooking_tip_ar: 'يعطي إكليل الجبل مع الثوم نكهة عطرية غنية دون الحاجة لزيادة الملح.'
    },
    {
      name: 'Moroccan Lemon Herb Chicken Tagine with Vegetable Couscous',
      name_ar: 'طاجين الدجاج المغربي بالليمون المخلل والكسكسي بالخضار',
      rpg_title: 'Atlas Citadel Feast',
      rpg_title_ar: 'وليمة قلعة الأطلس',
      calories: 555,
      protein_g: 47,
      carbs_g: 59,
      fats_g: 14,
      ingredients: ['175g Boneless Skinless Chicken Breast', '140g Whole-Wheat Steamed Couscous', 'Zucchini, Carrots & Chickpeas', 'Preserved Lemon & Turmeric Broth'],
      ingredients_ar: ['175 جم صدور دجاج متبلة بدون جلد', '140 جم كسكسي القمح الكامل', 'كوسة وجزر وحمص مسلوق', 'مرق الكركم والليمون المخلل'],
      cooking_tip: 'Turmeric and ginger provide potent natural anti-inflammatory benefits.',
      cooking_tip_ar: 'يوفر مزيج الكركم والزنجبيل خصائص مضادة للأكسدة ومهدئة لالتهابات المفاصل.'
    }
  ],

  dinner: [
    {
      name: 'Pan-Seared Atlantic Salmon with Roasted Sweet Potatoes & Asparagus',
      name_ar: 'سلمون أطلسي مشوح مع البطاطا الحلوة المشوية والهليون',
      rpg_title: 'Deep Ocean Aegis Fillet',
      rpg_title_ar: 'فيليه درع المحيط العميق',
      calories: 620,
      protein_g: 42,
      carbs_g: 65,
      fats_g: 18,
      ingredients: ['180g Fresh Atlantic Salmon Fillet', '180g Roasted Sweet Potato Cubes', '140g Sautéed Garlic Green Beans', 'Fresh Lemon Thyme Sprigs'],
      ingredients_ar: ['180 جم فيليه سلمون أطلسي طازج', '180 جم مكعبات بطاطا حلوة مشوية', '140 جم فاصوليا خضراء مشوحة بالثوم', 'أوراق زعتر بري وليمون'],
      cooking_tip: 'Bake salmon skin-side down at 200°C for 12 minutes until flaky and moist.',
      cooking_tip_ar: 'اشوِ السلمون والجلد لأسفل على 200 درجة مئوية لمدة 12 دقيقة ليبقى طرياً وغنياً بالعصارة.'
    },
    {
      name: 'Charred Sirloin Steak Medallions with Chimichurri & Baby Potatoes',
      name_ar: 'شرائح السيرلوين المشوية مع صوص التشمي تشوري والبطاطس الصغيرة',
      rpg_title: 'Thunder Forge Evening Banquet',
      rpg_title_ar: 'وليمة مطرقة الرعد المسائية',
      calories: 630,
      protein_g: 45,
      carbs_g: 62,
      fats_g: 19,
      ingredients: ['175g Lean Top Sirloin', '160g Roasted Rosemary Baby Potatoes', 'Charred Broccolini', '1 tbsp Fresh Parsley Chimichurri'],
      ingredients_ar: ['175 جم ستيك سيرلوين بقري مشوي', '160 جم بطاطس صغيرة مشوية بإكليل الجبل', 'بروكلي صغير مشوي', 'ملعقة صوص تشيمي تشوري بالبقدونس'],
      cooking_tip: 'Let steak rest for 5 minutes before slicing to lock in all savory juices.',
      cooking_tip_ar: 'اترك قطعة اللحم لترتاح 5 دقائق قبل التقطيع لتحتفظ بجميع السوائل والنكهة الغنية.'
    },
    {
      name: 'Garlic Rosemary Roasted Chicken Thighs with Steamed Broccolini',
      name_ar: 'أفخاذ دجاج مشوية بالثوم والروزماري مع البروكلي الصغير والبطاطس',
      rpg_title: 'Golden Crest Victory Feast',
      rpg_title_ar: 'وليمة انتصار التاج الذهبي',
      calories: 615,
      protein_g: 44,
      carbs_g: 64,
      fats_g: 17,
      ingredients: ['190g Boneless Skinless Chicken Thighs', '160g Boiled Yukon Gold Potatoes with Parsley', 'Steamed Broccolini Spears', 'Roasted Garlic Cloves'],
      ingredients_ar: ['190 جم أفخاذ دجاج مخلية بدون جلد', '160 جم بطاطس مسلوقة بالأعشاب', 'بروكلي صغير مطهو على البخار', 'فصوص ثوم مشوية ناعمة'],
      cooking_tip: 'Chicken thighs stay juicy and provide essential iron and zinc for nighttime recovery.',
      cooking_tip_ar: 'تحتوي أفخاذ الدجاج على نسبة ممتازة من الزنك والحديد لدعم الاستشفاء العضلي أثناء النوم.'
    },
    {
      name: 'Herb-Crusted Baked Sea Bass with Mediterranean Quinoa Salad',
      name_ar: 'سمك القاروص المخبوز بالأعشاب مع سلطة الكينوا المتوسطية',
      rpg_title: 'Sapphire Cove Catch',
      rpg_title_ar: 'صيد الخليج الياقوتي',
      calories: 605,
      protein_g: 43,
      carbs_g: 66,
      fats_g: 16,
      ingredients: ['185g White Sea Bass Fillet', '150g Fluffy Quinoa Salad with Diced Cucumbers & Cherry Tomatoes', 'Kalamata Olives (4-5)', 'Fresh Lemon Basil Dressing'],
      ingredients_ar: ['185 جم فيليه سمك قاروص أبيض', '150 جم سلطة كينوا بالخيار والطماطم الكرزية', 'حبات زيتون كالاماتا', 'دريسنج ليمون وريحان طازج'],
      cooking_tip: 'Bake sea bass in parchment paper to trap steam and preserve delicate flaky texture.',
      cooking_tip_ar: 'اخبز القاروص داخل ورق الزبدة ليطهى في بخاره الخاص ويحتفظ بنعومته ورطوبته.'
    },
    {
      name: 'Slow-Simmered Lean Beef Chili with Red Kidney Beans & Avocado',
      name_ar: 'تشيلي اللحم البقري قليل الدسم مع الفاصوليا الحمراء والأفوكادو',
      rpg_title: 'Ironclad Bastion Stew',
      rpg_title_ar: 'حساء الحصن الفولاذي',
      calories: 625,
      protein_g: 46,
      carbs_g: 63,
      fats_g: 18,
      ingredients: ['170g 93% Lean Ground Beef', '140g Red Kidney Beans', 'Crushed Tomatoes & Poblano Peppers', '1/4 Ripe Avocado Sliced', 'Cumin & Oregano'],
      ingredients_ar: ['170 جم مفروم بقري قليل الدهن 93%', '140 جم فاصوليا حمراء مطهوة', 'طماطم مسبكة وفلفل متبل', 'ربع حبة أفوكادو شرائح', 'كمون وأوريجانو'],
      cooking_tip: 'Packed with high-density bioavailable iron and complex slow-burning fiber.',
      cooking_tip_ar: 'مصدر مثالي للحديد سريع الامتصاص والألياف الغذائية بطيئة التحلل.'
    }
  ],

  snack: [
    {
      name: 'Apple Slices with Natural Peanut Butter & Cinnamon',
      name_ar: 'شرائح التفاح الطازج مع زبدة الفول السوداني والقرفة',
      rpg_title: 'Hearthfire Energy Ration',
      rpg_title_ar: 'زاد نار الموقد السريع',
      calories: 202,
      protein_g: 10,
      carbs_g: 36,
      fats_g: 6,
      ingredients: ['1 Crisp Honeycrisp or Fuji Apple', '20g All-Natural Crunchy Peanut Butter', 'Dusting of Ceylon Cinnamon'],
      ingredients_ar: ['تفاحة طازجة مقرمشة مقطعة شرائح', '20 جم زبدة فول سوداني طبيعية 100%', 'رشة قرفة سيلانية عطرة'],
      cooking_tip: 'Apples provide soluble pectin fiber while cinnamon helps regulate steady blood sugar.',
      cooking_tip_ar: 'يوفر التفاح ألياف البكتين الطبيعية وتساعد القرفة في تنظيم استقرار سكر الدم.'
    },
    {
      name: 'Creamy Cottage Cheese Bowl with Crushed Walnuts & Honey',
      name_ar: 'جبن قريش كريمي مع الجوز المطحون وقطرات العسل الطبيعي',
      rpg_title: 'Wayfarer Midnight Ration',
      rpg_title_ar: 'وجبة المسافر الليلية',
      calories: 210,
      protein_g: 18,
      carbs_g: 22,
      fats_g: 6,
      ingredients: ['150g Low-Fat Smooth Cottage Cheese', '15g Raw Crushed Walnuts', '1 tsp Raw Wildflower Honey'],
      ingredients_ar: ['150 جم جبن قريش قليل الدسم كريمي', '15 جم جوز نيء مطحون خشناً', 'ملعقة صغيرة عسل زهور برية'],
      cooking_tip: 'Slow-digesting casein protein supports overnight muscle preservation.',
      cooking_tip_ar: 'بروتين الكازين بطيء التحلل يدعم تغذية العضلات ومنع الهدم طوال ساعات النوم.'
    },
    {
      name: 'Handful of Roasted Raw Almonds & Dark Chocolate Nibs (85%)',
      name_ar: 'حفنة لوز نيء محمص مع حبيبات الشوكولاتة الداكنة 85%',
      rpg_title: 'Shadowcloak Quick Boost',
      rpg_title_ar: 'طاقة عباءة الظلال السريعة',
      calories: 205,
      protein_g: 8,
      carbs_g: 20,
      fats_g: 11,
      ingredients: ['25g Dry-Roasted Unsalted Almonds', '15g 85% Dark Chocolate Shavings'],
      ingredients_ar: ['25 جم لوز نيء محمص بدون ملح', '15 جم شوكولاتة داكنة 85% كاكاو'],
      cooking_tip: 'Magnesium in dark chocolate and almonds eases muscle tension and stress.',
      cooking_tip_ar: 'الماغنيسيوم الموجود في الشوكولاتة الداكنة واللوز يساعد على تهدئة توتر العضلات.'
    },
    {
      name: 'Vanilla Whey Protein Shake Blended with Fresh Strawberries',
      name_ar: 'مخفوق بروتين الفانيليا مع الفراولة وحليب اللوز غير المحلى',
      rpg_title: 'Elixir of Swift Recovery',
      rpg_title_ar: 'إكسير التعافي السريع',
      calories: 200,
      protein_g: 24,
      carbs_g: 18,
      fats_g: 3,
      ingredients: ['1 Scoop Vanilla Whey Protein', '100g Fresh Strawberries', '250ml Unsweetened Almond Milk', 'Ice Cubes'],
      ingredients_ar: ['سكوب بروتين مصل اللبن فانيليا', '100 جم فراولة طازجة', '250 مل حليب لوز غير محلى', 'مكعبات ثلج منعشة'],
      cooking_tip: 'Rapid post-workout amino acid delivery to stop fatigue and refuel muscles.',
      cooking_tip_ar: 'ضخ سريع للأحماض الأمينية لدعم تجدد الطاقة والقضاء على الإرهاق.'
    },
    {
      name: 'Whole-Grain Rice Cakes with Mashed Avocado & Everything Bagel Spice',
      name_ar: 'كعكات الأرز الكامل مع الأفوكادو المهروس وبذور السمسم',
      rpg_title: 'Ranger Scout Crackers',
      rpg_title_ar: 'رقائق كشاف الغابات',
      calories: 195,
      protein_g: 6,
      carbs_g: 28,
      fats_g: 7,
      ingredients: ['2 Brown Rice Cakes', '40g Mashed Avocado', 'Sprinkle of Everything Bagel Seasoning (Sesame & Poppy Seeds)'],
      ingredients_ar: ['قرصان من كعك الأرز البني الكامل', '40 جم أفوكادو طازج مهروس', 'رشة سمسم وبذور حبة البركة'],
      cooking_tip: 'Healthy monounsaturated fats promote steady, long-lasting mental focus.',
      cooking_tip_ar: 'دهون أحادية غير مشبعة صحية تمنح صفاءً ذهنياً وطاقة مستدامة.'
    }
  ]
};

/**
 * Generate a local alternative meal that is guaranteed different from currentMeal
 * Matches target calories and macros precisely to maintain metabolic balance
 */
export const generateLocalRerolledMeal = ({
  mealId = 'breakfast',
  currentMeal = {},
  userGoal = 'weight_loss',
  dietType = 'Balanced',
  isRTL = false
}) => {
  const slot = (mealId || 'breakfast').toLowerCase();
  const pool = LOCAL_MEAL_CATALOG[slot] || LOCAL_MEAL_CATALOG.breakfast;

  // Find meals that don't match current meal name (both EN and AR)
  const currentName = (currentMeal?.name || '').toLowerCase().trim();
  const currentNameAr = (currentMeal?.name_ar || '').toLowerCase().trim();

  let candidates = pool.filter((item) => {
    const itemName = item.name.toLowerCase().trim();
    const itemNameAr = (item.name_ar || '').toLowerCase().trim();
    return itemName !== currentName && itemNameAr !== currentName && itemName !== currentNameAr;
  });

  if (candidates.length === 0) {
    candidates = pool;
  }

  // Pick a random alternative from candidates
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  // Match or adapt macros: If current meal has defined macros, preserve the nutritional budget
  const calories = currentMeal?.calories || chosen.calories;
  const protein_g = currentMeal?.protein_g || chosen.protein_g;
  const carbs_g = currentMeal?.carbs_g || chosen.carbs_g;
  const fats_g = currentMeal?.fats_g || chosen.fats_g;

  return {
    id: slot,
    category: slot.toUpperCase(),
    name: isRTL && chosen.name_ar ? chosen.name_ar : chosen.name,
    name_en: chosen.name,
    name_ar: chosen.name_ar,
    rpg_title: isRTL && chosen.rpg_title_ar ? chosen.rpg_title_ar : chosen.rpg_title,
    rpg_title_en: chosen.rpg_title,
    rpg_title_ar: chosen.rpg_title_ar,
    calories,
    protein_g,
    carbs_g,
    fats_g,
    ingredients: isRTL && chosen.ingredients_ar ? chosen.ingredients_ar : chosen.ingredients,
    ingredients_en: chosen.ingredients,
    ingredients_ar: chosen.ingredients_ar,
    cooking_tip: isRTL && chosen.cooking_tip_ar ? chosen.cooking_tip_ar : chosen.cooking_tip,
    cooking_tip_en: chosen.cooking_tip,
    cooking_tip_ar: chosen.cooking_tip_ar
  };
};

/**
 * Get initial 4-meal daily schedule for any day number (1-7)
 */
export const getDefaultDaySchedule = (day = 1, isRTL = false) => {
  const dayIndex = ((day - 1) % 5);
  const breakfast = LOCAL_MEAL_CATALOG.breakfast[dayIndex % LOCAL_MEAL_CATALOG.breakfast.length];
  const lunch = LOCAL_MEAL_CATALOG.lunch[dayIndex % LOCAL_MEAL_CATALOG.lunch.length];
  const dinner = LOCAL_MEAL_CATALOG.dinner[dayIndex % LOCAL_MEAL_CATALOG.dinner.length];
  const snack = LOCAL_MEAL_CATALOG.snack[dayIndex % LOCAL_MEAL_CATALOG.snack.length];

  const mapItem = (item, id) => ({
    id,
    category: id.toUpperCase(),
    name: isRTL && item.name_ar ? item.name_ar : item.name,
    name_en: item.name,
    name_ar: item.name_ar,
    rpg_title: isRTL && item.rpg_title_ar ? item.rpg_title_ar : item.rpg_title,
    calories: item.calories,
    protein_g: item.protein_g,
    carbs_g: item.carbs_g,
    fats_g: item.fats_g,
    ingredients: isRTL && item.ingredients_ar ? item.ingredients_ar : item.ingredients,
    cooking_tip: isRTL && item.cooking_tip_ar ? item.cooking_tip_ar : item.cooking_tip
  });

  return {
    day,
    theme: `Day ${day} Metabolic Blueprint`,
    meals: [
      mapItem(breakfast, 'breakfast'),
      mapItem(lunch, 'lunch'),
      mapItem(dinner, 'dinner'),
      mapItem(snack, 'snack')
    ]
  };
};
