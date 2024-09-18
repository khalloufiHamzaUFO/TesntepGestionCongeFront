import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import Demande from 'pages/conge/DemandeList';
import AddConge from 'pages/conge/AddDemande';
import AcceptedConge from 'pages/conge/AcceptedConge';
import CalendarConge from 'pages/conge/CalenderConge';
import DetailsConge from 'pages/conge/DetailsConge';
import AddForm from 'pages/conge/AddFormCalendar';

// render - login
// const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
// const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));

// ==============================|| AUTH ROUTING ||============================== //

const demandeCongeRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/listDemande',
      element: <Demande />
    },
    {
        path: '/addConge',
        element: <AddConge />
      }, 
      {
        path: '/acceptedConge',
        element: <AcceptedConge />
      },
      {
        path: '/celendarConge',
        element: <CalendarConge />
      },
      {
        path: '/addForm',
        element: <AddForm />
      },
      {
        path: '/detailsConge/:id',
        element: <DetailsConge />
      }
  ]
};

export default demandeCongeRoutes;
