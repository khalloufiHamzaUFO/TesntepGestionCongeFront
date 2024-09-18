// material-ui
import React from 'react';

import { useTheme } from '@mui/material/styles';
import logoImage from '../../assets/images/users/tenstep.png';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    <>
      <img src={logoImage} alt="Logo" width="145" height="35" />
    </>
  );
};

export default Logo;
