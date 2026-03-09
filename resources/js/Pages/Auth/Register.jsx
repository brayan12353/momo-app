import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const cameroonRegions = [
        'Yaounde','Douala','Bafoussam','Garoua','Limbe','Buea',
        'Kribi','Bamenda','Bertoua','Maroua'
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        kiosk_location: cameroonRegions[0], // default first city
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
        category: 'kiosk',
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
                    <h1 className="text-3xl font-bold mb-6 text-center text-yellow-600">
                        Create your Kiosk Account
                    </h1>

                    <form onSubmit={submit} className="space-y-4">

                        {/* Kiosk Name */}
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                placeholder="Kiosk Name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                        </div>

                        {/* Location dropdown */}
                        <div>
                            <select
                                name="kiosk_location"
                                value={data.kiosk_location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            >
                                {cameroonRegions.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                            {errors.kiosk_location && <div className="text-red-600 text-sm mt-1">{errors.kiosk_location}</div>}
                        </div>

                        {/* Phone */}
                        <div>
                            <input
                                type="text"
                                name="phone"
                                value={data.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                            {errors.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                            {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                            {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-md transition duration-200"
                        >
                            Register
                        </button>

                        {/* Link to login */}
                        <p className="text-center text-gray-600 mt-4">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-yellow-600 underline font-semibold">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
