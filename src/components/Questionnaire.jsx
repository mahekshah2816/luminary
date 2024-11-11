import React, { useState } from 'react';

const OPENAI_API_KEY = "API_KEY";

const skinTypes = {
  "Oily": {
    title: "Oily Skin",
    description: "Your skin produces excess sebum, especially in the T-zone. You may experience enlarged pores, shine, and occasional breakouts. We recommend using lightweight, non-comedogenic products and incorporating gentle exfoliation into your routine."
  },
  "Dry": {
    title: "Dry Skin",
    description: "Your skin tends to feel tight and may show flaking or roughness. Focus on rich, hydrating products and avoid harsh cleansers. Look for ingredients like hyaluronic acid, ceramides, and facial oils to maintain your skin's moisture barrier."
  },
  "Combination": {
    title: "Combination Skin",
    description: "You have different needs in different areas of your face - typically an oily T-zone with drier cheeks. Consider multi-masking and using different products for different areas. Balance is key in your skincare routine."
  },
  "Sensitive": {
    title: "Sensitive Skin",
    description: "Your skin easily reacts to products and environmental factors. Stick to gentle, fragrance-free products and always patch test new items. Look for soothing ingredients like aloe, chamomile, and green tea."
  },
  "Normal": {
    title: "Normal/Balanced Skin",
    description: "Your skin is well-balanced with minimal concerns. Focus on maintaining this balance with a consistent routine of gentle cleansing, hydration, and sun protection. Don't forget preventive care to maintain your skin's health."
  }
};

