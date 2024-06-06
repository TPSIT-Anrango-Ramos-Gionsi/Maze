window.onload=start;

var R=5,C=5;
var movimenti=[{move:"ArrowUp",cord:[-1,0]},
                {move:"ArrowLeft",cord:[0,-1]},
                {move:"ArrowDown",cord:[1,0]},
                {move:"ArrowRight",cord:[0,1]}
                ]

var stack=[[0,0]]
var packMan, coordinates=[];
function corrompiLabirinto(){
    diff=20/100
    for(let i=0;i<(R*C)*diff;i++){
        tdAttrs=document.querySelector(`table tr:nth-child(${Math.round(Math.random()*(R-1)+1)}) td:nth-child(${Math.round(Math.random()*(C-1)+1)})`).attributes
        console.log(tdAttrs)
        tdAttrs.removeNamedItem(tdAttrs[tdAttrs.length-1].name)
    }
}

function start(){
    document.onkeydown=controller;
    
    generaTable();
    generaLabirinto();
    // corrompiLabirinto();

    applicareStileLabirinto();

    packMan=document.createElement("img")
    packMan.src="https://www.bing.com/th/id/OGC.04bac8bcacad5360544fbf7592f3d62e?pid=1.7&rurl=https%3a%2f%2fwww.pixilart.com%2fimages%2fart%2fe1c701520b06f3f.gif&ehk=zd0fMFnwbLaxsoDLJA4m4pG9r%2f6wvDUZbChJJcfSyos%3d"
    
    // document.querySelector(`table tr:nth-child(1) td:nth-child(1)`).innerHTML=packMan.outerHTML;
//sostituire con questa soluzione nella versione finale
   document.querySelector(`table tr:nth-child(1) td:nth-child(1)`).appendChild(packMan);


    coordinates[0]=1
    coordinates[1]=1
    // document.querySelector(`table tr:nth-child(${R}) td:nth-child(${C})`).onchange=victory;    
    document.querySelector(`table tr:nth-child(${R}) td:nth-child(${C})`).style.backgroundColor="red";    
}
function victory(){
    document.onkeydown="";

    console.log("entrato")
    let main=document.querySelector("main");
     main.style.opacity="0.3"

    let article=document.createElement("article");
    article.innerHTML=`Vittoria <br><a href="index.html">clicca per rigiocare</a>`
    article.className="vittoria"
    article.style.backgroundColor="green"
    article.style.zIndex="1"

    document.querySelector("body").insertBefore(article,main)
    console.log(article.children)
    article.children[1].focus()
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
            //rimpiazzare coordinates con coordinateSprite (o simile)                   -->//same here
        if(coordinates[0]>1) if(document.querySelector(`table tr:nth-child(${coordinates[0]-1}) td:nth-child(${coordinates[1]})`).attributes["arrowup"]!=undefined)    coordinates[0]--;
       break;
       case "ArrowDown":
        if(coordinates[0]<R) if(document.querySelector(`table tr:nth-child(${coordinates[0]+1}) td:nth-child(${coordinates[1]})`).attributes["arrowdown"]!=undefined)    coordinates[0]++;
       break;
       case "ArrowRight":
        if(coordinates[1]<C) if(document.querySelector(`table tr:nth-child(${coordinates[0]}) td:nth-child(${coordinates[1]+1})`).attributes["arrowright"]!=undefined)    coordinates[1]++;
       break;
       case "ArrowLeft":
        if(coordinates[1]>1) if(document.querySelector(`table tr:nth-child(${coordinates[0]}) td:nth-child(${coordinates[1]-1})`).attributes["arrowleft"]!=undefined)    coordinates[1]--;
       break;
    }
    document.querySelector(`table tr:nth-child(${coordinates[0]}) td:nth-child(${coordinates[1]})`).appendChild(packMan);
    
    if(coordinates[0]==R&&coordinates[1]==C)    victory();
}

function generaLabirinto(){
    for(let i=0;i<R*C-1;i++){
        esploraCella()
    }   
    
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
