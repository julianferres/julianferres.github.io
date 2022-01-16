const validCommands = ["about", "clear", "help"];

export const getColourCommand = (command) => {
  // if command is already valid, return green
  if (validCommands.includes(command)) {
    return "green";
  }
  // if the command is prefix of some valid command, return white
  if (validCommands.some((validCommand) => validCommand.startsWith(command))) {
    return "white";
  }
  // if command is invalid, return red
  return "red";
};
