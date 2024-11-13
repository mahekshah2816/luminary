import styles from './SignUp.module.css';

const SignUp = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    window.location.href = '/questionnaire';
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1>Welcome to Luminary</h1>
        <p>Join us and start your personalized skincare journey today.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullname">Full Name:</label>
          <input
            type="text"
            id="fullname"
            required
            placeholder="Enter your full name"
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            required
            placeholder="Enter your email"
          />

          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            required
            placeholder="Create a username"
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            placeholder="Create a password"
          />

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 