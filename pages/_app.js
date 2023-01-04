import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import "../Component/Header/Header.css"
import "../Component/Siderbar/Sidebar.css"
// import "../Styles/Simple.module.css"
import {wrapper} from "../Store/Store"
import { Provider } from 'react-redux';


const clientSideEmotionCache = createEmotionCache();

function TokyoApp(props) {

    var { Component, ...rest } = props

    // var { emotionCache = clientSideEmotionCache, pageProps } = wrapper.useWrappedStore(rest);
    var { store, props } = wrapper.useWrappedStore(rest);


  const {  emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
      <Head>
        <title>Tokyo Free Black NextJS Javascript Admin Dashboard</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <SidebarProvider>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            {getLayout(<Component {...pageProps} />)}
          </LocalizationProvider>
        </ThemeProvider>
      </SidebarProvider>
      </Provider>
    </CacheProvider>
  );
}

export default TokyoApp;
// export default wrapper.withRedux(TokyoApp);
