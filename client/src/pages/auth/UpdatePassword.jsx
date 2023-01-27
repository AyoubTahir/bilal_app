import axios from 'axios';
import { useState, useEffect } from 'react';
import Spinner from '../../compnents/ui/Spinner';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import UpdatePasswordForm from '../../compnents/auth/UpdatePasswordForm';

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const effectRun = useRef(false);
  const { id, token } = useParams();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/auth/forgot-password-check/${id}/${token}`
        );
        setVerified(data?.verified);
        setLoading(false);
      } catch (error) {
        setVerified(false);
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
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {!loading && !verified && message && <div>{message}</div>}
      {!loading && verified && <UpdatePasswordForm userId={id} />}
      {loading && <Spinner />}
    </div>
  );
};

export default UpdatePassword;
