var sanitize=require('sanitize-html');
var dirty=`스크립트는 과연
<script>some really dirty Html</script>
h1태그는 <h1>무시될까?</h1>
<a>허용해줘!</a>
`;
console.log(dirty);
console.log(sanitize(dirty,{allowedTags:['h1']}));