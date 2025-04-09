import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "react-hot-toast"
import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import { ThemeToggle } from "./components/ThemeToggle"
import ProductList from './pages/ProductList'

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vibe-ui-theme">
            <BrowserRouter>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <ThemeToggle />
                </div>

                <Toaster position="top-center" />

                <div className="min-h-screen bg-white dark:bg-gray-950">
                    <nav className="bg-white dark:bg-gray-900 dark:text-gray-50 shadow-sm dark:shadow-gray-900/10">
                        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">商品管理系統</Link>
                        </div>
                    </nav>
                    
                    <main>
                        <Routes>
                            <Route path="/" element={<ProductList />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App 