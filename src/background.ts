import { contextMenu } from "./background/contextMenu";

function execute() {
  contextMenu();

  setTimeout(execute, 1000 * 20);
}

execute();
