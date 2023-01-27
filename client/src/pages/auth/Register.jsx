import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../../compnents/ui/Spinner';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/register`, {
        fname: e.target.fname.value,
        lname: e.target.lname.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });
      setLoading(false);
      toast.success('Confirm your password before login');
      navigate('/login');
    } catch (error) {
      setErrors(error.response.data);
      setLoading(false);
      console.log(error);
      setTimeout(() => {
        setErrors({ ...errors, message: '' });
      }, 3000);
    }
  };

  if (localStorage.getItem('token')) return <Navigate to="/" replace={true} />;

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[30rem] px-10 pb-16 pt-10 border border-gray-300 rounded">
        <h2 className="text-center text-3xl font-bold">BILAL APP</h2>
        {errors?.message && (
          <h3 className="text-center mt-10 py-3 text-white bg-red-500 rounded">{errors.message}</h3>
        )}
        <form className="mt-10 space-y-5" onSubmit={handleRegister}>
          <div className="space-y-1">
            <input
              type="text"
              name="fname"
              className="w-full py-3 px-2 border border-gray-400 rounded"
              placeholder="First Name"
            />
            {errors?.fname && <p className="text-red-600">{errors?.fname[0]}</p>}
          </div>
          <div className="space-y-1">
            <input
              type="text"
              name="lname"
              className="w-full py-3 px-2 border border-gray-400 rounded"
              placeholder="Last Name"
            />
            {errors?.lname && <p className="text-red-600">{errors?.lname[0]}</p>}
          </div>
          <div className="space-y-1">
            <input
              type="text"
              name="email"
              className="w-full py-3 px-2 border border-gray-400 rounded"
              placeholder="Email"
            />
            {errors?.email && <p className="text-red-600">{errors?.email[0]}</p>}
          </div>
          <div className="space-y-1">
            <input
              type="password"
              name="password"
              className="w-full py-3 px-2 border border-gray-400 rounded"
              placeholder="Password"
            />
            {errors?.password && <p className="text-red-600">{errors?.password[0]}</p>}
          </div>
          <div>
            Already registered?{' '}
            <Link to="/login">
              <span className=" font-medium text-blue-600">Login</span>
            </Link>
          </div>
          <button className="py-3 w-full bg-blue-600 rounded text-white font-semibold">
            {loading ? <Spinner /> : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
