import { contextMenu } from "./background/contextMenu";

function execute() {
  contextMenu();

  // fetch(`http://localhost:9090/instance/get`)
  //   .then((res) => res.json())
  //     .then((res) => {
  //       console.log("res", res)
  //   });

  var searchWords = "Spain capital"
  fetch(`http://localhost:9090/instance/getFiltered?search=${searchWords}&limit=2`)
    .then((res) => res.json())
      .then((res) => {
        console.log("res", res)
    });

  setTimeout(execute, 1000 * 20);
}

execute();
