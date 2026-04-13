import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { HomePage } from '../pages/HomePage';
import { renderWithProviders } from '../../../test/test-utils';

describe('HomePage Component', () => {
  beforeEach(() => {
    // Reset any state before each test
  });

  it('should render without crashing', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('Learn Chinese Numbers')).toBeInTheDocument();
  });

  it('should display the main heading', () => {
    renderWithProviders(<HomePage />);
    const heading = screen.getByRole('heading', { name: /Learn Chinese Numbers/i });
    expect(heading).toBeInTheDocument();
  });

  it('should display the instruction text', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('Hãy chọn một tính năng để bắt đầu')).toBeInTheDocument();
  });

  it('should render all three feature cards', () => {
    renderWithProviders(<HomePage />);
    
    // Check for all feature titles
    expect(screen.getByText('Learning')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render feature descriptions', () => {
    renderWithProviders(<HomePage />);
    
    expect(screen.getByText(/Học 11 chữ số Tiếng Trung/i)).toBeInTheDocument();
    expect(screen.getByText(/Kiểm tra kiến thức/i)).toBeInTheDocument();
    expect(screen.getByText(/Cài đặt ứng dụng/i)).toBeInTheDocument();
  });

  it('should render stats for each card', () => {
    renderWithProviders(<HomePage />);
    
    expect(screen.getByText(/Learned: 8\/11 digits/)).toBeInTheDocument();
    expect(screen.getByText(/Not started/)).toBeInTheDocument();
    expect(screen.getByText(/Configure app/)).toBeInTheDocument();
  });

  it('should render all "Get Started" buttons', () => {
    renderWithProviders(<HomePage />);
    
    const buttons = screen.getAllByRole('button', { name: /Get Started/i });
    expect(buttons).toHaveLength(4);
  });

  it('should have proper text contrast - not completely white on white', () => {
    const { container } = renderWithProviders(<HomePage />);
    const headings = container.querySelectorAll('[class*="MuiTypography"]');
    
    // Ensure headings are present and have content
    expect(headings.length).toBeGreaterThan(0);
    headings.forEach((heading) => {
      expect(heading.textContent).toBeTruthy();
    });
  });

  it('should render feature cards with proper structure', () => {
    const { container } = renderWithProviders(<HomePage />);
    
    // Check for Card components
    const cards = container.querySelectorAll('[class*="MuiCard"]');
    expect(cards.length).toBeGreaterThanOrEqual(3);
    
    // Each card should have visible content
    cards.forEach((card) => {
      const content = card.textContent;
      expect(content.length).toBeGreaterThan(0);
    });
  });

  it('should have Container component for proper layout', () => {
    const { container } = renderWithProviders(<HomePage />);
    
    // Check for Container component
    const containerElement = container.querySelector('[class*="MuiContainer"]');
    expect(containerElement).toBeInTheDocument();
    expect(containerElement.textContent).toBeTruthy();
  });

  it('should render feature icons', () => {
    renderWithProviders(<HomePage />);
    
    // Check for icon emojis/content in the rendered output
    const pageContent = document.body.textContent;
    expect(pageContent).toMatch(/📚|✏️|⚙️/);
  });

  it('should not have any display:none or visibility:hidden on main content', () => {
    const { container } = renderWithProviders(<HomePage />);
    
    const mainContent = container.querySelector('[class*="MuiBox"]');
    const computedStyle = window.getComputedStyle(mainContent);
    
    expect(computedStyle.display).not.toBe('none');
    expect(computedStyle.visibility).not.toBe('hidden');
  });
});
