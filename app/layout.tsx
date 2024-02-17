import './globals.css'
import { sfPro } from './_fonts'
import NavDropDown from '@/components/globalui/nav-dropdown'
import NavSession from '@/components/globalui/nav-session'
import AuthProvider from '@/components/globalui/auth-provider'
import { getServerAuthSession } from './api/auth/[...nextauth]/_utils'

export const metadata = {
    title: 'SSC31 Ready To Go',
    description: 'SSC31 App',
}

export default async function RootLayout({ children } : { children: React.ReactNode }) {
    const session = await getServerAuthSession()
    return (
        <html lang="en">
            <body className={`${sfPro.className} bgCover backdrop-blur-sm`}>
                <AuthProvider session={session}>
                    <div className="bg-white/70 dark:bg-black/70 h-screen overflow-hidden">
                        <nav className={styles.navBar}>
                            <NavDropDown/>
                            <NavSession/>
                        </nav>
                        {children}
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
}

const styles = {
    navBar: [
        'px-2 sticky top-0 z-[999]',
        'w-full h-[54px] flex justify-between items-center dark:shadow-lg',
        'bg-green-500'
    ].join(' ')
}