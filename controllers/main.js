import { getUsers } from '../service/user';
export const index = async (ctx, next) => {
  let data  = {
    users:getUsers()
  };
  console.log(111)
  console.log(data);
  await ctx.render('index.jade', data);
};