export default function SkincareQuestionnaire() {
  const [showResults, setShowResults] = useState(false);
  const [skinType, setSkinType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  const analyzeResults = (formData) => {
    let scores = {
      Oily: 0,
      Dry: 0,
      Combination: 0,
      Sensitive: 0,
      Normal: 0
    };

    // Get values from formData
    const skinTexture = formData.get('skinTexture');
    const oilProduction = formData.get('oilProduction');
    const sensitivity = formData.get('sensitivity');
    const poreSize = formData.get('poreSize');
    const productReaction = formData.get('productReaction');
    const hydration = formData.get('hydration');
    const concerns = formData.getAll('concern');
    const sunResponse = formData.get('sunResponse');

    // Analyze skin texture
    if (skinTexture === 'smooth') scores.Normal += 2;
    if (skinTexture === 'rough') scores.Dry += 2;
    if (skinTexture === 'bumpy') {
      scores.Combination += 1;
      scores.Oily += 1;
    }

    // Analyze oil production
    if (oilProduction === 'very-oily') scores.Oily += 3;
    if (oilProduction === 'slightly-oily') scores.Combination += 2;
    if (oilProduction === 'balanced') scores.Normal += 2;
    if (oilProduction === 'dry') scores.Dry += 3;

    // Analyze sensitivity
    if (sensitivity === 'frequently') scores.Sensitive += 3;
    if (sensitivity === 'occasionally') scores.Combination += 1;
    if (sensitivity === 'rarely') scores.Normal += 1;

    // Analyze pore size
    if (poreSize === 'large') scores.Oily += 2;
    if (poreSize === 'medium') scores.Combination += 1;
    if (poreSize === 'small') {
      scores.Normal += 1;
      scores.Dry += 1;
    }

    // Analyze product reaction
    if (productReaction === 'easily-irritated') scores.Sensitive += 3;
    if (productReaction === 'slight-reaction') scores.Sensitive += 1;
    if (productReaction === 'no-reaction') scores.Normal += 1;

    // Analyze hydration
    if (hydration === 'tight') scores.Dry += 2;
    if (hydration === 'balanced') scores.Normal += 2;
    if (hydration === 'comfortable') scores.Normal += 1;

    // Analyze skin concerns
    if (concerns.includes('acne')) scores.Oily += 1;
    if (concerns.includes('pores')) scores.Oily += 1;
    if (concerns.includes('redness')) scores.Sensitive += 1;
    if (concerns.includes('dehydration')) scores.Dry += 1;

    // Analyze sun response
    if (sunResponse === 'burns-easily') scores.Sensitive += 2;

    // Determine the skin type with highest score
    let maxScore = 0;
    let determinedSkinType = 'Normal';

    for (const [type, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        determinedSkinType = type;
      }
    }

    return determinedSkinType;
  };

  const generateRecommendations = async (determinedSkinType, concerns) => {
    setIsLoading(true);
    
    try {
      const prompt = `Generate detailed personalized skincare recommendations for someone with ${determinedSkinType} skin type. 
      Their specific concerns are: ${concerns.join(', ')}. 
      Provide 4 essential products: cleanser, toner, moisturizer, and sunscreen and a treatment.
      For each product, include:
      1. Detailed product type and when to use it (morning/evening)
      2. Key active ingredients with their specific benefits
      3. How to apply the product properly
      4. What to expect from regular use
      5. Any precautions or tips
      Format the response as a JSON array of objects with properties: 
      type, timing, ingredients, benefits, application, results, precautions.`;
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.8,
          max_tokens: 2000
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
  
      const data = await response.json();
      const recommendations = JSON.parse(data.choices[0].message.content);
  
      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Failed to generate recommendations. Please try again.');
      
      // Updated fallback recommendations with more detail
      const fallbackRecommendations = [
        {
          type: "Gentle Cleanser",
          timing: "Morning and evening",
          ingredients: "Ceramides, Glycerin, Niacinamide",
          benefits: "Helps maintain skin barrier, provides hydration, and soothes skin",
          application: "Massage gently with lukewarm water in circular motions for 60 seconds",
          results: "Cleaner, softer skin without feeling stripped",
          precautions: "Avoid hot water and harsh rubbing"
        },
        // ... similar detailed fallback recommendations for other products ...
      ];
      setRecommendations(fallbackRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const determinedSkinType = analyzeResults(formData);
    setSkinType(determinedSkinType);
    generateRecommendations(determinedSkinType, formData.getAll('concern'));
    setShowResults(true);
  };

  const resetForm = () => {
    setShowResults(false);
    setSkinType('');
    setRecommendations([]);
  };

  const ResultCard = ({ product }) => (
    <div className="bg-[#fff9fc] border border-[#e8c1e1] rounded-lg p-5 hover:transform hover:-translate-y-0.5 transition-transform">
      <h3 className="text-[#d16a99] font-medium text-xl mb-3">{product.type}</h3>
      <p className="text-[#5c375d] mb-2"><strong>When to Use:</strong> {product.timing}</p>
      <p className="text-[#5c375d] mb-2"><strong>Key Ingredients:</strong> {product.ingredients}</p>
      <p className="text-[#5c375d] mb-2"><strong>Benefits:</strong> {product.benefits}</p>
      <p className="text-[#5c375d] mb-2"><strong>How to Apply:</strong> {product.application}</p>
      <p className="text-[#5c375d] mb-2"><strong>Expected Results:</strong> {product.results}</p>
      <p className="text-[#5c375d]"><strong>Precautions:</strong> {product.precautions}</p>
    </div>
  );

  if (showResults) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f8e7f2] p-5">
        <div className="w-full max-w-3xl">
          <div>
            <div className="text-3xl text-center text-[#d16a99]">
              Your Skin Type Analysis
            </div>
            {skinType && (
              <h2 className="text-2xl text-center text-[#d16a99]">
                {skinTypes[skinType].title}
              </h2>
            )}
          </div>
          <div className="space-y-6">
            {skinType && (
              <p className="text-[#5c375d] leading-relaxed">
                {skinTypes[skinType].description}
              </p>
            )}

            {isLoading ? (
              <div className="text-center text-[#d16a99] p-5 animate-pulse">
                <p>Generating personalized recommendations...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((product, index) => (
                  <ResultCard key={index} product={product} />
                ))}
              </div>
            )}

            <button
              onClick={resetForm}
              className="w-full bg-[#f4a4b8] text-white py-3 px-4 rounded-lg hover:bg-[#d16a99] transition-colors"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f8e7f2] p-5">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div>
          <div className="text-3xl text-center text-[#d16a99]">Welcome to Luminary</div>
          <h2 className="text-xl font-medium text-center text-[#d16a99]">Comprehensive Skincare Analysis Questionnaire</h2>
        </div>
        <div>
          <form onSubmit={submitForm} className="space-y-6">
            {/* Skin Texture */}
            <div className="space-y-2">
              <label className="block text-[#5c375d]">1. How would you describe your skin texture?</label>
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="skinTexture" value="smooth" required />
                  <span>Smooth</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="skinTexture" value="rough" />
                  <span>Rough</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="skinTexture" value="bumpy" />
                  <span>Bumpy</span>
                </label>
              </div>
            </div>

            {/* Oil Production */}
            <div className="space-y-2">
              <label className="block text-[#5c375d]">2. How does your skin usually feel by the end of the day?</label>
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="oilProduction" value="very-oily" required />
                  <span>Very Oily</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="oilProduction" value="slightly-oily" />
                  <span>Slightly Oily</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="oilProduction" value="balanced" />
                  <span>Balanced</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="oilProduction" value="dry" />
                  <span>Dry</span>
                </label>
              </div>
            </div>

            {/* Skin Sensitivity */}
            <div className="space-y-2">
              <label className="block text-[#5c375d]">3. How often do you experience redness, itching, or irritation?</label>
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="sensitivity" value="frequently" required />
                  <span>Frequently</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="sensitivity" value="occasionally" />
                  <span>Occasionally</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="sensitivity" value="rarely" />
                  <span>Rarely</span>
                </label>
              </div>
            </div>

            {/* Pore Size */}
            <div className="space-y-2">
              <label className="block text-[#5c375d]">4. How would you describe your pore size?</label>
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="poreSize" value="large" required />
                  <span>Large</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="poreSize" value="medium" />
                  <span>Medium</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="poreSize" value="small" />
                  <span>Small</span>
                </label>
              </div>
            </div>

            {/* Reaction to Products */}
            <div className="space-y-2">
              <label className="block text-[#5c375d]">5. How does your skin usually react to new skincare products?</label>
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="productReaction" value="easily-irritated" required />
                  <span>Easily Irritated</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="productReaction" value="no-reaction" />
                  <span>No Reaction</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="productReaction" value="slight-reaction" />
                  <span>Slight Reaction</span>
                </label>
              </div>
            </div>

            {/* Hydration */}
            <div className="space-y-2">
              <label className="block text-[#5c375d]">6. How does your skin feel after washing it?</label>
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="hydration" value="tight" required />
                  <span>Tight and Dry</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="hydration" value="balanced" />
                  <span>Balanced</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="hydration" value="comfortable" />
                  <span>Comfortable and Soft</span>
                </label>
              </div>
              </div>

              <div className="space-y-2">
            <label className="block text-[#5c375d]">7. What are your main skin concerns? (Select all that apply)</label>
            <div className="space-y-1">
              <label><input type="checkbox" name="concern" value="acne" /> Acne</label>
              <label><input type="checkbox" name="concern" value="pores" /> Large Pores</label>
              <label><input type="checkbox" name="concern" value="pigmentation" /> Pigmentation</label>
              <label><input type="checkbox" name="concern" value="redness" /> Redness</label>
              <label><input type="checkbox" name="concern" value="fine-lines" /> Fine Lines and Wrinkles</label>
              <label><input type="checkbox" name="concern" value="blackheads" /> Blackheads</label>
              <label><input type="checkbox" name="concern" value="dullness" /> Dullness</label>
              <label><input type="checkbox" name="concern" value="dehydration" /> Dehydration</label>
            </div>
          </div>

          {/* Skin Reaction to Climate */}
          <div className="space-y-2">
            <label className="block text-[#5c375d]">8. How does your skin react to climate changes (e.g., cold winters, hot summers)?</label>
            <textarea name="climateReaction" rows="3" placeholder="Describe your skin's response to weather changes..." required></textarea>
          </div>

          {/* Sun Exposure */}
          <div className="space-y-2">
            <label className="block text-[#5c375d]">9. How does your skin respond to sun exposure?</label>
            <div className="space-y-1">
              <label><input type="radio" name="sunResponse" value="burns-easily" required /> Burns Easily</label>
              <label><input type="radio" name="sunResponse" value="tans-easily" /> Tans Easily</label>
              <label><input type="radio" name="sunResponse" value="no-major-reaction" /> No Major Reaction</label>
            </div>
          </div>

          {/* Product Preferences */}
          <div className="space-y-2">
            <label className="block text-[#5c375d]">10. Do you have any product preferences? (e.g., fragrance-free, vegan, cruelty-free)</label>
            <textarea name="productPreferences" rows="3" placeholder="Enter your preferences here..." required></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-[#5c375d]">11. Does your skin react to any of the following environmental factors?</label>
            <div className="space-y-1">
              <label><input type="checkbox" name="factor" value="heat" /> Heat</label>
              <label><input type="checkbox" name="factor" value="humidity" /> Humidity</label>
              <label><input type="checkbox" name="factor" value="pollution" /> Pollution</label>
              <label><input type="checkbox" name="factor" value="dust" /> Dust</label>
              <label><input type="checkbox" name="factor" value="wind" /> Wind</label>
            </div>
          </div>

          <button type="submit" className="bg-[#d16a99] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#b05986]">Submit</button>
        </form>
      </div>
    </div>
    </div>
  );
}
