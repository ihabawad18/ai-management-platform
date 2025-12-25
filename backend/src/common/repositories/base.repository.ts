import { PrismaService } from "../../modules/prisma/prisma.service";

export abstract class BaseRepository<
  T,
  D extends {
    findMany: (args?: any) => Promise<T[]>;
    findUnique: (args: { where: any }) => Promise<T | null>;
    create: (args: { data: any }) => Promise<T>;
    update: (args: { where: any; data: any }) => Promise<T>;
    delete: (args: { where: any }) => Promise<T>;
    upsert?: (args: { where: any; update: any; create: any }) => Promise<T>;
    count?: (args?: any) => Promise<number>;
  },
> {
  constructor(protected readonly prisma: PrismaService) {}

  // Child classes must implement this getter
  protected abstract get model(): D;

  async create(data: Parameters<D["create"]>[0]["data"]): Promise<T> {
    return this.model.create({ data });
  }

  async findAllWithPagination(params?: {
    where?: Parameters<D["findMany"]>[0]["where"];
    orderBy?: Parameters<D["findMany"]>[0]["orderBy"];
    include?: Parameters<D["findMany"]>[0]["include"];
    page?: number;
    pageSize?: number;
  }) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.model.findMany({
        where: params?.where,
        orderBy: params?.orderBy,
        include: params?.include,
        skip,
        take: pageSize,
      }),
      this.model.count?.({ where: params?.where }) ?? Promise.resolve(0),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      meta: {
        total,
        totalPages,
        currentPage: page,
        pageSize,
      },
    };
  }

  async findAll(params?: {
    where?: Parameters<D["findMany"]>[0]["where"];
    orderBy?: Parameters<D["findMany"]>[0]["orderBy"];
    include?: Parameters<D["findMany"]>[0]["include"];
    skip?: number;
    take?: number;
  }): Promise<T[]> {
    return this.model.findMany({
      where: params?.where,
      orderBy: params?.orderBy,
      include: params?.include,
      skip: params?.skip,
      take: params?.take,
    });
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Parameters<D["update"]>[0]["data"]
  ): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } });
  }

  async updateOrCreate(where: object, data: Partial<T>): Promise<T> {
    if (!this.model.upsert) {
      throw new Error("Upsert not supported on this model");
    }

    return this.model.upsert({
      where,
      update: data,
      create: data,
    });
  }
}
