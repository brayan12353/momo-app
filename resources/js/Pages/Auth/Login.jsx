import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        category: 'kiosk', // default selection
    });

    const [category, setCategory] = useState('kiosk');

    useEffect(() => {
        return () => reset('password');
    }, []);

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategory(value);
        setData('category', value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-600 p-4">
                <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                        Welcome Back
                    </h1>

                    {/* Status message */}
                    {status && <div className="mb-4 font-medium text-sm text-green-600 text-center">{status}</div>}

                    {/* Category Selection */}
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
                                className="form-radio text-orange-500"
                            />
                            Supermarket User
                        </label>
                    </div>

                    <form onSubmit={submit} className="space-y-4">

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full px-4 py-2 border rounded-lg"
                                autoComplete="username"
                                isFocused={true}
                                onChange={handleOnChange}
                                placeholder="Enter your email"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full px-4 py-2 border rounded-lg"
                                autoComplete="current-password"
                                onChange={handleOnChange}
                                placeholder="Enter your password"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={handleOnChange}
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="underline text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton
                            className="w-full py-2 mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg"
                            disabled={processing}
                        >
                            Log In
                        </PrimaryButton>

                        <p className="text-center text-gray-600 mt-4">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="text-yellow-600 underline font-semibold">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
