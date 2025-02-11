import { ThemeProvider } from "@/components/theme-provider"
import ApolloClientProvider from "@/lib/ApolloClientProvider"
import { Toaster } from "@/components/ui/toaster"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ApolloClientProvider>
                <main>
                    {children}
                </main>
                <Toaster />
            </ApolloClientProvider>
        </ThemeProvider>
    )
}
