import { DashboardOutlined, UsergroupAddOutlined } from '@ant-design/icons';

const icons = {
    DashboardOutlined,
    UsergroupAddOutlined,
};

const dashboard = () => ({
    id: 'group-dashboard',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.DashboardOutlined,
            breadcrumbs: false,
            roles: [],
        },
        {
            id: 'user-management',
            title: 'User Management',
            type: 'item',
            url: '/usermanagement',
            icon: icons.UsergroupAddOutlined,
            breadcrumbs: false,
            roles: ['RESPONSABLE'], // Only accessible by 'RESPONSABLE'
        },
    ],
});

export default dashboard;
