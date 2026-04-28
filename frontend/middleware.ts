import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Dapatkan locale (default ke 'id' jika tidak ada)
    const segments = pathname.split('/');
    const locale = segments[1] || 'id';

    // 2. Definisi Halaman Publik & Terproteksi
    const isAuthPage = pathname.includes('/login') ||
                      pathname.includes('/register') ||
                      pathname.includes('/forgot-password') ||
                      pathname.includes('/reset-password');

    const isDashboardPage = pathname.includes('/dashboard') ||
                           pathname.includes('/profile') ||
                           pathname.includes('/onboarding');

    // 3. Skip middleware jika bukan auth page atau dashboard page
    if (!isAuthPage && !isDashboardPage) {
        return NextResponse.next();
    }

    // 4. Validasi session ke backend — satu-satunya source of truth
    let isAuthenticated = false;
    let isEmailVerified = false;
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const cookieHeader = request.headers.get('cookie') || '';
        const timestamp = new Date().getTime();
        
        const response = await fetch(`${backendUrl}/api/v1/me?t=${timestamp}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': cookieHeader,
                'Referer': request.url, // Sangat penting untuk Sanctum
            },
            cache: 'no-store',
        });
        
        if (response.ok) {
            const json = await response.json();
            const userData = json.data?.user || json.data || json;
            
            isAuthenticated = true;
            // Pastikan pengecekan email_verified_at benar-benar ketat
            isEmailVerified = userData && userData.email_verified_at !== null && userData.email_verified_at !== undefined;
            
            console.log(`[Middleware Check] User: ${userData?.email}, Verified: ${isEmailVerified}, VerifiedAt: ${userData?.email_verified_at}`);
        }
    } catch (err) {
        console.error('[Middleware Error]', err);
        isAuthenticated = false;
    }

    // LOGIKA PROTEKSI:

    // 1. JIKA SUDAH LOGIN & SUDAH VERIFIKASI -> Dilarang ke VerifyEmail
    if (isAuthenticated && isEmailVerified && pathname.includes('/verify-email')) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    // 2. JIKA SUDAH LOGIN TAPI BELUM VERIFIKASI -> Dilarang ke Dashboard/Onboarding/Profile (Wajib ke verify-email)
    if (isAuthenticated && !isEmailVerified && isDashboardPage && !pathname.includes('/verify-email')) {
        return NextResponse.redirect(new URL(`/${locale}/verify-email`, request.url));
    }

    // 3. JIKA SUDAH LOGIN & SUDAH VERIFIKASI -> Dilarang ke Login/Register
    if (isAuthenticated && isEmailVerified && isAuthPage) {
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    // 4. JIKA BELUM LOGIN -> Dilarang ke Dashboard/Profile/Onboarding/VerifyEmail
    if (!isAuthenticated && (isDashboardPage || pathname.includes('/verify-email'))) {
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Tangkap SEMUA rute kecuali file statis, images, dan api
        '/((?!api|_next/static|_next/image|favicon.ico|images|favicon).*)',
    ],
};
