import { Link, useLocation } from 'react-router-dom';

interface Props {
  href: string;
  name: string;
}

function NavItem({ href, name }: Props) {
  const location = useLocation();

  return (
    <div className="relative">
      <Link
        to={href}
        className={`text-md md:text-lg font-medium transition-colors duration-200 ${
          location.pathname === href
            ? 'text-punta-orange'
            : 'text-gray-600 hover:text-punta-orange'
        }`}
      >
        {name}
      </Link>
      {location.pathname === href && (
        <div className="absolute -bottom-[10px] left-0 w-full h-[2.5px] bg-punta-orange transform -translate-y-2" />
      )}
    </div>
  );
}

export default NavItem;
