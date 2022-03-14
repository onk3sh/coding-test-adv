import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
describe('Test Loader component', () => {
  it('should render loading div', () => {
    const Loader = require('../Loader').default;

    render(<Loader />);
    expect(screen.getAllByTitle('loading')).toBeTruthy();
  });
});