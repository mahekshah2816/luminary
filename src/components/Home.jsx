import '../styles/Home.css';

export default function HomePage() {
  return (
    <div className="main-container">
      <div className="landing-page">
        <div className="confetti">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              style={{
                left: `${(index + 1) * 10}%`,
                width: `${8 + Math.random() * 7}px`,
                height: `${25 + Math.random() * 10}px`,
                animationDelay: `${index * 0.5}s`
              }}
            />
          ))}
        </div>
        <div className="content">
          <h1>Luminary</h1>
          <p>Illuminate Your Skincare Journey with Luminary</p>
          <p>Discover personalized skincare solutions tailored to your needs.</p>
          <div className="button-container">
            <button className="button" onClick={() => window.location.href = '/sign-in'}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}