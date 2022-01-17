import { valid_commands } from "./validCommands";

const colors = {
  green: "#15e45d",
  chalk: "rgb(235, 235, 235)",
  red: "#ff5b5b",
};

export const getColourCommand = (command) => {
  // if command is already valid, return green
  if (valid_commands.includes(command)) {
    // return green var from terminal css
    return colors.green;
  }
  // if the command is prefix of some valid command, return white
  if (valid_commands.some((validCommand) => validCommand.startsWith(command))) {
    return colors.chalk;
  }
  // if command is invalid, return red
  return colors.red;
};

export const getOutputColor = (command) => {
  return valid_commands.includes(command) ? colors.chalk : colors.red;
};
