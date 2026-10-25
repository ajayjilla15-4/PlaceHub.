import React, { useState } from 'react';
import { api } from '../services/api';

interface AuthPageProps {
    onSuccess: (user: any) => void;
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            return;
        }

        if (!isLogin && !name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (!isLogin && password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setBusy(true);

        try {
            const result = isLogin
                ? await api.login(email.trim(), password)
                : await api.register({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    role,
                });

            onSuccess(result.user);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please try again.'
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '75vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                background: '#f8fafc',
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '32px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '18px',
                    boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)',
                    boxSizing: 'border-box',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h1
                        style={{
                            color: '#2563eb',
                            fontSize: '2rem',
                            margin: '0 0 8px',
                        }}
                    >
                        PlaceHub
                    </h1>

                    <h2
                        style={{
                            color: '#0f172a',
                            fontSize: '1.35rem',
                            margin: '0 0 8px',
                        }}
                    >
                        {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                    </h2>

                    <p style={{ color: '#64748b', margin: 0 }}>
                        {isLogin
                            ? 'Sign in to your placement portal'
                            : 'Join your college placement community'}
                    </p>
                </div>

                {!isLogin && (
                    <>
                        <label htmlFor="auth-name" style={labelStyle}>
                            Full Name
                        </label>

                        <input
                            id="auth-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                            style={inputStyle}
                        />

                        <label htmlFor="auth-role" style={labelStyle}>
                            Account Type
                        </label>

                        <select
                            id="auth-role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="student">Student</option>
                            <option value="alumni">Alumni</option>
                        </select>
                    </>
                )}

                <label htmlFor="auth-email" style={labelStyle}>
                    Email Address
                </label>

                <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    style={inputStyle}
                />

                <label htmlFor="auth-password" style={labelStyle}>
                    Password
                </label>

                <input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    minLength={isLogin ? undefined : 8}
                    required
                    style={inputStyle}
                />

                {error && (
                    <p
                        role="alert"
                        style={{
                            color: '#b91c1c',
                            background: '#fef2f2',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            overflowWrap: 'anywhere',
                        }}
                    >
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    style={{
                        width: '100%',
                        padding: '13px',
                        marginTop: '12px',
                        border: 'none',
                        borderRadius: '9px',
                        background: busy ? '#93c5fd' : '#2563eb',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: busy ? 'wait' : 'pointer',
                    }}
                >
                    {busy
                        ? 'Please Wait...'
                        : isLogin
                            ? 'Sign In'
                            : 'Create Account'}
                </button>

                <p
                    style={{
                        textAlign: 'center',
                        color: '#64748b',
                        marginTop: '22px',
                    }}
                >
                    {isLogin
                        ? "New to PlaceHub? "
                        : 'Already have an account? '}

                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin((previous) => !previous);
                            setError('');
                        }}
                        style={{
                            border: 'none',
                            background: 'none',
                            color: '#2563eb',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: 'inherit',
                        }}
                    >
                        {isLogin ? 'Register' : 'Sign In'}
                    </button>
                </p>
            </form>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#334155',
    fontWeight: 600,
    fontSize: '0.9rem',
    marginBottom: '7px',
};

const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    marginBottom: '18px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '16px',
    background: '#ffffff',
    color: '#0f172a',
};