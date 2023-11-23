interface IName {
  name: string;
}
export const validateCategoryName = ({ name }: IName) => {
  if (name.trim() === "") {
    return false;
  }
  if (/\d/.test(name)) {
    return false;
  }

  if (name.trim().length <= 2) {
    return false;
  }

  return true;
};
