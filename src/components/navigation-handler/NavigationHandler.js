import React from 'react';

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
const NavigationHandler = props => {
    return props.children;
}
export default NavigationHandler;