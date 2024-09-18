import { AppstoreAddOutlined, CalendarOutlined, CheckCircleOutlined , FileTextOutlined } from '@ant-design/icons';

const icons = {
  AppstoreAddOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  FileTextOutlined
};

const utilities = () => ({
  id: 'group-utilities',
  title: 'Demande Conge',
  type: 'group',
  children: [
    {
      id: 'demandes',
      title: 'Demandes',
      type: 'item',
      url: '/demandes',
      icon: icons.FileTextOutlined,
      breadcrumbs: false,
      roles: [] // Accessible to both roles, no restriction here
    },
    {
      id: 'add-calendar',
      title: 'Calendar Form',
      type: 'item',
      url: '/addForm',
      icon: icons.CalendarOutlined,
      breadcrumbs: false,
      roles: ['EMPLOYE'],  // Only EMPLOYE can access this
    },
    {
      id: 'accepted-conge',
      title: 'Accepted Conge',
      type: 'item',
      url: '/acceptedConge',
      icon: icons.CheckCircleOutlined,
      breadcrumbs: false,
      roles: ['EMPLOYE'], // Only EMPLOYE can access this
    },
    {
      id: 'calendar-conge',
      title: 'Calendar Conge',
      type: 'item',
      url: '/calendarConge',
      icon: icons.CalendarOutlined,
      breadcrumbs: false,
      roles: ['RESPONSABLE'], // Only RESPONSABLE can access this
    },
  ],
});

export default utilities;
