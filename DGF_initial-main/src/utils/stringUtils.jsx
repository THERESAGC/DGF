export const toPascalCase = (text) => {
    return text.replace(/\w+/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
  };

