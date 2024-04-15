const zod=require('zod');
 const schema=zod.object({
    email:zod.string().email(),

password: zod.string().min()});
 module.exports=schema;
