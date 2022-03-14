import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

let Categories;
const setActiveCatFn = jest.fn();
const consoleErrorFn = jest.fn();

beforeAll(() => {
  jest.mock('axios', () => ({
    get: (url) => {
      if (process.env.catError === 'true') {
        throw new Error('Mock Category Error');
      } else {
        return {
          data: [
            {
              id: 1,
              category: 'mockA'
            },
            {
              id: 2,
              category: 'mockB'
            }
          ]
        };
      }
    }
  }));

  global.console.error = consoleErrorFn;

  Categories = require('../Categories').default;
});

describe('Test Categories Component', () => {
  it('should not render any button and trigger a console error', () => {
    process.env.catError = 'true';
    render(<Categories setActiveCat={setActiveCatFn} activeCat={[]} />);
    expect(screen.queryAllByTitle('mockA').length).toBe(0);
    expect(consoleErrorFn).toHaveBeenCalled();
    delete process.env.catError;
  });

  it('should render 2 button', async () => {
    render(<Categories setActiveCat={setActiveCatFn} activeCat={[]} />);
    const mockedButton = await screen.findAllByTitle(/mock/);
    expect(mockedButton.length).toBe(2);
  });

  it('should trigger ActiveCatfn from Parent', async () => {
    render(<Categories setActiveCat={setActiveCatFn} activeCat={[]} />);

    await waitFor(() => screen.findAllByTitle(/mock/));
    userEvent.click(screen.getByTitle('mockB'));
    expect(setActiveCatFn).toHaveBeenCalledWith([2]);
  });

  it('should trigger ActiveCatfn by removing current Active', async () => {
    render(<Categories setActiveCat={setActiveCatFn} activeCat={[2]} />);

    await waitFor(() => screen.findAllByTitle(/mock/));
    userEvent.click(screen.getByTitle('mockB'));
    expect(setActiveCatFn).toHaveBeenCalledWith([]);
  });

  it('should render active button', async () => {
    render(<Categories setActiveCat={setActiveCatFn} activeCat={[2]} />);

    await waitFor(() => screen.findAllByTitle(/mock/));
    expect(screen.getByTitle('mockB').className).toEqual('active-button');
  });
});