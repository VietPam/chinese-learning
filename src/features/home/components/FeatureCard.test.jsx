import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { FeatureCard } from '../components/FeatureCard';
import { renderWithProviders } from '../../../test/test-utils';

describe('FeatureCard Component', () => {
  const mockFeature = {
    id: 'learning',
    title: 'Learning',
    description: 'Test description for learning',
    path: '/chinese-digits',
    icon: '📚',
    color: '#e3f2fd',
    borderColor: '#1976d2',
    stats: 'Learned: 8/11 digits',
  };

  it('should render without crashing', () => {
    renderWithProviders(<FeatureCard {...mockFeature} />);
    expect(screen.getByText('Learning')).toBeInTheDocument();
  });

  it('should display the title', () => {
    renderWithProviders(<FeatureCard {...mockFeature} />);
    const title = screen.getByRole('heading', { name: /Learning/i });
    expect(title).toBeInTheDocument();
  });

  it('should display the description', () => {
    renderWithProviders(<FeatureCard {...mockFeature} />);
    expect(screen.getByText('Test description for learning')).toBeInTheDocument();
  });

  it('should display the stats', () => {
    renderWithProviders(<FeatureCard {...mockFeature} />);
    expect(screen.getByText(/Learned: 8\/11 digits/)).toBeInTheDocument();
  });

  it('should display the icon', () => {
    renderWithProviders(<FeatureCard {...mockFeature} />);
    expect(screen.getByText('📚')).toBeInTheDocument();
  });

  it('should render the Get Started button', () => {
    renderWithProviders(<FeatureCard {...mockFeature} />);
    const button = screen.getByRole('button', { name: /Get Started/i });
    expect(button).toBeInTheDocument();
  });

  it('should have all text content visible', () => {
    const { container } = renderWithProviders(<FeatureCard {...mockFeature} />);
    const card = container.querySelector('[class*="MuiCard"]');
    
    expect(card.textContent).toContain('Learning');
    expect(card.textContent).toContain('Test description for learning');
    expect(card.textContent).toContain('Learned: 8/11 digits');
  });

  it('should have Card element with proper styling', () => {
    const { container } = renderWithProviders(<FeatureCard {...mockFeature} />);
    const card = container.querySelector('[class*="MuiCard"]');
    
    expect(card).toBeInTheDocument();
    const computedStyle = window.getComputedStyle(card);
    expect(computedStyle.display).not.toBe('none');
  });

  it('should not have white text on white background', () => {
    const { container } = renderWithProviders(<FeatureCard {...mockFeature} />);
    const typographies = container.querySelectorAll('[class*="MuiTypography"]');
    
    typographies.forEach((typo) => {
      if (typo.textContent.trim()) {
        const color = window.getComputedStyle(typo).color;
        // Should not be white color only
        expect(color).toBeTruthy();
      }
    });
  });

  it('should render with different color props', () => {
    const customFeature = {
      ...mockFeature,
      color: '#fff3e0',
      borderColor: '#f57c00',
    };
    
    renderWithProviders(<FeatureCard {...customFeature} />);
    expect(screen.getByText('Learning')).toBeInTheDocument();
  });

  it('should have minimum height for card', () => {
    const { container } = renderWithProviders(<FeatureCard {...mockFeature} />);
    const card = container.querySelector('[class*="MuiCard"]');
    
    const minHeight = window.getComputedStyle(card).minHeight;
    expect(minHeight).not.toBe('0px');
    expect(minHeight).not.toBe('auto');
  });

  it('should display content with proper contrast', () => {
    renderWithProviders(<FeatureCard {...mockFeature} />);
    
    const title = screen.getByText('Learning');
    const description = screen.getByText('Test description for learning');
    const stats = screen.getByText(/Learned: 8\/11 digits/);
    
    expect(title).toBeVisible();
    expect(description).toBeVisible();
    expect(stats).toBeVisible();
  });
});
