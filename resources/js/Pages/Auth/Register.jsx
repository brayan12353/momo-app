import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
export default function Register() {
    // Use Inertia useForm for Breeze form handling
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        kiosk_name: '',
        kiosk_location: '',
        supermarket_name: '',
        supermarket_location: '',
        category: 'kiosk', // default selection
    });

    // Track category selection (kiosk or supermarket)
    const [category, setCategory] = useState('kiosk');

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategory(value);
        setData('category', value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-4">
                <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                        Create your Account
                    </h1>

                    {/* Category selection */}
                    <div className="mb-6 flex justify-center gap-8">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="category_select"
                                value="kiosk"
                                checked={category === 'kiosk'}
                                onChange={handleCategoryChange}
                                className="form-radio text-yellow-500"
                            />
                            Kiosk Agent
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="category_select"
                                value="supermarket"
                                checked={category === 'supermarket'}
                                onChange={handleCategoryChange}
                                className="form-radio text-indigo-500"
                            />
                            Supermarket User
                        </label>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">

                        {/* Common fields */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                            {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                            {errors.password && <div className="text-red-600 text-sm">{errors.password}</div>}
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>

                        {/* Kiosk Agent Fields */}
                        {category === 'kiosk' && (
                            <>
                                <div>
                                    <input
                                        type="text"
                                        name="kiosk_name"
                                        value={data.kiosk_name}
                                        onChange={handleChange}
                                        placeholder="Kiosk Name"
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="kiosk_location"
                                        value={data.kiosk_location}
                                        onChange={handleChange}
                                        placeholder="Kiosk Location (City, Cameroon)"
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Supermarket User Fields */}
                        {category === 'supermarket' && (
                            <>
                                <div>
                                    <input
                                        type="text"
                                        name="supermarket_name"
                                        value={data.supermarket_name}
                                        onChange={handleChange}
                                        placeholder="Supermarket Name"
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="supermarket_location"
                                        value={data.supermarket_location}
                                        onChange={handleChange}
                                        placeholder="Supermarket Location (City, Cameroon)"
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
                        >
                            Register
                        </button>

                        {/* Link to login */}
                        <p className="text-center text-gray-600 mt-4">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-blue-500 underline">
    Login
</Link>

                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}