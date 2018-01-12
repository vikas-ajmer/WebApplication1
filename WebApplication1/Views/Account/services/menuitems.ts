import { Injectable } from '@angular/core';

@Injectable()
export class MenuItems {
    private static get _admin(): string {
        return "ADMIN";
    }

    private static get _accountManager(): string {
        return "ACCOUNT MANAGER";
    }

    private static get _corporateManger(): string {
        return "CORPORATE MANAGER";
    }

    private static get _moderator(): string {
        return "MODERATOR";
    }

    private static get _support(): string {
        return "SUPPORT";
    }

    private static get _it(): string {
        return "IT";
    }

    private static get _accountExecutive(): string {
        return "ACCOUNT EXECUTIVE";
    }

    public static readonly SIDEBAR_MENUITEMS = [
        {
            MenuItems: [
                {
                    Roles: [MenuItems._admin, MenuItems._corporateManger],
                    name: 'Dashboard',
                    hasSubMenu: false,
                    icon: 'fa fa-tachometer',
                    href: '/',
                    subMenus: [],
                    isShow: false
                }, {
                    Roles: [MenuItems._admin, MenuItems._corporateManger],
                    name: 'Corporates',
                    hasSubMenu: true,
                    href: 'corporate',
                    icon: 'fa fa-building',
                    subMenus: [
                        {
                            Roles: [MenuItems._admin, MenuItems._corporateManger],
                            href: 'corporate/add',
                            name: 'Add Corporate',
                            icon: 'fa fa-building',
                            isShow: false
                        }
                    ],
                    isShow: false
                }, {
                    Roles: [
                        MenuItems._admin, MenuItems._corporateManger
                    ],
                    name: 'Users',
                    hasSubMenu: true,
                    href: 'users',
                    icon: 'fa fa-users',
                    subMenus: [
                        {
                            Roles: [
                                MenuItems._admin, MenuItems._corporateManger
                            ],
                            href: 'users/add',
                            name: 'Add Users',
                            icon: 'fa fa-users',
                            isShow: false
                        }
                    ],
                    isShow: false
                }, {
                    Roles: [
                        MenuItems._admin, MenuItems._corporateManger
                    ],
                    name: 'Calendar',
                    hasSubMenu: true,
                    href: 'calendar',
                    icon: 'fa fa-calendar',
                    subMenus: [
                        {
                            Roles: [
                                MenuItems._admin, MenuItems._corporateManger
                            ],
                            href: 'calendar/add',
                            name: 'Add Calendar',
                            icon: 'fa fa-calendar',
                            isShow: false
                        }
                    ],
                    isShow: false
                }, {
                    Roles: [
                        MenuItems._admin, MenuItems._corporateManger
                    ],
                    name: 'Challenges',
                    hasSubMenu: true,
                    href: 'challenges',
                    icon: 'fa fa-trophy',
                    subMenus: [
                        {
                            Roles: [
                                MenuItems._admin, MenuItems._corporateManger
                            ],
                            href: 'challenge/add',
                            name: 'Add Challenges',
                            icon: 'fa fa-trophy',
                            isShow: false
                        }
                    ],
                    isShow: false
                }, {
                    Roles: [
                        MenuItems._admin, MenuItems._corporateManger
                    ],
                    name: 'Reports',
                    hasSubMenu: true,
                    href: 'reports',
                    icon: 'fa fa-area-chart',
                    subMenus: [
                        {
                            Roles: [
                                MenuItems._admin, MenuItems._corporateManger
                            ],
                            href: 'reports/add',
                            name: 'Add Report',
                            icon: 'fa fa-area-chart',
                            isShow: false
                        }
                    ],
                    isShow: false
                }, {
                    Roles: [
                        MenuItems._admin, MenuItems._corporateManger
                    ],
                    name: 'Events',
                    hasSubMenu: true,
                    href: 'events',
                    icon: 'fa fa-calendar-check-o',
                    subMenus: [
                        {
                            Roles: [
                                MenuItems._admin, MenuItems._corporateManger
                            ],
                            href: 'events/add',
                            name: 'Add Events',
                            icon: 'fa fa-calendar-check-o',
                            isShow: false
                        }
                    ],
                    isShow: false
                },
                {
                    Roles: [
                        MenuItems._admin, MenuItems._corporateManger
                    ],
                    name: 'Store',
                    //hasSubMenu: true,
                    href: 'order-history',
                    icon: 'fa fa-cart-plus',
                    //subMenus: [
                    //    {
                    //        Roles: [
                    //            MenuItems._admin, MenuItems._corporateManger
                    //        ],
                    //        href: 'order-history',
                    //        name: 'Order History',
                    //        icon: 'fa fa-calendar-check-o',
                    //        isShow: false
                    //    }
                    //],
                    isShow: false
                }, {
                    Roles: [
                        MenuItems._admin
                    ],
                    name: 'Admin Users',
                    //hasSubMenu: true,
                    href: 'registerusers',
                    icon: 'fa fa-users',
                    //subMenus: [
                    //    {
                    //        Roles: [
                    //            MenuItems._admin, MenuItems._corporateManger
                    //        ],
                    //        href: 'users/add',
                    //        name: 'Add Users',
                    //        icon: 'fa fa-users',
                    //        isShow: false
                    //    }
                    //],
                    isShow: false
                }
            ]
        }
    ];

    public static readonly AuthorisedURLs = [
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/corporate'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/corporate/add'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/corporate/view'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/corporate/add-employee'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/corporate/delete-employee'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/users'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/challenges'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/challenge/add'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/userprofile/view'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/challenge/adventure-assigncorporate'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: 'challenge/add/individual'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/challenge/adventure-create'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/challenge/adventure-setdetails'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/challenge/step-challenge/create'
        },
        {
            Roles: [MenuItems._admin, MenuItems._corporateManger],
            url: '/challenge/step-challenge/previous'
        },
        {
            Roles: [MenuItems._admin],
            url: '/registerusers'
        },
        {
            Roles: [MenuItems._admin],
            url: '/registerusers/add'
        },
        {
            Roles: [MenuItems._admin],
            url: '/order-history'
        },
        {
            Roles: [MenuItems._admin],
            url: '/reports'
        }
    ]
}