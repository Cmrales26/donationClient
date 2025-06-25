import { useAuth } from '../context/AuthContext';

interface NoAdminHideProps {
  children: React.ReactNode;
}

const NoAdminHide: React.FC<NoAdminHideProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'Administrador') {
    return null;
  }

  return <>{children}</>;
};

export default NoAdminHide;
