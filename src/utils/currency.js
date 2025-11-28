export const formatCurrency = (amount, language = 'en') => {
    const rate = 50; // Fixed rate: 1 USD = 50 EGP

    if (language === 'ar') {
        const converted = amount * rate;
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP'
        }).format(converted);
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};
