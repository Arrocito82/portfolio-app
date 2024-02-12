import { Prisma } from '@prisma/client';
const errorHandler = (e, req, res) => {
  let id = 0;
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (req.params.id !== undefined) {
        id = req.params.id;
      } else {
        id = req.body.id;
      }
      if (e.code === 'P2002') {
        return res.json({ errors: [{id:`ID ${id} already exists`}] }
        );
      } else if (e.code === 'P2025') {
        return res.json({ errors: [{id:`ID ${id} not found`}] }
        );
      }else{
        return res.json({ errors: [{message:e.message}] , code: e.code});
      }
    }
    return res.json({ errors: [{message:e.message}]});
  }
  const exists = (id, items) => {
    const item = items.find((element) => element.id == id);
    // console.log(id);
    // console.log(item);
    return item != undefined;
  };
export {errorHandler, exists};