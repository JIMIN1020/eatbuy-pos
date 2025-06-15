/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        punta: {
          orange: '#FF6B00', // 푼타 메인 컬러
          light: '#FF8533', // 밝은 오렌지
          hover: '#FF6937', // 호버 시 사용할 밝은 버전
          dark: '#CC5500', // 어두운 오렌지
          gray: '#F5F5F5', // 배경색
        },
      },
      keyframes: {
        'slide-down': {
          '0%': {
            transform: 'translateY(-100%) translateX(-50%)',
            opacity: '0',
          },
          '100%': { transform: 'translateY(0) translateX(-50%)', opacity: '1' },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
