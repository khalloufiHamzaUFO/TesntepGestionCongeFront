import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/authentication/resetPassword.jsx')));
const AuthResetPassword = Loadable(lazy(() => import('pages/authentication/resetingNewPassword.jsx')));

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/register',
      element: <AuthRegister />
    },
    {
      path: '/forgot-my-password',
      element: <AuthForgotPassword/>
    },
    {
      path: '/reset-password/:email',
      element: <AuthResetPassword/>
    }

  ]
};

export default LoginRoutes;
