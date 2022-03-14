import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

let App;
beforeAll(() => {
  jest.mock('../components/Carousel', () => ({
    __esModule: true,
    default: () => {
      return 'Render Carousel';
    }
  }));

  jest.mock('../components/Categories', () => ({
    __esModule: true,
    default: () => {
      return 'Render Categories';
    }
  }));

  App = require('../App').default;
});

// By right we should be able to ignore this test
// Really it does nothing but just hold a state and call child component
describe('Test App Component', () => {
  it('should render all child component', async () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot(`
    <div class="app"><header class="app-header">Render CategoriesRender Carousel</header></div>
    `);
  });
});
