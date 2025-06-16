import { Link, useLocation } from 'react-router-dom';
import puntaLogo from '../assets/punta-logo.png';

function Header() {
  const location = useLocation();

  return (
    <div
      style={{ borderBottom: '1px solid #E5E7EB' }}
      className="w-full px-6 py-4 bg-white h-[70px]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={puntaLogo} alt="punta-logo" className="w-auto h-7" />
          <h1 className="text-2xl font-bold text-punta-orange">식후경 POS</h1>
        </div>
        <div className="flex items-center space-x-8">
          <div className="relative">
            <Link
              to="/"
              className={`text-lg font-medium transition-colors duration-200 ${
                location.pathname === '/'
                  ? 'text-punta-orange'
                  : 'text-gray-600 hover:text-punta-orange'
              }`}
            >
              계산
            </Link>
            {location.pathname === '/' && (
              <div className="absolute -bottom-[10px] left-0 w-full h-[2.5px] bg-punta-orange transform -translate-y-2" />
            )}
          </div>
          <div className="relative">
            <Link
              to="/dashboard"
              className={`text-lg font-medium transition-colors duration-200 ${
                location.pathname === '/dashboard'
                  ? 'text-punta-orange'
                  : 'text-gray-600 hover:text-punta-orange'
              }`}
            >
              통계
            </Link>
            {location.pathname === '/dashboard' && (
              <div className="absolute -bottom-[10px] left-0 w-full h-[2.5px] bg-punta-orange transform -translate-y-2" />
            )}
          </div>
          <div className="relative">
            <Link
              to="/transactions"
              className={`text-lg font-medium transition-colors duration-200 ${
                location.pathname === '/transactions'
                  ? 'text-punta-orange'
                  : 'text-gray-600 hover:text-punta-orange'
              }`}
            >
              거래내역
            </Link>
            {location.pathname === '/transactions' && (
              <div className="absolute -bottom-[10px] left-0 w-full h-[2.5px] bg-punta-orange transform -translate-y-2" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
