import { useState } from 'react';
import { LoadingContext } from '../contexts/LoadingContext';
import { useAuth } from '../hooks/useAuth';

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { authLoading } = useAuth();

    const showLoading = () => {
        setIsLoading(true);
    };

    const hideLoading = () => {
        setIsLoading(false);
    };

    const globalLoading = isLoading || authLoading;

    return (
        <LoadingContext.Provider value={{ isLoading: globalLoading, showLoading, hideLoading }}>
            {children}

            {globalLoading && (
                <div className="global-loader-overlay"></div>
            )}
        </LoadingContext.Provider>
    );
};