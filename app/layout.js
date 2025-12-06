import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import I18nProvider from '@/components/I18nProvider';
import { Toaster } from 'sonner';
import { Provider } from 'jotai';

import Footer from '@/components/Footer';

export const metadata = {
  title: 'NuCorpus',
  description: '核应急领域大模型数据集构建工具',
  icons: {
    icon: '/imgs/logo.svg' // 更新为正确的文件名
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Provider>
          <ThemeRegistry>
            <I18nProvider>
              {children}
              <Footer />
              <Toaster richColors position="top-right" duration={1000} />
            </I18nProvider>
          </ThemeRegistry>
        </Provider>
      </body>
    </html>
  );
}
