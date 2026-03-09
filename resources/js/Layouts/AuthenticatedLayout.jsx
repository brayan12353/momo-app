import { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    UsersIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    PlusIcon,
    EyeIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export default function AuthenticatedLayout({ children }) {
    const { post } = useForm();
    const { auth } = usePage().props;
    const user = auth.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [customerOpen, setCustomerOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const logout = () =>
        post(route('logout'), {
            onSuccess: () => (window.location.href = '/'), // redirect to welcome page
        });

    const isActiveRoute = (routeName) => route().current(routeName);

    // Highlight Customers button if any of its sublinks are active
    const customerActive =
        isActiveRoute('customers.create') || isActiveRoute('customers.index');

        const safeRoute = (name) => {
    try {
        return route(name);
    } catch {
        return '#';
    }
};


    return (
        <div className="min-h-screen flex bg-gray-100 overflow-hidden">

            {/* SIDEBAR */}
            <aside
                className={`fixed z-40 inset-y-0 left-0 w-64 bg-blue-600 text-white
                transform transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* BRAND */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-blue-500">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=ffffff&color=2563eb`}
                        className="h-9 w-9 rounded-full"
                    />
                    <span className="font-bold truncate">{user.name}</span>
                    <XMarkIcon
                        className="h-6 w-6 cursor-pointer ml-auto"
                        onClick={() => setSidebarOpen(false)}
                    />
                </div>

                {/* NAV */}
                <nav className="p-4 space-y-2">
                    <SidebarLink
                        icon={HomeIcon}
                        label="Dashboard"
                        href={route('dashboard')}
                        isActive={isActiveRoute('dashboard')}
                    />

                    {/* CUSTOMERS DROPDOWN */}
                    <div>
                        <button
                            onClick={() => setCustomerOpen(!customerOpen)}
                            className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition ${
                                customerActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-700 text-white'
                            }`}
                        >
                            <UsersIcon className="h-5 w-5" />
                            Customers
                            <ChevronDownIcon
                                className={`h-4 w-4 ml-auto transition ${customerOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {customerOpen && (
                            <div className="ml-10 mt-2 space-y-1 text-sm">
                                <SidebarSubLink
                                    icon={PlusIcon}
                                    label="Add Customer"
                                    href={route('transactions.create')}
                                    isActive={isActiveRoute('transactions.create')}
                                />
                                <SidebarSubLink
                                    icon={EyeIcon}
                                    label="View Customers"
                                    href={route('transactions.index')}
                                    isActive={isActiveRoute('transactions.index')}
                                />
                            </div>
                        )}
                    </div>

                    <SidebarLink
                        icon={Cog6ToothIcon}
                        label="Settings"
                        href={route('settings.index')}
                        isActive={isActiveRoute('settings.index')}
                    />
                    <SidebarLink
                    icon={ChartBarIcon}
                    label="Generate Report"
                    href={route('reports.index')}
                isActive={isActiveRoute('reports.index')}
                />  
                    
                </nav>

                {/* LOGOUT */}
                <button
                    onClick={logout}
                    className="absolute bottom-0 w-full flex items-center gap-3 px-6 py-4 hover:bg-blue-700"
                >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Logout
                </button>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                {/* TOP BAR */}
                <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6">
                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                        <Bars3Icon
                            className="h-6 w-6 text-gray-600 cursor-pointer"
                            onClick={() => setSidebarOpen(true)}
                        />
                        <span className="hidden md:block font-semibold text-gray-700">
                            Welcome to your dashboard — {user.name}
                        </span>
                    </div>

                    {/* RIGHT */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2"
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff`}
                                className="h-10 w-10 rounded-full"
                            />
                            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-lg overflow-hidden z-50">
                                <Link
                                    href={route('profile.edit')}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>

                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* CONTENT */}
                <main className="p-4 md:p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}

/* COMPONENTS */
function SidebarLink({ icon: Icon, label, href, isActive }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
                isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-700 text-white'
            }`}
        >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
        </Link>
    );
}

function SidebarSubLink({ icon: Icon, label, href, isActive }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer text-sm transition ${
                isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-500 text-white'
            }`}
        >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{label}</span>
        </Link>
    );
}
