import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
	const [userId, setUserId] = useState(localStorage.getItem('id') || '');

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId, setUserId }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
