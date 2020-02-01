import { Types } from '../../server/runtypes'
import { validateRequest } from "../../server/validate";
import { authenticate } from "../../server/authenticate";
import { Router } from "../../server/router";
import { PrismaClient } from '@prisma/client';
import { ServerError } from '../../server/errors';
import { ProjectModel } from '../../server/models/ProjectModel';

const db = new PrismaClient()
const router = Router.create()
const model = ProjectModel.create(db)

router.before(async () => { await db.connect() })
router.after(async () => { await db.disconnect() })

router.get(Types.Project.Response.Find, async (req, res) => {
  const { user } = await authenticate(req)
  const { params } = validateRequest(req, Types.Project.Request.Find)
  const project = await model.find(params.name, user)
  return res.status(200).json({ project })
})

router.delete(Types.Project.Response.Delete, async (req, res) => {
  const { user } = await authenticate(req)
  const { params } = validateRequest(req, Types.Project.Request.Delete)
  const wasDeleted = await model.delete(params.name, user)
  if (wasDeleted) {
    return res.status(204).json({})
  } else {
    return ServerError.NotFound.create(req).send(res)
  }
})

export default router.handler