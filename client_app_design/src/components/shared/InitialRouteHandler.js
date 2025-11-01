import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InitialRouteHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const selectedCity = localStorage.getItem('selectedCity');
    const token = localStorage.getItem('token');

    if (token && selectedCity) {
      navigate('/app'); // Redirect to the main app if authenticated and city selected
    } else if (selectedCity) {
      navigate('/login'); // Redirect to login if city selected but not authenticated
    } else {
      navigate('/city-selection'); // Redirect to city selection if no city selected
    }
  }, [navigate]);

  return null; // This component doesn't render anything, it just redirects
};

export default InitialRouteHandler;
