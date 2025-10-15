import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegistering = location.pathname === '/register';

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-[hsl(var(--background))]">
            <div className="flex flex-col w-full max-w-4xl overflow-hidden transition-transform duration-300 transform bg-white shadow-lg rounded-xl md:flex-row hover:-translate-y-2">
                <div className="flex items-center justify-center flex-1 p-4 bg-gray-800 md:p-8">
                    <div className="text-center">
                        <img 
                            src="/TRACE LOGO.png" 
                            alt="TRACE Logo" 
                            className="w-32 h-auto mx-auto mb-4 md:w-48"
                        />
                        <h3 className="mb-2 text-xl font-semibold text-white">Welcome, Alumni!</h3>
                        <p className="text-sm text-gray-200">
                            Track, Reconnect, and Connect with Excellence
                        </p>
                    </div>
                </div>

                <div className="flex-1 p-6 md:p-10 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
                    <div className="w-full max-w-md mx-auto text-center">
                        <h2 className="mb-6 text-2xl font-semibold">
                            {isRegistering ? "Register" : "Login"}
                        </h2>
                        <AnimatePresence mode="wait">
                            {isRegistering ? (
                                <motion.div
                                    key="register"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <RegisterForm />
                                </motion.div>
                                ) : (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <LoginForm />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <p className="mb-4 text-sm text-gray-500">
                            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button
                                onClick={() => navigate(isRegistering ? "/login" : "/register")}
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
                            <br />
                            <a 
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=tabugadirkenjibrocks@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                            Tabugadir, Kenji "Brocks" I.
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
