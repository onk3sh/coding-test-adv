import React from 'react';
import axios from 'axios';
import Loader from './Loader';

/**
 *
 * @typedef {Object} image
 * @property {number} category_id
 * @property {string} photo_url
 */

/**
 *
 * @param {Array.<number>} categories
 */
const getPhoto = async (categories) => {
  try {
    const photos = await axios.get('http://localhost:3000/animal/photos', {
      headers: {
        'x-categoryids': categories.join(',')
      }
    });

    return photos.data;
  } catch (error) {
    console.error(error); // Just console log the error
    return [];
  }
};

const renderPhoto = (photoUrl) => {
  if (photoUrl) {
    return <img className="img-thumb" alt="animal" src={photoUrl} />;
  } else {
    return <span title="No Photo">No Photo</span>;
  }
};

/**
 *
 * @param {Object} props
 * @param {Array.<number>} props.categories
 */
const Carousel = ({ categories }) => {
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [photoUrl, setPhotoUrl] = React.useState(null);

  const [photos, setPhotos] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setPhotoIndex(0); // Resets photoIndex when there is update in categories
    if (categories.length > 0) {
      setIsLoading(true);
      getPhoto(categories).then((photos) => {
        setPhotos(photos);
        setIsLoading(false);
      });
    } else {
      setPhotos([]);
    }
  }, [categories]);

  React.useEffect(() => {
    if (photos.length > 0) {
      setPhotoUrl(photos[photoIndex].photo_url);
    } else {
      setPhotoUrl(null);
    }
  }, [photoIndex, photos]);

  const handleLeftClick = () => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    }
  };

  const handleRightClick = () => {
    if (photoIndex < photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    }
  };

  return (
    <>
      {isLoading ? <Loader /> : ''}
      <div className="carousel">
        <i className="arrow left" title="left" onClick={handleLeftClick}></i>
        {renderPhoto(photoUrl)}
        <i className="arrow right" title="right" onClick={handleRightClick}></i>
      </div>
    </>
  );
};

export default Carousel;