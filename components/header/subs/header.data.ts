import { faBlog, faBowlFood, faHome, faMugHot, IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface NavBarItem {
  id: number;
  title: string;
  route: string;
  icon: IconDefinition;
}

export const HEADER_DATA: NavBarItem[] = [
  {
    id: 1,
    icon: faHome,
    title: 'Trang chủ',
    route: '/'
  },
  // {
  //   id: 2,
  //   title: 'Giới thiệu',
  //   route: '/introduction'
  // },
  {
    id: 3,
    icon: faBowlFood,
    title: 'Đồ ăn',
    route: '/website-services'
    // subs: [
    //   {
    //     id: 2.1,
    //     title: 'Thiết kế web',
    //     route: '/thiet-ke-web'
    //   },
    //   {
    //     id: 2.2,
    //     title: 'Quản trị web',
    //     route: '/quan-tri-web'
    //   },
    //   {
    //     id: 2.3,
    //     title: 'Chỉnh sửa web',
    //     route: '/chinh-sua-web'
    //   }
    // ]
  },
  {
    id: 4,
    icon: faMugHot,
    title: 'Thức uống',
    route: '/mobile-app-services'
    // subs: [
    //   {
    //     id: 3.1,
    //     title: 'Thiết kế app',
    //     route: '/thiet-ke-app'
    //   },
    //   {
    //     id: 3.2,
    //     title: 'Clone app',
    //     route: '/clone-app'
    //   },
    //   {
    //     id: 3.3,
    //     title: 'Chỉnh sửa app',
    //     route: '/chinh-sua-app'
    //   }
    // ]
  },
  {
    id: 5,
    icon: faBlog,
    title: 'Blog',
    route: '/mobile-app-services'
  }
];
