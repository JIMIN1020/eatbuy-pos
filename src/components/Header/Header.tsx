import puntaLogo from '../../assets/punta-logo.png';
import NavItem from './NavItem';

function Header() {
  const navItems = [
    { href: '/', name: '계산' },
    { href: '/sales', name: '매출' },
    { href: '/transactions', name: '거래' },
    { href: '/dashboard', name: '분석' },
  ];

  return (
    <div
      style={{ borderBottom: '1px solid #E5E7EB' }}
      className="w-full px-[20px] md:px-[60px] py-4 bg-white flex items-center h-[70px]"
    >
      <div className="mx-auto flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <img src={puntaLogo} alt="punta-logo" className="w-auto h-7" />
          <h1 className="text-lg md:text-2xl font-bold text-punta-orange">
            식후경 POS
          </h1>
        </div>
        <div className="flex items-center space-x-4 md:space-x-8">
          {navItems.map((item) => (
            <NavItem key={item.href} href={item.href} name={item.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Header;
