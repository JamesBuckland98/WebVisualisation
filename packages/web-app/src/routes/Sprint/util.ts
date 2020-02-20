import edit from 'assets/icons/edit.png';
import kanbanBoard from 'assets/icons/kanbanBoard.png';
import list from 'assets/icons/list.png';
import metrics from 'assets/icons/metrics.png';
import presentation from 'assets/icons/presentation.png';
import { SideBarItem } from 'models/SideBarItem';

export const sideNavItems: SideBarItem[] = [
    {
        label: 'Issues',
        icon: list,
        path: '/',
    },
    {
        label: 'Board',
        icon: kanbanBoard,
        path: '/board',
    },
    {
        label: 'Metrics',
        icon: metrics,
        path: '/metrics',
    },
    {
        label: 'Show and Tell',
        icon: presentation,
        path: '/showandtell',
    },
    {
        label: 'Edit',
        icon: edit,
        path: '/edit',
    },
];
