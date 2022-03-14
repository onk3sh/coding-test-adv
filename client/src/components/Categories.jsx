import React from 'react';
import axios from 'axios';

const getCategories = async () => {
  try {
    const categories = await axios.get('animal/categories');
    return categories.data;
  } catch (error) {
    console.error(error); //Console log the error and return empty array to not break render
    return [];
  }
};

/**
 *
 * @param {number} buttonIndex
 * @param {Array.<number>} activeCat
 * @param {string} buttonValue
 * @param {Function} handleCatClick - Button Click handler
 */
const renderButtons = (buttonIndex, activeCat, buttonValue, handleCatClick) => {
  let className;
  if (activeCat.includes(buttonIndex)) {
    className = 'active-button';
  } else {
    className = 'inactive-button';
  }

  return (
    <button
      title={buttonValue}
      key={buttonIndex}
      className={className}
      onClick={() => handleCatClick(buttonIndex)}
    >
      {buttonValue}
    </button>
  );
};

/**
 *
 * @param {Object} props
 * @param {Function} props.setActiveCat
 * @param {Array.<number>} props.activeCat
 */
const Categories = ({ setActiveCat, activeCat }) => {
  const [categories, setCategories] = React.useState([]);

  const handleCatClick = (buttonIndex) => {
    const newArray = [...activeCat];
    const indexOfActive = newArray.indexOf(buttonIndex);
    if (indexOfActive > -1) {
      newArray.splice(indexOfActive, 1);
    } else {
      newArray.push(buttonIndex);
    }
    setActiveCat(newArray);
  };

  React.useEffect(() => {
    (async () => {
      const result = await getCategories();
      setCategories(result);
    })();
  }, []);

  return (
    <div>
      {categories.map((category) => {
        return renderButtons(
          category.id,
          activeCat,
          category.category,
          handleCatClick
        );
      })}
    </div>
  );
};
export default Categories;