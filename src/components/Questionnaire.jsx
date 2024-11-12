mport './Questionnaire.css';
import React, { useState } from 'react';

const OPENAI_API_KEY = "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"
if (!OPENAI_API_KEY) {
  console.error('OpenAI API key is not set in environment variables');
}

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

const styles = {
  container: {
    backgroundColor: '#ffffff',
    border: '2px solid #e8c1e1',
    borderRadius: '15px',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    width: '700px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '40px',
    marginBottom: '20px',
  },
  heading: {
    color: '#d16a99',
    fontSize: '30px',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
  },
  subheading: {
    color: '#d16a99',
    fontSize: '20px',
    textAlign: 'center',
    marginBottom: '20px',
    fontFamily: "'Poppins', sans-serif",
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '16px',
    color: '#5c375d',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #e8c1e1',
    borderRadius: '8px',
    boxSizing: 'border-box',
    backgroundColor: '#f2d3e4',
  },
  radioCheckbox: {
    marginRight: '8px',
  },
  button: {
    backgroundColor: '#f4a4b8',
    border: 'none',
    color: 'white',
    padding: '15px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '8px',
    width: '100%',
    marginTop: '20px',
  },
  buttonHover: {
    backgroundColor: '#d16a99',
  },
  question: {
    marginBottom: '20px',
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
      const prompt = `You are a skincare expert. Create a skincare routine for ${determinedSkinType} skin type with concerns: ${concerns.join(', ')}.
      Return exactly 5 products: cleanser, toner, moisturizer, sunscreen, and treatment.
      Return ONLY a raw JSON array. Do not include markdown, code blocks, or explanation text.
      Each product object must have these exact properties:
      {
        "type": "product name",
        "timing": "when to use",
        "ingredients": "key ingredients",
        "benefits": "main benefits",
        "application": "how to apply",
        "results": "expected results",
        "precautions": "warnings and tips"
      }`;
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
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
    <div className="product-card">
      <h3>{product.type}</h3>
      <p><strong>When to Use:</strong> {product.timing}</p>
      <p><strong>Key Ingredients:</strong> {product.ingredients}</p>
      <p><strong>Benefits:</strong> {product.benefits}</p>
      <p><strong>How to Apply:</strong> {product.application}</p>
      <p><strong>Expected Results:</strong> {product.results}</p>
      <p><strong>Precautions:</strong> {product.precautions}</p>
    </div>
  );

  if (showResults) {
    return (
      <div className="body">
        <div className="container">
          <h1>Your Skin Type Analysis</h1>
          {skinType && <h2>{skinTypes[skinType].title}</h2>}
          {skinType && <p>{skinTypes[skinType].description}</p>}

          {isLoading ? (
            <div id="loadingRecommendations">
              <p>Generating personalized recommendations...</p>
            </div>
          ) : (
            <div id="productRecommendations" className="product-list">
              {recommendations.map((product, index) => (
                <ResultCard key={index} product={product} />
              ))}
            </div>
          )}

          <button onClick={resetForm}>Go Back to Questionnaire</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8e7f2', fontFamily: "'Poppins', sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', margin: 0, padding: '20px' }}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome to Luminary</h1>
        <h2 style={styles.subheading}>Comprehensive Skincare Analysis Questionnaire</h2>
        <form onSubmit={submitForm}>
          {/* Skin Texture */}
          <div style={styles.question}>
            <label style={styles.label}>1. How would you describe your skin texture?</label>
            <input type="radio" name="skinTexture" value="smooth" required style={styles.radioCheckbox} /> Smooth<br />
            <input type="radio" name="skinTexture" value="rough" style={styles.radioCheckbox} /> Rough<br />
            <input type="radio" name="skinTexture" value="bumpy" style={styles.radioCheckbox} /> Bumpy<br />
          </div>

          {/* Oil Production */}
          <div style={styles.question}>
            <label style={styles.label}>2. How does your skin usually feel by the end of the day?</label>
            <input type="radio" name="oilProduction" value="very-oily" required style={styles.radioCheckbox} /> Very Oily<br />
            <input type="radio" name="oilProduction" value="slightly-oily" style={styles.radioCheckbox} /> Slightly Oily<br />
            <input type="radio" name="oilProduction" value="balanced" style={styles.radioCheckbox} /> Balanced<br />
            <input type="radio" name="oilProduction" value="dry" style={styles.radioCheckbox} /> Dry<br />
          </div>

          {/* Skin Sensitivity */}
          <div style={styles.question}>
            <label style={styles.label}>3. How often do you experience redness, itching, or irritation on your skin?</label>
            <input type="radio" name="sensitivity" value="frequently" required style={styles.radioCheckbox} /> Frequently<br />
            <input type="radio" name="sensitivity" value="occasionally" style={styles.radioCheckbox} /> Occasionally<br />
            <input type="radio" name="sensitivity" value="rarely" style={styles.radioCheckbox} /> Rarely<br />
          </div>

          {/* Pore Size */}
          <div style={styles.question}>
            <label style={styles.label}>4. How would you describe your pore size?</label>
            <input type="radio" name="poreSize" value="large" required style={styles.radioCheckbox} /> Large<br />
            <input type="radio" name="poreSize" value="medium" style={styles.radioCheckbox} /> Medium<br />
            <input type="radio" name="poreSize" value="small" style={styles.radioCheckbox} /> Small<br />
          </div>

          {/* Reaction to Products */}
          <div style={styles.question}>
            <label style={styles.label}>5. How does your skin usually react to new skincare products?</label>
            <input type="radio" name="productReaction" value="easily-irritated" required style={styles.radioCheckbox} /> Easily Irritated<br />
            <input type="radio" name="productReaction" value="no-reaction" style={styles.radioCheckbox} /> No Reaction<br />
            <input type="radio" name="productReaction" value="slight-reaction" style={styles.radioCheckbox} /> Slight Reaction<br />
          </div>

          {/* Hydration */}
          <div style={styles.question}>
            <label style={styles.label}>6. How does your skin feel after washing it?</label>
            <input type="radio" name="hydration" value="tight" required style={styles.radioCheckbox} /> Tight and Dry<br />
            <input type="radio" name="hydration" value="balanced" style={styles.radioCheckbox} /> Balanced<br />
            <input type="radio" name="hydration" value="comfortable" style={styles.radioCheckbox} /> Comfortable and Soft<br />
          </div>

          {/* Skin Concerns */}
          <div style={styles.question}>
            <label style={styles.label}>7. What are your main skin concerns? (Select all that apply)</label>
            <input type="checkbox" name="concern" value="acne" style={styles.radioCheckbox} /> Acne<br />
            <input type="checkbox" name="concern" value="pores" style={styles.radioCheckbox} /> Large Pores<br />
            <input type="checkbox" name="concern" value="pigmentation" style={styles.radioCheckbox} /> Pigmentation<br />
            <input type="checkbox" name="concern" value="redness" style={styles.radioCheckbox} /> Redness<br />
            <input type="checkbox" name="concern" value="fine-lines" style={styles.radioCheckbox} /> Fine Lines and Wrinkles<br />
            <input type="checkbox" name="concern" value="blackheads" style={styles.radioCheckbox} /> Blackheads<br />
            <input type="checkbox" name="concern" value="dullness" style={styles.radioCheckbox} /> Dullness<br />
            <input type="checkbox" name="concern" value="dehydration" style={styles.radioCheckbox} /> Dehydration<br />
          </div>

          {/* Skin Reaction to Climate */}
          <div style={styles.question}>
            <label style={styles.label}>8. How does your skin react to climate changes (e.g., cold winters, hot summers)?</label>
            <textarea name="climateReaction" rows="3" placeholder="Describe your skin's response to weather changes..." required style={styles.input}></textarea>
          </div>

          {/* Sun Exposure */}
          <div style={styles.question}>
            <label style={styles.label}>9. How does your skin respond to sun exposure?</label>
            <input type="radio" name="sunResponse" value="burns-easily" required style={styles.radioCheckbox} /> Burns Easily<br />
            <input type="radio" name="sunResponse" value="tans-easily" style={styles.radioCheckbox} /> Tans Easily<br />
            <input type="radio" name="sunResponse" value="no-major-reaction" style={styles.radioCheckbox} /> No Major Reaction<br />
          </div>

          {/* Product Preferences */}
          <div style={styles.question}>
            <label style={styles.label}>10. Do you have any product preferences? (e.g., fragrance-free, vegan, cruelty-free)</label>
            <textarea name="productPreferences" rows="3" placeholder="Enter your preferences here..." required style={styles.input}></textarea>
          </div>

          {/* Environmental Impact */}
          <div style={styles.question}>
            <label style={styles.label}>11. Does your skin react to any of the following environmental factors?</label>
            <input type="checkbox" name="factor" value="heat" style={styles.radioCheckbox} /> Heat<br />
            <input type="checkbox" name="factor" value="humidity" style={styles.radioCheckbox} /> Humidity<br />
            <input type="checkbox" name="factor" value="pollution" style={styles.radioCheckbox} /> Pollution<br />
            <input type="checkbox" name="factor" value="sun-exposure" style={styles.radioCheckbox} /> Sun Exposure<br />
            <input type="checkbox" name="factor" value="wind" style={styles.radioCheckbox} /> Wind<br />
          </div>

          <button type="submit" style={styles.button} onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor} onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}>Submit & Analyze Skin Type</button>
        </form>
      </div>
    </div>
  );
}
