"use strict";
/**
 * 自定义弹框函数
 * @param i 输入的参数
 * @returns {*}
 */
function myAlert(i){
    return i+1;
}
for(var i=0;i<10;i++){
//    console.log(i);
//    alert(i);
    myAlert(9);
    myAlert(9);
}
//这里是注释
/*debug start*/
console.log("finish");
/*debug end*/