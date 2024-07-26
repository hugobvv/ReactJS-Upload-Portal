/**
 * Project Name: ES6 Upload Portal
 * File: Layout.jsx
 * Author: Hugo Bouvet
 * Year: 2024
 *
 * Description: Defines the layout structure and the header for the ES6 Upload Portal.
 *              Wraps children components in a container with a card layout.
*/

import React from 'react';

export function Layout({ children }) {
  return (
    <div className="container mt-5">
      <div className="card custom-card">
        <div className="card-body customform">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Header({logoUrl, projectName})
{
  /* Display header */
  return <div className="header-container">
    <img src={logoUrl} alt="Theme Logo" className="logo" />
    <h5 className="header">UPLOAD PORTAL : {projectName}</h5>
  </div>
}