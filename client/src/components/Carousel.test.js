import {
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved
  } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import userEvent from '@testing-library/user-event';
  
  let Carousel;
  let consoleErrorFn = jest.fn();
  
  beforeAll(() => {
    jest.mock('axios', () => ({
      get: (url, options) => {
        if (options.headers['x-categoryids'] === '1') {
          throw new Error('Mock Photo Error');
        } else {
          return {
            data: [
              {
                category_id: 1,
                photo_url: 'mockUrlA'
              },
              {
                category_id: 2,
                photo_url: 'mockUrlB'
              }
            ]
          };
        }
      }
    }));
  
    jest.mock('../Loader', () => {
      return {
        __esModule: true,
        default: () => {
          return 'Loading...';
        }
      };
    });
    consoleErrorFn = jest.fn();
    global.console.error = consoleErrorFn;
  
    Carousel = require('../Carousel').default;
  });
  
  describe('Test Carousel Component', () => {
    it('should render loading', async () => {
      render(<Carousel categories={[1]} />);
      expect(screen.queryAllByText('Loading...').length).toEqual(1);
    });
  
    it('should render "No Photo" when there is an error', async () => {
      render(<Carousel categories={[1]} />);
      await waitFor(async () => {
        const noPhotoSpan = await screen.findAllByTitle('No Photo');
        expect(noPhotoSpan.length).toBe(1);
      });
    });
  
    it('should render "No Photo" when there is no categories', async () => {
      render(<Carousel categories={[]} />);
      await waitFor(async () => {
        const noPhotoSpan = await screen.findAllByTitle('No Photo');
        expect(noPhotoSpan.length).toBe(1);
      });
    });
  
    it('should render the first photo', async () => {
      render(<Carousel categories={[2]} />);
  
      await waitForElementToBeRemoved(() => screen.queryByTitle('No Photo'));
      expect(screen.getByAltText('animal').src).toMatch('mockUrlA');
    });
  
    it('should render the next photo when right is clicked', async () => {
      render(<Carousel categories={[2]} />);
  
      await waitForElementToBeRemoved(() => screen.queryByTitle('No Photo'));
      userEvent.click(screen.getByTitle('right'));
      expect(screen.getByAltText('animal').src).toMatch('mockUrlB');
    });
  
    it('should render previous photo when left is click', async () => {
      render(<Carousel categories={[2]} />);
  
      await waitForElementToBeRemoved(() => screen.queryByTitle('No Photo'));
      userEvent.click(screen.getByTitle('right')); // Navigates to the last photo
      expect(screen.getByAltText('animal').src).toMatch('mockUrlB');
      userEvent.click(screen.getByTitle('left'));
      expect(screen.getByAltText('animal').src).toMatch('mockUrlA');
    });
  
    it('should do nothing when left is click with first photo', async () => {
      render(<Carousel categories={[2]} />);
  
      await waitForElementToBeRemoved(() => screen.queryByTitle('No Photo'));
      userEvent.click(screen.getByTitle('left'));
      expect(screen.getByAltText('animal').src).toMatch('mockUrlA');
    });
  
    it('should do nothgin when right is click with last photo', async () => {
      render(<Carousel categories={[2]} />);
  
      await waitForElementToBeRemoved(() => screen.queryByTitle('No Photo'));
      userEvent.click(screen.getByTitle('right')); // Go to last item
      expect(screen.getByAltText('animal').src).toMatch('mockUrlB');
      userEvent.click(screen.getByTitle('right')); // Click right again
      expect(screen.getByAltText('animal').src).toMatch('mockUrlB');
    });
  });