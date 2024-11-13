import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import styles from './SignUp.module.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullname,
            username: formData.username,
          },
        },
      });

      if (signUpError) throw signUpError;

    //   create table profiles (
    //   id uuid references auth.users primary key,
    //   full_name text,
    //   username text unique,
    //   email text unique,
    //   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    //   updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    // );

      // If signup successful, create a profile in your profiles table
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: formData.fullname,
              username: formData.username,
              email: formData.email,
            },
          ]);

        if (profileError) throw profileError;
      }

      // Redirect to questionnaire
      navigate('/questionnaire');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1>Welcome to Luminary</h1>
        <p>Join us and start your personalized skincare journey today.</p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullname">Full Name:</label>
          <input
            type="text"
            id="fullname"
            required
            placeholder="Enter your full name"
            value={formData.fullname}
            onChange={handleChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            required
            placeholder="Create a username"
            value={formData.username}
            onChange={handleChange}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 