// Comprehensive bilingual mock diet database with 20 distinct meal options across categories
export const CUISINE_MOCK_DATA = {
  "Egyptian Cuisine": {
    breakfast: [
      {
        id: "egy_b_1",
        title_en: "Shakshuka Eggs Poached in Spiced Bell Pepper & Tomato",
        title_ar: "شكشوكة بيض مطهوة بالطماطم والفلفل الحلو والأعشاب",
        prepTime_en: "12m",
        prepTime_ar: "١٢ دقيقة",
        cookTime_en: "18m",
        cookTime_ar: "١٨ دقيقة",
        ingredients_en: [
          "3 Farm Eggs",
          "Diced Sweet Bell Peppers & Onion",
          "Crushed Tomatoes",
          "Cumin & Smoked Paprika",
          "1 Small Whole-Wheat Pita"
        ],
        ingredients_ar: [
          "٣ حبات بيض طازج",
          "فلفل حلو ومكعبات بصل",
          "طماطم معصورة",
          "كمون وبابريكا مدخنة",
          "١ رغيف خبز سن صغير"
        ],
        cookingSteps_en: [
          "Preheat cooking skillet over medium heat with a light coat of olive oil spray.",
          "Sauté peppers and onions until soft, then stir in crushed tomatoes and spices.",
          "Make small wells in the sauce, crack eggs directly inside, and cover for 8-10 minutes.",
          "Serve warm with whole-wheat pita."
        ],
        cookingSteps_ar: [
          "سخني المقلاة على نار متوسطة مع رش القليل من رذاذ زيت الزيتون.",
          "شوحي الفلفل والبصل حتى يطريا، ثم أضيفي الطماطم المعصورة والتوابل.",
          "اصنعي فجوات صغيرة في الصلصة واكسري البيض بها، ثم غطي المقلاة لمدة ٨-١٠ دقائق.",
          "يُقدم دافئاً مع الخبز السن."
        ],
        protein: "34g",
        carbs: "54g",
        fats: "13g",
        kcal: 470
      },
      {
        id: "egy_b_2",
        title_en: "Egyptian Ful Medames with Olive Oil, Cumin & Lemon",
        title_ar: "فول مدمس مصري بزيت الزيتون والكمون والليمون",
        prepTime_en: "5m",
        prepTime_ar: "٥ دقائق",
        cookTime_en: "10m",
        cookTime_ar: "١٠ دقائق",
        ingredients_en: [
          "1.5 cups Slow-Cooked Fava Beans",
          "1 tbsp Extra Virgin Olive Oil",
          "Fresh Squeezed Lemon Juice",
          "Ground Cumin & Sea Salt",
          "1 Whole Wheat Baladi Bread"
        ],
        ingredients_ar: [
          "كوب ونصف فول مدمس مسلوق",
          "ملعقة كبيرة زيت زيتون بكر",
          "عصير ليمون طازج",
          "كمون مطحون وملح بحري",
          "رغيف خبز بلدي حبة كاملة"
        ],
        cookingSteps_en: [
          "Warm fava beans gently in a pot and mash slightly with a fork.",
          "Fold in extra virgin olive oil, cumin, lemon juice, and a pinch of salt.",
          "Garnish with chopped fresh parsley and serve alongside warm baladi bread."
        ],
        cookingSteps_ar: [
          "سخني الفول في قدر واهرسيه قليلاً بالشوكة.",
          "أضيفي زيت الزيتون والكمون وعصير الليمون والملح.",
          "زينيه بالبقدونس المفروم وقدميه مع الخبز البلدي."
        ],
        protein: "22g",
        carbs: "58g",
        fats: "11g",
        kcal: 410
      },
      {
        id: "egy_b_3",
        title_en: "Baked Taameya (Egyptian Falafel) with Sesame & Tahini",
        title_ar: "طعمية مصرية مخبوزة بالسمسم مع سلطة طحينة خفيفة",
        prepTime_en: "10m",
        prepTime_ar: "١٠ دقائق",
        cookTime_en: "15m",
        cookTime_ar: "١٥ دقيقة",
        ingredients_en: [
          "Fava Bean Herb Patties with Sesame",
          "1 tbsp Light Tahini Lemon Dressing",
          "Sliced Cucumbers and Tomatoes",
          "1 Whole Grain Pita Pocket"
        ],
        ingredients_ar: [
          "أقراص طعمية فول وأعشاب بالسمسم",
          "ملعقة طحينة لايت بالليمون",
          "شرائح خيار وطماطم طازجة",
          "خبز سن حبة كاملة"
        ],
        cookingSteps_en: [
          "Bake or air-fry patties at 200°C for 14-16 minutes until golden and crisp.",
          "Whisk tahini with lemon juice and ice water until smooth.",
          "Stuff warm pita with baked taameya, fresh greens, and tahini drizzle."
        ],
        cookingSteps_ar: [
          "اخبزي الطعمية في الفرن أو القلاية الهوائية على حرارة ٢٠٠ مئوية لمدة ١٥ دقيقة حتى تقرمش.",
          "اخلطي الطحينة بالليمون وقليل من الماء حتى تتجانس.",
          "احشي الخبز بالطعمية المقرمشة والخضار ورشة الطحينة."
        ],
        protein: "26g",
        carbs: "49g",
        fats: "12g",
        kcal: 395
      },
      {
        id: "egy_b_4",
        title_en: "Areesh Cottage Cheese with Nigella Seeds & Diced Tomatoes",
        title_ar: "جبنة قريش قروية بحبة البركة وزيت الزيتون والطماطم",
        prepTime_en: "5m",
        prepTime_ar: "٥ دقائق",
        cookTime_en: "0m",
        cookTime_ar: "بدون طهي",
        ingredients_en: [
          "200g Fresh Areesh Cheese",
          "1 tsp Nigella Seeds (Black Seed)",
          "1 Diced Vine Tomato & Sweet Pepper",
          "1 tsp Cold-Pressed Olive Oil"
        ],
        ingredients_ar: [
          "٢٠٠ جم جبنة قريش طازجة خالية من الدسم",
          "ملعقة صغيرة حبة البركة",
          "طماطم وفلفل رومي مقطع",
          "ملعقة صغيرة زيت زيتون"
        ],
        cookingSteps_en: [
          "Crumble fresh areesh cheese into a ceramic bowl.",
          "Toss with diced vegetables, nigella seeds, and aromatic olive oil.",
          "Enjoy fresh with crunchy cucumber slices or bran toast."
        ],
        cookingSteps_ar: [
          "اهرسي الجبنة القريش في وعاء.",
          "اخلطي معها الخضار المقطع وحبة البركة وزيت الزيتون.",
          "تناوليها مع الخيار المقرمش أو توست الردة."
        ],
        protein: "32g",
        carbs: "18g",
        fats: "7g",
        kcal: 260
      },
      {
        id: "egy_b_5",
        title_en: "Boiled Eggs with Dukkah Spiced Dip & Whole Wheat Toast",
        title_ar: "بيض مسلوق متبل بالدقة المصرية وتوست الحبوب الكاملة",
        prepTime_en: "5m",
        prepTime_ar: "٥ دقائق",
        cookTime_en: "9m",
        cookTime_ar: "٩ دقائق",
        ingredients_en: [
          "3 Soft/Hard-Boiled Organic Eggs",
          "2 tbsp Toasted Egyptian Dukkah (Coriander & Cumin Nuts)",
          "2 Slices Whole Grain Toast",
          "Fresh Rocket Leaves"
        ],
        ingredients_ar: [
          "٣ بيضات مسلوقة جيدة التسوية",
          "ملعقتان دقة مصرية محمصة بالسمسم والكمون",
          "شريحتا توست الحبوب الكاملة",
          "أوراق جرجير بلدي طازج"
        ],
        cookingSteps_en: [
          "Boil farm eggs in simmering water for 8-9 minutes and transfer to an ice bath.",
          "Peel eggs, slice in half, and generously dust with dukkah spice blend.",
          "Serve alongside toasted grain bread and peppery rocket."
        ],
        cookingSteps_ar: [
          "اسلقي البيض في ماء مغلي لمدة ٨-٩ دقائق ثم ضعيه في ماء مثلج لسهولة التقشير.",
          "قشري البيض وقطعيه أنصافاً ورشّيه بالدقة الغنية بالنكهات.",
          "قدميه مع التوست المحمص وأوراق الجرجير."
        ],
        protein: "24g",
        carbs: "30g",
        fats: "14g",
        kcal: 340
      }
    ],
    lunch: [
      {
        id: "egy_l_1",
        title_en: "Chargrilled Chicken Shish Tawook with Bulgur Pilaf",
        title_ar: "شيش طاووق دجاج مشوي مع برغل مفلفل بالأعشاب",
        prepTime_en: "15m",
        prepTime_ar: "١٥ دقيقة",
        cookTime_en: "20m",
        cookTime_ar: "٢٠ دقيقة",
        ingredients_en: [
          "220g Marinated Chicken Breast Skewers",
          "1 cup Coarse Bulgur Steamed with Onion & Spices",
          "Grilled Peppers & Charred Onions",
          "2 tbsp Light Yogurt Garlic Dip"
        ],
        ingredients_ar: [
          "٢٢٠ جم صدور دجاج متبلة ومقطعة للشواء",
          "كوب برغل خشن مطهو بالبصل والتوابل",
          "فلفل حلو وبصل مشوي على الفحم",
          "ملعقتان صوص زبادي بالثوم والليمون"
        ],
        cookingSteps_en: [
          "Thread marinated chicken breast cubes onto skewers with peppers.",
          "Grill on high heat for 12-15 minutes, turning occasionally until smoky and charred.",
          "Fluff warm bulgur pilaf with a fork and serve chicken skewers on top with yogurt dip."
        ],
        cookingSteps_ar: [
          "شكي مكعبات الدجاج المتبلة في أسياخ مع قطع الفلفل والبصل.",
          "اشوي على نار عالية لمدة ١٢-١٥ دقيقة مع التقليب حتى تأخذ لوناً مشوياً رائعاً.",
          "اسكبي البرغل المفلفل في الطبق وضعي فوقه الأسياخ مع صوص الزبادي."
        ],
        protein: "52g",
        carbs: "55g",
        fats: "9g",
        kcal: 510
      },
      {
        id: "egy_l_2",
        title_en: "Egyptian Molokhia Stew with Lean Roasted Rabbit & Rice",
        title_ar: "ملوخية خضراء مصرية بالأرانب المشوية وأرز بسمتي",
        prepTime_en: "15m",
        prepTime_ar: "١٥ دقيقة",
        cookTime_en: "25m",
        cookTime_ar: "٢٥ دقيقة",
        ingredients_en: [
          "Fresh Minced Molokhia Leaves with Aromatic Coriander Taqsha",
          "200g Lean Tender Roasted Rabbit/Chicken",
          "3/4 cup Steamed White Basmati Rice",
          "Lemon Wedges & Spiced Tomato Salad"
        ],
        ingredients_ar: [
          "ملوخية خضراء طازجة بطشة الثوم والكزبرة الجافة",
          "٢٠٠ جم لحم أرنب أو دجاج خالي من الدهون محمر بالفرن",
          "ثلاثة أرباع كوب أرز بسمتي مسلوق",
          "شرائح ليمون وسلطة خضراء بلدية"
        ],
        cookingSteps_en: [
          "Simmer rich seasoned bone broth and whisk in finely minced fresh molokhia.",
          "Prepare garlic-coriander taqsha in a tiny dab of ghee until golden and stir in.",
          "Roast lean protein until caramelized and serve alongside fragrant rice."
        ],
        cookingSteps_ar: [
          "سخني المرقة الغنية واسكبي الملوخية المخرومة مع الخفق المستمر.",
          "حمري الثوم مع الكزبرة في قليل من السمن حتى تفوح الرائحة واشهقي الطشة.",
          "حمري اللحم بالفرن وقدمي الطبق مع الأرز وقطرات الليمون."
        ],
        protein: "48g",
        carbs: "45g",
        fats: "8g",
        kcal: 440
      },
      {
        id: "egy_l_3",
        title_en: "Oven Baked Sea Bass Sayadieh with Red Onion Rice",
        title_ar: "صيادية سمك قاروص مشوي بالفرن مع أرز بني صيادية",
        prepTime_en: "12m",
        prepTime_ar: "١٢ دقيقة",
        cookTime_en: "22m",
        cookTime_ar: "٢٢ دقيقة",
        ingredients_en: [
          "250g Fresh Sea Bass Fillet with Cumin & Garlic",
          "1 cup Sayadieh Spiced Rice with Caramelized Onion",
          "Fresh Parsley & Toasted Pine Nuts",
          "Egyptian Tahini Citrus Salad"
        ],
        ingredients_ar: [
          "٢٥٠ جم فيليه سمك قاروص طازج متبل بالكمون والثوم والليمون",
          "كوب أرز بني صيادية بالبصل المكرمل",
          "بقدونس طازج ورشة صنوبر محمص",
          "سلطة طحينة خفيفة بالليمون"
        ],
        cookingSteps_en: [
          "Season sea bass fillet with cumin, lemon juice, garlic, and sea salt.",
          "Bake in preheated oven at 190°C for 18 minutes until tender and flaky.",
          "Spoon onto bed of caramelized onion rice and top with fresh herbs."
        ],
        cookingSteps_ar: [
          "تبلي فيليه السمك بالثوم والكمون والليمون ورشة الملح.",
          "اخبزيه بالفرن على حرارة ١٩٠ مئوية لمدة ١٨ دقيقة حتى ينضج ويطرى.",
          "ضعيه فوق أرز الصيادية وزينيه بالبقدونس والصنوبر."
        ],
        protein: "46g",
        carbs: "52g",
        fats: "10g",
        kcal: 480
      },
      {
        id: "egy_l_4",
        title_en: "Lean Beef Kofta with Roasted Vegetables & Tahini",
        title_ar: "كفتة حاتي لحم بتلو مشوية مع خضار سوتيه وطحينة",
        prepTime_en: "15m",
        prepTime_ar: "١٥ دقيقة",
        cookTime_en: "16m",
        cookTime_ar: "١٦ دقيقة",
        ingredients_en: [
          "200g Lean Ground Beef (95/5) with Parsley & Onion",
          "Grilled Zucchini, Bell Peppers, and Tomatoes",
          "1 Whole Wheat Baladi Bread",
          "1 tbsp Tahini Sauce"
        ],
        ingredients_ar: [
          "٢٠٠ جم لحم بتلو مفروم قليل الدسم بالبصل والبقدونس والتوابل",
          "كوسة وفلفل وطماطم مشوية على الجريل",
          "رغيف خبز بلدي أسمر",
          "ملعقة طحينة بيضاء خفيفة"
        ],
        cookingSteps_en: [
          "Form seasoned beef into finger-length kofta cylinders onto skewers.",
          "Char-grill for 12-14 minutes, turning for even color.",
          "Serve steaming hot over fresh parsley inside whole wheat baladi bread."
        ],
        cookingSteps_ar: [
          "شكلي اللحم المتبل على أسياخ خشبية أو معدنية.",
          "اشوي على الجريل لمدة ١٢-١٤ دقيقة مع التقليب المنتظم.",
          "قدميها على فرشة من البقدونس مع الخبز والخضار المشوي."
        ],
        protein: "44g",
        carbs: "42g",
        fats: "14g",
        kcal: 470
      },
      {
        id: "egy_l_5",
        title_en: "High-Protein Lentil Koshary with Chickpeas & Tangy Daqqa",
        title_ar: "كشري مصري غني بالبروتين مع عدس بني وحمص ودقة خل وثوم",
        prepTime_en: "10m",
        prepTime_ar: "١٠ دقائق",
        cookTime_en: "20m",
        cookTime_ar: "٢٠ دقيقة",
        ingredients_en: [
          "1.5 cups Brown Lentils & Chickpeas Combo",
          "1/2 cup Whole Grain Macaroni & Brown Rice",
          "Rich Spiced Tomato Sauce & Crispy Baked Onions",
          "Garlic-Cumin Vinegar Daqqa"
        ],
        ingredients_ar: [
          "كوب ونصف عدس بني وحمص شام مسلوقين",
          "نصف كوب مكرونة حبوب كاملة وأرز بني",
          "صلصة طماطم مسبكة وبصل مقرمش بالفرن",
          "دقة خل وثوم وكمون"
        ],
        cookingSteps_en: [
          "Layer brown rice and pasta, then pile high with protein-rich lentils and chickpeas.",
          "Ladle warm spiced tomato sauce over the grain bowl.",
          "Finish with crispy oven-baked onions and a splash of garlic vinegar daqqa."
        ],
        cookingSteps_ar: [
          "ضعي طبقة الأرز والمكرونة وضاعفي كمية العدس والحمص لرفع البروتين.",
          "اسكبي صلصة الطماطم الغنية بالكمون والشطة الخفيفة.",
          "زيني بالبصل المخبوز ورشة الدقة اللذيذة."
        ],
        protein: "32g",
        carbs: "84g",
        fats: "6g",
        kcal: 520
      }
    ],
    dinner: [
      {
        id: "egy_d_1",
        title_en: "Lemony Lentil Soup with Cumin & Crispy Whole Wheat Croutons",
        title_ar: "شوربة عدس أصفر بالليمون والكمون ومكعبات خبز محمص",
        prepTime_en: "10m",
        prepTime_ar: "١٠ دقائق",
        cookTime_en: "20m",
        cookTime_ar: "٢٠ دقيقة",
        ingredients_en: [
          "1.5 cups Yellow Coral Lentils with Carrots & Celery",
          "Cumin, Turmeric & Fresh Squeezed Lemon",
          "Air-Fried Whole Grain Bread Cubes",
          "Fresh Green Spring Onions"
        ],
        ingredients_ar: [
          "كوب ونصف عدس أصفر مطهو بالجزر والكرفس والطماطم",
          "كمون وكركم وعصير ليمون بلدي طازج",
          "مكعبات خبز سن محمصة بالقلاية الهوائية",
          "بصل أخضر وجرجير طازج"
        ],
        cookingSteps_en: [
          "Blend simmered yellow lentils, carrots, and aromatics until velvety smooth.",
          "Season with golden turmeric, toasted cumin, sea salt, and generous lemon.",
          "Serve piping hot sprinkled with whole grain croutons."
        ],
        cookingSteps_ar: [
          "اخلطي العدس المسلوق مع الجزر والخضار في الخلاط حتى تحصلي على قوام حريري.",
          "تبلي بالكمون والكركم وعصير الليمون والملح.",
          "اسكبي الشوربة وزينيها بمكعبات الخبز المحمص المقرمشة."
        ],
        protein: "28g",
        carbs: "54g",
        fats: "4g",
        kcal: 360
      },
      {
        id: "egy_d_2",
        title_en: "Grilled Halloumi & Roasted Vegetable Warm Salad",
        title_ar: "سلطة جبنة حلوم مشوية دافئة مع خضار مشكل ودبس الرمان",
        prepTime_en: "8m",
        prepTime_ar: "٨ دقائق",
        cookTime_en: "10m",
        cookTime_ar: "١٠ دقائق",
        ingredients_en: [
          "120g Light Grilling Halloumi Slices",
          "Baby Spinach, Rocket & Cherry Tomatoes",
          "Grilled Eggplant & Zucchini Ribbons",
          "Pomegranate Molasses Dressing"
        ],
        ingredients_ar: [
          "١٢٠ جم شرائح جبن حلوم لايت مشوية",
          "أوراق سبانخ بيبي وجرجير وطماطم كرزية",
          "شرائح باذنجان وكوسة مشوية",
          "تتبيلة زيت زيتون ودبس رمان خفيف"
        ],
        cookingSteps_en: [
          "Sear halloumi slices in a hot non-stick skillet for 2 minutes per side until golden.",
          "Toss tender grilled greens and zucchini ribbons with pomegranate dressing.",
          "Top fresh salad bowl with warm grilled cheese."
        ],
        cookingSteps_ar: [
          "اشوي شرائح الحلوم في مقلاة ساخنة دقيقتين لكل جانب حتى تأخذ علامات الشواء.",
          "اخلطي الخضروات الورقية والباذنجان المشوي مع التتبيلة.",
          "رتبي الحلوم الدافئ على الوجه وقدمي السلطة فوراً."
        ],
        protein: "26g",
        carbs: "22g",
        fats: "16g",
        kcal: 335
      },
      {
        id: "egy_d_3",
        title_en: "Mediterranean Herb Omelet with Feta & Olives",
        title_ar: "عجة بيض متوسطية بالأعشاب الطازجة والجبن والزيتون",
        prepTime_en: "6m",
        prepTime_ar: "٦ دقائق",
        cookTime_en: "8m",
        cookTime_ar: "٨ دقائق",
        ingredients_en: [
          "3 Whole Eggs whisked with Dill & Parsley",
          "40g Crumbled Low-Sodium Feta",
          "Sliced Kalamata Olives & Cherry Tomatoes",
          "1 Slice Spelt Sourdough"
        ],
        ingredients_ar: [
          "٣ بيضات طازجة مخفوقة بالشبت والبقدونس",
          "٤٠ جم جبنة فيتا قليلة الملح",
          "حبات زيتون كالاماتا وطماطم كرزية",
          "شريحة خبز حبوب كاملة محمص"
        ],
        cookingSteps_en: [
          "Whisk farm eggs with chopped dill, parsley, and cracked black pepper.",
          "Pour into warm non-stick pan, scatter feta and olives over the top.",
          "Fold in half once edges set and serve warm with toasted bread."
        ],
        cookingSteps_ar: [
          "اخفقي البيض مع الأعشاب الخضراء والفلفل الأسود.",
          "اسكبي في المقلاة ورشي الفيتا وحلقات الزيتون والطماطم.",
          "اطوي العجة نصفين عند النضج وقدميها ساخنة مع التوست."
        ],
        protein: "27g",
        carbs: "19g",
        fats: "14g",
        kcal: 310
      },
      {
        id: "egy_d_4",
        title_en: "Steamed Salmon Fillet with Garlic Dill Labneh",
        title_ar: "فيليه سلمون مطهو بالبخار مع لبنة بالثوم والشبت",
        prepTime_en: "8m",
        prepTime_ar: "٨ دقائق",
        cookTime_en: "12m",
        cookTime_ar: "١٢ دقيقة",
        ingredients_en: [
          "180g Fresh Norwegian Salmon Fillet",
          "2 tbsp Low-Fat Labneh with Lemon & Fresh Dill",
          "Steamed Asparagus Spears & Baby Carrots",
          "Sea Salt & Coarse Black Pepper"
        ],
        ingredients_ar: [
          "١٨٠ جم فيليه سلمون نرويجي طازج",
          "ملعقتان لبنة لايت بالليمون والشبت الطازج",
          "هليون وجزر بيبي مطهو على البخار",
          "ملح بحري وفلفل أسود مجروش"
        ],
        cookingSteps_en: [
          "Season salmon lightly and steam or bake wrapped in parchment paper for 12 minutes.",
          "Whisk labneh with lemon juice, sea salt, and fresh minced dill.",
          "Place salmon over tender steamed vegetables and spoon dill labneh over the top."
        ],
        cookingSteps_ar: [
          "تبلي السلمون واطهيه بالبخار أو مغلفاً بورق الزبدة لمدة ١٢ دقيقة.",
          "اخلطي اللبنة مع الليمون والشبت وقليل من الملح.",
          "ضعي السلمون فوق الخضار واسكبي صوص اللبنة البارد فوقه."
        ],
        protein: "38g",
        carbs: "14g",
        fats: "15g",
        kcal: 345
      },
      {
        id: "egy_d_5",
        title_en: "Tender Turkey Breast Wrap with Cucumber Mint Tzatziki",
        title_ar: "راب صدور ديك رومي مشوية مع صوص زبادي بالخيار والنعناع",
        prepTime_en: "6m",
        prepTime_ar: "٦ دقائق",
        cookTime_en: "6m",
        cookTime_ar: "٦ دقائق",
        ingredients_en: [
          "160g Sliced Roasted Turkey Breast",
          "1 Whole Wheat Flaxseed Flatbread",
          "Greek Yogurt Cucumber & Mint Tzatziki",
          "Crisp Romaine Lettuce Leaves"
        ],
        ingredients_ar: [
          "١٦٠ جم شرائح صدور رومي مشوية خالية من الدهون",
          "خبز تورتيلا الحبوب وبذور الكتان",
          "صوص زبادي يوناني بالخيار المبشور والنعناع",
          "أوراق خس روماني مقرمش"
        ],
        cookingSteps_en: [
          "Warm flatbread on a dry skillet for 30 seconds.",
          "Spread generous cucumber mint tzatziki across the flatbread.",
          "Layer lean turkey and crunchy romaine, roll tightly, and slice on a bias."
        ],
        cookingSteps_ar: [
          "سخني الخبز في مقلاة جافة لبضع ثوان.",
          "ادهني صوص الزبادي بالخيار والنعناع بالتساوي.",
          "رتبي شرائح الرومي والخس ولفي السندويتش بإحكام ثم اقطعيه نصفين."
        ],
        protein: "36g",
        carbs: "28g",
        fats: "7g",
        kcal: 320
      }
    ],
    snack: [
      {
        id: "egy_s_1",
        title_en: "Greek Yogurt with Egyptian Honey, Cinnamon & Crushed Walnuts",
        title_ar: "زبادي يوناني بعسل السدر المصري والقرفة وعين الجمل",
        prepTime_en: "3m",
        prepTime_ar: "٣ دقائق",
        cookTime_en: "0m",
        cookTime_ar: "بدون طهي",
        ingredients_en: [
          "180g Thick Plain Greek Yogurt (0% Fat)",
          "1 tbsp Pure Raw Floral Honey",
          "20g Raw Shelled Walnuts",
          "Ceylon Cinnamon Dust"
        ],
        ingredients_ar: [
          "١٨٠ جم زبادي يوناني سميك خالي الدسم",
          "ملعقة عسل سدر طبيعي",
          "٢٠ جم عين جمل نيء مجروش",
          "رشة قرفة سيلانية عطرة"
        ],
        cookingSteps_en: [
          "Spoon chilled Greek yogurt into a dessert ramekin.",
          "Drizzle pure honey and crown with cracked walnut halves.",
          "Finish with a dusting of cinnamon and enjoy chilled."
        ],
        cookingSteps_ar: [
          "ضعي الزبادي اليوناني في وعاء التقديم.",
          "اسكبي خيطاً من العسل الصافي فوقه ووزعي قطع عين الجمل.",
          "رشي القرفة واستمتعي بسناك غني بالبروتين والمغذيات."
        ],
        protein: "19g",
        carbs: "21g",
        fats: "10g",
        kcal: 250
      },
      {
        id: "egy_s_2",
        title_en: "Crispy Roasted Salt & Cumin Spiced Chickpeas (Hummus Sham)",
        title_ar: "حمص شام مقرمش محمص بالفرن بالكمون والليمون",
        prepTime_en: "5m",
        prepTime_ar: "٥ دقائق",
        cookTime_en: "20m",
        cookTime_ar: "٢٠ دقيقة",
        ingredients_en: [
          "1 cup Cooked Chickpeas thoroughly dried",
          "1 tsp Olive Oil Spray",
          "Smoked Cumin, Sea Salt & Sweet Paprika",
          "Touch of Cayenne Pepper"
        ],
        ingredients_ar: [
          "كوب حمص مسلوق ومجفف تماماً",
          "رذاذ زيت زيتون خفيف",
          "كمون مطحون وبابريكا وملح بحري",
          "رشة شطة خفيفة"
        ],
        cookingSteps_en: [
          "Pat chickpeas completely dry with clean paper towels.",
          "Toss with olive oil spray and vibrant Egyptian spices.",
          "Roast at 200°C for 20 minutes until crunchy and nutty."
        ],
        cookingSteps_ar: [
          "جففي الحمص تماماً بمناشف ورقية لضمان القرمشة.",
          "قلبي الحمص مع رذاذ الزيت والكمون والبابريكا والملح.",
          "حمصيه بالفرن أو القلاية الهوائية لمدة ٢٠ دقيقة حتى يقرمش."
        ],
        protein: "12g",
        carbs: "34g",
        fats: "4g",
        kcal: 215
      },
      {
        id: "egy_s_3",
        title_en: "Fresh Pomegranate Seeds with Mint & Chia Water",
        title_ar: "حبوب رمان أسيوطي طازج بأوراق النعناع وبذور الشيا",
        prepTime_en: "5m",
        prepTime_ar: "٥ دقائق",
        cookTime_en: "0m",
        cookTime_ar: "بدون طهي",
        ingredients_en: [
          "1 cup Fresh Crisp Pomegranate Arils",
          "1 tbsp Soaked Chia Seeds",
          "Fresh Mint Leaves",
          "Sparkling Spring Water Splash"
        ],
        ingredients_ar: [
          "كوب حبوب رمان بلدي أحمر طازج",
          "ملعقة بذور شيا منقوعة",
          "أوراق نعناع طازجة",
          "رشة ماء فوار بارد"
        ],
        cookingSteps_en: [
          "Combine ripe ruby pomegranate seeds in a glass tumbler.",
          "Top with hydrated chia seeds and fragrant slapped mint.",
          "Splash with sparkling ice water for a revitalizing antioxidant boost."
        ],
        cookingSteps_ar: [
          "ضعي حبات الرمان في كأس زجاجي.",
          "أضيفي بذور الشيا وأوراق النعناع الأخضر المنعش.",
          "اسكبي رشة ماء مثلج واستمتعي بسناك منعش ومضاد للأكسدة."
        ],
        protein: "4g",
        carbs: "28g",
        fats: "3g",
        kcal: 155
      },
      {
        id: "egy_s_4",
        title_en: "Medjool Dates Stuffed with Almond Butter & Roasted Pistachios",
        title_ar: "تمر مجدول فاخر محشو بزبدة اللوز والفستق الحلبي",
        prepTime_en: "4m",
        prepTime_ar: "٤ دقائق",
        cookTime_en: "0m",
        cookTime_ar: "بدون طهي",
        ingredients_en: [
          "3 Large Natural Medjool Dates pitted",
          "1.5 tbsp Pure Creamy Almond Butter",
          "Crushed Raw Green Pistachios",
          "Coarse Sea Salt Flakes"
        ],
        ingredients_ar: [
          "٣ حبات تمر مجدول منزوع النوى",
          "ملعقة ونصف زبدة لوز طبيعية",
          "فستق حلبي أخضر مجروش",
          "حبيبات ملح بحري خشنة"
        ],
        cookingSteps_en: [
          "Slit dates lengthwise and gently open each cavity.",
          "Fill with generous velvety almond butter.",
          "Scatter crushed green pistachios and sea salt flakes across the center."
        ],
        cookingSteps_ar: [
          "شقي حبات التمر طولياً وافتحيها بحرص.",
          "احشي كل حبة بزبدة اللوز الطبيعية اللذيذة.",
          "زيني بالفستق المجروش ورشة ملح صغيرة لموازنة الحلاوة."
        ],
        protein: "7g",
        carbs: "46g",
        fats: "9g",
        kcal: 285
      },
      {
        id: "egy_s_5",
        title_en: "Egyptian Thermus (Boiled Lupini Beans) with Cumin & Lemon",
        title_ar: "ترمس بلدي مسلوق غني بالبروتين بالليمون والكمون والشطة",
        prepTime_en: "2m",
        prepTime_ar: "٢ دقيقة",
        cookTime_en: "0m",
        cookTime_ar: "جاهز للأكل",
        ingredients_en: [
          "1.5 cups Sweet Boiled Lupini Beans",
          "Fresh Lemon Juice",
          "Ground Cumin & Sea Salt",
          "Mild Paprika Dust"
        ],
        ingredients_ar: [
          "كوب ونصف ترمس حلو مسلوق وجاهز",
          "عصير ليمون طازج وفير",
          "كمون مطحون وملح بحري",
          "رشة بابريكا خفيفة"
        ],
        cookingSteps_en: [
          "Rinse chilled boiled lupini beans and place into a bowl.",
          "Squeeze plenty of fresh lemon juice over the beans.",
          "Toss with cumin and sea salt for the ultimate low-fat, high-protein snack."
        ],
        cookingSteps_ar: [
          "اغسلي الترمس الحلو وضعيه في طبق التقديم.",
          "اعصري الليمون الطازج بوفرة فوق الترمس.",
          "رشي الكمون والملح والبابريكا واستمتعي بأقوى سناك بروتيني مصري."
        ],
        protein: "26g",
        carbs: "20g",
        fats: "5g",
        kcal: 220
      }
    ]
  }
};

