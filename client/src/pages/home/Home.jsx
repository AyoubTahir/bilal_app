import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate, Navigate } from 'react-router-dom';

const Home = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const navigate = useNavigate();

  if (!localStorage.getItem('token')) return <Navigate to="/login" replace={true} />;

  useEffect(() => {
    const user = jwt_decode(localStorage.getItem('token'));
    setFname(user.fname);
    setLname(user.lname);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-slate-200 text-xl w-full h-20 flex gap-1 justify-around items-center">
      <div>
        Welcome to your home page{' '}
        <span className="text-blue-500 font-bold">
          {fname} {lname}
        </span>
      </div>
      <button className="bg-red-500 py-3 text-white px-5 rounded" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Home;
