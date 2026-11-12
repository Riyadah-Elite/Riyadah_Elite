import { Ionicons } from '@expo/vector-icons';

export interface NavItem {
  key: string;
  label: string;
  shortLabel: string;
  href: '/' | '/tournaments' | '/game-testing' | '/bug-report';
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    label: 'Home',
    shortLabel: 'Home',
    href: '/',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    key: 'tournaments',
    label: 'Tournaments',
    shortLabel: 'Arena',
    href: '/tournaments',
    icon: 'trophy-outline',
    activeIcon: 'trophy',
  },
  {
    key: 'game-testing',
    label: 'Game Testing',
    shortLabel: 'Testing',
    href: '/game-testing',
    icon: 'game-controller-outline',
    activeIcon: 'game-controller',
  },
  {
    key: 'bug-report',
    label: 'Bug Report',
    shortLabel: 'Bugs',
    href: '/bug-report',
    icon: 'bug-outline',
    activeIcon: 'bug',
  },
];
