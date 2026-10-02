import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import './MealCard.css';
import { ChefHat, ChevronDown, ChevronUp, Clock, Dices, CheckCircle2 } from 'lucide-react';

export const MealCard = ({
  meal,
  mealData,
  onReroll,
  onClaim,
  onClaimMeal,
  isClaimed = false,
  isRerolling = false
}) => {
  const actualMeal = meal || mealData || {};
  const { lang = 'en', t } = useLanguage();
  const { addCoins, claimMealHandler } = useUser();
  const isArabic = lang === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isClaimedState, setIsClaimedState] = useState(Boolean(isClaimed || actualMeal.isClaimed || actualMeal.claimed));

  useEffect(() => {
    setIsClaimedState(Boolean(isClaimed || actualMeal.isClaimed || actualMeal.claimed));
  }, [isClaimed, actualMeal.isClaimed, actualMeal.claimed]);

  // Dynamic field resolution
  const title = isArabic
    ? (actualMeal.title_ar || actualMeal.name_ar || actualMeal.title || actualMeal.name)
    : (actualMeal.title_en || actualMeal.name || actualMeal.title);

  const prepTime = isArabic
    ? (actualMeal.prepTime_ar || actualMeal.prepTime || '١٠ دقائق')
    : (actualMeal.prepTime_en || actualMeal.prepTime || '10m');

  const cookTime = isArabic
    ? (actualMeal.cookTime_ar || actualMeal.cookTime || '١٥ دقيقة')
    : (actualMeal.cookTime_en || actualMeal.cookTime || '15m');

  const ingredients = isArabic
    ? (actualMeal.ingredients_ar || actualMeal.ingredients || [
        '٣ حبات بيض طازج',
        'فلفل حلو ومكعبات بصل',
        'طماطم معصورة'
      ])
    : (actualMeal.ingredients_en || actualMeal.ingredients || [
        '3 Farm Eggs',
        'Diced Sweet Bell Peppers & Onion',
        'Crushed Tomatoes'
      ]);

  const cookingSteps = isArabic
    ? (actualMeal.cookingSteps_ar || actualMeal.cookingSteps || actualMeal.recipe_steps || [
        'سخني المقلاة على نار متوسطة مع رش القليل من رذاذ زيت الزيتون.',
        'شوحي المكونات حتى تطرى وتتجانس النكهات.',
        'يُقدم دافئاً وطازجاً.'
      ])
    : (actualMeal.cookingSteps_en || actualMeal.cookingSteps || actualMeal.recipe_steps || [
        'Preheat cooking skillet over medium heat with a light coat of olive oil spray.',
        'Sauté ingredients until fragrant and cooked to temperature.',
        'Serve fresh and warm.'
      ]);

  const protein = actualMeal.protein || `${actualMeal.protein_g || 34}g`;
  const carbs = actualMeal.carbs || `${actualMeal.carbs_g || 48}g`;
  const fats = actualMeal.fats || `${actualMeal.fats_g || 12}g`;
  const kcal = actualMeal.kcal || actualMeal.calories || 420;

  const handleClaim = () => {
    if (!isClaimedState) {
      setIsClaimedState(true);

      // 1. Log calories & macros progress via global handler or callback
      if (typeof onClaimMeal === 'function') {
        onClaimMeal(actualMeal.id, kcal, actualMeal.category || actualMeal.mealType);
      } else if (typeof onClaim === 'function') {
        onClaim(actualMeal.id, kcal, actualMeal.category || actualMeal.mealType);
      } else if (typeof claimMealHandler === 'function') {
        claimMealHandler(actualMeal.id, kcal, actualMeal.category || actualMeal.mealType);
      }

      // 2. Reward user with coins (+10 coins per meal)
      if (typeof addCoins === 'function') {
        addCoins(10);
      }
    }
  };

  return (
    <div className={`meal-card ${isArabic ? 'rtl' : 'ltr'} ${isClaimedState ? 'claimed' : ''}`}>
      {/* Header */}
      <div className="card-header">
        <div className="header-top">
          <span className="meal-badge">
            {actualMeal.category || actualMeal.mealType || 'MEAL'}
          </span>
          {onReroll && (
            <button
              type="button"
              onClick={onReroll}
              disabled={isRerolling || isClaimedState}
              className="reroll-btn"
              title={isClaimedState ? 'Logged' : 'Reroll Meal'}
            >
              <Dices size={13} className={isRerolling ? 'spinning' : ''} />
              <span>{isRerolling ? '...' : (isArabic ? 'تبديل 🎲' : 'Reroll 🎲')}</span>
            </button>
          )}
        </div>
        <h3 className="meal-title">{title}</h3>
      </div>

      {/* Macros */}
      <div className="macros-row">
        <span className="macro-badge macro-protein">
          {protein} {isArabic ? 'بروتين' : 'Protein'}
        </span>
        <span className="macro-badge macro-carbs">
          {carbs} {isArabic ? 'كارب' : 'Carbs'}
        </span>
        <span className="macro-badge macro-fats">
          {fats} {isArabic ? 'دهون' : 'Fats'}
        </span>
        <span className="macro-badge macro-kcal">
          {kcal} {isArabic ? 'سعرة' : 'kcal'}
        </span>
      </div>

      {/* Accordion Recipe Method */}
      <div className="recipe-section">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="recipe-toggle-btn"
        >
          <span className="toggle-left">
            <ChefHat size={15} />
            <span>{isArabic ? 'طريقة التحضير والمكونات' : 'Recipe & Preparation Method'}</span>
          </span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isOpen && (
          <div className="recipe-details animate-in">
            <div className="times">
              <span>
                <Clock size={12} className="inline mr-1" />
                {isArabic ? `التحضير: ${prepTime}` : `Prep: ${prepTime}`}
              </span>
              <span>
                <Clock size={12} className="inline mr-1" />
                {isArabic ? `الطهي: ${cookTime}` : `Cook: ${cookTime}`}
              </span>
            </div>

            {/* Ingredients */}
            <h5>{isArabic ? 'المكونات الرئيسية:' : 'KEY INGREDIENTS:'}</h5>
            <ul className="ingredients-list">
              {ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            {/* Cooking Steps */}
            <h5>{isArabic ? 'خطوات الطهي:' : 'PREPARATION METHOD:'}</h5>
            <ol className="steps-list">
              {cookingSteps.map((step, idx) => (
                <li key={idx}>
                  <span className="step-num">{idx + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Footer / Claim Button */}
      <div className="card-footer">
        <button
          type="button"
          onClick={handleClaim}
          disabled={isClaimedState}
          className={`claim-btn ${isClaimedState ? 'claimed' : ''}`}
        >
          <CheckCircle2 size={16} />
          <span>
            {isClaimedState
              ? (isArabic ? 'تم تسجيل وتناول الوجبة ✓' : 'CLAIMED ✓')
              : (isArabic ? 'تناولت هذه الوجبة (+10 🪙)' : 'CLAIM MEAL (+10 🪙)')}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MealCard;

