import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';
import { useNavigate } from 'react-router-dom';

const UpdatePasswordForm = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(`${import.meta.env.VITE_SERVER_URL}/auth/update-password`, {
        id: parseInt(userId),
        password: e.target.password.value,
        cpassword: e.target.cpassword.value,
      });
      setLoading(false);
      toast.success(data.message);
      navigate('/login');
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
    <div className="w-[30rem] px-10 pb-16 pt-10 border border-gray-300 rounded">
      <h2 className="text-center text-3xl font-bold">BILAL APP</h2>
      {errors?.message && (
        <h3 className="text-center mt-10 py-3 text-white bg-red-500 rounded">{errors.message}</h3>
      )}
      <form className="mt-10 space-y-5" onSubmit={handleUpdatePassword}>
        <div className="space-y-1">
          <input
            type="password"
            name="password"
            className="w-full py-3 px-2 border border-gray-400 rounded"
            placeholder="Password"
          />
          {errors?.password && <p className="text-red-600">{errors?.cpassword[0]}</p>}
        </div>
        <div className="space-y-1">
          <input
            type="password"
            name="cpassword"
            className="w-full py-3 px-2 border border-gray-400 rounded"
            placeholder="Confirm Password"
          />
          {errors?.cpassword && <p className="text-red-600">{errors?.cpassword[0]}</p>}
        </div>
        <button className="py-3 w-full bg-blue-600 rounded text-white font-semibold">
          {loading ? <Spinner /> : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;
