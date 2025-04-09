import { useEffect } from 'react'
import { Moon, Sun, ShoppingCart, User, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import useStore from '../store'
import useCartStore from '../store/cart'

const StoreDemo = () => {
  const { t } = useTranslation()
  
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    isAuthenticated,
    login,
    logout,
    user
  } = useStore()
  
  const {
    items,
    addItem,
    removeItem,
    getTotalItems,
    getTotalPrice,
    toggleCart,
    isOpen
  } = useCartStore()
  
  // 更新主題效果
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])
  
  // 演示登入
  const handleLogin = () => {
    login({
      user: {
        id: '1',
        name: '測試用戶',
        email: 'test@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
      },
      token: 'demo-token-123'
    })
    toast.success(t('loginSuccess'))
  }
  
  // 演示添加產品
  const handleAddProduct = () => {
    const productId = `prod-${Math.floor(Math.random() * 1000)}`
    addItem({
      id: productId,
      name: `${t('product')} ${productId}`,
      price: Math.floor(Math.random() * 1000) + 100,
      image: `https://picsum.photos/seed/${productId}/200/200`
    })
    toast.success(t('productAdded'))
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('storeDemo')}</h1>
      
      {/* 主題切換 */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">{t('themeSettings')}</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-2 rounded-md flex items-center ${
              theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
            }`}
          >
            <Sun className="w-5 h-5 mr-2" />
            {t('lightMode')}
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-2 rounded-md flex items-center ${
              theme === 'dark' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
            }`}
          >
            <Moon className="w-5 h-5 mr-2" />
            {t('darkMode')}
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-2 rounded-md flex items-center ${
              theme === 'system' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
            }`}
          >
            {t('systemDefault')}
          </button>
        </div>
      </div>
      
      {/* 語言切換 */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">{t('languageSettings')}</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setLanguage('en')}
            className={`p-2 rounded-md ${
              language === 'en' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`p-2 rounded-md ${
              language === 'zh' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
            }`}
          >
            中文
          </button>
        </div>
      </div>
      
      {/* 用戶認證 */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">{t('userAuthentication')}</h2>
        {isAuthenticated ? (
          <div>
            <div className="flex items-center mb-4">
              {user?.avatar && (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full mr-3" 
                />
              )}
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md"
          >
            <User className="w-4 h-4 mr-2" />
            {t('login')}
          </button>
        )}
      </div>
      
      {/* 購物車演示 */}
      <div className="p-4 border rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">{t('shoppingCart')}</h2>
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full bg-blue-50"
          >
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
        
        <button
          onClick={handleAddProduct}
          className="mb-4 px-4 py-2 bg-green-50 text-green-600 rounded-md"
        >
          {t('addRandomProduct')}
        </button>
        
        {isOpen && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-medium mb-2">{t('cartItems')}</h3>
            {items.length === 0 ? (
              <p className="text-gray-500">{t('emptyCart')}</p>
            ) : (
              <>
                <ul className="divide-y">
                  {items.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded mr-3" />
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm">
                            ${item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-sm"
                      >
                        {t('remove')}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t flex justify-between font-medium">
                  <span>{t('total')}:</span>
                  <span>${getTotalPrice()}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StoreDemo 