window.onload=start;

var R=10,C=10;
var movimenti=[{move:"ArrowUp",cord:[-1,0]},
                {move:"ArrowLeft",cord:[0,-1]},
                {move:"ArrowDown",cord:[1,0]},
                {move:"ArrowRight",cord:[0,1]}
                ]

var stack=[[0,0]]

function start(){
    document.onkeydown=controller;
    generaTable();
    generaLabirinto();
    applicareStileLabirinto()
    }
function applicareStileLabirinto()
{
    for(let i=0;i<R;i++)
        for(let j=0;j<C;j++){
            td=document.querySelector(`table tr:nth-child(${i+1}) td:nth-child(${j+1})`)
            if(td.attributes["arrowleft"]) 
                td.style.borderRight="none"; 
            if(td.attributes["arrowup"]) 
                td.style.borderBottom="none"; 
            if(td.attributes["arrowdown"]) 
                td.style.borderTop="none"; 
            if(td.attributes["arrowright"]) 
                td.style.borderLeft="none"; 

        }

}
    
function generaTable(){
    let table="<table>"
    for(let i=0;i<R;i++){
        table+="<tr>"
        for(let j=0;j<C;j++)
        {
            table+="<td>"
            table+="</td>"
        }
        table+="</tr>"
    }
    document.querySelector("main").innerHTML+=table+"</table>"

}
function controller(event){

    switch(event.key){
       case "ArrowUp":
        // if(coordinates[0]>1&&matrice[coordinates[0]-1-1][coordinates[1]-1].wall==0)    coordinates[0]--;
       break;
       case "ArrowDown":
        // if(coordinates[0]<r&&matrice[coordinates[0]-1+1][coordinates[1]-1].wall==0)    coordinates[0]++;
       break;
       case "ArrowRight":
        // if(coordinates[1]<c&&matrice[coordinates[0]-1][coordinates[1]-1+1].wall==0)    coordinates[1]++;
       break;
       case "ArrowLeft":
        // if(coordinates[1]>1&&matrice[coordinates[0]-1][coordinates[1]-1-1].wall==0)    coordinates[1]--;
       break;
    }
    // document.querySelector(`table tr:nth-child(${coordinates[0]}) td:nth-child(${coordinates[1]})`).appendChild(packMan);
    
    // if(coordinates[0]==traguardo[0]&&coordinates[1]==traguardo[1]){
    //     alert("vinto")
    
    // } 
}

function generaLabirinto(){
    for(let i=0;i<R*C-1;i++){
        esploraCella()
    }
    // posizione sprite
    let x=stack[stack.length-1][0]
    let y=stack[stack.length-1][1]
    document.querySelector(`table tr:nth-child(${x+1}) td:nth-child(${y+1})`).style.backgroundColor="red"
    
    
}

function esploraCella(){
    let i=stack[stack.length-1][0]
    let j=stack[stack.length-1][1]

    disordinaMovimenti();

    let ms=-1;
    let accettabile=false;
    do{
        ms++;
        if(indexAccettabile(i,R,0)&&indexAccettabile(j,C,1))
            if(!nextBloccoLinkato()) accettabile=true;
    }while(ms<3&&!accettabile);

    if(accettabile){
        let reversKey,normalKey,arrow,arrowReverse;
        normalKey=movimenti[ms].move
        if(normalKey=="ArrowUp")        {arrow="↑" ;arrowReverse="↓" ;reversKey="ArrowDown"}
        else if(normalKey=="ArrowDown") {arrow="↓" ;arrowReverse="↑" ;reversKey="ArrowUp"}
        else if(normalKey=="ArrowLeft") {arrow="←" ;arrowReverse="→" ;reversKey="ArrowRight"}
        else if(normalKey=="ArrowRight"){arrow="→" ;arrowReverse="←" ;reversKey="ArrowLeft"}

    let td;        
    td=document.querySelector(`table tr:nth-child(${i+1}) td:nth-child(${j+1})`)
        td.setAttribute("linked","")
        td.setAttribute(reversKey,"")
        if(td.innerHTML=="") td.innerHTML=arrow
        i+=movimenti[ms].cord[0]
        j+=movimenti[ms].cord[1]
        
        td=document.querySelector(`table tr:nth-child(${i+1}) td:nth-child(${j+1})`)
        stack.push([i,j]);
        td.setAttribute("linked","")
        td.setAttribute(normalKey,"")

    }
    else{
        
        stack.pop();
        return esploraCella();
    }

    function indexAccettabile(index,limite,chi){
        let acpt=false;
        if(index+movimenti[ms].cord[chi]<limite&&index+movimenti[ms].cord[chi]>=0) acpt=true;
        return acpt;
    }
    
    function nextBloccoLinkato(){
        let linked=false;
        
        if(document.querySelector(`table tr:nth-child(${i+movimenti[ms].cord[0]+1}) td:nth-child(${j+movimenti[ms].cord[1]+1})`).attributes["linked"]) linked=true;   
        return linked
    }
}

function disordinaMovimenti(){
    for(let i=0;i<movimenti.length;i++){
        posRand=Math.floor(Math.random()*movimenti.length)

        aus=movimenti[i];
        movimenti[i]=movimenti[posRand]
        movimenti[posRand]=aus;
    }
};
