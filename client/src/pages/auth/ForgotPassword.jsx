import axios from 'axios';
import { useState } from 'react';
import Spinner from '../../compnents/ui/Spinner';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/forgot-password`, {
        email: e.target.email.value,
      });
      setLoading(false);
      e.target.reset();
      setMessage(data.message);
    } catch (error) {
      setErrors(error.response?.data);
      setLoading(false);
      console.log(error);
      setTimeout(() => {
        setErrors({ ...errors, message: '' });
      }, 3000);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {message && (
        <div className="p-3 w-[30rem] text-center rounded bg-green-400 mb-4">{message}</div>
      )}
      <div className="w-[30rem] px-10 pb-16 pt-10 border border-gray-300 rounded">
        <h2 className="text-center text-3xl font-bold">BILAL APP</h2>
        {errors?.message && (
          <h3 className="text-center mt-10 py-3 text-white bg-red-500 rounded">{errors.message}</h3>
        )}
        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <input
              type="text"
              name="email"
              className="w-full py-3 px-2 border border-gray-400 rounded"
              placeholder="Email"
            />
            {errors?.email && <p className="text-red-600">{errors?.email[0]}</p>}
          </div>
          <button className="py-3 w-full bg-blue-600 rounded text-white font-semibold">
            {loading ? <Spinner /> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
