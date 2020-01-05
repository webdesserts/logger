import { create } from '../createable'
import { Photon } from '@prisma/photon'

export class Model {
  static create = create
  constructor(protected db: Photon) {}
}