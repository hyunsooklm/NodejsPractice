var test = {
  HTML: function (title, list, body, control) {
    var template = `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB1</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
    return template;
  },
  List:function (result, resultlist) {
    var list = "<ul>\n";
    for (var title in result) {
      list += `<li><a href="/?id=${result[title].id}">${result[title].title}</a></li>`
      list += "\n";
      resultlist.push(""+result[title].id);    //문자열 indexof로 없는거 검사하니까..
    }
    list += '</ul>';
    return list;
  }
}

module.exports=test