/**
 * Localization Logic Helper
 * Default to English (en) if no locale is explicitly passed.
 */
export const getSmartContextualMeal = (userCuisines = ['Egyptian Cuisine'], mealType = 'breakfast', lang = 'en') => {
  const activeLang = (lang && typeof lang === 'string' && lang.toLowerCase() === 'ar') ? 'ar' : 'en';

  const cuisineKey = userCuisines.find(c => CUISINE_MOCK_DATA[c]) || 'Egyptian Cuisine';
  const selectedCuisineData = CUISINE_MOCK_DATA[cuisineKey] || CUISINE_MOCK_DATA['Egyptian Cuisine'];

  const targetCategory = mealType.toLowerCase();
  const categoryPool = selectedCuisineData[targetCategory] || selectedCuisineData['breakfast'];

  // Select 1 of the configured options
  const meal = categoryPool[Math.floor(Math.random() * categoryPool.length)];

  return {
    id: meal.id,
    cuisine: cuisineKey,
    mealType: targetCategory,
    title: activeLang === 'ar' ? meal.title_ar : meal.title_en,
    title_en: meal.title_en,
    title_ar: meal.title_ar,
    prepTime: activeLang === 'ar' ? meal.prepTime_ar : meal.prepTime_en,
    prepTime_en: meal.prepTime_en,
    prepTime_ar: meal.prepTime_ar,
    cookTime: activeLang === 'ar' ? meal.cookTime_ar : meal.cookTime_en,
    cookTime_en: meal.cookTime_en,
    cookTime_ar: meal.cookTime_ar,
    ingredients: activeLang === 'ar' ? meal.ingredients_ar : meal.ingredients_en,
    ingredients_en: meal.ingredients_en,
    ingredients_ar: meal.ingredients_ar,
    cookingSteps: activeLang === 'ar' ? meal.cookingSteps_ar : meal.cookingSteps_en,
    cookingSteps_en: meal.cookingSteps_en,
    cookingSteps_ar: meal.cookingSteps_ar,
    protein: meal.protein,
    carbs: meal.carbs,
    fats: meal.fats,
    kcal: meal.kcal,
    source: 'contextual_fallback'
  };
};

export default {
  CUISINE_MOCK_DATA,
  getSmartContextualMeal
};
