import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPaths = path === "/login" || path === "/register"
  const token = request.cookies.get("token")?.value || ""

  if(isPublicPaths && token){
      return NextResponse.redirect(new URL('/', request.url))
  }

  if(!isPublicPaths && !token){
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
 
export const config = {
  matcher: ['/', "/userProfile/:path*", "/login", "/register"],
}