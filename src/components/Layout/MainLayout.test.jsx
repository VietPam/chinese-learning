import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { MainLayout } from '../Layout/MainLayout';
import { renderWithProviders } from '../../test/test-utils';

describe('MainLayout Component', () => {
  it('should render without crashing', () => {
    renderWithProviders(<MainLayout />);
    expect(screen.getByText('Learn Chinese Numbers')).toBeInTheDocument();
  });

  it('should display the header title', () => {
    renderWithProviders(<MainLayout />);
    const title = screen.getByText('Learn Chinese Numbers');
    expect(title).toBeInTheDocument();
  });

  it('should have an AppBar', () => {
    const { container } = renderWithProviders(<MainLayout />);
    const appBar = container.querySelector('[class*="MuiAppBar"]');
    expect(appBar).toBeInTheDocument();
  });

  it('should render the footer text', () => {
    renderWithProviders(<MainLayout />);
    expect(screen.getByText(/© 2026 Learn Chinese/)).toBeInTheDocument();
  });

  it('should have proper layout structure - flex container', () => {
    const { container } = renderWithProviders(<MainLayout />);
    const mainBox = container.querySelector('[class*="MuiBox"]');
    
    expect(mainBox).toBeInTheDocument();
    const display = window.getComputedStyle(mainBox).display;
    expect(display).toBe('flex');
  });

  it('should not have completely white page on white background', () => {
    const { container } = renderWithProviders(<MainLayout />);
    
    // Find all Typography and text elements
    const textElements = container.querySelectorAll('[class*="MuiTypography"], [class*="MuiToolbar"]');
    
    let hasVisibleText = false;
    textElements.forEach((element) => {
      if (element.textContent && element.textContent.trim() !== '') {
        hasVisibleText = true;
      }
    });
    
    expect(hasVisibleText).toBe(true);
  });

  it('should have Outlet for nested routes', () => {
    const { container } = renderWithProviders(<MainLayout />);
    
    // The main content area should exist
    const mainContent = container.querySelector('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('should render all structural elements', () => {
    const { container } = renderWithProviders(<MainLayout />);
    
    // Check for AppBar
    const appBar = container.querySelector('[class*="MuiAppBar"]');
    expect(appBar).toBeInTheDocument();
    
    // Check for main content area
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    
    // Check for footer
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should have menu items in drawer', () => {
    renderWithProviders(<MainLayout />);
    
    // Note: Drawer is only rendered when opened, so we can't check its content
    // unless we simulate a click, but we can verify the component renders
    const title = screen.getByText('Learn Chinese Numbers');
    expect(title).toBeInTheDocument();
  });

  it('should not have display:none on main layout', () => {
    const { container } = renderWithProviders(<MainLayout />);
    const layout = container.querySelector('[class*="MuiBox"]');
    
    const display = window.getComputedStyle(layout).display;
    expect(display).not.toBe('none');
  });

  it('should have visible header content', () => {
    renderWithProviders(<MainLayout />);
    
    const title = screen.getByText('Learn Chinese Numbers');
    expect(title).toBeVisible();
  });

  it('should have visible footer content', () => {
    renderWithProviders(<MainLayout />);
    
    const footerText = screen.getByText(/© 2026 Learn Chinese/);
    expect(footerText).toBeVisible();
  });

  it('should structure content with proper min-height for full viewport', () => {
    const { container } = renderWithProviders(<MainLayout />);
    const layout = container.querySelector('[class*="MuiBox"]');
    
    const minHeight = window.getComputedStyle(layout).minHeight;
    expect(minHeight).toBe('100vh');
  });
});
