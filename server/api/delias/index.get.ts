import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 15;
  const skip = (page - 1) * limit;

  const [delias, totalDelias] = await Promise.all([
    prisma.delias.findMany({
      skip: skip,
      take: limit,
    }),
    prisma.delias.count(),
  ]);

  return {
    delias,
    totalDelias,
    totalPages: Math.ceil(totalDelias / limit),
    currentPage: page,
  };
});
