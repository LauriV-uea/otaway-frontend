import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import AdminDashboardPage from './AdminDashboardPage';

describe('AdminDashboardPage', () => {
  it('muestra el contenido principal de OtaWay', () => {
    render(<AdminDashboardPage groups={[]} />);

    expect(screen.getByText('OtaWay')).toBeInTheDocument();
    expect(screen.getByText(/Descubre los mejores lugares turísticos de Otavalo/i)).toBeInTheDocument();
  });
});
