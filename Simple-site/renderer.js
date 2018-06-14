const fs = require("fs");

function mergeValues(values, content) {
  //Cycle over the keys
    //Replace all {{key}} with the value from the values object
    for(var key in values){
      content = content.replace("{{" + key + "}}", values[key]);
    }

    //return merged content
    return content;
}

function view(templateName, values, response) {
  //Read from the template file
    let fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: "utf8"});
    //Insert values in to the Content
    fileContents = mergeValues(values, fileContents);
    //Write out to the response
      response.write(fileContents);
}

module.exports.view = view;
