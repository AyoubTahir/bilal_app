import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../compnents/ui/Spinner';

const EmailConfirmation = () => {
  const effectRun = useRef(false);
  const { id, token } = useParams();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/auth/confirm-email/${id}/${token}`
        );
        setConfirmed(true);
        setMessage(data?.message);
        setLoading(false);
      } catch (error) {
        setConfirmed(false);
        setMessage(error.response?.data?.message);
        setLoading(false);
        console.log(error);
      }
    };
    if (!effectRun.current) checkToken();
    return () => {
      effectRun.current = true;
    };
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {!loading && (
        <div className="space-y-8">
          <h1
            className={`text-6xl ${
              confirmed ? 'bg-green-500' : 'bg-red-500'
            } p-3 rounded text-white`}
          >
            {message}
          </h1>
          <div className="flex justify-center">
            <Link
              to="/login"
              className="text-white bg-blue-600 rounded hover:bg-blue-700 p-3 px-8 font-semibold text-lg"
            >
              Login
            </Link>
          </div>
        </div>
      )}
      {loading && <Spinner />}
    </div>
  );
};

export default EmailConfirmation;
