/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./electron/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        // 核应急专用色系
        'nuclear-yellow': '#FFD700', // 辐射警告黄
        'nuclear-yellow-dark': '#F59E0B', // 深琥珀色
        'reactor-blue': '#2A5CAA',    // 反应堆深蓝 (项目主色)
        'reactor-blue-light': '#60A5FA', // 反应堆浅蓝 (切伦科夫辐射感)
        'graphite-black': '#1A1A1A',  // 石墨黑
        'concrete-gray': '#E5E7EB',   // 混凝土灰
        'alert-red': '#DC2626',       // 紧急警报红
        'safe-green': '#10B981',      // 安全指示绿
      },
      backgroundImage: {
        'nuclear-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
        'warning-stripe': 'repeating-linear-gradient(45deg, #FFD700, #FFD700 10px, #1A1A1A 10px, #1A1A1A 20px)',
      }
    },
  },
  corePlugins: {
    preflight: false, // 禁用 Preflight 以避免与 MUI 冲突
  },
  plugins: [],
}
