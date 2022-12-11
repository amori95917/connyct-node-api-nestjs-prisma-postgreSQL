export const generateSlug = () => {
  const result = Date.now().toString(36);
  return result.toLowerCase();
};
