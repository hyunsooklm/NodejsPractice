const INF=210000;
const ver=6;


    var graph=[
        [0,5,4,0,0,0],
        [5,0,2,7,0,0],
        [4,2,0,6,11,0],
        [0,7,6,0,3,8],
        [0,0,11,3,0,8],
        [0,0,0,8,8,0],
    ]
    var distance=[];
    var sum=0;
    var selected={};
    selected[0]=0;
    distance[0]=0;
    for(var i=1;i<ver;i++){
        distance[i]=INF;
        for(var k in selected){
            var k=parseInt(k);
            if(selected.i==undefined&&0<graph[i][k]&&graph[i][k]<INF&&distance[i]>graph[i][k]){
                const r=i;
                distance[i]=graph[i][k];
                selected.r=i;
                sum+=distance[i];
            }
        }
    }
    console.log(sum);

