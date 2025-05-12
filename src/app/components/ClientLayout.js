"use client";

import ProtectedRoute from './ProtectedRoute';

const ClientLayout = ({ children }) => {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
};

export default ClientLayout; 