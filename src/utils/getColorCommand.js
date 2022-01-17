const validCommands = ["about", "clear", "help"];

const colors = {
  green: "#15e45d",
  chalk: "rgb(235, 235, 235)",
  red: "#ff5b5b",
};

export const getColourCommand = (command) => {
  // if command is already valid, return green
  if (validCommands.includes(command)) {
    // return green var from terminal css
    return colors.green;
  }
  // if the command is prefix of some valid command, return white
  if (validCommands.some((validCommand) => validCommand.startsWith(command))) {
    return colors.chalk;
  }
  // if command is invalid, return red
  return colors.red;
};
