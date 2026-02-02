import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../constants/constants';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [exchangeRate, setExchangeRate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [suggestedPricePercentage, setSuggestedPricePercentage] = useState(10);

    const fetchExchangeRate = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://dolarapi.com/v1/dolares/blue');
            const data = await response.json();

            if (data && data.venta) {
                // Cotización Blue + 10 pesos
                const rateWithMargin = data.venta + 10;
                setExchangeRate(rateWithMargin);
            } else {
                throw new Error('No se pudo obtener la cotización');
            }
        } catch (err) {
            console.error('Error fetching currency:', err);
            setError(err.message);
            setExchangeRate(1100);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/settings`);
            const result = await response.json();
            if (result.success && result.data) {
                setSuggestedPricePercentage(result.data.suggestedPricePercentage);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };

    useEffect(() => {
        fetchExchangeRate();
        fetchSettings();
        // Refresh exchange rate every 30 minutes
        const interval = setInterval(fetchExchangeRate, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const formatInUSD = (arsAmount) => {
        if (!exchangeRate) return '---';
        return (arsAmount / exchangeRate).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
    };

    const convertToARS = (usdAmount) => {
        if (!exchangeRate) return 0;
        return usdAmount * exchangeRate;
    };

    const calculateSuggestedPrice = (basePriceUSD) => {
        return basePriceUSD * (1 + suggestedPricePercentage / 100);
    };

    const value = {
        exchangeRate,
        loading,
        error,
        suggestedPricePercentage,
        setSuggestedPricePercentage,
        formatInUSD,
        convertToARS,
        calculateSuggestedPrice,
        refreshRate: fetchExchangeRate,
        refreshSettings: fetchSettings
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
