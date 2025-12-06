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
    icon: '/imgs/logo.svg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Provider>
          <ThemeRegistry>
            <I18nProvider>
              <div style={{ flex: 1 }}>{children}</div>
              <Footer />
              <Toaster richColors position="top-right" duration={1000} />
            </I18nProvider>
          </ThemeRegistry>
        </Provider>
      </body>
    </html>
  );
}
