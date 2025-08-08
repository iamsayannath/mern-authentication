import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function LoginPage({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      errors.email = 'Please enter your email';
    } else if (!emailRegex.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!form.password.trim()) {
      errors.password = 'Please enter your password';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      let res = await api.post('/auth/login', form, { withCredentials: true });

      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user)); // optional for persistence
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try again.');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          className={`input ${fieldErrors.email ? 'border-red-500' : ''}`}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {fieldErrors.email && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
        )}

        <input
          className={`input mt-3 ${fieldErrors.password ? 'border-red-500' : ''}`}
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {fieldErrors.password && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
        )}

        <button className="btn mt-4 w-full">Login</button>

        <div className="text-sm mt-2 flex justify-between">
          <Link to="/signup" className="text-blue-500">
            Create account
          </Link>
          <Link to="/forgot" className="text-blue-500">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
}
