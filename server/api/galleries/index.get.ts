import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 15;
  const skip = (page - 1) * limit;

  const [galleries, totalGalleries] = await Promise.all([
    prisma.galleries.findMany({
      skip: skip,
      take: limit,
    }),
    prisma.galleries.count(),
  ]);

  return {
    galleries,
    totalGalleries,
    totalPages: Math.ceil(totalGalleries / limit),
    currentPage: page,
  };
});
