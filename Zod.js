const zod=require('zod');
 const schema=zod.object({
    email:zod.string().email(),

password: zod.string().min(8)});
 module.exports=schema;
