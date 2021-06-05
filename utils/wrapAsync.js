module.exports=func=>{
    return (res,req,next)=>{
        func(res,req,next).catch(e=>{
            next(e);
        })
    }
}
//here func is arrow function synstical_sugar of traditional function 
/*
function fun1(a) { 
            function fun2(b) { 
                return a + b;
            }
            return fun2;
            }

            fun1->func;
            and fun2->second returned arrow function 
            a->async function that will be passed;->always return a promise opbejct;
            b=(req,req,next) parameters that can be accessed by any middleware or function used in get/post;
*/