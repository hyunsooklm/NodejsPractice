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
    <h1><a href="/">WEB2</a></h1>
    <h2><a href="/create">create</a></h2>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
    return template;
  },
  List:function (filelist, filelists) {
    var list = "<ul>\n";
    for (var filenum in filelist) {
      list += `<li><a href="/?id=${filelist[filenum]}">${filelist[filenum]}</a></li>`
      list += "\n";
      filelists.push(filelist[filenum]);
    }
    list += '</ul>';
    return list;
  }
}

module.exports=test