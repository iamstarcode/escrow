export const generateRandomString = (lenth: number) => {
  const char = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const random = Array.from(
    { length: lenth },
    () => char[Math.floor(Math.random() * char.length)]
  );
  const randomString = random.join("");
  return randomString;
};
