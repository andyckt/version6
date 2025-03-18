import React from 'react';

export const metadata = {
  title: 'Settings | Travel Social',
  description: 'Manage your account settings and preferences',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="settings-layout">
      {children}
    </div>
  );
} 