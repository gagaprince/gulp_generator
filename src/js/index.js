"use strict";
function myAlert(i){
    return i+1;
}
for(var i=0;i<10;i++){
    console.log(i);
    alert(i);
    myAlert(i);
}
//这里是注释
/*debug start*/
console.log("finish");
/*debug end*/