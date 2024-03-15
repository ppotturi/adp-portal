import React from 'react';
import { render, screen } from '@testing-library/react';
import SelectedChipsRenderer from './SelectedChipsRenderer';

describe('SelectedChipsRenderer', () => {
  it('renders nothing if selected is not an array', () => {
    const { container } = render(<SelectedChipsRenderer selected={null} />);
    expect(container).toBeEmptyDOMElement();
    
    render(<SelectedChipsRenderer selected="string" />);
    expect(container).toBeEmptyDOMElement();
    
    render(<SelectedChipsRenderer selected={{ key: 'value' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders correctly if selected is an array', () => {
    const options = ['Option 1', 'Option 2'];
    render(<SelectedChipsRenderer selected={options} />);

    options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });
});
