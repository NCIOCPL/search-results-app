import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * TODO:
 * Listen for changes to the current 'router' location.
 * 
 * Perform teardown/setup logic for view updates.
 * - Clearing errors (if we were on an 'error page')
 * - Reseting the scroll position of the window.
 * - (? Broadcast updates via Aria Live Region)
 * - ...
 * 
 * 
 * @param {*} props 
 */
const NavigationHandler = ({ children }) => {
  const location = useSelector(store => store.router.location);
  useEffect(() => {
    window.scrollTo(0,0);
  }, [location]);

  return children;
}
export default NavigationHandler;