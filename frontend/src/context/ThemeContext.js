import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Tema Context'ini oluşturun
// Bu, tema durumunu ve tema değiştirme fonksiyonunu uygulamada paylaşmamızı sağlar.
const ThemeContext = createContext();

// 2. ThemeProvider bileşenini oluşturun
// Bu bileşen, uygulamanın geri kalanını sarmalar ve tema durumunu sağlar.
export const ThemeProvider = ({ children }) => {
  // Tema durumunu yönetmek için useState kullanın.
  // Başlangıç değeri olarak localStorage'dan veya sistem tercihinden temayı alın.
  const [theme, setTheme] = useState(() => {
    // localStorage'dan tema tercihini kontrol edin
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
    // Sistem tercihini kontrol edin (koyu mod ise)
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    // Varsayılan olarak 'light' temayı kullanın
    return 'light';
  });

  // Tema değiştiğinde HTML etiketine 'dark' sınıfını ekleyin/kaldırın
  // ve localStorage'a kaydedin.
  useEffect(() => {
    const root = window.document.documentElement; // html etiketi
    const isDark = theme === 'dark';

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(theme);

    localStorage.setItem('theme', theme);
  }, [theme]);

  // Temayı değiştiren fonksiyon
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Context sağlayıcısı aracılığıyla tema durumunu ve fonksiyonunu çocuk bileşenlere iletin
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. useTheme Hook'unu oluşturun
// Bu özel hook, tema durumuna ve değiştirme fonksiyonuna kolay erişim sağlar.
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 4. Tema değiştirme butonu örneği
// Bu bileşen, temayı değiştirmek için kullanılabilir.
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h1M3 12h1m15.325-4.275l-.707-.707M4.382 19.382l-.707-.707m12.728 0l-.707.707M4.382 4.382l-.707.707M12 18a6 6 0 110-12 6 6 0 010 12z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};