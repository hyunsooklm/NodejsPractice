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
    <p><a href="/author">author</a></p>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
    return template;
  },
  List: function (result, resultlist) {
    var list = "<ul>\n";
    for (var title in result) {
      list += `<li><a href="/?id=${result[title].id}">${result[title].title}</a></li>`
      list += "\n";
      if (resultlist.find(x => x == result[title].id) === undefined) {//==과 ===의 차이 ==는 값만, ===는 자료형까지.
        resultlist.push("" + result[title].id);    //문자열 indexof로 없는거 검사하니까..
      }
    }//console.log(a.find(x=>x===11));
    list += '</ul>';
    return list;
  },
  NameOption: function (author, id) {
    var option = `<select name="author_id" id="author_name">`
    for (var index in author) {
      if (author[index].id == id) {
        option += `<option value=${author[index].id} selected>${author[index].name}</option>`
      }
      else {
        option += `<option value=${author[index].id}>${author[index].name}</option>`
      }
    }
    option += `</select>`
    return option;
  },

  Author_Template: function (author) {
    var temp = "";
    for (var i = 0; i < author.length; i++) {
      temp += `<tr>
                <td>${author[i].name}</td><td>${author[i].profile}</td><td><a href="/author_update?id=${author[i].id}">update</a></td>
                <td>
                <form action="/author_delete_process" method="post">
                <input type="hidden" name="author_id" value="${author[i].id}">
                <input type="submit" value="delete">
                </form>
                </td>
               </tr>
               `
    }
    temp += '</tbody>'
    var author_template =
      `<table>
                <thead>
                <tr>
                <td>name</td><td>profile</td><td>update</td><td>delete</td>
                </tr>
                </thead>
                  ${temp}
                </table>
                <style>
                table{
                  border-collapse:collapse;
                }
                td{
                  border:1px solid black
                }
                </style>
                `
    return author_template;
  }
}


module.exports = test