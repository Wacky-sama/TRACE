import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getRole, isApproved, clearAuthData } from '../../utils/storage';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    const is_approved = isApproved();

    if (token && role) {
      if (role === "alumni" && !is_approved) {
        clearAuthData();
        return;
      }
      navigate(`/${role}/dashboard`);
    }
  }, [navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row transform transition-transform duration-300 hover:-translate-y-2">
                <div className="flex-1 bg-gray-800 flex items-center justify-center p-4 md:p-8">
                    <div className="text-center">
                        <img 
                            src="/TRACE LOGO.png" 
                            alt="TRACE Logo" 
                            className="w-32 md:w-48 h-auto mx-auto mb-4"
                        />
                        <h3 className="text-white text-xl font-semibold mb-2">Welcome, Alumni!</h3>
                        <p className="text-gray-200 text-sm">
                            Track, Reconnect, and Connect with Excellence
                        </p>
                    </div>
                </div>

                <div className="flex-1 p-6 md:p-10">
                    <div className="max-w-md w-full mx-auto text-center">
                        <h2 className="text-2xl font-semibold mb-6">
                            {isRegistering ? "Register" : "Login"}
                        </h2>

                        {isRegistering ? (
                            <RegisterForm setIsRegistering={setIsRegistering} />
                        ) : (
                            <LoginForm />
                        )}

                        <p className="text-sm text-gray-500 mb-4">
                            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-blue-600 hover:underline"
                            >
                                {isRegistering ? "Login here." : "Register here."}
                            </button>
                        </p>

                        <p className="mt-6 text-sm text-gray-500">
                            Developed by:
                            <br />Balgos, Wendel B.
                            <br />Salviejo, Victor Louis R.
                            <br />Taguba, Philip Joshua V.
                            <br />Tabugadir, Kenji "Brocks" I.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
