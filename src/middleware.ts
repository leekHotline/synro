import {NextRequest, NextResponse} from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (path.startsWith("/dashboard") && !request.cookies.get("authToken")) {
        return NextResponse.redirect(new URL('/login', request.url));

    }
    return NextResponse.next();

}