import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import Demande from 'pages/conge/DemandeList';
import AddConge from 'pages/conge/AddDemande';
import AcceptedConge from 'pages/conge/AcceptedConge';
import CalendarConge from 'pages/conge/CalenderConge';
import DetailsConge from 'pages/conge/DetailsConge';
import AuthGuard from '../routes/AuthGuard';
import AddForm from 'pages/conge/AddFormCalendar';
import SamplePage from 'pages/extra-pages/sample-page';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const UserManagement = Loadable(lazy(() => import('pages/user-management/index.jsx')));
const Profile = Loadable(lazy(() => import('pages/listSettings/profile.jsx')));
const Settings = Loadable(lazy(() => import('pages/listSettings/settings.jsx')));
const UpdatePasscode = Loadable(lazy(() => import('pages/listSettings/updatePassword.jsx')));
const UserHistory = Loadable(lazy(() => import('pages/user-history/index.jsx')));

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const UnauthorizedPage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

const MainRoutes = {
    path: '/',
    element: <Dashboard />,
    children: [
        {
            path: '/',
            element: (
                <AuthGuard>
                    <DashboardDefault />
                </AuthGuard>
            )
        },
        {
            path: 'color',
            element: (
                <AuthGuard>
                    <Color />
                </AuthGuard>
            )
        },
        {
            path: 'dashboard/default',
            element: (
                <AuthGuard>
                    <DashboardDefault />
                </AuthGuard>
            )
        },
        {
            path: 'shadow',
            element: (
                <AuthGuard>
                    <Shadow />
                </AuthGuard>
            )
        },
        {
            path: 'updatepassword',
            element: (
                <AuthGuard>
                    <UpdatePasscode />
                </AuthGuard>
            )
        },
        {
            path: 'account-settings',
            element: (
                <AuthGuard>
                    <Settings />
                </AuthGuard>
            )
        },
        {
            path: 'usermanagement',
            element: (
                <AuthGuard roles={['RESPONSABLE']}>
                    <UserManagement />
                </AuthGuard>
            )
        },
        {
            path: 'profile',
            element: (
                <AuthGuard>
                    <Profile />
                </AuthGuard>
            )
        },
        {
            path: 'unauthorized',
            element: (
                <AuthGuard>
                    <UnauthorizedPage />
                </AuthGuard>
            )
        },
        {
            path: 'demandes',
            element: (
                <AuthGuard roles={['RESPONSABLE', 'EMPLOYE']}>
                    <Demande />
                </AuthGuard>
            )
        },
        {
            path: 'addConge',
            element: (
                <AuthGuard roles={['RESPONSABLE', 'EMPLOYE']}>
                    <AddConge />
                </AuthGuard>
            )
        },
        {
            path: 'acceptedConge',
            element: (
                <AuthGuard roles={['EMPLOYE']}>
                    <AcceptedConge />
                </AuthGuard>
            )
        },
        {
            path: 'calendarConge',
            element: (
                <AuthGuard roles={['RESPONSABLE']}>
                    <CalendarConge />
                </AuthGuard>
            )
        },
        {
            path: '/user-history/:userId',
            element: (
                <AuthGuard roles={['RESPONSABLE']}>
                    <UserHistory/>
                </AuthGuard>
            )
        },
        {
            path: 'addForm',
            element: (
                <AuthGuard roles={['EMPLOYE']}>
                    <AddForm />
                </AuthGuard>
            )
        },
        {
            path: 'sample-page',
            element: (
                <AuthGuard>
                    <SamplePage />
                </AuthGuard>
            )
        },
        {
            path: 'detailsConge/:id',
            element: (
                <AuthGuard>
                    <DetailsConge />
                </AuthGuard>
            )
        }
    ]
};

export default MainRoutes;
