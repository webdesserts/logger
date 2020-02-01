import { create } from '../createable'
import { PrismaClient } from '@prisma/client'

export class Model {
  static create = create
  constructor(protected db: PrismaClient) {}
}