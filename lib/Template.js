var test = {
  HTML: function (title, list, body, control,auth_UI=`<h2><a href="/auth/login">login</h2>`){ 
  var template = `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB2</a></h1>
    ${auth_UI}
    <h2><a href="/topic/page_create">create</a></h2>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
    return template;
  },
  List:function (filelist) {
    var list = "<ul>\n";
    for (var filenum in filelist) {
      list += `<li><a href="/topic/${filelist[filenum]}">${filelist[filenum]}</a></li>`
      list += "\n";
    }
    list += '</ul>';
    return list;
  }
}

module.exports=test