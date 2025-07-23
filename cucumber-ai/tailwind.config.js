/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            animation: {
                'bg-shine': 'bg-shine 2.1s linear infinite',
            },
            keyframes: {
                'bg-shine': {
                    from: { backgroundPosition: '0 0' },
                    to: { backgroundPosition: '-200% 0' },
                },
            },
        },
    },
    plugins: [],
};