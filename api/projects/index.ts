import { Types } from '../../server/runtypes'
import { validateRequest } from "../../server/validate";
import { authenticate } from "../../server/authenticate";
import { Router } from "../../server/router";
import { PrismaClient } from '@prisma/client';
import { ProjectModel } from '../../server/models/ProjectModel';

const db = new PrismaClient()
const router = Router.create()
const model = ProjectModel.create(db)

router.before(async () => await db.connect())
router.after(async () => await db.disconnect())

router.get(Types.Project.Response.FindAll, async (req, res) => {
  const { user } = await authenticate(req)
  const projects = await model.findAll(user)
  return res.status(200).json({ projects })
})

router.post(Types.Project.Response.Create, async (req, res) => {
  const { user } = await authenticate(req)
  const { body } = validateRequest(req, Types.Project.Request.Create)
  const project = await model.find(body.name, user)
  if (project) {
    return res.status(200).json({ project })
  } else {
    const project = await model.create(body.name, user)
    return res.status(201).json({ project })
  }
})

export default router.handler